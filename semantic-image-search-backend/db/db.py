from sqlalchemy import create_engine
from sqlmodel import SQLModel

from configs.pydantic_settings import settings

DATABASE_URL = settings.POSTGRESQL_DB_URL

engine = create_engine(DATABASE_URL)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
