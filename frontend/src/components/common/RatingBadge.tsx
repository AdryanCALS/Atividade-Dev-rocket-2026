import React from 'react';
import { Star } from 'lucide-react';

interface RatingBadgeProps {
  score: number | null | undefined;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export const RatingBadge: React.FC<RatingBadgeProps> = ({
  score,
  count,
  size = 'md',
  showCount = true,
}) => {
  const hasRating = typeof score === 'number' && !isNaN(score);

  const getColorClasses = (val: number | null | undefined) => {
    if (val === null || val === undefined) return 'text-slate-400 bg-slate-800/80 border-slate-700';
    if (val >= 7.0) return 'text-emerald-400 bg-emerald-950/60 border-emerald-700/50';
    if (val >= 5.0) return 'text-amber-400 bg-amber-950/60 border-amber-700/50';
    return 'text-rose-400 bg-rose-950/60 border-rose-700/50';
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3.5 py-1.5 gap-2',
  }[size];

  const starSizes = {
    sm: 12,
    md: 14,
    lg: 18,
  }[size];

  return (
    <div
      className={`inline-flex items-center font-medium rounded-full border ${getColorClasses(
        score
      )} ${sizeClasses}`}
      title={hasRating ? `Média geral: ${score.toFixed(1)} de 10` : 'Sem avaliações'}
    >
      <Star size={starSizes} className={hasRating ? 'fill-current' : 'text-slate-500'} />
      <span>{hasRating ? `${score.toFixed(1)}/10` : 'Sem nota'}</span>
      {showCount && typeof count === 'number' && (
        <span className="text-slate-400 text-xs font-normal">
          ({count} {count === 1 ? 'avaliação' : 'avaliações'})
        </span>
      )}
    </div>
  );
};
