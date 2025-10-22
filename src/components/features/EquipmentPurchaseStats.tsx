/**
 * مكون إحصائيات مشتريات المعدات
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import {
  Receipt,
  DollarSign,
  Package,
  TrendingUp,
  CheckCircle,
  Clock,
} from 'lucide-react';

interface EquipmentPurchaseStatsData {
  totalPurchases: number;
  pendingPurchases: number;
  confirmedPurchases: number;
  deliveredPurchases: number;
  cancelledPurchases: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  totalItems: number;
  totalQuantity: number;
  averagePurchaseValue: number;
  monthlyPurchases: Record<string, number>;
}

interface EquipmentPurchaseStatsProps {
  stats: EquipmentPurchaseStatsData;
}

export function EquipmentPurchaseStats({ stats }: EquipmentPurchaseStatsProps) {
  const statCards = [
    {
      title: 'إجمالي المشتريات',
      value: stats.totalPurchases.toString(),
      icon: Receipt,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: `${stats.totalItems} عنصر`,
    },
    {
      title: 'إجمالي المبلغ',
      value: `${stats.totalAmount.toLocaleString()} ر.ع.`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: `متوسط ${stats.averagePurchaseValue.toLocaleString()} ر.ع.`,
    },
    {
      title: 'المبلغ المدفوع',
      value: `${stats.paidAmount.toLocaleString()} ر.ع.`,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      change: `${((stats.paidAmount / stats.totalAmount) * 100).toFixed(1)}% من الإجمالي`,
    },
    {
      title: 'المبلغ المتبقي',
      value: `${stats.pendingAmount.toLocaleString()} ر.ع.`,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: `${((stats.pendingAmount / stats.totalAmount) * 100).toFixed(1)}% من الإجمالي`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* بطاقات الإحصائيات الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* حالة المشتريات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            حالة المشتريات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl mb-2">✅</div>
              <p className="text-2xl font-bold text-gray-900">{stats.deliveredPurchases}</p>
              <p className="text-sm text-gray-600">مسلمة</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl mb-2">📋</div>
              <p className="text-2xl font-bold text-gray-900">{stats.confirmedPurchases}</p>
              <p className="text-sm text-gray-600">مؤكدة</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl mb-2">⏳</div>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingPurchases}</p>
              <p className="text-sm text-gray-600">معلقة</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl mb-2">❌</div>
              <p className="text-2xl font-bold text-gray-900">{stats.cancelledPurchases}</p>
              <p className="text-sm text-gray-600">ملغية</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* إحصائيات إضافية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              ملخص العناصر
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">إجمالي العناصر</span>
                <span className="font-semibold">{stats.totalItems}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">إجمالي الكمية</span>
                <span className="font-semibold">{stats.totalQuantity}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">متوسط القيمة</span>
                <span className="font-semibold">{stats.averagePurchaseValue.toLocaleString()} ر.ع.</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              المشتريات الشهرية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(stats.monthlyPurchases).slice(-6).map(([month, count]) => (
                <div key={month} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{month}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
