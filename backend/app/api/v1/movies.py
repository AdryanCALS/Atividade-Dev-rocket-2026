import math

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.movies import service
from app.movies.models import DimMovie
from app.movies.schemas import (
    MovieCreate,
    MovieDetailResponse,
    MovieListItem,
    MovieUpdate,
    PaginatedMoviesResponse,
    PaginatedReviewsResponse,
    ReviewCreate,
    ReviewResponse,
)

router = APIRouter()


async def get_valid_movie(
    movie_id: str,
    db: AsyncSession = Depends(get_db),
) -> DimMovie:
    movie = await service.get_movie_by_id(session=db, identifier=movie_id)
    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Filme com identificador '{movie_id}' não encontrado.",
        )
    return movie


@router.get("", response_model=PaginatedMoviesResponse, summary="Listar catálogo paginado")
async def list_movies(
    page: int = Query(1, ge=1, description="Número da página (iniciando em 1)"),
    page_size: int = Query(20, ge=1, le=100, description="Itens por página"),
    q: str | None = Query(None, description="Termo de busca em título, sinopse, diretor ou gênero"),
    sort_by: str = Query(
        "lancamento", pattern="^(lancamento|titulo|nota_media)$", description="Campo de ordenação"
    ),
    order: str = Query("desc", pattern="^(asc|desc)$", description="Direção da ordenação"),
    db: AsyncSession = Depends(get_db),
) -> PaginatedMoviesResponse:
    items, total = await service.list_movies(
        session=db,
        page=page,
        page_size=page_size,
        q=q,
        sort_by=sort_by,
        order=order,
    )
    total_pages = math.ceil(total / page_size) if total > 0 else 0
    return PaginatedMoviesResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.post(
    "",
    response_model=MovieListItem,
    status_code=status.HTTP_201_CREATED,
    summary="Cadastrar novo filme",
)
async def create_movie(
    payload: MovieCreate,
    db: AsyncSession = Depends(get_db),
) -> MovieListItem:
    movie = await service.create_movie(session=db, data=payload)
    return service.build_movie_list_item(movie)


@router.get(
    "/{movie_id}", response_model=MovieDetailResponse, summary="Obter detalhes completos do filme"
)
async def get_movie(
    movie: DimMovie = Depends(get_valid_movie),
) -> MovieDetailResponse:
    return service.build_movie_detail(movie)


@router.put("/{movie_id}", response_model=MovieDetailResponse, summary="Atualizar filme")
async def update_movie(
    payload: MovieUpdate,
    movie: DimMovie = Depends(get_valid_movie),
    db: AsyncSession = Depends(get_db),
) -> MovieDetailResponse:
    updated = await service.update_movie(session=db, movie=movie, data=payload)
    return service.build_movie_detail(updated)


@router.delete("/{movie_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Remover filme")
async def delete_movie(
    movie: DimMovie = Depends(get_valid_movie),
    db: AsyncSession = Depends(get_db),
) -> None:
    await service.delete_movie(session=db, movie=movie)


@router.post(
    "/{movie_id}/reviews",
    response_model=ReviewResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Adicionar avaliação a um filme",
)
async def add_review(
    payload: ReviewCreate,
    movie: DimMovie = Depends(get_valid_movie),
    db: AsyncSession = Depends(get_db),
) -> ReviewResponse:
    return await service.add_review_to_movie(session=db, movie=movie, data=payload)


@router.get(
    "/{movie_id}/reviews",
    response_model=PaginatedReviewsResponse,
    summary="Listar avaliações paginadas do filme",
)
async def list_reviews(
    movie: DimMovie = Depends(get_valid_movie),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> PaginatedReviewsResponse:
    items, total = await service.list_reviews_by_movie(
        session=db, movie=movie, page=page, page_size=page_size
    )
    total_pages = math.ceil(total / page_size) if total > 0 else 0
    return PaginatedReviewsResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )

