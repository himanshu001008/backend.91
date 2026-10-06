import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const Modal = ({
  isOpen = false,
  onClose,
  title,
  children,
  primaryAction,
  primaryActionLabel = 'Confirm',
  secondaryActionLabel = 'Cancel',
  isLoading = false,
  size = 'md'
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className={`relative w-full ${sizes[size] || sizes.md} bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-4">
          {children}
        </div>

        {/* Footer Actions */}
        {(primaryAction || onClose) && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-950/50 border-t border-slate-800">
            {onClose && (
              <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
                {secondaryActionLabel}
              </Button>
            )}
            {primaryAction && (
              <Button
                variant="primary"
                size="sm"
                onClick={primaryAction}
                isLoading={isLoading}
              >
                {primaryActionLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
