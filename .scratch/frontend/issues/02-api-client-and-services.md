# Issue 02: Cliente HTTP e Serviços de API

Status: resolved

## Descrição
Configurar a instância do Axios com tratamento de erros e implementar as funções de comunicação com os endpoints `/movies`, `/reviews` e `/genres`.

## Tarefas
- [x] Criar `src/api/client.ts` com baseURL configurada para o backend FastAPI (`http://localhost:8000/api/v1`).
- [x] Criar `src/api/movies.ts` (`getMovies`, `getMovieById`, `createMovie`, `updateMovie`, `deleteMovie`).
- [x] Criar `src/api/reviews.ts` (`getReviewsByMovie`, `addReviewToMovie`).
- [x] Criar `src/api/genres.ts` (`getGenres`).
- [x] Criar testes unitários para a camada de serviço de API.

