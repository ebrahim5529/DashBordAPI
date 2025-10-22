/**
 * صفحة تقارير العملاء
 */

import React, { useState } from 'react';
import { CustomerReportsStats } from '@/components/features/CustomerReportsStats';
import { customerReportsData } from '@/data/reportsData';
import { 
  Users, 
  TrendingUp, 
  Star, 
  UserPlus, 
  Download,
  FileText,
  Filter,
  Calendar,
  BarChart3
} from 'lucide-react';

export default function CustomerReportsPage() {
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  // معالجة تصدير التقرير
  const handleExportReport = () => {
    alert('سيتم تصدير تقرير العملاء');
  };

  // معالجة طباعة التقرير
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* العنوان والوصف */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            تقارير العملاء
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            تقارير مفصلة عن العملاء ونشاطهم التعاقدي
          </p>
        </div>
        
        {/* أزرار التحكم */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <button
            onClick={handleExportReport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            تصدير
          </button>
          <button
            onClick={handlePrintReport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FileText className="h-4 w-4" />
            طباعة
          </button>
        </div>
      </div>

      {/* فلاتر التقرير */}
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <div className="flex items-center gap-2">
          <Filter className="h-3 w-3" />
          <span className="text-xs font-medium">القطاع:</span>
          <select
            value={selectedSegment}
            onChange={(e) => setSelectedSegment(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600"
          >
            <option value="all">جميع القطاعات</option>
            <option value="construction">شركات البناء</option>
            <option value="contractors">المقاولين</option>
            <option value="government">المؤسسات الحكومية</option>
            <option value="individuals">الأفراد</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="h-3 w-3" />
          <span className="text-xs font-medium">الفترة:</span>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600"
          >
            <option value="daily">يومي</option>
            <option value="weekly">أسبوعي</option>
            <option value="monthly">شهري</option>
            <option value="quarterly">ربعي</option>
            <option value="yearly">سنوي</option>
          </select>
        </div>
      </div>

      {/* إحصائيات العملاء */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <h2 className="text-lg font-semibold">إحصائيات العملاء</h2>
        </div>
        <CustomerReportsStats data={customerReportsData} />
      </div>

      {/* شرائح العملاء */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          <h2 className="text-lg font-semibold">شرائح العملاء</h2>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="space-y-4">
            {customerReportsData.customerSegments.map((segment, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                  <div>
                    <h3 className="text-xs font-medium text-gray-900 dark:text-white">
                      {segment.segment}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {segment.count} عميل
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-gray-900 dark:text-white">
                    {segment.revenue.toLocaleString()} ريال
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {segment.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* أفضل العملاء */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          <h2 className="text-lg font-semibold">أفضل العملاء</h2>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    العميل
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    عدد العقود
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    القيمة الإجمالية
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    آخر نشاط
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    التقييم
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {customerReportsData.topPerformingCustomers.map((customer, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 whitespace-nowrap text-xs font-medium text-gray-900 dark:text-white">
                      {customer.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-900 dark:text-white">
                      {customer.contracts}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-900 dark:text-white">
                      {customer.totalValue.toLocaleString()} ريال
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-900 dark:text-white">
                      {customer.lastActivity}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="mr-1">{customer.rating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* رضا العملاء */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4" />
          <h2 className="text-lg font-semibold">رضا العملاء</h2>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="space-y-4">
            {customerReportsData.customerSatisfaction.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs font-medium text-gray-900 dark:text-white">
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="text-xs font-bold text-gray-900 dark:text-white mr-1">
                      {item.rating}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({item.responses} تقييم)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* نشاط العملاء */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          <h2 className="text-lg font-semibold">نشاط العملاء</h2>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    الشهر
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    عملاء جدد
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    عملاء نشطون
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    عملاء متسربون
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    صافي النمو
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {customerReportsData.customerActivity.map((activity, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 whitespace-nowrap text-xs font-medium text-gray-900 dark:text-white">
                      {activity.month}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-900 dark:text-white">
                      <span className="text-green-600">+{activity.newCustomers}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-900 dark:text-white">
                      {activity.activeCustomers}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-900 dark:text-white">
                      <span className="text-red-600">-{activity.churnedCustomers}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-900 dark:text-white">
                      <span className={`${
                        (activity.newCustomers - activity.churnedCustomers) >= 0 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {(activity.newCustomers - activity.churnedCustomers) >= 0 ? '+' : ''}
                        {activity.newCustomers - activity.churnedCustomers}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
