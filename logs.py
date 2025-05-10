# logs.py

CODIGOS_RESPUESTA = {
    "PF": "✅ Pedido Finalizado",
    "PR": "📥 Pedido Recibido",
    "EV": "❌ Error: Vaso no detectado",
    "ED": "❌ Error: Falla en dispensado",
    "EJ": "❌ Error: JSON inválido",
    "EC": "❌ Error: De conexión",
}

def respuesta(json_recibido):
    codigo = json_recibido.get("codigo", "")
    mensaje = CODIGOS_RESPUESTA.get(codigo, "❓ Código desconocido")

    es_error = codigo.startswith("E")  # Si empieza con E es un error
    return {
        "codigo": codigo,
        "mensaje": mensaje,
        "es_error": es_error
    }
