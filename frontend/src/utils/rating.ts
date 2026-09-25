/**
 * Retorna as classes de cor do Tailwind para o tema claro de acordo com a nota de 0 a 10.
 */
export function getRatingColorClass(nota: number | null | undefined): string {
  if (nota === null || nota === undefined || isNaN(nota)) {
    return 'text-slate-500 bg-slate-100 border-slate-300';
  }
  if (nota >= 7.0) {
    return 'text-emerald-700 bg-emerald-50 border-emerald-300';
  }
  if (nota >= 5.0) {
    return 'text-amber-800 bg-amber-50 border-amber-300';
  }
  return 'text-rose-700 bg-rose-50 border-rose-300';
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
