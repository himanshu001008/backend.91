import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const toastVariants = {
  success: {
    bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    icon: CheckCircle2,
    iconColor: 'text-emerald-400'
  },
  error: {
    bg: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
    icon: AlertCircle,
    iconColor: 'text-rose-400'
  },
  warning: {
    bg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    icon: AlertTriangle,
    iconColor: 'text-amber-400'
  },
  info: {
    bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
    icon: Info,
    iconColor: 'text-cyan-400'
  }
};

const Toast = ({
  message,
  type = 'success',
  duration = 4000,
  onClose,
  className = ''
}) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  const variant = toastVariants[type] || toastVariants.success;
  const Icon = variant.icon;

  return (
    <div
      className={`p-4 rounded-2xl border ${variant.bg} shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 text-xs font-semibold animate-in slide-in-from-top-4 duration-300 ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <Icon className={`w-4 h-4 ${variant.iconColor} shrink-0`} />
        <span>{message}</span>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          title="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default Toast;
