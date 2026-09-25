import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getMovies, getMovieById, createMovie, deleteMovie } from './movies';
import { apiClient } from './client';

vi.mock('./client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Movies API service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve listar filmes com parâmetros padrão', async () => {
    const mockData = {
      items: [],
      total: 0,
      page: 1,
      page_size: 20,
      total_pages: 0,
    };
    (apiClient.get as any).mockResolvedValue({ data: mockData });

    const result = await getMovies();
    expect(apiClient.get).toHaveBeenCalledWith('/movies', {
      params: { page: 1, page_size: 20, sort_by: 'lancamento', order: 'desc' },
    });
    expect(result).toEqual(mockData);
  });

  it('deve incluir busca q e ordenação quando informados', async () => {
    (apiClient.get as any).mockResolvedValue({ data: { items: [], total: 0, page: 2, page_size: 10, total_pages: 0 } });

    await getMovies({ page: 2, page_size: 10, q: 'Inception', sort_by: 'nota_media', order: 'desc' });
    expect(apiClient.get).toHaveBeenCalledWith('/movies', {
      params: { page: 2, page_size: 10, q: 'Inception', sort_by: 'nota_media', order: 'desc' },
    });
  });

  it('deve obter filme por ID', async () => {
    const mockMovie = { id_filme: '1', titulo: 'Filme Teste' };
    (apiClient.get as any).mockResolvedValue({ data: mockMovie });

    const result = await getMovieById('1');
    expect(apiClient.get).toHaveBeenCalledWith('/movies/1');
    expect(result).toEqual(mockMovie);
  });

  it('deve cadastrar um novo filme', async () => {
    const payload = { titulo: 'Novo Filme', generos: ['Ação'] };
    const mockCreated = { sk_movie_id: 'sk-1', id_filme: '1', ...payload };
    (apiClient.post as any).mockResolvedValue({ data: mockCreated });

    const result = await createMovie(payload);
    expect(apiClient.post).toHaveBeenCalledWith('/movies', payload);
    expect(result).toEqual(mockCreated);
  });

  it('deve remover um filme por ID', async () => {
    (apiClient.delete as any).mockResolvedValue({ status: 204 });

    await deleteMovie('sk-1');
    expect(apiClient.delete).toHaveBeenCalledWith('/movies/sk-1');
  });
});
