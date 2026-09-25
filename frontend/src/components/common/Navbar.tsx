import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, PlusCircle, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-visagio-border bg-white/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-2 rounded-xl bg-visagio-yellow text-visagio-black border border-visagio-yellowHover/40 group-hover:scale-105 transition-transform shadow-sm">
            <Film size={22} />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-extrabold text-visagio-black tracking-tight">
              RocketLab
            </span>
            <span className="bg-visagio-black text-visagio-yellow text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
              Movies
            </span>
          </div>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            to="/"
            className={`text-sm font-semibold px-3 py-1.5 rounded-lg transition ${
              location.pathname === '/'
                ? 'text-visagio-black bg-visagio-bg border border-visagio-border'
                : 'text-visagio-muted hover:text-visagio-black hover:bg-visagio-bg/80'
            }`}
          >
            Catálogo
          </Link>

          <Link
            to="/filmes/novo"
            className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl bg-visagio-yellow text-visagio-black font-bold hover:bg-visagio-yellowHover transition shadow-sm border border-visagio-yellowHover/50"
          >
            <PlusCircle size={16} />
            <span className="hidden sm:inline">Novo Filme</span>
            <span className="sm:hidden">Novo</span>
          </Link>

          {/* Administrador Persona Badge */}
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-visagio-bg border border-visagio-border text-xs text-visagio-black font-medium select-none shadow-sm"
            title="Sessão ativa com privilégios de Administrador"
          >
            <ShieldCheck size={14} className="text-visagio-black" />
            <span className="hidden md:inline font-semibold">Administrador</span>
          </div>
        </div>
      </div>
    </header>
  );
};
