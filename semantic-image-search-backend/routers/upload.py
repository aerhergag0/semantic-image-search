import io
import os
import uuid

from PIL import Image
from fastapi import APIRouter, UploadFile, Depends
from fastapi.responses import JSONResponse
from sqlmodel import Session

from configs.pydantic_settings import settings
from db.db import engine
from db.models import Images
from utils.load_models import load_transformers_models

upload = APIRouter(prefix="/upload", tags=["upload"])


@upload.get("")
async def get_upload_page():
    return JSONResponse(status_code=200, content={"message": "get upload page success"})


@upload.post("")
async def file_upload(file: UploadFile, models=Depends(load_transformers_models)):
    if not file:
        return JSONResponse(status_code=400, content={"message": "file is not found."})

    if not file.content_type.startswith("image"):
        return JSONResponse(status_code=400, content={"message": "file is not image."})

    img_model, text_model = models

    contents = await file.read()
    image = Image.open(io.BytesIO(contents))

    save_directory = settings.UPLOADS_PATH

    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(save_directory, unique_filename)

    with open(file_path, "wb") as buffer:
        buffer.write(contents)

    to_vectorize_img_paths = [file_path]

    img_embeddings = img_model.encode([Image.open(filepath) for filepath in to_vectorize_img_paths],
                                      convert_to_tensor=True,
                                      show_progress_bar=False).squeeze().detach().numpy()

    data = [
        Images(
            filename=unique_filename,
            embedding=img_embeddings,
            link=settings.S3_BUCKET_PATH + "/" + unique_filename,
            # link=file_path,
            description="Image : " + unique_filename,
            uploader="admin"
        )
    ]

    with Session(engine) as session:
        for data in data:
            session.add(data)
            session.commit()

    return JSONResponse(status_code=200, content={"message": "upload success"})
