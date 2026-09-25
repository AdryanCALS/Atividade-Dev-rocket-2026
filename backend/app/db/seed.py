import argparse
import asyncio
import csv
from datetime import datetime
from decimal import Decimal
from pathlib import Path
from typing import Any

from sqlalchemy.dialects.sqlite import insert as sqlite_insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import get_logger
from app.db.base import Base
from app.db.session import AsyncSessionLocal, engine
from app.movies.models import (
    DimCompany,
    DimGenre,
    DimMovie,
    DimPerson,
    DimReview,
    FactMoviePerformance,
    MovieReview,
    bridge_movie_company,
    bridge_movie_genre,
    bridge_movie_person,
)

logger = get_logger("seed")


def parse_date(value: str | None) -> Any:
    if not value or not value.strip():
        return None
    try:
        return datetime.strptime(value.strip()[:10], "%Y-%m-%d").date()
    except (ValueError, TypeError):
        return None


def parse_int(value: str | None) -> int | None:
    if not value or not value.strip():
        return None
    try:
        return int(float(value.strip()))
    except (ValueError, TypeError):
        return None


def parse_float(value: str | None) -> float | None:
    if not value or not value.strip():
        return None
    try:
        return float(value.strip())
    except (ValueError, TypeError):
        return None


def parse_decimal(value: str | None) -> Decimal | None:
    if not value or not value.strip():
        return None
    try:
        return Decimal(value.strip())
    except Exception:
        return None


def resolve_data_dir(hint: str | None = None) -> Path:
    candidates = [
        Path(hint) if hint else None,
        Path("data"),
        Path("../data"),
        Path("../../data"),
        Path(__file__).resolve().parent.parent.parent.parent / "data",
    ]
    for c in candidates:
        if c and c.exists() and (c / "dim_movies.csv").exists():
            return c.resolve()
    raise FileNotFoundError(
        "Diretório de dados CSV não encontrado. Verifique o caminho para a pasta 'data'."
    )


def read_csv(path: Path) -> list[dict[str, str]]:
    with open(path, encoding="utf-8-sig", errors="replace") as f:
        reader = csv.DictReader(f)
        return list(reader)


async def run_seed(
    session: AsyncSession,
    sample_size: int | None = 100,
    data_dir: str | None = None,
) -> None:
    data_path = resolve_data_dir(data_dir)
    logger.info("Iniciando seed a partir de %s (amostra: %s)", data_path, sample_size or "COMPLETO")

    # 1. Read movies
    movies_raw = read_csv(data_path / "dim_movies.csv")
    if sample_size and sample_size > 0:
        movies_raw = movies_raw[:sample_size]

    valid_movie_ids = {row["sk_movie_id"] for row in movies_raw if row.get("sk_movie_id")}

    # 2. Read bridges to determine needed related dimensions
    movie_genres_raw = [
        row
        for row in read_csv(data_path / "bridge_movie_genre.csv")
        if row.get("sk_movie_id") in valid_movie_ids
    ]
    movie_companies_raw = [
        row
        for row in read_csv(data_path / "bridge_movie_company.csv")
        if row.get("sk_movie_id") in valid_movie_ids
    ]
    movie_people_raw = [
        row
        for row in read_csv(data_path / "bridge_movie_person.csv")
        if row.get("sk_movie_id") in valid_movie_ids
    ]

    valid_genre_ids = {row["sk_genre_id"] for row in movie_genres_raw if row.get("sk_genre_id")}
    valid_company_ids = {
        row["sk_company_id"] for row in movie_companies_raw if row.get("sk_company_id")
    }
    valid_person_ids = {row["sk_person_id"] for row in movie_people_raw if row.get("sk_person_id")}

    # 3. Read independent dimensions
    genres_raw = read_csv(data_path / "dim_genres.csv")
    if sample_size:
        genres_raw = [r for r in genres_raw if r.get("sk_genre_id") in valid_genre_ids]

    companies_raw = read_csv(data_path / "dim_companies.csv")
    if sample_size:
        companies_raw = [r for r in companies_raw if r.get("sk_company_id") in valid_company_ids]

    people_raw = read_csv(data_path / "dim_people.csv")
    if sample_size:
        people_raw = [r for r in people_raw if r.get("sk_person_id") in valid_person_ids]

    # 4. Read performance, summaries, and reviews
    perf_raw = [
        row
        for row in read_csv(data_path / "fact_movies_performance.csv")
        if row.get("sk_movie_id") in valid_movie_ids
    ]
    summaries_raw = [
        row
        for row in read_csv(data_path / "dim_reviews.csv")
        if row.get("sk_movie_id") in valid_movie_ids
    ]
    reviews_raw = [
        row
        for row in read_csv(data_path / "movies_reviews.csv")
        if row.get("sk_movie_id") in valid_movie_ids
    ]

    # Insert into database in dependency order
    # DimGenre
    genres_data = [
        {"sk_genre_id": r["sk_genre_id"], "nome_genero": r["nome_genero"].strip()}
        for r in genres_raw
        if r.get("sk_genre_id") and r.get("nome_genero")
    ]
    if genres_data:
        await session.execute(sqlite_insert(DimGenre).on_conflict_do_nothing(), genres_data)

    # DimCompany
    companies_data = [
        {"sk_company_id": r["sk_company_id"], "nome_produtora": r["nome_produtora"].strip()}
        for r in companies_raw
        if r.get("sk_company_id") and r.get("nome_produtora")
    ]
    if companies_data:
        await session.execute(sqlite_insert(DimCompany).on_conflict_do_nothing(), companies_data)

    # DimPerson (deduplicated by sk_person_id)
    seen_people = set()
    people_data = []
    for r in people_raw:
        pid = r.get("sk_person_id")
        if pid and pid not in seen_people:
            seen_people.add(pid)
            people_data.append(
                {
                    "sk_person_id": pid,
                    "nome_pessoa": r["nome_pessoa"].strip(),
                    "tipo_pessoa": r["tipo_pessoa"].strip(),
                }
            )
    if people_data:
        await session.execute(sqlite_insert(DimPerson).on_conflict_do_nothing(), people_data)

    # DimMovie
    movies_data = [
        {
            "sk_movie_id": r["sk_movie_id"],
            "id_filme": r["id_filme"].strip(),
            "titulo": r["titulo"].strip(),
            "data_lancamento": parse_date(r.get("data_lancamento")),
            "ano_lancamento": parse_int(r.get("ano_lancamento")),
            "duracao_minutos": parse_int(r.get("duracao_minutos")),
            "status_filme": r.get("status_filme") or "Lançado",
            "sinopse": r.get("sinopse"),
            "url_poster": r.get("url_poster"),
            "url_backdrop": r.get("url_backdrop"),
        }
        for r in movies_raw
        if r.get("sk_movie_id")
    ]
    if movies_data:
        await session.execute(sqlite_insert(DimMovie).on_conflict_do_nothing(), movies_data)

    # Bridges
    if movie_genres_raw:
        await session.execute(
            sqlite_insert(bridge_movie_genre).on_conflict_do_nothing(),
            [
                {"sk_movie_id": r["sk_movie_id"], "sk_genre_id": r["sk_genre_id"]}
                for r in movie_genres_raw
            ],
        )

    if movie_companies_raw:
        await session.execute(
            sqlite_insert(bridge_movie_company).on_conflict_do_nothing(),
            [
                {"sk_movie_id": r["sk_movie_id"], "sk_company_id": r["sk_company_id"]}
                for r in movie_companies_raw
            ],
        )

    if movie_people_raw:
        await session.execute(
            sqlite_insert(bridge_movie_person).on_conflict_do_nothing(),
            [
                {"sk_movie_id": r["sk_movie_id"], "sk_person_id": r["sk_person_id"]}
                for r in movie_people_raw
            ],
        )

    # FactMoviePerformance
    perf_data = [
        {
            "sk_movie_id": r["sk_movie_id"],
            "orcamento_usd": parse_decimal(r.get("orcamento_usd")),
            "receita_usd": parse_decimal(r.get("receita_usd")),
            "lucro_usd": parse_decimal(r.get("lucro_usd")) or Decimal(0),
            "orcamento_brl": parse_decimal(r.get("orcamento_brl")),
            "receita_brl": parse_decimal(r.get("receita_brl")),
            "lucro_brl": parse_decimal(r.get("lucro_brl")) or Decimal(0),
            "popularidade": parse_float(r.get("popularidade")),
            "nota_tmdb": parse_float(r.get("nota_tmdb")),
            "qtd_tmdb": parse_int(r.get("qtd_tmdb")),
            "nota_imdb": parse_float(r.get("nota_imdb")),
            "qtd_imdb": parse_int(r.get("qtd_imdb")),
        }
        for r in perf_raw
        if r.get("sk_movie_id")
    ]
    if perf_data:
        await session.execute(
            sqlite_insert(FactMoviePerformance).on_conflict_do_nothing(), perf_data
        )

    # DimReview
    summaries_data = [
        {
            "sk_review_id": r["sk_review_id"],
            "sk_movie_id": r["sk_movie_id"],
            "qtd_avaliacoes_usuarios": parse_int(r.get("qtd_avaliacoes_usuarios")) or 0,
            "nota_media_usuarios": parse_float(r.get("nota_media_usuarios")),
        }
        for r in summaries_raw
        if r.get("sk_movie_id")
    ]
    if summaries_data:
        await session.execute(sqlite_insert(DimReview).on_conflict_do_nothing(), summaries_data)

    # MovieReview
    reviews_data = [
        {
            "sk_movie_review_id": r["sk_movie_review_id"],
            "sk_movie_id": r["sk_movie_id"],
            "nome": r.get("nome", "Anônimo").strip() or "Anônimo",
            "nota": parse_float(r.get("nota")) or 0.0,
            "comentario": r.get("comentario", "").strip(),
        }
        for r in reviews_raw
        if r.get("sk_movie_id") and r.get("sk_movie_review_id")
    ]
    if reviews_data:
        await session.execute(sqlite_insert(MovieReview).on_conflict_do_nothing(), reviews_data)

    await session.commit()
    logger.info("Seed concluído com sucesso! %d filmes populados.", len(movies_data))


async def main() -> None:
    parser = argparse.ArgumentParser(
        description="Script de população do banco de dados a partir dos CSVs."
    )
    parser.add_argument(
        "--sample", type=int, default=100, help="Quantidade de filmes para amostra (padrão: 100)"
    )
    parser.add_argument("--full", action="store_true", help="Carrega todo o conjunto de dados CSV")
    parser.add_argument(
        "--data-dir", type=str, default=None, help="Caminho para o diretório dos arquivos CSV"
    )
    parser.add_argument(
        "--reset",
        action="store_true",
        help="Limpa e recria todas as tabelas antes de popular os dados",
    )
    args = parser.parse_args()

    sample_size = None if args.full else args.sample

    # Ensure tables exist (or recreate if --reset is requested)
    if args.reset:
        logger.info("Recriando tabelas do banco de dados (--reset)...")
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
            await conn.run_sync(Base.metadata.create_all)
    else:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        await run_seed(session=session, sample_size=sample_size, data_dir=args.data_dir)


if __name__ == "__main__":
    asyncio.run(main())
