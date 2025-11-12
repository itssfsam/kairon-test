from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

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

@app.get("/price")
def get_eth_price():
    try:
        resp = requests.get(COINGECKO_API, timeout=5)
        resp.raise_for_status()
        data = resp.json()
        price = data["ethereum"]["usd"]
        return {"price": price}
    except Exception as e:
        return {"error": "Failed to fetch price", "detail": str(e)}
