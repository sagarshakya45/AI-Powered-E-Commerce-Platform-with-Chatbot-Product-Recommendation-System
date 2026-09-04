import React from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { User, LogOut, Package, MapPin, Heart, BadgeCheck, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate, Link } from 'react-router-dom';
import { BackButton } from '../components/common/BackButton';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div className="flex items-center gap-3">
          <BackButton />
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Account</h1>
            <p className="text-slate-500 text-xs font-medium mt-1">Manage your profile, orders, addresses, and vendor credentials.</p>
          </div>
        </div>
        <Button variant="outline" onClick={handleLogout} leftIcon={<LogOut className="w-4 h-4" />}>
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-3xl flex items-center justify-center text-2xl font-black mb-3 shadow-lg shadow-violet-600/25">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
            <p className="text-xs text-slate-500">{user.email}</p>
            <div className="mt-3 inline-flex items-center space-x-1.5 px-3.5 py-1 bg-violet-50 text-violet-700 text-xs font-bold rounded-full border border-violet-200/60">
              <User className="w-3.5 h-3.5" />
              <span>{user.role}</span>
            </div>
          </div>

          <nav className="flex flex-col space-y-2">
            <Link to="/profile" className="flex items-center space-x-3 px-4 py-3 bg-violet-50 text-violet-700 font-bold rounded-2xl border border-violet-200/50">
              <User className="w-5 h-5" />
              <span>Personal Info</span>
            </Link>
            <Link to="/orders" className="flex items-center space-x-3 px-4 py-3 text-slate-600 hover:bg-slate-50 font-semibold rounded-2xl transition-colors">
              <Package className="w-5 h-5" />
              <span>Order History</span>
            </Link>
            <Link to="/addresses" className="flex items-center space-x-3 px-4 py-3 text-slate-600 hover:bg-slate-50 font-semibold rounded-2xl transition-colors">
              <MapPin className="w-5 h-5" />
              <span>Saved Addresses</span>
            </Link>
            <Link to="/wishlist" className="flex items-center space-x-3 px-4 py-3 text-slate-600 hover:bg-slate-50 font-semibold rounded-2xl transition-colors">
              <Heart className="w-5 h-5" />
              <span>Wishlist</span>
            </Link>
            <Link to="/apply-salesman" className="flex items-center space-x-3 px-4 py-3 text-violet-700 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200/60 font-bold rounded-2xl hover:from-violet-100 hover:to-indigo-100 transition-all">
              <BadgeCheck className="w-5 h-5 text-violet-600" />
              <span>Salesman / Vendor</span>
            </Link>
          </nav>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-4">Personal Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                <div className="mt-1 font-bold text-sm text-slate-900">{user.name}</div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                <div className="mt-1 font-bold text-sm text-slate-900">{user.email}</div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Account Role</label>
                <div className="mt-1 font-bold text-sm text-violet-600 flex items-center gap-1.5">
                  <BadgeCheck className="w-4 h-4" />
                  <span>{user.role}</span>
                </div>
              </div>
            </div>

            {/* Salesman Application Promo Banner */}
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-6 rounded-3xl border border-violet-500/30 space-y-3 relative overflow-hidden shadow-xl">
              <div className="flex items-center gap-2 text-violet-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                Become an Authorized Vendor
              </div>
              <h4 className="text-lg font-black text-white">Sell on AuraMart Marketplace</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Apply for a Salesman role to register your business, list custom products, and gain merchant analytics privileges.
              </p>
              <Link
                to="/apply-salesman"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-violet-600/30 transition-all mt-2"
              >
                <span>Apply for Salesman Account</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
