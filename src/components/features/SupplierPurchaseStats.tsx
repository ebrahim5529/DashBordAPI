/**
 * مكون إحصائيات مشتريات الموردين
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
  ClipboardList,
  Clock,
  XCircle,
} from 'lucide-react';

interface SupplierPurchaseStatsData {
  totalPurchases: number;
  deliveredPurchases: number;
  confirmedPurchases: number;
  pendingPurchases: number;
  cancelledPurchases: number;
  totalAmount: number;
  totalItems: number;
  averageOrderValue: number;
  monthlyGrowth: number;
}

interface SupplierPurchaseStatsProps {
  stats: SupplierPurchaseStatsData;
}

export function SupplierPurchaseStats({ stats }: SupplierPurchaseStatsProps) {
  const statCards = [
    {
      title: 'إجمالي المشتريات',
      value: stats.totalPurchases.toString(),
      icon: Receipt,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: `+${stats.monthlyGrowth}% هذا الشهر`,
    },
    {
      title: 'إجمالي المبلغ',
      value: `${stats.totalAmount.toLocaleString()} ر.ع.`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: `متوسط ${stats.averageOrderValue.toLocaleString()} ر.ع.`,
    },
    {
      title: 'العناصر المسلمة',
      value: stats.deliveredPurchases.toString(),
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      change: `${((stats.deliveredPurchases / stats.totalPurchases) * 100).toFixed(1)}% من الإجمالي`,
    },
    {
      title: 'إجمالي العناصر',
      value: stats.totalItems.toString(),
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: `${((stats.totalItems / stats.totalPurchases)).toFixed(1)} عنصر/طلب`,
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
              <div className="flex justify-center mb-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.deliveredPurchases}</p>
              <p className="text-sm text-gray-600">مسلمة</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-center mb-2">
                <ClipboardList className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.confirmedPurchases}</p>
              <p className="text-sm text-gray-600">مؤكدة</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="flex justify-center mb-2">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingPurchases}</p>
              <p className="text-sm text-gray-600">معلقة</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="flex justify-center mb-2">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.cancelledPurchases}</p>
              <p className="text-sm text-gray-600">ملغية</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

