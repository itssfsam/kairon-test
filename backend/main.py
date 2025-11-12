from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal, init_db, Balance, Trade
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import datetime
from services import get_eth_price
import csv
from io import StringIO
from fastapi.responses import StreamingResponse

class TradeRequest(BaseModel):
    side: str
    amount: float

# All initializations
init_db()
app = FastAPI()

# CORS
origins = [
    "http://localhost:3000",
    "http://0.0.0.0:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/price")
def eth_price():
    """
    Endpoint to get current ETH/USD price.
    """
    price = get_eth_price()
    return {"price": price}


@app.post("/trade")
def make_trade(req: TradeRequest):
    if req.side not in ["BUY", "SELL"]:
        raise HTTPException(status_code=400, detail="Invalid side")
    
    price = get_eth_price()
    notional = req.amount * price

    if notional > 2000:
        raise HTTPException(status_code=400, detail="Trade exceeds $2,000 limit")
    
    db = SessionLocal()
    balance = db.query(Balance).first()
    
    if req.side == "BUY":
        if notional > balance.usdc:
            db.close()
            raise HTTPException(status_code=400, detail="Insufficient USDC")
        balance.usdc -= notional
        balance.eth += req.amount
    else:  # SELL
        if req.amount > balance.eth:
            db.close()
            raise HTTPException(status_code=400, detail="Insufficient ETH")
        balance.usdc += notional
        balance.eth -= req.amount

    trade = Trade(
        side=req.side,
        amount=req.amount,
        price=price,
        notional=notional,
        timestamp=datetime.datetime.utcnow()
    )
    db.add(trade)
    db.commit()
    db.refresh(balance)
    db.close()
    
    return {
        "balance": {"usdc": balance.usdc, "eth": balance.eth},
        "trade": {"side": req.side, "amount": req.amount, "price": price, "notional": notional},
    }

@app.get("/trades/export-csv")
def export_trades_csv():
    db = SessionLocal()
    try:
        trades = db.query(Trade).all()
        output = StringIO()
        writer = csv.writer(output)
        writer.writerow(["id", "side", "amount", "price", "notional", "timestamp"])
        
        for t in trades:
            writer.writerow([t.id, t.side, t.amount, t.price, t.notional, t.timestamp])
        
        output.seek(0)
        return StreamingResponse(
            output,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=trades.csv"}
        )
    finally:
        db.close()