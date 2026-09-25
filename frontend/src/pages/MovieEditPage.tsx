import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Edit3, AlertCircle } from 'lucide-react';
import { getMovieById, updateMovie } from '../api/movies';
import { MovieForm } from '../components/movies/MovieForm';
import { MovieCreate, MovieUpdate } from '../types';

export const MovieEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: movie, isLoading: isFetching, isError, error: fetchError } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => getMovieById(id!),
    enabled: Boolean(id),
  });

  const mutation = useMutation({
    mutationFn: (payload: MovieUpdate) => updateMovie(id!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movie', id] });
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      navigate(`/filmes/${id}`);
    },
  });

  if (isFetching) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center text-slate-400">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm">Carregando dados do filme para edição...</p>
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="p-8 rounded-2xl bg-slate-900 border border-rose-900/50 space-y-4">
          <AlertCircle size={44} className="mx-auto text-rose-500" />
          <h2 className="text-lg font-bold text-rose-200">Não foi possível carregar o filme</h2>
          <p className="text-sm text-slate-400">
            {fetchError instanceof Error ? fetchError.message : 'Filme não encontrado.'}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 rounded-xl text-sm font-medium hover:bg-slate-700 transition"
          >
            <ArrowLeft size={16} /> Voltar ao Catálogo
          </Link>
        </div>
      </div>
    );
  }

  const initialValues: Partial<MovieCreate> = {
    titulo: movie.titulo,
    diretor: movie.diretor,
    ano_lancamento: movie.ano_lancamento,
    data_lancamento: movie.data_lancamento,
    duracao_minutos: movie.duracao_minutos,
    status_filme: movie.status_filme || 'Lançado',
    sinopse: movie.sinopse,
    url_poster: movie.url_poster,
    url_backdrop: movie.url_backdrop,
    generos: movie.generos,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to={`/filmes/${id}`}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
          title="Voltar aos detalhes"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Edit3 size={22} className="text-emerald-400" />
            <span>Editar Filme: {movie.titulo}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Atualize as informações do filme e seus relacionamentos
          </p>
        </div>
      </div>

      <MovieForm
        initialValues={initialValues}
        onSubmit={(data) => mutation.mutate(data)}
        isLoading={mutation.isPending}
        error={mutation.error as Error | null}
        submitButtonText="Salvar Alterações"
        onCancel={() => navigate(`/filmes/${id}`)}
      />
    </div>
  );
};
