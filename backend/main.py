from fastapi.middleware.cors import CORSMiddleware
import requests
from database import init_db, SessionLocal, Balance, Trade
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import datetime

class TradeRequest(BaseModel):
    side: str
    amount: float

# All initializations
init_db()
app = FastAPI()

# CORS
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

COINGECKO_API = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"

def get_eth_price_service() -> float:
    try:
        resp = requests.get(COINGECKO_API, timeout=5)
        resp.raise_for_status()
        data = resp.json()

        if "ethereum" not in data or "usd" not in data["ethereum"]:
            raise ValueError("Malformed response")

        return float(data["ethereum"]["usd"])
    except requests.RequestException as e:
        # Network issues, timeout, bad status codes
        raise HTTPException(status_code=503, detail=f"Price service unavailable: {e}")
    except ValueError as e:
        # JSON parsing or missing keys
        raise HTTPException(status_code=502, detail=f"Invalid price data: {e}")
    except Exception as e:
        # Catch-all
        raise HTTPException(status_code=500, detail=f"Unexpected error: {e}")

@app.get("/price")
def get_eth_price():
    """
    Endpoint to get current ETH/USD price.
    """
    price = get_eth_price_service()
    return {"price": price}


@app.post("/trade")
def make_trade(req: TradeRequest):
    if req.side not in ["BUY", "SELL"]:
        raise HTTPException(status_code=400, detail="Invalid side")
    
    price = get_eth_price_service()
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