import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, X, Film, Check, AlertCircle } from 'lucide-react';
import { getGenres } from '../../api/genres';
import { MovieCreate } from '../../types';

interface MovieFormProps {
  initialValues?: Partial<MovieCreate>;
  onSubmit: (data: MovieCreate) => void;
  isLoading: boolean;
  error?: Error | null;
  submitButtonText?: string;
  onCancel: () => void;
}

export const MovieForm: React.FC<MovieFormProps> = ({
  initialValues,
  onSubmit,
  isLoading,
  error,
  submitButtonText = 'Salvar Filme',
  onCancel,
}) => {
  const [titulo, setTitulo] = useState(initialValues?.titulo || '');
  const [diretor, setDiretor] = useState(initialValues?.diretor || '');
  const [anoLancamento, setAnoLancamento] = useState<string>(
    initialValues?.ano_lancamento ? String(initialValues.ano_lancamento) : ''
  );
  const [dataLancamento, setDataLancamento] = useState(initialValues?.data_lancamento || '');
  const [duracaoMinutos, setDuracaoMinutos] = useState<string>(
    initialValues?.duracao_minutos ? String(initialValues.duracao_minutos) : ''
  );
  const [statusFilme, setStatusFilme] = useState(initialValues?.status_filme || 'Lançado');
  const [sinopse, setSinopse] = useState(initialValues?.sinopse || '');
  const [urlPoster, setUrlPoster] = useState(initialValues?.url_poster || '');
  const [urlBackdrop, setUrlBackdrop] = useState(initialValues?.url_backdrop || '');
  const [selectedGeneros, setSelectedGeneros] = useState<string[]>(initialValues?.generos || []);
  const [newGenreInput, setNewGenreInput] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Busca gêneros cadastrados na base de dados
  const { data: availableGenres } = useQuery({
    queryKey: ['genres'],
    queryFn: getGenres,
  });

  const toggleGenre = (genreName: string) => {
    if (selectedGeneros.includes(genreName)) {
      setSelectedGeneros(selectedGeneros.filter((g) => g !== genreName));
    } else {
      setSelectedGeneros([...selectedGeneros, genreName]);
    }
  };

  const handleAddNewGenre = () => {
    const trimmed = newGenreInput.trim();
    if (!trimmed) return;
    if (!selectedGeneros.includes(trimmed)) {
      setSelectedGeneros([...selectedGeneros, trimmed]);
    }
    setNewGenreInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) {
      setValidationError('O título do filme é obrigatório.');
      return;
    }

    setValidationError(null);

    const payload: MovieCreate = {
      titulo: titulo.trim(),
      diretor: diretor.trim() || null,
      ano_lancamento: anoLancamento ? parseInt(anoLancamento, 10) : null,
      data_lancamento: dataLancamento || null,
      duracao_minutos: duracaoMinutos ? parseInt(duracaoMinutos, 10) : null,
      status_filme: statusFilme || 'Lançado',
      sinopse: sinopse.trim() || null,
      url_poster: urlPoster.trim() || null,
      url_backdrop: urlBackdrop.trim() || null,
      generos: selectedGeneros,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(validationError || error) && (
        <div className="p-4 bg-rose-950/50 border border-rose-800/80 rounded-2xl flex items-center gap-3 text-rose-300 text-sm">
          <AlertCircle size={18} className="shrink-0 text-rose-400" />
          <span>{validationError || error?.message || 'Erro ao processar filme.'}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1 & 2: Campos de dados principais */}
        <div className="lg:col-span-2 space-y-5 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
          <div>
            <label htmlFor="movie-title" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Título do Filme *
            </label>
            <input
              id="movie-title"
              type="text"
              required
              maxLength={500}
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: O Poderoso Chefão"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="movie-director" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Diretor / Direção
              </label>
              <input
                id="movie-director"
                type="text"
                value={diretor}
                onChange={(e) => setDiretor(e.target.value)}
                placeholder="Ex: Francis Ford Coppola"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor="movie-status" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                id="movie-status"
                value={statusFilme}
                onChange={(e) => setStatusFilme(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
              >
                <option value="Lançado">Lançado</option>
                <option value="Em Produção">Em Produção</option>
                <option value="Pós-Produção">Pós-Produção</option>
                <option value="Planejado">Planejado</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="movie-year" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Ano de Lançamento
              </label>
              <input
                id="movie-year"
                type="number"
                min="1880"
                max="2100"
                value={anoLancamento}
                onChange={(e) => setAnoLancamento(e.target.value)}
                placeholder="Ex: 1972"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor="movie-date" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Data Completa
              </label>
              <input
                id="movie-date"
                type="date"
                value={dataLancamento}
                onChange={(e) => setDataLancamento(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor="movie-runtime" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Duração (minutos)
              </label>
              <input
                id="movie-runtime"
                type="number"
                min="1"
                max="1000"
                value={duracaoMinutos}
                onChange={(e) => setDuracaoMinutos(e.target.value)}
                placeholder="Ex: 175"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="movie-synopsis" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Sinopse do Filme
            </label>
            <textarea
              id="movie-synopsis"
              rows={4}
              value={sinopse}
              onChange={(e) => setSinopse(e.target.value)}
              placeholder="Descreva a história e premissa principal do filme..."
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm resize-y"
            />
          </div>

          {/* Seleção de Gêneros */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Gêneros do Filme
            </label>

            {/* Tags Selecionadas */}
            <div className="flex flex-wrap gap-2 min-h-8">
              {selectedGeneros.map((gen) => (
                <span
                  key={gen}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                >
                  <Check size={12} />
                  <span>{gen}</span>
                  <button
                    type="button"
                    onClick={() => toggleGenre(gen)}
                    className="p-0.5 rounded-full hover:bg-emerald-500/30 text-emerald-400 hover:text-white"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              {selectedGeneros.length === 0 && (
                <span className="text-xs text-slate-500 italic">
                  Nenhum gênero selecionado ainda.
                </span>
              )}
            </div>

            {/* Chips Sugeridos da API */}
            {availableGenres && availableGenres.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] text-slate-400 font-medium">Gêneros existentes (clique para alternar):</span>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 rounded-lg bg-slate-950/60 border border-slate-800">
                  {availableGenres.map((g) => {
                    const isSelected = selectedGeneros.includes(g.nome_genero);
                    return (
                      <button
                        key={g.sk_genre_id}
                        type="button"
                        onClick={() => toggleGenre(g.nome_genero)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                          isSelected
                            ? 'bg-emerald-600 text-slate-950 font-bold'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                        }`}
                      >
                        {g.nome_genero}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Adicionar Novo Gênero */}
            <div className="flex items-center gap-2 pt-1 max-w-sm">
              <input
                type="text"
                value={newGenreInput}
                onChange={(e) => setNewGenreInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddNewGenre();
                  }
                }}
                placeholder="Novo gênero (ex: Noir)..."
                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddNewGenre}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition"
              >
                <Plus size={14} /> Adicionar
              </button>
            </div>
          </div>
        </div>

        {/* Coluna 3: Pôster & Backdrop */}
        <div className="space-y-5 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Mídias Visuais
          </h3>

          <div>
            <label htmlFor="movie-poster-url" className="block text-xs font-medium text-slate-400 mb-1">
              URL do Pôster
            </label>
            <input
              id="movie-poster-url"
              type="url"
              value={urlPoster}
              onChange={(e) => setUrlPoster(e.target.value)}
              placeholder="https://.../poster.jpg"
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
            />
          </div>

          <div>
            <label htmlFor="movie-backdrop-url" className="block text-xs font-medium text-slate-400 mb-1">
              URL do Backdrop (Capa)
            </label>
            <input
              id="movie-backdrop-url"
              type="url"
              value={urlBackdrop}
              onChange={(e) => setUrlBackdrop(e.target.value)}
              placeholder="https://.../backdrop.jpg"
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
            />
          </div>

          {/* Preview do Pôster */}
          <div className="pt-2">
            <span className="block text-[11px] text-slate-500 mb-2">Pré-visualização do Pôster:</span>
            <div className="w-36 aspect-[2/3] mx-auto rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
              {urlPoster ? (
                <img
                  src={urlPoster}
                  alt="Pré-visualização do pôster"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="text-center p-3 text-slate-600">
                  <Film size={28} className="mx-auto mb-1 opacity-50" />
                  <span className="text-[10px]">Sem imagem</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ações do Formulário */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 disabled:opacity-50 transition shadow-lg shadow-emerald-500/20"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Salvando filme...</span>
            </>
          ) : (
            <span>{submitButtonText}</span>
          )}
        </button>
      </div>
    </form>
  );
};
