from pydantic import BaseModel

class SpaceWireAddress(BaseModel):
    value: int
    hex_value: str
    type: str
    description: str

def analyze_spw_address(address: int) -> SpaceWireAddress:
    """
    Analyzes a SpaceWire address byte (0-255).
    """
    if not (0 <= address <= 255):
        raise ValueError("SpaceWire address must be a byte (0-255)")
    
    hex_val = f"0x{address:02X}"
    
    if 0 <= address <= 31:
        return SpaceWireAddress(
            value=address,
            hex_value=hex_val,
            type="Path Address",
            description=f"Routes to output port {address}"
        )
    elif 32 <= address <= 255:
        return SpaceWireAddress(
            value=address,
            hex_value=hex_val,
            type="Logical Address",
            description="Destined for specific node or regional routing"
        )
    else:
        # Should be unreachable due to check above
        raise ValueError("Invalid address")
