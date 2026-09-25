# Catálogo e Avaliação de Filmes

Contexto do módulo de catálogo, busca, gestão e avaliação de filmes para o RocketLab 2026.2 (estilo Letterboxd).

## Language

**Filme**:
Entidade central do catálogo com metadados descritivos (título, sinopse, ano e data de lançamento, URLs de pôster e backdrop) vinculada a gêneros e equipe.
_Avoid_: Obra, vídeo, item

**Avaliação**:
Registro individual feito por um usuário para um filme, composto por nome do autor, comentário textual e uma nota na escala de 0.0 a 10.0.
_Avoid_: Crítica, feedback, nota avulsa, estrelas (na camada de dados)

**Resumo de Avaliações**:
Métrica agregada mantida por filme contendo a quantidade total de avaliações e a média aritmética das notas dos usuários.
_Avoid_: Score geral, rating externo, ranking

**Gênero**:
Classificação temática de um filme cadastrada de forma deduplicada e ligada por relacionamento muitos-para-muitos.
_Avoid_: Categoria, tag

**Diretor / Pessoa**:
Profissional associado a um filme com papel cadastrado na dimensão de pessoas, com destaque para a direção na criação básica de filmes.
_Avoid_: Artista, criador, membro da equipe

**Administrador**:
Papel do usuário que opera o sistema com permissão para gerenciar o catálogo de filmes (criar, editar e remover) e registrar avaliações.
_Avoid_: Admin, superusuário, operador, cliente

