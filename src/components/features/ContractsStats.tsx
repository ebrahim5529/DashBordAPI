/**
 * مكون إحصائيات العقود
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { ContractsStats as ContractsStatsType } from '@/lib/types/contracts';
import {
  FileText,
  CheckCircle,
  XCircle,
  DollarSign,
  Calendar,
  TrendingUp,
  Percent,
  Clock,
} from 'lucide-react';

interface ContractsStatsProps {
  stats: ContractsStatsType;
}

export function ContractsStats({ stats }: ContractsStatsProps) {
  const statsCards = [
    {
      title: 'إجمالي العقود',
      value: stats.totalContracts.toLocaleString(),
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      title: 'العقود النشطة',
      value: stats.activeContracts.toLocaleString(),
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'العقود المنتهية',
      value: stats.expiredContracts.toLocaleString(),
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900',
      change: '+3',
      changeType: 'negative' as const,
    },
    {
      title: 'العقود الملغية',
      value: stats.cancelledContracts.toLocaleString(),
      icon: XCircle,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100 dark:bg-gray-900',
      change: '0',
      changeType: 'neutral' as const,
    },
    {
      title: 'إجمالي القيمة',
      value: `${stats.totalValue.toLocaleString()} ر.ع`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900',
      change: '+15%',
      changeType: 'positive' as const,
    },
    {
      title: 'إجمالي المدفوع',
      value: `${stats.totalPaid.toLocaleString()} ر.ع`,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
      change: '+18%',
      changeType: 'positive' as const,
    },
    {
      title: 'إجمالي المتبقي',
      value: `${stats.totalPending.toLocaleString()} ر.ع`,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
      change: '+5%',
      changeType: 'negative' as const,
    },
    {
      title: 'عقود هذا الشهر',
      value: stats.contractsThisMonth.toLocaleString(),
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
      change: '+25%',
      changeType: 'positive' as const,
    },
    {
      title: 'متوسط قيمة العقد',
      value: `${stats.averageContractValue.toLocaleString()} ر.ع`,
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900',
      change: '+7%',
      changeType: 'positive' as const,
    },
    {
      title: 'معدل الإنجاز',
      value: `${stats.completionRate}%`,
      icon: Percent,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100 dark:bg-cyan-900',
      change: '+3%',
      changeType: 'positive' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
                      : stat.changeType === 'negative'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-600 dark:text-gray-400'
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
