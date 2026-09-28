import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { CatalogPage } from './CatalogPage';
import * as moviesApi from '../api/movies';

vi.mock('../api/movies', () => ({
  getMovies: vi.fn(),
}));

const mockMoviesResponse = {
  items: [
    {
      sk_movie_id: '1',
      id_filme: 'tt0068646',
      titulo: 'O Poderoso Chefão',
      diretor: 'Francis Ford Coppola',
      ano_lancamento: 1972,
      data_lancamento: '1972-03-24',
      duracao_minutos: 175,
      sinopse: 'Uma família mafiosa...',
      url_poster: null,
      generos: ['Crime', 'Drama'],
      reviews_summary: {
        qtd_avaliacoes_usuarios: 5,
        nota_media_usuarios: 9.2,
      },
    },
  ],
  total: 1,
  page: 1,
  page_size: 18,
  total_pages: 1,
};

const renderCatalog = (initialEntries = ['/']) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/" element={<CatalogPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('CatalogPage - Search & Clear functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (moviesApi.getMovies as any).mockResolvedValue(mockMoviesResponse);
  });

  it('deve exibir a barra de busca e carregar filmes iniciais', async () => {
    renderCatalog(['/']);

    const searchInput = screen.getByPlaceholderText(/Buscar por título, diretor/i);
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveValue('');

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'O Poderoso Chefão' })).toBeInTheDocument();
    });
  });

  it('deve exibir o botão "X" quando houver termo de busca e limpar imediatamente ao clicar nele', async () => {
    renderCatalog(['/?q=Chef%C3%A3o']);

    const searchInput = screen.getByPlaceholderText(/Buscar por título, diretor/i);
    expect(searchInput).toHaveValue('Chefão');

    const clearButton = screen.getByLabelText('Limpar campo de busca');
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);

    expect(searchInput).toHaveValue('');
    expect(screen.queryByLabelText('Limpar campo de busca')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(moviesApi.getMovies).toHaveBeenCalledWith(
        expect.objectContaining({
          q: '',
          page: 1,
        })
      );
    });
  });

  it('deve limpar busca também pelo botão do estado vazio (empty state)', async () => {
    (moviesApi.getMovies as any).mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      page_size: 18,
      total_pages: 0,
    });

    renderCatalog(['/?q=FilmeInexistente123']);

    await waitFor(() => {
      expect(screen.getByText('Nenhum filme encontrado')).toBeInTheDocument();
    });

    const emptyStateClearBtn = screen.getByRole('button', { name: /^Limpar busca$/i });
    fireEvent.click(emptyStateClearBtn);

    const searchInput = screen.getByPlaceholderText(/Buscar por título, diretor/i);
    expect(searchInput).toHaveValue('');
  });
});
