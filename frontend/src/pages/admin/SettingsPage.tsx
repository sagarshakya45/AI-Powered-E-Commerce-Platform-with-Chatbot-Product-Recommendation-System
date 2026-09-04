import React, { useState, useEffect } from 'react';
import { Settings, Store, Shield, Cpu, Save, CheckCircle2, Globe, CreditCard } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import apiClient from '../../services/apiClient';
import { detectCurrency, formatCurrency } from '../../utils/formatters';
import { BackButton } from '../../components/common/BackButton';

export const SettingsPage: React.FC = () => {
  const [storeName, setStoreName] = useState('AuraMart Electronics & Luxury');
  const [supportEmail, setSupportEmail] = useState('support@auramart.example.com');
  const [currency, setCurrency] = useState(() => `${detectCurrency()} (${formatCurrency(0).charAt(0)})`);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('99.00');
  const [enableAI, setEnableAI] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.put('/admin/settings', {
        storeName,
        supportEmail,
        currency,
        freeShippingThreshold,
        enableAI,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err:any) {
      console.error('Failed to save settings', err);
      // you could add error toast here
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <BackButton to="/admin" label="Admin" />
          <div className="w-10 h-10 rounded-2xl bg-violet-600/10 border border-violet-500/20 text-violet-600 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin System Settings</h1>
            <p className="text-xs text-slate-500 font-medium">Manage store configuration, payment integrations & AI parameters</p>
          </div>
        </div>

        <Button
          type="submit"
          onClick={handleSave}
          className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold"
          leftIcon={<Save className="w-4 h-4" />}
        >
          Save Configuration
        </Button>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in-50">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-xs font-bold">System settings saved successfully!</span>
        </div>
      )}

      {/* Store Information Card */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <Store className="w-5 h-5 text-violet-600" />
          <h2 className="text-lg font-black text-slate-900">General Store Identity</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Store Brand Name</label>
            <input
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-900 font-bold outline-none focus:border-violet-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Support Email</label>
            <input
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-900 font-medium outline-none focus:border-violet-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Store Base Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs text-slate-900 font-medium outline-none focus:border-violet-500"
            >
              <option value="USD ($)">USD ($) - US Dollar</option>
              <option value="EUR (€)">EUR (€) - Euro</option>
              <option value="GBP (£)">GBP (£) - British Pound</option>
              <option value="INR (₹)">INR (₹) - Indian Rupee</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Free Shipping Threshold ({formatCurrency(0).replace('0.00', '').trim()})</label>
            <input
              type="number"
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-900 font-bold outline-none focus:border-violet-500"
            />
          </div>
        </div>
      </div>

      {/* AI Assistant Integration */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <Cpu className="w-5 h-5 text-violet-600" />
          <h2 className="text-lg font-black text-slate-900">AI Concierge & Smart Summaries</h2>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div>
            <h4 className="text-xs font-bold text-slate-900">Enable Floating AI Assistant (Gemini)</h4>
            <p className="text-[11px] text-slate-500">Provide live AI shopping recommendations on storefront pages</p>
          </div>
          <input
            type="checkbox"
            checked={enableAI}
            onChange={(e) => setEnableAI(e.target.checked)}
            className="w-5 h-5 text-violet-600 rounded focus:ring-violet-500 accent-violet-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Integrations Health */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <CreditCard className="w-5 h-5 text-violet-600" />
          <h2 className="text-lg font-black text-slate-900">Integration Health & Gateway Secrets</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Stripe Payment Gateway</span>
              <span className="text-xs font-black text-emerald-900">Connected (Active API Keys)</span>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="p-4 rounded-2xl bg-violet-50 border border-violet-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-violet-700 uppercase tracking-wider block">Gemini 1.5 Flash AI</span>
              <span className="text-xs font-black text-violet-900">Connected & Grounded</span>
            </div>
            <Globe className="w-5 h-5 text-violet-600" />
          </div>
        </div>
      </div>
    </div>
  );
};
