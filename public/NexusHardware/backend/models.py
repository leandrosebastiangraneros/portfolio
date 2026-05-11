from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy.sql import func
from database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String)
    price = Column(Float)
    stock = Column(Integer)
    image_url = Column(String)
    lead_time_days = Column(Integer, default=7)
    monthly_sales_avg = Column(Integer, default=20)

class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String, index=True) # Agregué este campo para agrupar ítems en una única transacción comercial
    product_name = Column(String)
    sale_price = Column(Float)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    purchase_type = Column(String, default="INDIVIDUAL")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
