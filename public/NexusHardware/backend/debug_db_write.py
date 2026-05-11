from sqlalchemy import create_engine, text
import sys

engine = create_engine("sqlite:///./nexus_v3.db")

try:
    with engine.connect() as connection:
        # Intentar insertar
        print("Intentando insertar producto de prueba...")
        connection.execute(text("INSERT INTO products (name, category, price, stock, image_url) VALUES ('TEST_DIRECTO', 'TEST', 100, 10, 'none')"))
        connection.commit()
        print("Inserción exitosa.")
        
        # Leer para confirmar
        result = connection.execute(text("SELECT id, name FROM products ORDER BY id DESC LIMIT 3"))
        print("\n--- ULTIMOS 3 PRODUCTOS ---")
        for row in result:
            print(f"ID: {row[0]} | Name: {row[1]}")
            
except Exception as e:
    print(f"ERROR CRÍTICO: {e}")
