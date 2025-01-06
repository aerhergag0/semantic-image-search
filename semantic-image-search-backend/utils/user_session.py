from typing import Optional
from fastapi import Cookie, Depends, HTTPException
from db.models import User, UserSession
from sqlmodel import Session, select
from db.db import get_db_session
from datetime import datetime

async def validate_session(
        session_id: Optional[str] = Cookie(None),
        db: Session = Depends(get_db_session)
) -> User:
    if not session_id:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated"
        )

    db_session = db.exec(
        select(UserSession)
        .where(UserSession.session_id == session_id)
        .where(UserSession.expires_at > datetime.utcnow())
    ).first()

    if not db_session:
        raise HTTPException(
            status_code=401,
            detail="Session expired or invalid"
        )

    user = db.exec(select(User).where(User.id == db_session.user_id)).first()
    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user