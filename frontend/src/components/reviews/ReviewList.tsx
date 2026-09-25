import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MessageSquarePlus, MessageSquare } from 'lucide-react';
import { getReviewsByMovie } from '../../api/reviews';
import { ReviewItem } from './ReviewItem';
import { Pagination } from '../common/Pagination';

interface ReviewListProps {
  movieId: string;
  movieTitle?: string;
  onOpenReviewModal?: () => void;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  movieId,
  onOpenReviewModal,
}) => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['reviews', movieId, page],
    queryFn: () => getReviewsByMovie(movieId, page, 10),
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-visagio-border">
        <div>
          <h3 className="text-xl font-bold text-visagio-black flex items-center gap-2">
            <MessageSquare size={20} className="text-visagio-yellow" />
            <span>Avaliações e Resenhas</span>
          </h3>
          <p className="text-xs text-visagio-muted mt-0.5">
            Histórico de notas e comentários registrados pelos usuários (escala 0 a 10)
          </p>
        </div>

        {onOpenReviewModal && (
          <button
            onClick={onOpenReviewModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-visagio-yellow text-visagio-black hover:bg-visagio-yellowHover transition shadow-sm"
          >
            <MessageSquarePlus size={16} />
            <span>Escrever Avaliação</span>
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="py-12 flex justify-center items-center text-visagio-muted">
          <div className="w-6 h-6 border-2 border-visagio-yellow border-t-transparent rounded-full animate-spin" />
        </div>
      ) : data?.items && data.items.length > 0 ? (
        <div className="space-y-4">
          <div className="space-y-3">
            {data.items.map((rev) => (
              <ReviewItem key={rev.sk_movie_review_id} review={rev} />
            ))}
          </div>

          <Pagination
            page={data.page}
            totalPages={data.total_pages}
            totalItems={data.total}
            pageSize={data.page_size}
            onPageChange={(p) => setPage(p)}
            itemLabel="avaliações"
          />
        </div>
      ) : (
        <div className="py-12 text-center bg-white border border-visagio-border rounded-2xl p-6 shadow-sm">
          <MessageSquare size={36} className="mx-auto text-visagio-muted mb-2" />
          <h4 className="text-sm font-semibold text-visagio-black">Ainda não há avaliações para este filme</h4>
          <p className="text-xs text-visagio-muted mt-1 max-w-sm mx-auto">
            Seja o primeiro a compartilhar uma nota de 0 a 10 e sua resenha!
          </p>

          {onOpenReviewModal && (
            <button
              onClick={onOpenReviewModal}
              className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-visagio-bg border border-visagio-border text-visagio-black hover:bg-visagio-yellow hover:border-visagio-yellowHover transition"
            >
              Adicionar primeira avaliação
            </button>
          )}
        </div>
      )}
    </section>
  );
};
