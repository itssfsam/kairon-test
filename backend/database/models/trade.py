from sqlalchemy import Column, Float, Integer, String, DateTime
from sqlalchemy.sql import func
from database.base import Base

class Trade(Base):
    __tablename__ = "trades"

    id = Column(Integer, primary_key=True, index=True)
    side = Column(String, nullable=False)  # BUY or SELL
    amount = Column(Float, nullable=False)
    price = Column(Float, nullable=False)
    notional = Column(Float, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
