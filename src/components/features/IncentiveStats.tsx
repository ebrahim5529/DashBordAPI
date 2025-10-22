/**
 * مكون إحصائيات الحوافز
 */

import React from 'react';
import { IncentiveStats as IncentiveStatsType } from '@/data/incentivesData';
import { Gift, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { formatNumber } from '@/lib/utils/formatNumbers';

interface IncentiveStatsProps {
  stats: IncentiveStatsType;
}

export function IncentiveStats({ stats }: IncentiveStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* إجمالي الحوافز */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm text-gray-600 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
              إجمالي الحوافز
            </h3>
            <div className="text-2xl font-bold text-[#58d2c8] group-hover:text-[#4AB8B3] transition-colors duration-300 font-tajawal">
              {stats.totalIncentives}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.approvedIncentives} معتمدة، {stats.pendingIncentives} معلقة
            </p>
          </div>
          <div className="p-2 bg-[#58d2c8]/10 rounded-lg group-hover:bg-[#58d2c8]/20 transition-all duration-300">
            <Gift className="h-5 w-5 text-[#58d2c8] group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
      </div>

      {/* إجمالي المبلغ */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm text-gray-600 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
              إجمالي المبلغ
            </h3>
            <div className="text-2xl font-bold text-[#58d2c8] group-hover:text-[#4AB8B3] transition-colors duration-300 font-tajawal">
              {formatNumber(stats.totalAmount)} ر.ع
            </div>
            <p className="text-xs text-gray-500 mt-1">
              هذا الشهر
            </p>
          </div>
          <div className="p-2 bg-[#58d2c8]/10 rounded-lg group-hover:bg-[#58d2c8]/20 transition-all duration-300">
            <DollarSign className="h-5 w-5 text-[#58d2c8] group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
      </div>

      {/* الحوافز المعتمدة */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm text-gray-600 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
              الحوافز المعتمدة
            </h3>
            <div className="text-2xl font-bold text-[#58d2c8] group-hover:text-[#4AB8B3] transition-colors duration-300 font-tajawal">
              {stats.approvedIncentives}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {((stats.approvedIncentives / stats.totalIncentives) * 100).toFixed(1)}% من إجمالي الحوافز
            </p>
          </div>
          <div className="p-2 bg-[#58d2c8]/10 rounded-lg group-hover:bg-[#58d2c8]/20 transition-all duration-300">
            <CheckCircle className="h-5 w-5 text-[#58d2c8] group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
      </div>

      {/* الحوافز المعلقة */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm text-gray-600 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
              الحوافز المعلقة
            </h3>
            <div className="text-2xl font-bold text-[#58d2c8] group-hover:text-[#4AB8B3] transition-colors duration-300 font-tajawal">
              {stats.pendingIncentives}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              في انتظار الموافقة
            </p>
          </div>
          <div className="p-2 bg-[#58d2c8]/10 rounded-lg group-hover:bg-[#58d2c8]/20 transition-all duration-300">
            <Clock className="h-5 w-5 text-[#58d2c8] group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
