/**
 * صفحة سجل التدقيق
 * عرض وتتبع جميع أنشطة النظام
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
  History,
  Search,
  Filter,
  Download,
  Eye,
  User,
  Clock,
  Shield,
} from 'lucide-react';

// بيانات وهمية لسجل التدقيق
const auditLogs = [
  {
    id: '1',
    action: 'تسجيل دخول',
    user: 'أحمد محمد',
    timestamp: '2024-01-15 10:30:25',
    ip: '192.168.1.100',
    status: 'success',
    details: 'تسجيل دخول ناجح من المتصفح Chrome',
  },
  {
    id: '2',
    action: 'إنشاء عقد',
    user: 'فاطمة علي',
    timestamp: '2024-01-15 10:25:15',
    ip: '192.168.1.101',
    status: 'success',
    details: 'تم إنشاء عقد جديد رقم CON-2024-001',
  },
  {
    id: '3',
    action: 'تحديث بيانات عميل',
    user: 'محمد السعد',
    timestamp: '2024-01-15 10:20:45',
    ip: '192.168.1.102',
    status: 'success',
    details: 'تم تحديث بيانات شركة البناء الحديثة',
  },
  {
    id: '4',
    action: 'محاولة تسجيل دخول',
    user: 'مجهول',
    timestamp: '2024-01-15 10:15:30',
    ip: '203.0.113.1',
    status: 'failed',
    details: 'محاولة تسجيل دخول فاشلة - كلمة مرور خاطئة',
  },
  {
    id: '5',
    action: 'حذف سجل',
    user: 'سارة أحمد',
    timestamp: '2024-01-15 10:10:20',
    ip: '192.168.1.103',
    status: 'success',
    details: 'تم حذف سجل مخزون منتهي الصلاحية',
  },
  {
    id: '6',
    action: 'تصدير تقرير',
    user: 'خالد عبدالله',
    timestamp: '2024-01-15 10:05:10',
    ip: '192.168.1.104',
    status: 'success',
    details: 'تم تصدير تقرير المبيعات الشهري',
  },
];

const auditStats = [
  {
    title: 'إجمالي الأنشطة',
    value: '1,245',
    change: '+12%',
    icon: History,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
  },
  {
    title: 'المستخدمون النشطون',
    value: '28',
    change: '+5%',
    icon: User,
    color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
  },
  {
    title: 'الأنشطة اليوم',
    value: '156',
    change: '+8%',
    icon: Clock,
    color:
      'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300',
  },
  {
    title: 'تنبيهات الأمان',
    value: '3',
    change: '-2',
    icon: Shield,
    color: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
  },
];

export default function AuditTrailPage() {
  return (
    <div className='space-y-6'>
      {/* عنوان الصفحة */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            سجل التدقيق
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-1'>
            عرض وتتبع جميع أنشطة النظام
          </p>
        </div>
        <div className='flex items-center space-x-2 rtl:space-x-reverse'>
          <Button variant='outline'>
            <Filter className='h-4 w-4 mr-2' />
            فلترة
          </Button>
          <Button variant='outline'>
            <Download className='h-4 w-4 mr-2' />
            تصدير
          </Button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        {auditStats.map((stat, index) => {
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

      {/* شريط البحث والفلترة */}
      <Card>
        <CardContent className='pt-6'>
          <div className='flex items-center space-x-4 rtl:space-x-reverse'>
            <div className='flex-1 relative'>
              <Search className='absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              <input
                type='text'
                placeholder='البحث في سجل التدقيق...'
                className='w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white'
              />
            </div>
            <Button variant='outline'>
              <Filter className='h-4 w-4 mr-2' />
              فلترة متقدمة
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* جدول سجل التدقيق */}
      <Card>
        <CardHeader>
          <CardTitle>سجل الأنشطة</CardTitle>
          <CardDescription>جميع أنشطة النظام والعمليات المسجلة</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {auditLogs.map(log => (
              <div
                key={log.id}
                className='flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
              >
                <div className='flex items-center space-x-4 rtl:space-x-reverse'>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      log.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <div>
                    <h3 className='font-semibold text-gray-900 dark:text-white'>
                      {log.action}
                    </h3>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      {log.details}
                    </p>
                    <div className='flex items-center space-x-4 rtl:space-x-reverse mt-1'>
                      <span className='text-xs text-gray-500'>{log.user}</span>
                      <span className='text-xs text-gray-500'>
                        {log.timestamp}
                      </span>
                      <span className='text-xs text-gray-500'>{log.ip}</span>
                    </div>
                  </div>
                </div>
                <div className='flex items-center space-x-2 rtl:space-x-reverse'>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      log.status === 'success'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    {log.status === 'success' ? 'نجح' : 'فشل'}
                  </span>
                  <Button variant='outline' size='sm'>
                    <Eye className='h-4 w-4' />
                  </Button>
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

