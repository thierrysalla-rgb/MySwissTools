from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..logic.mil1553 import decommutate_command_word, commutate_command_word, CommandWord

router = APIRouter(prefix="/mil1553", tags=["MIL-STD-1553"])

class HexRequest(BaseModel):
    hex_word: str

class CommutateRequest(BaseModel):
    rt_address: int
    transmit_receive: int
    subaddress_mode: int
    data_word_count_mode_code: int

@router.post("/decommutate")
async def decommutate(request: HexRequest):
    try:
        result = decommutate_command_word(request.hex_word)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/commutate")
async def commutate(request: CommutateRequest):
    try:
        hex_val = commutate_command_word(
            request.rt_address,
            request.transmit_receive,
            request.subaddress_mode,
            request.data_word_count_mode_code
        )
        return {"hex_word": hex_val}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
