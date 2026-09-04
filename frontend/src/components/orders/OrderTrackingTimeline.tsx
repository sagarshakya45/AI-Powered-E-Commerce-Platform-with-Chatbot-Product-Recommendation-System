import React from 'react';
import { CheckCircle2, Clock, Truck, Home, AlertCircle } from 'lucide-react';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

const STEPS: { status: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { status: 'CONFIRMED', label: 'Order Placed', icon: <CheckCircle2 className="w-4 h-4" /> },
  { status: 'PROCESSING', label: 'Processing', icon: <Clock className="w-4 h-4" /> },
  { status: 'SHIPPED', label: 'Out for Delivery', icon: <Truck className="w-4 h-4" /> },
  { status: 'DELIVERED', label: 'Delivered', icon: <Home className="w-4 h-4" /> },
];

export const OrderTrackingTimeline: React.FC<{ status: OrderStatus }> = ({ status }) => {
  if (status === 'CANCELLED') {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-2xl flex items-center gap-2 font-medium">
        <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
        <span>This order was cancelled. If you have any questions, please contact customer support.</span>
      </div>
    );
  }

  // Determine current step index
  let currentIndex = 0;
  if (status === 'PENDING' || status === 'CONFIRMED') currentIndex = 0;
  else if (status === 'PROCESSING') currentIndex = 1;
  else if (status === 'SHIPPED') currentIndex = 2;
  else if (status === 'DELIVERED') currentIndex = 3;

  return (
    <div className="py-4 space-y-3">
      <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Shipment Progress</h5>
      
      <div className="relative flex items-center justify-between">
        {/* Background Connecting Line */}
        <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-slate-100 -z-0 rounded-full" />
        
        {/* Active Filled Line */}
        <div
          className="absolute top-1/2 left-4 -translate-y-1/2 h-1 bg-gradient-to-r from-violet-600 to-indigo-600 -z-0 rounded-full transition-all duration-500"
          style={{ width: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((step, idx) => {
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.status} className="relative z-10 flex flex-col items-center gap-1.5 group">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCurrent
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30 scale-110 ring-4 ring-violet-100'
                    : isCompleted
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'bg-white border-2 border-slate-200 text-slate-400'
                }`}
              >
                {step.icon}
              </div>
              <span
                className={`text-[11px] font-extrabold text-center max-w-[80px] leading-tight ${
                  isCurrent
                    ? 'text-violet-600'
                    : isCompleted
                    ? 'text-slate-900'
                    : 'text-slate-400 font-medium'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
