/**
 * مكون إحصائيات فواتير المشتريات
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { PurchaseStats as PurchaseStatsType } from '@/lib/types/purchases';
import {
  Receipt,
  DollarSign,
  CreditCard,
  Clock,
  Users,
  Package,
  FileText,
} from 'lucide-react';

interface PurchaseInvoicesStatsProps {
  stats: PurchaseStatsType;
}

export function PurchaseInvoicesStats({ stats }: PurchaseInvoicesStatsProps) {
  const statCards = [
    {
      title: 'إجمالي الفواتير',
      value: stats.totalInvoices.toString(),
      icon: Receipt,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: `+${stats.invoicesThisMonth} هذا الشهر`,
    },
    {
      title: 'إجمالي المبلغ',
      value: `${stats.totalAmount.toLocaleString()} ر.ع.`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: `متوسط ${stats.averageInvoiceAmount.toLocaleString()} ر.ع.`,
    },
    {
      title: 'المبلغ المدفوع',
      value: `${stats.paidAmount.toLocaleString()} ر.ع.`,
      icon: CreditCard,
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

      {/* إحصائيات مفصلة */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* أفضل الموردين */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              أفضل الموردين
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topSuppliers.slice(0, 5).map((supplier, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{supplier.supplierName}</p>
                    <p className="text-sm text-gray-500">{supplier.invoiceCount} فاتورة</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {supplier.totalAmount.toLocaleString()} ر.ع.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* المشتريات حسب النوع */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              المشتريات حسب النوع
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.purchasesByType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">{type}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* حالة الفواتير */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            حالة الفواتير
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(stats.invoicesByStatus).map(([status, count]) => {
              const statusConfig = {
                'مدفوعة': { color: 'bg-green-100 text-green-800', icon: '✅' },
                'جزئية': { color: 'bg-yellow-100 text-yellow-800', icon: '⚠️' },
                'غير مدفوعة': { color: 'bg-red-100 text-red-800', icon: '❌' },
              };
              const config = statusConfig[status as keyof typeof statusConfig];
              
              return (
                <div key={status} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">{config.icon}</div>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-sm text-gray-600">{status}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

