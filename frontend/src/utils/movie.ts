/**
 * Retorna o identificador prioritário de um filme (id_filme ou sk_movie_id).
 */
export function getMovieId(movie: {
  id_filme?: string | null;
  sk_movie_id?: string | null;
}): string {
  return movie.id_filme || movie.sk_movie_id || '';
}

/**
 * Formata data no formato ISO (YYYY-MM-DD) para exibição em pt-BR (DD/MM/YYYY).
 */
export function formatDate(dateString: string | null | undefined): string | null {
  if (!dateString) return null;
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
  return dateString;
}
