import React from 'react';
import { DollarSign, TrendingUp, Award } from 'lucide-react';
import { MoviePerformanceResponse } from '../../types';

interface MoviePerformanceInfoProps {
  performance: MoviePerformanceResponse;
}

export const MoviePerformanceInfo: React.FC<MoviePerformanceInfoProps> = ({ performance }) => {
  const formatCurrencyUSD = (val: number | null | undefined) => {
    if (val === null || val === undefined || isNaN(val)) return '—';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const hasFinancialData =
    performance.orcamento_usd !== null ||
    performance.receita_usd !== null ||
    performance.lucro_usd !== null;

  const hasScores =
    performance.nota_tmdb !== null ||
    performance.nota_imdb !== null ||
    performance.popularidade !== null;

  if (!hasFinancialData && !hasScores) return null;

  return (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
        <TrendingUp size={15} className="text-emerald-400" />
        <span>Desempenho e Métricas Externas</span>
      </h4>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
        {performance.orcamento_usd !== null && (
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-slate-400 flex items-center gap-1">
              <DollarSign size={13} className="text-slate-500" /> Orçamento:
            </span>
            <p className="text-sm font-semibold text-slate-200 mt-0.5">
              {formatCurrencyUSD(performance.orcamento_usd)}
            </p>
          </div>
        )}

        {performance.receita_usd !== null && (
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-slate-400 flex items-center gap-1">
              <DollarSign size={13} className="text-slate-500" /> Receita:
            </span>
            <p className="text-sm font-semibold text-slate-200 mt-0.5">
              {formatCurrencyUSD(performance.receita_usd)}
            </p>
          </div>
        )}

        {performance.lucro_usd !== null && (
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-slate-400 flex items-center gap-1">
              <TrendingUp size={13} className="text-slate-500" /> Lucro:
            </span>
            <p
              className={`text-sm font-semibold mt-0.5 ${
                performance.lucro_usd >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {formatCurrencyUSD(performance.lucro_usd)}
            </p>
          </div>
        )}

        {performance.nota_tmdb !== null && (
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-slate-400 flex items-center gap-1">
              <Award size={13} className="text-amber-500" /> TMDB:
            </span>
            <p className="text-sm font-semibold text-amber-300 mt-0.5">
              {performance.nota_tmdb.toFixed(1)} / 10
              {performance.qtd_tmdb && (
                <span className="text-[10px] text-slate-500 font-normal ml-1">
                  ({performance.qtd_tmdb})
                </span>
              )}
            </p>
          </div>
        )}

        {performance.nota_imdb !== null && (
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-slate-400 flex items-center gap-1">
              <Award size={13} className="text-yellow-400" /> IMDb:
            </span>
            <p className="text-sm font-semibold text-yellow-300 mt-0.5">
              {performance.nota_imdb.toFixed(1)} / 10
              {performance.qtd_imdb && (
                <span className="text-[10px] text-slate-500 font-normal ml-1">
                  ({performance.qtd_imdb})
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
