/**
 * مكون إحصائيات المشتريات
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import type { PurchaseStats as PurchaseStatsType } from '@/data/purchaseData';
import { 
  ShoppingCart, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp
} from 'lucide-react';

interface PurchaseStatsProps {
  stats: PurchaseStatsType;
}

export function PurchaseStats({ stats }: PurchaseStatsProps) {
  const statItems = [
    {
      title: 'إجمالي المشتريات',
      value: stats.totalPurchases.toString(),
      icon: ShoppingCart,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
      change: '+8',
    },
    {
      title: 'إجمالي المبلغ',
      value: `${(stats.totalAmount / 1000).toFixed(0)}K`,
      icon: DollarSign,
      color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
      change: '+22%',
    },
    {
      title: 'المعلقة',
      value: stats.pendingPurchases.toString(),
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300',
      change: '+2',
    },
    {
      title: 'المكتملة',
      value: stats.completedPurchases.toString(),
      icon: CheckCircle,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
      change: '+6',
    },
    {
      title: 'الملغية',
      value: stats.cancelledPurchases.toString(),
      icon: XCircle,
      color: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
      change: '+1',
    },
    {
      title: 'متوسط قيمة المشتريات',
      value: `${stats.averagePurchaseValue.toLocaleString()} ريال`,
      icon: TrendingUp,
      color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300',
      change: '+5%',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {item.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${item.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {item.value}
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                {item.change} من الشهر الماضي
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}