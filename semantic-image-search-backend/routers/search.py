from fastapi import APIRouter

search = APIRouter(prefix="/search", tags=["search"])


@search.get("")
async def get_search_page():
    return {"message": "Search endpoint"}
