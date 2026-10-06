import React from 'react';

const SkeletonLoader = ({ type = 'card', count = 1, className = '' }) => {
  const renderSkeleton = (index) => {
    if (type === 'card') {
      return (
        <div
          key={index}
          className={`rounded-3xl border border-slate-800/80 bg-slate-900/40 p-5 space-y-4 animate-pulse ${className}`}
        >
          <div className="h-44 bg-slate-800/60 rounded-2xl w-full" />
          <div className="space-y-2">
            <div className="h-5 bg-slate-800/80 rounded-lg w-3/4" />
            <div className="h-4 bg-slate-800/50 rounded-lg w-1/2" />
          </div>
          <div className="pt-3 border-t border-slate-800/60 flex justify-between items-center">
            <div className="h-5 bg-slate-800/60 rounded-full w-24" />
            <div className="h-9 bg-slate-800/80 rounded-xl w-28" />
          </div>
        </div>
      );
    }

    if (type === 'list') {
      return (
        <div
          key={index}
          className={`p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 flex items-center justify-between gap-4 animate-pulse ${className}`}
        >
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-xl bg-slate-800/60 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-slate-800/80 rounded-lg w-1/3" />
              <div className="h-3 bg-slate-800/50 rounded-lg w-1/2" />
            </div>
          </div>
          <div className="h-8 bg-slate-800/60 rounded-xl w-24 shrink-0" />
        </div>
      );
    }

    if (type === 'detail') {
      return (
        <div key={index} className={`space-y-6 animate-pulse ${className}`}>
          <div className="h-72 sm:h-96 bg-slate-800/60 rounded-3xl w-full" />
          <div className="space-y-3">
            <div className="h-8 bg-slate-800/80 rounded-xl w-2/3" />
            <div className="h-4 bg-slate-800/50 rounded-lg w-full" />
            <div className="h-4 bg-slate-800/50 rounded-lg w-4/5" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-20 bg-slate-800/60 rounded-2xl" />
            <div className="h-20 bg-slate-800/60 rounded-2xl" />
            <div className="h-20 bg-slate-800/60 rounded-2xl" />
            <div className="h-20 bg-slate-800/60 rounded-2xl" />
          </div>
        </div>
      );
    }

    return (
      <div key={index} className={`h-4 bg-slate-800/60 rounded-lg animate-pulse w-full ${className}`} />
    );
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => renderSkeleton(i))}
    </>
  );
};

export default SkeletonLoader;
