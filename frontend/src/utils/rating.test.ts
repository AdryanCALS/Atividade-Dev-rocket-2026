import { describe, it, expect } from 'vitest';
import { getRatingColorClass, formatRating } from './rating';

describe('rating utilities', () => {
  it('deve retornar classe emerald para notas >= 7.0', () => {
    expect(getRatingColorClass(7.0)).toContain('emerald');
    expect(getRatingColorClass(9.5)).toContain('emerald');
  });

  it('deve retornar classe amber para notas entre 5.0 e 6.9', () => {
    expect(getRatingColorClass(5.0)).toContain('amber');
    expect(getRatingColorClass(6.9)).toContain('amber');
  });

  it('deve retornar classe rose para notas < 5.0', () => {
    expect(getRatingColorClass(4.9)).toContain('rose');
    expect(getRatingColorClass(0)).toContain('rose');
  });

  it('deve retornar classe slate para notas nulas ou indefinidas', () => {
    expect(getRatingColorClass(null)).toContain('slate');
    expect(getRatingColorClass(undefined)).toContain('slate');
  });

  it('deve formatar nota corretamente', () => {
    expect(formatRating(8.5)).toBe('8.5/10');
    expect(formatRating(null)).toBe('Sem nota');
    expect(formatRating(undefined)).toBe('Sem nota');
  });
});
