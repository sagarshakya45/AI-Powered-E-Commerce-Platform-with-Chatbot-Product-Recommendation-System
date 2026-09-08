import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Star, Eye, Package, Search } from 'lucide-react';
import { sellerService, SellerProduct } from '../../services/sellerService';
import { formatCurrency } from '../../utils/formatters';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { ProductForm } from '../../components/seller/ProductForm';

export const SellerProductsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<SellerProduct | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['seller-products'],
    queryFn: () => sellerService.getProducts(),
    retry: false,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => sellerService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-products'] });
    },
  });

  const handleDelete = (product: SellerProduct) => {
    if (window.confirm(`Are you sure you want to delete "${product.title}"?`)) {
      deleteMutation.mutate(product.id);
    }
  };

  const handleEdit = (product: SellerProduct) => {
    setEditProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditProduct(null);
  };

  if (showForm) {
    return <ProductForm product={editProduct} onClose={handleCloseForm} />;
  }

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-20 bg-slate-200 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Products</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {products.length} product{products.length !== 1 ? 's' : ''} listed
          </p>
        </div>
        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold"
        >
          Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
            <Package className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="font-bold text-slate-900">No products yet</h3>
          <p className="text-xs text-slate-500">Start selling by adding your first product</p>
          <Button
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold"
          >
            Add Product
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => {
            const avgRating =
              product.reviews && product.reviews.length > 0
                ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
                : 0;

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-[4/3] bg-slate-50 border-b border-slate-200 p-3 overflow-hidden">
                  <img
                    src={product.images?.find((i) => i.isPrimary)?.url || product.images?.[0]?.url || ''}
                    alt={product.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{product.title}</h3>
                    <Badge
                      variant={product.isApproved ? 'success' : 'brand'}
                      className="text-[9px] px-1.5 py-0.5"
                    >
                      {product.isApproved ? 'Approved' : 'Pending'}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-black text-slate-900">{formatCurrency(product.price)}</span>
                    {product.discountPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        {formatCurrency(product.discountPrice)}
                      </span>
                    )}
                    <span className="ml-auto text-xs text-slate-500 font-medium">
                      Stock: {product.stock}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {product.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {avgRating.toFixed(1)}
                    </span>
                    <span>{product.salesCount || 0} sold</span>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-slate-100">
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Edit className="w-3 h-3" />}
                      onClick={() => handleEdit(product)}
                      className="flex-1 text-xs"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Trash2 className="w-3 h-3" />}
                      onClick={() => handleDelete(product)}
                      className="flex-1 text-xs text-rose-600 hover:text-rose-700 border-rose-200 hover:bg-rose-50"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            );
          ))}
        </div>
      )}
    </div>
  );
};
