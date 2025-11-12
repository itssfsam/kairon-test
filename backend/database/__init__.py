from .base import Base, engine, SessionLocal
from .models import Balance, Trade


def init_db():
    # For the sake of test project and simplicity
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    balance = Balance(usdc=10000.0, eth=0.0)
    db.add(balance)
    db.commit()
    db.close()
