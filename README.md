# RocketLab 2026.2 — repositório base

Base inicial para evoluir a atividade do RocketLab 2026.2. Ela preserva a organização do backend,
o modelo relacional do catálogo de filmes em SQLAlchemy 2.0 e o histórico de
migrações com Alembic, sem incluir interface, dados CSV, endpoints de negócio
ou rotinas de carga.

> **Nota:** `RocketLab` é apenas o nome de referência desta base. O diretório,
> nome do pacote, título da API e arquivo do banco podem ser renomeados para o
> que preferirem; eles não representam uma exigência da
> estrutura-base.

## Estrutura

```text
.
├── backend/
│   ├── app/
│   │   ├── api/v1/        # endpoints REST (/movies, /reviews, /genres)
│   │   ├── core/          # configurações, CORS e logging
│   │   ├── db/            # Base ORM, sessões assíncronas e carga de dados
│   │   └── movies/        # modelos SQLAlchemy, schemas Pydantic e serviços
│   ├── migrations/        # revisões Alembic
│   └── tests/             # suíte de testes pytest
├── frontend/
│   ├── src/
│   │   ├── api/           # clientes Axios tipados e serviços HTTP
│   │   ├── components/    # componentes modulares (Navbar, MovieCard, Modais, etc.)
│   │   ├── hooks/         # hooks customizados (useDebounce)
│   │   ├── pages/         # CatalogPage, MovieDetailPage, MovieCreatePage, MovieEditPage
│   │   └── types/         # interfaces TypeScript sincronizadas com o backend
│   └── package.json
└── README.md
```

## Execução

### 1. Backend (FastAPI + SQLite)

Requer Python 3.11 ou superior.

```bash
cd backend
python3 -m venv .venv
# Windows: .venv\Scripts\activate
# Linux/macOS: source .venv/bin/activate
pip install -e ".[dev]"
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

A API ficará disponível em `http://localhost:8000`. Acesse `http://localhost:8000/docs` para a documentação interativa Swagger.

Para rodar os testes do backend:
```bash
pytest
```

#### População do Banco de Dados (Seed dos CSVs)

Para carregar dados a partir dos arquivos CSV contidos na pasta `data/`:

- **Amostra padrão (100 filmes):**
  ```bash
  python -m app.db.seed
  ```
- **Amostra customizada (ex: 500 filmes):**
  ```bash
  python -m app.db.seed --sample 500
  ```
- **Carga completa de toda a base CSV (~95.000 filmes):**
  ```bash
  python -m app.db.seed --full
  ```
  *(Dica: use a flag `--reset` para limpar e recriar as tabelas antes de popular: `python -m app.db.seed --full --reset`)*


---

### 2. Frontend (Vite + React + TypeScript + Tailwind)

Requer Node.js 18 ou superior.

```bash
cd frontend
npm install
npm run dev
```

A aplicação web estará acessível em `http://localhost:5173`.

Para rodar os testes automatizados do frontend (Vitest):
```bash
npm test
```

Para verificar a tipagem TypeScript:
```bash
npm run lint
```

Para gerar a build de produção:
```bash
npm run build
```


## Banco de dados e migrações

O modelo usa um esquema estrela para o catálogo de filmes:

- dimensões de filmes, gêneros, pessoas, produtoras e resumo de avaliações;
- fato de desempenho financeiro e de engajamento;
- tabelas de associação N:N entre filmes, gêneros, produtoras e pessoas;

O schema corresponde aos nove arquivos CSV atuais da camada Diamond, com a
adição de `movie_reviews`: uma avaliação individual por linha, na escala 0–10.
A tabela aceita diretamente as colunas `sk_movie_review_id`, `sk_movie_id`,
`nome`, `nota` e `comentario` do CSV enviado separadamente. `created_at` é
gerado pelo banco. O contexto generativo não faz parte desta base.

O repositório não inclui CSVs nem rotinas de carga. Para usar avaliações,
importe primeiro os filmes em `dim_movies` e depois o CSV de `movie_reviews`.

As tabelas são criadas exclusivamente pelo Alembic. Para evoluir os modelos,
crie uma revisão e aplique-a:

```bash
cd backend
.venv/bin/alembic revision --autogenerate -m "descreva a alteração"
.venv/bin/alembic upgrade head
```

O banco padrão é SQLite local em `backend/rocketlab.db`. Ajuste
`DATABASE_URL` no arquivo `.env` para usar outro banco compatível.
