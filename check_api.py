import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_ieee754():
    print("Testing IEEE754...")
    # Float to Hex
    res = requests.post(f"{BASE_URL}/ieee754/to_hex", json={"value": 1.0})
    if res.status_code == 200:
        print(f"  1.0 -> Hex: {res.json()['hex']} (Expected: 0x3F800000)")
    else:
        print(f"  Float to Hex Failed: {res.text}")

    # Hex to Float
    res = requests.post(f"{BASE_URL}/ieee754/to_float", json={"value": "0x3F800000"})
    if res.status_code == 200:
        print(f"  0x3F800000 -> Float: {res.json()['float']} (Expected: 1.0)")
    else:
        print(f"  Hex to Float Failed: {res.text}")

def test_mil1553():
    print("\nTesting MIL-STD-1553...")
    # Decommutate
    hex_word = "0x0821" # RT=1, T/R=0, SA=1, WC=1
    res = requests.post(f"{BASE_URL}/mil1553/decommutate", json={"hex_word": hex_word})
    if res.status_code == 200:
        data = res.json()
        print(f"  {hex_word} -> RT:{data['remote_terminal_address']} (Exp:1), T/R:{data['transmit_receive']} (Exp:0), SA:{data['subaddress_mode']} (Exp:1), WC:{data['data_word_count_mode_code']} (Exp:1)")
    else:
        print(f"  Decommutate Failed: {res.text}")

    # Commutate
    payload = {
        "rt_address": 1,
        "transmit_receive": 0,
        "subaddress_mode": 1,
        "data_word_count_mode_code": 1
    }
    res = requests.post(f"{BASE_URL}/mil1553/commutate", json=payload)
    if res.status_code == 200:
        print(f"  Commutate -> {res.json()['hex_word']} (Expected: 0x0821)")
    else:
        print(f"  Commutate Failed: {res.text}")

def test_spw():
    print("\nTesting SpaceWire...")
    res = requests.post(f"{BASE_URL}/spw/analyze", json={"address": 32})
    if res.status_code == 200:
        data = res.json()
        print(f"  32 -> {data['type']} (Expected: Logical Address)")
    else:
        print(f"  SpaceWire Failed: {res.text}")

def test_can():
    print("\nTesting CAN...")
    # Std
    res = requests.post(f"{BASE_URL}/can/analyze", json={"hex_id": "0x123"})
    if res.status_code == 200:
        print(f"  0x123 -> {res.json()['id_type']} (Expected: Standard)")
    else:
        print(f"  CAN Std Failed: {res.text}")
        
    # Ext
    res = requests.post(f"{BASE_URL}/can/analyze", json={"hex_id": "0x18F00400"})
    if res.status_code == 200:
        print(f"  0x18F00400 -> {res.json()['id_type']} (Expected: Extended)")
    else:
        print(f"  CAN Ext Failed: {res.text}")

def test_generic():
    print("\nTesting Generic Decommutator (Bit-Level)...")
    # Schema: 
    # - ID: 4 bits (Val=0xA, 10)
    # - ID: 4 bits (Val=0x5, 5) 
    # - F3: 32 bits (1.0 = 3F800000)
    # Total: 40 bits = 5 bytes
    # Stream: A (1010) 5 (0101) 3F800000 -> A53F800000
    hex_stream = "A53F800000"
    schema = [
        {"name": "Nibble1", "size": 4, "type": "ID"},
        {"name": "Nibble2", "size": 4, "type": "ID"},
        {"name": "MyFloat", "size": 32, "type": "F3"}
    ]
    res = requests.post(f"{BASE_URL}/generic/decommutate", json={"hex_stream": hex_stream, "schema_list": schema})
    if res.status_code == 200:
        results = res.json()['results']
        print(f"  Result 0: {results[0]['name']}={results[0]['value']} (Expected Nibble1=10)")
        print(f"  Result 1: {results[1]['name']}={results[1]['value']} (Expected Nibble2=5)")
        print(f"  Result 2: {results[2]['name']}={results[2]['value']} (Expected MyFloat=1.0)")
    else:
        print(f"  Generic Failed: {res.text}")

def test_time():
    print("\nTesting CCSDS Time Converter...")
    # CUC7: 5B 3F 00 00 (Second=1530855424) + CO 00 00 (Fract=0.75)
    # 5B3F0000C00000
    res = requests.post(f"{BASE_URL}/time/convert", json={"hex_time": "5B3F0000C00000", "format": "CUC7"})
    if res.status_code == 200:
        print(f"  CUC7 -> {res.json()['iso']} (Type: {res.json()['type']})")
    else:
        print(f"  CUC7 Failed: {res.text}")

    # CDS8: 5B 3F (Day=23359) + 00 01 00 00 (MS=65536) + 00 00 (us=0)
    # 5B3F000100000000
    res = requests.post(f"{BASE_URL}/time/convert", json={"hex_time": "5B3F000100000000", "format": "CDS8"})
    if res.status_code == 200:
        print(f"  CDS8 -> {res.json()['iso']} (Type: {res.json()['type']})")
    else:
        print(f"  CDS8 Failed: {res.text}")

if __name__ == "__main__":
    try:
        test_ieee754()
        test_mil1553()
        test_spw()
        test_can()
        test_generic()
        test_time()
    except Exception as e:
        print(f"Test Execution Failed: {e}")
