'use client';

import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="w-full flex flex-col h-[320px] rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Cover Image Shimmer */}
      <div className="w-full h-32 rounded-lg animate-skeleton mb-4" />
      
      {/* Category / Workspace Shimmer */}
      <div className="w-24 h-4 rounded animate-skeleton mb-2" />
      
      {/* Title Shimmer */}
      <div className="w-3/4 h-5 rounded animate-skeleton mb-2" />
      
      {/* Description Shimmer */}
      <div className="w-full h-3 rounded animate-skeleton mb-1.5" />
      <div className="w-5/6 h-3 rounded animate-skeleton mb-4" />

      {/* Footer Info Shimmer */}
      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full animate-skeleton" />
          <div className="w-16 h-3 rounded animate-skeleton" />
        </div>
        <div className="w-14 h-4 rounded animate-skeleton" />
      </div>
    </div>
  );
}
