/**
 * مكون إحصائيات المعاملات المالية
 */

'use client';

import React from 'react';
import { TransactionStats as TransactionStatsType } from '@/lib/types/financial';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
} from 'lucide-react';

interface TransactionStatsProps {
  stats: TransactionStatsType;
}

export function TransactionStats({ stats }: TransactionStatsProps) {
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
        {/* إجمالي الإيرادات */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-green-50 hover:border-green-200 hover:shadow-lg hover:shadow-green-100 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 group-hover:text-green-600 transition-colors duration-300 font-almarai mb-2">
                إجمالي الإيرادات
              </h3>
              <div className="text-2xl font-bold text-green-600 group-hover:text-green-700 transition-colors duration-300 font-tajawal">
                {stats.totalIncome?.toLocaleString() || 0} ريال
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.typeDistribution?.INCOME || 0} معاملة
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-all duration-300">
              <TrendingUp className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* إجمالي المصروفات */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:shadow-lg hover:shadow-red-100 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 group-hover:text-red-600 transition-colors duration-300 font-almarai mb-2">
                إجمالي المصروفات
              </h3>
              <div className="text-2xl font-bold text-red-600 group-hover:text-red-700 transition-colors duration-300 font-tajawal">
                {stats.totalExpenses?.toLocaleString() || 0} ريال
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.typeDistribution?.EXPENSE || 0} معاملة
              </p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-all duration-300">
              <TrendingDown className="h-5 w-5 text-red-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* صافي الربح */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors duration-300 font-almarai mb-2">
                صافي الربح
              </h3>
              <div className={`text-2xl font-bold transition-colors duration-300 font-tajawal ${
                stats.netProfit >= 0 
                  ? 'text-blue-600 group-hover:text-blue-700' 
                  : 'text-red-600 group-hover:text-red-700'
              }`}>
                {stats.netProfit?.toLocaleString() || 0} ريال
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.netProfit >= 0 ? 'ربح' : 'خسارة'}
              </p>
            </div>
            <div className={`p-2 rounded-lg transition-all duration-300 ${
              stats.netProfit >= 0 
                ? 'bg-blue-100 group-hover:bg-blue-200' 
                : 'bg-red-100 group-hover:bg-red-200'
            }`}>
              <DollarSign className={`h-5 w-5 transition-transform duration-300 ${
                stats.netProfit >= 0 ? 'text-blue-600' : 'text-red-600'
              } group-hover:scale-110`} />
            </div>
          </div>
        </div>

        {/* المعاملات اليوم */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-purple-50 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-100 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm text-gray-600 group-hover:text-purple-600 transition-colors duration-300 font-almarai mb-2">
                معاملات اليوم
              </h3>
              <div className="text-2xl font-bold text-purple-600 group-hover:text-purple-700 transition-colors duration-300 font-tajawal">
                {stats.todayTransactions || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.pendingTransactions || 0} معلقة
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-all duration-300">
              <Activity className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
