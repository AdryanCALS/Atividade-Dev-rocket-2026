import pytest
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.seed import run_seed
from app.movies.models import DimGenre, DimMovie, DimPerson, DimReview


@pytest.mark.asyncio
async def test_seed_sample_populates_database(db_session: AsyncSession) -> None:
    # Run seed with a small sample of 5 movies
    await run_seed(
        session=db_session,
        sample_size=5,
        data_dir="../data",
    )

    # Verify movies count
    movie_count = (await db_session.execute(select(func.count(DimMovie.sk_movie_id)))).scalar()
    assert movie_count == 5

    # Verify related entities were populated
    genre_count = (await db_session.execute(select(func.count(DimGenre.sk_genre_id)))).scalar()
    assert genre_count is not None and genre_count > 0

    people_count = (await db_session.execute(select(func.count(DimPerson.sk_person_id)))).scalar()
    assert people_count is not None and people_count > 0

    review_summary_count = (
        await db_session.execute(select(func.count(DimReview.sk_review_id)))
    ).scalar()
    assert review_summary_count is not None and review_summary_count > 0
