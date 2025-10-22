/**
 * مكون إحصائيات الموردين
 */

'use client';

import React from 'react';
import { SupplierStats as SupplierStatsType } from '@/lib/types/supplier';
import {
  Users,
  Building2,
  User,
  MapPin,
} from 'lucide-react';

interface SupplierStatsProps {
  stats: SupplierStatsType;
}

export function SupplierStats({ stats }: SupplierStatsProps) {
  // التحقق من وجود البيانات
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* إجمالي الموردين */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:bg-[#913D95]/5 hover:border-[#913D95]/30 hover:shadow-lg hover:shadow-[#913D95]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[120px]">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm text-gray-600 group-hover:text-[#913D95] transition-colors duration-300 font-almarai mb-2">
              إجمالي الموردين
            </h3>
            <div className="text-2xl font-bold text-[#913D95] group-hover:text-[#7A2F7D] transition-colors duration-300 font-tajawal">
              {stats.totalSuppliers || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.activeSuppliers || 0} نشط، {stats.inactiveSuppliers || 0} غير نشط
            </p>
          </div>
          <div className="p-2 bg-[#913D95]/10 rounded-lg group-hover:bg-[#913D95]/20 transition-all duration-300">
            <Users className="h-6 w-6 text-[#913D95] group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
      </div>

        {/* أنواع الموردين */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:bg-[#913D95]/5 hover:border-[#913D95]/30 hover:shadow-lg hover:shadow-[#913D95]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[120px]">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm text-gray-600 group-hover:text-[#913D95] transition-colors duration-300 font-almarai mb-2">
              أنواع الموردين
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-green-600" />
                  <span className="text-sm">أفراد</span>
                </div>
                <span className="text-sm font-medium text-[#913D95]">{stats.individualSuppliers || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">شركات</span>
                </div>
                <span className="text-sm font-medium text-[#913D95]">{stats.companySuppliers || 0}</span>
              </div>
            </div>
          </div>
          <div className="p-2 bg-[#913D95]/10 rounded-lg group-hover:bg-[#913D95]/20 transition-all duration-300">
            <Building2 className="h-6 w-6 text-[#913D95] group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
      </div>

        {/* توزيع الجنسيات */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:bg-[#913D95]/5 hover:border-[#913D95]/30 hover:shadow-lg hover:shadow-[#913D95]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[120px]">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm text-gray-600 group-hover:text-[#913D95] transition-colors duration-300 font-almarai mb-2">
              توزيع الجنسيات
            </h3>
            <div className="space-y-2">
              {stats.nationalityDistribution && Object.entries(stats.nationalityDistribution).slice(0, 3).map(([nationality, count]) => (
                <div key={nationality} className="flex items-center justify-between">
                  <span className="text-sm truncate">{nationality}</span>
                  <span className="text-sm font-medium text-[#913D95]">{count}</span>
                </div>
              ))}
              {(!stats.nationalityDistribution || Object.keys(stats.nationalityDistribution).length === 0) && (
                <div className="text-xs text-gray-500 text-center">
                  لا توجد بيانات
                </div>
              )}
              {stats.nationalityDistribution && Object.keys(stats.nationalityDistribution).length > 3 && (
                <div className="text-xs text-gray-500 text-center pt-1">
                  +{Object.keys(stats.nationalityDistribution).length - 3} أخرى
                </div>
              )}
            </div>
          </div>
          <div className="p-2 bg-[#913D95]/10 rounded-lg group-hover:bg-[#913D95]/20 transition-all duration-300">
            <MapPin className="h-6 w-6 text-[#913D95] group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
