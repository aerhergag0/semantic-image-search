from fastapi.middleware.cors import CORSMiddleware

from api.main import app
from utils.settings import settings

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
