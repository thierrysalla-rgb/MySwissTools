from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="MySwissToolbox API", version="1.0.0")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development convenience
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to MySwissToolbox API"}

from routers import ieee754, mil1553, spw, can, generic, time_ccsds
app.include_router(ieee754.router)
app.include_router(mil1553.router)
app.include_router(spw.router)
app.include_router(can.router)
app.include_router(generic.router)
app.include_router(time_ccsds.router)
