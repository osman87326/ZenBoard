'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Toast from '@/components/Toast';
import { useApp, Task } from '@/context/AppContext';
import { Eye, Trash2, Search, ArrowLeft, ArrowRight, LayoutGrid, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ManageTasks() {
  const { user, isAuthenticated, loadingUser, tasks, fetchTasks, deleteTask, showToast } = useApp();
  const router = useRouter();

  // Search/Pagination inside Manage table
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const limit = 10;

  const loadData = useCallback(() => {
    fetchTasks({
      search: search || undefined,
      page,
      limit,
    });
  }, [fetchTasks, search, page]);

  // Route protection
  useEffect(() => {
    if (!loadingUser && !isAuthenticated) {
      router.push('/login');
    } else if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadingUser, loadData, router]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDeleteClick = async (id: string) => {
    if (confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      setDeletingId(id);
      const success = await deleteTask(id);
      setDeletingId(null);
      if (success) {
        loadData(); // Reload table data
      }
    }
  };

  if (loadingUser || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <span className="text-xs font-semibold text-slate-500">Redirecting to Login...</span>
        </div>
      </div>
    );
  }

  // Priority Styles
  const getPriorityBadge = (priority: string) => {
    const style = {
      Low: 'bg-slate-100 text-slate-700',
      Medium: 'bg-amber-100 text-amber-800',
      High: 'bg-rose-100 text-rose-850 font-bold',
    }[priority] || 'bg-slate-100 text-slate-700';

    return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${style}`}>{priority}</span>;
  };

  // Status Styles
  const getStatusBadge = (status: string) => {
    const style = {
      'To Do': 'bg-slate-150 text-slate-700',
      'In Progress': 'bg-indigo-100 text-indigo-800',
      'Review': 'bg-violet-100 text-violet-850',
      'Done': 'bg-emerald-100 text-emerald-800',
    }[status] || 'bg-slate-100 text-slate-700';

    return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${style}`}>{status}</span>;
  };

  const totalPages = Math.ceil(tasks.length / limit);

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-slate-50/50 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Manage Tasks</h1>
              <p className="text-xs text-slate-500 mt-1">
                Conduct administrative CRUD reviews, browse active tickets, or purge items from the repository.
              </p>
            </div>
            
            <Link
              href="/items/add"
              className="inline-flex h-9 items-center justify-center rounded-xl bg-indigo-600 px-4 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-all self-start sm:self-auto"
            >
              Add Task
            </Link>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            
            {/* Table Search bar */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/40">
              <div className="relative max-w-xs">
                <input
                  type="text"
                  placeholder="Filter by keyword..."
                  value={search}
                  onChange={handleSearchChange}
                  className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-1.5 text-xs text-slate-850 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
                />
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Search className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Table Grid */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/20 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4">Cover</th>
                    <th className="p-4">Task Details</th>
                    <th className="p-4">Workspace</th>
                    <th className="p-4">Priority</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Due Date</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {tasks.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 stroke-1" />
                        <span className="text-xs">No tasks matched your search or exist in database.</span>
                      </td>
                    </tr>
                  ) : (
                    tasks.map((task) => (
                      <tr key={task._id} className="hover:bg-slate-50/30">
                        <td className="p-4">
                          <img
                            src={task.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150'}
                            alt={task.title}
                            className="w-10 h-7 rounded object-cover border border-slate-100"
                          />
                        </td>
                        <td className="p-4">
                          <div>
                            <span className="font-bold text-slate-800 text-[13px] block">{task.title}</span>
                            <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{task.shortDescription}</span>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-slate-600">{task.workspace}</td>
                        <td className="p-4">{getPriorityBadge(task.priority)}</td>
                        <td className="p-4">{getStatusBadge(task.status)}</td>
                        <td className="p-4 font-medium text-slate-500">
                          {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              href={`/items/${task._id}`}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all"
                              title="View Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(task._id)}
                              disabled={deletingId === task._id}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all disabled:opacity-50"
                              title="Delete Task"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      </main>

      <Footer />
      <Toast />
    </>
  );
}
