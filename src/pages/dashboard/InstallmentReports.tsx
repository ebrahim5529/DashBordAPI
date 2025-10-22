/**
 * صفحة تقارير المدفوعات
 * تقارير شاملة عن المدفوعات والمدفوعات
 */

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shared/Card';
import {
  BarChart,
  Download,
  Filter,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  FileText,
} from 'lucide-react';

// بيانات وهمية لتقارير المدفوعات
const installmentReports = [
  {
    id: '1',
    title: 'تقرير المدفوعات الشهري',
    description: 'تقرير شامل عن المدفوعات والمدفوعات للشهر الحالي',
    period: 'يناير 2024',
    totalAmount: 450000,
    paidAmount: 380000,
    pendingAmount: 70000,
    status: 'completed',
    generatedDate: '2024-01-31',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
  {
    id: '2',
    title: 'تقرير العملاء المتأخرين',
    description: 'قائمة العملاء الذين لديهم مدفوعات متأخرة',
    period: 'فبراير 2024',
    totalAmount: 120000,
    paidAmount: 80000,
    pendingAmount: 40000,
    status: 'completed',
    generatedDate: '2024-02-15',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  },
  {
    id: '3',
    title: 'تقرير الأداء المالي',
    description: 'تحليل أداء المدفوعات والمدفوعات',
    period: 'الربع الأول 2024',
    totalAmount: 1200000,
    paidAmount: 1100000,
    pendingAmount: 100000,
    status: 'completed',
    generatedDate: '2024-03-31',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  {
    id: '4',
    title: 'تقرير طرق الدفع',
    description: 'إحصائيات طرق الدفع المستخدمة',
    period: 'فبراير 2024',
    totalAmount: 320000,
    paidAmount: 300000,
    pendingAmount: 20000,
    status: 'pending',
    generatedDate: '2024-02-20',
    color:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  },
];

const reportStats = [
  {
    title: 'إجمالي التقارير',
    value: '24',
    change: '+3',
    icon: BarChart,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
  },
  {
    title: 'المكتملة',
    value: '20',
    change: '+2',
    icon: TrendingUp,
    color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
  },
  {
    title: 'قيد الإعداد',
    value: '4',
    change: '+1',
    icon: Clock,
    color:
      'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300',
  },
  {
    title: 'إجمالي المبلغ',
    value: '2.1M',
    change: '+15%',
    icon: DollarSign,
    color:
      'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
  },
];

export default function InstallmentReportsPage() {
  const [_isLoading, _setIsLoading] = useState(false);

  // معالجة إنشاء تقرير جديد
  const handleCreateReport = () => {
    alert('تم فتح نموذج إنشاء تقرير جديد');
  };

  // معالجة تحميل التقرير
  const handleDownloadReport = (report: any) => {
    alert(`تم تحميل التقرير "${report.title}"`);
  };

  return (
    <div className="space-y-6">
      {/* أزرار الوصول السريع */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <h2 className="text-xl font-semibold">تقارير المدفوعات</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200">
            <Filter className="h-4 w-4" />
            فلترة
          </button>
          <button
            onClick={handleCreateReport}
            className="flex items-center gap-2 bg-[#58d2c8] hover:bg-[#4bb5ab] text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <BarChart className="h-4 w-4" />
            تقرير جديد
          </button>
        </div>
      </div>

      {/* إحصائيات التقارير */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <h2 className="text-xl font-semibold">إحصائيات التقارير</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-[#913D95]/5 hover:border-[#913D95]/30 hover:shadow-lg hover:shadow-[#913D95]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm text-gray-600 group-hover:text-[#913D95] transition-colors duration-300 font-almarai mb-2">
                      {stat.title}
                    </h3>
                    <div className="text-2xl font-bold text-[#913D95] group-hover:text-[#7A2F7D] transition-colors duration-300 font-tajawal">
                      {stat.value}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {stat.change} من الشهر الماضي
                    </p>
                  </div>
                  <div className="p-2 bg-[#913D95]/10 rounded-lg group-hover:bg-[#913D95]/20 transition-all duration-300">
                    <Icon className="h-5 w-5 text-[#913D95] group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* أدوات إنشاء التقارير */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BarChart className="h-5 w-5" />
          <h2 className="text-xl font-semibold">إنشاء تقرير جديد</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>إنشاء تقرير جديد</CardTitle>
            <CardDescription>اختر نوع التقرير والفترة الزمنية</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer'>
                <div className='flex items-center space-x-3 rtl:space-x-reverse'>
                  <Calendar className='h-8 w-8 text-blue-600' />
                  <div>
                    <h3 className='font-semibold text-gray-900 dark:text-white'>
                      تقرير شهري
                    </h3>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      تقرير شامل للشهر
                    </p>
                  </div>
                </div>
              </div>

              <div className='p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer'>
                <div className='flex items-center space-x-3 rtl:space-x-reverse'>
                  <Users className='h-8 w-8 text-green-600' />
                  <div>
                    <h3 className='font-semibold text-gray-900 dark:text-white'>
                      تقرير العملاء
                    </h3>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      أداء العملاء والمدفوعات
                    </p>
                  </div>
                </div>
              </div>

              <div className='p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer'>
                <div className='flex items-center space-x-3 rtl:space-x-reverse'>
                  <TrendingUp className='h-8 w-8 text-purple-600' />
                  <div>
                    <h3 className='font-semibold text-gray-900 dark:text-white'>
                      تقرير الأداء
                    </h3>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      تحليل الأداء المالي
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* قائمة التقارير */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <h2 className="text-xl font-semibold">التقارير المحفوظة</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>التقارير المحفوظة</CardTitle>
            <CardDescription>جميع التقارير المنشأة والمحفوظة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {installmentReports.map(report => (
                <div
                  key={report.id}
                  className='flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
                >
                  <div className='flex items-center space-x-4 rtl:space-x-reverse'>
                    <div className={`p-2 rounded-lg ${report.color}`}>
                      <BarChart className='h-5 w-5' />
                    </div>
                    <div className='flex-1'>
                      <h3 className='font-semibold text-gray-900 dark:text-white'>
                        {report.title}
                      </h3>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        {report.description}
                      </p>
                      <div className='flex items-center space-x-6 rtl:space-x-reverse mt-2'>
                        <div className='flex items-center space-x-1 rtl:space-x-reverse'>
                          <Calendar className='h-4 w-4 text-gray-400' />
                          <span className='text-xs text-gray-500'>
                            {report.period}
                          </span>
                        </div>
                        <div className='flex items-center space-x-1 rtl:space-x-reverse'>
                          <DollarSign className='h-4 w-4 text-gray-400' />
                          <span className='text-xs text-gray-500'>
                            {report.totalAmount.toLocaleString()} ريال
                          </span>
                        </div>
                        <span className='text-xs text-gray-500'>
                          منشأ: {report.generatedDate}
                        </span>
                      </div>
                      <div className='mt-2'>
                        <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                          <div
                            className='bg-green-500 h-2 rounded-full'
                            style={{
                              width: `${(report.paidAmount / report.totalAmount) * 100}%`,
                            }}
                          />
                        </div>
                        <div className='flex justify-between text-xs text-gray-500 mt-1'>
                          <span>
                            مدفوع: {report.paidAmount.toLocaleString()} ريال
                          </span>
                          <span>
                            متبقي: {report.pendingAmount.toLocaleString()} ريال
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2 rtl:space-x-reverse'>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        report.status === 'completed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}
                    >
                      {report.status === 'completed' ? 'مكتمل' : 'قيد الإعداد'}
                    </span>
                    <button 
                      className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                      onClick={() => handleDownloadReport(report)}
                    >
                      <Download className='h-4 w-4' />
                    </button>
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

