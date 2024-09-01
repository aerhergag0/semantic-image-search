from fastapi import APIRouter, Depends, Query
from select import select
from sqlmodel import Session, select

from db.db import engine
from db.models import Images, ImagesPublic
from utils.load_models import load_transformers_models

search = APIRouter(prefix="/search", tags=["search"])


@search.get("")
async def search_image(
    q: str, page: int = Query(1, ge=1), models=Depends(load_transformers_models)
):

    img_model, text_model = models

    query_embedding = (
        text_model.encode([q], convert_to_tensor=True, show_progress_bar=False)
        .squeeze()
        .detach()
        .numpy()
    )

    items_per_page = 12
    offset = (page - 1) * items_per_page

    search_stmt = (
        select(
            Images.id,
            Images.filename,
            Images.link,
            Images.description,
            Images.uploader,
            Images.uploaded_at,
            Images.updated_at,
            (Images.embedding.cosine_distance(query_embedding)).label("distance"),
        )
        .order_by(Images.embedding.cosine_distance(query_embedding))
        .offset(offset)
        .limit(items_per_page)
    )

    with Session(engine) as session:
        results = session.exec(search_stmt).all()

        results = [ImagesPublic.from_orm(result) for result in results]

        next_page_exists = len(results) == items_per_page

        return {"images": results, "page": page, "has_next": next_page_exists}
