/**
 * مكون Navbar للتصميم العام
 * شريط التنقل الرئيسي للتطبيق
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/shared/Button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  Home,
  Users,
  FileText,
  Settings,
  LogOut,
  Bell,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// تعريف عناصر القائمة
const navigationItems = [
  {
    name: 'الرئيسية',
    href: '/',
    icon: Home,
  },
  {
    name: 'لوحة التحكم',
    href: '/dashboard',
    icon: FileText,
  },
  {
    name: 'المستخدمين',
    href: '/users',
    icon: Users,
  },
  {
    name: 'الإعدادات',
    href: '/settings',
    icon: Settings,
  },
];

// تعريف Props للمكون
interface NavbarProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onLogout?: () => void;
}

/**
 * مكون Navbar
 * @param user - بيانات المستخدم الحالي
 * @param onLogout - دالة تسجيل الخروج
 */
export function Navbar({
  user,
  onLogout,
}: NavbarProps) {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <nav className='bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8'>
        <div className='flex justify-between items-center h-14 sm:h-16'>
          {/* الشعار */}
          <div className='flex items-center'>
            <Link
              to='/'
              className='flex items-center space-x-2 rtl:space-x-reverse'
            >
              <div className='w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-sm sm:text-lg'>أ</span>
              </div>
              <span className='text-lg sm:text-xl font-bold text-gray-900 dark:text-white'>
                أسهل
              </span>
            </Link>
          </div>

          {/* عناصر التنقل - سطح المكتب */}
          <div className='hidden lg:flex items-center space-x-8 rtl:space-x-reverse'>
            {navigationItems.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  <Icon className='w-4 h-4' />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* أزرار الإجراءات */}
          <div className='flex items-center space-x-1 sm:space-x-2 md:space-x-4 rtl:space-x-reverse'>
            {/* زر البحث */}
            <Button variant='ghost' size='icon' className='hidden sm:flex h-8 w-8 sm:h-9 sm:w-9'>
              <Search className='w-4 h-4' />
            </Button>

            {/* زر الإشعارات */}
            <Button variant='ghost' size='icon' className='relative h-8 w-8 sm:h-9 sm:w-9'>
              <Bell className='w-4 h-4' />
              <span className='absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center'>
                3
              </span>
            </Button>

            {/* زر تبديل الثيم */}
            <div className='scale-90 sm:scale-100'>
              <ThemeToggle />
            </div>

            {/* معلومات المستخدم */}
            {user && (
              <div className='flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse'>
                <div className='text-right hidden sm:block'>
                  <p className='text-sm font-medium text-gray-900 dark:text-white'>
                    {user.name}
                  </p>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>
                    {user.email}
                  </p>
                </div>
                <div className='w-7 h-7 sm:w-8 sm:h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center'>
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className='w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover'
                    />
                  ) : (
                    <span className='text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300'>
                      {user.name.charAt(0)}
                    </span>
                  )}
                </div>
                {onLogout && (
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={onLogout}
                    title='تسجيل الخروج'
                    className='h-8 w-8 sm:h-9 sm:w-9 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200'
                  >
                    <LogOut className='w-4 h-4' />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
