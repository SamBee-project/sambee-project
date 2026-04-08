from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_hives():
    return {"message": "Список вуликів порожній, але API працює!"}
