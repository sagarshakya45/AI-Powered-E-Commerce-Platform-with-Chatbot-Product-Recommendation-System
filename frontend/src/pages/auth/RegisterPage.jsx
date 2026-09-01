import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { registerSchema } from '../../utils/validators';
import { useAuthStore } from '../../store/authStore';

export const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser, isLoading, error: storeError } = useAuthStore();
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'CUSTOMER',
    },
  });

  const onSubmit = async (data) => {
    setServerError('');
    const { confirmPassword, ...payload } = data;
    const result = await registerUser(payload);
    if (result.success) {
      navigate('/', { replace: true });
    } else {
      setServerError(result.error);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-brand-50 text-brand-600 mb-2">
            <UserPlus className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create an Account</h2>
          <p className="text-sm text-slate-500">Join AuraMart to discover exclusive deals & seamless shopping</p>
        </div>

        {(serverError || storeError) && (
          <div className="flex items-center space-x-2 p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-100">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{serverError || storeError}</span>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="John Doe"
                {...register('name')}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                  errors.name ? 'border-red-400 bg-red-50/50' : 'border-slate-200 focus:border-brand-500'
                } focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all text-sm`}
              />
            </div>
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                placeholder="john@example.com"
                {...register('email')}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                  errors.email ? 'border-red-400 bg-red-50/50' : 'border-slate-200 focus:border-brand-500'
                } focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all text-sm`}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 6 characters"
                {...register('password')}
                className={`w-full pl-10 pr-11 py-3 rounded-xl border ${
                  errors.password ? 'border-red-400 bg-red-50/50' : 'border-slate-200 focus:border-brand-500'
                } focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all text-sm`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Re-enter password"
                {...register('confirmPassword')}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                  errors.confirmPassword ? 'border-red-400 bg-red-50/50' : 'border-slate-200 focus:border-brand-500'
                } focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all text-sm`}
              />
            </div>
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Account Role</label>
            <select
              {...register('role')}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all text-sm bg-white"
            >
              <option value="CUSTOMER">Customer Account</option>
              <option value="ADMIN">Admin Account</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isLoading ? <span>Registering...</span> : <span>Create Account</span>}
          </button>
        </form>

        <div className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-500 underline">
            Sign in instead
          </Link>
        </div>
      </div>
    </div>
  );
};
