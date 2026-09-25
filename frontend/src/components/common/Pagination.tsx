import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  itemLabel?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  itemLabel = 'filmes',
}) => {
  if (totalPages <= 1) return null;

  const inicio = (page - 1) * pageSize + 1;
  const fim = Math.min(page * pageSize, totalItems);

  // Calcula páginas visíveis (máximo de 5 páginas para não quebrar layout)
  const getVisiblePages = () => {
    const delta = 2;
    const range: (number | string)[] = [];
    const left = Math.max(2, page - delta);
    const right = Math.min(totalPages - 1, page + delta);

    range.push(1);

    if (left > 2) {
      range.push('...');
    }

    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (right < totalPages - 1) {
      range.push('...');
    }

    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-visagio-border text-sm">
      <div className="text-visagio-muted">
        Mostrando <span className="font-semibold text-visagio-black">{inicio}</span> a{' '}
        <span className="font-semibold text-visagio-black">{fim}</span> de{' '}
        <span className="font-semibold text-visagio-black">{totalItems}</span> {itemLabel}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Página anterior"
          className="p-2 rounded-lg border border-visagio-border bg-white text-visagio-black hover:bg-visagio-bg hover:border-visagio-inputBorder disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
        >
          <ChevronLeft size={18} />
        </button>

        {getVisiblePages().map((p, idx) => {
          if (p === '...') {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 text-visagio-muted">
                …
              </span>
            );
          }

          const pageNum = p as number;
          const isCurrent = pageNum === page;

          return (
            <button
              key={`page-${pageNum}`}
              onClick={() => onPageChange(pageNum)}
              aria-current={isCurrent ? 'page' : undefined}
              className={`min-w-9 h-9 px-2.5 rounded-lg text-sm font-medium transition shadow-sm ${
                isCurrent
                  ? 'bg-visagio-yellow text-visagio-black font-extrabold border border-visagio-yellowHover shadow-sm'
                  : 'border border-visagio-border bg-white text-visagio-black hover:bg-visagio-bg hover:border-visagio-inputBorder'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Próxima página"
          className="p-2 rounded-lg border border-visagio-border bg-white text-visagio-black hover:bg-visagio-bg hover:border-visagio-inputBorder disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
