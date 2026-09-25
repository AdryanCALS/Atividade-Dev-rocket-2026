/**
 * Retorna as classes de cor do Tailwind de acordo com a nota de 0 a 10.
 */
export function getRatingColorClass(nota: number | null | undefined): string {
  if (nota === null || nota === undefined || isNaN(nota)) {
    return 'text-slate-400 bg-slate-800/80 border-slate-700';
  }
  if (nota >= 7.0) {
    return 'text-emerald-400 bg-emerald-950/60 border-emerald-700/50';
  }
  if (nota >= 5.0) {
    return 'text-amber-400 bg-amber-950/60 border-amber-700/50';
  }
  return 'text-rose-400 bg-rose-950/60 border-rose-700/50';
}

/**
 * Formata a nota no padrão "X.X/10" ou "Sem nota".
 */
export function formatRating(nota: number | null | undefined): string {
  if (nota === null || nota === undefined || isNaN(nota)) {
    return 'Sem nota';
  }
  return `${nota.toFixed(1)}/10`;
}
