/**
 * صفحة العقود النشطة
 */

import React, { useState } from 'react';
import { FileText, CheckCircle, TrendingUp, DollarSign, Clock, Plus } from 'lucide-react';
import { ActiveContractsTable } from '@/components/features/ActiveContractsTable';
import { mockActiveContractsData, activeContractsStats, ActiveContractData } from '@/data/contractsManagementData';

export default function ActiveContracts() {
  const [isLoading, _setIsLoading] = useState(false);

  // معالجة عرض تفاصيل العقد
  const handleViewContract = (contract: ActiveContractData) => {
    console.log('عرض العقد النشط:', contract.contractNumber);
    alert(`عرض تفاصيل العقد النشط: ${contract.contractNumber}\nالعميل: ${contract.customerName}\nالحالة: ${contract.status}\nالقيمة: ${contract.totalValue} ر.ع`);
  };

  // معالجة تعديل العقد
  const handleEditContract = (contract: ActiveContractData) => {
    console.log('تعديل العقد النشط:', contract.contractNumber);
    alert(`تعديل العقد النشط: ${contract.contractNumber}`);
  };

  // معالجة طباعة العقد
  const handlePrintContract = (contract: ActiveContractData) => {
    console.log('طباعة العقد النشط:', contract.contractNumber);
    window.print();
  };

  return (
    <div className='space-y-6'>
      {/* العنوان الرئيسي */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-[#58d2c8]" />
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            العقود النشطة
          </h1>
        </div>
        <button className="bg-[#58d2c8] text-white px-4 py-2 rounded-lg hover:bg-[#4AB8B3] transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" />
          إضافة عقد جديد
        </button>
      </div>
      <p className='text-gray-600 dark:text-gray-400 mt-2'>
        عرض وإدارة العقود النشطة الحالية مع متابعة التقدم
      </p>

      {/* إحصائيات العقود النشطة */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <h2 className="text-xl font-semibold">إحصائيات العقود النشطة</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* إجمالي العقود النشطة */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[120px]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm text-gray-600 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
                  إجمالي العقود النشطة
                </h3>
                <div className="text-2xl font-bold text-[#58d2c8] group-hover:text-[#4AB8B3] transition-colors duration-300 font-tajawal">
                  {activeContractsStats.totalActiveContracts}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {activeContractsStats.highValueContracts} عالية القيمة، {activeContractsStats.nearExpiryContracts} قريبة الانتهاء
                </p>
              </div>
              <div className="p-2 bg-[#58d2c8]/10 rounded-lg group-hover:bg-[#58d2c8]/20 transition-all duration-300">
                <CheckCircle className="h-6 w-6 text-[#58d2c8] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </div>

          {/* القيمة الإجمالية */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[120px]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm text-gray-600 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
                  القيمة الإجمالية
                </h3>
                <div className="text-2xl font-bold text-[#58d2c8] group-hover:text-[#4AB8B3] transition-colors duration-300 font-tajawal">
                  {new Intl.NumberFormat('ar-SA', {
                    style: 'currency',
                    currency: 'OMR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(activeContractsStats.totalActiveValue)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {new Intl.NumberFormat('ar-SA', {
                    style: 'currency',
                    currency: 'OMR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(activeContractsStats.monthlyRevenue)} إيرادات شهرية
                </p>
              </div>
              <div className="p-2 bg-[#58d2c8]/10 rounded-lg group-hover:bg-[#58d2c8]/20 transition-all duration-300">
                <DollarSign className="h-6 w-6 text-[#58d2c8] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </div>

          {/* العقود عالية الأولوية */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[120px]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm text-gray-600 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
                  عالية الأولوية
                </h3>
                <div className="text-2xl font-bold text-[#58d2c8] group-hover:text-[#4AB8B3] transition-colors duration-300 font-tajawal">
                  {activeContractsStats.highValueContracts}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  تحتاج متابعة عاجلة
                </p>
              </div>
              <div className="p-2 bg-[#58d2c8]/10 rounded-lg group-hover:bg-[#58d2c8]/20 transition-all duration-300">
                <TrendingUp className="h-6 w-6 text-[#58d2c8] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </div>

          {/* العقود المنتهية قريباً */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[120px]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm text-gray-600 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
                  تنتهي قريباً
                </h3>
                <div className="text-2xl font-bold text-[#58d2c8] group-hover:text-[#4AB8B3] transition-colors duration-300 font-tajawal">
                  {activeContractsStats.nearExpiryContracts}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  خلال الـ 30 يوم القادمة
                </p>
              </div>
              <div className="p-2 bg-[#58d2c8]/10 rounded-lg group-hover:bg-[#58d2c8]/20 transition-all duration-300">
                <Clock className="h-6 w-6 text-[#58d2c8] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* جدول العقود النشطة */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          <h2 className="text-xl font-semibold">جدول العقود النشطة</h2>
        </div>
        <ActiveContractsTable
          data={mockActiveContractsData}
          onViewContract={handleViewContract}
          onEditContract={handleEditContract}
          onPrintContract={handlePrintContract}
          isLoading={isLoading}
        />
      </div>

      {/* ملاحظة مهمة */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-green-900">الوصول السريع للعقود الحالية</h4>
            <p className="text-sm text-green-700 mt-1">
              يوفر وصولاً سريعًا للعقود الحالية مع إمكانية متابعة حالتها وتنفيذها ومتابعة التقدم والأيام المتبقية
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}