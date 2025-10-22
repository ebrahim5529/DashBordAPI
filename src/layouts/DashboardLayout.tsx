/**
 * Layout خاص بمسار Dashboard
 * يوفر تصميم خاص لصفحات لوحة التحكم
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/components/providers/auth.provider';

/**
 * Layout خاص بمسار Dashboard
 */
export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  // تتبع التنقل لعرض progress bar
  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 150);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // تحسين: دالة محسنة لإدارة الشريط الجانبي
  const handleToggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  // حماية الصفحات - التحقق من حالة المصادقة
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

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

  // عدم عرض المحتوى إذا لم يكن المستخدم مسجل
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      {/* Progress bar عند التنقل */}
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 z-50 animate-pulse">
          <div className="h-full bg-blue-400 progress-bar-animate"></div>
        </div>
      )}
      
      <div className='flex flex-col lg:flex-row'>
        {/* الشريط الجانبي المحسن */}
        {isSidebarOpen && (
          <Sidebar
            onClose={handleCloseSidebar}
          />
        )}

        {/* المحتوى الرئيسي المحسن */}
        <div className='flex-1 flex flex-col min-w-0 lg:min-h-screen'>
          {/* الرأس المحسن */}
          <Header
            onToggleSidebar={handleToggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />

          {/* المحتوى المحسن */}
          <main className='flex-1 p-3 sm:p-4 lg:p-6 xl:p-8 overflow-x-auto'>
            <div className='max-w-full'>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

