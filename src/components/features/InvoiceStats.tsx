/**
 * مكون إحصائيات الفواتير
 */

'use client';

import React from 'react';
import { InvoiceStats as InvoiceStatsType } from '@/lib/types/financial';
import {
  FileText,
  CheckCircle,
  Clock,
  DollarSign,
} from 'lucide-react';

interface InvoiceStatsProps {
  stats: InvoiceStatsType;
}

export function InvoiceStats({ stats }: InvoiceStatsProps) {
  // التحقق من وجود البيانات
  if (!stats) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* إجمالي الفواتير */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors duration-300 font-almarai mb-2">
                إجمالي الفواتير
              </h3>
              <div className="text-2xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors duration-300 font-tajawal">
                {stats.totalInvoices || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                صادرة: {stats.typeDistribution?.OUTGOING || 0} | واردة: {stats.typeDistribution?.INCOMING || 0}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-all duration-300">
              <FileText className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* الفواتير المدفوعة */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-green-50 hover:border-green-200 hover:shadow-lg hover:shadow-green-100 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 group-hover:text-green-600 transition-colors duration-300 font-almarai mb-2">
                الفواتير المدفوعة
              </h3>
              <div className="text-2xl font-bold text-green-600 group-hover:text-green-700 transition-colors duration-300 font-tajawal">
                {stats.paidInvoices || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.paidAmount?.toLocaleString() || 0} ريال
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-all duration-300">
              <CheckCircle className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* الفواتير غير المدفوعة */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:shadow-lg hover:shadow-red-100 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 group-hover:text-red-600 transition-colors duration-300 font-almarai mb-2">
                غير مدفوعة
              </h3>
              <div className="text-2xl font-bold text-red-600 group-hover:text-red-700 transition-colors duration-300 font-tajawal">
                {stats.unpaidInvoices || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.unpaidAmount?.toLocaleString() || 0} ريال
              </p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-all duration-300">
              <Clock className="h-5 w-5 text-red-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* إجمالي المبالغ */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-purple-50 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-100 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 group-hover:text-purple-600 transition-colors duration-300 font-almarai mb-2">
                إجمالي المبالغ
              </h3>
              <div className="text-2xl font-bold text-purple-600 group-hover:text-purple-700 transition-colors duration-300 font-tajawal">
                {stats.totalAmount?.toLocaleString() || 0} ريال
              </div>
              <p className="text-xs text-gray-500 mt-1">
                متوسط: {stats.averageInvoiceValue?.toLocaleString() || 0} ريال
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-all duration-300">
              <DollarSign className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}