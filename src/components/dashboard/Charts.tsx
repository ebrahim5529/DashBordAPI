'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { FileText, BarChart3 } from 'lucide-react';

interface ChartsProps {
  contractData: {
    paid: number;
    unpaid: number;
    pending: number;
  };
  monthlyData: Array<{
    month: string;
    revenue: number;
    contracts: number;
    expenses: number;
    profit: number;
  }>;
}

export function Charts({ contractData, monthlyData }: ChartsProps) {
  const pieData = [
    { name: 'مدفوعة', value: contractData.paid, color: '#20B2AA' }, // Teal/Cyan
    { name: 'غير مدفوعة', value: contractData.unpaid, color: '#8A2BE2' }, // Dark Purple
    { name: 'معلقة', value: contractData.pending, color: '#FF8C00' }, // Orange/Gold
  ];

  return (
    <div className='grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 lg:gap-6'>
      {/* Pie Chart - Contract Status */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-lg font-semibold text-gray-900 dark:text-white'>
            توزيع العقود حسب الحالة
          </CardTitle>
          <FileText className='h-5 w-5 text-blue-600' />
        </CardHeader>
        <CardContent>
          <div className='h-64 sm:h-72 lg:h-80'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={pieData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='value'
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className='flex justify-center space-x-6 rtl:space-x-reverse mt-4'>
            {pieData.map((item, index) => (
              <div
                key={index}
                className='flex items-center space-x-2 rtl:space-x-reverse'
              >
                <div
                  className='w-3 h-3 rounded-full'
                  style={{ backgroundColor: item.color }}
                />
                <span className='text-sm text-gray-600 dark:text-gray-400'>
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bar Chart - Monthly Revenue */}
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-lg font-semibold text-gray-900 dark:text-white'>
            الإيرادات الشهرية
          </CardTitle>
          <BarChart3 className='h-5 w-5 text-green-600' />
        </CardHeader>
        <CardContent>
          <div className='h-64 sm:h-72 lg:h-80'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='month' />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    name === 'revenue'
                      ? `$${value.toLocaleString()}`
                      : name === 'expenses'
                        ? `$${value.toLocaleString()}`
                        : name === 'profit'
                          ? `$${value.toLocaleString()}`
                          : value,
                    name === 'revenue'
                      ? 'الإيرادات'
                      : name === 'expenses'
                        ? 'المصروفات'
                        : name === 'profit'
                          ? 'الأرباح'
                          : 'العقود',
                  ]}
                />
                <Legend />
                <Bar dataKey='revenue' fill='#20B2AA' name='الإيرادات' />
                <Bar dataKey='expenses' fill='#87CEEB' name='المصروفات' />
                <Bar dataKey='profit' fill='#32CD32' name='الأرباح' />
                <Bar dataKey='contracts' fill='#8A2BE2' name='العقود' />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
