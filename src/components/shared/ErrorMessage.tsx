/**
 * مكون Error Message لعرض رسائل الخطأ
 */

import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
  variant?: 'error' | 'warning' | 'info';
}

export function ErrorMessage({ 
  message, 
  onClose, 
  variant = 'error' 
}: ErrorMessageProps) {
  const variantStyles = {
    error: 'bg-red-50 border-red-400 text-red-800',
    warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
    info: 'bg-blue-50 border-blue-400 text-blue-800'
  };

  const iconColor = {
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400'
  };

  return (
    <div className={`flex items-start gap-3 p-4 border rounded-lg ${variantStyles[variant]}`}>
      <AlertCircle className={`w-5 h-5 flex-shrink-0 ${iconColor[variant]}`} />
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
