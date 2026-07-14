'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Toast from '@/components/Toast';
import { useApp } from '@/context/AppContext';
import { PlusCircle, Layers, Calendar, Clock, Image as ImageIcon, Sparkles, User, AlertCircle } from 'lucide-react';

export default function AddTask() {
  const { user, isAuthenticated, loadingUser, addTask, showToast } = useApp();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('To Do');
  const [dueDate, setDueDate] = useState('');
  const [estHours, setEstHours] = useState('');
  const [workspace, setWorkspace] = useState('ZenBoard Platform');
  const [assigneeName, setAssigneeName] = useState('Alex Rivera (Dev)');
  const [coverImage, setCoverImage] = useState('');
  const [attachmentsString, setAttachmentsString] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Route guards
  useEffect(() => {
    if (!loadingUser && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loadingUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !shortDescription || !description || !dueDate || !estHours) {
      setErrorMsg('Please populate all required fields.');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);

    const success = await addTask({
      title,
      shortDescription,
      description,
      priority,
      status,
      dueDate,
      estHours,
      workspace,
      assigneeName,
      coverImage,
      attachmentsString,
    });

    setSubmitting(false);

    if (success) {
      router.push('/explore');
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

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-slate-50/50 py-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          
          <div className="mb-6 space-y-1">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Create Task</h1>
            <p className="text-xs text-slate-500">
              Add a new ticket to the workspace backlog, assign a developer, and schedule sprint milestones.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            
            {errorMsg && (
              <div className="mb-4 rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs font-medium text-rose-700 text-center">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Row 1: Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Task Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Stripe Gateway Integration"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Row 2: Short Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Short Description <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="e.g. Implement Stripe Checkout API and webhook signature validation checks."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Row 3: Full Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Details & Acceptance Criteria <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain requirements, steps to reproduce, or merge requirements..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none resize-none"
                />
              </div>

              {/* Row 4: Priority + Status + Workspace Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Priority <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-700 outline-none cursor-pointer focus:bg-white focus:border-indigo-500"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Workflow Status <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-700 outline-none cursor-pointer focus:bg-white focus:border-indigo-500"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Done">Done</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Workspace <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={workspace}
                    onChange={(e) => setWorkspace(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-700 outline-none cursor-pointer focus:bg-white focus:border-indigo-500"
                  >
                    <option value="ZenBoard Platform">ZenBoard Platform</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="Marketing Launch">Marketing Launch</option>
                  </select>
                </div>

              </div>

              {/* Row 5: Due Date + Est Hours + Assignee */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Due Date <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                    </span>
                    <input
                      type="date"
                      required
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs text-slate-700 outline-none focus:bg-white focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Est. Hours <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                    </span>
                    <input
                      type="number"
                      required
                      min={1}
                      max={100}
                      value={estHours}
                      onChange={(e) => setEstHours(e.target.value)}
                      placeholder="e.g. 8"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs text-slate-700 outline-none focus:bg-white focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Assignee Member <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={assigneeName}
                    onChange={(e) => setAssigneeName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-700 outline-none cursor-pointer focus:bg-white focus:border-indigo-500"
                  >
                    <option value="Sarah Jenkins (PM)">Sarah Jenkins (PM)</option>
                    <option value="Alex Rivera (Dev)">Alex Rivera (Dev)</option>
                    <option value="Emma Watson (Designer)">Emma Watson (Designer)</option>
                  </select>
                </div>

              </div>

              {/* Row 6: Cover Image URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Cover Image URL</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <ImageIcon className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="url"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 7: Attachments */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Attachment Image URLs (comma-separated list)
                </label>
                <textarea
                  rows={2}
                  value={attachmentsString}
                  onChange={(e) => setAttachmentsString(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-1..., https://images.unsplash.com/photo-2..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 border-t border-slate-100 pt-5 justify-end">
                <button
                  type="button"
                  onClick={() => router.push('/explore')}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 text-xs font-semibold text-white shadow hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  <PlusCircle className="w-4 h-4" />
                  {submitting ? 'Creating task...' : 'Publish Task'}
                </button>
              </div>

            </form>

          </div>

        </div>
      </main>

      <Footer />
      <Toast />
    </>
  );
}
