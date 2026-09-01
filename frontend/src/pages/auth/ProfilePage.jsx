import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { User, Mail, Shield, Calendar, LogOut, Package, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProfilePage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <div className="w-20 h-20 rounded-2xl bg-brand-600 flex items-center justify-center font-bold text-3xl shadow-lg shadow-brand-500/30">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{user?.name}</h1>
            <p className="text-slate-300 text-sm">{user?.email}</p>
            <div className="mt-2 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-brand-300 border border-white/10">
              <Shield className="w-3.5 h-3.5" />
              <span>{user?.role === 'ADMIN' ? 'Administrator' : 'Customer'}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium text-sm flex items-center space-x-2 shadow-lg shadow-red-600/20 transition-all hover:scale-105 active:scale-95"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Info Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <User className="w-5 h-5 text-brand-600" />
            <span>Account Details</span>
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Full Name</span>
              </span>
              <span className="font-semibold text-slate-800">{user?.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Email Address</span>
              </span>
              <span className="font-semibold text-slate-800">{user?.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Member Since</span>
              </span>
              <span className="font-semibold text-slate-800">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Links Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Package className="w-5 h-5 text-brand-600" />
            <span>Quick Shortcuts</span>
          </h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/orders')}
              className="w-full text-left p-3 rounded-xl hover:bg-slate-50 flex items-center justify-between border border-slate-100 transition-colors"
            >
              <div className="flex items-center space-x-3 text-sm font-medium text-slate-700">
                <Package className="w-4 h-4 text-brand-600" />
                <span>My Orders</span>
              </div>
              <span className="text-xs text-slate-400">View history & status</span>
            </button>

            <button
              onClick={() => navigate('/addresses')}
              className="w-full text-left p-3 rounded-xl hover:bg-slate-50 flex items-center justify-between border border-slate-100 transition-colors"
            >
              <div className="flex items-center space-x-3 text-sm font-medium text-slate-700">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Saved Addresses</span>
              </div>
              <span className="text-xs text-slate-400">Manage shipping addresses</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
