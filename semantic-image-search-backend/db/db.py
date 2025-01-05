import logging
from datetime import datetime

from configs.pydantic_settings import settings
from db.models import UserSession
from sqlalchemy import create_engine
from sqlmodel import SQLModel, Session, select

DATABASE_URL = settings.POSTGRESQL_DB_URL

engine = create_engine(DATABASE_URL)


def create_db_and_tables():
    try:
        SQLModel.metadata.create_all(engine)
    except Exception as e:
        logging.error(f"An error occurred while create db: {e}")
        raise


def cleanup_expired_sessions():
    try:
        session = get_db_session().__next__()

        expired_sessions = session.exec(
            select(UserSession)
            .where(UserSession.expires_at < datetime.utcnow())
        ).all()

        for expired_session in expired_sessions:
            session.delete(expired_session)

        session.commit()
        logging.info(f"Cleaned up {len(expired_sessions)} expired sessions")

    except Exception as e:
        logging.error(f"Error cleaning up expired sessions: {str(e)}")


def get_db_session():
    with Session(engine) as session:
        yield session
