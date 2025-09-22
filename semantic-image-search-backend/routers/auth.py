import secrets
from datetime import datetime, timedelta
from typing import Optional

from db.db import get_db_session
from db.models import User, UserSession
from fastapi import APIRouter, Depends, Response, Cookie, Form, HTTPException
from fastapi.responses import JSONResponse
from passlib.context import CryptContext
from sqlmodel import Session as DBSession, select

auth = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_session(user_id: int, session: DBSession) -> str:
    existing_sessions = session.exec(
        select(UserSession).where(UserSession.user_id == user_id)
    ).all()
    for existing_session in existing_sessions:
        session.delete(existing_session)

    session_id = secrets.token_urlsafe(32)
    db_session = UserSession(
        session_id=session_id,
        user_id=user_id,
        expires_at=datetime.utcnow() + timedelta(days=1)
    )
    session.add(db_session)
    session.commit()
    return session_id


async def get_current_user(
        session_id: Optional[str] = Cookie(None),
        db: DBSession = Depends(get_db_session)
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


@auth.post("/register")
async def register(
        username: str = Form(...),
        password: str = Form(...),
        session: DBSession = Depends(get_db_session)
):
    existing_user = session.exec(
        select(User).where(User.username == username)
    ).first()
    if existing_user:
        return JSONResponse(
            status_code=400,
            content={
                "message": "Username already registered"
            }
        )

    user = User(
        username=username,
        password_hash=get_password_hash(password)
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return JSONResponse(
        status_code=200,
        content={
            "message": "User created successfully"
        }
    )


@auth.post("/login")
async def login(
        response: Response,
        username: str = Form(...),
        password: str = Form(...),
        remember_me: bool = Form(False),
        session: DBSession = Depends(get_db_session)
):
    try:
        if not username or not password:
            return JSONResponse(
                status_code=400,
                content={
                    "message": "Username and password are required"
                }
            )

        user = session.exec(
            select(User).where(User.username == username)
        ).first()

        if not user or not verify_password(password, user.password_hash):
            return JSONResponse(
                status_code=401,
                content={
                    "message": "Incorrect username or password"
                }
            )

        session_duration = timedelta(days=30) if remember_me else timedelta(hours=1)
        token = secrets.token_urlsafe(32)

        existing_sessions = session.exec(
            select(UserSession).where(UserSession.user_id == user.id)
        ).all()
        for existing_session in existing_sessions:
            session.delete(existing_session)

        db_session = UserSession(
            session_id=token,
            user_id=user.id,
            expires_at=datetime.utcnow() + session_duration
        )
        session.add(db_session)
        session.commit()

        response.set_cookie(
            key="session_id",
            value=token,
            httponly=True,
            secure=False,  # 개발 환경에서는 False, 프로덕션에서는 True
            samesite="lax",
            path="/",
            max_age=session_duration.total_seconds()
        )

        return {
            "message": "Successfully logged in"
        }

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "message": f"Error during login: {str(e)}"
            }
        )


@auth.post("/logout")
async def logout(
        response: Response,
        session_id: str = Cookie(None),
        db: DBSession = Depends(get_db_session)
):
    try:
        if session_id:
            db_session = db.exec(
                select(UserSession).where(UserSession.session_id == session_id)
            ).first()

            if db_session:
                db.delete(db_session)
                db.commit()

        response.delete_cookie(
            key="session_id", 
            path="/",
            secure=False,  # login과 동일하게 설정
            httponly=True, 
            samesite="lax"  # login과 동일하게 설정
        )

        return {"message": "Successfully logged out"}
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"message": f"Error during logout: {str(e)}"}
        )


@auth.get("/me")
async def get_current_user_info(
        session_id: Optional[str] = Cookie(None),
        db: DBSession = Depends(get_db_session)
):
    if not session_id:
        return JSONResponse(
            status_code=401,
            content={
                "message": "Not authenticated"
            }
        )

    db_session = db.exec(
        select(UserSession)
        .where(UserSession.session_id == session_id)
        .where(UserSession.expires_at > datetime.utcnow())
    ).first()

    if not db_session:
        return JSONResponse(
            status_code=401,
            content={
                "message": "Session expired or invalid"
            }
        )

    user = db.exec(select(User).where(User.id == db_session.user_id)).first()
    if not user:
        return JSONResponse(
            status_code=401,
            content={
                "message": "User not found"
            }
        )

    return JSONResponse(
        status_code=200,
        content={
            "username": user.username
        }
    )
