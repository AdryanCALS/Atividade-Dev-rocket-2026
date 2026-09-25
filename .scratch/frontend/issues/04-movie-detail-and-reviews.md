# Issue 04: Detalhes do Filme e Sistema de Avaliação (0 a 10)

Status: resolved

## Descrição
Implementar a página de detalhes de um filme com metadados completos, elenco, dados de bilheteria/desempenho, lista paginada de avaliações e modal interativo para envio de nova avaliação com nota decimal na escala de 0.0 a 10.0.

## Tarefas
- [x] Implementar `MovieDetailPage` com busca por ID (aceitando tanto `id_filme` quanto `sk_movie_id`).
- [x] Criar componentes de exibição de detalhes (`MovieHero`, `MoviePerformanceInfo`).
- [x] Implementar `ReviewList` com histórico de avaliações e paginação.
- [x] Implementar modal `ReviewModal` com formulário `ReviewForm` (slider e input de 0.0 a 10.0, step 0.5, nome e comentário).
- [x] Conectar mutação de envio de avaliação e invalidação de cache reativa no TanStack Query.

