import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_add_review_updates_movie_summary(client: AsyncClient) -> None:
    # 1. Create a movie
    create_movie_resp = await client.post(
        "/api/v1/movies",
        json={
            "titulo": "Matrix",
            "diretor": "Lana Wachowski",
            "ano_lancamento": 1999,
            "generos": ["Ficção Científica", "Ação"],
            "sinopse": "Um programador descobre a verdadeira realidade.",
        },
    )
    assert create_movie_resp.status_code == 201
    movie_id = create_movie_resp.json()["sk_movie_id"]

    # 2. Add first review (score 8.0)
    rev1_resp = await client.post(
        f"/api/v1/movies/{movie_id}/reviews",
        json={
            "nome": "Lucas Silva",
            "nota": 8.0,
            "comentario": "Excelente filme inovador!",
        },
    )
    assert rev1_resp.status_code == 201
    rev1_data = rev1_resp.json()
    assert rev1_data["nome"] == "Lucas Silva"
    assert rev1_data["nota"] == 8.0
    assert rev1_data["sk_movie_id"] == movie_id

    # Check movie details summary
    movie_det_1 = await client.get(f"/api/v1/movies/{movie_id}")
    assert movie_det_1.status_code == 200
    summary_1 = movie_det_1.json()["reviews_summary"]
    assert summary_1["qtd_avaliacoes_usuarios"] == 1
    assert summary_1["nota_media_usuarios"] == 8.0

    # 3. Add second review (score 6.0)
    rev2_resp = await client.post(
        f"/api/v1/movies/{movie_id}/reviews",
        json={
            "nome": "Maria Santos",
            "nota": 6.0,
            "comentario": "Bom entretenimento, mas datado.",
        },
    )
    assert rev2_resp.status_code == 201

    # Check movie details summary: (8.0 + 6.0) / 2 = 7.0
    movie_det_2 = await client.get(f"/api/v1/movies/{movie_id}")
    assert movie_det_2.status_code == 200
    summary_2 = movie_det_2.json()["reviews_summary"]
    assert summary_2["qtd_avaliacoes_usuarios"] == 2
    assert summary_2["nota_media_usuarios"] == 7.0
    assert len(movie_det_2.json()["recent_reviews"]) == 2

    # 4. Paginated reviews listing
    rev_list_resp = await client.get(f"/api/v1/movies/{movie_id}/reviews?page=1&page_size=1")
    assert rev_list_resp.status_code == 200
    rev_list_data = rev_list_resp.json()
    assert rev_list_data["total"] == 2
    assert rev_list_data["page"] == 1
    assert rev_list_data["page_size"] == 1
    assert rev_list_data["total_pages"] == 2
    assert len(rev_list_data["items"]) == 1


@pytest.mark.asyncio
async def test_review_validation_rules(client: AsyncClient) -> None:
    create_movie_resp = await client.post(
        "/api/v1/movies",
        json={
            "titulo": "Filme Teste Validação",
            "ano_lancamento": 2024,
        },
    )
    assert create_movie_resp.status_code == 201
    movie_id = create_movie_resp.json()["sk_movie_id"]

    # Nota < 0
    resp_neg = await client.post(
        f"/api/v1/movies/{movie_id}/reviews",
        json={"nome": "Tester", "nota": -0.5, "comentario": "Ruim"},
    )
    assert resp_neg.status_code == 422

    # Nota > 10
    resp_high = await client.post(
        f"/api/v1/movies/{movie_id}/reviews",
        json={"nome": "Tester", "nota": 10.5, "comentario": "Ótimo"},
    )
    assert resp_high.status_code == 422

    # Nome vazio
    resp_no_name = await client.post(
        f"/api/v1/movies/{movie_id}/reviews",
        json={"nome": "", "nota": 9.0, "comentario": "Ótimo"},
    )
    assert resp_no_name.status_code == 422


@pytest.mark.asyncio
async def test_list_genres(client: AsyncClient) -> None:
    await client.post(
        "/api/v1/movies",
        json={
            "titulo": "Filme com Gêneros",
            "generos": ["Animação", "Família"],
        },
    )

    genres_resp = await client.get("/api/v1/genres")
    assert genres_resp.status_code == 200
    genres_data = genres_resp.json()
    genre_names = [g["nome_genero"] for g in genres_data]
    assert "Animação" in genre_names
    assert "Família" in genre_names
