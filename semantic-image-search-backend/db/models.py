import enum
from datetime import datetime
from typing import Optional, Any

from pgvector.sqlalchemy import Vector
from sqlalchemy import DateTime, Column, func
from sqlmodel import SQLModel, Field, Enum


class Images(SQLModel, table=True):
    id: int = Field(primary_key=True)
    filename: str = Field(unique=True, index=True)
    embedding: Any = Field(sa_column=Column(Vector))
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



