/**
 * مكون إحصائيات طلبات الشراء
 */

'use client';

import React from 'react';
import { PurchaseRequestStats as PurchaseRequestStatsType } from '@/lib/types/financial';
import {
  ShoppingCart,
  CheckCircle,
  Clock,
  DollarSign,
} from 'lucide-react';

interface PurchaseRequestStatsProps {
  stats: PurchaseRequestStatsType;
}

export function PurchaseRequestStats({ stats }: PurchaseRequestStatsProps) {
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
        {/* الطلبات الجديدة */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors duration-300 font-almarai mb-2">
                الطلبات الجديدة
              </h3>
              <div className="text-2xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors duration-300 font-tajawal">
                {stats.newRequests || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                تحتاج مراجعة
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-all duration-300">
              <ShoppingCart className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* الطلبات قيد المراجعة */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-yellow-50 hover:border-yellow-200 hover:shadow-lg hover:shadow-yellow-100 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 group-hover:text-yellow-600 transition-colors duration-300 font-almarai mb-2">
                قيد المراجعة
              </h3>
              <div className="text-2xl font-bold text-yellow-600 group-hover:text-yellow-700 transition-colors duration-300 font-tajawal">
                {stats.underReviewRequests || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                في انتظار الموافقة
              </p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-all duration-300">
              <Clock className="h-5 w-5 text-yellow-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* الطلبات المكتملة */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-green-50 hover:border-green-200 hover:shadow-lg hover:shadow-green-100 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 group-hover:text-green-600 transition-colors duration-300 font-almarai mb-2">
                الطلبات المكتملة
              </h3>
              <div className="text-2xl font-bold text-green-600 group-hover:text-green-700 transition-colors duration-300 font-tajawal">
                {stats.completedRequests || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                تم التنفيذ بنجاح
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-all duration-300">
              <CheckCircle className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* إجمالي الإنفاق */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-purple-50 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-100 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 group-hover:text-purple-600 transition-colors duration-300 font-almarai mb-2">
                إجمالي الإنفاق
              </h3>
              <div className="text-2xl font-bold text-purple-600 group-hover:text-purple-700 transition-colors duration-300 font-tajawal">
                {stats.totalSpending?.toLocaleString() || 0} ريال
              </div>
              <p className="text-xs text-gray-500 mt-1">
                متوسط: {stats.averageRequestValue?.toLocaleString() || 0} ريال
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
