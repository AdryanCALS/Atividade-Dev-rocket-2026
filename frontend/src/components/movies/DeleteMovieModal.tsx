import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { deleteMovie } from '../../api/movies';

interface DeleteMovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  movieId: string;
  movieTitle: string;
}

export const DeleteMovieModal: React.FC<DeleteMovieModalProps> = ({
  isOpen,
  onClose,
  movieId,
  movieTitle,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deleteMovie(movieId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      onClose();
      navigate('/', { replace: true });
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Exclusão de Filme" maxWidth="md">
      <div className="space-y-4">
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
          <AlertTriangle className="text-rose-600 shrink-0 mt-0.5" size={20} />
          <div className="text-xs text-rose-800 leading-relaxed">
            <p className="font-semibold text-rose-900">Atenção! Esta ação é irreversível.</p>
            <p className="mt-1">
              Você está prestes a excluir permanentemente o filme{' '}
              <strong className="text-visagio-black underline">{movieTitle}</strong> e todas as suas
              avaliações associadas do banco de dados.
            </p>
          </div>
        </div>

        {mutation.isError && (
          <p className="text-xs text-rose-600 font-medium">
            {mutation.error instanceof Error
              ? mutation.error.message
              : 'Não foi possível excluir o filme.'}
          </p>
        )}

        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            disabled={mutation.isPending}
            className="px-4 py-2 rounded-xl text-sm font-medium text-visagio-muted hover:text-visagio-black hover:bg-visagio-bg transition"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50 transition shadow-sm"
          >
            {mutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Excluindo...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Confirmar Exclusão</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
