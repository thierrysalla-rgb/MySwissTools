import os
import sys
from fastapi import FastAPI, Request, APIRouter
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

# Ensure the current directory is in the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

app = FastAPI(title="MySwissToolbox API", version="1.0.0")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development convenience
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal Server Error: {str(exc)}"},
    )

@app.get("/")
async def root():
    return {"message": "Welcome to MySwissToolbox API"}

from routers import ieee754, mil1553, spw, can, generic, time_ccsds

api_router = APIRouter(prefix="/api")
api_router.include_router(ieee754.router)
api_router.include_router(mil1553.router)
api_router.include_router(spw.router)
api_router.include_router(can.router)
api_router.include_router(generic.router)
api_router.include_router(time_ccsds.router)

app.include_router(api_router)
