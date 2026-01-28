import ctypes
import sqlite3
import os
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Permite que tu web hable con este servidor

# --- A. CARGAR EL MOTOR DE C ---
# Detectamos si estamos en Windows o Linux/Mac para cargar el archivo correcto
# Ajustamos la ruta para buscar en la carpeta c_logic
base_dir = os.path.dirname(os.path.abspath(__file__))
dll_path = os.path.join(base_dir, 'c_logic', 'logica_stock.dll') if os.name == 'nt' else './c_logic/logica_stock.so'

motor_c = None
try:
    if os.path.exists(dll_path):
        # Ctypes es el puente: permite a Python usar funciones compiladas en C
        motor_c = ctypes.CDLL(dll_path)
        
        # Definimos qué tipo de datos devuelve la función C (int)
        # y qué tipos de argumentos espera (int, int, int)
        motor_c.calcular_necesidad_compra.argtypes = [ctypes.c_int, ctypes.c_int, ctypes.c_int]
        motor_c.calcular_necesidad_compra.restype = ctypes.c_int
        
        print(f"✅ Motor C cargado correctamente: {dll_path}")
    else:
         print(f"⚠️  No se encontró la librería C en: {dll_path}. Funcionando en modo degradado (sin optimización C).")

except Exception as e:
    print(f"❌ Error cargando la librería C: {e}")

# --- B. CONEXIÓN A SQL ---
def obtener_productos():
    db_path = os.path.join(base_dir, 'inventario.db')
    conn = sqlite3.connect(db_path) 
    conn.row_factory = sqlite3.Row # Para poder acceder a las columnas por nombre
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM productos")
    filas = cursor.fetchall()
    conn.close()
    return filas

# --- C. EL ENDPOINT (Lo que llamará tu web) ---
@app.route('/api/optimizador', methods=['GET'])
def optimizar_stock():
    try:
        productos = obtener_productos()
        resultado = []

        for prod in productos:
            # Extraemos datos de SQL
            ventas_mes = prod['ventas_mensuales_promedio']
            tiempo_entrega = prod['tiempo_entrega_dias']
            stock_actual = prod['stock_actual']

            # LLAMADA MAGICA A C:
            sugerencia_compra = 0
            if motor_c:
                 # Aquí Python le pasa el trabajo pesado a C
                sugerencia_compra = motor_c.calcular_necesidad_compra(ventas_mes, tiempo_entrega, stock_actual)
            else:
                # Fallback simple si no hay C (simplemente para que no rompa)
                venta_diaria = ventas_mes / 30.0
                if stock_actual < (venta_diaria * tiempo_entrega):
                     sugerencia_compra = 10 # Valor dummy

            # Preparamos el objeto para enviar al frontend
            item = {
                "id": prod['id'],
                "nombre": prod['nombre'],
                "stock_actual": stock_actual,
                "sugerencia_compra": sugerencia_compra, # Este dato vino de C
                "estado": "⚠️ RESTOCK URGENTE" if sugerencia_compra > 0 else "✅ Stock Saludable"
            }
            resultado.append(item)

        return jsonify(resultado)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Ejecutamos el servidor en el puerto 5000
    print("🚀 Servidor corriendo en http://localhost:5000")
    app.run(debug=True)
