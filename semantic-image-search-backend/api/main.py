import logging

from configs.pydantic_settings import settings
from db.db import create_db_and_tables
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.report import report
from routers.search import search
from routers.upload import upload
from utils.load_models import load_transformers_models

app = FastAPI(docs_url=None, redoc_url=None)
app.include_router(search)
app.include_router(upload)
app.include_router(report)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# logging.basicConfig()
# logger = logging.getLogger('sqlalchemy.engine')
# logger.setLevel(logging.DEBUG)


@app.on_event("startup")
def on_startup():
    logging.info("The application is starting up.")
    create_db_and_tables()
    load_transformers_models()


@app.get("/health")
async def health():
    return {"status": "ok"}
