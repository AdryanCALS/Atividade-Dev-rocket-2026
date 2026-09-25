import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReviewModal } from './ReviewModal';
import * as reviewApi from '../../api/reviews';

vi.mock('../../api/reviews', () => ({
  addReviewToMovie: vi.fn(),
}));

const renderWithClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

describe('ReviewModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('não deve renderizar quando isOpen for false', () => {
    renderWithClient(
      <ReviewModal
        isOpen={false}
        onClose={vi.fn()}
        movieId="1"
        movieTitle="O Poderoso Chefão"
      />
    );
    expect(screen.queryByText(/Avaliar: O Poderoso Chefão/)).not.toBeInTheDocument();
  });

  it('deve renderizar com escala de 0 a 10 e valor inicial quando aberto', () => {
    renderWithClient(
      <ReviewModal
        isOpen={true}
        onClose={vi.fn()}
        movieId="1"
        movieTitle="O Poderoso Chefão"
      />
    );

    expect(screen.getByText(/Avaliar: O Poderoso Chefão/)).toBeInTheDocument();
    expect(screen.getByText(/Nota da Avaliação \(0\.0 a 10\.0\)/)).toBeInTheDocument();
    expect(screen.getByDisplayValue('Administrador')).toBeInTheDocument();
    expect(screen.getByText('8.0 / 10')).toBeInTheDocument();
  });

  it('deve submeter avaliação com sucesso quando campos válidos forem preenchidos', async () => {
    (reviewApi.addReviewToMovie as any).mockResolvedValue({
      sk_movie_review_id: 'rev-1',
      sk_movie_id: '1',
      nome: 'Administrador',
      nota: 9.5,
      comentario: 'Uma obra-prima do cinema mundial.',
      created_at: '2026-09-25T12:00:00Z',
    });

    const handleClose = vi.fn();
    renderWithClient(
      <ReviewModal
        isOpen={true}
        onClose={handleClose}
        movieId="1"
        movieTitle="O Poderoso Chefão"
      />
    );

    // Ajusta a nota para 9.5
    const scoreInput = screen.getByRole('spinbutton');
    fireEvent.change(scoreInput, { target: { value: '9.5' } });

    // Preenche o comentário
    const textarea = screen.getByPlaceholderText(/Escreva seus comentários/);
    fireEvent.change(textarea, { target: { value: 'Uma obra-prima do cinema mundial.' } });

    // Submete
    const submitButton = screen.getByRole('button', { name: /Publicar Avaliação/ });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(reviewApi.addReviewToMovie).toHaveBeenCalledWith('1', {
        nome: 'Administrador',
        nota: 9.5,
        comentario: 'Uma obra-prima do cinema mundial.',
      });
      expect(handleClose).toHaveBeenCalled();
    });
  });
});
