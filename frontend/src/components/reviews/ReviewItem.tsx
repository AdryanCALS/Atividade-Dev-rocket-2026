import React from 'react';
import { User, Calendar } from 'lucide-react';
import { ReviewResponse } from '../../types';
import { RatingBadge } from '../common/RatingBadge';

interface ReviewItemProps {
  review: ReviewResponse;
}

export const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  const formattedDate = new Date(review.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <article className="p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <User size={16} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200">{review.nome}</h4>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar size={12} />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        <RatingBadge nota={review.nota} size="sm" showCount={false} />
      </div>

      <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line pl-0.5">
        {review.comentario}
      </p>
    </article>
  );
};
