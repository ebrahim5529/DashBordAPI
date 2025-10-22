/**
 * مكون تفاصيل المرتجع
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ReturnTableData } from '@/lib/types/return';
import { formatDate } from '@/lib/utils/formatDate.util';
import { 
  Edit, 
  X, 
  RotateCcw,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  User,
  Calendar,
  Hash,
  AlertCircle,
  DollarSign
} from 'lucide-react';

interface ReturnDetailsProps {
  returnItem: ReturnTableData;
  onClose: () => void;
  onEdit: () => void;
}

export default function ReturnDetails({ returnItem, onClose, onEdit }: ReturnDetailsProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5" />;
      case 'rejected':
        return <XCircle className="h-5 w-5" />;
      case 'processed':
        return <RotateCcw className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'processed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'معلق';
      case 'approved':
        return 'موافق عليه';
      case 'rejected':
        return 'مرفوض';
      case 'processed':
        return 'معالج';
      default:
        return 'غير محدد';
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'excellent':
        return 'ممتاز';
      case 'good':
        return 'جيد';
      case 'fair':
        return 'متوسط';
      case 'poor':
        return 'ضعيف';
      default:
        return 'غير محدد';
    }
  };

  return (
    <div className="space-y-6">
      {/* عنوان الصفحة */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            تفاصيل المرتجع
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            عرض تفاصيل المرتجع رقم {returnItem.id}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4 ml-2" />
            تعديل
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
          >
            <X className="h-4 w-4 ml-2" />
            إغلاق
          </Button>
        </div>
      </div>

      {/* معلومات أساسية */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            المعلومات الأساسية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">اسم الصنف</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {returnItem.itemName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">العميل</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {returnItem.customerName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">تاريخ الإرجاع</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDate(returnItem.returnDate, 'SHORT')}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Hash className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">الكمية</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {returnItem.quantity}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">السبب</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {returnItem.reason}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">القيمة</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    ${returnItem.value.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* حالة المرتجع */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            حالة المرتجع
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">الحالة الحالية</p>
              <Badge className={`${getStatusColor(returnItem.status)} flex items-center gap-2 w-fit`}>
                {getStatusIcon(returnItem.status)}
                {getStatusText(returnItem.status)}
              </Badge>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">حالة الصنف</p>
              <Badge variant="outline" className="w-fit">
                {getConditionText(returnItem.condition)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* إجراءات إضافية */}
      <Card>
        <CardHeader>
          <CardTitle>الإجراءات المتاحة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              onClick={onEdit}
              variant="outline"
            >
              <Edit className="h-4 w-4 ml-2" />
              تعديل المرتجع
            </Button>
            <Button
              variant="outline"
              onClick={() => window.print()}
            >
              <Package className="h-4 w-4 ml-2" />
              طباعة التقرير
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
