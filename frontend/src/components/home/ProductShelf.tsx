import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from '../products/ProductCard';

type Props = {
  title: string;
  subtitle?: string;
  viewAllTo?: string;
  products: Product[];
};

export const ProductShelf: React.FC<Props> = ({ title, subtitle, viewAllTo, products }) => {
  if (products.length === 0) return null;

  return (
    <section className="bg-white rounded-3xl border border-slate-100 p-4 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-600" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h2>
          </div>
          {subtitle ? <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p> : null}
        </div>
        {viewAllTo ? (
          <Link
            to={viewAllTo}
            className="inline-flex items-center gap-1 text-xs font-bold text-violet-600 hover:text-violet-700 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-full transition-colors"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        ) : null}
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 pt-1 hide-scrollbar">
        {products.map((product) => (
          <div key={product.id} className="w-[200px] sm:w-[220px] shrink-0">
            <ProductCard product={product} compact />
          </div>
        ))}
      </div>
    </section>
  );
};
