/**
 * مكون "تطوير قريباً"
 * يعرض رسالة أن الصفحة قيد التطوير
 */

import React from 'react';

interface ComingSoonProps {
  title?: string;
  description?: string;
}

export function ComingSoon({
  title = 'تطوير قريباً',
  description = 'هذه الصفحة قيد التطوير وسيتم إطلاقها قريباً',
}: ComingSoonProps) {
  return (
    <div className='text-center py-12'>
      <div className='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-8 max-w-md mx-auto'>
        <div className='text-yellow-600 dark:text-yellow-400 text-6xl mb-6'>
          🚧
        </div>
        <h3 className='text-xl font-semibold text-yellow-800 dark:text-yellow-200 mb-3'>
          {title}
        </h3>
        <p className='text-yellow-700 dark:text-yellow-300'>{description}</p>
        <div className='mt-6'>
          <div className='flex justify-center space-x-2 rtl:space-x-reverse'>
            <div className='w-2 h-2 bg-yellow-400 rounded-full animate-pulse'></div>
            <div
              className='w-2 h-2 bg-yellow-400 rounded-full animate-pulse'
              style={{ animationDelay: '0.2s' }}
            ></div>
            <div
              className='w-2 h-2 bg-yellow-400 rounded-full animate-pulse'
              style={{ animationDelay: '0.4s' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
