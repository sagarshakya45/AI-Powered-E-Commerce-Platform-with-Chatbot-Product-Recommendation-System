import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-6 transition-all duration-200 ${className}`}
    >
      {children}
    </div>
  );
};
