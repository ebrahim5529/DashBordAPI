'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FileText,
  CheckCircle,
  XCircle,
  DollarSign,
} from 'lucide-react';

interface Contract {
  id: string;
  customerName: string;
  type: 'تأجير' | 'بيع';
  amount: number;
  status: 'مدفوعة' | 'غير مدفوعة' | 'معلقة';
  startDate: string;
  endDate: string;
  equipment: string;
  contractNumber: string;
  createdDate: string;
}

interface ContractsStatsProps {
  contracts: Contract[];
}

export function ContractsStats({ contracts }: ContractsStatsProps) {
  // Calculate statistics
  const totalContracts = contracts.length;
  const paidContracts = contracts.filter(c => c.status === 'مدفوعة').length;
  const unpaidContracts = contracts.filter(
    c => c.status === 'غير مدفوعة'
  ).length;
  const _pendingContracts = contracts.filter(c => c.status === 'معلقة').length;

  const _rentalContracts = contracts.filter(c => c.type === 'تأجير').length;
  const _saleContracts = contracts.filter(c => c.type === 'بيع').length;

  const totalRevenue = contracts.reduce(
    (sum, contract) => sum + contract.amount,
    0
  );
  const _paidRevenue = contracts
    .filter(c => c.status === 'مدفوعة')
    .reduce((sum, contract) => sum + contract.amount, 0);

  const unpaidRevenue = contracts
    .filter(c => c.status === 'غير مدفوعة')
    .reduce((sum, contract) => sum + contract.amount, 0);

  // Calculate monthly stats
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyContracts = contracts.filter(contract => {
    const contractDate = new Date(contract.createdDate);
    return (
      contractDate.getMonth() === currentMonth &&
      contractDate.getFullYear() === currentYear
    );
  }).length;

  const monthlyRevenue = contracts
    .filter(contract => {
      const contractDate = new Date(contract.createdDate);
      return (
        contractDate.getMonth() === currentMonth &&
        contractDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, contract) => sum + contract.amount, 0);

  // Calculate active contracts (current date between start and end)
  const today = new Date();
  const _activeContracts = contracts.filter(contract => {
    const startDate = new Date(contract.startDate);
    const endDate = new Date(contract.endDate);
    return today >= startDate && today <= endDate;
  }).length;

  const stats = [
    {
      title: 'إجمالي العقود',
      value: totalContracts,
      icon: FileText,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: `+${monthlyContracts} هذا الشهر`,
      changeType: 'positive' as const,
    },
    {
      title: 'العقود المدفوعة',
      value: paidContracts,
      icon: CheckCircle,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      change: `${((paidContracts / totalContracts) * 100).toFixed(1)}% من الإجمالي`,
      changeType: 'positive' as const,
    },
    {
      title: 'العقود غير المدفوعة',
      value: unpaidContracts,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      change: `$${unpaidRevenue.toLocaleString()}`,
      changeType: 'negative' as const,
    },
    {
      title: 'إجمالي الإيرادات',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      change: `$${monthlyRevenue.toLocaleString()} هذا الشهر`,
      changeType: 'positive' as const,
    },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className='hover:shadow-lg transition-shadow duration-200'
          >
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-gray-900 dark:text-white mb-1'>
                {stat.value}
              </div>
              <div className='text-xs text-gray-500 dark:text-gray-400'>
                {stat.change}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
