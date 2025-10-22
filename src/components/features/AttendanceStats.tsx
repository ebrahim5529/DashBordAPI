/**
 * مكون إحصائيات الحضور والانصراف
 */

import React from 'react';
import { AttendanceStats as AttendanceStatsType } from '@/data/attendanceData';
import { CheckCircle, XCircle, Calendar, TrendingUp } from 'lucide-react';

interface AttendanceStatsProps {
  stats: AttendanceStatsType;
}

export function AttendanceStats({ stats }: AttendanceStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* إجمالي الحضور */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm text-gray-600 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
              إجمالي الحضور
            </h3>
            <div className="text-2xl font-bold text-[#58d2c8] group-hover:text-[#4AB8B3] transition-colors duration-300 font-tajawal">
              {stats.totalAttendance}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.presentDays} حاضر، {stats.absentDays} غائب
            </p>
          </div>
          <div className="p-2 bg-[#58d2c8]/10 rounded-lg group-hover:bg-[#58d2c8]/20 transition-all duration-300">
            <Calendar className="h-5 w-5 text-[#58d2c8] group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
      </div>

      {/* أيام الحضور */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm text-gray-600 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
              أيام الحضور
            </h3>
            <div className="text-2xl font-bold text-[#58d2c8] group-hover:text-[#4AB8B3] transition-colors duration-300 font-tajawal">
              {stats.presentDays}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {((stats.presentDays / stats.totalAttendance) * 100).toFixed(1)}% من إجمالي الأيام
            </p>
          </div>
          <div className="p-2 bg-[#58d2c8]/10 rounded-lg group-hover:bg-[#58d2c8]/20 transition-all duration-300">
            <CheckCircle className="h-5 w-5 text-[#58d2c8] group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
      </div>

      {/* أيام الغياب */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm text-gray-600 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
              أيام الغياب
            </h3>
            <div className="text-2xl font-bold text-[#58d2c8] group-hover:text-[#4AB8B3] transition-colors duration-300 font-tajawal">
              {stats.absentDays}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {((stats.absentDays / stats.totalAttendance) * 100).toFixed(1)}% من إجمالي الأيام
            </p>
          </div>
          <div className="p-2 bg-[#58d2c8]/10 rounded-lg group-hover:bg-[#58d2c8]/20 transition-all duration-300">
            <XCircle className="h-5 w-5 text-[#58d2c8] group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
      </div>

      {/* متوسط ساعات العمل */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm text-gray-600 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
              متوسط ساعات العمل
            </h3>
            <div className="text-2xl font-bold text-[#58d2c8] group-hover:text-[#4AB8B3] transition-colors duration-300 font-tajawal">
              {stats.averageHours} ساعة
            </div>
            <p className="text-xs text-gray-500 mt-1">
              يومياً
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
