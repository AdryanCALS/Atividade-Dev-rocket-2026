import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useDebounce } from './useDebounce';

describe('useDebounce hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('deve retornar o valor inicial imediatamente', () => {
    const { result } = renderHook(() => useDebounce('teste inicial', 300));
    expect(result.current).toBe('teste inicial');
  });

  it('deve atualizar o valor apenas após o tempo de delay especificado', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'primeiro', delay: 300 } }
    );

    expect(result.current).toBe('primeiro');

    // Altera a prop
    rerender({ value: 'segundo', delay: 300 });
    expect(result.current).toBe('primeiro');

    // Avança 200ms (não deve atualizar ainda)
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('primeiro');

    // Avança mais 100ms (total 300ms)
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('segundo');
  });
});
