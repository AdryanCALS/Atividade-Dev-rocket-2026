import { apiClient } from './client';
import { GenreResponse } from '../types';

export async function getGenres(): Promise<GenreResponse[]> {
  const response = await apiClient.get<GenreResponse[]>('/genres');
  return response.data;
}
