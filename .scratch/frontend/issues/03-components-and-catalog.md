# Issue 03: Componentes Base e Catálogo de Filmes

Status: resolved

## Descrição
Desenvolver a página principal de catálogo com barra de pesquisa com debounce, filtros de ordenação, grid responsivo de filmes, badges de avaliação (0 a 10) e paginação completa sincronizada com a URL.

## Tarefas
- [x] Criar componentes de layout e navegação (`Navbar`, `Footer`, `RatingBadge`).
- [x] Criar componentes de listagem (`MovieCard`, `MovieGrid`, `Pagination`, fallback de imagem quebrada/nula).
- [x] Implementar `useDebounce` hook.
- [x] Criar `CatalogPage` integrando TanStack Query e sincronização com URLSearchParams (`q`, `sort_by`, `order`, `page`).

