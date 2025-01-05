import enum
from datetime import datetime
from typing import Optional, Any

from pgvector.sqlalchemy import Vector
from pydantic import BaseModel
from sqlalchemy import DateTime, Index, Column, func
from sqlmodel import SQLModel, Field, Enum


class Images(SQLModel, table=True):
    __table_args__ = (
        Index(
            "images_embedding_idx",
            "embedding",
            postgresql_using="hnsw",
            postgresql_with={"m": 16, "ef_construction": 64},
            postgresql_ops={"embedding": "vector_cosine_ops"},
        ),
    )
    id: int = Field(primary_key=True)
    filename: str = Field(unique=True)
    embedding: Any = Field(sa_column=Column(Vector(512)))
    link: Optional[str] = Field(default=None)
    description: Optional[str] = Field(default=None)
    uploader: Optional[str] = Field(default=None)
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(), onupdate=func.now())
    )


class ImagesPublic(SQLModel):
    id: int
    filename: str
    link: Optional[str]
    description: Optional[str]
    uploader: Optional[str]
    uploaded_at: datetime
    updated_at: Optional[datetime]
    distance: Optional[float]


class ImagesCreate(SQLModel):
    filename: str
    embedding: Any
    link: Optional[str] = None
    description: Optional[str] = None
    uploader: Optional[str] = "Guest"


class ReportStatus(str, enum.Enum):
    pending = "pending"
    resolved = "resolved"


class ReportCategory(str, enum.Enum):
    inappropriate_content = "inappropriate_content"
    broken_or_empty_image = "broken_or_empty_image"
    violent_image = "violent_image"
    explicit_image = "explicit_image"
    horror = "horror"
    advertisement_spam = "advertisement_spam"
    other = "other"


class ReportCreate(SQLModel):
    post_id: int
    report_category: ReportCategory
    report_reason: Optional[str] = None


class Reports(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    post_id: int
    report_category: ReportCategory = Field(sa_type=Enum(ReportCategory))
    report_reason: Optional[str] = Field(default=None)
    status: ReportStatus = Field(sa_type=Enum(ReportStatus))
    reported_at: datetime = Field(default_factory=datetime.utcnow)
    resolved_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(), onupdate=func.now())
    )


class User(SQLModel, table=True):
    id: int = Field(primary_key=True)
    username: str = Field(unique=True, index=True)
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class UserSession(SQLModel, table=True):
    id: int = Field(primary_key=True)
    session_id: str = Field(unique=True, index=True)
    user_id: int = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: datetime


class UserCreate(BaseModel):
    username: str
    password: str
