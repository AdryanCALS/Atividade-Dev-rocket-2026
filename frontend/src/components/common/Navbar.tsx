import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, PlusCircle, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
            <Film size={22} />
          </div>
          <div>
            <span className="text-lg font-bold text-slate-100 tracking-tight flex items-center gap-1.5">
              RocketLab <span className="text-emerald-400 text-sm font-semibold uppercase tracking-wider">Movies</span>
            </span>
          </div>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            to="/"
            className={`text-sm font-medium px-3 py-1.5 rounded-lg transition ${
              location.pathname === '/'
                ? 'text-emerald-400 bg-slate-800/80'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Catálogo
          </Link>

          <Link
            to="/filmes/novo"
            className="flex items-center gap-1.5 text-sm font-medium px-3.5 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition shadow-sm shadow-emerald-500/20"
          >
            <PlusCircle size={16} />
            <span className="hidden sm:inline">Novo Filme</span>
            <span className="sm:hidden">Novo</span>
          </Link>

          {/* Admin Persona Badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300 font-medium select-none"
            title="Sessão ativa com privilégios de Administrador"
          >
            <ShieldCheck size={14} className="text-emerald-400" />
            <span className="hidden md:inline">Administrador</span>
          </div>
        </div>
      </div>
    </header>
  );
};
