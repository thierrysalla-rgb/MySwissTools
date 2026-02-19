from fastapi import APIRouter, HTTPException
from ..logic.generic import decommutate_generic, DecommutateRequest

router = APIRouter(prefix="/generic", tags=["Generic Decommutator"])

@router.post("/decommutate")
async def decommutate(request: DecommutateRequest):
    try:
        results = decommutate_generic(request.hex_stream, request.schema_list)
        return {"results": results}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
