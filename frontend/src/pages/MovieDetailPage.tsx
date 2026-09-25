import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';
import { getMovieById } from '../api/movies';
import { MovieHero } from '../components/movies/MovieHero';
import { MoviePerformanceInfo } from '../components/movies/MoviePerformanceInfo';
import { ReviewList } from '../components/reviews/ReviewList';
import { ReviewModal } from '../components/reviews/ReviewModal';
import { DeleteMovieModal } from '../components/movies/DeleteMovieModal';
import { getMovieId } from '../utils/movie';

export const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: movie, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => getMovieById(id!),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center text-visagio-muted">
        <div className="w-8 h-8 border-2 border-visagio-yellow border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm">Carregando detalhes do filme...</p>
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="p-8 rounded-2xl bg-rose-50 border border-rose-200 space-y-4">
          <AlertCircle size={44} className="mx-auto text-rose-600" />
          <h2 className="text-lg font-bold text-rose-800">Filme não encontrado</h2>
          <p className="text-sm text-rose-700">
            {error instanceof Error ? error.message : 'O filme solicitado não existe ou foi removido.'}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-rose-200 text-rose-800 rounded-xl text-sm font-medium hover:bg-rose-100 transition"
            >
              <ArrowLeft size={16} /> Voltar ao Catálogo
            </Link>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-rose-200 text-rose-800 rounded-xl text-sm font-medium hover:bg-rose-100 transition"
            >
              <RefreshCw size={15} /> Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  const movieId = getMovieId(movie);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Botão Voltar */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-visagio-muted hover:text-visagio-black transition"
      >
        <ArrowLeft size={16} />
        <span>Voltar ao catálogo</span>
      </Link>

      {/* Hero do Filme */}
      <MovieHero
        movie={movie}
        onOpenReviewModal={() => setIsReviewModalOpen(true)}
        onOpenDeleteModal={() => setIsDeleteModalOpen(true)}
      />

      {/* Métricas e Desempenho */}
      {movie.performance && <MoviePerformanceInfo performance={movie.performance} />}

      {/* Histórico de Avaliações */}
      <ReviewList
        movieId={movieId}
        movieTitle={movie.titulo}
        onOpenReviewModal={() => setIsReviewModalOpen(true)}
      />

      {/* Modais */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        movieId={movieId}
        movieTitle={movie.titulo}
      />

      <DeleteMovieModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        movieId={movieId}
        movieTitle={movie.titulo}
      />
    </div>
  );
};
