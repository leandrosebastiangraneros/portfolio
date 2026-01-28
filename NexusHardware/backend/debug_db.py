from sqlalchemy import create_engine, text
import sys

# Conectar específicamente a nexus_v3.db
engine = create_engine("sqlite:///./nexus_v3.db")

try:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT id, name, category, stock FROM products"))
        print("\n--- PRODUCTOS EN NEXUS_V3.DB ---")
        rows = result.fetchall()
        for row in rows:
            print(f"ID: {row[0]} | Name: {row[1]} | Cat: {row[2]} | Stock: {row[3]}")
        print(f"Total encontrados: {len(rows)}")
except Exception as e:
    print(f"Error leyendo la DB: {e}")
