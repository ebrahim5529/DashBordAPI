/**
 * مكون إحصائيات المدفوعات
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import type { PaymentStats as PaymentStatsType } from '@/data/paymentData';
import { 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  CreditCard
} from 'lucide-react';

interface PaymentStatsProps {
  stats: PaymentStatsType;
}

export function PaymentStats({ stats }: PaymentStatsProps) {
  const statItems = [
    {
      title: 'إجمالي المدفوعات',
      value: stats.totalPayments.toString(),
      icon: CreditCard,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
      change: '+12',
    },
    {
      title: 'إجمالي المبلغ',
      value: `${(stats.totalAmount / 1000).toFixed(0)}K`,
      icon: DollarSign,
      color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
      change: '+15%',
    },
    {
      title: 'المدفوعات المعلقة',
      value: stats.pendingPayments.toString(),
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300',
      change: '+3',
    },
    {
      title: 'المكتملة',
      value: stats.completedPayments.toString(),
      icon: CheckCircle,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
      change: '+8',
    },
    {
      title: 'المتأخرة',
      value: stats.overduePayments.toString(),
      icon: AlertCircle,
      color: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
      change: '+1',
    },
    {
      title: 'متوسط وقت الدفع',
      value: `${stats.averagePaymentTime} يوم`,
      icon: TrendingUp,
      color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300',
      change: '-0.5',
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
