'use client';

import React from 'react';
import { Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import { LeaveStats as LeaveStatsType } from '@/lib/types/leaves';

interface LeavesStatsProps {
  stats: LeaveStatsType;
}

export function LeavesStats({ stats }: LeavesStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* إجمالي الطلبات */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm text-gray-600 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
              إجمالي الطلبات
            </h3>
            <div className="text-2xl font-bold text-[#58d2c8] group-hover:text-[#4AB8B3] transition-colors duration-300 font-tajawal">
              {stats.totalLeaves}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.totalDays} إجمالي الأيام
            </p>
          </div>
          <div className="p-2 bg-[#58d2c8]/10 rounded-lg group-hover:bg-[#58d2c8]/20 transition-all duration-300">
            <Calendar className="h-5 w-5 text-[#58d2c8] group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
      </div>

      {/* الطلبات الموافق عليها */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm text-gray-600 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
              موافق عليها
            </h3>
            <div className="text-2xl font-bold text-[#58d2c8] group-hover:text-[#4AB8B3] transition-colors duration-300 font-tajawal">
              {stats.approvedLeaves}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {((stats.approvedLeaves / stats.totalLeaves) * 100).toFixed(1)}% من إجمالي الطلبات
            </p>
          </div>
          <div className="p-2 bg-[#58d2c8]/10 rounded-lg group-hover:bg-[#58d2c8]/20 transition-all duration-300">
            <CheckCircle className="h-5 w-5 text-[#58d2c8] group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
      </div>

      {/* قيد الانتظار */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm text-gray-600 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
              قيد الانتظار
            </h3>
            <div className="text-2xl font-bold text-[#58d2c8] group-hover:text-[#4AB8B3] transition-colors duration-300 font-tajawal">
              {stats.pendingLeaves}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              تحتاج مراجعة
            </p>
          </div>
          <div className="p-2 bg-[#58d2c8]/10 rounded-lg group-hover:bg-[#58d2c8]/20 transition-all duration-300">
            <Clock className="h-5 w-5 text-[#58d2c8] group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
      </div>

      {/* المرفوضة */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm text-gray-600 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
              المرفوضة
            </h3>
            <div className="text-2xl font-bold text-[#58d2c8] group-hover:text-[#4AB8B3] transition-colors duration-300 font-tajawal">
              {stats.rejectedLeaves}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {((stats.rejectedLeaves / stats.totalLeaves) * 100).toFixed(1)}% من إجمالي الطلبات
            </p>
          </div>
          <div className="p-2 bg-[#58d2c8]/10 rounded-lg group-hover:bg-[#58d2c8]/20 transition-all duration-300">
            <XCircle className="h-5 w-5 text-[#58d2c8] group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
