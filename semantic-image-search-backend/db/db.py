from sqlalchemy import create_engine, text
from sqlmodel import SQLModel, Session

from utils.settings import settings

DATABASE_URL = settings.POSTGRESQL_DB_URL

engine = create_engine(DATABASE_URL)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
