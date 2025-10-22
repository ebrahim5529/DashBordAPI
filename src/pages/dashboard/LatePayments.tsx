/**
 * صفحة المدفوعات المتأخرة
 * إدارة ومتابعة المدفوعات المتأخرة مع جدول تفاعلي
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
  AlertCircle,
  Phone,
  MessageSquare,
  Clock,
  DollarSign,
  Calendar,
  TrendingUp,
  Bell,
} from 'lucide-react';

// بيانات وهمية للمدفوعات المتأخرة
const overdueInstallments = [
  {
    id: '1',
    customerName: 'شركة البناء الحديثة',
    contractNumber: 'CON-2024-001',
    amount: 12500,
    dueDate: new Date('2024-01-15'),
    daysLate: 15,
    status: 'OVERDUE',
    priority: 'high',
  },
  {
    id: '2',
    customerName: 'مؤسسة الإنشاءات المتقدمة',
    contractNumber: 'CON-2024-002',
    amount: 8333,
    dueDate: new Date('2024-01-10'),
    daysLate: 20,
    status: 'OVERDUE',
    priority: 'high',
  },
  {
    id: '3',
    customerName: 'شركة المقاولات الكبرى',
    contractNumber: 'CON-2024-003',
    amount: 10000,
    dueDate: new Date('2023-12-20'),
    daysLate: 35,
    status: 'OVERDUE',
    priority: 'urgent',
  },
];

export default function LatePaymentsPage() {
  const [_isLoading, _setIsLoading] = useState(false);

  // حساب الإحصائيات
  const totalLatePayments = overdueInstallments.length;
  const totalAmount = overdueInstallments.reduce(
    (sum, installment) => sum + installment.amount,
    0
  );
  const contactedCount = 1;
  const pendingCount = overdueInstallments.filter(
    i => i.status === 'PENDING'
  ).length;
  const escalatedCount = overdueInstallments.filter(
    i => i.status === 'OVERDUE'
  ).length;

  // حساب متوسط أيام التأخير
  const averageDaysLate = Math.round(
    overdueInstallments.reduce((sum, installment) => sum + installment.daysLate, 0) / 
    overdueInstallments.length
  );

  // تصنيف المدفوعات حسب الأولوية
  const paymentsByPriority = {
    urgent: overdueInstallments.filter(i => i.priority === 'urgent').length,
    high: overdueInstallments.filter(i => i.priority === 'high').length,
  };

  // معالجة إرسال تذكيرات
  const handleSendReminders = () => {
    alert('تم إرسال التذكيرات للعملاء المتأخرين');
  };

  // معالجة إضافة متأخرة جديدة
  const handleAddLatePayment = () => {
    alert('تم فتح نموذج إضافة مدفوعات متأخرة جديدة');
  };

  return (
    <div className="space-y-6">
      {/* أزرار الوصول السريع */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h2 className="text-xl font-semibold">المدفوعات المتأخرة</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSendReminders}
            className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <MessageSquare className="h-4 w-4" />
            إرسال تذكيرات
          </button>
          <button
            onClick={handleAddLatePayment}
            className="flex items-center gap-2 bg-[#58d2c8] hover:bg-[#4bb5ab] text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <AlertCircle className="h-4 w-4" />
            إضافة متأخرة جديدة
          </button>
        </div>
      </div>

      {/* إحصائيات المدفوعات المتأخرة */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <h2 className="text-xl font-semibold">إحصائيات المدفوعات المتأخرة</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-[#913D95]/5 hover:border-[#913D95]/30 hover:shadow-lg hover:shadow-[#913D95]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm text-gray-600 group-hover:text-[#913D95] transition-colors duration-300 font-almarai mb-2">
                  إجمالي المتأخرات
                </h3>
                <div className="text-2xl font-bold text-[#913D95] group-hover:text-[#7A2F7D] transition-colors duration-300 font-tajawal">
                  {totalLatePayments}
                </div>
                <p className="text-xs text-gray-500 mt-1 flex items-center">
                  <TrendingUp className='h-3 w-3 mr-1 text-red-500' />
                  +2 من الأسبوع الماضي
                </p>
              </div>
              <div className="p-2 bg-[#913D95]/10 rounded-lg group-hover:bg-[#913D95]/20 transition-all duration-300">
                <AlertCircle className="h-5 w-5 text-[#913D95] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-[#913D95]/5 hover:border-[#913D95]/30 hover:shadow-lg hover:shadow-[#913D95]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm text-gray-600 group-hover:text-[#913D95] transition-colors duration-300 font-almarai mb-2">
                  المبلغ المتأخر
                </h3>
                <div className="text-2xl font-bold text-[#913D95] group-hover:text-[#7A2F7D] transition-colors duration-300 font-tajawal">
                  {totalAmount.toLocaleString()} ريال
                </div>
                <p className="text-xs text-gray-500 mt-1 flex items-center">
                  <TrendingUp className='h-3 w-3 mr-1 text-orange-500' />
                  +12,000 من الأسبوع الماضي
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
                  تم التواصل
                </h3>
                <div className="text-2xl font-bold text-[#913D95] group-hover:text-[#7A2F7D] transition-colors duration-300 font-tajawal">
                  {contactedCount}
                </div>
                <p className="text-xs text-gray-500 mt-1 flex items-center">
                  <TrendingUp className='h-3 w-3 mr-1 text-blue-500' />
                  +1 من الأسبوع الماضي
                </p>
              </div>
              <div className="p-2 bg-[#913D95]/10 rounded-lg group-hover:bg-[#913D95]/20 transition-all duration-300">
                <Phone className="h-5 w-5 text-[#913D95] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-[#913D95]/5 hover:border-[#913D95]/30 hover:shadow-lg hover:shadow-[#913D95]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm text-gray-600 group-hover:text-[#913D95] transition-colors duration-300 font-almarai mb-2">
                  تحتاج متابعة
                </h3>
                <div className="text-2xl font-bold text-[#913D95] group-hover:text-[#7A2F7D] transition-colors duration-300 font-tajawal">
                  {pendingCount + escalatedCount}
                </div>
                <p className="text-xs text-gray-500 mt-1 flex items-center">
                  <TrendingUp className='h-3 w-3 mr-1 text-yellow-500' />
                  +1 من الأسبوع الماضي
                </p>
              </div>
              <div className="p-2 bg-[#913D95]/10 rounded-lg group-hover:bg-[#913D95]/20 transition-all duration-300">
                <Clock className="h-5 w-5 text-[#913D95] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* تنبيهات المدفوعات المتأخرة */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h2 className="text-xl font-semibold">تنبيهات المدفوعات المتأخرة</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center space-x-2 rtl:space-x-reverse'>
              <AlertCircle className='h-5 w-5 text-red-500' />
              <span>تنبيهات المدفوعات المتأخرة</span>
            </CardTitle>
            <CardDescription>
              المدفوعات التي تحتاج إلى متابعة فورية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              <div className='flex items-center space-x-3 rtl:space-x-reverse p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
                <AlertCircle className='h-5 w-5 text-red-600' />
                <div>
                  <p className='text-sm font-medium text-red-800 dark:text-red-200'>
                    {paymentsByPriority.urgent} مدفوعات عاجلة
                  </p>
                  <p className='text-xs text-red-600 dark:text-red-400'>
                    تحتاج إلى متابعة فورية
                  </p>
                </div>
              </div>

              <div className='flex items-center space-x-3 rtl:space-x-reverse p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg'>
                <Clock className='h-5 w-5 text-orange-600' />
                <div>
                  <p className='text-sm font-medium text-orange-800 dark:text-orange-200'>
                    {paymentsByPriority.high} مدفوعات عالية الأولوية
                  </p>
                  <p className='text-xs text-orange-600 dark:text-orange-400'>
                    تحتاج إلى متابعة سريعة
                  </p>
                </div>
              </div>

              <div className='flex items-center space-x-3 rtl:space-x-reverse p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg'>
                <Calendar className='h-5 w-5 text-yellow-600' />
                <div>
                  <p className='text-sm font-medium text-yellow-800 dark:text-yellow-200'>
                    متوسط التأخير: {averageDaysLate} يوم
                  </p>
                  <p className='text-xs text-yellow-600 dark:text-yellow-400'>
                    يحتاج إلى تحسين
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* جدول المدفوعات المتأخرة */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <h2 className="text-xl font-semibold">المدفوعات المتأخرة</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>جدول المدفوعات المتأخرة</CardTitle>
            <CardDescription>جميع المدفوعات المتأخرة التي تحتاج إلى متابعة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {overdueInstallments.map(installment => (
                <div
                  key={installment.id}
                  className='flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
                >
                  <div className='flex items-center space-x-4 rtl:space-x-reverse'>
                    <div className={`p-2 rounded-lg ${
                      installment.priority === 'urgent' 
                        ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
                        : 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300'
                    }`}>
                      <AlertCircle className='h-5 w-5' />
                    </div>
                    <div className='flex-1'>
                      <h3 className='font-semibold text-gray-900 dark:text-white'>
                        {installment.customerName}
                      </h3>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        {installment.contractNumber}
                      </p>
                      <div className='flex items-center space-x-6 rtl:space-x-reverse mt-2'>
                        <div className='flex items-center space-x-1 rtl:space-x-reverse'>
                          <DollarSign className='h-4 w-4 text-gray-400' />
                          <span className='text-xs text-gray-500'>
                            {installment.amount.toLocaleString()} ريال
                          </span>
                        </div>
                        <div className='flex items-center space-x-1 rtl:space-x-reverse'>
                          <Calendar className='h-4 w-4 text-gray-400' />
                          <span className='text-xs text-gray-500'>
                            متأخر {installment.daysLate} يوم
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2 rtl:space-x-reverse'>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        installment.priority === 'urgent'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                      }`}
                    >
                      {installment.priority === 'urgent' ? 'عاجل' : 'عالي'}
                    </span>
                    <button className="p-1 text-gray-500 hover:text-blue-600 transition-colors">
                      <Phone className='h-4 w-4' />
                    </button>
                    <button className="p-1 text-gray-500 hover:text-green-600 transition-colors">
                      <MessageSquare className='h-4 w-4' />
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

