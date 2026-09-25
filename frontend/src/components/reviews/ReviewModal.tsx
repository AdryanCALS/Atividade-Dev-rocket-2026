import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, Send, AlertCircle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { addReviewToMovie } from '../../api/reviews';
import { ReviewCreate } from '../../types';

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

  const mutation = useMutation({
    mutationFn: (payload: ReviewCreate) => addReviewToMovie(movieId, payload),
    onSuccess: () => {
      // Invalida todas as consultas de filme e avaliações para recalcular média geral e atualizar lista
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

  const getScoreColor = (val: number) => {
    if (val >= 7.0) return 'text-emerald-400 bg-emerald-950/60 border-emerald-700/50';
    if (val >= 5.0) return 'text-amber-400 bg-amber-950/60 border-amber-700/50';
    return 'text-rose-400 bg-rose-950/60 border-rose-700/50';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Avaliar: ${movieTitle}`} maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {errorMsg && (
          <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Nome do Autor */}
        <div>
          <label htmlFor="review-author" className="block text-xs font-medium text-slate-300 mb-1.5">
            Nome do Administrador / Autor *
          </label>
          <input
            id="review-author"
            type="text"
            required
            maxLength={120}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition"
            placeholder="Ex: Administrador"
          />
        </div>

        {/* Nota 0 a 10 Slider + Input */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="review-score" className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
              Nota da Avaliação (0.0 a 10.0) *
            </label>
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border font-bold text-sm ${getScoreColor(
                nota
              )}`}
            >
              <Star size={16} className="fill-current" />
              <span>{nota.toFixed(1)} / 10</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <input
              id="review-score-range"
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
              className="flex-1 accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
            />
            <input
              id="review-score"
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
                  setNota(Math.min(10, Math.max(0, val)));
                }
              }}
              onBlur={() => {
                const val = parseFloat(notaInput);
                if (isNaN(val)) {
                  setNota(8.0);
                  setNotaInput('8.0');
                } else {
                  const clamped = Math.min(10, Math.max(0, val));
                  setNota(clamped);
                  setNotaInput(String(clamped));
                }
              }}
              className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-center text-sm font-semibold text-emerald-400 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 px-0.5">
            <span>0.0 (Péssimo)</span>
            <span>5.0 (Médio)</span>
            <span>10.0 (Excelente)</span>
          </div>
        </div>


        {/* Comentário / Resenha */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="review-comment" className="text-xs font-medium text-slate-300">
              Resenha / Comentário *
            </label>
            <span className="text-[11px] text-slate-500">{comentario.length} / 4000</span>
          </div>
          <textarea
            id="review-comment"
            required
            rows={4}
            maxLength={4000}
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-emerald-500 resize-y transition"
            placeholder="Escreva seus comentários e impressões sobre o filme..."
          />
        </div>

        {/* Ações */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={mutation.isPending}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 disabled:opacity-50 transition shadow-md shadow-emerald-500/20"
          >
            {mutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
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
