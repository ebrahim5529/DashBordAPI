/**
 * مكون SafeDate لتجنب مشاكل التهيئة (Hydration) في التواريخ
 */

'use client';

import React, { useState, useEffect } from 'react';
import { formatDateOnlySafe, formatDateTimeSafe, formatDateWithDaySafe } from '@/lib/utils/dateFormatter';

interface SafeDateProps {
  date: Date | string;
  format?: 'date' | 'datetime' | 'withDay';
  className?: string;
  fallback?: string;
}

/**
 * مكون SafeDate - يعرض التاريخ بشكل آمن بدون مشاكل التهيئة
 */
export function SafeDate({ 
  date, 
  format = 'date', 
  className = '', 
  fallback = 'تاريخ غير متاح' 
}: SafeDateProps) {
  const [isClient, setIsClient] = useState(false);
  const [formattedDate, setFormattedDate] = useState(fallback);

  useEffect(() => {
    setIsClient(true);
    
    try {
      let formatted: string;
      
      switch (format) {
        case 'datetime':
          formatted = formatDateTimeSafe(date);
          break;
        case 'withDay':
          formatted = formatDateWithDaySafe(date);
          break;
        case 'date':
        default:
          formatted = formatDateOnlySafe(date);
          break;
      }
      
      setFormattedDate(formatted);
    } catch (error) {
      console.error('خطأ في تنسيق التاريخ:', error);
      setFormattedDate(fallback);
    }
  }, [date, format, fallback]);

  // عرض placeholder أثناء التحميل لتجنب اختلاف المحتوى
  if (!isClient) {
    return <span className={className}>{fallback}</span>;
  }

  return <span className={className}>{formattedDate}</span>;
}

/**
 * مكون SafeDateTime - يعرض التاريخ والوقت بشكل آمن
 */
export function SafeDateTime({ 
  date, 
  className = '', 
  fallback = 'تاريخ غير متاح' 
}: Omit<SafeDateProps, 'format'>) {
  return <SafeDate date={date} format="datetime" className={className} fallback={fallback} />;
}

/**
 * مكون SafeDateWithDay - يعرض التاريخ مع اليوم بشكل آمن
 */
export function SafeDateWithDay({ 
  date, 
  className = '', 
  fallback = 'تاريخ غير متاح' 
}: Omit<SafeDateProps, 'format'>) {
  return <SafeDate date={date} format="withDay" className={className} fallback={fallback} />;
}

export default SafeDate;
