'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChartDashboard from '@/components/ChartDashboard';
import InteractiveCalendar from '@/components/InteractiveCalendar';
import Toast from '@/components/Toast';
import { useApp } from '@/context/AppContext';
import { BarChart3, Calendar as CalendarIcon, User, AlertTriangle, ShieldCheck, Database } from 'lucide-react';

export default function Dashboard() {
  const { user, isAuthenticated, loadingUser, dbMode, fetchTasks } = useApp();
  const [activeTab, setActiveTab] = useState<'analytics' | 'calendar'>('analytics');
  const router = useRouter();

  // Load user-owned tasks on mount
  useEffect(() => {
    if (!loadingUser) {
      if (!isAuthenticated) {
        router.push('/login');
      } else {
        // Load all tasks for analytics charts (no pagination limits)
        fetchTasks({ page: 1, limit: 100 });
      }
    }
  }, [isAuthenticated, loadingUser, fetchTasks, router]);

  if (loadingUser || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <span className="text-xs font-semibold text-slate-500">Loading Workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-slate-50/50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">Project Cockpit</h1>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Monitor team activity, track work items, and schedule due date timelines.
              </p>
            </div>

            {/* Tab Swapping */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 p-1.5 rounded-xl self-start sm:self-auto shadow-xs">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'analytics'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Analytics Charts
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'calendar'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                Calendar View
              </button>
            </div>
          </div>

          {/* DATABASE MODE TRANSPARENCY NOTICE */}
          {dbMode === 'local' && (
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Running in local database mode</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Workspace is storing tasks in `db.json` locally. Set `MONGODB_URI` environment variable to bridge to cloud MongoDB.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100/50 px-2 py-0.5 rounded-full flex items-center gap-1.5 self-start sm:self-auto border border-amber-200">
                <Database className="w-3 h-3 text-amber-500" />
                Local Fallback Active
              </span>
            </div>
          )}

          {/* Render Active View */}
          {activeTab === 'analytics' ? (
            <ChartDashboard />
          ) : (
            <InteractiveCalendar />
          )}

        </div>
      </main>

      <Footer />
      <Toast />
    </>
  );
}
