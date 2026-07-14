'use client';

import React, { useState } from 'react';
import { useApp, Task } from '@/context/AppContext';
import Link from 'next/link';
import { Plus, ArrowRight, Calendar, Clock, AlertCircle } from 'lucide-react';

export default function KanbanBoard() {
  const { tasks, updateTaskStatus } = useApp();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const statuses: Task['status'][] = ['To Do', 'In Progress', 'Review', 'Done'];

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Handle drag over column
  const handleDragOver = (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle drag enter column
  const handleDragEnter = (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  // Handle drag leave column
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle drop
  const handleDrop = async (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    setDragOverColumn(null);
    setDraggedTaskId(null);

    if (taskId) {
      await updateTaskStatus(taskId, status);
    }
  };

  // Filter tasks for columns
  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter((t) => t.status === status);
  };

  const getPriorityColor = (priority: string) => {
    return {
      Low: 'bg-slate-100 text-slate-700',
      Medium: 'bg-amber-100 text-amber-800',
      High: 'bg-rose-100 text-rose-800',
    }[priority] || 'bg-slate-100 text-slate-700';
  };

  const getColumnHeaderBg = (status: Task['status']) => {
    return {
      'To Do': 'bg-slate-100 text-slate-700',
      'In Progress': 'bg-indigo-50 text-indigo-700',
      'Review': 'bg-violet-50 text-violet-700',
      'Done': 'bg-emerald-50 text-emerald-700',
    }[status];
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
      {statuses.map((status) => {
        const columnTasks = getTasksByStatus(status);
        const isOver = dragOverColumn === status;

        return (
          <div
            key={status}
            onDragOver={(e) => handleDragOver(e, status)}
            onDragEnter={(e) => handleDragEnter(e, status)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, status)}
            className={`flex flex-col min-h-[500px] rounded-2xl border-2 p-3 transition-all duration-200 ${
              isOver 
                ? 'border-indigo-400 bg-indigo-50/20 shadow-inner' 
                : 'border-slate-200/60 bg-slate-50/50'
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 px-1.5">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getColumnHeaderBg(status)}`}>
                  {status}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {columnTasks.length}
                </span>
              </div>
              
              {status === 'To Do' && (
                <Link
                  href="/items/add"
                  className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-all"
                  title="Add Task"
                >
                  <Plus className="w-4 h-4" />
                </Link>
              )}
            </div>

            {/* Tasks List */}
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[600px] pr-0.5">
              {columnTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed border-slate-200 bg-white/40 text-slate-400 flex-1">
                  <AlertCircle className="w-6 h-6 stroke-1 mb-1" />
                  <span className="text-[11px] font-medium">Drop tasks here</span>
                </div>
              ) : (
                columnTasks.map((task) => {
                  const isOverdue = new Date(task.dueDate).getTime() < Date.now() && task.status !== 'Done';

                  return (
                    <div
                      key={task._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task._id)}
                      className={`group flex flex-col p-4 rounded-xl border border-slate-200 bg-white shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-grab active:cursor-grabbing ${
                        draggedTaskId === task._id ? 'opacity-30 border-dashed border-indigo-300 bg-slate-50' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                          {task.workspace}
                        </span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>

                      <h4 className="font-semibold text-slate-800 text-xs tracking-tight line-clamp-1 group-hover:text-indigo-600 transition-colors mb-1">
                        {task.title}
                      </h4>
                      
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
                        {task.shortDescription}
                      </p>

                      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] text-slate-400">
                        <div className="flex items-center gap-1">
                          <Calendar className={`w-3 h-3 ${isOverdue ? 'text-rose-500' : 'text-slate-400'}`} />
                          <span className={isOverdue ? 'text-rose-500 font-semibold' : ''}>
                            {formatDate(task.dueDate)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                          <img
                            src={task.assignee.avatar}
                            alt={task.assignee.name}
                            className="w-5 h-5 rounded-full object-cover border border-slate-100"
                            title={task.assignee.name}
                          />
                          <Link
                            href={`/items/${task._id}`}
                            className="p-1 rounded-lg text-slate-300 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
}
