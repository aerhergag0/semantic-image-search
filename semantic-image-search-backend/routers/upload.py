import logging
from io import BytesIO

import requests
from PIL import Image
from fastapi import APIRouter, UploadFile, Depends, Form, HTTPException
from fastapi.responses import JSONResponse
from sqlmodel import Session

from db.db import get_db_session
from db.models import Images
from utils.load_models import load_transformers_models

upload = APIRouter(prefix="/upload", tags=["upload"])


@upload.get("")
async def get_upload_page():
    return JSONResponse(status_code=200, content={"message": "get upload page success"})


@upload.post("")
async def file_upload(
    file: UploadFile,
    file_name: str = Form(...),
    link: str = Form(...),
    description: str = Form(...),
    models=Depends(load_transformers_models),
    session: Session = Depends(get_db_session),
):
    if not file:
        return JSONResponse(
            status_code=400,
            content={"message": "file is not found."},
        )

    allowed_content_types = {"image/jpeg", "image/png", "image/gif"}
    if file.content_type not in allowed_content_types:
        return JSONResponse(
            status_code=400,
            content={
                "message": "Unsupported image format. Only JPG, PNG, and GIF are allowed."
            },
        )

    if description is None:
        description = "default description"

    img_model, text_model = models

    try:
        response = requests.get(link)
    except requests.RequestException as e:
        logging.error(f"An error occurred while fetch image from link: {e}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch image from link: {str(e)}"
        )


    try:
        img_embeddings = (
            img_model.encode(
                Image.open(BytesIO(response.content)),
                convert_to_tensor=True,
                show_progress_bar=False,
            )
            .squeeze()
            .detach()
            .numpy()
        )
    except Exception as e:
        logging.error(f"An error occurred while process image embedding: {e}")
        raise HTTPException(
            status_code=500, detail=f"Failed to process image embedding: {str(e)}"
        )

    data = [
        Images(
            filename=file_name,
            embedding=img_embeddings,
            link=link,
            description=description,
            uploader="Guest",
        )
    ]

    try:
        for data in data:
            session.add(data)
            session.commit()
    except Exception as e:
        session.rollback()
        logging.error(f"An error occurred while save image to database: {e}")
        raise HTTPException(
            status_code=500, detail=f"Failed to save image to database: {str(e)}"
        )

    return JSONResponse(status_code=200, content={"message": "upload success"})
