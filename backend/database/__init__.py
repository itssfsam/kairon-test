from .base import Base, engine, SessionLocal
from .models import Balance, Trade

def init_db():
    Base.metadata.create_all(bind=engine)
