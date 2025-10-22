import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/providers/auth.provider';

/**
 * Higher Order Component لحماية المسارات
 * يتحقق من حالة المصادقة قبل السماح بالوصول إلى المكون
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // عرض شاشة تحميل أثناء التحقق من المصادقة
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // إعادة التوجيه إلى صفحة تسجيل الدخول إذا لم يكن المستخدم مصادق عليه
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // عرض المكون المحمي إذا كان المستخدم مصادق عليه
  return <>{children}</>;
}

