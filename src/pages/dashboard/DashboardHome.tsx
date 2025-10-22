/**
 * صفحة Dashboard - تم تحويلها من Next.js إلى React
 * صفحة لوحة التحكم الرئيسية
 */

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shared/Card';
import { formatDate } from '@/lib/utils/formatDate.util';
import { mockActivities } from '@/data/mockData';
import { OfficeUsageCards } from '@/components/dashboard/OfficeUsageCards';
import { ContractsTableWrapper } from '@/components/features/ContractsTableWrapper';
import { advancedContractsData } from '@/data/advancedContractsData';
import {
  officeUsageData,
  monthlyTrendsData,
  weeklyActivityData,
  equipmentDistributionData,
  generalOfficeStats,
} from '@/data/officeUsageData';
import { Building2, Users, DollarSign, FileText } from 'lucide-react';

/**
 * صفحة Dashboard الرئيسية
 */
export default function DashboardHome() {
  // البيانات الثابتة (في التطبيق الحقيقي، ستجلب من API)
  const stats = [
    {
      id: '1',
      title: 'إجمالي المكاتب',
      value: generalOfficeStats.totalOffices.toString(),
      change: 0,
      icon: Building2,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    },
    {
      id: '2',
      title: 'إجمالي المستخدمين',
      value: generalOfficeStats.totalUsers.toString(),
      change: 12,
      icon: Users,
      color:
        'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
    },
    {
      id: '3',
      title: 'إجمالي الإيرادات الشهرية',
      value: generalOfficeStats.totalMonthlyRevenue.toLocaleString(),
      change: 15,
      icon: DollarSign,
      color:
        'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300',
    },
    {
      id: '4',
      title: 'إجمالي العقود',
      value: generalOfficeStats.totalContracts.toString(),
      change: 8,
      icon: FileText,
      color:
        'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
    },
  ];

  return (
    <div className='space-y-6'>
      {/* عنوان الصفحة */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            لوحة التحكم
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-1'>
            نظرة عامة على عملياتك اليومية
          </p>
        </div>
        <div className='text-sm text-gray-500 dark:text-gray-400'>
          آخر تحديث: {formatDate(new Date().toISOString(), 'DATETIME')}
        </div>
      </div>

      {/* بطاقات الإحصائيات العامة */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className='hover:shadow-lg transition-shadow duration-200'
            >
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
                  {stat.change > 0 ? '+' : ''}
                  {stat.change}% من الشهر الماضي
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* كاردات الرسوم البيانية حسب استخدام المكاتب */}
      <div className='space-y-6'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
            إحصائيات استخدام المكاتب
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            نظرة شاملة على أداء المكاتب المختلفة مع الرسوم البيانية التفاعلية
          </p>
        </div>

        <OfficeUsageCards
          officeData={officeUsageData}
          monthlyTrends={monthlyTrendsData}
          weeklyActivity={weeklyActivityData}
          equipmentDistribution={equipmentDistributionData}
        />
      </div>

      {/* بطاقة النشاط الأخير */}
      <Card>
        <CardHeader>
          <CardTitle>النشاط الأخير</CardTitle>
          <CardDescription>آخر الأنشطة في النظام</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {mockActivities.slice(0, 5).map((activity, index) => (
              <div
                key={index}
                className='flex items-center space-x-4 rtl:space-x-reverse'
              >
                <div className='w-2 h-2 bg-primary rounded-full' />
                <div className='flex-1'>
                  <p className='text-sm font-medium'>{activity.description}</p>
                  <p className='text-xs text-muted-foreground'>
                    {activity.time}
                  </p>
                </div>
                <div className='text-xs text-muted-foreground'>
                  {activity.user}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* جدول العقود المتقدم */}
      <ContractsTableWrapper
        data={advancedContractsData}
        filters={{}}
        isLoading={false}
      />
    </div>
  );
}

