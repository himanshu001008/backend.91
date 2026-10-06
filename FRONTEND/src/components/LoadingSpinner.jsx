import React from 'react';
import { Loader2, Dumbbell } from 'lucide-react';

const LoadingSpinner = ({
  size = 'md',
  text = 'Loading...',
  fullScreen = false,
  className = ''
}) => {
  const spinnerSizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const content = (
    <div className={`flex flex-col items-center justify-center p-6 space-y-3 ${className}`}>
      <div className="relative flex items-center justify-center">
        <div
          className={`${spinnerSizes[size] || spinnerSizes.md} rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin`}
        />
        <Dumbbell className="w-4 h-4 text-cyan-400 absolute animate-pulse" />
      </div>
      {text && (
        <p className="text-xs font-semibold tracking-wider uppercase text-slate-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
