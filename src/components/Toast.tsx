'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function Toast() {
  const { toast, hideToast } = useApp();

  if (!toast) return null;

  const { message, type } = toast;

  const bgStyles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300',
    error: 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-300',
    info: 'bg-indigo-50 border-indigo-200 text-indigo-800 dark:bg-indigo-950 dark:border-indigo-800 dark:text-indigo-300',
  }[type];

  const Icon = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  }[type];

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce duration-500">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg glass ${bgStyles} max-w-sm`}>
        <Icon className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm font-medium pr-4">{message}</p>
        <button
          onClick={hideToast}
          className="ml-auto p-1 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
