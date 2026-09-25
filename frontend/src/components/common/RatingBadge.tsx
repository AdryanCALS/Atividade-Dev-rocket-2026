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

  const tooltip = hasRating
    ? showCount && typeof count === 'number'
      ? `Média geral: ${currentNota!.toFixed(1)} de 10`
      : `Nota: ${currentNota!.toFixed(1)} de 10`
    : 'Sem avaliações';

  return (
    <div
      className={`inline-flex items-center font-semibold rounded-full border shadow-sm ${getRatingColorClass(
        currentNota
      )} ${sizeClasses}`}
      title={tooltip}
    >
      <Star
        size={starSizes}
        className={hasRating ? 'fill-visagio-yellow text-visagio-yellow' : 'text-visagio-muted'}
      />
      <span>{formatRating(currentNota)}</span>
      {showCount && typeof count === 'number' && (
        <span className="text-visagio-muted text-xs font-normal">
          ({count} {count === 1 ? 'avaliação' : 'avaliações'})
        </span>
      )}
    </div>
  );
};
