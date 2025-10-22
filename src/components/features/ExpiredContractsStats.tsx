/**
 * مكون إحصائيات العقود المنتهية الصلاحية
 */

'use client';

import React from 'react';
import { Card } from '@/components/shared/Card';
import { ContractsStats } from '@/lib/types/contracts';
import { formatNumber } from '@/lib/utils/formatNumbers';
import { 
  FileX, 
  DollarSign, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Percent
} from 'lucide-react';

interface ExpiredContractsStatsProps {
  stats: ContractsStats;
}

export function ExpiredContractsStats({ stats }: ExpiredContractsStatsProps) {
  const statsCards = [
    {
      title: 'إجمالي العقود المنتهية',
      value: stats.expiredContracts,
      icon: FileX,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
    },
    {
      title: 'إجمالي قيمة العقود',
      value: `ريال ${formatNumber(stats.totalValue)}`,
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
    {
      title: 'إجمالي المدفوع',
      value: `ريال ${formatNumber(stats.totalPaid)}`,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
    },
    {
      title: 'إجمالي المستحق',
      value: `ريال ${formatNumber(stats.totalPending)}`,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
    },
    {
      title: 'متوسط قيمة العقد',
      value: `ريال ${formatNumber(stats.averageContractValue)}`,
      icon: TrendingDown,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
    },
    {
      title: 'معدل الإنجاز',
      value: `${stats.completionRate}%`,
      icon: Percent,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      borderColor: 'border-indigo-200 dark:border-indigo-800',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statsCards.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className={`p-4 ${stat.bgColor} ${stat.borderColor} border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {stat.title}
                </p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <IconComponent className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
