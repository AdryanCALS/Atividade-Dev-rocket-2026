import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RatingBadge } from './RatingBadge';

describe('RatingBadge', () => {
  it('deve exibir a nota na escala de 0 a 10 formatada com 1 casa decimal', () => {
    render(<RatingBadge score={8.5} count={12} />);
    expect(screen.getByText('8.5/10')).toBeInTheDocument();
    expect(screen.getByText('(12 avaliações)')).toBeInTheDocument();
  });

  it('deve exibir texto amigável quando o filme não possui avaliações', () => {
    render(<RatingBadge score={null} count={0} />);
    expect(screen.getByText('Sem nota')).toBeInTheDocument();
  });

  it('deve exibir formato singular para exatamente 1 avaliação', () => {
    render(<RatingBadge score={7.0} count={1} />);
    expect(screen.getByText('(1 avaliação)')).toBeInTheDocument();
  });

  it('deve ocultar a contagem quando showCount for false', () => {
    render(<RatingBadge score={9.0} count={5} showCount={false} />);
    expect(screen.getByText('9.0/10')).toBeInTheDocument();
    expect(screen.queryByText(/avaliações/)).not.toBeInTheDocument();
  });
});
