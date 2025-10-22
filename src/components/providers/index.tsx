/**
 * ملف تجميع جميع المزودين
 * يجمع جميع مزودي الحالة والسياق في مكان واحد
 */

import React from 'react';
import { AuthProvider } from './auth.provider';

// تعريف Props للمزود الرئيسي
interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * مزود رئيسي يجمع جميع المزودين
 * @param children - العناصر الفرعية
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>{children}</AuthProvider>
  );
}

// تصدير المزودين الفرديين للاستخدام المباشر
export { AuthProvider } from './auth.provider';

// تصدير الـ hooks
export { useAuth } from './auth.provider';
