import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MessageSquarePlus, MessageSquare } from 'lucide-react';
import { getReviewsByMovie } from '../../api/reviews';
import { ReviewItem } from './ReviewItem';
import { ReviewModal } from './ReviewModal';
import { Pagination } from '../common/Pagination';

interface ReviewListProps {
  movieId: string;
  movieTitle: string;
}

export const ReviewList: React.FC<ReviewListProps> = ({ movieId, movieTitle }) => {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['reviews', movieId, page],
    queryFn: () => getReviewsByMovie(movieId, page, 10),
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <MessageSquare size={20} className="text-emerald-400" />
            <span>Avaliações e Resenhas</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Histórico de notas e comentários registrados pelos usuários (escala 0 a 10)
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition shadow-md shadow-emerald-500/20"
        >
          <MessageSquarePlus size={16} />
          <span>Escrever Avaliação</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-12 flex justify-center items-center text-slate-400">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
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
          />
        </div>
      ) : (
        <div className="py-12 text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
          <MessageSquare size={36} className="mx-auto text-slate-600 mb-2" />
          <h4 className="text-sm font-semibold text-slate-200">Ainda não há avaliações para este filme</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Seja o primeiro a compartilhar uma nota de 0 a 10 e sua resenha crítica!
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-emerald-400 hover:bg-slate-700 transition"
          >
            Adicionar primeira avaliação
          </button>
        </div>
      )}

      {/* Modal para criar avaliação */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movieId={movieId}
        movieTitle={movieTitle}
      />
    </section>
  );
};
