from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from logic.time_ccsds import decode_cuc_7bytes, decode_cds_8bytes

router = APIRouter(prefix="/time", tags=["CCSDS Time"])

class TimeRequest(BaseModel):
    hex_time: str
    format: str # "CUC7" or "CDS8"

@router.post("/convert")
async def convert_time(request: TimeRequest):
    try:
        if request.format == "CUC7":
            return decode_cuc_7bytes(request.hex_time)
        elif request.format == "CDS8":
            return decode_cds_8bytes(request.hex_time)
        else:
            raise HTTPException(status_code=400, detail="Unknown format. Use 'CUC7' or 'CDS8'.")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
