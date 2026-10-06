import React from 'react';
import { Search, Calendar, FolderOpen, ArrowRight } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  icon: Icon = FolderOpen,
  title = 'No Data Found',
  message = 'We couldn\'t find any records matching your criteria.',
  actionLabel,
  actionIcon: ActionIcon = ArrowRight,
  onAction,
  className = ''
}) => {
  return (
    <div
      className={`p-10 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4 max-w-lg mx-auto ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/5">
        <Icon className="w-7 h-7" />
      </div>

      <div className="space-y-1">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        {message && <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">{message}</p>}
      </div>

      {actionLabel && onAction && (
        <div className="pt-2 flex justify-center">
          <Button variant="primary" size="md" icon={ActionIcon} onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
