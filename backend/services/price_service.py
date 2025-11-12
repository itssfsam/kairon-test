import requests
from fastapi import HTTPException

COINGECKO_API = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
BINANCE_API = "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT"

def get_eth_price() -> float:
    try:
        resp = requests.get(COINGECKO_API, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        price = float(data["ethereum"]["usd"])
        print("CoinGecko: "+ str(price))
        return price
    except (requests.RequestException, KeyError, ValueError):
        pass

    try:
        resp = requests.get(BINANCE_API, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        price = float(data["price"])
        print("Binance: "+ str(price))
        return price
    except (requests.RequestException, KeyError, ValueError) as e:
        raise HTTPException(
            status_code=503,
            detail=f"Both price sources failed: {e}"
        )
