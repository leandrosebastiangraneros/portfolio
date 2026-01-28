from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import engine, SessionLocal, Base
import models
from pydantic import BaseModel
from typing import List, Optional
import hashlib
from datetime import datetime, timedelta

# Creo las tablas en la base de datos
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite Dev
        "http://localhost:5500",  # VS Code Live Server
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5500",
        "https://leandrosebastiangraneros.github.io", # GitHub Pages
        "https://nexus-hardware-api.onrender.com"     # Render Backend (self)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Defino los Modelos Pydantic para validación de datos
class Order(BaseModel):
    product_ids: List[int]

class UserLogin(BaseModel):
    username: str
    password: str

class ProductCreate(BaseModel):
    name: str
    category: str
    price: float
    stock: int
    image_url: str

class UserResponse(BaseModel):
    username: str
    class Config:
        from_attributes = True

# Dependencia para obtener la sesión de base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def hash_password(password: str):
    return hashlib.sha256(password.encode()).hexdigest()

def seed_data(db: Session):
    """Pueblo la base de datos con información inicial si está vacía o tras un reinicio."""
    # Verifico si existen productos, sino los creo
    if db.query(models.Product).count() == 0:
        products = [
            models.Product(name="RTX 4090", category="GPU", price=2850000.00, stock=10, image_url="https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800"),
            models.Product(name="Ryzen 7 7800X3D", category="CPU", price=620000.00, stock=20, image_url="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=800"),
            models.Product(name="Teclado Mecánico", category="PERIFERICOS", price=145000.00, stock=50, image_url="https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800"),
            models.Product(name="Mouse Gamer", category="PERIFERICOS", price=75000.00, stock=100, image_url="https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&q=80&w=800"),
            models.Product(name="32GB DDR5 RAM", category="RAM", price=180000.00, stock=30, image_url="https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=800"),
            models.Product(name="ASUS ROG Strix B650", category="MOTHERBOARD", price=350000.00, stock=15, image_url="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800"),
            models.Product(name="NZXT Kraken 240", category="REFRIGERACION", price=210000.00, stock=25, image_url="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=800"),
            models.Product(name="Samsung 990 Pro 2TB", category="ALMACENAMIENTO", price=240000.00, stock=40, image_url="https://images.unsplash.com/photo-1597872250969-bc5a2a458311?auto=format&fit=crop&q=80&w=800"),
            models.Product(name="Corsair RM850x", category="FUENTE", price=195000.00, stock=20, image_url="https://plus.unsplash.com/premium_photo-1682126104327-b7d620587d60?auto=format&fit=crop&q=80&w=800"),
            models.Product(name="Lian Li O11 Dynamic", category="GABINETE", price=220000.00, stock=10, image_url="https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&q=80&w=800"),
            models.Product(name="LG Ultragear 27GB", category="MONITOR", price=550000.00, stock=15, image_url="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800"),
        ]
        db.add_all(products)
        db.commit()
    
    # Verifico si existe el admin, sino lo creo
    if db.query(models.User).count() == 0:
        admin_user = models.User(
            username="admin",
            hashed_password=hash_password("admin123")
        )
        db.add(admin_user)
        db.commit()
        print("Default admin user created: admin / admin123")

@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()

@app.post("/system/reset")
def reset_system(db: Session = Depends(get_db)):
    """Elimino todos los datos y repueblo la base de datos."""
    try:
        # Elimino usando la API de query
        db.query(models.Sale).delete()
        db.query(models.Product).delete()
        db.query(models.User).delete()
        db.commit()
        
        # Vuelvo a poblar los datos iniciales
        seed_data(db)
        return {"message": "System reset complete. Data restored to factory defaults."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    if hash_password(user.password) != db_user.hashed_password:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    return {"message": "Login successful", "username": db_user.username}

@app.post("/products")
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.get("/products")
def read_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()

import uuid

@app.post("/checkout")
def checkout(order: Order, db: Session = Depends(get_db)):
    transaction_id = str(uuid.uuid4())[:8] # Genero un UUID corto para mostrarlo más simple
    
    for pid in order.product_ids:
        product = db.query(models.Product).filter(models.Product.id == pid).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {pid} not found")
        if product.stock <= 0:
            raise HTTPException(status_code=400, detail=f"Product {product.name} is out of stock")
        
        product.stock -= 1
        
        # Registro la venta con el ID de transacción
        sale = models.Sale(
            transaction_id=transaction_id,
            product_name=product.name, 
            sale_price=product.price
        )
        db.add(sale)
    
    db.commit()
    return {"status": "Compra realizada", "message": "Stock updated and sales recorded", "transaction_id": transaction_id}

@app.get("/dashboard-stats")
def dashboard_stats(db: Session = Depends(get_db)):
    now = datetime.now()
    seven_days_ago = now - timedelta(days=7)
    thirty_days_ago = now - timedelta(days=30)

    # Estadísticas Totales
    total_revenue = db.query(func.sum(models.Sale.sale_price)).scalar() or 0.0
    sales_count = db.query(models.Sale).count()
    
    # Estadísticas de 7 Días
    revenue_7d = db.query(func.sum(models.Sale.sale_price)).filter(models.Sale.timestamp >= seven_days_ago).scalar() or 0.0
    sales_7d = db.query(models.Sale).filter(models.Sale.timestamp >= seven_days_ago).count()

    # Estadísticas de 30 Días
    revenue_30d = db.query(func.sum(models.Sale.sale_price)).filter(models.Sale.timestamp >= thirty_days_ago).scalar() or 0.0
    sales_30d = db.query(models.Sale).filter(models.Sale.timestamp >= thirty_days_ago).count()
    
    # Transacciones Recientes (Agrupadas)
    # Obtengo IDs de transacción distintos primero, ordenados por fecha más reciente
    recent_tx_ids = db.query(models.Sale.transaction_id, func.max(models.Sale.timestamp).label('latest'))\
        .group_by(models.Sale.transaction_id)\
        .order_by(func.max(models.Sale.timestamp).desc())\
        .limit(10).all()
        
    recent_transactions = []
    for tx_id, timestamp in recent_tx_ids:
        # Obtengo todos los items para esta transacción
        items = db.query(models.Sale).filter(models.Sale.transaction_id == tx_id).all()
        total_value = sum(item.sale_price for item in items)
        product_names = [item.product_name for item in items]
        
        recent_transactions.append({
            "transaction_id": tx_id,
            "total_value": total_value,
            "timestamp": timestamp,
            "products": product_names,
            "items_count": len(items)
        })
    
    return {
        "total_revenue": total_revenue,
        "sales_count": sales_count,
        "revenue_7d": revenue_7d,
        "sales_7d": sales_7d,
        "revenue_30d": revenue_30d,
        "sales_30d": sales_30d,
        "recent_transactions": recent_transactions
    }

# --- INTEGRACIÓN C ---
# --- MOCK DE INTEGRACIÓN C (NO SE ENCONTRÓ COMPILADOR) ---
# En un entorno de producción, aquí cargaría el DLL compilado.
# Como no hay GCC en este entorno Windows, uso una simulación de alta fidelidad.

def simular_motor_c(ventas_mes, tiempo_entrega, stock_actual):
    # Lógica que replica el comportamiento de C:
    # Si stock_actual < (ventas_mes / 30 * tiempo_entrega) + StockSeguridad, sugiero compra
    venta_diaria = ventas_mes / 30
    stock_seguridad = venta_diaria * 3 # Defino 3 días de seguridad
    necesidad_total = (venta_diaria * tiempo_entrega) + stock_seguridad
    
    if stock_actual < necesidad_total:
        return int(necesidad_total - stock_actual)
    return 0

motor_c = "SIMULATION_MODE" # Bandera para indicar que está activo el modo simulación

@app.get("/optimization")
def get_optimization(db: Session = Depends(get_db)):
    products = db.query(models.Product).all()
    results = []
    
    for prod in products:
        # Simulo datos que aún no están en el modelo Product para esta demo
        # En el futuro agregaré columnas reales a la tabla
        ventas_mes = 30 # Promedio ficticio
        tiempo_entrega = 7 # Días ficticios
        
        # Mejoro la lógica si el nombre sugiere alta rotación
        if "RTX" in prod.name or "Mouse" in prod.name:
            ventas_mes = 120
            tiempo_entrega = 14
            
        sugerencia = simular_motor_c(ventas_mes, tiempo_entrega, int(prod.stock))

            
        results.append({
            "id": prod.id,
            "name": prod.name,
            "stock": prod.stock,
            "sales_avg": ventas_mes,
            "lead_time": tiempo_entrega,
            "restock_suggestion": sugerencia,
            "status": "CRITICAL" if sugerencia > 0 else "OK"
        })
        
    return results
