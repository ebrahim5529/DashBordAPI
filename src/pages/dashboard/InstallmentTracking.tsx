/**
 * صفحة تتبع المدفوعات
 * تتبع حالة المدفوعات والمدفوعات
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
  TrendingUp,
  Search,
  Filter,
  Download,
  Eye,
  DollarSign,
  Calendar,
  AlertCircle,
  Activity,
} from 'lucide-react';

// بيانات وهمية لتتبع المدفوعات
const installmentTracking = [
  // شركة البناء الحديثة - CON-2024-001 (12 قسط)
  {
    id: '1',
    customerName: 'شركة البناء الحديثة',
    contractNumber: 'CON-2024-001',
    installmentNumber: 1,
    totalInstallments: 12,
    amount: 12500,
    dueDate: '2024-01-15',
    paidDate: '2024-01-14',
    status: 'paid',
    method: 'تحويل بنكي',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  {
    id: '2',
    customerName: 'شركة البناء الحديثة',
    contractNumber: 'CON-2024-001',
    installmentNumber: 2,
    totalInstallments: 12,
    amount: 12500,
    dueDate: '2024-02-15',
    paidDate: '2024-02-14',
    status: 'paid',
    method: 'تحويل بنكي',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  {
    id: '3',
    customerName: 'شركة البناء الحديثة',
    contractNumber: 'CON-2024-001',
    installmentNumber: 3,
    totalInstallments: 12,
    amount: 12500,
    dueDate: '2024-03-15',
    paidDate: '2024-03-14',
    status: 'paid',
    method: 'تحويل بنكي',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  {
    id: '4',
    customerName: 'شركة البناء الحديثة',
    contractNumber: 'CON-2024-001',
    installmentNumber: 4,
    totalInstallments: 12,
    amount: 12500,
    dueDate: '2024-04-15',
    paidDate: '2024-04-14',
    status: 'paid',
    method: 'تحويل بنكي',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  {
    id: '5',
    customerName: 'شركة البناء الحديثة',
    contractNumber: 'CON-2024-001',
    installmentNumber: 5,
    totalInstallments: 12,
    amount: 12500,
    dueDate: '2024-05-15',
    paidDate: '2024-05-14',
    status: 'paid',
    method: 'تحويل بنكي',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  {
    id: '6',
    customerName: 'شركة البناء الحديثة',
    contractNumber: 'CON-2024-001',
    installmentNumber: 6,
    totalInstallments: 12,
    amount: 12500,
    dueDate: '2024-06-15',
    paidDate: '2024-06-14',
    status: 'paid',
    method: 'تحويل بنكي',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  {
    id: '7',
    customerName: 'شركة البناء الحديثة',
    contractNumber: 'CON-2024-001',
    installmentNumber: 7,
    totalInstallments: 12,
    amount: 12500,
    dueDate: '2024-07-15',
    paidDate: null,
    status: 'upcoming',
    method: null,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
  {
    id: '8',
    customerName: 'شركة البناء الحديثة',
    contractNumber: 'CON-2024-001',
    installmentNumber: 8,
    totalInstallments: 12,
    amount: 12500,
    dueDate: '2024-08-15',
    paidDate: null,
    status: 'upcoming',
    method: null,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
  {
    id: '9',
    customerName: 'شركة البناء الحديثة',
    contractNumber: 'CON-2024-001',
    installmentNumber: 9,
    totalInstallments: 12,
    amount: 12500,
    dueDate: '2024-09-15',
    paidDate: null,
    status: 'upcoming',
    method: null,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
  {
    id: '10',
    customerName: 'شركة البناء الحديثة',
    contractNumber: 'CON-2024-001',
    installmentNumber: 10,
    totalInstallments: 12,
    amount: 12500,
    dueDate: '2024-10-15',
    paidDate: null,
    status: 'upcoming',
    method: null,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
  {
    id: '11',
    customerName: 'شركة البناء الحديثة',
    contractNumber: 'CON-2024-001',
    installmentNumber: 11,
    totalInstallments: 12,
    amount: 12500,
    dueDate: '2024-11-15',
    paidDate: null,
    status: 'upcoming',
    method: null,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
  {
    id: '12',
    customerName: 'شركة البناء الحديثة',
    contractNumber: 'CON-2024-001',
    installmentNumber: 12,
    totalInstallments: 12,
    amount: 12500,
    dueDate: '2024-12-15',
    paidDate: null,
    status: 'upcoming',
    method: null,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
  // فندق الوردة - CON-2024-002 (6 أقساط)
  {
    id: '13',
    customerName: 'فندق الوردة',
    contractNumber: 'CON-2024-002',
    installmentNumber: 1,
    totalInstallments: 6,
    amount: 25000,
    dueDate: '2024-02-01',
    paidDate: '2024-01-30',
    status: 'paid',
    method: 'نقدي',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  {
    id: '14',
    customerName: 'فندق الوردة',
    contractNumber: 'CON-2024-002',
    installmentNumber: 2,
    totalInstallments: 6,
    amount: 25000,
    dueDate: '2024-03-01',
    paidDate: '2024-02-28',
    status: 'paid',
    method: 'نقدي',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  {
    id: '15',
    customerName: 'فندق الوردة',
    contractNumber: 'CON-2024-002',
    installmentNumber: 3,
    totalInstallments: 6,
    amount: 25000,
    dueDate: '2024-04-01',
    paidDate: null,
    status: 'overdue',
    method: null,
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  },
  {
    id: '16',
    customerName: 'فندق الوردة',
    contractNumber: 'CON-2024-002',
    installmentNumber: 4,
    totalInstallments: 6,
    amount: 25000,
    dueDate: '2024-05-01',
    paidDate: null,
    status: 'upcoming',
    method: null,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
  {
    id: '17',
    customerName: 'فندق الوردة',
    contractNumber: 'CON-2024-002',
    installmentNumber: 5,
    totalInstallments: 6,
    amount: 25000,
    dueDate: '2024-06-01',
    paidDate: null,
    status: 'upcoming',
    method: null,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
  {
    id: '18',
    customerName: 'فندق الوردة',
    contractNumber: 'CON-2024-002',
    installmentNumber: 6,
    totalInstallments: 6,
    amount: 25000,
    dueDate: '2024-07-01',
    paidDate: null,
    status: 'upcoming',
    method: null,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
];

const trackingStats = [
  {
    title: 'إجمالي المدفوعات',
    value: '18',
    change: '+2',
    icon: TrendingUp,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
  },
  {
    title: 'المدفوعة',
    value: '8',
    change: '+1',
    icon: DollarSign,
    color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
  },
  {
    title: 'القادمة',
    value: '9',
    change: '+3',
    icon: Calendar,
    color:
      'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300',
  },
  {
    title: 'المتأخرة',
    value: '1',
    change: '+1',
    icon: AlertCircle,
    color: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
  },
];

export default function InstallmentTrackingPage() {
  const [_isLoading, _setIsLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'list' | 'details'>('list');

  // معالجة تصدير البيانات
  const handleExportData = () => {
    alert('تم تصدير بيانات تتبع المدفوعات بنجاح');
  };

  // معالجة عرض تفاصيل العميل
  const handleViewInstallment = (installment: any) => {
    // تجميع جميع أقساط العميل
    const customerInstallments = installmentTracking.filter(
      item => item.customerName === installment.customerName && 
               item.contractNumber === installment.contractNumber
    );
    
    // حساب الإحصائيات
    const totalAmount = customerInstallments.reduce((sum, item) => sum + item.amount, 0);
    const paidAmount = customerInstallments
      .filter(item => item.status === 'paid')
      .reduce((sum, item) => sum + item.amount, 0);
    const remainingAmount = totalAmount - paidAmount;
    const paidCount = customerInstallments.filter(item => item.status === 'paid').length;
    const pendingCount = customerInstallments.filter(item => item.status === 'pending').length;
    const overdueCount = customerInstallments.filter(item => item.status === 'overdue').length;
    
    setSelectedCustomer({
      ...installment,
      installments: customerInstallments,
      totalAmount,
      paidAmount,
      remainingAmount,
      paidCount,
      pendingCount,
      overdueCount,
      paymentRatio: totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0
    });
    setViewMode('details');
  };

  // معالجة العودة إلى القائمة
  const handleBackToList = () => {
    setViewMode('list');
    setSelectedCustomer(null);
  };

  // عرض صفحة تفاصيل العميل
  if (viewMode === 'details' && selectedCustomer) {
    return (
      <div className="space-y-6">
        {/* شريط التنقل */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToList}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              العودة للقائمة
            </button>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                تفاصيل العميل: {selectedCustomer.customerName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                العقد: {selectedCustomer.contractNumber}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              طباعة
            </button>
          </div>
        </div>

        {/* إحصائيات العميل */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-[#913D95]/5 hover:border-[#913D95]/30 hover:shadow-lg hover:shadow-[#913D95]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm text-gray-600 group-hover:text-[#913D95] transition-colors duration-300 font-almarai mb-2">
                  إجمالي المبلغ
                </h3>
                <div className="text-2xl font-bold text-[#913D95] group-hover:text-[#7A2F7D] transition-colors duration-300 font-tajawal">
                  {selectedCustomer.totalAmount.toLocaleString()} ريال
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedCustomer.installments.length} قسط
                </p>
              </div>
              <div className="p-2 bg-[#913D95]/10 rounded-lg group-hover:bg-[#913D95]/20 transition-all duration-300">
                <DollarSign className="h-5 w-5 text-[#913D95] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-[#913D95]/5 hover:border-[#913D95]/30 hover:shadow-lg hover:shadow-[#913D95]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm text-gray-600 group-hover:text-[#913D95] transition-colors duration-300 font-almarai mb-2">
                  المبلغ المدفوع
                </h3>
                <div className="text-2xl font-bold text-[#913D95] group-hover:text-[#7A2F7D] transition-colors duration-300 font-tajawal">
                  {selectedCustomer.paidAmount.toLocaleString()} ريال
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedCustomer.paidCount} قسط مدفوع
                </p>
              </div>
              <div className="p-2 bg-[#913D95]/10 rounded-lg group-hover:bg-[#913D95]/20 transition-all duration-300">
                <TrendingUp className="h-5 w-5 text-[#913D95] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-[#913D95]/5 hover:border-[#913D95]/30 hover:shadow-lg hover:shadow-[#913D95]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm text-gray-600 group-hover:text-[#913D95] transition-colors duration-300 font-almarai mb-2">
                  المبلغ المتبقي
                </h3>
                <div className="text-2xl font-bold text-[#913D95] group-hover:text-[#7A2F7D] transition-colors duration-300 font-tajawal">
                  {selectedCustomer.remainingAmount.toLocaleString()} ريال
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedCustomer.pendingCount + selectedCustomer.overdueCount} قسط متبقي
                </p>
              </div>
              <div className="p-2 bg-[#913D95]/10 rounded-lg group-hover:bg-[#913D95]/20 transition-all duration-300">
                <Calendar className="h-5 w-5 text-[#913D95] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-[#913D95]/5 hover:border-[#913D95]/30 hover:shadow-lg hover:shadow-[#913D95]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm text-gray-600 group-hover:text-[#913D95] transition-colors duration-300 font-almarai mb-2">
                  نسبة السداد
                </h3>
                <div className="text-2xl font-bold text-[#913D95] group-hover:text-[#7A2F7D] transition-colors duration-300 font-tajawal">
                  {selectedCustomer.paymentRatio}%
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  من إجمالي المبلغ
                </p>
              </div>
              <div className="p-2 bg-[#913D95]/10 rounded-lg group-hover:bg-[#913D95]/20 transition-all duration-300">
                <Activity className="h-5 w-5 text-[#913D95] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </div>

        {/* تفاصيل المدفوعات */}
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل المدفوعات</CardTitle>
            <CardDescription>جميع أقساط العميل مع حالة الدفع</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      رقم القسط
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      المبلغ
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      تاريخ الاستحقاق
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      تاريخ الدفع
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      طريقة الدفع
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      الحالة
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCustomer.installments.map((installment: any) => (
                    <tr
                      key={installment.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          القسط {installment.installmentNumber} من {installment.totalInstallments}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {installment.amount.toLocaleString()} ريال
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {installment.dueDate}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {installment.paidDate || '-'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {installment.method || '-'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${installment.color}`}
                        >
                          {installment.status === 'paid'
                            ? 'مدفوع'
                            : installment.status === 'pending'
                            ? 'معلق'
                            : installment.status === 'overdue'
                            ? 'متأخر'
                            : 'قادم'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* تنبيهات التأخير */}
        {selectedCustomer.overdueCount > 0 && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="h-5 w-5" />
                تنبيهات التأخير
              </CardTitle>
              <CardDescription>
                يوجد {selectedCustomer.overdueCount} قسط متأخر يحتاج متابعة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {selectedCustomer.installments
                  .filter((installment: any) => installment.status === 'overdue')
                  .map((installment: any) => (
                    <div key={installment.id} className="flex items-center justify-between p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                      <div>
                        <div className="font-medium text-red-800 dark:text-red-200">
                          القسط {installment.installmentNumber} - {installment.amount.toLocaleString()} ريال
                        </div>
                        <div className="text-sm text-red-600 dark:text-red-400">
                          متأخر منذ: {installment.dueDate}
                        </div>
                      </div>
                      <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors">
                        إرسال تذكير
                      </button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* أزرار الوصول السريع */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          <h2 className="text-xl font-semibold">تتبع المدفوعات</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportData}
            className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Download className="h-4 w-4" />
            تصدير
          </button>
        </div>
      </div>

      {/* إحصائيات تتبع المدفوعات */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <h2 className="text-xl font-semibold">إحصائيات تتبع المدفوعات</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {trackingStats.map((stat, index) => {
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

      {/* جدول تتبع المدفوعات */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          <h2 className="text-xl font-semibold">تتبع المدفوعات</h2>
        </div>
        
        {/* شريط البحث والفلترة */}
        <Card>
          <CardContent className='pt-6'>
            <div className='flex items-center space-x-4 rtl:space-x-reverse'>
              <div className='flex-1 relative'>
                <Search className='absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                <input
                  type='text'
                  placeholder='البحث في المدفوعات...'
                  className='w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white'
                />
              </div>
              <button className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                <Filter className='h-4 w-4' />
                فلترة متقدمة
              </button>
            </div>
          </CardContent>
        </Card>

        {/* جدول تتبع المدفوعات */}
        <Card>
          <CardHeader>
            <CardTitle>تتبع المدفوعات</CardTitle>
            <CardDescription>جميع المدفوعات وحالة المدفوعات</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      العميل / الشركة
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      رقم العقد
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      القسط
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      المبلغ
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      تاريخ الاستحقاق
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      تاريخ الدفع
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      طريقة الدفع
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      الحالة
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {installmentTracking.map(installment => (
                    <tr
                      key={installment.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {installment.customerName}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {installment.contractNumber}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {installment.installmentNumber} من {installment.totalInstallments}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {installment.amount.toLocaleString()} ريال
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {installment.dueDate}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {installment.paidDate || '-'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {installment.method || '-'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${installment.color}`}
                        >
                          {installment.status === 'paid'
                            ? 'مدفوع'
                            : installment.status === 'pending'
                            ? 'معلق'
                            : installment.status === 'overdue'
                            ? 'متأخر'
                            : 'قادم'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleViewInstallment(installment)}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          title="عرض التفاصيل"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* تحميل المزيد */}
            <div className='mt-6 text-center'>
              <button className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 mx-auto">
                تحميل المزيد
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

