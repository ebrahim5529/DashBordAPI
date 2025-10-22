/**
 * مكون TableSkeleton
 * يعرض هيكل تحميل للجداول
 */

import React from 'react';
import { cn } from '@/lib/utils';

// تعريف Props للمكون
interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

/**
 * مكون TableSkeleton
 * @param rows - عدد الصفوف
 * @param columns - عدد الأعمدة
 * @param className - أنماط إضافية
 */
export function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
}: TableSkeletonProps) {
  return (
    <div className={cn('w-full', className)}>
      {/* رأس الجدول */}
      <div className='flex space-x-4 rtl:space-x-reverse p-4 border-b border-gray-200 dark:border-gray-700'>
        {Array.from({ length: columns }).map((_, index) => (
          <div
            key={index}
            className='flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse'
          />
        ))}
      </div>

      {/* صفوف الجدول */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className='flex space-x-4 rtl:space-x-reverse p-4 border-b border-gray-100 dark:border-gray-800'
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className='flex-1 h-3 bg-gray-100 dark:bg-gray-800 rounded animate-pulse'
            />
          ))}
        </div>
      ))}
    </div>
  );
}
