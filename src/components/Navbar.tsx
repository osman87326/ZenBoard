'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Menu, X, Kanban, Plus, LayoutDashboard, Settings, HelpCircle, PhoneCall, Info, LogOut, ChevronDown, Database } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

export default function Navbar() {
  const { user, isAuthenticated, logout, selectedWorkspace, setSelectedWorkspace, dbMode } = useApp();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const workspaces = ['All Workspaces', 'ZenBoard Platform', 'Mobile App', 'Marketing Launch'];

  const linkClass = (path: string) => {
    const base = 'text-sm font-medium transition-colors hover:text-indigo-600 ';
    return pathname === path 
      ? base + 'text-indigo-600 border-b-2 border-indigo-600 pb-1 mt-0.5' 
      : base + 'text-slate-600 hover:text-slate-900';
  };

  const mobileLinkClass = (path: string) => {
    const base = 'block px-3 py-2 rounded-xl text-base font-medium transition-colors ';
    return pathname === path
      ? base + 'bg-indigo-50 text-indigo-600 font-semibold'
      : base + 'text-slate-600 hover:bg-slate-50 hover:text-slate-950';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 shadow-md shadow-indigo-200">
                <Kanban className="h-5.5 w-5.5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Zen<span className="text-indigo-600">Board</span>
              </span>
            </Link>

            {/* Workspace Dropdown for Explore page */}
            {pathname === '/explore' && (
              <div className="relative hidden md:block">
                <div className="flex items-center gap-1 cursor-pointer rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors">
                  <span>{selectedWorkspace}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                  <select
                    value={selectedWorkspace}
                    onChange={(e) => setSelectedWorkspace(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  >
                    {workspaces.map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Database Mode Warning Badge */}
          {dbMode === 'local' && (
            <div className="hidden lg:flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-[11px] font-medium text-amber-800">
              <Database className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              Local DB Fallback Mode
            </div>
          )}

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className={linkClass('/')}>Home</Link>
            <Link href="/explore" className={linkClass('/explore')}>Explore Board</Link>
            
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
                <Link href="/items/add" className={linkClass('/items/add')}>Add Task</Link>
                <Link href="/items/manage" className={linkClass('/items/manage')}>Manage</Link>
              </>
            ) : null}

            <Link href="/about" className={linkClass('/about')}>About</Link>
            <Link href="/contact" className={linkClass('/contact')}>Contact</Link>
          </nav>

          {/* Right Action Bar */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                <NotificationDropdown />
                
                {/* User Profile Card */}
                <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 w-8 rounded-full border border-slate-200 bg-slate-50 object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-800 leading-none">{user.name}</span>
                    <span className="text-[10px] text-slate-500">{user.email}</span>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all focus:outline-none"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex h-9 items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 hover:shadow transition-all"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-3">
            {isAuthenticated && <NotificationDropdown />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-2 shadow-inner">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass('/')}>
            Home
          </Link>
          <Link href="/explore" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass('/explore')}>
            Explore Board
          </Link>

          {isAuthenticated ? (
            <>
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass('/dashboard')}>
                Dashboard
              </Link>
              <Link href="/items/add" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass('/items/add')}>
                Add Task
              </Link>
              <Link href="/items/manage" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass('/items/manage')}>
                Manage Tasks
              </Link>
            </>
          ) : null}

          <Link href="/about" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass('/about')}>
            About
          </Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass('/contact')}>
            Contact
          </Link>

          {dbMode === 'local' && (
            <div className="flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-100 px-3 py-2 text-xs font-medium text-amber-800">
              <Database className="w-3.5 h-3.5 text-amber-500" />
              Local DB Fallback Mode active
            </div>
          )}

          {isAuthenticated && user ? (
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-10 w-10 rounded-full border border-slate-200"
                />
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">{user.name}</h4>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-10 w-full items-center justify-center rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
