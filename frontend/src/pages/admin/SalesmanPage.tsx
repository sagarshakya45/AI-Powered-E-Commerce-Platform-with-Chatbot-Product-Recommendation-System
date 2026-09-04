import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BadgeCheck, CheckCircle2, XCircle, Clock, Building2, Phone, Mail, User } from 'lucide-react';
import apiClient from '../../services/apiClient';

export const AdminSalesmanPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['admin-salesman-apps'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/salesman-applications');
      return res.data?.data?.applications || [];
    },
  });

  const reviewMutation = useMutation({
    mutationFn: async (payload: { applicationId: string; status: 'APPROVED' | 'REJECTED' }) => {
      const res = await apiClient.patch('/admin/salesman-applications', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-salesman-apps'] });
      queryClient.invalidateQueries({ queryKey: ['admin-overview'] });
    },
  });

  const handleReview = (applicationId: string, status: 'APPROVED' | 'REJECTED') => {
    reviewMutation.mutate({ applicationId, status });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-violet-600/10 border border-violet-500/20 text-violet-600 flex items-center justify-center">
            <BadgeCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Salesman Applications</h1>
            <p className="text-xs text-slate-500 font-medium">Verify vendor merchant requests and approve salesman roles</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-white rounded-3xl border border-slate-100" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center mx-auto">
            <User className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No applications received yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When registered customers submit a Salesman request, their applications will appear here for your review!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app: any) => (
            <div
              key={app.id}
              className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-violet-50 border border-violet-100 text-violet-600 flex items-center justify-center font-bold">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{app.businessName}</h3>
                      <p className="text-[11px] text-slate-400 font-medium">
                        Submitted {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {app.status === 'PENDING' ? (
                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      <Clock className="w-3 h-3 animate-spin" /> Pending Review
                    </span>
                  ) : app.status === 'APPROVED' ? (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" /> Approved (SALESMAN)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      <XCircle className="w-3 h-3" /> Rejected
                    </span>
                  )}
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <User className="w-3.5 h-3.5 text-violet-600" />
                    <span>Applicant: {app.user?.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-violet-600" />
                    <span>Email: {app.user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-violet-600" />
                    <span>Phone: {app.phoneNumber}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 leading-relaxed font-medium">
                  <strong className="text-slate-800 block mb-0.5">Application Reason:</strong>
                  <p className="bg-slate-50 p-3 rounded-xl border border-slate-100">{app.reason}</p>
                </div>
              </div>

              {/* Action Buttons */}
              {app.status === 'PENDING' && (
                <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleReview(app.id, 'REJECTED')}
                    disabled={reviewMutation.isPending}
                    className="flex-1 py-2.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReview(app.id, 'APPROVED')}
                    disabled={reviewMutation.isPending}
                    className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-violet-600/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Approve Salesman
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
