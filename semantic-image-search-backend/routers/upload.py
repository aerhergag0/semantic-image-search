from fastapi import APIRouter

upload = APIRouter(prefix="/upload", tags=["upload"])


@upload.get("")
async def get_upload_page():
    return {"message": "Upload endpoint"}
