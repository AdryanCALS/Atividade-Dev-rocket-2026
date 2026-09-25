import { apiClient } from './client';
import { PaginatedReviewsResponse, ReviewCreate, ReviewResponse } from '../types';

export async function getReviewsByMovie(
  movieId: string,
  page: number = 1,
  pageSize: number = 20
): Promise<PaginatedReviewsResponse> {
  const response = await apiClient.get<PaginatedReviewsResponse>(`/movies/${movieId}/reviews`, {
    params: { page, page_size: pageSize },
  });
  return response.data;
}

export async function addReviewToMovie(
  movieId: string,
  payload: ReviewCreate
): Promise<ReviewResponse> {
  const response = await apiClient.post<ReviewResponse>(`/movies/${movieId}/reviews`, payload);
  return response.data;
}
