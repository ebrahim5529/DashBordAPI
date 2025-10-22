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
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';

interface AdditionalChartsProps {
  equipmentData: Array<{
    name: string;
    total: number;
    rented: number;
    available: number;
    maintenance: number;
  }>;
  customerData: Array<{
    name: string;
    contracts: number;
    revenue: number;
    percentage: number;
  }>;
  weeklyData: Array<{
    day: string;
    revenue: number;
    contracts: number;
  }>;
  monthlyData: Array<{
    month: string;
    revenue: number;
    contracts: number;
    expenses: number;
    profit: number;
  }>;
}

export function AdditionalCharts({
  equipmentData,
  customerData,
  weeklyData,
  monthlyData,
}: AdditionalChartsProps) {
  const equipmentPieData = equipmentData.map(item => ({
    name: item.name,
    value: item.rented,
    total: item.total,
    available: item.available,
  }));

  const customerPieData = customerData.map(item => ({
    name: item.name,
    value: item.percentage,
    contracts: item.contracts,
    revenue: item.revenue,
  }));

  const COLORS = [
    '#20B2AA',
    '#8A2BE2',
    '#32CD32',
    '#FF8C00',
    '#87CEEB',
    '#333333',
    '#E6E6E6',
    '#FF6B6B',
  ];

  return (
    <div className='space-y-3 sm:space-y-4 lg:space-y-6'>
      {/* Equipment and Customer Charts Row */}
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 lg:gap-6'>
        {/* Equipment Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle className='text-lg font-semibold text-gray-900 dark:text-white'>
              حالة المعدات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-64 sm:h-72 lg:h-80'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={equipmentPieData}
                    cx='50%'
                    cy='50%'
                    labelLine={false}
                    label={({ name, value, total }) =>
                      `${name}: ${value}/${total}`
                    }
                    outerRadius={80}
                    fill='#8884d8'
                    dataKey='value'
                  >
                    {equipmentPieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className='flex flex-wrap justify-center gap-4 mt-4'>
              {equipmentPieData.map((item, index) => (
                <div
                  key={index}
                  className='flex items-center space-x-2 rtl:space-x-reverse'
                >
                  <div
                    className='w-3 h-3 rounded-full'
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className='text-sm text-gray-600 dark:text-gray-400'>
                    {item.name}: {item.value}/{item.total}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className='text-lg font-semibold text-gray-900 dark:text-white'>
              توزيع العملاء
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-64 sm:h-72 lg:h-80'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={customerPieData}
                    cx='50%'
                    cy='50%'
                    labelLine={false}
                    label={({ name, value }) => `${name} ${value}%`}
                    outerRadius={80}
                    fill='#8884d8'
                    dataKey='value'
                  >
                    {customerPieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className='flex flex-wrap justify-center gap-4 mt-4'>
              {customerPieData.map((item, index) => (
                <div
                  key={index}
                  className='flex items-center space-x-2 rtl:space-x-reverse'
                >
                  <div
                    className='w-3 h-3 rounded-full'
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className='text-sm text-gray-600 dark:text-gray-400'>
                    {item.name}: {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly and Profit Charts Row */}
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 lg:gap-6'>
        {/* Weekly Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className='text-lg font-semibold text-gray-900 dark:text-white'>
              الإيرادات الأسبوعية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-64 sm:h-72 lg:h-80'>
              <ResponsiveContainer width='100%' height='100%'>
                <AreaChart data={weeklyData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='day' />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      name === 'revenue' ? `$${value.toLocaleString()}` : value,
                      name === 'revenue' ? 'الإيرادات' : 'العقود',
                    ]}
                  />
                  <Area
                    type='monotone'
                    dataKey='revenue'
                    stackId='1'
                    stroke='#20B2AA'
                    fill='#20B2AA'
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Profit vs Expenses Chart */}
        <Card>
          <CardHeader>
            <CardTitle className='text-lg font-semibold text-gray-900 dark:text-white'>
              الأرباح مقابل المصروفات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-64 sm:h-72 lg:h-80'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='month' />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      `$${value.toLocaleString()}`,
                      name === 'profit'
                        ? 'الأرباح'
                        : name === 'expenses'
                          ? 'المصروفات'
                          : 'الإيرادات',
                    ]}
                  />
                  <Legend />
                  <Line
                    type='monotone'
                    dataKey='profit'
                    stroke='#32CD32'
                    strokeWidth={3}
                    name='الأرباح'
                  />
                  <Line
                    type='monotone'
                    dataKey='expenses'
                    stroke='#87CEEB'
                    strokeWidth={3}
                    name='المصروفات'
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Equipment Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg font-semibold text-gray-900 dark:text-white'>
            تفصيل المعدات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-80'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={equipmentData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey='total' fill='#20B2AA' name='إجمالي' />
                <Bar dataKey='rented' fill='#8A2BE2' name='مؤجر' />
                <Bar dataKey='available' fill='#32CD32' name='متاح' />
                <Bar dataKey='maintenance' fill='#FF8C00' name='صيانة' />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
