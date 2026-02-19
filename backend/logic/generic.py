import struct
from typing import List, Any
from pydantic import BaseModel

class FieldDefinition(BaseModel):
    name: str
    size: int # in BITS
    type: str # "ID" (Integer) or "F3" (Float 32-bit - size ignored/fixed to 32)
    # Future types: "BOOL" (1 bit), "U8", "I16", etc. could be simulated with ID + signed flag

class DecommutateRequest(BaseModel):
    hex_stream: str
    schema_list: List[FieldDefinition]

def decommutate_generic(hex_stream: str, schema: List[FieldDefinition]) -> List[dict]:
    """
    Parses a hex stream based on the provided schema with BIT-LEVEL precision.
    """
    # Clean hex stream
    h = hex_stream.strip().lower()
    if h.startswith("0x"):
        h = h[2:]
    
    # Convert hex to a large integer for bitwise operations
    try:
        # We need the total length in bits to align correctly if needed, 
        # but here we treat the stream as a contiguous sequence of bits 
        # starting from the most significant bit of the first byte.
        total_bytes = len(h) // 2
        total_bits = total_bytes * 8
        full_value = int(h, 16)
    except ValueError:
        raise ValueError("Invalid hex stream")
    
    results = []
    current_bit_offset = 0
    
    for field in schema:
        # Determine bit size
        bit_size = field.size
        if field.type.upper() == "F3":
            bit_size = 32
        
        if current_bit_offset + bit_size > total_bits:
             raise ValueError(f"Stream too short for field '{field.name}'. Needed {bit_size} bits, available {total_bits - current_bit_offset}.")

        # Extract bits
        # The stream is treated as Big Endian. 
        # To get the chunk at offset X with size Y:
        # We shift right by (TotalBits - (Offset + Size))
        # Then mask with (1 << Size) - 1
        
        shift_amount = total_bits - (current_bit_offset + bit_size)
        mask = (1 << bit_size) - 1
        
        extracted_int = (full_value >> shift_amount) & mask
        
        value = None
        hex_repr = f"0x{extracted_int:X}"
        
        if field.type.upper() == "ID":
            value = extracted_int
            
        elif field.type.upper() == "F3":
            # Convert the 32-bit integer representation to float
            packed = struct.pack('>I', extracted_int)
            value = struct.unpack('>f', packed)[0]
            
        else:
             raise ValueError(f"Unknown type '{field.type}'")

        results.append({
            "name": field.name,
            "value": value,
            "hex": hex_repr,
            "type": field.type,
            "size_bits": bit_size
        })
        
        current_bit_offset += bit_size
        
    return results
