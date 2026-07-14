'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Target, Shield, Heart, Award, Users2, Kanban } from 'lucide-react';

export default function About() {
  const team = [
    {
      name: 'Sarah Jenkins',
      role: 'Principal Product Manager',
      bio: 'Ex-Atlassian PM. Sarah specializes in agile methodologies and developer productivity workflows.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    },
    {
      name: 'Alex Rivera',
      role: 'Core Systems Architect',
      bio: 'Alex is a systems developer focusing on Mongoose integration pipelines and responsive client layouts.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    },
    {
      name: 'Emma Watson',
      role: 'Lead UI/UX Architect',
      bio: 'Emma designs modern interfaces, micro-animations, and fluid drag-and-drop workspace interactions.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    },
  ];

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-slate-50/50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-xs">
              <Kanban className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight sm:text-4xl">
              About ZenBoard
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              We started ZenBoard to resolve a single frustration: project boards should be responsive, visual, and support lightning-fast developers.
            </p>
          </div>

          {/* Pillars Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs text-center space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mx-auto">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Agile Focus</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Streamlined Kanban columns designed for high-velocity software releases, keeping developers in full coding flow.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs text-center space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 mx-auto">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Dual Storage Integrity</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Flexible local file-based engines that migrate automatically to persistent MongoDB schemas in one second.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs text-center space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mx-auto">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Zero Bloat UX</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Buttery smooth visual drag-and-drop feedback, real-time Recharts statistics, and transparent data grids.
              </p>
            </div>

          </div>

          {/* Team Showcase */}
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-55 text-indigo-650 mx-auto">
                <Users2 className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Meet the Crew</h2>
              <p className="text-xs text-slate-500">
                The product managers, engineers, and designers collaborating behind ZenBoard.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member) => (
                <div key={member.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col items-center text-center space-y-4">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-20 h-20 rounded-full border-2 border-indigo-100 object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{member.name}</h4>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase">
                      {member.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
