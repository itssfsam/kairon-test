# test_trades_api.py
import requests

BASE_URL = "http://localhost:8000"

def print_result(test_name, success, msg=""):
    status = "PASS" if success else "FAIL"
    print(f"{test_name}: {status} {msg}")

if __name__ == "__main__":
    # --- Test 1: valid buy ---
    try:
        resp = requests.post(f"{BASE_URL}/trade", json={"side": "BUY", "amount": 0.5})
        data = resp.json()
        success = (
            resp.status_code == 200 and
            data["trade"]["amount"] == 0.5 and
            data["trade"]["price"] == 3000.0 and
            data["trade"]["notional"] == 1500.0 and
            data["balance"]["usdc"] == 8500.0 and
            data["balance"]["eth"] == 0.5
        )
        print_result("Test 1: Valid BUY", success)
    except Exception as e:
        print_result("Test 1: Valid BUY", False, str(e))

    # --- Test 2: buy exceeds limit ---
    try:
        resp = requests.post(f"{BASE_URL}/trade", json={"side": "BUY", "amount": 1})
        success = resp.status_code == 400 and resp.json().get("detail") == "Trade exceeds $2,000 limit"
        print_result("Test 2: BUY exceeds $2k", success)
    except Exception as e:
        print_result("Test 2: BUY exceeds $2k", False, str(e))

    # --- Test 3: sell more than owned ---
    try:
        # Buy 0.5 ETH first (if needed)
        requests.post(f"{BASE_URL}/trade", json={"side": "BUY", "amount": 0.5})
        # Attempt to sell 1 ETH → should fail
        resp = requests.post(f"{BASE_URL}/trade", json={"side": "SELL", "amount": 1})
        success = resp.status_code == 400 and resp.json().get("detail") == "Insufficient ETH"
        print_result("Test 3: SELL more than owned", success)
    except Exception as e:
        print_result("Test 3: SELL more than owned", False, str(e))

    # --- Test 4: valid sell ---
    try:
        # Buy 0.5 ETH first
        requests.post(f"{BASE_URL}/trade", json={"side": "BUY", "amount": 0.5})
        # Sell 0.3 ETH
        resp = requests.post(f"{BASE_URL}/trade", json={"side": "SELL", "amount": 0.3})
        data = resp.json()
        success = (
            resp.status_code == 200 and
            data["balance"]["eth"] == 0.2 and
            data["balance"]["usdc"] == 8500.0 + 0.3 * 3000  # 9400
        )
        print_result("Test 4: Valid SELL", success)
    except Exception as e:
        print_result("Test 4: Valid SELL", False, str(e))
