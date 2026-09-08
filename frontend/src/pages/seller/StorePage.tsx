import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Store, Save, Upload, CheckCircle } from 'lucide-react';
import { sellerService, SellerStore } from '../../services/sellerService';
import { Button } from '../../components/ui/Button';

export const SellerStorePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { data: store, isLoading } = useQuery({
    queryKey: ['seller-store'],
    queryFn: () => sellerService.getStore(),
    retry: false,
  });

  const [formData, setFormData] = useState({
    name: store?.name || '',
    description: store?.description || '',
    logo: store?.logo || '',
    banner: store?.banner || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (store) {
        await sellerService.updateStore(formData);
      } else {
        await sellerService.createStore(formData);
      }
      setSuccess('Store updated successfully!');
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['seller-store'] });
    } catch (err: any) {
      setError(err.message || 'Failed to update store');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-40 bg-slate-200 rounded-2xl" />
        <div className="h-64 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Store className="w-6 h-6 text-violet-600" />
          <h1 className="text-2xl font-black text-slate-900">My Store</h1>
        </div>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFormData({
                name: store?.name || '',
                description: store?.description || '',
                logo: store?.logo || '',
                banner: store?.banner || '',
              });
              setIsEditing(true);
            }}
          >
            Edit Store
          </Button>
        )}
      </div>

      {store && (
        <>
          <div className="bg-gradient-to-r from-violet-100 to-indigo-100 rounded-2xl h-32 overflow-hidden">
            {store.banner ? (
              <img src={store.banner} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <Store className="w-12 h-12 opacity-30" />
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md">
                {store.logo ? (
                  <img src={store.logo} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold">
                    {store.name?.[0]?.toUpperCase() || 'S'}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">{store.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  {store.isVerified && (
                    <span className="flex items-center gap-1 text-xs text-amber-600 font-semibold">
                      <CheckCircle className="w-3 h-3 fill-current" />
                      Verified Store
                    </span>
                  )}
                </div>
              </div>
            </div>

            {store.description && (
              <p className="text-sm text-slate-600 leading-relaxed">{store.description}</p>
            )}
          </div>
        </>
      )}

      {!store && !isEditing && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
            <Store className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="font-bold text-slate-900">No Store Yet</h3>
          <p className="text-xs text-slate-500">Create your seller store to get started</p>
          <Button onClick={() => setIsEditing(true)} leftIcon={<Store className="w-4 h-4" />}>
            Create Store
          </Button>
        </div>
      )}

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in-50">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-slate-900">
                {store ? 'Edit Store' : 'Create Store'}
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <span className="sr-only">Close</span>×
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl mb-4">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl mb-4">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Store Name
                </label>
                <input
                  type="text"
                  required
                  minLength={2}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/20"
                  placeholder="Enter your store name"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/20 resize-none"
                  placeholder="Describe your store..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Logo URL
                </label>
                <input
                  type="url"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/20"
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Banner URL
                </label>
                <input
                  type="url"
                  value={formData.banner}
                  onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/20"
                  placeholder="https://example.com/banner.png"
                />
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  leftIcon={<Save className="w-4 h-4" />}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold"
                >
                  Save Store
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
