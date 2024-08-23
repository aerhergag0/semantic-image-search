from io import BytesIO

import requests
from PIL import Image
from fastapi import APIRouter, UploadFile, Depends, Form
from fastapi.responses import JSONResponse
from sqlmodel import Session

from db.db import engine
from db.models import Images
from utils.load_models import load_transformers_models

upload = APIRouter(prefix="/upload", tags=["upload"])


@upload.get("")
async def get_upload_page():
    return JSONResponse(status_code=200, content={"message": "get upload page success"})


@upload.post("")
async def file_upload(file: UploadFile,
                      file_name: str = Form(...),
                      link: str = Form(...),
                      description: str = Form(...),
                      models=Depends(load_transformers_models)):
    if not file:
        return JSONResponse(status_code=400, content={"message": "file is not found."})

    if not file.content_type.startswith("image"):
        return JSONResponse(status_code=400, content={"message": "file is not image."})

    img_model, text_model = models

    res = requests.get(link)

    img_embeddings = img_model.encode(Image.open(BytesIO(res.content)),
                                      convert_to_tensor=True,
                                      show_progress_bar=False).squeeze().detach().numpy()

    data = [
        Images(
            filename=file_name,
            embedding=img_embeddings,
            link=link,
            description=description,
            uploader="admin"
        )
    ]

    with Session(engine) as session:
        for data in data:
            session.add(data)
            session.commit()

    return JSONResponse(status_code=200, content={"message": "upload success"})
