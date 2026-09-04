import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { CartGlassToast } from '../components/common/CartGlassToast';
import { AIChatWidget } from '../features/ai/components/AIChatWidget';

export const MainLayout: React.FC = () => {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 text-slate-900 font-sans">
      <Navbar />
      <main className={isHome ? 'flex-1 w-full' : 'flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6'}>
        <Outlet />
      </main>
      <Footer />
      <CartGlassToast />
      <AIChatWidget />
    </div>
  );
};
