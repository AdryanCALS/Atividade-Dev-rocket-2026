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
    <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
      {/* Backdrop Image com overlay gradiente */}
      {movie.url_backdrop && (
        <div className="absolute inset-0 z-0 h-96 w-full overflow-hidden opacity-25">
          <img
            src={movie.url_backdrop}
            alt=""
            className="w-full h-full object-cover object-center filter blur-sm scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-10 p-6 sm:p-8 md:p-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
        {/* Poster */}
        <div className="w-44 sm:w-56 shrink-0 aspect-[2/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-700/80 shadow-2xl mx-auto md:mx-0 flex items-center justify-center">
          {movie.url_poster && !posterError ? (
            <img
              src={movie.url_poster}
              alt={`Pôster de ${movie.titulo}`}
              className="w-full h-full object-cover"
              onError={() => setPosterError(true)}
            />
          ) : (
            <div className="p-6 text-center flex flex-col items-center justify-center">
              <Film size={48} className="text-slate-600 mb-2" />
              <span className="text-xs font-semibold text-slate-400">{movie.titulo}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4 w-full">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {movie.titulo}
              </h1>
              {movie.ano_lancamento && (
                <span className="text-xl sm:text-2xl text-slate-400 font-normal">
                  ({movie.ano_lancamento})
                </span>
              )}
            </div>

            {/* Metadados linha secundária */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-slate-300 mt-2">
              {movie.diretor && (
                <span className="flex items-center gap-1.5 font-medium">
                  <User size={15} className="text-emerald-400" />
                  <span>Direção: {movie.diretor}</span>
                </span>
              )}

              {movie.data_lancamento && (
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Calendar size={14} className="text-emerald-400" />
                  <span>Lançamento: {formatDate(String(movie.data_lancamento))}</span>
                </span>
              )}

              {movie.duracao_minutos && (
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock size={14} />
                  <span>{formatDuration(movie.duracao_minutos)}</span>
                </span>
              )}

              {movie.status_filme && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300">
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
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800/90 text-slate-200 border border-slate-700"
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
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Sinopse
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                {movie.sinopse}
              </p>
            </div>
          )}

          {/* Atores & Roteiristas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            {movie.atores && movie.atores.length > 0 && (
              <div>
                <span className="text-slate-400 font-semibold block mb-1">Elenco principal:</span>
                <span className="text-slate-300">{movie.atores.slice(0, 5).join(', ')}</span>
              </div>
            )}
            {movie.roteiristas && movie.roteiristas.length > 0 && (
              <div>
                <span className="text-slate-400 font-semibold block mb-1">Roteiro:</span>
                <span className="text-slate-300">{movie.roteiristas.slice(0, 3).join(', ')}</span>
              </div>
            )}
          </div>

          {/* Botões de Ação do Administrador */}
          <div className="pt-4 flex flex-wrap items-center gap-3 border-t border-slate-800">
            <button
              onClick={onOpenReviewModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition shadow-md shadow-emerald-500/20"
            >
              <MessageSquarePlus size={16} />
              <span>Avaliar Filme</span>
            </button>

            <Link
              to={`/filmes/${movieId}/editar`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-slate-800 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-750 transition"
            >
              <Edit3 size={15} />
              <span>Editar Filme</span>
            </Link>

            <button
              onClick={onOpenDeleteModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-rose-950/40 border border-rose-800/50 text-rose-300 hover:bg-rose-900/60 hover:text-rose-100 transition"
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
