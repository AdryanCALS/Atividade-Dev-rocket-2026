from uuid import uuid4

from sqlalchemy import distinct, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.movies.models import (
    DimGenre,
    DimMovie,
    DimPerson,
    DimReview,
    MovieReview,
    bridge_movie_genre,
    bridge_movie_person,
)
from app.movies.schemas import (
    MovieCreate,
    MovieDetailResponse,
    MovieListItem,
    MovieUpdate,
    ReviewCreate,
    ReviewResponse,
)


def build_movie_list_item(movie: DimMovie) -> MovieListItem:
    return MovieListItem.from_orm_movie(movie)


def build_movie_detail(movie: DimMovie) -> MovieDetailResponse:
    return MovieDetailResponse.from_orm_movie(movie)


# Aliases for backwards compatibility
_build_movie_list_item = build_movie_list_item
_build_movie_detail = build_movie_detail



async def get_or_create_genre(session: AsyncSession, name: str) -> DimGenre:
    trimmed = name.strip()
    result = await session.execute(
        select(DimGenre).where(func.lower(DimGenre.nome_genero) == trimmed.lower())
    )
    genre = result.scalar_one_or_none()
    if not genre:
        genre = DimGenre(nome_genero=trimmed)
        session.add(genre)
        await session.flush()
    return genre


async def get_or_create_person(session: AsyncSession, name: str, person_type: str) -> DimPerson:
    trimmed = name.strip()
    result = await session.execute(
        select(DimPerson).where(
            func.lower(DimPerson.nome_pessoa) == trimmed.lower(),
            DimPerson.tipo_pessoa == person_type,
        )
    )
    person = result.scalar_one_or_none()
    if not person:
        person = DimPerson(nome_pessoa=trimmed, tipo_pessoa=person_type)
        session.add(person)
        await session.flush()
    return person


async def get_movie_by_id(session: AsyncSession, identifier: str) -> DimMovie | None:
    stmt = (
        select(DimMovie)
        .where((DimMovie.sk_movie_id == identifier) | (DimMovie.id_filme == identifier))
        .options(
            selectinload(DimMovie.genres),
            selectinload(DimMovie.people),
            selectinload(DimMovie.reviews_summary),
            selectinload(DimMovie.reviews),
            selectinload(DimMovie.performance),
        )
        .execution_options(populate_existing=True)
    )
    result = await session.execute(stmt)
    return result.scalar_one_or_none()


async def create_movie(session: AsyncSession, data: MovieCreate) -> DimMovie:
    id_filme = data.id_filme or f"usr_{uuid4().hex[:10]}"

    resolved_genres: list[DimGenre] = []
    for genre_name in data.generos:
        if genre_name.strip():
            genre = await get_or_create_genre(session, genre_name)
            resolved_genres.append(genre)

    people: list[DimPerson] = []
    if data.diretor and data.diretor.strip():
        director = await get_or_create_person(session, data.diretor, "Diretor")
        people.append(director)

    movie = DimMovie(
        id_filme=id_filme,
        titulo=data.titulo,
        data_lancamento=data.data_lancamento,
        ano_lancamento=data.ano_lancamento
        or (data.data_lancamento.year if data.data_lancamento else None),
        duracao_minutos=data.duracao_minutos,
        status_filme=data.status_filme or "Lançado",
        sinopse=data.sinopse,
        url_poster=data.url_poster,
        url_backdrop=data.url_backdrop,
        genres=resolved_genres,
        people=people,
    )
    summary = DimReview(
        movie=movie,
        qtd_avaliacoes_usuarios=0,
        nota_media_usuarios=None,
    )
    session.add(movie)
    session.add(summary)

    await session.commit()
    loaded_movie = await get_movie_by_id(session, movie.sk_movie_id)
    assert loaded_movie is not None
    return loaded_movie


async def update_movie(session: AsyncSession, movie: DimMovie, data: MovieUpdate) -> DimMovie:
    if data.titulo is not None:
        movie.titulo = data.titulo
    if data.ano_lancamento is not None:
        movie.ano_lancamento = data.ano_lancamento
    if data.data_lancamento is not None:
        movie.data_lancamento = data.data_lancamento
        if data.ano_lancamento is None and data.data_lancamento:
            movie.ano_lancamento = data.data_lancamento.year
    if data.duracao_minutos is not None:
        movie.duracao_minutos = data.duracao_minutos
    if data.status_filme is not None:
        movie.status_filme = data.status_filme
    if data.sinopse is not None:
        movie.sinopse = data.sinopse
    if data.url_poster is not None:
        movie.url_poster = data.url_poster
    if data.url_backdrop is not None:
        movie.url_backdrop = data.url_backdrop

    if data.generos is not None:
        new_genres: list[DimGenre] = []
        for g_name in data.generos:
            if g_name.strip():
                new_genres.append(await get_or_create_genre(session, g_name))
        movie.genres = new_genres

    if data.diretor is not None:
        other_people = [p for p in movie.people if p.tipo_pessoa != "Diretor"]
        if data.diretor.strip():
            director = await get_or_create_person(session, data.diretor, "Diretor")
            other_people.append(director)
        movie.people = other_people

    await session.commit()
    loaded_movie = await get_movie_by_id(session, movie.sk_movie_id)
    assert loaded_movie is not None
    return loaded_movie


async def delete_movie(session: AsyncSession, movie: DimMovie) -> None:
    await session.delete(movie)
    await session.commit()


async def list_movies(
    session: AsyncSession,
    page: int = 1,
    page_size: int = 20,
    q: str | None = None,
    sort_by: str = "lancamento",
    order: str = "desc",
) -> tuple[list[MovieListItem], int]:
    base_query = select(DimMovie)

    if q and q.strip():
        term = f"%{q.strip()}%"
        director_subquery = (
            select(bridge_movie_person.c.sk_movie_id)
            .join(DimPerson, DimPerson.sk_person_id == bridge_movie_person.c.sk_person_id)
            .where(
                DimPerson.nome_pessoa.ilike(term),
                DimPerson.tipo_pessoa == "Diretor",
            )
        )
        genre_subquery = (
            select(bridge_movie_genre.c.sk_movie_id)
            .join(DimGenre, DimGenre.sk_genre_id == bridge_movie_genre.c.sk_genre_id)
            .where(DimGenre.nome_genero.ilike(term))
        )
        base_query = base_query.where(
            (DimMovie.titulo.ilike(term))
            | (DimMovie.sinopse.ilike(term))
            | (DimMovie.sk_movie_id.in_(director_subquery))
            | (DimMovie.sk_movie_id.in_(genre_subquery))
        )

    # Count total
    count_stmt = select(func.count(distinct(DimMovie.sk_movie_id)))
    if base_query.whereclause is not None:
        count_stmt = count_stmt.where(base_query.whereclause)
    total = (await session.execute(count_stmt)).scalar() or 0

    # Sorting
    if sort_by == "titulo":
        sort_col = DimMovie.titulo
    elif sort_by == "nota_media":
        base_query = base_query.outerjoin(DimReview, DimMovie.sk_movie_id == DimReview.sk_movie_id)
        sort_col = DimReview.nota_media_usuarios
    else:  # lancamento
        sort_col = DimMovie.data_lancamento

    if order.lower() == "asc":
        base_query = base_query.order_by(sort_col.asc().nulls_last())
    else:
        base_query = base_query.order_by(sort_col.desc().nulls_last())

    offset = (page - 1) * page_size
    stmt = (
        base_query.offset(offset)
        .limit(page_size)
        .options(
            selectinload(DimMovie.genres),
            selectinload(DimMovie.people),
            selectinload(DimMovie.reviews_summary),
        )
    )

    result = await session.execute(stmt)
    movies = result.scalars().all()
    items = [build_movie_list_item(m) for m in movies]
    return items, total


async def add_review_to_movie(
    session: AsyncSession, movie: DimMovie, data: ReviewCreate
) -> ReviewResponse:
    review = MovieReview(
        sk_movie_id=movie.sk_movie_id,
        nome=data.nome,
        nota=float(data.nota),
        comentario=data.comentario,
    )
    session.add(review)
    await session.flush()

    # Recalculate summary metrics for this movie
    agg_stmt = select(
        func.count(MovieReview.sk_movie_review_id),
        func.avg(MovieReview.nota),
    ).where(MovieReview.sk_movie_id == movie.sk_movie_id)

    agg_result = await session.execute(agg_stmt)
    count, avg_score = agg_result.one()

    if not movie.reviews_summary:
        movie.reviews_summary = DimReview(
            sk_movie_id=movie.sk_movie_id,
            qtd_avaliacoes_usuarios=count or 0,
            nota_media_usuarios=round(avg_score, 2) if avg_score is not None else None,
        )
        session.add(movie.reviews_summary)
    else:
        movie.reviews_summary.qtd_avaliacoes_usuarios = count or 0
        movie.reviews_summary.nota_media_usuarios = (
            round(avg_score, 2) if avg_score is not None else None
        )

    movie.reviews.append(review)
    await session.commit()
    await session.refresh(review)
    return ReviewResponse.model_validate(review)


async def list_reviews_by_movie(
    session: AsyncSession,
    movie: DimMovie,
    page: int = 1,
    page_size: int = 20,
) -> tuple[list[ReviewResponse], int]:
    count_stmt = select(func.count(MovieReview.sk_movie_review_id)).where(
        MovieReview.sk_movie_id == movie.sk_movie_id
    )
    total = (await session.execute(count_stmt)).scalar() or 0

    offset = (page - 1) * page_size
    stmt = (
        select(MovieReview)
        .where(MovieReview.sk_movie_id == movie.sk_movie_id)
        .order_by(MovieReview.created_at.desc())
        .offset(offset)
        .limit(page_size)
    )
    result = await session.execute(stmt)
    reviews = result.scalars().all()
    return [ReviewResponse.model_validate(r) for r in reviews], total


async def list_all_genres(session: AsyncSession) -> list[DimGenre]:
    stmt = select(DimGenre).order_by(DimGenre.nome_genero.asc())
    result = await session.execute(stmt)
    return list(result.scalars().all())
