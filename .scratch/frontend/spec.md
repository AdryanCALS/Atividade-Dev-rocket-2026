# Especificação: Frontend do Sistema de Avaliação de Filmes

## Visão Geral
Implementação do frontend em React + TypeScript + Vite, consumindo a API FastAPI existente em `http://localhost:8000/api/v1`. O usuário atua no papel de Administrador, com catálogo paginado, busca, detalhes de filmes, formulário CRUD de filmes e sistema de avaliações individuais na escala estrita de 0.0 a 10.0.

## Decisões Arquiteturais Consolidadas
- **Stack**: Vite, React 18/19, TypeScript, Tailwind CSS, Lucide React, React Router DOM, TanStack Query, Axios.
- **Navegação**:
  - `/` -> Catálogo com busca, filtros de ordenação e paginação.
  - `/filmes/:id` -> Detalhes do filme, elenco, performance, resumo de avaliações, listagem de avaliações e botão para abrir modal de nova avaliação.
  - `/filmes/novo` -> Cadastro de filme com seleção dinâmica de gêneros.
  - `/filmes/:id/editar` -> Edição de filme pré-carregado.
- **Avaliações**: Escala de 0.0 a 10.0 com slider e input numérico decimal, comentário textual e nome do autor (padrão Administrador).
- **Proteção**: Modal de confirmação para exclusão de filmes.
