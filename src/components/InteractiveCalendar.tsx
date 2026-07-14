'use client';

import React, { useState } from 'react';
import { useApp, Task } from '@/context/AppContext';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Tag } from 'lucide-react';
import Link from 'next/link';

export default function InteractiveCalendar() {
  const { tasks } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Navigate month
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Get calendar parameters
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingArray = Array.from({ length: firstDayIndex }, (_, i) => i);

  // Filter tasks for a specific date
  const getTasksForDate = (day: number) => {
    return tasks.filter((t) => {
      const taskDate = new Date(t.dueDate);
      return (
        taskDate.getDate() === day &&
        taskDate.getMonth() === month &&
        taskDate.getFullYear() === year
      );
    });
  };

  const getPriorityStyle = (priority: Task['priority']) => {
    return {
      Low: 'border-l-2 border-slate-400 bg-slate-50 text-slate-700 hover:bg-slate-100',
      Medium: 'border-l-2 border-amber-500 bg-amber-50 text-amber-800 hover:bg-amber-100',
      High: 'border-l-2 border-rose-500 bg-rose-50 text-rose-800 hover:bg-rose-100',
    }[priority];
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      
      {/* Header controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm leading-none">{monthNames[month]} {year}</h3>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Workspace Schedule</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-all"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Padding days */}
        {paddingArray.map((_, i) => (
          <div key={`pad-${i}`} className="min-h-24 rounded-xl bg-slate-50/40 border border-slate-100" />
        ))}

        {/* Month days */}
        {daysArray.map((day) => {
          const dateTasks = getTasksForDate(day);
          const isToday = 
            day === new Date().getDate() && 
            month === new Date().getMonth() && 
            year === new Date().getFullYear();

          return (
            <div
              key={`day-${day}`}
              className={`min-h-28 rounded-xl border p-2 flex flex-col transition-all duration-200 ${
                isToday 
                  ? 'border-indigo-500 bg-indigo-50/10 shadow-xs' 
                  : 'border-slate-100 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-bold ${
                  isToday 
                    ? 'flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white text-[10px]' 
                    : 'text-slate-600'
                }`}>
                  {day}
                </span>
                {dateTasks.length > 0 && (
                  <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 rounded-full">
                    {dateTasks.length}
                  </span>
                )}
              </div>

              {/* Task pills list */}
              <div className="flex flex-col gap-1 flex-1 overflow-y-auto max-h-20">
                {dateTasks.map((t) => (
                  <Link
                    key={t._id}
                    href={`/items/${t._id}`}
                    className={`flex flex-col p-1 rounded text-[9px] font-semibold leading-tight border transition-colors ${getPriorityStyle(t.priority)}`}
                    title={`${t.title} - ${t.status}`}
                  >
                    <span className="truncate">{t.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
