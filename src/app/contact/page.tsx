'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Toast from '@/components/Toast';
import { useApp } from '@/context/AppContext';
import { Mail, Phone, MapPin, Send, HelpCircle, AlertCircle, CheckCircle } from 'lucide-react';

export default function Contact() {
  const { showToast } = useApp();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Workspace Billing');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }
    setLoading(true);

    // Mock API call delay
    setTimeout(() => {
      setLoading(false);
      showToast(`Thanks ${name}! Your support ticket has been received.`, 'success');
      setName('');
      setEmail('');
      setMessage('');
    }, 1500);
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-slate-50/50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-xs">
              <Mail className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight sm:text-4xl">
              Support Center
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Have questions about database setups, workspace integrations, or team plan features? Reach out directly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Contact Card Details */}
            <div className="space-y-6">
              
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Write to Support</h4>
                  <p className="text-xs text-slate-450 mt-0.5">Tickets resolved within 12 hours</p>
                  <a href="mailto:support@zenboard.com" className="text-xs font-semibold text-indigo-600 hover:text-indigo-850 transition-colors block mt-2">
                    support@zenboard.com
                  </a>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Call Support</h4>
                  <p className="text-xs text-slate-450 mt-0.5">Monday to Friday • 9 AM - 6 PM EST</p>
                  <a href="tel:+15550199" className="text-xs font-semibold text-indigo-600 hover:text-indigo-855 transition-colors block mt-2">
                    +1 (555) 019-9000
                  </a>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Headquarters</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2">
                    100 Pine Street, Suite 1200<br />San Francisco, CA 94111
                  </p>
                </div>
              </div>

            </div>

            {/* Middle: Interactive Contact Form */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs lg:col-span-2 space-y-5">
              <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3">
                Send a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Topic Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-700 outline-none cursor-pointer focus:bg-white focus:border-indigo-500"
                  >
                    <option value="Workspace Billing">Workspace Billing & Plans</option>
                    <option value="MongoDB Connection Error">MongoDB connection assistance</option>
                    <option value="Feature Request">Board API Feature requests</option>
                    <option value="Other">Other general inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Detailed Message</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Draft your issue or request here..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-1.5 w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 text-xs font-semibold text-white shadow hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {loading ? 'Submitting support ticket...' : 'Submit Support Ticket'}
                </button>

              </form>
            </div>

          </div>

          {/* Location Map Placeholder Card */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-1.5">
              <MapPin className="w-4.5 h-4.5 text-indigo-600" />
              Office Map Location
            </h4>
            <div className="relative h-64 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 flex items-center justify-center">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1000')" }} />
              <div className="absolute inset-0 bg-slate-900/10" />
              <div className="relative z-10 rounded-2xl bg-white p-4 shadow-xl border max-w-xs text-center flex flex-col items-center">
                <MapPin className="w-8 h-8 text-indigo-600 mb-2" />
                <h5 className="font-bold text-slate-800 text-xs">ZenBoard Headquarters</h5>
                <p className="text-[10px] text-slate-400 mt-1">100 Pine Street, Suite 1200, San Francisco, CA</p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
      <Toast />
    </>
  );
}
