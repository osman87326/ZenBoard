'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Kanban, Send, GitBranch, ExternalLink, Globe, Mail, MapPin, Phone } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Footer() {
  const { showToast } = useApp();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    showToast(`Thanks for subscribing! Newsletter sent to ${email}`, 'success');
    setEmail('');
  };

  return (
    <footer className="w-full border-t border-slate-200 bg-slate-900 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Pitch */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500 shadow-lg shadow-indigo-500/30">
                <Kanban className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Zen<span className="text-indigo-400">Board</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-xs">
              A premium, streamlined project management workspace designed to help software development teams focus, plan, and ship faster.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub"
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
              >
                <GitBranch className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="LinkedIn"
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Twitter"
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-sm tracking-wider uppercase mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home Landing</Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-white transition-colors">Kanban Board</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Get Support</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-semibold text-white text-sm tracking-wider uppercase mb-4">Support Hub</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4.5 h-4.5 text-indigo-400" />
                <a href="mailto:support@zenboard.com" className="hover:text-white transition-colors">support@zenboard.com</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4.5 h-4.5 text-indigo-400" />
                <a href="tel:+15550199" className="hover:text-white transition-colors">+1 (555) 019-9000</a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4.5 h-4.5 text-indigo-400 mt-0.5" />
                <span>100 Pine Street, Suite 1200<br />San Francisco, CA 94111</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div>
            <h4 className="font-semibold text-white text-sm tracking-wider uppercase mb-4">Newsletter</h4>
            <p className="text-xs text-slate-400 mb-3">
              Subscribe to get release updates and scrum productivity guides.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="flex items-center justify-center p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow shadow-indigo-600/30 transition-all"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-12 pt-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} ZenBoard Technologies Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link href="/about" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
