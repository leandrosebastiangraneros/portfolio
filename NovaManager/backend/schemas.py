from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CategoryBase(BaseModel):
    name: str
    type: str

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    class Config:
        from_attributes = True

class TransactionBase(BaseModel):
    amount: float
    description: str
    type: str # INCOME / EXPENSE
    is_invoiced: bool = False
    category_id: Optional[int] = None

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    id: int
    date: datetime
    category: Optional[Category] = None
    
    class Config:
        from_attributes = True

# --- STOCK ---
class StockItemBase(BaseModel):
    name: str

class StockItemCreate(StockItemBase):
    cost_amount: float
    initial_quantity: float

class StockItemSell(BaseModel):
    quantity: float
    sale_price_unit: float
    work_description: str

class StockUsageCreate(BaseModel):
    employee_id: Optional[int] = None
    quantity: float
    description: Optional[str] = None

class MaterialUsage(BaseModel):
    id: int
    stock_item_id: int
    employee_id: Optional[int] = None
    quantity: float
    date: datetime
    description: Optional[str] = None
    sale_price_total: Optional[float] = None
    
    class Config:
        from_attributes = True

class StockItem(StockItemBase):
    id: int
    cost_amount: float
    initial_quantity: float
    quantity: float
    unit_cost: float
    purchase_date: datetime
    status: str
    usages: List[MaterialUsage] = []
    
    class Config:
        from_attributes = True

# --- EMPLOYEES ---
class AdvanceBase(BaseModel):
    amount: float
    description: Optional[str] = None
    date: Optional[datetime] = None

class AdvanceCreate(AdvanceBase):
    pass

class Advance(AdvanceBase):
    id: int
    employee_id: int
    is_settled: bool
    date: datetime
    class Config:
        from_attributes = True

class EmployeeGroupBase(BaseModel):
    name: str

class EmployeeGroupCreate(EmployeeGroupBase):
    pass

class EmployeeRecordBase(BaseModel):
    meters: float
    date: Optional[datetime] = None

class EmployeeBase(BaseModel):
    name: str
    group_id: int

class EmployeeCreate(EmployeeBase):
    pass

class PayrollRecord(EmployeeRecordBase):
    id: int
    employee_id: int
    total_amount: float
    is_paid: bool
    class Config:
        from_attributes = True

class Employee(EmployeeBase):
    id: int
    records: List[PayrollRecord] = []
    advances: List[Advance] = []
    class Config:
        from_attributes = True

class EmployeeGroup(EmployeeGroupBase):
    id: int
    employees: List[Employee] = []
    class Config:
        from_attributes = True

# --- HISTORY ---
class EmployeeHistory(BaseModel):
    employee_id: int
    name: str
    records: List[PayrollRecord] = []
    advances: List[Advance] = []
    material_usages: List[MaterialUsage] = []
    
    class Config:
        from_attributes = True
