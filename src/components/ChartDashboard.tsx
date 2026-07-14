'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, AreaChart, Area } from 'recharts';
import { CheckCircle2, ListTodo, PlayCircle, Eye, AlertTriangle, Layers, Clock } from 'lucide-react';

export default function ChartDashboard() {
  const { tasks } = useApp();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        <div className="h-64 rounded-2xl bg-white border border-slate-200" />
        <div className="h-64 rounded-2xl bg-white border border-slate-200" />
        <div className="h-64 rounded-2xl bg-white border border-slate-200" />
      </div>
    );
  }

  // STATUS BREAKDOWN DATA
  const statusCounts = { 'To Do': 0, 'In Progress': 0, 'Review': 0, 'Done': 0 };
  let totalHours = 0;
  let doneHours = 0;

  tasks.forEach((t) => {
    statusCounts[t.status] = (statusCounts[t.status] || 0) + 1;
    totalHours += t.estHours || 0;
    if (t.status === 'Done') doneHours += t.estHours || 0;
  });

  const statusData = [
    { name: 'To Do', value: statusCounts['To Do'], color: '#94a3b8' },
    { name: 'In Progress', value: statusCounts['In Progress'], color: '#4f46e5' },
    { name: 'Review', value: statusCounts['Review'], color: '#8b5cf6' },
    { name: 'Done', value: statusCounts['Done'], color: '#10b981' },
  ].filter(d => d.value > 0);

  // PRIORITY BREAKDOWN DATA
  const priorityCounts = { Low: 0, Medium: 0, High: 0 };
  tasks.forEach((t) => {
    priorityCounts[t.priority] = (priorityCounts[t.priority] || 0) + 1;
  });

  const priorityData = [
    { name: 'Low Priority', value: priorityCounts.Low, fill: '#64748b' },
    { name: 'Medium Priority', value: priorityCounts.Medium, fill: '#f59e0b' },
    { name: 'High Priority', value: priorityCounts.High, fill: '#f43f5e' },
  ];

  // TIMELINE TREND (SIMULATED DATES METRICS)
  // Let's group task count/hours by due date
  const timelineMap: Record<string, { name: string; Tasks: number; Hours: number }> = {};
  
  // Seed last 4 days and next 4 days to ensure timeline has nice values
  for (let i = -4; i <= 4; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    timelineMap[dateStr] = { name: dateStr, Tasks: 0, Hours: 0 };
  }

  tasks.forEach((t) => {
    const dateStr = new Date(t.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    if (timelineMap[dateStr]) {
      timelineMap[dateStr].Tasks += 1;
      timelineMap[dateStr].Hours += t.estHours;
    } else {
      timelineMap[dateStr] = { name: dateStr, Tasks: 1, Hours: t.estHours };
    }
  });

  const timelineData = Object.values(timelineMap).sort((a, b) => {
    return new Date(a.name).getTime() - new Date(b.name).getTime();
  });

  // WORKLOAD PER TEAM MEMBER
  const workloadMap: Record<string, { name: string; avatar: string; ToDo: number; InProgress: number; Done: number; Hours: number }> = {};
  tasks.forEach((t) => {
    const name = t.assignee.name.split(' ')[0]; // first name
    if (!workloadMap[name]) {
      workloadMap[name] = {
        name,
        avatar: t.assignee.avatar,
        ToDo: 0,
        InProgress: 0,
        Done: 0,
        Hours: 0,
      };
    }
    workloadMap[name].Hours += t.estHours;
    if (t.status === 'Done') workloadMap[name].Done += 1;
    else if (t.status === 'In Progress') workloadMap[name].InProgress += 1;
    else workloadMap[name].ToDo += 1;
  });

  const workloadData = Object.values(workloadMap);

  return (
    <div className="space-y-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Tasks</p>
            <h3 className="text-2xl font-bold text-slate-800">{tasks.length}</h3>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <PlayCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Tasks</p>
            <h3 className="text-2xl font-bold text-slate-800">
              {tasks.filter((t) => t.status === 'In Progress' || t.status === 'Review').length}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed Tasks</p>
            <h3 className="text-2xl font-bold text-slate-800">
              {tasks.filter((t) => t.status === 'Done').length}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Burndown Progress</p>
            <h3 className="text-2xl font-bold text-slate-800">
              {totalHours > 0 ? Math.round((doneHours / totalHours) * 100) : 0}% <span className="text-[10px] text-slate-400 font-normal">({doneHours}/{totalHours} hrs)</span>
            </h3>
          </div>
        </div>

      </div>

      {/* Recharts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Status Distribution */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col h-80">
          <h4 className="font-bold text-slate-800 text-sm mb-4">Task Status Breakdown</h4>
          <div className="flex-1 min-h-0 relative flex items-center justify-center">
            {statusData.length === 0 ? (
              <p className="text-xs text-slate-400">No data available</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} tasks`]} />
                </PieChart>
              </ResponsiveContainer>
            )}
            
            {/* Center Legend */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-bold text-slate-700">{tasks.length}</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Tasks</span>
            </div>
          </div>

          <div className="flex justify-center gap-4 flex-wrap mt-2">
            {statusData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span>{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority distribution */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col h-80">
          <h4 className="font-bold text-slate-800 text-sm mb-4">Priority Breakdown</h4>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} margin={{ left: -25, right: 10, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Velocity (Area) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col h-80">
          <h4 className="font-bold text-slate-800 text-sm mb-4">Estimated Hours Roadmap</h4>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ left: -20, right: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="Hours" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorHours)" name="Estimated Hours" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Team Member Workload Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <h4 className="font-bold text-slate-800 text-sm mb-4">Team Workspace Workload</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider pb-2">
                <th className="pb-3">Team Member</th>
                <th className="pb-3">To Do</th>
                <th className="pb-3">In Progress</th>
                <th className="pb-3">Done</th>
                <th className="pb-3 text-right">Total Est. Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700">
              {workloadData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-400">
                    No active team workloads.
                  </td>
                </tr>
              ) : (
                workloadData.map((member) => (
                  <tr key={member.name} className="hover:bg-slate-50/50">
                    <td className="py-3.5 flex items-center gap-2">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-6 h-6 rounded-full border border-slate-100 object-cover"
                      />
                      <span className="font-semibold text-slate-800">{member.name}</span>
                    </td>
                    <td className="py-3.5 font-medium text-slate-500">{member.ToDo}</td>
                    <td className="py-3.5 font-semibold text-indigo-600">{member.InProgress}</td>
                    <td className="py-3.5 font-semibold text-emerald-600">{member.Done}</td>
                    <td className="py-3.5 font-bold text-slate-800 text-right">{member.Hours} hrs</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
