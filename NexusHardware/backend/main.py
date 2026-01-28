from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import engine, SessionLocal, Base
import models
from pydantic import BaseModel
from typing import List

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Models
class Order(BaseModel):
    product_ids: List[int]

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        if db.query(models.Product).count() == 0:
            products = [
                models.Product(name="RTX 4090", category="GPU", price=1599.99, stock=10, image_url="https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800"),
                models.Product(name="Ryzen 7 7800X3D", category="CPU", price=449.00, stock=20, image_url="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=800"),
                models.Product(name="Mechanical Keyboard", category="Peripherals", price=129.50, stock=50, image_url="https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800"),
                models.Product(name="Gaming Mouse", category="Peripherals", price=59.99, stock=100, image_url="https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&q=80&w=800"),
                models.Product(name="32GB DDR5 RAM", category="RAM", price=110.00, stock=30, image_url="https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=800"),
            ]
            db.add_all(products)
            db.commit()
    finally:
        db.close()

@app.get("/products")
def read_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()

@app.post("/checkout")
def checkout(order: Order, db: Session = Depends(get_db)):
    for pid in order.product_ids:
        product = db.query(models.Product).filter(models.Product.id == pid).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {pid} not found")
        if product.stock <= 0:
            raise HTTPException(status_code=400, detail=f"Product {product.name} is out of stock")
        
        product.stock -= 1
        
        # Record Sale
        sale = models.Sale(product_name=product.name, sale_price=product.price)
        db.add(sale)
    
    db.commit()
    return {"status": "Compra realizada", "message": "Stock updated and sales recorded"}

@app.get("/dashboard-stats")
def dashboard_stats(db: Session = Depends(get_db)):
    total_revenue = db.query(func.sum(models.Sale.sale_price)).scalar() or 0.0
    sales_count = db.query(models.Sale).count()
    
    recent_sales = db.query(models.Sale).order_by(models.Sale.timestamp.desc()).limit(5).all()
    
    return {
        "total_revenue": total_revenue,
        "sales_count": sales_count,
        "recent_sales": recent_sales
    }
