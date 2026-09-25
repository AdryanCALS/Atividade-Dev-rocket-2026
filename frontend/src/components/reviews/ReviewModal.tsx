import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, Send, AlertCircle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { addReviewToMovie } from '../../api/reviews';
import { ReviewCreate } from '../../types';
import { getRatingColorClass } from '../../utils/rating';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  movieId: string;
  movieTitle: string;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  movieId,
  movieTitle,
}) => {
  const queryClient = useQueryClient();

  const [nome, setNome] = useState('Administrador');
  const [nota, setNota] = useState<number>(8.0);
  const [notaInput, setNotaInput] = useState<string>('8.0');
  const [comentario, setComentario] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const clampNota = (v: number) => Math.min(10, Math.max(0, v));

  const mutation = useMutation({
    mutationFn: (payload: ReviewCreate) => addReviewToMovie(movieId, payload),
    onSuccess: () => {
      // Invalida consultas para atualizar média geral, resumo de avaliações e listagem
      queryClient.invalidateQueries({ queryKey: ['movie'] });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      setComentario('');
      setErrorMsg(null);
      onClose();
    },
    onError: (err: Error) => {
      setErrorMsg(err.message || 'Falha ao registrar avaliação.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      setErrorMsg('Por favor, informe seu nome.');
      return;
    }
    if (nota < 0 || nota > 10) {
      setErrorMsg('A nota deve estar entre 0.0 e 10.0.');
      return;
    }
    if (!comentario.trim()) {
      setErrorMsg('Por favor, escreva uma resenha ou comentário sobre o filme.');
      return;
    }

    setErrorMsg(null);
    mutation.mutate({
      nome: nome.trim(),
      nota: Number(nota),
      comentario: comentario.trim(),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Avaliar: ${movieTitle}`} maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Nome do Autor */}
        <div>
          <label htmlFor="review-author" className="block text-xs font-semibold text-visagio-black mb-1.5">
            Nome do Administrador / Autor *
          </label>
          <input
            id="review-author"
            type="text"
            required
            maxLength={120}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full px-3.5 py-2 bg-white border border-visagio-inputBorder rounded-xl text-visagio-black text-sm focus:outline-none focus:border-visagio-yellow focus:ring-1 focus:ring-visagio-yellow transition"
            placeholder="Ex: Administrador"
          />
        </div>

        {/* Avaliação em Estrelas e Escala 0 a 10 */}
        <div className="p-4 rounded-xl bg-visagio-bg border border-visagio-border space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="review-nota-range" className="text-xs font-semibold text-visagio-black uppercase tracking-wide">
              Nota da Avaliação (0.0 a 10.0) *
            </label>
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border font-bold text-sm ${getRatingColorClass(
                nota
              )}`}
            >
              <Star size={16} className="fill-current text-visagio-yellow" />
              <span>{nota.toFixed(1)} / 10</span>
            </div>
          </div>

          {/* Seletor Visual de 1 a 5 Estrelas */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-visagio-muted">Classificação em Estrelas:</span>
              <span className="text-xs font-bold text-visagio-black">
                {(nota / 2).toFixed(1)} de 5 estrelas
              </span>
            </div>
            <div className="flex items-center gap-2" role="group" aria-label="Seletor de 1 a 5 estrelas">
              {[1, 2, 3, 4, 5].map((starIdx) => {
                const starScore = starIdx * 2.0;
                const isFilled = nota >= starScore;
                const isPartiallyFilled = !isFilled && nota >= starScore - 1.0;

                return (
                  <button
                    key={starIdx}
                    type="button"
                    onClick={() => {
                      setNota(starScore);
                      setNotaInput(starScore.toFixed(1));
                    }}
                    title={`Definir nota ${(starIdx * 2).toFixed(1)} (${starIdx} estrelas)`}
                    aria-label={`${starIdx} estrelas`}
                    className="p-1 rounded-lg hover:bg-white transition transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      size={26}
                      className={
                        isFilled
                          ? 'fill-visagio-yellow text-visagio-yellow drop-shadow-sm'
                          : isPartiallyFilled
                          ? 'fill-visagio-yellow/50 text-visagio-yellow'
                          : 'text-slate-300 hover:text-visagio-yellow'
                      }
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slider e Input Decimal para Ajuste Fino */}
          <div className="space-y-1.5 pt-2 border-t border-visagio-border">
            <span className="text-[11px] text-visagio-muted">Ajuste fino decimal (escala de 0.0 a 10.0):</span>
            <div className="flex items-center gap-4">
              <input
                id="review-nota-range"
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={nota}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setNota(val);
                  setNotaInput(String(val));
                }}
                className="flex-1 accent-visagio-yellow cursor-pointer h-2 bg-visagio-border rounded-lg appearance-none"
              />
              <input
                id="review-nota"
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={notaInput}
                onChange={(e) => {
                  const str = e.target.value;
                  setNotaInput(str);
                  const val = parseFloat(str);
                  if (!isNaN(val)) {
                    setNota(clampNota(val));
                  }
                }}
                onBlur={() => {
                  const val = parseFloat(notaInput);
                  if (isNaN(val)) {
                    setNota(8.0);
                    setNotaInput('8.0');
                  } else {
                    const clamped = clampNota(val);
                    setNota(clamped);
                    setNotaInput(String(clamped));
                  }
                }}
                className="w-20 px-2 py-1 bg-white border border-visagio-inputBorder rounded-lg text-center text-sm font-bold text-visagio-black focus:outline-none focus:border-visagio-yellow focus:ring-1 focus:ring-visagio-yellow"
              />
            </div>
          </div>

          <div className="flex justify-between text-[11px] text-visagio-muted px-0.5">
            <span>0.0 (Péssimo)</span>
            <span>5.0 (Médio)</span>
            <span>10.0 (Excelente)</span>
          </div>
        </div>

        {/* Comentário / Resenha */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="review-comment" className="text-xs font-semibold text-visagio-black">
              Resenha / Comentário *
            </label>
            <span className="text-[11px] text-visagio-muted">{comentario.length} / 4000</span>
          </div>
          <textarea
            id="review-comment"
            required
            rows={4}
            maxLength={4000}
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-visagio-inputBorder rounded-xl text-visagio-black placeholder-visagio-muted text-sm focus:outline-none focus:border-visagio-yellow focus:ring-1 focus:ring-visagio-yellow resize-y transition"
            placeholder="Escreva seus comentários e impressões sobre o filme..."
          />
        </div>

        {/* Ações */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={mutation.isPending}
            className="px-4 py-2 rounded-xl text-sm font-medium text-visagio-muted hover:text-visagio-black hover:bg-visagio-bg transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-visagio-yellow text-visagio-black hover:bg-visagio-yellowHover disabled:opacity-50 transition shadow-sm"
          >
            {mutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-visagio-black border-t-transparent rounded-full animate-spin" />
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <Send size={15} />
                <span>Publicar Avaliação</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
