import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PackageSearch, ShoppingCart, Users, Ticket, BadgeCheck, Settings, LogOut, ExternalLink } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuthStore();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: PackageSearch },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Salesman Requests', path: '/admin/salesman-applications', icon: BadgeCheck },
    { name: 'Coupons', path: '/admin/coupons', icon: Ticket },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900 font-sans">
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex shrink-0 z-10">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="text-xl font-bold text-white tracking-tight">
            Aura<span className="text-brand-500">Admin</span>
          </span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/admin');
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive 
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link to="/" className="flex items-center space-x-3 px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-colors text-sm font-medium">
            <ExternalLink className="w-4 h-4 text-slate-400" />
            <span>Storefront</span>
          </Link>
          <button 
            onClick={() => logout()}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl hover:bg-rose-500/10 hover:text-rose-400 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 shrink-0 shadow-sm z-10">
          <h2 className="text-lg font-bold text-slate-800">Admin Control Center</h2>
          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs shadow-sm">
            A
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-slate-50/50">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
