/**
 * مكون إحصائيات المرتجعات
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { ReturnStatsData } from '@/data/returnsData';
import { RotateCcw, Clock, CheckCircle, DollarSign } from 'lucide-react';

interface ReturnStatsProps {
  stats: ReturnStatsData;
}

export function ReturnStats({ stats }: ReturnStatsProps) {
  const statCards = [
    {
      title: 'إجمالي المرتجعات',
      value: stats.totalReturns.toString(),
      icon: RotateCcw,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
      change: '+12%',
    },
    {
      title: 'مرتجعات معلقة',
      value: stats.pendingReturns.toString(),
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300',
      change: '+5%',
    },
    {
      title: 'مرتجعات معالجة',
      value: stats.processedReturns.toString(),
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
      change: '+8%',
    },
    {
      title: 'إجمالي القيمة',
      value: `$${stats.totalValue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
      change: '+15%',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {stat.change} من الشهر الماضي
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
