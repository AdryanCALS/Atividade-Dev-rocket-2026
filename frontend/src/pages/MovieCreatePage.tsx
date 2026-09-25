import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Film } from 'lucide-react';
import { createMovie } from '../api/movies';
import { MovieForm } from '../components/movies/MovieForm';
import { MovieCreate } from '../types';
import { getMovieId } from '../utils/movie';

export const MovieCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: MovieCreate) => createMovie(payload),
    onSuccess: (createdMovie) => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      const targetId = getMovieId(createdMovie);
      navigate(`/filmes/${targetId}`);
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
          title="Voltar ao catálogo"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Film size={22} className="text-emerald-400" />
            <span>Cadastrar Novo Filme</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Adicione um novo filme ao catálogo da RocketLab Movies
          </p>
        </div>
      </div>

      <MovieForm
        onSubmit={(data) => mutation.mutate(data)}
        isLoading={mutation.isPending}
        error={mutation.error as Error | null}
        submitButtonText="Cadastrar Filme"
        onCancel={() => navigate('/')}
      />
    </div>
  );
};
