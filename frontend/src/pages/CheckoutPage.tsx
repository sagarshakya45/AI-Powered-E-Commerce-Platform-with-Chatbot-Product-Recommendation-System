import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/useCartStore';
import { useAuthStore } from '../stores/useAuthStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { formatCurrency } from '../utils/formatters';
import { ShieldCheck, ArrowRight, Lock, AlertCircle, CreditCard, Banknote } from 'lucide-react';
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
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
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
      await cartStore.syncWithBackend();
      
      const syncedItems = cartStore.items;
      if (syncedItems.length === 0) {
        setErrorMsg('Your cart is empty or all items are currently unavailable.');
        return;
      }
      
      const orderPayload = {
        address,
        items: syncedItems.map(i => ({ productId: i.product.id, quantity: i.quantity })),
        couponCode: cartStore.coupon?.code,
        paymentMethod
      };
      
      const orderRes = await apiClient.post('/orders', orderPayload);
      const orderId = orderRes.data?.data?.order?.id;
      
      if (!orderId) throw new Error('Failed to create order record');
      
      cartStore.clearCart();

      if (paymentMethod === 'cod') {
        navigate('/orders?success=true');
        return;
      }

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

          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Payment Method</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 text-xs font-bold transition-all ${
                  paymentMethod === 'card'
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                Pay with Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 text-xs font-bold transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <Banknote className="w-4 h-4" />
                Cash on Delivery
              </button>
            </div>
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
          leftIcon={paymentMethod === 'cod' ? <Banknote className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
        >
          {paymentMethod === 'cod' ? 'Place Order (Cash on Delivery)' : 'Pay Now'}
        </Button>
        <p className="text-xs text-center text-slate-400 mt-4 flex items-center justify-center gap-1.5 font-medium">
          <ShieldCheck className="w-4 h-4" /> Secure SSL Encrypted Checkout via Stripe
        </p>
      </div>
    </div>
  );
};
