from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..logic.spw import analyze_spw_address

router = APIRouter(prefix="/spw", tags=["SpaceWire"])

class SPWRequest(BaseModel):
    address: int

@router.post("/analyze")
async def analyze(request: SPWRequest):
    try:
        return analyze_spw_address(request.address)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
