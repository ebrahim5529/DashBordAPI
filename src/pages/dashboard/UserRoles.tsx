/**
 * صفحة أدوار المستخدمين - Server Component
 * إدارة وتخصيص أدوار المستخدمين في النظام
 * 
 * هذا مكون خادم (Server Component) يعمل على السيرفر
 * ويحتوي على البيانات الثابتة والهيكل الأساسي للصفحة
 */

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shared/Card';
import { UserCog, Shield, Users, Settings, Eye } from 'lucide-react';
import { userRolesStats } from '@/data/userRolesData';
import { UserRolesPageClient } from './UserRolesPageClient';

/**
 * Server Component - يعمل على السيرفر
 * يحتوي على البيانات الثابتة والهيكل الأساسي
 */
export default function UserRolesPage() {
  return (
    <div className='space-y-6'>
      {/* عنوان الصفحة */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            أدوار المستخدمين
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-1'>
            إدارة وتخصيص أدوار المستخدمين في النظام
          </p>
        </div>
      </div>

      {/* إحصائيات سريعة - Server Component */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              إجمالي الأدوار
            </CardTitle>
            <UserCog className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{userRolesStats.totalRoles}</div>
            <p className='text-xs text-muted-foreground'>
              {userRolesStats.activeRoles} نشط
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              إجمالي المستخدمين
            </CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{userRolesStats.totalUsers}</div>
            <p className='text-xs text-muted-foreground'>
              موزعين على {userRolesStats.totalRoles} دور
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>الصلاحيات</CardTitle>
            <Shield className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{userRolesStats.totalPermissions}</div>
            <p className='text-xs text-muted-foreground'>
              في {userRolesStats.permissionCategories} فئة
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>أدوار مخصصة</CardTitle>
            <Settings className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{userRolesStats.customRoles}</div>
            <p className='text-xs text-muted-foreground'>
              {Math.round((userRolesStats.customRoles / userRolesStats.totalRoles) * 100)}% من الأدوار
            </p>
          </CardContent>
        </Card>
      </div>

      {/* المحتوى التفاعلي - Client Component */}
      <UserRolesPageClient />

      {/* معلومات إضافية - Server Component */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2 rtl:space-x-reverse'>
            <Eye className='h-5 w-5' />
            <span>معلومات إضافية</span>
          </CardTitle>
          <CardDescription>
            نصائح وإرشادات لإدارة أدوار المستخدمين
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <h4 className='font-medium text-gray-900 dark:text-white mb-2'>
                أفضل الممارسات
              </h4>
              <ul className='space-y-2 text-sm text-gray-600 dark:text-gray-400'>
                <li>• امنح أقل الصلاحيات المطلوبة لكل دور</li>
                <li>• راجع الصلاحيات بانتظام وتحديثها عند الحاجة</li>
                <li>• استخدم أسماء واضحة ومفهومة للأدوار</li>
                <li>• وثق الغرض من كل دور في الوصف</li>
              </ul>
            </div>
            <div>
              <h4 className='font-medium text-gray-900 dark:text-white mb-2'>
                نصائح الأمان
              </h4>
              <ul className='space-y-2 text-sm text-gray-600 dark:text-gray-400'>
                <li>• لا تمنح صلاحيات إدارية إلا للمستخدمين الموثوقين</li>
                <li>• استخدم مبدأ &quot;الوصول الصفري&quot; كافتراضي</li>
                <li>• راقب استخدام الصلاحيات بانتظام</li>
                <li>• احذف الأدوار غير المستخدمة</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
