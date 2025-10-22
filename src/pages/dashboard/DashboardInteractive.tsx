/**
 * صفحة لوحة التحكم التفاعلية
 */

import React, { useState } from 'react';
import { InteractiveDashboardStats } from '@/components/features/InteractiveDashboardStats';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { Charts } from '@/components/dashboard/Charts';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { mockStats, mockContractData, mockMonthlyData, mockActivities } from '@/data/mockData';
import { dashboardInteractiveData } from '@/data/reportsData';
import { BarChart3, Activity, Clock, AlertTriangle, FileText, Truck, DollarSign, Wrench } from 'lucide-react';

export default function DashboardInteractivePage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('today');

  // معالجة تغيير الفترة الزمنية
  const handleTimeRangeChange = (range: string) => {
    setSelectedTimeRange(range);
  };

  // معالجة الإجراءات السريعة
  const handleQuickAction = (action: string) => {
    alert(`سيتم تنفيذ: ${action}`);
  };

  return (
    <div className="space-y-6">
      {/* العنوان والوصف */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            لوحة التحكم التفاعلية
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            نظرة عامة تفاعلية على جميع العمليات والإحصائيات المباشرة
          </p>
        </div>
        
        {/* اختيار الفترة الزمنية */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <select
            value={selectedTimeRange}
            onChange={(e) => handleTimeRangeChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600"
          >
            <option value="today">اليوم</option>
            <option value="week">هذا الأسبوع</option>
            <option value="month">هذا الشهر</option>
            <option value="quarter">هذا الربع</option>
          </select>
        </div>
      </div>

      {/* الإحصائيات المباشرة */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          <h2 className="text-lg font-semibold">الإحصائيات المباشرة</h2>
        </div>
        <InteractiveDashboardStats data={dashboardInteractiveData} />
      </div>

      {/* الإحصائيات العامة */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          <h2 className="text-lg font-semibold">الإحصائيات العامة</h2>
        </div>
        <StatsCards stats={mockStats} />
      </div>

      {/* الرسوم البيانية */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          <h2 className="text-lg font-semibold">الرسوم البيانية</h2>
        </div>
        <Charts contractData={mockContractData} monthlyData={mockMonthlyData} />
      </div>

      {/* الأنشطة الأخيرة والتنبيهات */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* الأنشطة الأخيرة */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <h2 className="text-lg font-semibold">الأنشطة الأخيرة</h2>
          </div>
          <RecentActivity activities={mockActivities} />
        </div>

        {/* التنبيهات والإجراءات السريعة */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <h2 className="text-lg font-semibold">التنبيهات والإجراءات السريعة</h2>
          </div>
          
          {/* التنبيهات */}
          <div className="space-y-3">
            {dashboardInteractiveData.alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.priority === 'high' ? 'bg-red-50 border-red-500' :
                  alert.priority === 'medium' ? 'bg-orange-50 border-orange-500' :
                  'bg-green-50 border-green-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-gray-900 dark:text-white">
                    {alert.message}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                    alert.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {alert.priority === 'high' ? 'عالي' :
                     alert.priority === 'medium' ? 'متوسط' : 'منخفض'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* الإجراءات السريعة */}
          <div className="space-y-3">
            <h3 className="text-base font-medium text-gray-900 dark:text-white">
              الإجراءات السريعة
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {dashboardInteractiveData.quickActions.map((action, index) => {
                const Icon = action.icon === 'FileText' ? FileText :
                             action.icon === 'Truck' ? Truck :
                             action.icon === 'DollarSign' ? DollarSign :
                             Wrench;
                
                return (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.title)}
                    className={`p-4 rounded-lg border-2 border-dashed hover:border-solid transition-all duration-200 ${
                      action.color === 'blue' ? 'border-blue-300 hover:border-blue-500 hover:bg-blue-50' :
                      action.color === 'green' ? 'border-green-300 hover:border-green-500 hover:bg-green-50' :
                      action.color === 'yellow' ? 'border-yellow-300 hover:border-yellow-500 hover:bg-yellow-50' :
                      'border-orange-300 hover:border-orange-500 hover:bg-orange-50'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Icon className={`h-5 w-5 ${
                        action.color === 'blue' ? 'text-blue-600' :
                        action.color === 'green' ? 'text-green-600' :
                        action.color === 'yellow' ? 'text-yellow-600' :
                        'text-orange-600'
                      }`} />
                      <div className="text-center">
                        <p className="text-xs font-medium text-gray-900 dark:text-white">
                          {action.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
