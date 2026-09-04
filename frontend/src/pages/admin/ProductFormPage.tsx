import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ChevronLeft, Save, Sparkles, Wand2 } from 'lucide-react';
import apiClient from '../../services/apiClient';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    price: '',
    stock: '',
    categoryId: ''
  });
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch product if editing
  useQuery({
    queryKey: ['admin-product', id],
    queryFn: async () => {
      const res = await apiClient.get(`/products/${id}`);
      const prod = res.data?.data?.product;
      if (prod) {
        setFormData({
          title: prod.title,
          slug: prod.slug,
          description: prod.description,
          price: prod.price.toString(),
          stock: prod.stock.toString(),
          categoryId: prod.categoryId || ''
        });
      }
      return prod;
    },
    enabled: isEditing
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await apiClient.get('/categories');
      return res.data?.data?.categories || [];
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (isEditing) {
        return await apiClient.put(`/products/${id}`, payload);
      }
      return await apiClient.post('/products', payload);
    },
    onSuccess: () => navigate('/admin/products'),
    onError: (err: any) => setErrorMsg(err.response?.data?.message || 'Failed to save product')
  });

  const aiDescMutation = useMutation({
    mutationFn: async (title: string) => {
      const res = await apiClient.post('/ai/generate-description', { title, features: [] });
      return res.data?.data?.description;
    },
    onSuccess: (desc) => {
      if (desc) setFormData(prev => ({ ...prev, description: desc }));
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock)
    };
    saveMutation.mutate(payload);
  };

  const handleGenerateAI = () => {
    if (!formData.title) {
      setErrorMsg('Please enter a Product Title first for the AI to work.');
      return;
    }
    aiDescMutation.mutate(formData.title);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Link to="/admin/products" className="p-2 text-slate-400 hover:text-brand-600 transition-colors bg-white rounded-xl border border-slate-200 shadow-sm">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="text-sm text-slate-500">Provide details for the product listing.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 sm:p-8">
        {errorMsg && <div className="mb-6 p-4 bg-rose-50 text-rose-700 rounded-xl text-sm font-semibold border border-rose-100">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Product Title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Premium Noise Cancelling Headphones" />
            <Input label="Slug (URL friendly)" required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} placeholder="e.g. premium-noise-cancelling-headphones" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-500">Product Description</label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                leftIcon={<Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                className="text-xs h-7 px-2"
                onClick={handleGenerateAI}
                isLoading={aiDescMutation.isPending}
              >
                Auto-Write with AI
              </Button>
            </div>
            <textarea 
              className="w-full p-4 rounded-xl border border-slate-200 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all min-h-[160px] resize-y"
              placeholder="Detailed description of the product..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input type="number" step="0.01" label="Price" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            <Input type="number" label="Stock Quantity" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
            
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2">Category</label>
              <select 
                value={formData.categoryId}
                onChange={e => setFormData({...formData, categoryId: e.target.value})}
                className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                required
              >
                <option value="">Select Category</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <Link to="/admin/products">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" isLoading={saveMutation.isPending} leftIcon={<Save className="w-4 h-4" />}>
              {isEditing ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
