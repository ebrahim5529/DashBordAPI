/**
 * مكون إدارة حالة العملاء التلقائية
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { useCustomerStatus } from '../_hooks/useCustomerStatus';
import { StatusChangeLog } from './StatusChangeLog';
import { CustomerStatusAnalytics } from './CustomerStatusAnalytics';
import {
  Users,
  UserCheck,
  UserX,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  History,
  BarChart3,
} from 'lucide-react';

type ViewMode = 'overview' | 'analytics' | 'log';

export function CustomerStatusManager() {
  const {
    customers: _customers,
    isLoading,
    error,
    stats,
    updateAllCustomersStatus,
    refreshCustomers,
  } = useCustomerStatus();

  const [isUpdating, setIsUpdating] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('overview');

  // معالجة تحديث حالة جميع العملاء
  const handleUpdateAllStatus = async () => {
    setIsUpdating(true);
    try {
      await updateAllCustomersStatus();
    } finally {
      setIsUpdating(false);
    }
  };

  // معالجة تحديث قائمة العملاء
  const handleRefreshCustomers = async () => {
    setIsUpdating(true);
    try {
      await refreshCustomers();
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* أزرار التنقل */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setViewMode('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            viewMode === 'overview'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Activity className="h-4 w-4" />
          نظرة عامة
        </button>
        <button
          onClick={() => setViewMode('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            viewMode === 'analytics'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          الإحصائيات
        </button>
        <button
          onClick={() => setViewMode('log')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            viewMode === 'log'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <History className="h-4 w-4" />
          سجل التغييرات
        </button>
      </div>

      {/* عرض المكونات حسب الوضع المحدد */}
      {viewMode === 'analytics' && (
        <CustomerStatusAnalytics
          isLoading={isLoading}
          onRefresh={handleRefreshCustomers}
          onExport={() => console.log('تصدير الإحصائيات')}
        />
      )}
      {viewMode === 'log' && (
        <StatusChangeLog
          isLoading={isLoading}
          onRefresh={handleRefreshCustomers}
          onExport={() => console.log('تصدير سجل التغييرات')}
        />
      )}

      {/* النظرة العامة */}
      {viewMode === 'overview' && (
        <>
          {/* إحصائيات حالة العملاء */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  إجمالي العملاء
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
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
                <p className="text-sm font-medium text-gray-600 mb-1">
                  العملاء النشطين
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.active}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.total > 0 ? `${((stats.active / stats.total) * 100).toFixed(1)}%` : '0%'}
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
                <p className="text-sm font-medium text-gray-600 mb-1">
                  العملاء غير النشطين
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.inactive}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.total > 0 ? `${((stats.inactive / stats.total) * 100).toFixed(1)}%` : '0%'}
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
                <p className="text-sm font-medium text-gray-600 mb-1">
                  يحتاج تحديث
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.needsUpdate}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  حالة غير محدثة
                </p>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* أزرار الإدارة */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            إدارة حالة العملاء
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <Button
              onClick={handleUpdateAllStatus}
              disabled={isLoading || isUpdating}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${(isLoading || isUpdating) ? 'animate-spin' : ''}`} />
              {isUpdating ? 'جاري التحديث...' : 'تحديث جميع الحالات'}
            </Button>

            <Button
              variant="outline"
              onClick={handleRefreshCustomers}
              disabled={isLoading || isUpdating}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              تحديث قائمة العملاء
            </Button>

            {stats.needsUpdate > 0 && (
              <div className="flex items-center gap-2 text-orange-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">
                  {stats.needsUpdate} عميل يحتاج تحديث حالة
                </span>
              </div>
            )}
          </div>

          {/* رسالة الخطأ */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* رسالة النجاح */}
          {!isLoading && !error && stats.needsUpdate === 0 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">جميع حالات العملاء محدثة</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* معلومات النظام */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            معلومات النظام
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>يتم تحديث حالة العملاء تلقائياً كل 5 دقائق</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>يتم تفعيل العميل عند إضافة عقد نشط</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>يتم تعطيل العميل عند انتهاء جميع العقود</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>يتم تسجيل جميع تغييرات الحالة في سجل النظام</span>
            </div>
          </div>
        </CardContent>
      </Card>
        </>
      )}
    </div>
  );
}
