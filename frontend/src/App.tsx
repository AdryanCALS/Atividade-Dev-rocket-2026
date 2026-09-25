import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CatalogPage } from './pages/CatalogPage';
import { MovieDetailPage } from './pages/MovieDetailPage';
import { MovieCreatePage } from './pages/MovieCreatePage';
import { MovieEditPage } from './pages/MovieEditPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-visagio-bg text-visagio-black selection:bg-visagio-yellow selection:text-visagio-black">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<CatalogPage />} />
            <Route path="/filmes/novo" element={<MovieCreatePage />} />
            <Route path="/filmes/:id" element={<MovieDetailPage />} />
            <Route path="/filmes/:id/editar" element={<MovieEditPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
