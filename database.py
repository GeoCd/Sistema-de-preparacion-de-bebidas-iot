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
        ingredientes TEXT
    )
    """)

    conn.commit()
    conn.close()

def guardar_pedido(fecha, bebida, precio, cantidad, ingredientes):
    conn = sqlite3.connect("pedidos.db")
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO pedidos (fecha, bebida, precio, cantidad, ingredientes)
        VALUES (?, ?, ?, ?, ?)
    """, (fecha, bebida, precio, cantidad, ingredientes))

    conn.commit()
    conn.close()
