import React from 'react';
import { Star } from 'lucide-react';
import { getRatingColorClass, formatRating } from '../../utils/rating';

interface RatingBadgeProps {
  nota?: number | null;
  score?: number | null;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export const RatingBadge: React.FC<RatingBadgeProps> = ({
  nota,
  score,
  count,
  size = 'md',
  showCount = true,
}) => {
  const currentNota = typeof nota === 'number' ? nota : score;
  const hasRating = typeof currentNota === 'number' && !isNaN(currentNota);

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
      className={`inline-flex items-center font-medium rounded-full border ${getRatingColorClass(
        currentNota
      )} ${sizeClasses}`}
      title={hasRating ? `Média geral: ${currentNota!.toFixed(1)} de 10` : 'Sem avaliações'}
    >
      <Star size={starSizes} className={hasRating ? 'fill-current' : 'text-slate-500'} />
      <span>{formatRating(currentNota)}</span>
      {showCount && typeof count === 'number' && (
        <span className="text-slate-400 text-xs font-normal">
          ({count} {count === 1 ? 'avaliação' : 'avaliações'})
        </span>
      )}
    </div>
  );
};
