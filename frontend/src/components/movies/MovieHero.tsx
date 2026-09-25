import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, Film, Edit3, Trash2, MessageSquarePlus, Calendar } from 'lucide-react';
import { MovieDetailResponse } from '../../types';
import { RatingBadge } from '../common/RatingBadge';
import { getMovieId, formatDate } from '../../utils/movie';

interface MovieHeroProps {
  movie: MovieDetailResponse;
  onOpenReviewModal: () => void;
  onOpenDeleteModal: () => void;
}

export const MovieHero: React.FC<MovieHeroProps> = ({
  movie,
  onOpenReviewModal,
  onOpenDeleteModal,
}) => {
  const [posterError, setPosterError] = useState(false);
  const movieId = getMovieId(movie);

  const formatDuration = (minutos: number | null | undefined) => {
    if (!minutos) return null;
    const hours = Math.floor(minutos / 60);
    const mins = minutos % 60;
    if (hours === 0) return `${mins} min`;
    return `${hours}h ${mins > 0 ? `${mins}min` : ''}`;
  };

  return (
    <div className="relative rounded-3xl overflow-hidden bg-white border border-visagio-border shadow-xl">
      {/* Backdrop Image com overlay gradiente para o tema claro */}
      {movie.url_backdrop && (
        <div className="absolute inset-0 z-0 h-96 w-full overflow-hidden opacity-20">
          <img
            src={movie.url_backdrop}
            alt=""
            className="w-full h-full object-cover object-center filter blur-sm scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/85 to-transparent" />
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-10 p-6 sm:p-8 md:p-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
        {/* Poster */}
        <div className="w-44 sm:w-56 shrink-0 aspect-[2/3] rounded-2xl overflow-hidden bg-visagio-bg border border-visagio-border shadow-lg mx-auto md:mx-0 flex items-center justify-center">
          {movie.url_poster && !posterError ? (
            <img
              src={movie.url_poster}
              alt={`Pôster de ${movie.titulo}`}
              className="w-full h-full object-cover"
              onError={() => setPosterError(true)}
            />
          ) : (
            <div className="p-6 text-center flex flex-col items-center justify-center">
              <Film size={48} className="text-visagio-muted mb-2" />
              <span className="text-xs font-semibold text-visagio-muted">{movie.titulo}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4 w-full">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-visagio-black tracking-tight">
                {movie.titulo}
              </h1>
              {movie.ano_lancamento && (
                <span className="text-xl sm:text-2xl text-visagio-muted font-normal">
                  ({movie.ano_lancamento})
                </span>
              )}
            </div>

            {/* Metadados linha secundária */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-visagio-muted mt-2">
              {movie.diretor && (
                <span className="flex items-center gap-1.5 font-semibold text-visagio-black">
                  <User size={15} className="text-visagio-yellow" />
                  <span>Direção: {movie.diretor}</span>
                </span>
              )}

              {movie.data_lancamento && (
                <span className="flex items-center gap-1.5 font-medium text-visagio-black">
                  <Calendar size={14} className="text-visagio-yellow" />
                  <span>Lançamento: {formatDate(String(movie.data_lancamento))}</span>
                </span>
              )}

              {movie.duracao_minutos && (
                <span className="flex items-center gap-1 text-visagio-muted">
                  <Clock size={14} />
                  <span>{formatDuration(movie.duracao_minutos)}</span>
                </span>
              )}

              {movie.status_filme && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-visagio-bg border border-visagio-border text-visagio-black shadow-sm">
                  {movie.status_filme}
                </span>
              )}
            </div>
          </div>

          {/* Gêneros */}
          {movie.generos && movie.generos.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {movie.generos.map((gen) => (
                <span
                  key={gen}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-visagio-bg text-visagio-black border border-visagio-border shadow-sm"
                >
                  {gen}
                </span>
              ))}
            </div>
          )}

          {/* Resumo da Avaliação */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <RatingBadge
              nota={movie.reviews_summary?.nota_media_usuarios}
              count={movie.reviews_summary?.qtd_avaliacoes_usuarios}
              size="lg"
            />
          </div>

          {/* Sinopse */}
          {movie.sinopse && (
            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-visagio-muted mb-1">
                Sinopse
              </h3>
              <p className="text-sm sm:text-base text-visagio-black leading-relaxed max-w-3xl">
                {movie.sinopse}
              </p>
            </div>
          )}

          {/* Atores & Roteiristas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            {movie.atores && movie.atores.length > 0 && (
              <div>
                <span className="text-visagio-muted font-bold block mb-1">Elenco principal:</span>
                <span className="text-visagio-black">{movie.atores.slice(0, 5).join(', ')}</span>
              </div>
            )}
            {movie.roteiristas && movie.roteiristas.length > 0 && (
              <div>
                <span className="text-visagio-muted font-bold block mb-1">Roteiro:</span>
                <span className="text-visagio-black">{movie.roteiristas.slice(0, 3).join(', ')}</span>
              </div>
            )}
          </div>

          {/* Botões de Ação do Administrador */}
          <div className="pt-4 flex flex-wrap items-center gap-3 border-t border-visagio-border">
            <button
              onClick={onOpenReviewModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-visagio-yellow text-visagio-black hover:bg-visagio-yellowHover transition shadow-sm border border-visagio-yellowHover/60"
            >
              <MessageSquarePlus size={16} />
              <span>Avaliar Filme</span>
            </button>

            <Link
              to={`/filmes/${movieId}/editar`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white border border-visagio-inputBorder text-visagio-black hover:bg-visagio-bg transition shadow-sm"
            >
              <Edit3 size={15} />
              <span>Editar Filme</span>
            </Link>

            <button
              onClick={onOpenDeleteModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 hover:text-rose-800 transition shadow-sm"
            >
              <Trash2 size={15} />
              <span>Excluir Filme</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
