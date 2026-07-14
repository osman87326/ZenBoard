'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Kanban, Mail, Lock, LogIn, Sparkles, User, Info, Database } from 'lucide-react';
import Toast from '@/components/Toast';

export default function Login() {
  const { login, isAuthenticated, loadingUser, dbMode } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!loadingUser && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loadingUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    const success = await login(email, password);
    setLoading(false);
    if (!success) {
      setErrorMsg('Invalid email or password credentials.');
    }
  };

  // Demo logins autofill
  const handleAutofill = (type: 'admin' | 'dev' | 'designer') => {
    const creds = {
      admin: { e: 'admin@zenboard.com', p: 'password123' },
      dev: { e: 'dev@zenboard.com', p: 'password123' },
      designer: { e: 'designer@zenboard.com', p: 'password123' },
    }[type];

    setEmail(creds.e);
    setPassword(creds.p);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(79,70,229,0.15),transparent_60%)]" />
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-violet-600/10 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl" />

      <div className="max-w-md w-full space-y-8 z-10">
        
        {/* Logo header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20">
              <Kanban className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              Zen<span className="text-indigo-400">Board</span>
            </span>
          </Link>
          <h2 className="text-2xl font-black text-slate-100">Sign in to your account</h2>
          <p className="mt-2 text-xs text-slate-400">
            Or{' '}
            <Link href="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              register a new workspace profile
            </Link>
          </p>
        </div>

        {/* Database Warning */}
        {dbMode === 'local' && (
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3.5 flex items-start gap-2.5 text-xs text-amber-300">
            <Database className="w-4.5 h-4.5 text-amber-400 mt-0.5 flex-shrink-0" />
            <p>
              <span className="font-bold">Running locally:</span> Seeding mock credentials. Logins will read from and persist tasks into local memory database.
            </p>
          </div>
        )}

        {/* Card wrapper */}
        <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-6 shadow-2xl glass">
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            {errorMsg && (
              <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs font-medium text-rose-300 text-center">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@zenboard.com"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-1.5 h-11 rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* DEMO AUTOFILL SECTION */}
          <div className="mt-6 border-t border-slate-800 pt-5 space-y-3">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Demo Credentials Autofill
            </h4>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleAutofill('admin')}
                className="py-2 px-2.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 font-medium transition-colors"
              >
                Sarah (PM)
              </button>
              <button
                type="button"
                onClick={() => handleAutofill('dev')}
                className="py-2 px-2.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 font-medium transition-colors"
              >
                Alex (Dev)
              </button>
              <button
                type="button"
                onClick={() => handleAutofill('designer')}
                className="py-2 px-2.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 font-medium transition-colors"
              >
                Emma (Design)
              </button>
            </div>
          </div>

        </div>

      </div>
      <Toast />
    </div>
  );
}
