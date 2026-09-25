import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';
import { MovieListItem } from '../../types';
import { RatingBadge } from '../common/RatingBadge';
import { getMovieId } from '../../utils/movie';

interface MovieCardProps {
  movie: MovieListItem;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const [imageError, setImageError] = useState(false);
  const movieId = getMovieId(movie);

  return (
    <Link
      to={`/filmes/${movieId}`}
      className="group flex flex-col bg-white border border-visagio-border rounded-xl overflow-hidden hover:border-visagio-yellow hover:shadow-xl hover:shadow-visagio-yellow/10 transition duration-200"
    >
      {/* Poster / Fallback */}
      <div className="relative aspect-[2/3] w-full bg-visagio-bg overflow-hidden flex items-center justify-center">
        {movie.url_poster && !imageError ? (
          <img
            src={movie.url_poster}
            alt={`Pôster do filme ${movie.titulo}`}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full p-4 flex flex-col items-center justify-center text-center bg-visagio-bg border-b border-visagio-border">
            <Film size={36} className="text-visagio-muted mb-2 group-hover:text-visagio-black transition" />
            <span className="text-xs font-semibold text-visagio-muted line-clamp-3">
              {movie.titulo}
            </span>
          </div>
        )}

        {/* Rating Floating Badge */}
        <div className="absolute top-2 right-2 drop-shadow-sm">
          <RatingBadge
            nota={movie.reviews_summary?.nota_media_usuarios}
            count={movie.reviews_summary?.qtd_avaliacoes_usuarios}
            size="sm"
            showCount={false}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          <h3
            className="text-sm font-bold text-visagio-black group-hover:text-amber-600 transition line-clamp-1"
            title={movie.titulo}
          >
            {movie.titulo}
          </h3>

          <div className="flex items-center gap-2 mt-1 text-xs text-visagio-muted">
            {movie.ano_lancamento && <span>{movie.ano_lancamento}</span>}
            {movie.ano_lancamento && movie.diretor && <span>•</span>}
            {movie.diretor && (
              <span className="truncate max-w-[120px]" title={movie.diretor}>
                {movie.diretor}
              </span>
            )}
          </div>
        </div>

        {/* Genres */}
        {movie.generos && movie.generos.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {movie.generos.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-visagio-bg text-visagio-black border border-visagio-border"
              >
                {genre}
              </span>
            ))}
            {movie.generos.length > 2 && (
              <span className="px-1.5 py-0.5 text-[10px] text-visagio-muted">
                +{movie.generos.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};
