'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FileText,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  Activity,
  Building2,
  CreditCard,
  BarChart3,
  Clock,
  Truck,
} from 'lucide-react';

interface StatsCardsProps {
  stats: {
    totalContracts: number;
    paidContracts: number;
    unpaidContracts: number;
    totalRevenue: number;
    monthlyGrowth: number;
    totalCustomers: number;
    activeRentals: number;
    totalInventory: number;
    availableInventory: number;
    monthlyExpenses: number;
    profitMargin: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'إجمالي العقود',
      value: stats.totalContracts,
      icon: FileText,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'العقود المدفوعة',
      value: stats.paidContracts,
      icon: CheckCircle,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      title: 'العقود غير المدفوعة',
      value: stats.unpaidContracts,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      change: '-3%',
      changeType: 'negative' as const,
    },
    {
      title: 'إجمالي الإيرادات',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      change: `+${stats.monthlyGrowth}%`,
      changeType: 'positive' as const,
    },
    {
      title: 'إجمالي العملاء',
      value: stats.totalCustomers,
      icon: Users,
      color: 'text-quaternary',
      bgColor: 'bg-quaternary/10',
      change: '+15%',
      changeType: 'positive' as const,
    },
    {
      title: 'التأجيرات النشطة',
      value: stats.activeRentals,
      icon: Activity,
      color: 'text-tertiary',
      bgColor: 'bg-tertiary/10',
      change: '+6%',
      changeType: 'positive' as const,
    },
    {
      title: 'إجمالي المخزون',
      value: stats.totalInventory,
      icon: Package,
      color: 'text-quinary',
      bgColor: 'bg-quinary/10',
      change: '+4%',
      changeType: 'positive' as const,
    },
    {
      title: 'المخزون المتاح',
      value: stats.availableInventory,
      icon: Building2,
      color: 'text-senary-foreground',
      bgColor: 'bg-senary/20',
      change: '+2%',
      changeType: 'positive' as const,
    },
    {
      title: 'المدفوعات المعلقة',
      value: stats.monthlyExpenses,
      icon: CreditCard,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      change: '-5%',
      changeType: 'negative' as const,
    },
    {
      title: 'التقارير المالية',
      value: `${stats.profitMargin}%`,
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      change: '+3%',
      changeType: 'positive' as const,
    },
    {
      title: 'طلبات التوصيل',
      value: '24',
      icon: Truck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      title: 'العقود المعلقة',
      value: '12',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      change: '-2%',
      changeType: 'negative' as const,
    },
  ];

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6'>
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card
            key={index}
            className='hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group'
          >
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-xs font-medium text-gray-600 dark:text-gray-400 truncate'>
                {card.title}
              </CardTitle>
              <div className={`p-1.5 rounded-lg ${card.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                <Icon className={`h-3 w-3 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-white'>
                {card.value}
              </div>
              <div className='flex items-center space-x-2 rtl:space-x-reverse mt-2'>
                {card.changeType === 'positive' ? (
                  <TrendingUp className='h-3 w-3 text-green-600' />
                ) : (
                  <TrendingDown className='h-3 w-3 text-red-600' />
                )}
                <span
                  className={`text-xs ${
                    card.changeType === 'positive'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {card.change}
                </span>
                <span className='text-xs text-gray-500 dark:text-gray-400'>
                  من الشهر الماضي
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
