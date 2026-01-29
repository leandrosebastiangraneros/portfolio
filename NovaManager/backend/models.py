from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    type = Column(String) # "INCOME" or "EXPENSE"
    
    transactions = relationship("Transaction", back_populates="category")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime(timezone=True), server_default=func.now())
    amount = Column(Float)
    description = Column(String)
    type = Column(String) # "INCOME" or "EXPENSE"
    is_invoiced = Column(Boolean, default=False)
    
    category_id = Column(Integer, ForeignKey("categories.id"))
    category = relationship("Category", back_populates="transactions")

class StockItem(Base):
    __tablename__ = "stock_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    
    # Cost (Purchase)
    cost_amount = Column(Float) # Total cost of batch
    initial_quantity = Column(Float, default=1.0)
    quantity = Column(Float, default=1.0) # Current available
    unit_cost = Column(Float, default=0.0)
    
    purchase_date = Column(DateTime(timezone=True), server_default=func.now())
    
    # Status (AVAILABLE, DEPLETED)
    status = Column(String, default="AVAILABLE") 
    
    # Link to financial purchase transaction
    purchase_tx_id = Column(Integer, ForeignKey("transactions.id"), nullable=True)
    purchase_tx = relationship("Transaction", foreign_keys=[purchase_tx_id])
    
    usages = relationship("MaterialUsage", back_populates="stock_item")

class MaterialUsage(Base):
    __tablename__ = "material_usages"
    id = Column(Integer, primary_key=True, index=True)
    stock_item_id = Column(Integer, ForeignKey("stock_items.id"))
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=True)
    
    quantity = Column(Float)
    date = Column(DateTime(timezone=True), server_default=func.now())
    description = Column(String, nullable=True)
    
    # For sales
    sale_price_total = Column(Float, nullable=True)
    sale_tx_id = Column(Integer, ForeignKey("transactions.id"), nullable=True)

    stock_item = relationship("StockItem", back_populates="usages")
    employee = relationship("Employee")
    sale_tx = relationship("Transaction")

class EmployeeGroup(Base):
    __tablename__ = "employee_groups"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    employees = relationship("Employee", back_populates="group", cascade="all, delete-orphan")

class Employee(Base):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    group_id = Column(Integer, ForeignKey("employee_groups.id"))
    
    group = relationship("EmployeeGroup", back_populates="employees")
    records = relationship("PayrollRecord", back_populates="employee", cascade="all, delete-orphan")
    advances = relationship("Advance", back_populates="employee", cascade="all, delete-orphan")
    material_usages = relationship("MaterialUsage", back_populates="employee", cascade="all, delete-orphan")

class Advance(Base):
    __tablename__ = "advances"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    amount = Column(Float)
    date = Column(DateTime(timezone=True), server_default=func.now())
    description = Column(String, nullable=True)
    is_settled = Column(Boolean, default=False) # True if subtracted from payroll
    
    transaction_id = Column(Integer, ForeignKey("transactions.id"), nullable=True)
    
    employee = relationship("Employee", back_populates="advances")
    transaction = relationship("Transaction")

class PayrollRecord(Base):
    __tablename__ = "payroll_records"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    date = Column(DateTime(timezone=True), server_default=func.now())
    meters = Column(Float)
    total_amount = Column(Float) # meters * 100,000
    is_paid = Column(Boolean, default=False)
    
    # Financial Link
    transaction_id = Column(Integer, ForeignKey("transactions.id"), nullable=True)
    
    employee = relationship("Employee", back_populates="records")
    transaction = relationship("Transaction")
