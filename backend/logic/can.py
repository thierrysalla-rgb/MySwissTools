from pydantic import BaseModel
from typing import Optional

class CANAnalysis(BaseModel):
    hex_id: str
    id_type: str # "Standard" or "Extended"
    binary_str: str
    base_id: Optional[str] = None # 11 bits for Std, or top 11 of 29 for Ext
    extended_id: Optional[str] = None # Lower 18 bits for Ext

def analyze_can_id(hex_id: str) -> CANAnalysis:
    """
    Analyzes a CAN Identifier.
    Auto-detects Standard (<= 0x7FF) vs Extended (> 0x7FF or explicit request).
    For the purpose of this tool, we assume:
    - If value <= 0x7FF (11 bits), treat as Standard.
    - If value > 0x7FF (up to 0x1FFFFFFF), treat as Extended.
    """
    try:
        # Clean string
        h = hex_id.strip().lower()
        if h.startswith("0x"):
            h = h[2:]
        
        val = int(h, 16)
        
        if val > 0x1FFFFFFF:
            raise ValueError("ID exceeds 29-bit CAN Extended range")
            
        # Determine type based on value magnitude for simplicity
        # (Real CAN frames have an IDE bit, here we strictly look at the ID value)
        if val <= 0x7FF:
            # Standard 11-bit
            return CANAnalysis(
                hex_id=f"0x{val:03X}",
                id_type="Standard (11-bit)",
                binary_str=f"{val:011b}",
                base_id=f"0x{val:03X}"
            )
        else:
            # Extended 29-bit
            # Composition: Base ID (11 bits) + Extended ID (18 bits)
            # Actually in J1939/CAN 2.0B:
            # ID 28-18 (11 bits) = Base ID
            # ID 17-0 (18 bits) = Extended ID
            
            base = (val >> 18) & 0x7FF
            ext = val & 0x3FFFF
            
            return CANAnalysis(
                hex_id=f"0x{val:08X}",
                id_type="Extended (29-bit)",
                binary_str=f"{val:029b}",
                base_id=f"0x{base:03X}",
                extended_id=f"0x{ext:05X}"
            )
            
    except ValueError:
        raise ValueError("Invalid Hex ID")
