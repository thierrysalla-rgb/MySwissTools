from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..logic.ieee754 import float_to_hex, hex_to_float

router = APIRouter(prefix="/ieee754", tags=["IEEE754"])

class FloatRequest(BaseModel):
    value: float

class HexRequest(BaseModel):
    value: str

@router.post("/to_hex")
async def convert_to_hex(request: FloatRequest):
    try:
        hex_val = float_to_hex(request.value)
        return {"hex": hex_val}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/to_float")
async def convert_to_float(request: HexRequest):
    try:
        float_val = hex_to_float(request.value)
        return {"float": float_val}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
