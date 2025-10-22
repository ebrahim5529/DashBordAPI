/**
 * صفحة مجموعات الصلاحيات
 * إدارة مجموعات الصلاحيات المختلفة في النظام
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
import { Shield, Plus, Edit, Trash2, Users, Key, Settings } from 'lucide-react';

// بيانات وهمية لمجموعات الصلاحيات
const permissionGroups = [
  {
    id: '1',
    name: 'المديرين',
    description: 'صلاحيات إدارية كاملة',
    permissions: [
      'إدارة المستخدمين',
      'إدارة النظام',
      'عرض التقارير',
      'تعديل الإعدادات',
      'إدارة الصلاحيات',
    ],
    userCount: 3,
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  },
  {
    id: '2',
    name: 'المحاسبين',
    description: 'صلاحيات مالية ومحاسبية',
    permissions: [
      'عرض التقارير المالية',
      'إدارة الفواتير',
      'إدارة المدفوعات',
      'عرض الإحصائيات',
    ],
    userCount: 5,
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  {
    id: '3',
    name: 'موظفي المبيعات',
    description: 'صلاحيات مبيعات وعقود',
    permissions: [
      'إدارة العملاء',
      'إنشاء العقود',
      'عرض تقارير المبيعات',
      'إدارة المطالبات',
    ],
    userCount: 8,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
  {
    id: '4',
    name: 'موظفي المخازن',
    description: 'صلاحيات إدارة المخزون',
    permissions: [
      'إدارة المخزون',
      'تحديث المعدات',
      'عرض تقارير المخزون',
      'إدارة المشتريات',
    ],
    userCount: 6,
    color:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  },
  {
    id: '5',
    name: 'القراءة فقط',
    description: 'صلاحيات عرض محدودة',
    permissions: ['عرض البيانات', 'طباعة التقارير'],
    userCount: 4,
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  },
];

export default function PermissionGroupsPage() {
  return (
    <div className='space-y-6'>
      {/* عنوان الصفحة */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            مجموعات الصلاحيات
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-1'>
            إدارة مجموعات الصلاحيات المختلفة في النظام
          </p>
        </div>
        <Button className='flex items-center space-x-2 rtl:space-x-reverse'>
          <Plus className='h-4 w-4' />
          <span>إضافة مجموعة جديدة</span>
        </Button>
      </div>

      {/* إحصائيات سريعة */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              إجمالي المجموعات
            </CardTitle>
            <Shield className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>5</div>
            <p className='text-xs text-muted-foreground'>+1 من الشهر الماضي</p>
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
            <div className='text-2xl font-bold'>26</div>
            <p className='text-xs text-muted-foreground'>+4 من الشهر الماضي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              الصلاحيات النشطة
            </CardTitle>
            <Key className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>24</div>
            <p className='text-xs text-muted-foreground'>عبر جميع المجموعات</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              المجموعات المخصصة
            </CardTitle>
            <Settings className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>3</div>
            <p className='text-xs text-muted-foreground'>60% من المجموعات</p>
          </CardContent>
        </Card>
      </div>

      {/* قائمة مجموعات الصلاحيات */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة مجموعات الصلاحيات</CardTitle>
          <CardDescription>
            إدارة مجموعات الصلاحيات المختلفة والمستخدمين المرتبطين بها
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {permissionGroups.map(group => (
              <div
                key={group.id}
                className='flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
              >
                <div className='flex items-start space-x-4 rtl:space-x-reverse'>
                  <div className={`p-2 rounded-lg ${group.color}`}>
                    <Shield className='h-5 w-5' />
                  </div>
                  <div className='flex-1'>
                    <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>
                      {group.name}
                    </h3>
                    <p className='text-sm text-gray-600 dark:text-gray-400 mb-3'>
                      {group.description}
                    </p>
                    <div className='flex items-center space-x-4 rtl:space-x-reverse mb-3'>
                      <span className='text-xs text-gray-500'>
                        {group.userCount} مستخدم
                      </span>
                      <span className='text-xs text-gray-500'>
                        {group.permissions.length} صلاحية
                      </span>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                      {group.permissions.map((permission, index) => (
                        <span
                          key={index}
                          className='px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md'
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className='flex items-center space-x-2 rtl:space-x-reverse'>
                  <Button variant='outline' size='sm'>
                    <Edit className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='text-red-600 hover:text-red-700'
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

