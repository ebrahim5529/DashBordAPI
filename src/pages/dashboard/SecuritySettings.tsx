/**
 * صفحة إعدادات الأمان
 * إدارة إعدادات الأمان والحماية في النظام
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
  Settings,
  Shield,
  Lock,
  Eye,
  Key,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

// بيانات وهمية لإعدادات الأمان
const securitySettings = [
  {
    id: '1',
    name: 'كلمة المرور',
    description: 'إعدادات كلمة المرور للمستخدمين',
    status: 'active',
    value: 'قوية (8+ أحرف)',
    icon: Lock,
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  {
    id: '2',
    name: 'المصادقة الثنائية',
    description: 'تفعيل المصادقة الثنائية',
    status: 'active',
    value: 'مفعلة',
    icon: Shield,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
  {
    id: '3',
    name: 'انتهاء الجلسة',
    description: 'مدة انتهاء الجلسة التلقائي',
    status: 'active',
    value: '30 دقيقة',
    icon: Eye,
    color:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  },
  {
    id: '4',
    name: 'تشفير البيانات',
    description: 'تشفير البيانات الحساسة',
    status: 'active',
    value: 'AES-256',
    icon: Key,
    color:
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  },
  {
    id: '5',
    name: 'سجل الأمان',
    description: 'تسجيل جميع أنشطة الأمان',
    status: 'active',
    value: 'مفعل',
    icon: AlertTriangle,
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  },
];

const securityAlerts = [
  {
    id: '1',
    type: 'warning',
    title: 'محاولة تسجيل دخول غير مصرح',
    description: 'محاولة تسجيل دخول من IP غير معروف',
    time: 'منذ 5 دقائق',
    severity: 'medium',
  },
  {
    id: '2',
    type: 'info',
    title: 'تحديث كلمة المرور',
    description: 'تم تحديث كلمة المرور بنجاح',
    time: 'منذ ساعة',
    severity: 'low',
  },
  {
    id: '3',
    type: 'error',
    title: 'فشل في المصادقة',
    description: 'فشل في المصادقة الثنائية',
    time: 'منذ ساعتين',
    severity: 'high',
  },
];

export default function SecuritySettingsPage() {
  return (
    <div className='space-y-6'>
      {/* عنوان الصفحة */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            إعدادات الأمان
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-1'>
            إدارة إعدادات الأمان والحماية في النظام
          </p>
        </div>
        <Button className='flex items-center space-x-2 rtl:space-x-reverse'>
          <Settings className='h-4 w-4' />
          <span>حفظ الإعدادات</span>
        </Button>
      </div>

      {/* إحصائيات الأمان */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>مستوى الأمان</CardTitle>
            <Shield className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>عالٍ</div>
            <p className='text-xs text-muted-foreground'>
              95% من الإعدادات مفعلة
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              التنبيهات النشطة
            </CardTitle>
            <AlertTriangle className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-yellow-600'>3</div>
            <p className='text-xs text-muted-foreground'>تحتاج إلى مراجعة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>آخر فحص</CardTitle>
            <CheckCircle className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>ناجح</div>
            <p className='text-xs text-muted-foreground'>منذ 10 دقائق</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              المستخدمون النشطون
            </CardTitle>
            <Eye className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>12</div>
            <p className='text-xs text-muted-foreground'>حالياً متصلون</p>
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* إعدادات الأمان */}
        <Card>
          <CardHeader>
            <CardTitle>إعدادات الأمان</CardTitle>
            <CardDescription>إدارة إعدادات الأمان والحماية</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {securitySettings.map(setting => {
                const Icon = setting.icon;
                return (
                  <div
                    key={setting.id}
                    className='flex items-center justify-between p-3 border rounded-lg'
                  >
                    <div className='flex items-center space-x-3 rtl:space-x-reverse'>
                      <div className={`p-2 rounded-lg ${setting.color}`}>
                        <Icon className='h-4 w-4' />
                      </div>
                      <div>
                        <h3 className='font-semibold text-gray-900 dark:text-white'>
                          {setting.name}
                        </h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                          {setting.description}
                        </p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <p className='text-sm font-medium text-gray-900 dark:text-white'>
                        {setting.value}
                      </p>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          setting.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}
                      >
                        {setting.status === 'active' ? 'نشط' : 'غير نشط'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* تنبيهات الأمان */}
        <Card>
          <CardHeader>
            <CardTitle>تنبيهات الأمان</CardTitle>
            <CardDescription>آخر تنبيهات الأمان والأحداث</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {securityAlerts.map(alert => (
                <div
                  key={alert.id}
                  className='flex items-start space-x-3 rtl:space-x-reverse p-3 border rounded-lg'
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      alert.severity === 'high'
                        ? 'bg-red-500'
                        : alert.severity === 'medium'
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                    }`}
                  />
                  <div className='flex-1'>
                    <h3 className='font-semibold text-gray-900 dark:text-white'>
                      {alert.title}
                    </h3>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      {alert.description}
                    </p>
                    <p className='text-xs text-gray-500 mt-1'>{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

