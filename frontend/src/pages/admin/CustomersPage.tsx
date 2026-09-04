import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Search } from 'lucide-react';
import apiClient from '../../services/apiClient';
import { Input } from '../../components/ui/Input';

export const CustomersPage: React.FC = () => {
  const [search, setSearch] = useState('');

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/customers');
      return res.data?.data?.customers || [];
    }
  });

  const filteredCustomers = customers.filter((c: any) => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Users className="w-6 h-6 text-brand-600" />
          Customer Management
        </h1>
        <p className="text-sm text-slate-500 mt-1">View all registered customers and their platform activity.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="max-w-md">
            <Input 
              placeholder="Search by name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 space-y-4 animate-pulse">
            {[1,2,3,4].map(i => <div key={i} className="h-12 bg-slate-100 rounded-xl"></div>)}
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium">No customers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
                  <th className="p-4 pl-6">Customer</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4 text-center">Total Orders</th>
                  <th className="p-4 text-center">Reviews Left</th>
                  <th className="p-4 pr-6 text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((customer: any) => (
                  <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 pl-6 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {customer.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-sm font-bold text-slate-900">{customer.name}</span>
                    </td>
                    <td className="p-4 text-sm text-slate-600 font-medium">
                      {customer.email}
                    </td>
                    <td className="p-4 text-center text-sm font-bold text-slate-900">
                      {customer._count?.orders}
                    </td>
                    <td className="p-4 text-center text-sm font-bold text-slate-900">
                      {customer._count?.reviews}
                    </td>
                    <td className="p-4 pr-6 text-right text-xs font-semibold text-slate-500">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
