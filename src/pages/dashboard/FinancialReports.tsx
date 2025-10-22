/**
 * صفحة التقارير المالية
 */

import React, { useState } from 'react';
import { Charts } from '@/components/dashboard/Charts';
import { mockMonthlyData } from '@/data/mockData';
import { mockQuickFinancialStats } from '@/data/financialData';
import FinancialReportForm from '@/components/features/FinancialReportForm';
import { FinancialReportFormData } from '@/components/features/FinancialReportForm';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  FileText, 
  Download,
  Filter,
  Plus,
  Eye
} from 'lucide-react';

type ViewMode = 'list' | 'form' | 'details';

export default function FinancialReportsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [isLoading, setIsLoading] = useState(false);

  // معالجة تغيير الفترة
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
  };

  // معالجة إنشاء تقرير جديد
  const handleAddReport = () => {
    setViewMode('form');
  };

  // معالجة حفظ التقرير
  const handleSaveReport = async (data: FinancialReportFormData) => {
    setIsLoading(true);
    try {
      // محاكاة إنشاء التقرير
      new Promise(resolve => setTimeout(resolve, 2000));
      console.log('إنشاء التقرير المالي:', data);
      setIsLoading(false);
      setViewMode('list');
      alert('تم إنشاء التقرير المالي بنجاح');
    } catch (error) {
      console.error('خطأ في إنشاء التقرير:', error);
      setIsLoading(false);
      alert('حدث خطأ في إنشاء التقرير');
    }
  };

  // إغلاق النموذج
  const handleCloseForm = () => {
    setViewMode('list');
  };

  // معالجة تصدير التقرير
  const handleExportReport = () => {
    alert('سيتم تصدير التقرير المالي');
  };

  // معالجة طباعة التقرير
  const handlePrintReport = () => {
    window.print();
  };

  // معالجة عرض تفاصيل التقرير
  const handleViewReport = () => {
    setViewMode('details');
  };

  // عرض النموذج
  if (viewMode === 'form') {
    return (
      <FinancialReportForm
        onSubmit={handleSaveReport}
        onCancel={handleCloseForm}
        isLoading={isLoading}
        title="إنشاء تقرير مالي جديد"
        description="قم بتكوين التقرير المالي حسب احتياجاتك"
      />
    );
  }

  // عرض التفاصيل
  if (viewMode === 'details') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              التقارير المالية
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              تقرير الإيرادات والمصروفات المفصل
            </p>
          </div>
          <button
            onClick={() => setViewMode('list')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            العودة
          </button>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">
            تفاصيل التقرير المالي ستظهر هنا مع الرسوم البيانية والإحصائيات
          </p>
        </div>
      </div>
    );
  }

  // العرض الافتراضي - قائمة التقارير المالية
  return (
    <div className="space-y-6">
      {/* أزرار الوصول السريع */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <h2 className="text-xl font-semibold">التقارير المالية</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddReport}
            className="flex items-center gap-2 bg-[#58d2c8] hover:bg-[#4bb8ad] text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            إنشاء تقرير جديد
          </button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          <h2 className="text-xl font-semibold">إحصائيات مالية سريعة</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  إجمالي الإيرادات
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockQuickFinancialStats.monthlyIncome.toLocaleString()} ريال
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+{mockQuickFinancialStats.growthPercentage}% من الشهر الماضي</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  إجمالي المصروفات
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockQuickFinancialStats.monthlyExpenses.toLocaleString()} ريال
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <DollarSign className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-sm text-red-600">+8.2% من الشهر الماضي</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  صافي الربح
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockQuickFinancialStats.netProfit.toLocaleString()} ريال
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+22.3% من الشهر الماضي</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  معدل النمو
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockQuickFinancialStats.growthPercentage}%
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <PieChart className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">نمو إيجابي</span>
            </div>
          </div>
        </div>
      </div>

      {/* الرسوم البيانية */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <h2 className="text-xl font-semibold">الرسوم البيانية المالية</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                الإيرادات الشهرية
              </h3>
              <BarChart3 className="h-5 w-5 text-gray-500" />
            </div>
            <Charts 
              contractData={{ paid: 120, unpaid: 28, pending: 8 }}
              monthlyData={mockMonthlyData}
            />
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                توزيع الإيرادات
              </h3>
              <PieChart className="h-5 w-5 text-gray-500" />
            </div>
            <Charts 
              contractData={{ paid: 120, unpaid: 28, pending: 8 }}
              monthlyData={mockMonthlyData}
            />
          </div>
        </div>
      </div>

      {/* أدوات التقرير */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            أدوات التقرير
          </h3>
          <Filter className="h-5 w-5 text-gray-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              نوع التقرير
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="daily">يومي</option>
              <option value="weekly">أسبوعي</option>
              <option value="monthly">شهري</option>
              <option value="yearly">سنوي</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              السنة
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={() => {
                alert('تم تحديث التقرير');
              }}
              className="flex-1 bg-[#58d2c8] hover:bg-[#4bb8ad] text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              تحديث
            </button>
            <button
              onClick={handleViewReport}
              className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <Eye className="h-4 w-4" />
              عرض
            </button>
          </div>
        </div>
      </div>

      {/* تفاصيل التقرير */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            تفاصيل التقرير المالي
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintReport}
              className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 text-sm"
            >
              <FileText className="h-4 w-4" />
              طباعة
            </button>
            <button
              onClick={handleExportReport}
              className="flex items-center gap-2 bg-[#58d2c8] hover:bg-[#4bb8ad] text-white px-3 py-2 rounded-lg transition-colors duration-200 text-sm"
            >
              <Download className="h-4 w-4" />
              تصدير PDF
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 text-gray-600 dark:text-gray-400 font-medium">البند</th>
                <th className="pb-3 text-gray-600 dark:text-gray-400 font-medium">المبلغ</th>
                <th className="pb-3 text-gray-600 dark:text-gray-400 font-medium">النسبة</th>
                <th className="pb-3 text-gray-600 dark:text-gray-400 font-medium">التغيير</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-3 text-gray-900 dark:text-white">إيرادات العقود</td>
                <td className="py-3 text-gray-900 dark:text-white">{Math.round(mockQuickFinancialStats.monthlyIncome * 0.75).toLocaleString()} ريال</td>
                <td className="py-3 text-gray-600 dark:text-gray-400">75.0%</td>
                <td className="py-3 text-green-600">+15.2%</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-3 text-gray-900 dark:text-white">إيرادات الاستئجار</td>
                <td className="py-3 text-gray-900 dark:text-white">{Math.round(mockQuickFinancialStats.monthlyIncome * 0.20).toLocaleString()} ريال</td>
                <td className="py-3 text-gray-600 dark:text-gray-400">20.0%</td>
                <td className="py-3 text-green-600">+8.7%</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-3 text-gray-900 dark:text-white">إيرادات أخرى</td>
                <td className="py-3 text-gray-900 dark:text-white">{Math.round(mockQuickFinancialStats.monthlyIncome * 0.05).toLocaleString()} ريال</td>
                <td className="py-3 text-gray-600 dark:text-gray-400">5.0%</td>
                <td className="py-3 text-red-600">-2.1%</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-3 text-gray-900 dark:text-white font-medium">إجمالي الإيرادات</td>
                <td className="py-3 text-gray-900 dark:text-white font-medium">{mockQuickFinancialStats.monthlyIncome.toLocaleString()} ريال</td>
                <td className="py-3 text-gray-600 dark:text-gray-400 font-medium">100%</td>
                <td className="py-3 text-green-600 font-medium">+{mockQuickFinancialStats.growthPercentage}%</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-900 dark:text-white pt-3">
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </td>
                <td className="py-3 text-gray-900 dark:text-white pt-3"></td>
                <td className="py-3 text-gray-600 dark:text-gray-400 pt-3"></td>
                <td className="py-3 text-gray-600 dark:text-gray-400 pt-3"></td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-3 text-gray-900 dark:text-white">مصاريف التشغيل</td>
                <td className="py-3 text-gray-900 dark:text-white">{Math.round(mockQuickFinancialStats.monthlyExpenses * 0.50).toLocaleString()} ريال</td>
                <td className="py-3 text-gray-600 dark:text-gray-400">50.0%</td>
                <td className="py-3 text-red-600">+5.8%</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-3 text-gray-900 dark:text-white">مصاريف الموظفين</td>
                <td className="py-3 text-gray-900 dark:text-white">{Math.round(mockQuickFinancialStats.monthlyExpenses * 0.35).toLocaleString()} ريال</td>
                <td className="py-3 text-gray-600 dark:text-gray-400">35.0%</td>
                <td className="py-3 text-red-600">+7.2%</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-3 text-gray-900 dark:text-white">مصاريف أخرى</td>
                <td className="py-3 text-gray-900 dark:text-white">{Math.round(mockQuickFinancialStats.monthlyExpenses * 0.15).toLocaleString()} ريال</td>
                <td className="py-3 text-gray-600 dark:text-gray-400">15.0%</td>
                <td className="py-3 text-green-600">-1.5%</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-900 dark:text-white font-medium">إجمالي المصروفات</td>
                <td className="py-3 text-gray-900 dark:text-white font-medium">{mockQuickFinancialStats.monthlyExpenses.toLocaleString()} ريال</td>
                <td className="py-3 text-gray-600 dark:text-gray-400 font-medium">100%</td>
                <td className="py-3 text-red-600 font-medium">+8.2%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
