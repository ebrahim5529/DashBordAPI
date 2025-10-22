/**
 * مكون إحصائيات حالة العملاء
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  UserCheck,
  UserX,
  AlertTriangle,
  RefreshCw,
  Download,
  Activity,
  PieChart,
  LineChart,
  CheckCircle
} from 'lucide-react';

export interface CustomerStatusAnalyticsData {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  pendingCustomers: number;
  suspendedCustomers: number;
  newCustomersThisMonth: number;
  lostCustomersThisMonth: number;
  statusChanges: {
    date: string;
    activations: number;
    deactivations: number;
    suspensions: number;
  }[];
  statusDistribution: {
    status: 'active' | 'inactive' | 'pending' | 'suspended';
    count: number;
    percentage: number;
    color: string;
  }[];
  monthlyTrends: {
    month: string;
    active: number;
    inactive: number;
    total: number;
  }[];
  topChangeReasons: {
    reason: string;
    count: number;
    percentage: number;
  }[];
}

interface CustomerStatusAnalyticsProps {
  data?: CustomerStatusAnalyticsData;
  isLoading?: boolean;
  onRefresh?: () => void;
  onExport?: () => void;
}

// بيانات تجريبية
const mockData: CustomerStatusAnalyticsData = {
  totalCustomers: 1250,
  activeCustomers: 890,
  inactiveCustomers: 280,
  pendingCustomers: 65,
  suspendedCustomers: 15,
  newCustomersThisMonth: 45,
  lostCustomersThisMonth: 12,
  statusChanges: [
    { date: '2024-01-01', activations: 8, deactivations: 3, suspensions: 1 },
    { date: '2024-01-02', activations: 12, deactivations: 2, suspensions: 0 },
    { date: '2024-01-03', activations: 6, deactivations: 5, suspensions: 2 },
    { date: '2024-01-04', activations: 15, deactivations: 1, suspensions: 1 },
    { date: '2024-01-05', activations: 9, deactivations: 4, suspensions: 0 },
    { date: '2024-01-06', activations: 7, deactivations: 3, suspensions: 1 },
    { date: '2024-01-07', activations: 11, deactivations: 2, suspensions: 0 },
  ],
  statusDistribution: [
    { status: 'active', count: 890, percentage: 71.2, color: '#10B981' },
    { status: 'inactive', count: 280, percentage: 22.4, color: '#EF4444' },
    { status: 'pending', count: 65, percentage: 5.2, color: '#F59E0B' },
    { status: 'suspended', count: 15, percentage: 1.2, color: '#F97316' },
  ],
  monthlyTrends: [
    { month: 'أكتوبر', active: 820, inactive: 310, total: 1130 },
    { month: 'نوفمبر', active: 850, inactive: 290, total: 1140 },
    { month: 'ديسمبر', active: 880, inactive: 270, total: 1150 },
    { month: 'يناير', active: 890, inactive: 280, total: 1170 },
  ],
  topChangeReasons: [
    { reason: 'إضافة عقد', count: 245, percentage: 35.2 },
    { reason: 'انتهاء عقد', count: 180, percentage: 25.9 },
    { reason: 'تحديث يدوي', count: 120, percentage: 17.2 },
    { reason: 'تحديث تلقائي', count: 95, percentage: 13.6 },
    { reason: 'مشكلة في الدفع', count: 45, percentage: 6.5 },
    { reason: 'أخرى', count: 11, percentage: 1.6 },
  ],
};

const CustomerStatusAnalytics: React.FC<CustomerStatusAnalyticsProps> = ({
  data = mockData,
  isLoading = false,
  onRefresh,
  onExport,
}) => {
  const [timeRange, setTimeRange] = useState('month');
  const [chartType, setChartType] = useState('bar');

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ar-SA').format(num);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'inactive':
        return 'غير نشط';
      case 'pending':
        return 'في الانتظار';
      case 'suspended':
        return 'معلق';
      default:
        return status;
    }
  };

  const getReasonLabel = (reason: string) => {
    switch (reason) {
      case 'إضافة عقد':
        return 'إضافة عقد';
      case 'انتهاء عقد':
        return 'انتهاء عقد';
      case 'تحديث يدوي':
        return 'تحديث يدوي';
      case 'تحديث تلقائي':
        return 'تحديث تلقائي';
      case 'مشكلة في الدفع':
        return 'مشكلة في الدفع';
      case 'أخرى':
        return 'أخرى';
      default:
        return reason;
    }
  };

  return (
    <div className="space-y-6">
      {/* أزرار التحكم */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          <h2 className="text-xl font-semibold">إحصائيات حالة العملاء</h2>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">أسبوع</SelectItem>
              <SelectItem value="month">شهر</SelectItem>
              <SelectItem value="quarter">ربع سنوي</SelectItem>
              <SelectItem value="year">سنة</SelectItem>
            </SelectContent>
          </Select>
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              تحديث
            </Button>
          )}
          {onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              تصدير
            </Button>
          )}
        </div>
      </div>

      {/* الإحصائيات الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">إجمالي العملاء</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(data.totalCustomers)}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">العملاء النشطين</p>
                <p className="text-2xl font-bold text-green-600">{formatNumber(data.activeCustomers)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {((data.activeCustomers / data.totalCustomers) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">العملاء غير النشطين</p>
                <p className="text-2xl font-bold text-red-600">{formatNumber(data.inactiveCustomers)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {((data.inactiveCustomers / data.totalCustomers) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="p-3 rounded-full bg-red-100">
                <UserX className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">عملاء جدد هذا الشهر</p>
                <p className="text-2xl font-bold text-blue-600">{formatNumber(data.newCustomersThisMonth)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">+{((data.newCustomersThisMonth / data.totalCustomers) * 100).toFixed(1)}%</span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* توزيع الحالات */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              توزيع حالات العملاء
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.statusDistribution.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="font-medium">{getStatusLabel(item.status)}</span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">{formatNumber(item.count)}</div>
                    <div className="text-sm text-gray-500">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              أسباب تغيير الحالة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topChangeReasons.map((reason, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{getReasonLabel(reason.reason)}</span>
                    <span className="text-sm text-gray-500">{reason.count} ({reason.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${reason.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* الاتجاهات الشهرية */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              الاتجاهات الشهرية
            </CardTitle>
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">عمودي</SelectItem>
                <SelectItem value="line">خطي</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.monthlyTrends.map((trend, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">{trend.month}</div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-sm text-gray-600">نشط</div>
                    <div className="font-semibold text-green-600">{formatNumber(trend.active)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">غير نشط</div>
                    <div className="font-semibold text-red-600">{formatNumber(trend.inactive)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600">الإجمالي</div>
                    <div className="font-semibold">{formatNumber(trend.total)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* نشاط تغيير الحالات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            نشاط تغيير الحالات (آخر 7 أيام)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.statusChanges.map((change, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-sm font-medium">
                    {new Date(change.date).toLocaleDateString('ar-SA', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">{change.activations} تفعيل</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-600">{change.deactivations} تعطيل</span>
                    </div>
                    {change.suspensions > 0 && (
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <span className="text-sm text-orange-600">{change.suspensions} تعليق</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ملخص الأداء */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">معدل النمو</p>
                <p className="text-2xl font-bold text-green-600">
                  +{((data.newCustomersThisMonth - data.lostCustomersThisMonth) / data.totalCustomers * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">معدل الاحتفاظ</p>
                <p className="text-2xl font-bold text-blue-600">
                  {((data.totalCustomers - data.lostCustomersThisMonth) / data.totalCustomers * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-800">معدل النشاط</p>
                <p className="text-2xl font-bold text-purple-600">
                  {(data.activeCustomers / data.totalCustomers * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { CustomerStatusAnalytics };
