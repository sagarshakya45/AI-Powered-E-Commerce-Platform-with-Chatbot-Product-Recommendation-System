import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BadgeCheck, Building2, Phone, FileText, Send, Clock, CheckCircle2, XCircle, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { useAuthStore } from '../stores/useAuthStore';
import { Button } from '../components/ui/Button';
export const SalesmanApplyPage: React.FC = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [businessName, setBusinessName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [reason, setReason] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { data: applicationData, isLoading } = useQuery({
    queryKey: ['salesman-status'],
    queryFn: async () => {
      const res = await apiClient.get('/salesman/apply');
      return res.data?.data || {};
    },
    enabled: !!user,
  });

  const application = applicationData?.application || null;
  const userRole = applicationData?.userRole;

  const applyMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await apiClient.post('/salesman/apply', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salesman-status'] });
      setErrorMsg('');
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.message || 'Failed to submit application');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyMutation.mutate({ businessName, phoneNumber, reason });
  };

  useEffect(() => {
    if (application?.status === 'APPROVED' && userRole === 'SALESMAN') {
      useAuthStore.getState().checkAuth();
    }
  }, [application?.status, userRole]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-900">Sign In Required</h2>
        <p className="text-xs text-slate-500">Please sign in to apply for a Salesman / Vendor Account on AuraMart.</p>
        <Link
          to="/login"
          className="inline-block text-xs font-bold px-6 py-3 rounded-full bg-violet-600 text-white shadow-lg shadow-violet-600/30"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  const app = application;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      <Link
        to="/profile"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-violet-600 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Customer Profile</span>
      </Link>

      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-violet-600/25 shrink-0">
            <BadgeCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">Apply for Salesman Account</h1>
            <p className="text-xs text-slate-500 font-medium">Verify your business with Admin to become an authorized merchant</p>
          </div>
        </div>

        {/* Status Card Banner */}
        {isLoading ? (
          <div className="h-24 bg-slate-100 animate-pulse rounded-2xl" />
        ) : app ? (
          app.status === 'PENDING' ? (
            <div className="bg-amber-50 border border-amber-200/80 p-5 rounded-2xl flex items-center gap-4 text-amber-900">
              <Clock className="w-7 h-7 text-amber-600 shrink-0 animate-spin" />
              <div>
                <h4 className="text-sm font-bold">Application Under Review</h4>
                <p className="text-xs text-amber-700 font-medium mt-0.5">
                  Your application for <strong>{app.businessName}</strong> was submitted on{' '}
                  {new Date(app.createdAt).toLocaleDateString()}. Admin will verify your details shortly.
                </p>
              </div>
            </div>
          ) : app.status === 'APPROVED' ? (
            <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl flex items-center gap-4 text-emerald-900">
              <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
              <div>
                <h4 className="text-sm font-bold">Approved Verified Salesman!</h4>
                <p className="text-xs text-emerald-700 font-medium mt-0.5">
                  Congratulations! Your account status has been updated to <strong>SALESMAN</strong>. You have full merchant privileges.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-rose-50 border border-rose-200 p-5 rounded-2xl flex items-center gap-4 text-rose-900">
              <XCircle className="w-7 h-7 text-rose-600 shrink-0" />
              <div>
                <h4 className="text-sm font-bold">Application Not Approved</h4>
                <p className="text-xs text-rose-700 font-medium mt-0.5">
                  Your previous application was rejected. You can update your business details below to re-submit.
                </p>
              </div>
            </div>
          )
        ) : null}

        {/* Application Form */}
        {(!app || app.status === 'REJECTED') && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-2xl font-medium">
                {errorMsg}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-violet-600" />
                Business / Brand Name
              </label>
              <input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Apex Tech Solutions"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 outline-none focus:border-violet-500 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-violet-600" />
                Contact Phone Number
              </label>
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 019-2834"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 outline-none focus:border-violet-500 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-violet-600" />
                Why do you want to become a Salesman?
              </label>
              <textarea
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Briefly describe your business products, catalog experience, or sales goals..."
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-900 outline-none focus:border-violet-500 focus:bg-white transition-all resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={applyMutation.isPending}
              className="w-full py-3.5 text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-2xl shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2"
              leftIcon={<Send className="w-4 h-4" />}
              isLoading={applyMutation.isPending}
            >
              Submit Salesman Application
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
