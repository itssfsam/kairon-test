# test_trades_api.py
import requests

BASE_URL = "http://0.0.0.0:8000"

def print_result(test_name, success, msg=""):
    status = "PASS" if success else "FAIL"
    print(f"{test_name}: {status} {msg}")

if __name__ == "__main__":
    # --- Test 1: valid buy ---
    try:
        resp = requests.post(f"{BASE_URL}/trade", json={"side": "BUY", "amount": 0.1})
        data = resp.json()
        success = (
            resp.status_code == 200 and
            data["trade"]["amount"] == 0.1
        )
        print_result("Test 1: Valid BUY", success)
    except Exception as e:
        print_result("Test 1: Valid BUY", False, str(e))

    # --- Test 2: buy exceeds limit ---
    try:
        resp = requests.post(f"{BASE_URL}/trade", json={"side": "BUY", "amount": 10})
        success = resp.status_code == 400 and resp.json().get("detail") == "Trade exceeds $2,000 limit"
        print_result("Test 2: BUY exceeds $2k", success)
    except Exception as e:
        print_result("Test 2: BUY exceeds $2k", False, str(e))

    # --- Test 3: sell more than owned ---
    try:
        # Attempt to sell 0.2 instead of 0.1 ETH → should fail
        resp = requests.post(f"{BASE_URL}/trade", json={"side": "SELL", "amount": 0.2})
        success = resp.status_code == 400 and resp.json().get("detail") == "Insufficient ETH"
        print_result("Test 3: SELL more than owned", success)
    except Exception as e:
        print_result("Test 3: SELL more than owned", False, str(e))
