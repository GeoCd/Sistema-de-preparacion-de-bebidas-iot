import sqlite3

def crear_tabla():
    conn = sqlite3.connect("pedidos.db")
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS pedidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fecha TEXT,
        bebida TEXT,
        precio REAL,
        cantidad INTEGER,
        ingredientes TEXT,
        mesa TEXT
    )
    """)

    conn.commit()
    conn.close()

def guardar_pedido(fecha, bebida, precio, cantidad, ingredientes, mesa):
    conn = sqlite3.connect("pedidos.db")
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO pedidos (fecha, bebida, precio, cantidad, ingredientes, mesa)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (fecha, bebida, precio, cantidad, ingredientes, mesa))

    conn.commit()
    conn.close()

def obtener_bebidas_mas_pedidas():
    conn = sqlite3.connect("pedidos.db")
    cursor = conn.cursor()

    cursor.execute("""
        SELECT bebida, SUM(cantidad) as total
        FROM pedidos
        GROUP BY bebida
        ORDER BY total DESC
    """)

    resultados = cursor.fetchall()
    conn.close()
    return resultados
