import { apiClient } from './client';
import {
  MovieCreate,
  MovieDetailResponse,
  MovieFilterParams,
  MovieListItem,
  MovieUpdate,
  PaginatedMoviesResponse,
} from '../types';

export async function getMovies(params: MovieFilterParams = {}): Promise<PaginatedMoviesResponse> {
  const { page = 1, page_size = 20, q, sort_by = 'lancamento', order = 'desc' } = params;
  const response = await apiClient.get<PaginatedMoviesResponse>('/movies', {
    params: {
      page,
      page_size,
      ...(q && q.trim() ? { q: q.trim() } : {}),
      sort_by,
      order,
    },
  });
  return response.data;
}

export async function getMovieById(movieId: string): Promise<MovieDetailResponse> {
  const response = await apiClient.get<MovieDetailResponse>(`/movies/${movieId}`);
  return response.data;
}

export async function createMovie(payload: MovieCreate): Promise<MovieListItem> {
  const response = await apiClient.post<MovieListItem>('/movies', payload);
  return response.data;
}

export async function updateMovie(movieId: string, payload: MovieUpdate): Promise<MovieDetailResponse> {
  const response = await apiClient.put<MovieDetailResponse>(`/movies/${movieId}`, payload);
  return response.data;
}

export async function deleteMovie(movieId: string): Promise<void> {
  await apiClient.delete(`/movies/${movieId}`);
}
