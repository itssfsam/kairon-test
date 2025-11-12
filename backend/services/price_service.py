import requests
from fastapi import HTTPException

COINGECKO_API = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"

def get_eth_price() -> float:
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