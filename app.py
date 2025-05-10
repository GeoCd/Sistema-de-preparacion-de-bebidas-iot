from flask import Flask, request, jsonify, render_template
import serial, json, time, threading
from datetime import datetime
from queue import Queue
from recetas import RECETAS
from database import crear_tabla,guardar_pedido
from logs import respuesta

app = Flask(__name__)

crear_tabla()
#----- Cola de pedidos -----//
cola_pedidos = Queue()

#----- Conexión al Arduino -----//
def conectar_serial():
    try:
        ser = serial.Serial('COM5', 9600, timeout=1)
        time.sleep(2)  #----- Esperar que Arduino reinicie -----//
        print("✅ Puerto serial conectado: COM5")
        return ser
    except serial.SerialException as e:
        print("⚠️ Error al abrir puerto COM5:", e)
        return None
# with conectar_serial() as arduino: (si causa errores usar este)
arduino = conectar_serial()

#----- Función para enviar y recibir datos del Arduino -----//
def enviar_a_arduino(paquete):
    global arduino
    try:
        if arduino is None or not arduino.is_open:
            print("🔁 Reintentando conexión con COM5...")
            arduino = conectar_serial()

        if arduino and arduino.is_open:
            arduino.write((json.dumps(paquete) + '\n').encode('utf-8'))
            print("📤 Paquete enviado al Arduino:", json.dumps(paquete, ensure_ascii=False))

            respuesta = arduino.readline().decode('utf-8').strip()
            if respuesta:
                print("📥 Respuesta Arduino:", respuesta)
            else:
                print("⚠️ No se recibió respuesta del Arduino")
        else:
            print("🚫 No se pudo establecer conexión con el Arduino.")

    except Exception as e:
        print("❌ Error en la comunicación serial:", e)

#----- Hilo de procesamiento de pedidos -----//
def procesar_pedidos():
    while True:
        if not cola_pedidos.empty():
            pedido = cola_pedidos.get()
            print(f"🔄 Procesando pedido: {pedido['Nombre']}")

            enviar_a_arduino(pedido)
            cola_pedidos.task_done()
        time.sleep(1)

hilo_procesador = threading.Thread(target=procesar_pedidos, daemon=True)
hilo_procesador.start()

#----- Rutas principales -----//
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/info')
def info():
    return render_template('info.html')

#----- Guardar y encolar pedidos -----//
@app.route('/api/guardar_pedido', methods=['POST'])
def guardar_pedido_endpoint():
    try:
        data = request.get_json()
        timestamp = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
        data["Hora"] = timestamp
        print("📥 Pedido recibido:\n", json.dumps(data, indent=2, ensure_ascii=False))

        for item in data["items"]:
            nombre = item["nombre"].upper()
            cantidad = item["cantidad"]
            precio = item.get("precio", 0.0)  # <-- Asegúrate que el frontend mande "precio"

            if nombre not in RECETAS:
                print(f"⚠️ Receta no encontrada: {nombre}")
                continue

            receta = RECETAS[nombre]
            ingredientes_json = [{"Nombre": ing["Nombre"], "Cantidad_ml": ing["Cantidad_ml"]} for ing in receta]
            nombres_ingredientes = ", ".join([i["Nombre"] for i in ingredientes_json])

            paquete = {
                "Nombre": nombre,
                "Cantidad": cantidad,
                "Receta": {"Ingredientes": ingredientes_json}
            }

            cola_pedidos.put(paquete)
            print(f"🧾 Pedido encolado: {nombre} x{cantidad}")

            #----- Guardar en base de datos con nuevo formato -----//
            guardar_pedido(timestamp, nombre, precio, cantidad, nombres_ingredientes)

        #----- (Opcional) Guardar también en archivo -----//
        with open("pedidos_locales.txt", "a", encoding="utf-8") as f:
            f.write(json.dumps(data, ensure_ascii=False) + '\n')
            print("🗂️ Pedido guardado localmente.")

        return jsonify({"status": "success", "message": "Pedido encolado correctamente."}), 200

    except Exception as e:
        print("❌ Error al procesar el pedido:", e)
        return jsonify({"status": "error", "message": str(e)}), 400

@app.route('/api/ver_cola')
def ver_cola():
    cola_lista = list(cola_pedidos.queue)
    return jsonify(cola_lista)

@app.route('/api/prueba')
def prueba():
    return render_template('pruebas.html')


#----- Ejecutar servidor -----//
if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)