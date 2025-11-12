from sqlalchemy import create_engine, Column, Integer, Float, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

DATABASE_URL = "sqlite:///./trading.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Balance(Base):
    __tablename__ = "balances"
    id = Column(Integer, primary_key=True, index=True)
    usdc = Column(Float, default=10000.0)
    eth = Column(Float, default=0.0)

class Trade(Base):
    __tablename__ = "trades"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    side = Column(String)
    amount = Column(Float)
    price = Column(Float)
    notional = Column(Float)

def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    if db.query(Balance).count() == 0:
        db.add(Balance(usdc=10000.0, eth=0.0))
        db.commit()
    db.close()
