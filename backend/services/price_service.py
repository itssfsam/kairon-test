import requests
from fastapi import HTTPException
import time
import redis

COINGECKO_API = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
BINANCE_API = "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT"

try:
    r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
except:
    print("Redis unavailable! Exponential backoff not supported.")

MAX_RETRIES = 3
BACKOFF_FACTOR = 2

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
    except (requests.RequestException, KeyError, ValueError):
        pass
    
    try:
        redis_key = "binance_price_retries"
        retry_data = r.hgetall(redis_key)
        attempt = int(retry_data.get("attempt", 0))
        last_try = float(retry_data.get("last_try", 0))

        backoff_time = BACKOFF_FACTOR ** attempt
        now = time.time()

        if now - last_try >= backoff_time:
            resp = requests.get(BINANCE_API, timeout=10)
            resp.raise_for_status()
            data = resp.json()
            price = float(data["price"])
            print("Binance: " + str(price))

            r.delete(redis_key)
            return price
        else:
            raise HTTPException(
                status_code=429,
                detail=f"Retrying too fast. Wait {backoff_time - (now - last_try):.1f}s"
            )
    except (requests.RequestException, KeyError, ValueError) as e:
        attempt += 1
        r.hset(redis_key, mapping={"attempt": attempt, "last_try": time.time()})
        if attempt >= MAX_RETRIES:
            raise HTTPException(
                status_code=503,
                detail=f"Binance price fetch failed after {MAX_RETRIES} retries: {e}"
            )
