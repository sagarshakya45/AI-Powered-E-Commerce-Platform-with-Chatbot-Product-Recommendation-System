import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin, Plus, Trash2, Home } from 'lucide-react';
import apiClient from '../services/apiClient';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export const AddressesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', phone: '', street: '', city: '', state: '', postalCode: '', country: 'US' });

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ['my-addresses'],
    queryFn: async () => {
      const res = await apiClient.get('/addresses');
      return res.data?.data?.addresses || [];
    }
  });

  const addAddress = useMutation({
    mutationFn: async (payload: any) => await apiClient.post('/addresses', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-addresses'] });
      setShowForm(false);
      setFormData({ fullName: '', phone: '', street: '', city: '', state: '', postalCode: '', country: 'US' });
    }
  });

  const deleteAddress = useMutation({
    mutationFn: async (id: string) => await apiClient.delete(`/addresses/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-addresses'] })
  });

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-brand-100 text-brand-600 flex items-center justify-center rounded-xl">
            <Home className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Saved Addresses</h1>
        </div>
        <Button onClick={() => setShowForm(!showForm)} leftIcon={<Plus className="w-4 h-4" />}>
          Add New Address
        </Button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-4">Add a New Address</h2>
          <form onSubmit={(e) => { e.preventDefault(); addAddress.mutate(formData); }} className="space-y-4">
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
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" isLoading={addAddress.isPending}>Save Address</Button>
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
            <div key={address.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group">
              <button 
                onClick={() => deleteAddress.mutate(address.id)}
                className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <h3 className="font-bold text-slate-900">{address.fullName}</h3>
              <p className="text-sm text-slate-500 mt-1">{address.phone}</p>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                {address.street}<br />
                {address.city}, {address.state} {address.postalCode}<br />
                {address.country}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
