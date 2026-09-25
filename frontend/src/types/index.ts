export interface ReviewSummaryResponse {
  qtd_avaliacoes_usuarios: number;
  nota_media_usuarios: number | null;
}

export interface ReviewResponse {
  sk_movie_review_id: string;
  sk_movie_id: string;
  nome: string;
  nota: number; // Escala estrita de 0.0 a 10.0
  comentario: string;
  created_at: string;
}

export interface ReviewCreate {
  nome: string;
  nota: number; // Escala estrita de 0.0 a 10.0
  comentario: string;
}

export interface MovieListItem {
  sk_movie_id: string;
  id_filme: string;
  titulo: string;
  diretor: string | null;
  ano_lancamento: number | null;
  data_lancamento: string | null;
  duracao_minutos: number | null;
  sinopse: string | null;
  url_poster: string | null;
  generos: string[];
  reviews_summary: ReviewSummaryResponse;
}

export interface MoviePerformanceResponse {
  orcamento_usd: number | null;
  receita_usd: number | null;
  lucro_usd: number | null;
  orcamento_brl: number | null;
  receita_brl: number | null;
  lucro_brl: number | null;
  popularidade: number | null;
  nota_tmdb: number | null;
  qtd_tmdb: number | null;
  nota_imdb: number | null;
  qtd_imdb: number | null;
}

export interface MovieDetailResponse extends MovieListItem {
  url_backdrop: string | null;
  status_filme: string | null;
  atores: string[];
  roteiristas: string[];
  performance: MoviePerformanceResponse | null;
  recent_reviews: ReviewResponse[];
}

export interface MovieCreate {
  titulo: string;
  diretor?: string | null;
  ano_lancamento?: number | null;
  data_lancamento?: string | null;
  duracao_minutos?: number | null;
  status_filme?: string | null;
  sinopse?: string | null;
  url_poster?: string | null;
  url_backdrop?: string | null;
  generos?: string[];
  id_filme?: string | null;
}

export interface MovieUpdate {
  titulo?: string | null;
  diretor?: string | null;
  ano_lancamento?: number | null;
  data_lancamento?: string | null;
  duracao_minutos?: number | null;
  status_filme?: string | null;
  sinopse?: string | null;
  url_poster?: string | null;
  url_backdrop?: string | null;
  generos?: string[] | null;
}

export interface PaginatedMoviesResponse {
  items: MovieListItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface PaginatedReviewsResponse {
  items: ReviewResponse[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface GenreResponse {
  sk_genre_id: string;
  nome_genero: string;
}

export interface MovieFilterParams {
  page?: number;
  page_size?: number;
  q?: string;
  sort_by?: 'lancamento' | 'titulo' | 'nota_media';
  order?: 'asc' | 'desc';
}
