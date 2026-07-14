'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Toast from '@/components/Toast';
import { useApp, Task } from '@/context/AppContext';
import { Calendar, Clock, User, Layers, Tag, MessageSquare, Send, ArrowLeft, PlusCircle, AlertCircle, ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface Comment {
  _id: string;
  taskId: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
}

export default function TaskDetails() {
  const { id } = useParams() as { id: string };
  const { isAuthenticated, user, showToast, updateTaskStatus } = useApp();
  const router = useRouter();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [postingComment, setPostingComment] = useState(false);
  const [relatedTasks, setRelatedTasks] = useState<Task[]>([]);
  
  // Image attachments slider state
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Fetch Task details
  const fetchTaskDetails = useCallback(async () => {
    try {
      const res = await fetch(`/api/tasks/${id}`);
      if (res.ok) {
        const data = await res.json();
        setTask(data.task);
        
        // Fetch related tasks in same workspace
        const relRes = await fetch(`/api/tasks?workspace=${data.task.workspace}&limit=4`);
        if (relRes.ok) {
          const relData = await relRes.json();
          setRelatedTasks(relData.tasks.filter((t: Task) => t._id !== id));
        }
      } else {
        showToast('Task not found.', 'error');
        router.push('/explore');
      }
    } catch (e) {
      console.error(e);
      showToast('Error loading task details.', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, router, showToast]);

  // Fetch Comments
  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?taskId=${id}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments);
      }
    } catch (e) {
      console.error(e);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchTaskDetails();
      fetchComments();
    }
  }, [id, fetchTaskDetails, fetchComments]);

  // Comment submission handler
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || postingComment) return;

    setPostingComment(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: id, content: newComment }),
      });
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, data.comment]);
        setNewComment('');
        showToast('Comment posted successfully', 'success');
      } else {
        showToast(data.error || 'Failed to post comment', 'error');
      }
    } catch (err) {
      showToast('Network error.', 'error');
    } finally {
      setPostingComment(false);
    }
  };

  // Status adjustment dropdown handler
  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!task) return;
    const newStatus = e.target.value as Task['status'];
    const success = await updateTaskStatus(task._id, newStatus);
    if (success) {
      setTask({ ...task, status: newStatus });
      showToast(`Task status updated to ${newStatus}`, 'success');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <span className="text-xs font-semibold text-slate-500">Loading Task Details...</span>
        </div>
      </div>
    );
  }

  if (!task) return null;

  // Formatting helpers
  const dueDateObj = new Date(task.dueDate);
  const isOverdue = dueDateObj.getTime() < Date.now() && task.status !== 'Done';
  const formattedDueDate = dueDateObj.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getPriorityColor = (priority: string) => {
    return {
      Low: 'bg-slate-100 text-slate-700 border-slate-200',
      Medium: 'bg-amber-50 text-amber-700 border-amber-200',
      High: 'bg-rose-50 text-rose-700 border-rose-200',
    }[priority] || 'bg-slate-100 text-slate-700';
  };

  const getStatusColor = (status: string) => {
    return {
      'To Do': 'bg-slate-100 text-slate-700',
      'In Progress': 'bg-indigo-50 text-indigo-700',
      'Review': 'bg-violet-50 text-violet-700',
      'Done': 'bg-emerald-50 text-emerald-700',
    }[status] || 'bg-slate-100 text-slate-700';
  };

  // Compile image array for attachments carousel
  const images = [task.coverImage, ...(task.attachments || [])].filter(Boolean) as string[];

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-slate-50/50 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Back button */}
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Explore Board
          </Link>

          {/* Title Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                  {task.workspace}
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                  {task.priority} Priority
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-tight">
                {task.title}
              </h1>
              <p className="text-xs text-slate-500">
                Created by Team Admin • Posted {new Date(task.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Quick Status Update */}
            {isAuthenticated && (
              <div className="flex items-center gap-2 bg-white border border-slate-200 p-2 rounded-xl shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-2">
                  Update Status:
                </span>
                <select
                  value={task.status}
                  onChange={handleStatusChange}
                  className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 outline-none cursor-pointer"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Review">Review</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            )}
          </div>

          {/* Main Grid: Details (Left) + Specifications & Side widgets (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: Media Carousel + Description + Comments */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Media Carousel / Showcase */}
              {images.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs flex flex-col">
                  <div className="relative h-96 w-full bg-slate-900 flex items-center justify-center">
                    <img
                      src={images[activeImageIndex]}
                      alt="Attachment Preview"
                      className="h-full w-full object-contain"
                    />
                    
                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                          className="absolute left-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                          className="absolute right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                  
                  {/* Thumbnails Row */}
                  {images.length > 1 && (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 border-t border-slate-100 overflow-x-auto">
                      {images.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImageIndex(index)}
                          className={`relative h-14 w-20 rounded-lg overflow-hidden border-2 bg-white flex-shrink-0 transition-all ${
                            activeImageIndex === index ? 'border-indigo-600 shadow-sm' : 'border-slate-200 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt="thumbnail" className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Description / Overview */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3">
                  Task Overview & Requirements
                </h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  {task.shortDescription}
                </p>
                <div className="text-xs text-slate-600 leading-relaxed space-y-3 whitespace-pre-line pt-2">
                  {task.description}
                </div>
              </div>

              {/* Checklist Sub-tasks */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3">
                  Sub-Task Checklist
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-slate-700 font-medium">
                    <input type="checkbox" defaultChecked={task.status === 'Done'} className="rounded text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5" disabled />
                    <span className={task.status === 'Done' ? 'line-through text-slate-400' : ''}>Verify local code execution branch passes test suites</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-700 font-medium">
                    <input type="checkbox" defaultChecked={task.status === 'Done' || task.status === 'Review'} className="rounded text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5" disabled />
                    <span className={(task.status === 'Done' || task.status === 'Review') ? 'line-through text-slate-400' : ''}>Conduct peer review audit before final merge</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-700 font-medium">
                    <input type="checkbox" defaultChecked={task.status === 'Done'} className="rounded text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5" disabled />
                    <span className={task.status === 'Done' ? 'line-through text-slate-400' : ''}>Upload attachment files and document api endpoints</span>
                  </div>
                </div>
              </div>

              {/* COMMENTS SECTION */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
                <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center justify-between">
                  <span>Comments ({comments.length})</span>
                  <MessageSquare className="w-4.5 h-4.5 text-slate-400" />
                </h3>

                {/* Comments List */}
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {comments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-slate-400 text-center">
                      <MessageSquare className="w-8 h-8 mb-2 stroke-1" />
                      <p className="text-xs">No discussion yet. Write the first comment below.</p>
                    </div>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment._id} className="flex gap-3 items-start border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                        <img
                          src={comment.author.avatar}
                          alt={comment.author.name}
                          className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                        />
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">{comment.author.name}</span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-100">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Comments Form */}
                {isAuthenticated ? (
                  <form onSubmit={handleCommentSubmit} className="flex gap-2 items-start border-t border-slate-100 pt-5">
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                    />
                    <div className="flex-1 relative">
                      <textarea
                        required
                        rows={2}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-3.5 pr-12 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none resize-none"
                      />
                      <button
                        type="submit"
                        disabled={postingComment}
                        className="absolute right-2.5 bottom-3.5 p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow shadow-indigo-600/20 transition-all disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-center text-xs text-slate-500 font-semibold">
                    <AlertCircle className="w-5 h-5 text-slate-400 mx-auto mb-1.5" />
                    <span>Please </span>
                    <Link href="/login" className="text-indigo-600 font-bold hover:underline">
                      sign in
                    </Link>
                    <span> to post comments and join this task discussion.</span>
                  </div>
                )}

              </div>

            </div>

            {/* RIGHT COLUMN: Specifications, Assignee card, Related Items */}
            <div className="space-y-8">
              
              {/* Specifications Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3">
                  Task Specifications
                </h3>
                
                <div className="space-y-3.5 text-xs">
                  
                  {/* Assignee details */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-semibold">Assignee</span>
                    <div className="flex items-center gap-2">
                      <img
                        src={task.assignee.avatar}
                        alt={task.assignee.name}
                        className="w-6 h-6 rounded-full border border-slate-200 object-cover"
                      />
                      <span className="font-bold text-slate-700">{task.assignee.name}</span>
                    </div>
                  </div>

                  {/* Due Date Details */}
                  <div className="flex items-start justify-between">
                    <span className="text-slate-400 font-semibold mt-0.5">Due Date</span>
                    <div className="text-right">
                      <span className={`font-bold flex items-center gap-1 justify-end ${isOverdue ? 'text-rose-600' : 'text-slate-700'}`}>
                        <Calendar className="w-3.5 h-3.5" />
                        {formattedDueDate}
                      </span>
                      {isOverdue && (
                        <span className="text-[10px] font-bold text-rose-500 block uppercase mt-0.5 animate-pulse">
                          (Task Overdue)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Workspace Details */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-semibold">Workspace</span>
                    <span className="font-bold text-slate-700 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      {task.workspace}
                    </span>
                  </div>

                  {/* Estimation Hours Details */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-semibold">Est. Hours</span>
                    <span className="font-bold text-slate-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {task.estHours} Hours
                    </span>
                  </div>

                </div>
              </div>

              {/* Related tasks */}
              {relatedTasks.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm pl-1">
                    Related Tasks
                  </h3>
                  <div className="space-y-3">
                    {relatedTasks.map((t) => (
                      <Link
                        key={t._id}
                        href={`/items/${t._id}`}
                        className="block rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all group"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                            {t.status}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Est: {t.estHours}h
                          </span>
                        </div>
                        <h4 className="font-semibold text-slate-800 text-xs tracking-tight line-clamp-1 group-hover:text-indigo-600 transition-colors">
                          {t.title}
                        </h4>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      </main>

      <Footer />
      <Toast />
    </>
  );
}
