'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/shared/Card';
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
import { Users, Activity, Building2, TrendingUp } from 'lucide-react';

// تعريف أنواع البيانات للرسوم البيانية
interface OfficeUsageData {
  officeName: string;
  totalUsers: number;
  activeUsers: number;
  monthlyRevenue: number;
  contractsCount: number;
  equipmentCount: number;
  utilizationRate: number;
}

interface OfficeUsageCardsProps {
  officeData: OfficeUsageData[];
  monthlyTrends: Array<{
    month: string;
    office1: number;
    office2: number;
    office3: number;
    office4: number;
  }>;
  weeklyActivity: Array<{
    day: string;
    office1: number;
    office2: number;
    office3: number;
    office4: number;
  }>;
  equipmentDistribution: Array<{
    office: string;
    total: number;
    rented: number;
    available: number;
    maintenance: number;
  }>;
}

/**
 * مكون OfficeUsageCards - يعرض 4 كاردات مع رسوم بيانية مختلفة
 * حسب استخدام المكاتب المختلفة
 */
export function OfficeUsageCards({
  officeData,
  monthlyTrends,
  weeklyActivity,
  equipmentDistribution,
}: OfficeUsageCardsProps) {
  // ألوان المكاتب المختلفة
  const officeColors = {
    office1: '#20B2AA', // Teal
    office2: '#8A2BE2', // Purple
    office3: '#32CD32', // Green
    office4: '#FF8C00', // Orange
  };

  // إعداد بيانات الرسم البياني الدائري للمكاتب
  const pieData = officeData.map(office => ({
    name: office.officeName,
    value: office.totalUsers,
    revenue: office.monthlyRevenue,
    contracts: office.contractsCount,
  }));

  // إعداد بيانات الرسم البياني العمودي للمعدات
  const barData = equipmentDistribution.map(item => ({
    name: item.office,
    المتاح: item.available,
    مؤجر: item.rented,
    صيانة: item.maintenance,
  }));

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
      {/* الكارد الأول: توزيع المستخدمين حسب المكاتب */}
      <Card className='col-span-1'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-lg font-semibold text-gray-900 dark:text-white'>
            توزيع المستخدمين حسب المكاتب
          </CardTitle>
          <Users className='h-5 w-5 text-blue-600' />
        </CardHeader>
        <CardContent>
          <div className='h-64'>
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
                    <Cell
                      key={`cell-${index}`}
                      fill={Object.values(officeColors)[index]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, _name) => [
                    `${value} مستخدم`,
                    'عدد المستخدمين',
                  ]}
                />
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
                  style={{
                    backgroundColor: Object.values(officeColors)[index],
                  }}
                />
                <span className='text-sm text-gray-600 dark:text-gray-400'>
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* الكارد الثاني: الإيرادات الشهرية للمكاتب */}
      <Card className='col-span-1'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-lg font-semibold text-gray-900 dark:text-white'>
            الإيرادات الشهرية للمكاتب
          </CardTitle>
          <TrendingUp className='h-5 w-5 text-green-600' />
        </CardHeader>
        <CardContent>
          <div className='h-64'>
            <ResponsiveContainer width='100%' height='100%'>
              <AreaChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='month' />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    `$${value.toLocaleString()}`,
                    name === 'office1'
                      ? 'المكتب الرئيسي'
                      : name === 'office2'
                        ? 'مكتب الشمال'
                        : name === 'office3'
                          ? 'مكتب الجنوب'
                          : 'مكتب الشرق',
                  ]}
                />
                <Legend />
                <Area
                  type='monotone'
                  dataKey='office1'
                  stackId='1'
                  stroke={officeColors.office1}
                  fill={officeColors.office1}
                  name='المكتب الرئيسي'
                />
                <Area
                  type='monotone'
                  dataKey='office2'
                  stackId='1'
                  stroke={officeColors.office2}
                  fill={officeColors.office2}
                  name='مكتب الشمال'
                />
                <Area
                  type='monotone'
                  dataKey='office3'
                  stackId='1'
                  stroke={officeColors.office3}
                  fill={officeColors.office3}
                  name='مكتب الجنوب'
                />
                <Area
                  type='monotone'
                  dataKey='office4'
                  stackId='1'
                  stroke={officeColors.office4}
                  fill={officeColors.office4}
                  name='مكتب الشرق'
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* الكارد الثالث: النشاط الأسبوعي للمكاتب */}
      <Card className='col-span-1'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-lg font-semibold text-gray-900 dark:text-white'>
            النشاط الأسبوعي للمكاتب
          </CardTitle>
          <Activity className='h-5 w-5 text-purple-600' />
        </CardHeader>
        <CardContent>
          <div className='h-64'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='day' />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    `${value} نشاط`,
                    name === 'office1'
                      ? 'المكتب الرئيسي'
                      : name === 'office2'
                        ? 'مكتب الشمال'
                        : name === 'office3'
                          ? 'مكتب الجنوب'
                          : 'مكتب الشرق',
                  ]}
                />
                <Legend />
                <Line
                  type='monotone'
                  dataKey='office1'
                  stroke={officeColors.office1}
                  strokeWidth={2}
                  name='المكتب الرئيسي'
                />
                <Line
                  type='monotone'
                  dataKey='office2'
                  stroke={officeColors.office2}
                  strokeWidth={2}
                  name='مكتب الشمال'
                />
                <Line
                  type='monotone'
                  dataKey='office3'
                  stroke={officeColors.office3}
                  strokeWidth={2}
                  name='مكتب الجنوب'
                />
                <Line
                  type='monotone'
                  dataKey='office4'
                  stroke={officeColors.office4}
                  strokeWidth={2}
                  name='مكتب الشرق'
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* الكارد الرابع: توزيع المعدات حسب المكاتب */}
      <Card className='col-span-1'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-lg font-semibold text-gray-900 dark:text-white'>
            توزيع المعدات حسب المكاتب
          </CardTitle>
          <Building2 className='h-5 w-5 text-orange-600' />
        </CardHeader>
        <CardContent>
          <div className='h-64'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    `${value} قطعة`,
                    name === 'المتاح'
                      ? 'متاح'
                      : name === 'مؤجر'
                        ? 'مؤجر'
                        : 'صيانة',
                  ]}
                />
                <Legend />
                <Bar dataKey='المتاح' fill='#32CD32' name='متاح' />
                <Bar dataKey='مؤجر' fill='#20B2AA' name='مؤجر' />
                <Bar dataKey='صيانة' fill='#FF8C00' name='صيانة' />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default OfficeUsageCards;
