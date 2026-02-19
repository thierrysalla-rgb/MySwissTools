from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..logic.can import analyze_can_id

router = APIRouter(prefix="/can", tags=["CAN"])

class CANRequest(BaseModel):
    hex_id: str

@router.post("/analyze")
async def analyze(request: CANRequest):
    try:
        return analyze_can_id(request.hex_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
