import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/useCartStore';
import { useAuthStore } from '../stores/useAuthStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { formatCurrency } from '../utils/formatters';
import { ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import apiClient from '../services/apiClient';
import { BackButton } from '../components/common/BackButton';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const cartStore = useCartStore();
  const items = cartStore.items;
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US'
  });
  const [errorMsg, setErrorMsg] = useState('');

  if (items.length === 0) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Your cart is empty</h2>
        <Button onClick={() => navigate('/')}>Return to Home</Button>
      </div>
    );
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login?redirect=checkout');
      return;
    }
    
    setIsProcessing(true);
    setErrorMsg('');
    
    try {
      const orderPayload = {
        address,
        items: items.map(i => ({ productId: i.product.id, quantity: i.quantity, price: i.product.discountPrice ?? i.product.price })),
        totalAmount: cartStore.getSubtotal(),
        discountAmount: cartStore.getDiscount(),
        finalAmount: cartStore.getTotal(),
        couponCode: cartStore.coupon?.code
      };
      
      const orderRes = await apiClient.post('/orders', orderPayload);
      const orderId = orderRes.data?.data?.order?.id;
      
      if (!orderId) throw new Error('Failed to create order record');
      
      cartStore.clearCart();

      const payRes = await apiClient.post('/payments/create', { orderId });
      const checkoutUrl = payRes.data?.data?.url;
      
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        navigate('/orders?success=true');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <BackButton to="/cart" label="Cart" />
          <h1 className="text-2xl font-bold text-slate-900">Shipping Information</h1>
        </div>
        {errorMsg && <p className="p-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-sm font-semibold mb-6">{errorMsg}</p>}
        
        <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
          <Input label="Full Name" required value={address.fullName} onChange={e => setAddress({...address, fullName: e.target.value})} />
          <Input label="Phone Number" required value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} />
          <Input label="Street Address" required value={address.street} onChange={e => setAddress({...address, street: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="City" required value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
            <Input label="State/Province" required value={address.state} onChange={e => setAddress({...address, state: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Postal/Zip Code" required value={address.postalCode} onChange={e => setAddress({...address, postalCode: e.target.value})} />
            <Input label="Country" required value={address.country} onChange={e => setAddress({...address, country: e.target.value})} />
          </div>
        </form>
      </div>

      <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl h-fit border border-slate-200">
        <h2 className="text-lg font-bold mb-6 text-slate-900">Order Summary</h2>
        <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
          {items.map(item => (
            <div key={item.product.id} className="flex justify-between items-center text-sm border-b border-slate-100 pb-3 last:border-0 last:pb-0">
              <span className="text-slate-600 line-clamp-1 pr-4">{item.quantity}x {item.product.title}</span>
              <span className="font-semibold text-slate-900 shrink-0">{formatCurrency((item.product.discountPrice ?? item.product.price) * item.quantity)}</span>
            </div>
          ))}
        </div>
        
        <div className="border-t border-slate-200 pt-4 space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span className="font-bold text-slate-900">{formatCurrency(cartStore.getSubtotal())}</span></div>
          {cartStore.getDiscount() > 0 && <div className="flex justify-between text-emerald-600"><span className="font-bold">Discount</span><span>-{formatCurrency(cartStore.getDiscount())}</span></div>}
          <div className="flex justify-between"><span className="text-slate-500">Shipping</span><span className="font-bold text-slate-900">{cartStore.getShipping() === 0 ? 'FREE' : formatCurrency(cartStore.getShipping())}</span></div>
          
          <div className="flex justify-between text-xl font-black text-slate-900 pt-4 border-t border-slate-200 mt-2">
            <span>Total</span><span className="text-brand-600">{formatCurrency(cartStore.getTotal())}</span>
          </div>
        </div>

        <Button 
          type="submit" 
          form="checkout-form" 
          className="w-full mt-8" 
          size="lg" 
          isLoading={isProcessing}
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Proceed to Payment
        </Button>
        <p className="text-xs text-center text-slate-400 mt-4 flex items-center justify-center gap-1.5 font-medium">
          <ShieldCheck className="w-4 h-4" /> Secure SSL Encrypted Checkout via Stripe
        </p>
      </div>
    </div>
  );
};
