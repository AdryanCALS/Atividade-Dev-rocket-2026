import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_movie_and_get_details(client: AsyncClient) -> None:
    payload = {
        "titulo": "Oppenheimer",
        "diretor": "Christopher Nolan",
        "ano_lancamento": 2023,
        "generos": ["Biografia", "Drama", "História"],
        "sinopse": "A história do físico americano J. Robert Oppenheimer...",
        "duracao_minutos": 180,
        "data_lancamento": "2023-07-21",
        "url_poster": "https://image.tmdb.org/t/p/w500/oppenheimer.jpg",
    }

    create_response = await client.post("/api/v1/movies", json=payload)
    assert create_response.status_code == 201
    created_data = create_response.json()
    assert created_data["titulo"] == "Oppenheimer"
    assert created_data["diretor"] == "Christopher Nolan"
    assert set(created_data["generos"]) == {"Biografia", "Drama", "História"}
    assert created_data["ano_lancamento"] == 2023
    assert created_data["sk_movie_id"] is not None
    assert created_data["id_filme"] is not None
    assert created_data["reviews_summary"] == {
        "qtd_avaliacoes_usuarios": 0,
        "nota_media_usuarios": None,
    }

    sk_id = created_data["sk_movie_id"]
    biz_id = created_data["id_filme"]

    # Test retrieval by surrogate key
    res_by_sk = await client.get(f"/api/v1/movies/{sk_id}")
    assert res_by_sk.status_code == 200
    assert res_by_sk.json()["titulo"] == "Oppenheimer"

    # Test retrieval by business key (id_filme)
    res_by_biz = await client.get(f"/api/v1/movies/{biz_id}")
    assert res_by_biz.status_code == 200
    assert res_by_biz.json()["titulo"] == "Oppenheimer"


@pytest.mark.asyncio
async def test_list_movies_pagination_and_search(client: AsyncClient) -> None:
    movie1 = {
        "titulo": "Interestelar",
        "diretor": "Christopher Nolan",
        "ano_lancamento": 2014,
        "generos": ["Ficção Científica", "Aventura"],
        "sinopse": "Uma equipe de exploradores viaja através de um buraco de minhoca...",
    }
    movie2 = {
        "titulo": "Duna",
        "diretor": "Denis Villeneuve",
        "ano_lancamento": 2021,
        "generos": ["Ficção Científica", "Aventura"],
        "sinopse": "Paul Atreides é um jovem brilhante...",
    }
    movie3 = {
        "titulo": "Blade Runner 2049",
        "diretor": "Denis Villeneuve",
        "ano_lancamento": 2017,
        "generos": ["Ficção Científica", "Mistério"],
        "sinopse": "Trinta anos após os eventos do primeiro filme...",
    }

    for m in [movie1, movie2, movie3]:
        resp = await client.post("/api/v1/movies", json=m)
        assert resp.status_code == 201

    # Pagination test
    list_page1 = await client.get("/api/v1/movies?page=1&page_size=2")
    assert list_page1.status_code == 200
    p1_data = list_page1.json()
    assert p1_data["total"] == 3
    assert p1_data["page"] == 1
    assert p1_data["page_size"] == 2
    assert p1_data["total_pages"] == 2
    assert len(p1_data["items"]) == 2

    # Search by title
    search_title = await client.get("/api/v1/movies?q=Blade")
    assert search_title.status_code == 200
    title_data = search_title.json()
    assert title_data["total"] == 1
    assert title_data["items"][0]["titulo"] == "Blade Runner 2049"

    # Search by director
    search_dir = await client.get("/api/v1/movies?q=Villeneuve")
    assert search_dir.status_code == 200
    dir_data = search_dir.json()
    assert dir_data["total"] == 2


@pytest.mark.asyncio
async def test_update_and_delete_movie(client: AsyncClient) -> None:
    create_resp = await client.post(
        "/api/v1/movies",
        json={
            "titulo": "Filme Temporário",
            "diretor": "Diretor Original",
            "ano_lancamento": 2020,
            "generos": ["Comédia"],
            "sinopse": "Sinopse original",
        },
    )
    assert create_resp.status_code == 201
    movie_id = create_resp.json()["sk_movie_id"]

    # Update
    update_resp = await client.put(
        f"/api/v1/movies/{movie_id}",
        json={
            "titulo": "Filme Atualizado",
            "diretor": "Novo Diretor",
            "ano_lancamento": 2021,
            "generos": ["Drama"],
            "sinopse": "Nova sinopse",
        },
    )
    assert update_resp.status_code == 200
    updated_data = update_resp.json()
    assert updated_data["titulo"] == "Filme Atualizado"
    assert updated_data["diretor"] == "Novo Diretor"
    assert updated_data["generos"] == ["Drama"]

    # Delete
    del_resp = await client.delete(f"/api/v1/movies/{movie_id}")
    assert del_resp.status_code == 204

    # Get after delete should 404
    get_after = await client.get(f"/api/v1/movies/{movie_id}")
    assert get_after.status_code == 404
