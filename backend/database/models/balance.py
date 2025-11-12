from sqlalchemy import Column, Float, Integer
from database.base import Base

class Balance(Base):
    __tablename__ = "balances"

    id = Column(Integer, primary_key=True, index=True)
    usdc = Column(Float, default=10000.0)
    eth = Column(Float, default=0.0)
