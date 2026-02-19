from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
from ..logic.time_ccsds import decode_cuc_7bytes, decode_cds_8bytes, encode_cuc_7bytes, encode_cds_8bytes, convert_cuc_to_cds, convert_cds_to_cuc

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

class EncodeRequest(BaseModel):
    iso_time: str
    format: str # "CUC7" or "CDS8"

@router.post("/encode")
async def encode_time(request: EncodeRequest):
    try:
        dt = datetime.fromisoformat(request.iso_time.replace('Z', '+00:00'))
        if request.format == "CUC7":
            return {"hex": encode_cuc_7bytes(dt), "format": "CUC7"}
        elif request.format == "CDS8":
            return {"hex": encode_cds_8bytes(dt), "format": "CDS8"}
        else:
            raise HTTPException(status_code=400, detail="Unknown format.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

class CrossConvertRequest(BaseModel):
    hex_time: str
    from_format: str
    to_format: str

@router.post("/cross_convert")
async def cross_convert(request: CrossConvertRequest):
    try:
        if request.from_format == "CUC7" and request.to_format == "CDS8":
            return {"hex": convert_cuc_to_cds(request.hex_time), "from": "CUC7", "to": "CDS8"}
        elif request.from_format == "CDS8" and request.to_format == "CUC7":
            return {"hex": convert_cds_to_cuc(request.hex_time), "from": "CDS8", "to": "CUC7"}
        else:
             raise HTTPException(status_code=400, detail="Unsupported conversion pair.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
