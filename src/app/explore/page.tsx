'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TaskCard from '@/components/TaskCard';
import SkeletonCard from '@/components/SkeletonCard';
import KanbanBoard from '@/components/KanbanBoard';
import Toast from '@/components/Toast';
import { useApp } from '@/context/AppContext';
import { Search, Filter, SortAsc, LayoutGrid, Kanban as KanbanIcon, ArrowLeft, ArrowRight, Database } from 'lucide-react';

export default function Explore() {
  const { tasks, totalTasks, loadingTasks, fetchTasks, selectedWorkspace, dbMode } = useApp();
  
  // Views
  const [viewMode, setViewMode] = useState<'kanban' | 'grid'>('kanban');
  
  // Filters & State
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [sort, setSort] = useState('dueDateAsc');
  const [page, setPage] = useState(1);
  const limit = 8; // 8 cards per page (ideal for 4 cards per row desktop grid)

  // Debounced/triggered fetch helper
  const loadData = useCallback(() => {
    fetchTasks({
      status: status || undefined,
      priority: priority || undefined,
      search: search || undefined,
      sort: sort || undefined,
      page,
      limit,
    });
  }, [fetchTasks, status, priority, search, sort, page]);

  // Fetch when filters or page changes
  useEffect(() => {
    loadData();
  }, [loadData, selectedWorkspace]);

  // Reset page when filters change
  const handleFilterChange = (filterType: string, value: string) => {
    setPage(1);
    if (filterType === 'status') setStatus(value);
    if (filterType === 'priority') setPriority(value);
    if (filterType === 'sort') setSort(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadData();
  };

  // Pagination helpers
  const totalPages = Math.ceil(totalTasks / limit);
  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };
  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-slate-50/50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Page Title & View Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">Explore Tasks</h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-100">
                  {selectedWorkspace}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Search, filter, and drag tasks across workflow statuses in real time.
              </p>
            </div>

            {/* View Switcher Toggle Buttons */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 p-1.5 rounded-xl self-start sm:self-auto shadow-xs">
              <button
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'kanban'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <KanbanIcon className="w-3.5 h-3.5" />
                Board View
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Grid Cards
              </button>
            </div>
          </div>

          {/* Filtering Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search by title, description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
              />
              <button type="submit" className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Select Dropdowns */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              
              {/* Status filter */}
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs text-slate-500">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="bg-transparent font-medium text-slate-700 outline-none cursor-pointer py-1"
                >
                  <option value="">All Statuses</option>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Review">Review</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              {/* Priority filter */}
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs text-slate-500">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={priority}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  className="bg-transparent font-medium text-slate-700 outline-none cursor-pointer py-1"
                >
                  <option value="">All Priorities</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              {/* Sort Order select */}
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs text-slate-500">
                <SortAsc className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="bg-transparent font-medium text-slate-700 outline-none cursor-pointer py-1"
                >
                  <option value="dueDateAsc">Due Date: Ascending</option>
                  <option value="dueDateDesc">Due Date: Descending</option>
                  <option value="titleAsc">Title: Alphabetical</option>
                  <option value="priorityHigh">Priority: High to Low</option>
                </select>
              </div>

            </div>
          </div>

          {/* MAIN BOARD OR GRID CONTAINER */}
          {loadingTasks ? (
            viewMode === 'kanban' ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <div className="h-6 rounded animate-skeleton w-1/3" />
                    <SkeletonCard />
                    <SkeletonCard />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-slate-200 bg-white shadow-xs text-center p-6">
              <Search className="w-10 h-10 text-slate-300 stroke-1 mb-3" />
              <h3 className="font-bold text-slate-700 text-sm">No tasks found</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
                We couldn't find any tasks matching your selected search query and filter criteria. Try adjusting the tags or resetting parameters.
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setStatus('');
                  setPriority('');
                  setSort('dueDateAsc');
                  setPage(1);
                }}
                className="mt-4 inline-flex h-9 items-center justify-center rounded-xl bg-indigo-50 px-4 text-xs font-bold text-indigo-600 border border-indigo-100 hover:bg-indigo-100 transition-all"
              >
                Reset Filters
              </button>
            </div>
          ) : viewMode === 'kanban' ? (
            <KanbanBoard />
          ) : (
            // GRID CARD VIEW (Desktop: 4 cards per row)
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {tasks.map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))}
              </div>

              {/* PAGINATION CONTROLS */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-200 pt-6">
                  <span className="text-xs font-semibold text-slate-500">
                    Showing Page {page} of {totalPages} ({totalTasks} total tasks)
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={handlePrevPage}
                      disabled={page === 1}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-all"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Previous
                    </button>
                    <button
                      onClick={handleNextPage}
                      disabled={page === totalPages}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-all"
                    >
                      Next
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      <Footer />
      <Toast />
    </>
  );
}
