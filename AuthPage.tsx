import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';

export const AuthPage: React.FC<{ isRegister?: boolean }> = ({ isRegister = false }) => {
  const { login, register, quickLogin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [role, setRole] = useState<'customer' | 'provider'>(
    (searchParams.get('role') as any) === 'provider' ? 'provider' : 'customer'
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        const user = await register({
          name,
          email,
          password,
          role,
          businessName: role === 'provider' ? businessName : undefined
        });
        if (user.role === 'provider') navigate('/dashboard/provider');
        else navigate('/dashboard/customer');
      } else {
        const user = await login(email, password);
        if (user.role === 'admin') navigate('/dashboard/admin');
        else if (user.role === 'provider') navigate('/dashboard/provider');
        else navigate('/dashboard/customer');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async (demoRole: 'customer' | 'provider' | 'admin') => {
    setLoading(true);
    setError('');
    try {
      await quickLogin(demoRole);
      if (demoRole === 'admin') navigate('/dashboard/admin');
      else if (demoRole === 'provider') navigate('/dashboard/provider');
      else navigate('/dashboard/customer');
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl space-y-6">
        
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 items-center justify-center text-white shadow-md shadow-indigo-200">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            {isRegister ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-500">
            {isRegister 
              ? 'Join thousands of satisfied customers and service providers' 
              : 'Sign in to access your appointments and dashboard'}
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/70 space-y-1.5 text-center">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Instant Demo One-Click Access
          </span>
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => handleDemoSignIn('customer')}
              className="py-1.5 px-2 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-800 text-xs font-semibold rounded-xl shadow-2xs transition-colors"
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => handleDemoSignIn('provider')}
              className="py-1.5 px-2 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-800 text-xs font-semibold rounded-xl shadow-2xs transition-colors"
            >
              Provider
            </button>
            <button
              type="button"
              onClick={() => handleDemoSignIn('admin')}
              className="py-1.5 px-2 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-800 text-xs font-semibold rounded-xl shadow-2xs transition-colors"
            >
              Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl">
            {error}
          </div>
        )}

        {/* Register Role Selector */}
        {isRegister && (
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                role === 'customer' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              I am a Customer
            </button>
            <button
              type="button"
              onClick={() => setRole('provider')}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                role === 'provider' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              I am a Provider
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alexander Wright"
                  className="w-full pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>
            </div>
          )}

          {isRegister && role === 'provider' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Business Name</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Apex Electrical Services LLC"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-500">
          {isRegister ? (
            <p>
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-indigo-600 hover:underline">
                Sign In
              </Link>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-indigo-600 hover:underline">
                Register for Free
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
