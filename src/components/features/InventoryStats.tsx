/**
 * مكون إحصائيات المخزون
 */

'use client';

import React from 'react';
import { InventoryStats as InventoryStatsType } from '@/lib/types/inventory';
import {
  CheckCircle,
  DollarSign,
  Wrench,
  TrendingUp,
} from 'lucide-react';

interface InventoryStatsProps {
  stats: InventoryStatsType;
}

export function InventoryStats({ stats }: InventoryStatsProps) {
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
        {/* السقالات المتوفرة */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-[#913D95]/5 hover:border-[#913D95]/30 hover:shadow-lg hover:shadow-[#913D95]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 group-hover:text-[#913D95] transition-colors duration-300 font-almarai mb-2">
                السقالات المتوفرة
              </h3>
              <div className="text-2xl font-bold text-[#913D95] group-hover:text-[#7A2F7D] transition-colors duration-300 font-tajawal">
                {stats.availableScaffolds || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                من إجمالي {stats.totalScaffolds || 0} سقالة
              </p>
            </div>
            <div className="p-2 bg-[#913D95]/10 rounded-lg group-hover:bg-[#913D95]/20 transition-all duration-300">
              <CheckCircle className="h-5 w-5 text-[#913D95] group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* السقالات المستأجرة */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-[#913D95]/5 hover:border-[#913D95]/30 hover:shadow-lg hover:shadow-[#913D95]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 group-hover:text-[#913D95] transition-colors duration-300 font-almarai mb-2">
                السقالات المستأجرة
              </h3>
              <div className="text-2xl font-bold text-[#913D95] group-hover:text-[#7A2F7D] transition-colors duration-300 font-tajawal">
                {stats.rentedScaffolds || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                بقيمة {stats.rentedValue?.toLocaleString() || 0} ريال
              </p>
            </div>
            <div className="p-2 bg-[#913D95]/10 rounded-lg group-hover:bg-[#913D95]/20 transition-all duration-300">
              <TrendingUp className="h-5 w-5 text-[#913D95] group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* السقالات المباعة */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-[#913D95]/5 hover:border-[#913D95]/30 hover:shadow-lg hover:shadow-[#913D95]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 group-hover:text-[#913D95] transition-colors duration-300 font-almarai mb-2">
                السقالات المباعة
              </h3>
              <div className="text-2xl font-bold text-[#913D95] group-hover:text-[#7A2F7D] transition-colors duration-300 font-tajawal">
                {stats.soldScaffolds || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                بقيمة {stats.soldValue?.toLocaleString() || 0} ريال
              </p>
            </div>
            <div className="p-2 bg-[#913D95]/10 rounded-lg group-hover:bg-[#913D95]/20 transition-all duration-300">
              <DollarSign className="h-5 w-5 text-[#913D95] group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* السقالات تحت الصيانة */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-[#913D95]/5 hover:border-[#913D95]/30 hover:shadow-lg hover:shadow-[#913D95]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 group-hover:text-[#913D95] transition-colors duration-300 font-almarai mb-2">
                تحت الصيانة
              </h3>
              <div className="text-2xl font-bold text-[#913D95] group-hover:text-[#7A2F7D] transition-colors duration-300 font-tajawal">
                {stats.maintenanceScaffolds || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.maintenanceDueItems || 0} تحتاج صيانة
              </p>
            </div>
            <div className="p-2 bg-[#913D95]/10 rounded-lg group-hover:bg-[#913D95]/20 transition-all duration-300">
              <Wrench className="h-5 w-5 text-[#913D95] group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
