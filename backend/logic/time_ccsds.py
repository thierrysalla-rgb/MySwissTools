from datetime import datetime, timedelta

CCSDS_EPOCH = datetime(1958, 1, 1)

def decode_cuc_7bytes(hex_str: str) -> dict:
    """
    Decodes CCSDS Unsegmented Time Code (CUC) - 7 Bytes.
    Format: 4 bytes Seconds, 3 bytes Fine Time (2^-24)
    """
    h = hex_str.strip().lower()
    if h.startswith("0x"):
        h = h[2:]
    
    if len(h) != 14: # 7 bytes * 2 chars
        raise ValueError("CUC input must be 7 bytes (14 hex chars)")
        
    # Bytes 0-3: Seconds
    seconds_int = int(h[0:8], 16)
    
    # Bytes 4-6: Fractional (2^-24)
    fractional_int = int(h[8:14], 16)
    microseconds = (fractional_int / (2**24)) * 1_000_000
    
    time_val = CCSDS_EPOCH + timedelta(seconds=seconds_int, microseconds=microseconds)
    
    return {
        "type": "CUC (7 bytes)",
        "iso": time_val.isoformat(),
        "epoch": "1958-01-01",
        "seconds": seconds_int,
        "microseconds": int(microseconds)
    }

def decode_cds_8bytes(hex_str: str) -> dict:
    """
    Decodes CCSDS Day Segmented Time Code (CDS) - 8 Bytes (Custom/Extended).
    Assumed Format: 2 bytes Days, 4 bytes Milliseconds, 2 bytes Microseconds.
    """
    h = hex_str.strip().lower()
    if h.startswith("0x"):
        h = h[2:]
        
    if len(h) != 16: # 8 bytes * 2 chars
        raise ValueError("CDS input must be 8 bytes (16 hex chars)")
        
    # Bytes 0-1: Days since epoch
    days = int(h[0:4], 16)
    
    # Bytes 2-5: Milliseconds of day
    millis = int(h[4:12], 16)
    
    # Bytes 6-7: Microseconds of millisecond (optional extension to fill 8 bytes)
    micros_remainder = int(h[12:16], 16)
    
    total_microseconds = (millis * 1000) + micros_remainder
    
    time_val = CCSDS_EPOCH + timedelta(days=days, microseconds=total_microseconds)
    
    return {
        "type": "CDS (8 bytes)",
        "iso": time_val.isoformat(),
        "epoch": "1958-01-01",
        "days": days,
        "milliseconds": millis,
        "microseconds": micros_remainder
    }
