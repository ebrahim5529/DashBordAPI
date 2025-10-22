/**
 * مكون إحصائيات المطالبات
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { ClaimsStats as ClaimsStatsType } from '@/lib/types/claims';
import {
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Users,
  Calendar,
  Percent,
  Target,
  Clock,
} from 'lucide-react';

interface ClaimsStatsProps {
  stats: ClaimsStatsType;
}

export function ClaimsStats({ stats }: ClaimsStatsProps) {
  const statsCards = [
    {
      title: 'إجمالي المطالبات',
      value: stats.totalClaims.toLocaleString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'إجمالي المبالغ المعلقة',
      value: `${stats.totalPendingAmount.toLocaleString()} ر.ع`,
      icon: DollarSign,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900',
      change: '-5%',
      changeType: 'negative' as const,
    },
    {
      title: 'المطالبات المتأخرة',
      value: stats.overdueClaims.toLocaleString(),
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
      change: '+3',
      changeType: 'negative' as const,
    },
    {
      title: 'مبلغ المتأخرات',
      value: `${stats.overdueAmount.toLocaleString()} ر.ع`,
      icon: Clock,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900',
      change: '+8%',
      changeType: 'negative' as const,
    },
    {
      title: 'المطالبات عالية الأولوية',
      value: stats.highPriorityClaims.toLocaleString(),
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
      change: '+2',
      changeType: 'negative' as const,
    },
    {
      title: 'مطالبات هذا الشهر',
      value: stats.claimsThisMonth.toLocaleString(),
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
      change: '+15%',
      changeType: 'positive' as const,
    },
    {
      title: 'متوسط قيمة المطالبة',
      value: `${stats.averageClaimAmount.toLocaleString()} ر.ع`,
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900',
      change: '+7%',
      changeType: 'positive' as const,
    },
    {
      title: 'معدل التحصيل',
      value: `${stats.collectionRate}%`,
      icon: Percent,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900',
      change: '+2%',
      changeType: 'positive' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                <span
                  className={`text-xs font-medium ${
                    stat.changeType === 'positive'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground">من الشهر الماضي</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
