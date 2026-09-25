import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-visagio-border bg-white py-8 text-center text-sm text-visagio-muted">
      <div className="max-w-7xl mx-auto px-4">
        <p className="font-medium text-visagio-black">
          RocketLab 2026.2 • Sistema de Catálogo e Avaliação de Filmes
        </p>
        <p className="mt-1 text-xs text-visagio-muted">
           Administrador
        </p>
      </div>
    </footer>
  );
};
