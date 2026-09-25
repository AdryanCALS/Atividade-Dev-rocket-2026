from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.movies import service
from app.movies.schemas import GenreResponse

router = APIRouter()


@router.get("", response_model=list[GenreResponse], summary="Listar todos os gêneros")
async def list_genres(
    db: AsyncSession = Depends(get_db),
) -> list[GenreResponse]:
    genres = await service.list_all_genres(session=db)
    return [GenreResponse.model_validate(g) for g in genres]
