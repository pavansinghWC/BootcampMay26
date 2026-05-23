from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from config import settings
from database import get_client, get_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    # verify Atlas connection on startup
    try:
        await get_db().command("ping")
        print("MongoDB Atlas connected.")
    except Exception as e:
        print(f"MongoDB connection warning: {e}")
    yield
    get_client().close()


app = FastAPI(title="Growth Leap API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/healthz", tags=["health"])
async def healthz():
    try:
        await get_db().command("ping")
        db_status = "connected"
    except Exception:
        db_status = "error"
    return {"status": "ok", "db": db_status, "env": settings.APP_ENV}


# Routers registered after S1+
from routers import auth, cohort, arc, today, quiet, celebration, preview  # noqa: E402

app.include_router(auth.router)
app.include_router(cohort.router)
app.include_router(arc.router)
app.include_router(today.router)
app.include_router(quiet.router)
app.include_router(celebration.router)
app.include_router(preview.router)
