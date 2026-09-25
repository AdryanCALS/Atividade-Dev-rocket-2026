import { describe, it, expect } from 'vitest';
import { getMovieId, formatDate } from './movie';

describe('movie utilities', () => {
  it('deve priorizar id_filme se disponível', () => {
    expect(getMovieId({ id_filme: 'filme-123', sk_movie_id: 'sk-999' })).toBe('filme-123');
  });

  it('deve utilizar sk_movie_id como fallback', () => {
    expect(getMovieId({ sk_movie_id: 'sk-999' })).toBe('sk-999');
    expect(getMovieId({ id_filme: '', sk_movie_id: 'sk-999' })).toBe('sk-999');
  });

  it('deve formatar data de lançamento ISO para pt-BR', () => {
    expect(formatDate('1972-03-24')).toBe('24/03/1972');
    expect(formatDate(null)).toBeNull();
    expect(formatDate(undefined)).toBeNull();
  });
});
