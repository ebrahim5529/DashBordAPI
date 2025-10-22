/**
 * مكون CardSkeleton
 * يعرض هيكل تحميل للبطاقات
 */

import React from 'react';
import { cn } from '@/lib/utils';

// تعريف Props للمكون
interface CardSkeletonProps {
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  lines?: number;
}

/**
 * مكون CardSkeleton
 * @param className - أنماط إضافية
 * @param showHeader - إظهار رأس البطاقة
 * @param showFooter - إظهار تذييل البطاقة
 * @param lines - عدد الأسطر في المحتوى
 */
export function CardSkeleton({
  className,
  showHeader = true,
  showFooter = false,
  lines = 3,
}: CardSkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-900',
        className
      )}
    >
      {/* رأس البطاقة */}
      {showHeader && (
        <div className='mb-4'>
          <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2' />
          <div className='h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-2/3' />
        </div>
      )}

      {/* محتوى البطاقة */}
      <div className='space-y-3'>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-3 bg-gray-100 dark:bg-gray-800 rounded animate-pulse',
              index === lines - 1 ? 'w-3/4' : 'w-full'
            )}
          />
        ))}
      </div>

      {/* تذييل البطاقة */}
      {showFooter && (
        <div className='mt-6 pt-4 border-t border-gray-200 dark:border-gray-700'>
          <div className='flex justify-between items-center'>
            <div className='h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-1/4' />
            <div className='h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20' />
          </div>
        </div>
      )}
    </div>
  );
}
