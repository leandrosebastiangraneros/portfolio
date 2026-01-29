from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta

import models, schemas
import reports
from database import SessionLocal, engine

import logging

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="NovaManager API")

# Security: Restrict CORS to known frontends (dev and prod)
# Security: Restrict CORS to known frontends (dev and prod)
# For initial deployment flexibility, we allow all.Restrict this in strict production.
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup Event to Seed Categories
@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        # Check if categories exist
        if db.query(models.Category).count() == 0:
            default_cats = [
                # INCOME
                {"name": "Honorarios / Servicios", "type": "INCOME"},
                {"name": "Venta de Productos", "type": "INCOME"},
                {"name": "Otros Ingresos", "type": "INCOME"},
                # EXPENSES
                {"name": "Monotributo / Impuestos", "type": "EXPENSE"},
                {"name": "Servicios (Luz, Internet)", "type": "EXPENSE"},
                {"name": "Insumos / Materiales", "type": "EXPENSE"},
                {"name": "Viáticos / Transporte", "type": "EXPENSE"},
                {"name": "Publicidad / Marketing", "type": "EXPENSE"},
                {"name": "Alquiler", "type": "EXPENSE"},
                {"name": "Equipamiento", "type": "EXPENSE"},
                {"name": "Suscripciones Software", "type": "EXPENSE"},
                {"name": "Otros Gastos", "type": "EXPENSE"},
            ]
            for cat in default_cats:
                db_cat = models.Category(**cat)
                db.add(db_cat)
            db.commit()
            logger.info("--- Database Seeded with Default Categories ---")
    finally:
        db.close()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- CATEGORIES ---
@app.post("/categories", response_model=schemas.Category)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    db_cat = models.Category(**category.model_dump())
    db.add(db_cat)
    db.commit()
    db.refresh(db_cat)
    return db_cat

@app.get("/categories", response_model=List[schemas.Category])
def read_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()

@app.post("/reset-db")
def reset_database(db: Session = Depends(get_db)):
    # Drop all tables and recreate them
    models.Base.metadata.drop_all(bind=engine)
    models.Base.metadata.create_all(bind=engine)
    # Re-seed categories
    startup_event()
    return {"message": "Database reset successful"}

# --- TRANSACTIONS ---
@app.post("/transactions", response_model=schemas.Transaction)
def create_transaction(tx: schemas.TransactionCreate, db: Session = Depends(get_db)):
    db_tx = models.Transaction(**tx.model_dump())
    # Set date to now if not provided (handled by server default, but strict mapping might need it)
    # Actually Pydantic won't send it, model uses server_default.
    db.add(db_tx)
    db.commit()
    db.refresh(db_tx)
    return db_tx

@app.get("/transactions", response_model=List[schemas.Transaction])
def read_transactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Transaction).order_by(models.Transaction.date.desc()).offset(skip).limit(limit).all()

@app.delete("/transactions/{tx_id}")
def delete_transaction(tx_id: int, db: Session = Depends(get_db)):
    tx = db.query(models.Transaction).filter(models.Transaction.id == tx_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")
    db.delete(tx)
    db.commit()
    return {"ok": True}

# --- DASHBOARD ---
@app.get("/dashboard-stats")
def dashboard_stats(db: Session = Depends(get_db)):
    now = datetime.now()
    # Start of current month
    start_of_month = datetime(now.year, now.month, 1)
    
    # Get all transactions for this month
    txs = db.query(models.Transaction).filter(models.Transaction.date >= start_of_month).all()
    
    income = sum(t.amount for t in txs if t.type == "INCOME")
    expenses = sum(t.amount for t in txs if t.type == "EXPENSE")
    balance = income - expenses
    
    # Calculate daily data for chart
    # Create a dict of days 1..31 initialized to 0
    import calendar
    days_in_month = calendar.monthrange(now.year, now.month)[1]
    daily_data = {day: {"day": day, "income": 0, "expense": 0} for day in range(1, days_in_month + 1)}
    
    for t in txs:
        day = t.date.day
        if t.type == "INCOME":
            daily_data[day]["income"] += t.amount
        elif t.type == "EXPENSE":
            daily_data[day]["expense"] += t.amount
            
    # Convert to list sorted by day
    chart_data = [daily_data[day] for day in sorted(daily_data.keys())]

    return {
        "income": income,
        "expenses": expenses,
        "balance": balance,
        "month": now.strftime("%B"),
        "chart_data": chart_data
    }

# --- REPORTS ---
@app.get("/reports/monthly")
def download_monthly_report(year: int, month: int, db: Session = Depends(get_db)):
    import calendar
    # 1. Fetch transactions for the month
    start_date = datetime(year, month, 1)
    days_in_month = calendar.monthrange(year, month)[1]
    end_date = datetime(year, month, days_in_month, 23, 59, 59)
    
    txs = db.query(models.Transaction).filter(
        models.Transaction.date >= start_date, 
        models.Transaction.date <= end_date
    ).order_by(models.Transaction.date.asc()).all()
    
    # 2. Calculate stats
    income = sum(t.amount for t in txs if t.type == "INCOME")
    expenses = sum(t.amount for t in txs if t.type == "EXPENSE")
    balance = income - expenses
    
    # Simple Spanish Month Mapping
    spanish_months = {
        1: "Enero", 2: "Febrero", 3: "Marzo", 4: "Abril", 5: "Mayo", 6: "Junio",
        7: "Julio", 8: "Agosto", 9: "Septiembre", 10: "Octubre", 11: "Noviembre", 12: "Diciembre"
    }
    month_str = f"{spanish_months.get(month, 'Desconocido')} {year}"
    
    # 3. Generate PDF
    pdf_buffer = reports.generate_monthly_pdf(month_str, income, expenses, balance, txs)
    
    # 4. Return StreamingResponse
    filename = f"Reporte_{month}_{year}.pdf"
    return StreamingResponse(
        pdf_buffer, 
        media_type="application/pdf", 
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

# --- STOCK ---
@app.post("/stock", response_model=schemas.StockItem)
def create_stock_item(item: schemas.StockItemCreate, db: Session = Depends(get_db)):
    # 1. Create Stock Item with Unit Cost calculation
    # cost_amount is total cost of batch
    u_cost = item.cost_amount / item.initial_quantity if item.initial_quantity > 0 else 0
    
    db_item = models.StockItem(
        name=item.name,
        cost_amount=item.cost_amount,
        initial_quantity=item.initial_quantity,
        quantity=item.initial_quantity,
        unit_cost=u_cost,
        status="AVAILABLE"
    )
    db.add(db_item)
    db.flush()
    
    # 2. Automatically Create Expense Transaction
    cat = db.query(models.Category).filter(models.Category.name == "Insumos / Materiales").first()
    if not cat:
        cat = models.Category(name="Insumos / Materiales", type="EXPENSE")
        db.add(cat)
        db.flush()
        
    expense_tx = models.Transaction(
        amount=item.cost_amount,
        description=f"Compra Stock: {item.name} ({item.initial_quantity}u)",
        type="EXPENSE",
        category_id=cat.id,
        is_invoiced=False
    )
    db.add(expense_tx)
    db.flush()
    
    db_item.purchase_tx_id = expense_tx.id
    db.commit()
    db.refresh(db_item)
    return db_item

@app.get("/stock", response_model=List[schemas.StockItem])
def read_stock(db: Session = Depends(get_db)):
    return db.query(models.StockItem).order_by(models.StockItem.purchase_date.desc()).all()

@app.put("/stock/{item_id}/sell", response_model=schemas.StockItem)
def sell_stock_item(item_id: int, sale_data: schemas.StockItemSell, db: Session = Depends(get_db)):
    db_item = db.query(models.StockItem).filter(models.StockItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
        
    if db_item.quantity < sale_data.quantity:
        raise HTTPException(status_code=400, detail="Stock insuficiente")
        
    # 1. Create Usage Record for the Sale
    total_sale = sale_data.quantity * sale_data.sale_price_unit
    
    # 2. Automatically Create Income Transaction
    cat = db.query(models.Category).filter(models.Category.name == "Venta de Productos").first()
    if not cat:
         cat = models.Category(name="Venta de Productos", type="INCOME")
         db.add(cat)
         db.flush()

    income_tx = models.Transaction(
        amount=total_sale,
        description=f"Venta Stock: {db_item.name} ({sale_data.quantity}u) - {sale_data.work_description}",
        type="INCOME",
        category_id=cat.id,
        is_invoiced=False
    )
    db.add(income_tx)
    db.flush()

    # 3. Create Usage Entry
    usage = models.MaterialUsage(
        stock_item_id=item_id,
        quantity=sale_data.quantity,
        description=sale_data.work_description,
        sale_price_total=total_sale,
        sale_tx_id=income_tx.id
    )
    db.add(usage)
    
    # 4. Update Stock Item
    db_item.quantity -= sale_data.quantity
    if db_item.quantity <= 0:
        db_item.status = "DEPLETED"
    
    db.commit()
    db.refresh(db_item)
    return db_item

@app.post("/stock/{item_id}/use", response_model=schemas.MaterialUsage)
def use_stock_item(item_id: int, usage_data: schemas.StockUsageCreate, db: Session = Depends(get_db)):
    db_item = db.query(models.StockItem).filter(models.StockItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
        
    if db_item.quantity < usage_data.quantity:
        raise HTTPException(status_code=400, detail="Stock insuficiente")
        
    # Create Usage Entry
    usage = models.MaterialUsage(
        stock_item_id=item_id,
        employee_id=usage_data.employee_id,
        quantity=usage_data.quantity,
        description=usage_data.description or f"Retirado por personal"
    )
    db.add(usage)
    
    # Update Stock Item
    db_item.quantity -= usage_data.quantity
    if db_item.quantity <= 0:
        db_item.status = "DEPLETED"
        
    db.commit()
    db.refresh(usage)
    return usage

# --- EMPLOYEES & PAYROLL ---

@app.post("/employee-groups", response_model=schemas.EmployeeGroup)
def create_employee_group(group: schemas.EmployeeGroupCreate, db: Session = Depends(get_db)):
    db_group = models.EmployeeGroup(**group.model_dump())
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group

@app.get("/employee-groups", response_model=List[schemas.EmployeeGroup])
def read_employee_groups(db: Session = Depends(get_db)):
    return db.query(models.EmployeeGroup).all()

@app.post("/employees", response_model=schemas.Employee)
def create_employee(emp: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    db_emp = models.Employee(**emp.model_dump())
    db.add(db_emp)
    db.commit()
    db.refresh(db_emp)
    return db_emp

@app.delete("/employees/{emp_id}")
def delete_employee(emp_id: int, db: Session = Depends(get_db)):
    db_emp = db.query(models.Employee).filter(models.Employee.id == emp_id).first()
    if not db_emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    db.delete(db_emp)
    db.commit()
    return {"ok": True}

@app.post("/employees/{empid}/records", response_model=schemas.PayrollRecord)
def add_payroll_record(empid: int, rec: schemas.EmployeeRecordBase, db: Session = Depends(get_db)):
    db_emp = db.query(models.Employee).filter(models.Employee.id == empid).first()
    if not db_emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # 1. Calculate Gross Total (Production value)
    gross_total = rec.meters * 100000
    
    # 2. Settle advances based on production
    pending_advances = sorted([a for a in db_emp.advances if not a.is_settled], key=lambda x: x.date)
    total_pending = sum(a.amount for a in pending_advances)
    
    # Calculate Net Total (Cash that MUST be paid today)
    net_total = max(0, gross_total - total_pending)
    
    # Update advances to settled if they are covered by the work
    running_gross = gross_total
    for a in pending_advances:
        if running_gross >= a.amount:
            a.is_settled = True
            running_gross -= a.amount
        else:
            # Partial settlement not supported in current model
            # Advance stays pending if not fully covered
            break
    
    # 3. Create Payroll Record
    db_rec = models.PayrollRecord(
        employee_id=empid,
        meters=rec.meters,
        total_amount=gross_total, # We store the gross production value for reporting
        date=rec.date or datetime.now(),
        is_paid=True
    )
    db.add(db_rec)
    db.flush()
    
    # 4. Create Financial Transaction (EXPENSE) - Record the NET payment
    # This reflects the ACTUAL cash outflow today.
    cat_expense = db.query(models.Category).filter(models.Category.name == "Sueldos / Jornales").first()
    if not cat_expense:
        cat_expense = models.Category(name="Sueldos / Jornales", type="EXPENSE")
        db.add(cat_expense)
        db.flush()
        
    # Transaction description reflects if there was compensation
    desc = f"Pago Jornal: {db_emp.name} ({rec.meters}m)"
    if total_pending > 0:
        desc += f" - [Compensado con Adelantos]"

    tx = models.Transaction(
        amount=net_total,
        description=desc,
        type="EXPENSE",
        category_id=cat_expense.id,
        date=db_rec.date
    )
    db.add(tx)
    db.flush()
    db_rec.transaction_id = tx.id
    
    db.commit()
    db.refresh(db_rec)
    return db_rec
    
    db.commit()
    db.refresh(db_rec)
    return db_rec

@app.post("/employees/{empid}/advances", response_model=schemas.Advance)
def add_employee_advance(empid: int, adv: schemas.AdvanceCreate, db: Session = Depends(get_db)):
    db_emp = db.query(models.Employee).filter(models.Employee.id == empid).first()
    if not db_emp:
        raise HTTPException(status_code=404, detail="Employee not found")
        
    # 1. Create Advance Entry
    db_adv = models.Advance(
        employee_id=empid,
        amount=adv.amount,
        description=adv.description or f"Adelanto a {db_emp.name}",
        date=adv.date or datetime.now(),
        is_settled=False
    )
    db.add(db_adv)
    db.flush()
    
    # 2. Create Financial Transaction (EXPENSE)
    cat = db.query(models.Category).filter(models.Category.name == "Adelantos / Vales").first()
    if not cat:
        cat = models.Category(name="Adelantos / Vales", type="EXPENSE")
        db.add(cat)
        db.flush()
        
    tx = models.Transaction(
        amount=adv.amount,
        description=f"Adelanto: {db_emp.name} ({adv.description or 'Sin desc.'})",
        type="EXPENSE",
        category_id=cat.id,
        date=db_adv.date
    )
    db.add(tx)
    db.flush()
    
    db_adv.transaction_id = tx.id
    db.commit()
    db.refresh(db_adv)
    return db_adv

@app.get("/employees/{empid}/history", response_model=schemas.EmployeeHistory)
def get_employee_history(empid: int, db: Session = Depends(get_db)):
    db_emp = db.query(models.Employee).filter(models.Employee.id == empid).first()
    if not db_emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    return {
        "employee_id": db_emp.id,
        "name": db_emp.name,
        "records": db_emp.records,
        "advances": db_emp.advances,
        "material_usages": db_emp.material_usages
    }
