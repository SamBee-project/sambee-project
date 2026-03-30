from fastapi import APIRouter

router = APIRouter()


@router.get("/hives")
async def get_hives():
    return {"items": []}
