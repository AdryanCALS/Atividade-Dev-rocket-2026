# RocketLab 2026.2 — Catálogo e Gestão de Filmes

Aplicação full-stack desenvolvida para a atividade técnica do RocketLab 2026.2. O sistema é composto por uma API REST robusta em **FastAPI (Python)** com persistência em **SQLite (SQLAlchemy 2.0 + Alembic)** e uma interface moderna e responsiva construída em **Vite + React + TypeScript + Tailwind CSS**, implementando a identidade visual **Light da Visagio** (inspirada no [v-dev.io](https://v-dev.io)).

O sistema atende a todos os requisitos do desafio técnico:
- **Navegação em catálogo paginado** com ordenação (ano de lançamento, título, nota média);
- **Barra de busca com debounce** para pesquisa em tempo real por título, diretor, gênero ou sinopse;
- **Detalhamento completo do filme**, exibindo sinopse, elenco/direção, métricas financeiras (orçamento, receita, lucro), notas externas (TMDB, IMDb) e histórico de avaliações;
- **Gerenciamento de filmes (CRUD)**: cadastro, edição e exclusão individual de filmes pelo Administrador;
- **Avaliações e resenhas**: adição de novas avaliações com seletor interativo de 1 a 5 estrelas, ajuste fino decimal (escala de 0.0 a 10.0) e cálculo automático da nota média;
- **Rotina de carga (Seed)** com suporte a amostra (ex: 100 filmes) ou carga completa de toda a base CSV (~95.000 títulos).

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

O schema corresponde aos arquivos CSV da camada de dados (`data/`), com a adição da tabela de avaliações individuais (`dim_movie_reviews`), operando na escala oficial de 0.0 a 10.0 (consulte [ADR 0001](docs/adr/0001-rating-scale-and-identifier-resolution.md)).

Para popular o banco com os dados dos arquivos CSV da pasta `data/`, utilize a rotina de seed descrita na seção de execução (`python -m app.db.seed`).

As tabelas são gerenciadas exclusivamente pelo Alembic. Para evoluir os modelos, crie uma revisão e aplique-a:

```bash
cd backend
alembic revision --autogenerate -m "descreva a alteração"
alembic upgrade head
```

O banco padrão é SQLite local em `backend/rocketlab.db`. Ajuste `DATABASE_URL` no arquivo `.env` para usar outro banco compatível.

---

## Identidade Visual & Design System

A aplicação frontend adota a identidade visual **Light da Visagio** (inspirada no [v-dev.io](https://v-dev.io)), com padrões de acessibilidade WCAG AAA:

- **Canvas Principal**: `#F4F4F4` (aparência *light*, limpa e contemporânea)
- **Preto Estrutural & Texto**: `#0F0E0E` (máximo contraste para títulos e corpo de texto)
- **Amarelo Destaque (Accent)**: `#FFD45A` (botões primários, estrelas, focus rings e seleções)
- **Superfícies (Cards & Modais)**: `#FFFFFF` com bordas sutis `#E5E5E5` e sombras suaves
- **Alertas & Ações Críticas**: Tom semântico rose (`#E11D48`) para exclusões irreversíveis e mensagens de erro

Para detalhes técnicos e decisões de design, consulte o [ADR 0002](docs/adr/0002-visagio-light-palette-and-design-system.md).
