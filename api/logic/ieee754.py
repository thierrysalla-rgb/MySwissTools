import struct

def float_to_hex(f: float) -> str:
    """Converts a float to its IEEE 754 32-bit hexadecimal representation."""
    try:
        # Pack float into 4 bytes (big-endian)
        packed = struct.pack('>f', f)
        # Unpack as unsigned integer
        i = struct.unpack('>I', packed)[0]
        return f"0x{i:08X}"
    except OverflowError:
        return "Inf" # Handle overflow

def hex_to_float(h: str) -> float:
    """Converts a hexadecimal string (IEEE 754 32-bit) to a float."""
    try:
        # Clean string
        h = h.strip().lower()
        if h.startswith("0x"):
            h = h[2:]
        
        # Parse hex string to integer
        i = int(h, 16)
        
        # Pack integer into 4 bytes (big-endian)
        packed = struct.pack('>I', i)
        # Unpack as float
        return struct.unpack('>f', packed)[0]
    except ValueError:
        raise ValueError("Invalid hexadecimal string")
