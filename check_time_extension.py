import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000/api"

def test_time_extension():
    print("Testing CCSDS Time Extension...")
    
    # 1. Test Encode CUC
    # Epoch + 10s + 0.5s
    # 0.5 * 2^24 = 8388608 = 0x800000
    # 10 = 0x0000000A
    # Expected: 0000000A800000
    iso_time = "1958-01-01T00:00:10.500Z"
    print(f"  Encoding {iso_time} to CUC7...")
    res = requests.post(f"{BASE_URL}/time/encode", json={"iso_time": iso_time, "format": "CUC7"})
    if res.status_code == 200:
        hex_val = res.json()["hex"]
        print(f"  -> {hex_val} (Expected: 0000000A800000)")
        if hex_val != "0000000A800000":
             print("  FAILED!")
    else:
        print(f"  FAILED: {res.text}")

    # 2. Test Encode CDS
    # Epoch + 1 Day + 100ms
    # Day = 1 = 0x0001
    # MS = 100 = 0x00000064
    # Micros = 0
    # Expected: 0001000000640000
    iso_time_cds = "1958-01-02T00:00:00.100Z"
    print(f"  Encoding {iso_time_cds} to CDS8...")
    res = requests.post(f"{BASE_URL}/time/encode", json={"iso_time": iso_time_cds, "format": "CDS8"})
    if res.status_code == 200:
        hex_val = res.json()["hex"]
        print(f"  -> {hex_val} (Expected: 0001000000640000)")
        if hex_val != "0001000000640000":
             print("  FAILED!")
    else:
        print(f"  FAILED: {res.text}")

    # 3. Test Cross Convert CUC -> CDS
    # 0000000A800000 (10.5s)
    # Days = 0
    # Millis = 10500 = 0x2904
    # Micros = 0
    # Expected: 0000000029040000
    cuc_hex = "0000000A800000"
    print(f"  Converting CUC {cuc_hex} to CDS8...")
    res = requests.post(f"{BASE_URL}/time/cross_convert", json={"hex_time": cuc_hex, "from_format": "CUC7", "to_format": "CDS8"})
    if res.status_code == 200:
        hex_val = res.json()["hex"]
        print(f"  -> {hex_val} (Expected: 0000000029040000)")
        if hex_val != "0000000029040000":
             print("  FAILED!")
    else:
        print(f"  FAILED: {res.text}")

if __name__ == "__main__":
    test_time_extension()
