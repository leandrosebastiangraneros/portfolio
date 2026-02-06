from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import List, Optional
import hashlib
from datetime import datetime, timedelta
import ctypes
import os
import sys
import uuid

# Módulos internos que yo desarrollé
from database import engine, SessionLocal, Base
import models

# --- CONFIGURACIÓN DE BASE DE DATOS ---
# Inicializo las tablas si no existen.
# En un entorno de producción real, yo usaría Alembic para las migraciones,
# pero aquí mantengo la simplicidad para el despliegue rápido.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Nexus Hardware API",
    description="API robusta para la gestión de inventario, ventas y optimización de stock.",
    version="2.4.0"
)

# --- SEGURIDAD Y CORS ---
# Configuré CORS para permitir que mis frontends (local y producción) se comuniquen con este backend.
# En un entorno bancario cerraría más esto, pero para este portfolio, permito la flexibilidad necesaria.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5500",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5500",
        "https://leandrosebastiangraneros.github.io",
        "https://nexus-hardware-api.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODELOS DE DATOS (DTOs) ---
# Definí estos esquemas Pydantic para asegurar que la entrada de datos sea válida antes de procesarla.

class Order(BaseModel):
    product_ids: List[int]
    purchase_type: str = "INDIVIDUAL"

class UserLogin(BaseModel):
    username: str
    password: str

class ProductCreate(BaseModel):
    name: str
    category: str
    price: float
    stock: int
    image_url: str
    lead_time_days: int = 7
    monthly_sales_avg: int = 20

class UserResponse(BaseModel):
    username: str
    class Config:
        from_attributes = True

# --- INYECCIÓN DE DEPENDENCIAS ---
# Creé esta función para gestionar el ciclo de vida de la conexión a la DB de forma segura.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- MOTOR DE OPTIMIZACIÓN (C++ / PYTHON) ---
# Implementé un sistema híbrido: intento cargar una DLL de C de alto rendimiento.
# Si falla (por arquitectura OS), el sistema hace fallback automático a mi lógica en Python.

base_dir = os.path.dirname(os.path.abspath(__file__))
# Determino la ruta de la librería dinámica según el sistema operativo
if os.name == 'nt':
    dll_path = os.path.join(base_dir, 'c_logic', 'logica_stock.dll')
else:
    dll_path = os.path.join(base_dir, 'c_logic', 'logica_stock.so')

motor_c = None

# Esta es mi implementación de respaldo en Python puro.
# Replica exactamente la lógica matemática de la versión en C para garantizar consistencia.
def python_optimize_stock(ventas_mes: int, tiempo_entrega: int, stock_actual: int) -> int:
    # 1. Calculo venta diaria promedio
    venta_diaria = ventas_mes / 30.0
    
    # 2. Establezco un Stock de Seguridad (20% de colchón)
    stock_seguridad = int(ventas_mes * 0.20)
    
    # 3. Determino el Punto de Reorden
    punto_reorden = int(venta_diaria * tiempo_entrega) + stock_seguridad
    
    # Lógica de decisión de compra
    if stock_actual <= punto_reorden:
        cantidad_a_pedir = (ventas_mes + stock_seguridad) - stock_actual
        return max(cantidad_a_pedir, 0)
    
    return 0

# Intento cargar el motor C
try:
    if os.path.exists(dll_path):
        motor_c = ctypes.CDLL(dll_path)
        # Defino la firma de la función C: int calcular_necesidad_compra(int, int, int)
        motor_c.calcular_necesidad_compra.argtypes = [ctypes.c_int, ctypes.c_int, ctypes.c_int]
        motor_c.calcular_necesidad_compra.restype = ctypes.c_int
        print(f"✅ [Sistema] Motor de Optimización C cargado desde: {dll_path}")
    else:
        print(f"⚠️ [Sistema] Librería C no encontrada en {dll_path}. Activando motor Python de respaldo.")
except OSError as e:
    # Este error es común en desarrollo Windows vs Linux cruzado (32 vs 64 bits)
    if hasattr(e, 'winerror') and e.winerror == 193:
        print(f"⚠️ [Advertencia] Discrepancia de arquitectura CPU (DLL 32-bit vs Python 64-bit).")
        print(f"   -> El sistema continuará operando usando el motor nativo Python.")
    else:
        print(f"❌ [Error] Fallo al cargar módulo C: {e}")
except Exception as e:
    print(f"❌ [Error Crítico] Excepción inesperada en carga de módulos: {e}")

# --- UTILIDADES DE SEGURIDAD ---
def hash_password(password: str):
    # Utilizo SHA256 para el hash.
    # Nota de auditoría: Para estándares bancarios usaría Bcrypt con salt,
    # pero para este entorno controlado, SHA256 es suficiente y rápido.
    return hashlib.sha256(password.encode()).hexdigest()

def seed_data(db: Session):
    """
    Función de inicialización que diseñé para poblar la DB automáticamente
    si detecto que está vacía. Facilita el despliegue inmediato.
    """
    try:
        # Si no hay productos, inyecto el catálogo inicial
        if db.query(models.Product).count() == 0:
            products = [
                models.Product(name="RTX 4090", category="GPU", price=2850000.00, stock=10, image_url="https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800", monthly_sales_avg=15, lead_time_days=15),
                models.Product(name="Ryzen 7 7800X3D", category="CPU", price=620000.00, stock=20, image_url="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=800", monthly_sales_avg=45, lead_time_days=7),
                models.Product(name="Teclado Mecánico", category="PERIFERICOS", price=145000.00, stock=50, image_url="https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800", monthly_sales_avg=100, lead_time_days=5),
                models.Product(name="Mouse Gamer", category="PERIFERICOS", price=75000.00, stock=100, image_url="https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&q=80&w=800", monthly_sales_avg=150, lead_time_days=3),
                models.Product(name="32GB DDR5 RAM", category="RAM", price=180000.00, stock=30, image_url="https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=800", monthly_sales_avg=40, lead_time_days=6),
                models.Product(name="ASUS ROG Strix B650", category="MOTHERBOARD", price=350000.00, stock=15, image_url="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800", monthly_sales_avg=20, lead_time_days=10),
                models.Product(name="NZXT Kraken 240", category="REFRIGERACION", price=210000.00, stock=25, image_url="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=800", monthly_sales_avg=25, lead_time_days=8),
                models.Product(name="Samsung 990 Pro 2TB", category="ALMACENAMIENTO", price=240000.00, stock=40, image_url="https://images.unsplash.com/photo-1597872250969-bc5a2a458311?auto=format&fit=crop&q=80&w=800", monthly_sales_avg=60, lead_time_days=4),
                models.Product(name="Corsair RM850x", category="FUENTE", price=195000.00, stock=2, image_url="https://plus.unsplash.com/premium_photo-1682126104327-b7d620587d60?auto=format&fit=crop&q=80&w=800", monthly_sales_avg=30, lead_time_days=9),
                models.Product(name="Lian Li O11 Dynamic", category="GABINETE", price=220000.00, stock=10, image_url="https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&q=80&w=800", monthly_sales_avg=15, lead_time_days=10),
                models.Product(name="LG Ultragear 27GB", category="MONITOR", price=550000.00, stock=15, image_url="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800", monthly_sales_avg=10, lead_time_days=12),
            ]
            db.add_all(products)
            db.commit()
    except Exception as e:
        print(f"Error seeding products: {e}")
    
    # Creo el usuario administrador por defecto si no existe
    if db.query(models.User).count() == 0:
        admin_user = models.User(
            username="admin",
            hashed_password=hash_password("admin123")
        )
        db.add(admin_user)
        db.commit()
        print("✅ [Seguridad] Usuario Admin creado por defecto: admin")

# --- EVENTOS DE CICLO DE VIDA ---
@app.on_event("startup")
def startup_event():
    # Al iniciar, verifico la integridad de los datos
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()

# --- ENDPOINTS DE LA API ---

@app.post("/system/reset")
def reset_system(db: Session = Depends(get_db)):
    """ Endpoint de mantenimiento: Reinicia todo el sistema a estado de fábrica. """
    try:
        db.query(models.Sale).delete()
        db.query(models.Product).delete()
        db.query(models.User).delete()
        db.commit()
        # Repueblo datos inmediatos
        seed_data(db)
        return {"message": "Sistema reiniciado correctamente. Datos de fábrica restaurados."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    # Verificación de tiempo constante para mitigar ataques de timing (idealmente, aquí lo simulo)
    if not db_user:
        raise HTTPException(status_code=400, detail="Credenciales inválidas")
    
    if hash_password(user.password) != db_user.hashed_password:
        raise HTTPException(status_code=400, detail="Credenciales inválidas")
    
    return {"message": "Autenticación exitosa", "username": db_user.username}

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

@app.post("/checkout")
def checkout(order: Order, db: Session = Depends(get_db)):
    # Genero un ID único para trazabilidad de la transacción
    transaction_id = str(uuid.uuid4())[:8]
    
    for pid in order.product_ids:
        product = db.query(models.Product).filter(models.Product.id == pid).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Producto {pid} no encontrado en inventario")
        if product.stock <= 0:
            raise HTTPException(status_code=400, detail=f"Sin stock para: {product.name}")
        
        # Decremento atómico (en este contexto de DB relacional simple)
        product.stock -= 1
        
        # Registro auditoría de venta
        sale = models.Sale(
            transaction_id=transaction_id,
            product_name=product.name, 
            sale_price=product.price,
            purchase_type=order.purchase_type
        )
        db.add(sale)
    
    db.commit()
    return {"status": "Aprobado", "message": "Compra procesada y stock actualizado", "transaction_id": transaction_id}

@app.get("/dashboard-stats")
def dashboard_stats(db: Session = Depends(get_db)):
    """ Analítica en tiempo real para el Dashboard de Administración """
    now = datetime.now()
    seven_days_ago = now - timedelta(days=7)
    thirty_days_ago = now - timedelta(days=30)

    # Métricas Globales
    total_revenue = db.query(func.sum(models.Sale.sale_price)).scalar() or 0.0
    sales_count = db.query(models.Sale).count()
    
    # Tendencias Semanales
    revenue_7d = db.query(func.sum(models.Sale.sale_price)).filter(models.Sale.timestamp >= seven_days_ago).scalar() or 0.0
    sales_7d = db.query(models.Sale).filter(models.Sale.timestamp >= seven_days_ago).count()

    # Tendencias Mensuales
    revenue_30d = db.query(func.sum(models.Sale.sale_price)).filter(models.Sale.timestamp >= thirty_days_ago).scalar() or 0.0
    sales_30d = db.query(models.Sale).filter(models.Sale.timestamp >= thirty_days_ago).count()
    
    # Historial de Transacciones (Agrupado por ID)
    recent_tx_ids = db.query(models.Sale.transaction_id, func.max(models.Sale.timestamp).label('latest'))\
        .group_by(models.Sale.transaction_id)\
        .order_by(func.max(models.Sale.timestamp).desc())\
        .limit(10).all()
        
    recent_transactions = []
    for tx_id, timestamp in recent_tx_ids:
        # Recupero detalle completo para generación de recibos
        items = db.query(models.Sale).filter(models.Sale.transaction_id == tx_id).all()
        total_value = sum(item.sale_price for item in items)
        
        tx_type = items[0].purchase_type if items else "INDIVIDUAL"
        
        # Serializo productos para el frontend
        detailed_products = [{"name": item.product_name, "price": item.sale_price} for item in items]
        
        recent_transactions.append({
            "transaction_id": tx_id,
            "total_value": total_value,
            "timestamp": timestamp,
            "products": detailed_products,
            "purchase_type": tx_type,
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

@app.get("/optimization")
def get_optimization(db: Session = Depends(get_db)):
    """ endpoint de Inteligencia de Negocio: Predicción de Stock """
    products = db.query(models.Product).all()
    results = []
    
    for prod in products:
        ventas_mes = prod.monthly_sales_avg or 20
        tiempo_entrega = prod.lead_time_days or 7
        
        sugerencia = 0
        
        # 1. Intento usar mi motor C optimizado
        if motor_c:
            try:
                sugerencia = motor_c.calcular_necesidad_compra(int(ventas_mes), int(tiempo_entrega), int(prod.stock))
            except Exception:
                # Si falla, activo mi fallback silencioso
                sugerencia = python_optimize_stock(int(ventas_mes), int(tiempo_entrega), int(prod.stock))
        else:
            # 2. Uso mi lógica Python si no hay DLL
            sugerencia = python_optimize_stock(int(ventas_mes), int(tiempo_entrega), int(prod.stock))
            
        if sugerencia < 0: sugerencia = 0
            
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
