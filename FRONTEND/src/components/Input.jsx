import React, { forwardRef } from 'react';

const Input = forwardRef(
  (
    {
      label,
      error,
      icon: Icon,
      rightElement,
      type = 'text',
      helperText,
      required = false,
      className = '',
      inputClassName = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={`space-y-1.5 w-full ${className}`}>
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            {label} {required && <span className="text-rose-400">*</span>}
          </label>
        )}

        <div className="relative rounded-xl shadow-sm">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Icon className="w-4 h-4" />
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            required={required}
            className={`w-full bg-slate-900/90 text-slate-100 placeholder-slate-500 text-sm rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
              Icon ? 'pl-10' : 'pl-4'
            } ${rightElement ? 'pr-10' : 'pr-4'} py-2.5 ${
              error
                ? 'border-rose-500/80 focus:border-rose-500 text-rose-200'
                : 'border-slate-800 focus:border-cyan-500'
            } ${inputClassName}`}
            {...props}
          />

          {rightElement && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {rightElement}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-xs text-rose-400 font-medium flex items-center gap-1 mt-1">
            <span>•</span> {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-slate-500 mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
