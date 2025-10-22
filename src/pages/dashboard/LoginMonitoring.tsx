/**
 * صفحة مراقبة تسجيل الدخول
 * مراقبة وتتبع محاولات تسجيل الدخول
 */

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import {
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MapPin,
  Clock,
} from 'lucide-react';

// بيانات وهمية لمراقبة تسجيل الدخول
const loginAttempts = [
  {
    id: '1',
    user: 'أحمد محمد',
    email: 'ahmed@company.com',
    timestamp: '2024-01-15 10:30:25',
    ip: '192.168.1.100',
    location: 'الرياض، السعودية',
    device: 'Chrome - Windows 10',
    status: 'success',
    type: 'normal',
  },
  {
    id: '2',
    user: 'فاطمة علي',
    email: 'fatima@company.com',
    timestamp: '2024-01-15 10:25:15',
    ip: '192.168.1.101',
    location: 'جدة، السعودية',
    device: 'Safari - macOS',
    status: 'success',
    type: 'normal',
  },
  {
    id: '3',
    user: 'مجهول',
    email: 'unknown@example.com',
    timestamp: '2024-01-15 10:20:45',
    ip: '203.0.113.1',
    location: 'خارج المملكة',
    device: 'Firefox - Linux',
    status: 'failed',
    type: 'suspicious',
  },
  {
    id: '4',
    user: 'محمد السعد',
    email: 'mohammed@company.com',
    timestamp: '2024-01-15 10:15:30',
    ip: '192.168.1.102',
    location: 'الدمام، السعودية',
    device: 'Edge - Windows 11',
    status: 'success',
    type: 'normal',
  },
  {
    id: '5',
    user: 'مجهول',
    email: 'admin@company.com',
    timestamp: '2024-01-15 10:10:20',
    ip: '198.51.100.1',
    location: 'خارج المملكة',
    device: 'Chrome - Android',
    status: 'failed',
    type: 'attack',
  },
];

const loginStats = [
  {
    title: 'محاولات اليوم',
    value: '45',
    change: '+8%',
    icon: Activity,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
  },
  {
    title: 'تسجيلات ناجحة',
    value: '42',
    change: '+12%',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
  },
  {
    title: 'محاولات فاشلة',
    value: '3',
    change: '-2',
    icon: XCircle,
    color: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
  },
  {
    title: 'تنبيهات أمان',
    value: '2',
    change: '+1',
    icon: AlertTriangle,
    color:
      'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300',
  },
];

export default function LoginMonitoringPage() {
  return (
    <div className='space-y-6'>
      {/* عنوان الصفحة */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            مراقبة تسجيل الدخول
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-1'>
            مراقبة وتتبع محاولات تسجيل الدخول
          </p>
        </div>
        <Button className='flex items-center space-x-2 rtl:space-x-reverse'>
          <Shield className='h-4 w-4' />
          <span>إعدادات المراقبة</span>
        </Button>
      </div>

      {/* إحصائيات سريعة */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        {loginStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className='h-5 w-5' />
                </div>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-gray-900 dark:text-white'>
                  {stat.value}
                </div>
                <p className='text-xs text-muted-foreground'>
                  {stat.change} من الأمس
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* تنبيهات الأمان */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2 rtl:space-x-reverse'>
            <AlertTriangle className='h-5 w-5 text-yellow-500' />
            <span>تنبيهات الأمان</span>
          </CardTitle>
          <CardDescription>
            التنبيهات التي تحتاج إلى انتباه فوري
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex items-center space-x-3 rtl:space-x-reverse p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
              <XCircle className='h-5 w-5 text-red-600' />
              <div>
                <p className='text-sm font-medium text-red-800 dark:text-red-200'>
                  محاولة هجوم محتملة
                </p>
                <p className='text-xs text-red-600 dark:text-red-400'>
                  IP: 198.51.100.1 - منذ 10 دقائق
                </p>
              </div>
            </div>

            <div className='flex items-center space-x-3 rtl:space-x-reverse p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg'>
              <AlertTriangle className='h-5 w-5 text-yellow-600' />
              <div>
                <p className='text-sm font-medium text-yellow-800 dark:text-yellow-200'>
                  تسجيل دخول مشبوه
                </p>
                <p className='text-xs text-yellow-600 dark:text-yellow-400'>
                  IP: 203.0.113.1 - منذ 15 دقيقة
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* جدول محاولات تسجيل الدخول */}
      <Card>
        <CardHeader>
          <CardTitle>محاولات تسجيل الدخول</CardTitle>
          <CardDescription>جميع محاولات تسجيل الدخول المسجلة</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {loginAttempts.map(attempt => (
              <div
                key={attempt.id}
                className='flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
              >
                <div className='flex items-center space-x-4 rtl:space-x-reverse'>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      attempt.status === 'success'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                  />
                  <div>
                    <h3 className='font-semibold text-gray-900 dark:text-white'>
                      {attempt.user}
                    </h3>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      {attempt.email}
                    </p>
                    <div className='flex items-center space-x-4 rtl:space-x-reverse mt-1'>
                      <div className='flex items-center space-x-1 rtl:space-x-reverse'>
                        <MapPin className='h-3 w-3 text-gray-400' />
                        <span className='text-xs text-gray-500'>
                          {attempt.location}
                        </span>
                      </div>
                      <div className='flex items-center space-x-1 rtl:space-x-reverse'>
                        <Clock className='h-3 w-3 text-gray-400' />
                        <span className='text-xs text-gray-500'>
                          {attempt.timestamp}
                        </span>
                      </div>
                    </div>
                    <p className='text-xs text-gray-500 mt-1'>
                      {attempt.device} • {attempt.ip}
                    </p>
                  </div>
                </div>
                <div className='flex items-center space-x-2 rtl:space-x-reverse'>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      attempt.status === 'success'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    {attempt.status === 'success' ? 'نجح' : 'فشل'}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      attempt.type === 'normal'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : attempt.type === 'suspicious'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    {attempt.type === 'normal'
                      ? 'عادي'
                      : attempt.type === 'suspicious'
                        ? 'مشبوه'
                        : 'هجوم'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* تحميل المزيد */}
          <div className='mt-6 text-center'>
            <Button variant='outline'>تحميل المزيد</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

