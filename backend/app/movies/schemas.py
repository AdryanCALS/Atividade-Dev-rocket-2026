from datetime import date, datetime
from decimal import Decimal
from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field


class ReviewSummaryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    qtd_avaliacoes_usuarios: int = 0
    nota_media_usuarios: float | None = None


class ReviewBase(BaseModel):
    nome: Annotated[str, Field(min_length=1, max_length=120)]
    nota: Annotated[float, Field(ge=0.0, le=10.0)]
    comentario: Annotated[str, Field(min_length=1, max_length=4000)]


class ReviewCreate(ReviewBase):
    pass


class ReviewResponse(ReviewBase):
    model_config = ConfigDict(from_attributes=True)

    sk_movie_review_id: str
    sk_movie_id: str
    created_at: datetime


class MovieBase(BaseModel):
    titulo: Annotated[str, Field(min_length=1, max_length=500)]
    diretor: str | None = None
    ano_lancamento: int | None = None
    data_lancamento: date | None = None
    duracao_minutos: int | None = None
    status_filme: str | None = "Lançado"
    sinopse: str | None = None
    url_poster: str | None = None
    url_backdrop: str | None = None
    generos: list[str] = []


class MovieCreate(MovieBase):
    id_filme: str | None = None


class MovieUpdate(BaseModel):
    titulo: Annotated[str, Field(min_length=1, max_length=500)] | None = None
    diretor: str | None = None
    ano_lancamento: int | None = None
    data_lancamento: date | None = None
    duracao_minutos: int | None = None
    status_filme: str | None = None
    sinopse: str | None = None
    url_poster: str | None = None
    url_backdrop: str | None = None
    generos: list[str] | None = None


class MoviePerformanceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    orcamento_usd: Decimal | None = None
    receita_usd: Decimal | None = None
    lucro_usd: Decimal | None = None
    orcamento_brl: Decimal | None = None
    receita_brl: Decimal | None = None
    lucro_brl: Decimal | None = None
    popularidade: float | None = None
    nota_tmdb: float | None = None
    qtd_tmdb: int | None = None
    nota_imdb: float | None = None
    qtd_imdb: int | None = None


class MovieListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    sk_movie_id: str
    id_filme: str
    titulo: str
    diretor: str | None = None
    ano_lancamento: int | None = None
    data_lancamento: date | None = None
    duracao_minutos: int | None = None
    sinopse: str | None = None
    url_poster: str | None = None
    generos: list[str] = []
    reviews_summary: ReviewSummaryResponse = Field(default_factory=ReviewSummaryResponse)


class MovieDetailResponse(MovieListItem):
    url_backdrop: str | None = None
    status_filme: str | None = None
    atores: list[str] = []
    roteiristas: list[str] = []
    performance: MoviePerformanceResponse | None = None
    recent_reviews: list[ReviewResponse] = []


class PaginatedMoviesResponse(BaseModel):
    items: list[MovieListItem]
    total: int
    page: int
    page_size: int
    total_pages: int


class PaginatedReviewsResponse(BaseModel):
    items: list[ReviewResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class GenreResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    sk_genre_id: str
    nome_genero: str
