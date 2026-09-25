import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getReviewsByMovie, addReviewToMovie } from './reviews';
import { apiClient } from './client';

vi.mock('./client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('Reviews API service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve listar avaliações do filme', async () => {
    const mockData = { items: [], total: 0, page: 1, page_size: 20, total_pages: 0 };
    (apiClient.get as any).mockResolvedValue({ data: mockData });

    const result = await getReviewsByMovie('movie-1', 1, 20);
    expect(apiClient.get).toHaveBeenCalledWith('/movies/movie-1/reviews', {
      params: { page: 1, page_size: 20 },
    });
    expect(result).toEqual(mockData);
  });

  it('deve adicionar uma avaliação com nota entre 0 e 10', async () => {
    const reviewPayload = {
      nome: 'Administrador',
      nota: 9.5,
      comentario: 'Excelente filme, roteiro impecável.',
    };
    const mockCreated = {
      sk_movie_review_id: 'rev-1',
      sk_movie_id: 'movie-1',
      ...reviewPayload,
      created_at: '2026-09-25T10:00:00Z',
    };
    (apiClient.post as any).mockResolvedValue({ data: mockCreated });

    const result = await addReviewToMovie('movie-1', reviewPayload);
    expect(apiClient.post).toHaveBeenCalledWith('/movies/movie-1/reviews', reviewPayload);
    expect(result).toEqual(mockCreated);
  });
});
