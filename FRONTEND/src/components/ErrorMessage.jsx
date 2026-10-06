import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

/**
 * Sanitizes technical error strings to prevent exposing internal database/stack trace details to users
 */
const sanitizeErrorMessage = (msg) => {
  if (!msg) return 'An unexpected system error occurred. Please try again.';
  if (typeof msg !== 'string') {
    msg = msg.message || 'An unexpected error occurred.';
  }
  // Strip stack traces or mongo internal strings
  if (msg.includes('Cast to ObjectId') || msg.includes('MongoError') || msg.includes('at ')) {
    return 'Invalid parameter format or database request.';
  }
  if (msg.includes('Network Error') || msg.includes('ECONNREFUSED')) {
    return 'Could not connect to the backend server. Please verify your connection.';
  }
  return msg;
};

const ErrorMessage = ({
  title = 'An Error Occurred',
  message,
  onRetry,
  className = ''
}) => {
  const cleanMessage = sanitizeErrorMessage(message);

  return (
    <div
      className={`p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 space-y-3 ${className}`}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div className="flex-1 space-y-1">
          <h4 className="text-sm font-bold text-rose-200">{title}</h4>
          <p className="text-xs text-rose-300/80 leading-relaxed">{cleanMessage}</p>
        </div>
      </div>

      {onRetry && (
        <div className="pt-1 flex justify-end">
          <Button variant="danger" size="sm" icon={RefreshCw} onClick={onRetry}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default ErrorMessage;
