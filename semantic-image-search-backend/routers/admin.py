from typing import Union

from fastapi import APIRouter
from sqlmodel import Session, select

from db.db import engine
from db.models import Images

from sentence_transformers import SentenceTransformer

admin = APIRouter(prefix="/admin", tags=["admin"])


@admin.get("/start-embedding")
async def start_embedding():
    return {"message": "start embedding"}


@admin.get("/test-insert-data")
async def test_insert_data():
    example_data = [
        Images(
            filename="test1.jpg",
            embedding=[0.1, 0.2, 0.3, 0.4],
            link="https://test1.jpg",
            description="This is test1",
            uploader="admin"
        ),

        Images(
            filename="test2.jpg",
            embedding=[0.5, 0.6, 0.7, 0.8],
            link="https://test2.jpg",
            description="This is test2",
            uploader="admin"
        ),

        Images(
            filename="test3.jpg",
            embedding=[0.9, 0.10, 0.11, 0.12],
            link="https://test3.jpg",
            description="This is test3",
        )
    ]

    with Session(engine) as session:
        for data in example_data:
            session.add(data)
            session.commit()

    return {"message": "test insert data"}


@admin.get("/get-data")
async def get_data(q, uploader: Union[str, None] = None):
    with Session(engine) as session:
        if uploader:
            result = session.exec(select(Images).where(Images.filename.startswith(q), Images.uploader == uploader)).all()
        else:
            result = session.exec(select(Images).where(Images.filename.startswith(q))).all()

    print(result)

    return {"result": str(result)}



@admin.get("/get-model")
async def get_model():
    print("Loading image and text models...")
    img_model = SentenceTransformer('clip-ViT-B-32')
    print("img model loaded!")
    text_model = SentenceTransformer('sentence-transformers/clip-ViT-B-32-multilingual-v1')
    print("text model loaded!")

    return {"message": "get model"}


@admin.get("/get-images")
async def get_images():
    img_path = 
    return {"images": images}