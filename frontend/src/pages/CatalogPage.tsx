import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, X, Film, AlertCircle, RefreshCw } from 'lucide-react';
import { getMovies } from '../api/movies';
import { MovieGrid } from '../components/movies/MovieGrid';
import { Pagination } from '../components/common/Pagination';
import { useDebounce } from '../hooks/useDebounce';

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlQ = searchParams.get('q') || '';
  const urlPage = parseInt(searchParams.get('page') || '1', 10);
  const urlSortBy = (searchParams.get('sort_by') || 'lancamento') as 'lancamento' | 'titulo' | 'nota_media';
  const urlOrder = (searchParams.get('order') || 'desc') as 'asc' | 'desc';

  const [searchInput, setSearchInput] = useState(urlQ);
  const debouncedSearch = useDebounce(searchInput, 350);

  // Sincroniza o debouncedSearch de volta na URL
  useEffect(() => {
    const currentQ = searchParams.get('q') || '';
    if (debouncedSearch !== currentQ) {
      const nextParams = new URLSearchParams(searchParams);
      if (debouncedSearch.trim()) {
        nextParams.set('q', debouncedSearch.trim());
      } else {
        nextParams.delete('q');
      }
      nextParams.set('page', '1'); // Reset para página 1 em nova busca
      setSearchParams(nextParams, { replace: true });
    }
  }, [debouncedSearch, searchParams, setSearchParams]);

  // Mantém o input sincronizado se a URL mudar externamente (ex: botão voltar)
  useEffect(() => {
    setSearchInput(urlQ);
  }, [urlQ]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['movies', { page: urlPage, q: urlQ, sort_by: urlSortBy, order: urlOrder }],
    queryFn: () =>
      getMovies({
        page: urlPage,
        page_size: 18,
        q: urlQ,
        sort_by: urlSortBy,
        order: urlOrder,
      }),
  });

  const handlePageChange = (newPage: number) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', newPage.toString());
    setSearchParams(nextParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (newSortBy: 'lancamento' | 'titulo' | 'nota_media') => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('sort_by', newSortBy);
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const handleOrderToggle = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('order', urlOrder === 'asc' ? 'desc' : 'asc');
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('q');
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner / Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-lg">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar por título, diretor, gênero ou sinopse..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm transition"
          />
          {searchInput && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded transition"
              title="Limpar busca"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 text-sm">
          <SlidersHorizontal size={16} className="text-slate-400" />
          <span className="text-slate-400 text-xs hidden sm:inline">Ordenar:</span>

          <select
            value={urlSortBy}
            onChange={(e) =>
              handleSortChange(e.target.value as 'lancamento' | 'titulo' | 'nota_media')
            }
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 transition"
          >
            <option value="lancamento">Ano de Lançamento</option>
            <option value="titulo">Título</option>
            <option value="nota_media">Nota Média</option>
          </select>

          <button
            onClick={handleOrderToggle}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-xs sm:text-sm hover:border-slate-600 transition"
            title="Alternar ordem crescente/decrescente"
          >
            {urlOrder === 'desc' ? 'Decrescente ↓' : 'Crescente ↑'}
          </button>
        </div>
      </div>

      {/* Content Status */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Carregando catálogo de filmes...</p>
        </div>
      ) : isError ? (
        <div className="py-16 text-center bg-slate-900/50 border border-rose-900/40 rounded-2xl p-6">
          <AlertCircle size={40} className="mx-auto text-rose-500 mb-3" />
          <h3 className="text-base font-semibold text-rose-200">Falha ao carregar o catálogo</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
            {error instanceof Error ? error.message : 'Não foi possível conectar à API do backend.'}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm transition"
          >
            <RefreshCw size={15} /> Tentar novamente
          </button>
        </div>
      ) : data?.items && data.items.length > 0 ? (
        <>
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              {data.total} {data.total === 1 ? 'filme encontrado' : 'filmes encontrados'}
              {urlQ && (
                <span className="text-emerald-400 font-medium ml-1">
                  para "{urlQ}"
                </span>
              )}
            </span>
            <span>
              Página {data.page} de {data.total_pages}
            </span>
          </div>

          <MovieGrid movies={data.items} />

          <Pagination
            page={data.page}
            totalPages={data.total_pages}
            totalItems={data.total}
            pageSize={data.page_size}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="py-20 text-center bg-slate-900/30 border border-slate-800 rounded-2xl p-8">
          <Film size={44} className="mx-auto text-slate-600 mb-3" />
          <h3 className="text-lg font-semibold text-slate-200">Nenhum filme encontrado</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            {urlQ
              ? `Não foram encontrados resultados para "${urlQ}". Tente outros termos.`
              : 'Nenhum filme cadastrado no catálogo ainda.'}
          </p>
          {urlQ && (
            <button
              onClick={handleClearSearch}
              className="mt-4 px-4 py-2 bg-emerald-500 text-slate-950 font-semibold rounded-lg text-sm hover:bg-emerald-400 transition"
            >
              Limpar busca
            </button>
          )}
        </div>
      )}
    </div>
  );
};
