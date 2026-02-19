from pydantic import BaseModel

class CommandWord(BaseModel):
    remote_terminal_address: int
    transmit_receive: int
    subaddress_mode: int
    data_word_count_mode_code: int
    hex_value: str

def decommutate_command_word(hex_word: str) -> CommandWord:
    """
    Decommutates a 16-bit MIL-STD-1553 Command Word.
    
    Structure (16 bits):
    - Bits 11-15 (5 bits): Remote Terminal Address (RT)
    - Bit 10 (1 bit): Transmit/Receive (T/R)
    - Bits 5-9 (5 bits): Subaddress/Mode (SA)
    - Bits 0-4 (5 bits): Data Word Count/Mode Code (WC/MC)
    """
    try:
        val = int(hex_word, 16)
        if val > 0xFFFF:
            raise ValueError("Value exceeds 16 bits")
            
        rt_address = (val >> 11) & 0x1F
        tr_bit = (val >> 10) & 0x1
        subaddress = (val >> 5) & 0x1F
        word_count = val & 0x1F
        
        return CommandWord(
            remote_terminal_address=rt_address,
            transmit_receive=tr_bit,
            subaddress_mode=subaddress,
            data_word_count_mode_code=word_count,
            hex_value=f"0x{val:04X}"
        )
    except ValueError:
        raise ValueError("Invalid hex string")

def commutate_command_word(rt: int, tr: int, sa: int, wc: int) -> str:
    """
    Commutates fields into a 16-bit MIL-STD-1553 Command Word.
    """
    if not (0 <= rt <= 31): raise ValueError("RT Address must be 0-31")
    if not (0 <= tr <= 1): raise ValueError("T/R Bit must be 0-1")
    if not (0 <= sa <= 31): raise ValueError("Subaddress must be 0-31")
    if not (0 <= wc <= 31): raise ValueError("Word Count must be 0-31")
    
    val = (rt << 11) | (tr << 10) | (sa << 5) | wc
    return f"0x{val:04X}"
