from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.routers import matching

app = FastAPI(title="CareerGenomics")

# CORS configuration for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    """Health check endpoint to verify API is running."""
    return {
        "status": "up",
    }

# Include routers
app.include_router(matching.router, prefix="/v1", tags=["matching"])
