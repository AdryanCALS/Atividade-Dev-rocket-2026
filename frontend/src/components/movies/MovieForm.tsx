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

interface MovieFormData {
  titulo: string;
  diretor: string;
  ano_lancamento: string;
  data_lancamento: string;
  duracao_minutos: string;
  status_filme: string;
  sinopse: string;
  url_poster: string;
  url_backdrop: string;
  generos: string[];
}

export const MovieForm: React.FC<MovieFormProps> = ({
  initialValues,
  onSubmit,
  isLoading,
  error,
  submitButtonText = 'Salvar Filme',
  onCancel,
}) => {
  const [formData, setFormData] = useState<MovieFormData>(() => ({
    titulo: initialValues?.titulo || '',
    diretor: initialValues?.diretor || '',
    ano_lancamento: initialValues?.ano_lancamento ? String(initialValues.ano_lancamento) : '',
    data_lancamento: initialValues?.data_lancamento || '',
    duracao_minutos: initialValues?.duracao_minutos ? String(initialValues.duracao_minutos) : '',
    status_filme: initialValues?.status_filme || 'Lançado',
    sinopse: initialValues?.sinopse || '',
    url_poster: initialValues?.url_poster || '',
    url_backdrop: initialValues?.url_backdrop || '',
    generos: initialValues?.generos || [],
  }));

  const [newGenreInput, setNewGenreInput] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const updateField = <K extends keyof MovieFormData>(field: K, value: MovieFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Busca gêneros cadastrados na base de dados
  const { data: availableGenres } = useQuery({
    queryKey: ['genres'],
    queryFn: getGenres,
  });

  const toggleGenre = (genreName: string) => {
    const isSelected = formData.generos.includes(genreName);
    updateField(
      'generos',
      isSelected ? formData.generos.filter((g) => g !== genreName) : [...formData.generos, genreName]
    );
  };

  const handleAddNewGenre = () => {
    const trimmed = newGenreInput.trim();
    if (!trimmed) return;
    if (!formData.generos.includes(trimmed)) {
      updateField('generos', [...formData.generos, trimmed]);
    }
    setNewGenreInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titulo.trim()) {
      setValidationError('O título do filme é obrigatório.');
      return;
    }

    setValidationError(null);

    const payload: MovieCreate = {
      titulo: formData.titulo.trim(),
      diretor: formData.diretor.trim() || null,
      ano_lancamento: formData.ano_lancamento ? parseInt(formData.ano_lancamento, 10) : null,
      data_lancamento: formData.data_lancamento || null,
      duracao_minutos: formData.duracao_minutos ? parseInt(formData.duracao_minutos, 10) : null,
      status_filme: formData.status_filme || 'Lançado',
      sinopse: formData.sinopse.trim() || null,
      url_poster: formData.url_poster.trim() || null,
      url_backdrop: formData.url_backdrop.trim() || null,
      generos: formData.generos,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(validationError || error) && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-sm">
          <AlertCircle size={18} className="shrink-0 text-rose-600" />
          <span>{validationError || error?.message || 'Erro ao processar filme.'}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1 & 2: Campos de dados principais */}
        <div className="lg:col-span-2 space-y-5 bg-white p-6 rounded-2xl border border-visagio-border shadow-sm">
          <div>
            <label htmlFor="movie-title" className="block text-xs font-semibold text-visagio-black uppercase tracking-wider mb-1.5">
              Título do Filme *
            </label>
            <input
              id="movie-title"
              type="text"
              required
              maxLength={500}
              value={formData.titulo}
              onChange={(e) => updateField('titulo', e.target.value)}
              placeholder="Ex: O Poderoso Chefão"
              className="w-full px-4 py-2.5 bg-white border border-visagio-inputBorder rounded-xl text-visagio-black placeholder-visagio-muted focus:outline-none focus:border-visagio-yellow focus:ring-1 focus:ring-visagio-yellow text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="movie-director" className="block text-xs font-semibold text-visagio-black uppercase tracking-wider mb-1.5">
                Diretor / Direção
              </label>
              <input
                id="movie-director"
                type="text"
                value={formData.diretor}
                onChange={(e) => updateField('diretor', e.target.value)}
                placeholder="Ex: Francis Ford Coppola"
                className="w-full px-3.5 py-2 bg-white border border-visagio-inputBorder rounded-xl text-visagio-black placeholder-visagio-muted focus:outline-none focus:border-visagio-yellow focus:ring-1 focus:ring-visagio-yellow text-sm"
              />
            </div>

            <div>
              <label htmlFor="movie-status" className="block text-xs font-semibold text-visagio-black uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                id="movie-status"
                value={formData.status_filme}
                onChange={(e) => updateField('status_filme', e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-visagio-inputBorder rounded-xl text-visagio-black focus:outline-none focus:border-visagio-yellow focus:ring-1 focus:ring-visagio-yellow text-sm"
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
              <label htmlFor="movie-year" className="block text-xs font-semibold text-visagio-black uppercase tracking-wider mb-1.5">
                Ano de Lançamento
              </label>
              <input
                id="movie-year"
                type="number"
                min="1880"
                max="2100"
                value={formData.ano_lancamento}
                onChange={(e) => updateField('ano_lancamento', e.target.value)}
                placeholder="Ex: 1972"
                className="w-full px-3.5 py-2 bg-white border border-visagio-inputBorder rounded-xl text-visagio-black placeholder-visagio-muted focus:outline-none focus:border-visagio-yellow focus:ring-1 focus:ring-visagio-yellow text-sm"
              />
            </div>

            <div>
              <label htmlFor="movie-date" className="block text-xs font-semibold text-visagio-black uppercase tracking-wider mb-1.5">
                Data Completa
              </label>
              <input
                id="movie-date"
                type="date"
                value={formData.data_lancamento}
                onChange={(e) => updateField('data_lancamento', e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-visagio-inputBorder rounded-xl text-visagio-black focus:outline-none focus:border-visagio-yellow focus:ring-1 focus:ring-visagio-yellow text-sm"
              />
            </div>

            <div>
              <label htmlFor="movie-runtime" className="block text-xs font-semibold text-visagio-black uppercase tracking-wider mb-1.5">
                Duração (minutos)
              </label>
              <input
                id="movie-runtime"
                type="number"
                min="1"
                max="1000"
                value={formData.duracao_minutos}
                onChange={(e) => updateField('duracao_minutos', e.target.value)}
                placeholder="Ex: 175"
                className="w-full px-3.5 py-2 bg-white border border-visagio-inputBorder rounded-xl text-visagio-black placeholder-visagio-muted focus:outline-none focus:border-visagio-yellow focus:ring-1 focus:ring-visagio-yellow text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="movie-synopsis" className="block text-xs font-semibold text-visagio-black uppercase tracking-wider mb-1.5">
              Sinopse do Filme
            </label>
            <textarea
              id="movie-synopsis"
              rows={4}
              value={formData.sinopse}
              onChange={(e) => updateField('sinopse', e.target.value)}
              placeholder="Descreva a história e premissa principal do filme..."
              className="w-full px-4 py-2.5 bg-white border border-visagio-inputBorder rounded-xl text-visagio-black placeholder-visagio-muted focus:outline-none focus:border-visagio-yellow focus:ring-1 focus:ring-visagio-yellow text-sm resize-y"
            />
          </div>

          {/* Seleção de Gêneros */}
          <div className="space-y-3 pt-2 border-t border-visagio-border">
            <label className="block text-xs font-semibold text-visagio-black uppercase tracking-wider">
              Gêneros do Filme
            </label>

            {/* Gêneros Selecionados */}
            <div className="flex flex-wrap gap-2 min-h-8">
              {formData.generos.map((gen) => (
                <span
                  key={gen}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-visagio-yellow text-visagio-black border border-visagio-yellowHover"
                >
                  <Check size={12} />
                  <span>{gen}</span>
                  <button
                    type="button"
                    onClick={() => toggleGenre(gen)}
                    className="p-0.5 rounded-full hover:bg-visagio-yellowHover text-visagio-black"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              {formData.generos.length === 0 && (
                <span className="text-xs text-visagio-muted italic">
                  Nenhum gênero selecionado ainda.
                </span>
              )}
            </div>

            {/* Chips Sugeridos da API */}
            {availableGenres && availableGenres.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] text-visagio-muted font-medium">Gêneros existentes (clique para alternar):</span>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 rounded-lg bg-visagio-bg border border-visagio-border">
                  {availableGenres.map((g) => {
                    const isSelected = formData.generos.includes(g.nome_genero);
                    return (
                      <button
                        key={g.sk_genre_id}
                        type="button"
                        onClick={() => toggleGenre(g.nome_genero)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                          isSelected
                            ? 'bg-visagio-yellow text-visagio-black font-bold border border-visagio-yellowHover'
                            : 'bg-white border border-visagio-border text-visagio-black hover:bg-visagio-bg'
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
                className="flex-1 px-3 py-1.5 bg-white border border-visagio-inputBorder rounded-lg text-xs text-visagio-black placeholder-visagio-muted focus:outline-none focus:border-visagio-yellow focus:ring-1 focus:ring-visagio-yellow"
              />
              <button
                type="button"
                onClick={handleAddNewGenre}
                className="flex items-center gap-1 px-3 py-1.5 bg-visagio-black hover:bg-black text-white rounded-lg text-xs font-medium transition"
              >
                <Plus size={14} /> Adicionar
              </button>
            </div>
          </div>
        </div>

        {/* Coluna 3: Pôster & Backdrop */}
        <div className="space-y-5 bg-white p-6 rounded-2xl border border-visagio-border shadow-sm">
          <h3 className="text-xs font-semibold text-visagio-black uppercase tracking-wider">
            Mídias Visuais
          </h3>

          <div>
            <label htmlFor="movie-poster-url" className="block text-xs font-medium text-visagio-black mb-1">
              URL do Pôster
            </label>
            <input
              id="movie-poster-url"
              type="url"
              value={formData.url_poster}
              onChange={(e) => updateField('url_poster', e.target.value)}
              placeholder="https://.../poster.jpg"
              className="w-full px-3.5 py-2 bg-white border border-visagio-inputBorder rounded-xl text-visagio-black placeholder-visagio-muted focus:outline-none focus:border-visagio-yellow focus:ring-1 focus:ring-visagio-yellow text-xs"
            />
          </div>

          <div>
            <label htmlFor="movie-backdrop-url" className="block text-xs font-medium text-visagio-black mb-1">
              URL do Backdrop (Capa)
            </label>
            <input
              id="movie-backdrop-url"
              type="url"
              value={formData.url_backdrop}
              onChange={(e) => updateField('url_backdrop', e.target.value)}
              placeholder="https://.../backdrop.jpg"
              className="w-full px-3.5 py-2 bg-white border border-visagio-inputBorder rounded-xl text-visagio-black placeholder-visagio-muted focus:outline-none focus:border-visagio-yellow focus:ring-1 focus:ring-visagio-yellow text-xs"
            />
          </div>

          {/* Preview do Pôster */}
          <div className="pt-2">
            <span className="block text-[11px] text-visagio-muted mb-2">Pré-visualização do Pôster:</span>
            <div className="w-36 aspect-[2/3] mx-auto rounded-xl overflow-hidden bg-visagio-bg border border-visagio-border flex items-center justify-center">
              {formData.url_poster ? (
                <img
                  src={formData.url_poster}
                  alt="Pré-visualização do pôster"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="text-center p-3 text-visagio-muted">
                  <Film size={28} className="mx-auto mb-1 opacity-50" />
                  <span className="text-[10px]">Sem imagem</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ações do Formulário */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-visagio-border">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-visagio-muted hover:text-visagio-black hover:bg-visagio-bg transition"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-visagio-yellow text-visagio-black hover:bg-visagio-yellowHover disabled:opacity-50 transition shadow-sm"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-visagio-black border-t-transparent rounded-full animate-spin" />
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
