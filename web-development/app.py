from flask import Flask, request, jsonify, render_template
from flask_socketio import SocketIO, emit
import serial.tools.list_ports
import serial, json, time, threading
from datetime import datetime
from queue import Queue
from recetas import RECETAS
from database import crear_tabla, guardar_pedido
from database import obtener_bebidas_mas_pedidas

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

crear_tabla()

cola_pedidos = Queue()
pedido_en_proceso = None
arduino = None

# Buscar puerto automáticamente
def conectar_serial():
    try:
        puertos_disponibles = list(serial.tools.list_ports.comports())
        print("Buscando puertos")
        for puerto in puertos_disponibles:
            nombre_puerto = puerto.device
            descripcion = puerto.description.lower()
            if "arduino" in descripcion or "usb" in descripcion or "ch340" in descripcion or "ttyACM" in nombre_puerto or "ttyUSB" in nombre_puerto:
                try:
                    ser = serial.Serial(nombre_puerto, 9600, timeout=1)
                    time.sleep(2)
                    print(f"Puerto serial conectado: {nombre_puerto}")
                    return ser
                except serial.SerialException as e:
                    print(f"No se pudo abrir el puerto {nombre_puerto}: {e}")
        print("No se encontró un Arduino conectado.")
        return None
    except Exception as e:
        print("Error al buscar puertos seriales:", e)
        return None

arduino = conectar_serial()

def finalizar_pedido_actual():
    global pedido_en_proceso
    if pedido_en_proceso:
        print("Pedido finalizado:", pedido_en_proceso.get("Nombre"))
        pedido_en_proceso = None
        cola_pedidos.task_done()

def procesar_pedidos():
    global pedido_en_proceso
    while True:
        if not pedido_en_proceso and not cola_pedidos.empty():
            pedido_en_proceso = cola_pedidos.get()
            print("Pedido listo para enviar cuando Arduino lo permita:", pedido_en_proceso.get("Nombre"))
        time.sleep(0.2)

def escuchar_confirmacion():
    global arduino, pedido_en_proceso
    while True:
        if pedido_en_proceso and arduino and arduino.is_open:
            try:
                arduino.write((json.dumps(pedido_en_proceso) + '\n').encode('utf-8'))
                print("Pedido enviado al Arduino:", pedido_en_proceso.get("Nombre"))
                time.sleep(0.2)
            except Exception as e:
                print("Error enviando al Arduino:", e)

            while True:
                try:
                    lineas = arduino.readline()
                    linea = lineas.decode('utf-8', errors='replace').strip()
                    print('Recibiendo:', repr(linea))
                    
                    if not linea:
                        continue
                    
                    # Validación de estructura JSON mínima
                    if not linea.startswith('{') or not linea.endswith('}'):
                        print("Línea descartada (estructura inválida):", repr(linea))
                        continue

                    try:
                        data = json.loads(linea)

                        if "ok" in data:
                            if data["ok"] is True:
                                print("Confirmación Arduino: OK recibido")
                                finalizar_pedido_actual()
                                break
                            else:
                                print("Pedido rechazado por Arduino:", data.get("error", "Motivo desconocido"))
                                finalizar_pedido_actual()
                                break

                    except json.JSONDecodeError:
                        print("JSON inválido recibido:", repr(linea))

                except Exception as e:
                    print("Error leyendo del Arduino:", e)
                    break
        time.sleep(0.2)
                    

def sensor_background_thread():
    global arduino, pedido_en_proceso
    while True:
        if pedido_en_proceso:
            time.sleep(3) 
            continue

        try:
            if arduino is None or not arduino.is_open:
                arduino = conectar_serial()
            if arduino and arduino.is_open:
                print("Consultando estado (WebSocket)")
                arduino.write(b'ESTADO\n')
                time.sleep(0.2)
                linea = arduino.readline().decode().strip()
                try:
                    if linea:
                        data = json.loads(linea)
                        print("Estado sensores:", data)
                        socketio.emit('arduino_data', data)
                except json.JSONDecodeError:
                    print("JSON inválido recibido (sensor):", linea)
        except Exception as e:
            print("Error en hilo de sensores:", e)
        time.sleep(3)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/info')
def info():
    return render_template('info.html')

@app.route('/api/guardar_pedido', methods=['POST'])
def guardar_pedido_endpoint():
    try:
        data = request.get_json()
        timestamp = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
        data["Hora"] = timestamp
        print("Pedido recibido:\n", json.dumps(data, indent=2, ensure_ascii=False))
        mesa = data.get("mesa", "N/A")
        for item in data["items"]:
            nombre = item["nombre"].upper()
            cantidad = item["cantidad"]
            precio = item.get("precio", 0.0)
            if nombre not in RECETAS:
                print(f"Receta no encontrada: {nombre}")
                continue
            receta = RECETAS[nombre]
            ingredientes_json = [{"Nombre": ing["Nombre"], "Cantidad_ml": ing["Cantidad_ml"]} for ing in receta]
            nombres_ingredientes = ", ".join([i["Nombre"] for i in ingredientes_json])
            paquete = { "Nombre": nombre, "Cantidad": cantidad }
            cola_pedidos.put(paquete)
            print(f"Pedido encolado: {nombre} x{cantidad}")
            guardar_pedido(timestamp, nombre, precio, cantidad, nombres_ingredientes, mesa)

        with open("pedidos_locales.txt", "a", encoding="utf-8") as f:
            f.write(json.dumps(data, ensure_ascii=False) + '\n')
            print("Pedido guardado localmente.")
        return jsonify({"status": "success", "message": "Pedido encolado correctamente."}), 200
    except Exception as e:
        print("Error al procesar el pedido:", e)
        return jsonify({"status": "error", "message": str(e)}), 400

@app.route('/api/ver_cola')
def ver_cola():
    return jsonify(list(cola_pedidos.queue))

@app.route('/api/pedido_actual', methods=['GET'])
def pedido_actual():
    global pedido_en_proceso
    if pedido_en_proceso:
        tiempo_por_ingrediente = 5
        cantidad = pedido_en_proceso.get("Cantidad", 1)
        tiempo_estimado = cantidad * tiempo_por_ingrediente
        return jsonify({
            "Nombre": pedido_en_proceso["Nombre"],
            "Cantidad": cantidad,
            "TiempoEstimado": tiempo_estimado
        })
    else:
        return jsonify({"status": "sin_pedido"}), 404

@app.route('/grafica-bebidas')
def grafica_bebidas():
    resultados = obtener_bebidas_mas_pedidas()
    formatted_data = [{"bebida": fila[0], "total": fila[1]} for fila in resultados]
    return jsonify(formatted_data)

@app.route('/api/tiempo_espera', methods=['GET'])
def tiempo_espera():
    tiempo_total = 0
    tiempo_por_ingrediente = 5
    for pedido in list(cola_pedidos.queue):
        cantidad = pedido.get("Cantidad", 1)
        tiempo_total += cantidad * tiempo_por_ingrediente
    minutos = tiempo_total // 60
    segundos = tiempo_total % 60
    return jsonify({"tiempo_segundos": tiempo_total, "formato": f"{minutos}:{segundos:02d}"})

if __name__ == '__main__':
    sensor_thread = threading.Thread(target=sensor_background_thread, daemon=True)
    sensor_thread.start()
    cola_thread = threading.Thread(target=procesar_pedidos, daemon=True)
    cola_thread.start()
    confirmacion_thread = threading.Thread(target=escuchar_confirmacion, daemon=True)
    confirmacion_thread.start()
    socketio.run(app, host='0.0.0.0', port=8080)
