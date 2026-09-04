import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin, Plus, Trash2, Home, Pencil, X } from 'lucide-react';
import apiClient from '../services/apiClient';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { BackButton } from '../components/common/BackButton';

export const AddressesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ fullName: '', phone: '', street: '', city: '', state: '', postalCode: '', country: 'US' });
  const [errorMsg, setErrorMsg] = useState('');

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ['my-addresses'],
    queryFn: async () => {
      const res = await apiClient.get('/addresses');
      return res.data?.data?.addresses || [];
    }
  });

  const saveAddress = useMutation({
    mutationFn: async (payload: any) => {
      if (editingId) {
        return apiClient.put(`/addresses/${editingId}`, payload);
      }
      return apiClient.post('/addresses', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-addresses'] });
      resetForm();
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.message || 'Failed to save address');
    }
  });

  const deleteAddress = useMutation({
    mutationFn: async (id: string) => await apiClient.delete(`/addresses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-addresses'] });
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.message || 'Failed to delete address');
    }
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ fullName: '', phone: '', street: '', city: '', state: '', postalCode: '', country: 'US' });
    setErrorMsg('');
  };

  const handleEdit = (address: any) => {
    setFormData({
      fullName: address.fullName || '',
      phone: address.phone || '',
      street: address.street || '',
      city: address.city || '',
      state: address.state || '',
      postalCode: address.postalCode || '',
      country: address.country || 'US',
    });
    setEditingId(address.id);
    setShowForm(true);
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    saveAddress.mutate(formData);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BackButton />
          <div className="w-10 h-10 bg-brand-100 text-brand-600 flex items-center justify-center rounded-xl">
            <Home className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Saved Addresses</h1>
        </div>
        <Button onClick={() => { if (editingId) resetForm(); else setShowForm(!showForm); }} leftIcon={editingId ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}>
          {editingId ? 'Cancel' : 'Add New Address'}
        </Button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-4">{editingId ? 'Edit Address' : 'Add a New Address'}</h2>
          {errorMsg && <p className="p-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-sm font-semibold mb-4">{errorMsg}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Full Name" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
              <Input label="Phone Number" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <Input label="Street Address" required value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="City" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
              <Input label="State/Province" required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Postal Code" required value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})} />
              <Input label="Country" required value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} />
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              <Button type="submit" isLoading={saveAddress.isPending}>{editingId ? 'Update Address' : 'Save Address'}</Button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          {[1, 2].map(i => <div key={i} className="h-40 bg-slate-100 rounded-2xl"></div>)}
        </div>
      ) : addresses.length === 0 && !showForm ? (
        <div className="text-center py-16 bg-slate-50 border border-slate-200 border-dashed rounded-3xl">
          <MapPin className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">You don't have any saved addresses.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address: any) => (
            <div key={address.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900">{address.fullName}</h3>
                  <p className="text-sm text-slate-500 mt-1">{address.phone}</p>
                  <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                    {address.street}<br />
                    {address.city}, {address.state} {address.postalCode}<br />
                    {address.country}
                  </p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(address)}
                    className="p-2 rounded-lg bg-slate-50 text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                    title="Edit address"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this address?')) {
                        deleteAddress.mutate(address.id);
                      }
                    }}
                    className="p-2 rounded-lg bg-slate-50 text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {errorMsg && addresses.length > 0 && !showForm && (
        <p className="text-sm text-rose-600 font-medium text-center">{errorMsg}</p>
      )}
    </div>
  );
};
