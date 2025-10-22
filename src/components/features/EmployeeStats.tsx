/**
 * مكون إحصائيات الموظفين
 */

import React from 'react';
import { EmployeeStats as EmployeeStatsType } from '@/lib/types/employee';
import { Users, UserCheck, DollarSign, TrendingUp } from 'lucide-react';
import { formatNumber } from '@/lib/utils/formatNumbers';

interface EmployeeStatsProps {
  stats: EmployeeStatsType;
}

export function EmployeeStats({ stats }: EmployeeStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* إجمالي الموظفين */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm text-gray-600 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
              إجمالي الموظفين
            </h3>
            <div className="text-2xl font-bold text-[#58d2c8] group-hover:text-[#4AB8B3] transition-colors duration-300 font-tajawal">
              {stats.totalEmployees}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.activeEmployees} نشط، {stats.inactiveEmployees} غير نشط
            </p>
          </div>
          <div className="p-2 bg-[#58d2c8]/10 rounded-lg group-hover:bg-[#58d2c8]/20 transition-all duration-300">
            <Users className="h-5 w-5 text-[#58d2c8] group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
      </div>

      {/* الموظفين النشطين */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm text-gray-600 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
              الموظفين النشطين
            </h3>
            <div className="text-2xl font-bold text-[#58d2c8] group-hover:text-[#4AB8B3] transition-colors duration-300 font-tajawal">
              {stats.activeEmployees}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {((stats.activeEmployees / stats.totalEmployees) * 100).toFixed(1)}% من إجمالي الموظفين
            </p>
          </div>
          <div className="p-2 bg-[#58d2c8]/10 rounded-lg group-hover:bg-[#58d2c8]/20 transition-all duration-300">
            <UserCheck className="h-5 w-5 text-[#58d2c8] group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
      </div>

      {/* متوسط الراتب */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm text-gray-600 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
              متوسط الراتب
            </h3>
            <div className="text-2xl font-bold text-[#58d2c8] group-hover:text-[#4AB8B3] transition-colors duration-300 font-tajawal">
              {formatNumber(stats.averageSalary)} ر.ع
            </div>
            <p className="text-xs text-gray-500 mt-1">
              شهرياً
            </p>
          </div>
          <div className="p-2 bg-[#58d2c8]/10 rounded-lg group-hover:bg-[#58d2c8]/20 transition-all duration-300">
            <DollarSign className="h-5 w-5 text-[#58d2c8] group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
      </div>

      {/* إجمالي تكلفة الرواتب */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm text-gray-600 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
              إجمالي تكلفة الرواتب
            </h3>
            <div className="text-2xl font-bold text-[#58d2c8] group-hover:text-[#4AB8B3] transition-colors duration-300 font-tajawal">
              {formatNumber(stats.totalSalaryCost)} ر.ع
            </div>
            <p className="text-xs text-gray-500 mt-1">
              شهرياً
            </p>
          </div>
          <div className="p-2 bg-[#58d2c8]/10 rounded-lg group-hover:bg-[#58d2c8]/20 transition-all duration-300">
            <TrendingUp className="h-5 w-5 text-[#58d2c8] group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
