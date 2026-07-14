'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Toast from '@/components/Toast';
import { useApp } from '@/context/AppContext';
import { Kanban, Sparkles, Layers, Users, Zap, CheckCircle, ChevronDown, MessageSquare, ShieldAlert, BarChart3, CheckCircle2, Star, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, Tooltip } from 'recharts';

export default function Home() {
  const { isAuthenticated, user } = useApp();
  
  // LANDING PAGE INTERACTIVE 1: MOCK HERO KANBAN DRAG AND DROP
  const [heroTasks, setHeroTasks] = useState([
    { id: 'h1', title: 'Stripe Gateway setup', status: 'To Do', category: 'Backend' },
    { id: 'h2', title: 'Polish Dashboard UI', status: 'In Progress', category: 'Design' },
    { id: 'h3', title: 'OAuth integration', status: 'Done', category: 'Security' },
  ]);
  const [draggedHeroId, setDraggedHeroId] = useState<string | null>(null);
  const [heroDragOverCol, setHeroDragOverCol] = useState<string | null>(null);

  const heroColumns = ['To Do', 'In Progress', 'Done'];

  const handleHeroDragStart = (e: React.DragEvent, id: string) => {
    setDraggedHeroId(id);
    e.dataTransfer.setData('text/plain', id);
  };

  const handleHeroDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedHeroId;
    if (id) {
      setHeroTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status } : t))
      );
    }
    setHeroDragOverCol(null);
    setDraggedHeroId(null);
  };

  // LANDING PAGE INTERACTIVE 2: FAQ ACCORDION STATE
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const faqs = [
    {
      q: 'Is ZenBoard suitable for solo developers or team spaces?',
      a: 'Absolutely. ZenBoard offers customizable workspace isolation. You can use it as a personal board or invite team members to share boards, assign tasks, and track joint analytics.',
    },
    {
      q: 'Does it support database connectivity out of the box?',
      a: 'Yes, ZenBoard features a dual-mode database engine. It runs on a local JSON file structure for zero-setup local previews, and connects instantly to MongoDB Atlas when you supply the connection string.',
    },
    {
      q: 'How does the task due date notification system work?',
      a: 'The notification service automatically tracks assignment changes, comments, and task updates. Assignees receive context-specific notifications immediately upon updates.',
    },
    {
      q: 'Can I visualize my team workload and sprint progress?',
      a: 'Yes, our Analytics Dashboard uses Recharts to graph status distributions, priorities, and roadmap timelines, helping you run agile retrospectives.',
    },
  ];

  // LANDING PAGE INTERACTIVE 3: TESTIMONIALS CAROUSEL STATE
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonials = [
    {
      name: 'Marcus Vance',
      role: 'Lead Architect @ Vercel',
      quote: 'ZenBoard is incredibly fast. The drag-and-drop feels buttery smooth, and having real-time workspace metrics makes scheduling releases very simple.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
      stars: 5,
    },
    {
      name: 'Clara Chen',
      role: 'Product Director @ Stripe',
      quote: 'We replaced our bloated Jira workspace with ZenBoard. Our engineers love the simplified Kanban board and clean, distraction-free interface.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
      stars: 5,
    },
    {
      name: 'Liam Henderson',
      role: 'Co-Founder @ DevFlow',
      quote: 'The dual-mode database capability is genius. I set it up locally in seconds, and deployed it on MongoDB Atlas with one env variable. 10/10.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120',
      stars: 5,
    },
  ];

  // MINI CHART FOR STATISTICS SECTION
  const miniChartData = [
    { name: 'To Do', value: 3, fill: '#94a3b8' },
    { name: 'In Progress', value: 5, fill: '#4f46e5' },
    { name: 'Review', value: 2, fill: '#8b5cf6' },
    { name: 'Done', value: 8, fill: '#10b981' },
  ];

  return (
    <>
      <Navbar />

      <main className="flex-1">
        
        {/* SECTION 1: HERO SECTION (60-70% height limited) */}
        <section className="relative overflow-hidden bg-slate-900 text-white min-h-[60vh] flex items-center py-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(79,70,229,0.15),transparent_50%)]" />
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Column: CTA */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 px-3.5 py-1 text-xs font-semibold text-indigo-400">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  ZenBoard Sprint v2.0 Released
                </div>
                <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none">
                  Plan Projects.<br />
                  Track Tasks.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                    Ship Products.
                  </span>
                </h1>
                <p className="text-slate-400 text-sm max-w-md leading-relaxed">
                  A high-fidelity developer cockpit replacing clunky task boards. Built with Next.js, TypeScript, and MongoDB for agile engineering workflows.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    href={isAuthenticated ? '/dashboard' : '/login'}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 hover:scale-102 transition-all shadow-md shadow-indigo-600/20"
                  >
                    Start Free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/explore"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800/40 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
                  >
                    Live Preview
                  </Link>
                </div>
              </div>

              {/* Right Column: Interactive Mock Kanban */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-2xl glass relative">
                <div className="absolute -top-3 -right-3 rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-bold tracking-wider uppercase shadow">
                  Drag Me!
                </div>
                <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2.5">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-widest pl-2">
                    interactive Sandbox
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3.5">
                  {heroColumns.map((col) => {
                    const colTasks = heroTasks.filter((t) => t.status === col);
                    const isOver = heroDragOverCol === col;

                    return (
                      <div
                        key={col}
                        onDragOver={(e) => { e.preventDefault(); setHeroDragOverCol(col); }}
                        onDragLeave={() => setHeroDragOverCol(null)}
                        onDrop={(e) => handleHeroDrop(e, col)}
                        className={`rounded-xl p-2 min-h-36 border transition-all duration-200 ${
                          isOver 
                            ? 'border-indigo-500 bg-indigo-500/5' 
                            : 'border-slate-800 bg-slate-950/30'
                        }`}
                      >
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2 px-1">
                          {col} ({colTasks.length})
                        </h4>
                        
                        <div className="space-y-2">
                          {colTasks.map((t) => (
                            <div
                              key={t.id}
                              draggable
                              onDragStart={(e) => handleHeroDragStart(e, t.id)}
                              className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-xs shadow-md cursor-grab active:cursor-grabbing hover:border-slate-700 transition-colors"
                            >
                              <span className="text-[8px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded-full mb-1 inline-block">
                                {t.category}
                              </span>
                              <p className="font-semibold text-slate-200 line-clamp-1">{t.title}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 2: CAPABILITIES / FEATURES */}
        <section className="py-20 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight sm:text-4xl">
                Built for High-Velocity Engineering
              </h2>
              <p className="text-sm text-slate-500">
                ZenBoard drops the configuration complexity to let you concentrate on writing clean software features.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-5">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-2">Isolated Workspaces</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Segregate your platform engineering, design mockups, and client-facing landing work with separate workspace filters and distinct boards.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600 mb-5">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-2">Team Sync-Up</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Assign tasks, review assignee queues, and notify developers instantly when cards move, comments land, or deadlines approach.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-5">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-2">Dual-Mode persistence</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Runs instantly with zero local dependencies using local file structures, and bridges seamlessly to persistent cloud MongoDB.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 3: PRODUCTIVITY METRICS (Dashboard Preview & Chart) */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Column: Recharts rendering */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-md flex flex-col h-80">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-slate-800 text-sm">Sprint Task Metrics</h4>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white border px-2 py-0.5 rounded-full">
                    simulated analytics
                  </span>
                </div>
                
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={miniChartData} margin={{ left: -30, right: 10, bottom: 5 }}>
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {miniChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right Column: Value Pitch */}
              <div className="space-y-6">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight sm:text-4xl">
                  Workload Insights in Real-Time
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Stop guessing release timelines. Get instant analytics on task distribution, burndown metrics, and workload caps per team member. Fully populated inside your account dashboard.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-800 text-xs">Recharts Graphs</h4>
                      <p className="text-[10px] text-slate-400">Clear bar and pie diagrams</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-800 text-xs">Workload Matrix</h4>
                      <p className="text-[10px] text-slate-400">Track tasks per team member</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 4: HOW IT WORKS */}
        <section className="py-20 bg-slate-50 border-y border-slate-200/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight sm:text-4xl">
                Three Steps to Sprint Setup
              </h2>
              <p className="text-sm text-slate-500">
                Plan, assign, and organize. We stripped out the administrative friction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="flex flex-col items-center text-center p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-700 mb-4 shadow">
                  1
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-1.5">Configure Workspace</h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                  Create isolated project boards for separate development branches or client delivery schedules.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 font-bold text-white mb-4 shadow-lg shadow-indigo-600/20">
                  2
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-1.5">Populate Backlog</h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                  Draft tasks with descriptions, priority levels, estimated hours, and visual attachments.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-700 mb-4 shadow">
                  3
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-1.5">Drag to Deliver</h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                  Drag cards from To Do to In Progress, Review, and Done. Team members receive auto-notifications.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 5: TEAM COLLABORATION PREVIEW */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Column: Text */}
              <div className="space-y-6">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight sm:text-4xl">
                  Conversations and Alerts in Context
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Ditch Slack threads for planning discussion. Comment directly on task tickets, update statuses on the fly, and receive specific alerts in the notifications hub immediately.
                </p>
                <div className="border-l-4 border-indigo-500 pl-4 py-2 bg-slate-50/50 rounded-r-xl">
                  <p className="text-xs italic text-slate-600 font-medium">
                    "Assigning a task generates an instant alert for the assignee, keeping the team updated automatically."
                  </p>
                </div>
              </div>

              {/* Right Column: Graphic mockup */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-lg space-y-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex items-start gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
                    alt="Sarah"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-800">Sarah Jenkins (PM)</span>
                      <span className="text-[10px] text-slate-400">10m ago</span>
                    </div>
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      We need to verify the webhook signatures in the Stripe integration API routes.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex items-start gap-3 ml-8">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
                    alt="Alex"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-800">Alex Rivera (Dev)</span>
                      <span className="text-[10px] text-slate-400">5m ago</span>
                    </div>
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      Done. Signature validation matches the stripe secret key now.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 6: CLIENT TESTIMONIALS */}
        <section className="py-20 bg-slate-50 border-t border-slate-200/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight sm:text-4xl">
                What Teams Say
              </h2>
              <p className="text-sm text-slate-500">
                ZenBoard powers high-velocity product launches across startup workspaces.
              </p>
            </div>

            {/* Testimonials Showcase */}
            <div className="max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-center space-y-6">
              <div className="flex justify-center gap-1">
                {Array.from({ length: testimonials[activeTestimonial].stars }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 stroke-amber-400" />
                ))}
              </div>

              <blockquote className="text-slate-700 font-medium text-base sm:text-lg leading-relaxed">
                "{testimonials[activeTestimonial].quote}"
              </blockquote>

              <div className="flex flex-col items-center gap-2">
                <img
                  src={testimonials[activeTestimonial].avatar}
                  alt={testimonials[activeTestimonial].name}
                  className="w-12 h-12 rounded-full border-2 border-indigo-100 object-cover"
                />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{testimonials[activeTestimonial].name}</h4>
                  <p className="text-xs text-slate-400">{testimonials[activeTestimonial].role}</p>
                </div>
              </div>

              {/* Navigation Indicators */}
              <div className="flex justify-center gap-2 mt-4">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      activeTestimonial === i ? 'w-6 bg-indigo-600' : 'w-2.5 bg-slate-200 hover:bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 7: FAQ SECTION (Accordion) */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-3">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight sm:text-4xl">
                FAQ Center
              </h2>
              <p className="text-sm text-slate-500">
                Answers to common inquiries regarding board features and deployment configurations.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => {
                const isOpen = openFaq === i;

                return (
                  <div
                    key={i}
                    className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all duration-300"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 hover:bg-slate-50/50 transition-colors"
                    >
                      <span className="text-sm">{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="p-5 pt-0 border-t border-slate-100 text-xs text-slate-500 leading-relaxed bg-slate-50/40">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <Toast />
    </>
  );
}
