'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';
import { Task } from '@/context/AppContext';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { _id, title, shortDescription, priority, status, dueDate, assignee, workspace, coverImage } = task;

  // Format Due Date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = new Date(dueDate).getTime() < Date.now() && status !== 'Done';

  // Priority Styles
  const priorityStyles = {
    Low: 'bg-slate-100 text-slate-700 border-slate-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200',
    High: 'bg-rose-50 text-rose-700 border-rose-200',
  }[priority];

  // Status Styles
  const statusStyles = {
    'To Do': 'bg-slate-100 text-slate-700',
    'In Progress': 'bg-indigo-50 text-indigo-700',
    'Review': 'bg-violet-50 text-violet-700',
    'Done': 'bg-emerald-50 text-emerald-700',
  }[status];

  const defaultCover = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800';

  return (
    <div className="group flex flex-col h-[380px] w-full rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      
      {/* Cover Image */}
      <div className="relative h-32 w-full bg-slate-100 overflow-hidden">
        <img
          src={coverImage || defaultCover}
          alt={title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityStyles} glass`}>
            {priority}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusStyles} glass`}>
            {status}
          </span>
        </div>
        <div className="absolute bottom-2 right-2 rounded bg-slate-900/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs">
          {workspace}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-bold text-slate-800 text-sm tracking-tight line-clamp-1 mb-1 group-hover:text-indigo-600 transition-colors">
          {title}
        </h3>
        
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
          {shortDescription}
        </p>

        {/* Task Meta details */}
        <div className="space-y-2 mb-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <Calendar className={`w-3.5 h-3.5 ${isOverdue ? 'text-rose-500' : 'text-slate-400'}`} />
            <span className={isOverdue ? 'text-rose-600 font-semibold' : ''}>
              Due: {formatDate(dueDate)} {isOverdue && '(Overdue)'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Est: {task.estHours} hrs</span>
          </div>
        </div>

        {/* Footer with Assignee & CTA */}
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
          {/* Assignee info */}
          <div className="flex items-center gap-2">
            <img
              src={assignee.avatar}
              alt={assignee.name}
              className="w-6 h-6 rounded-full border border-slate-200 bg-slate-50 object-cover"
              title={assignee.name}
            />
            <span className="text-[11px] font-medium text-slate-600 truncate max-w-[100px]" title={assignee.name}>
              {assignee.name.split(' ')[0]}
            </span>
          </div>

          {/* Action Button */}
          <Link
            href={`/items/${_id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors group/btn"
          >
            Details
            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>

      </div>

    </div>
  );
}
