import React from 'react';
import { MovieListItem } from '../../types';
import { MovieCard } from './MovieCard';

interface MovieGridProps {
  movies: MovieListItem[];
}

export const MovieGrid: React.FC<MovieGridProps> = ({ movies }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.sk_movie_id || movie.id_filme} movie={movie} />
      ))}
    </div>
  );
};
