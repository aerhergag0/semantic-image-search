from fastapi import APIRouter, Depends
from select import select
from sqlmodel import Session, select

from db.db import engine
from db.models import Images, ImagesPublic
from utils.load_models import load_transformers_models

search = APIRouter(prefix="/search", tags=["search"])


@search.get("")
async def search_image(q, models=Depends(load_transformers_models)):
    img_model, text_model = models

    query_embedding = text_model.encode([q], convert_to_tensor=True, show_progress_bar=False).squeeze().detach().numpy()

    search_stmt = (
        select(
            Images.id,
            Images.filename,
            Images.link,
            Images.description,
            Images.uploader,
            Images.uploaded_at,
            Images.updated_at,
            (Images.embedding.cosine_distance(query_embedding)).label('distance')
        )
        .order_by(Images.embedding.cosine_distance(query_embedding))
        .offset(0)
        .limit(12)
    )

    with Session(engine) as session:
        results = session.exec(search_stmt).all()

        results = [ImagesPublic.from_orm(result) for result in results]
        return results
