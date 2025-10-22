/**
 * مكون عرض تفاصيل طلب الشراء
 * يعرض جميع تفاصيل طلب الشراء مع إمكانية التعديل والاعتماد
 */

'use client';

import React from 'react';
import { PurchaseRequestTableData } from '@/lib/types/financial';
import { Button } from '@/components/shared/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import {
  ArrowLeft,
  ShoppingCart,
  Building2,
  DollarSign,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Package,
  Truck,
  Edit,
  Download,
  Printer,
} from 'lucide-react';

interface PurchaseRequestDetailsProps {
  request: PurchaseRequestTableData;
  onBack: () => void;
  onEdit?: (request: PurchaseRequestTableData) => void;
  onApprove?: (request: PurchaseRequestTableData) => void;
  onExport?: (request: PurchaseRequestTableData) => void;
  onPrint?: (request: PurchaseRequestTableData) => void;
}

export function PurchaseRequestDetails({
  request,
  onBack,
  onEdit,
  onApprove,
  onExport,
  onPrint,
}: PurchaseRequestDetailsProps) {
  // دالة لتحديد لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'UNDER_REVIEW':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // دالة لتحديد أيقونة الحالة
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4" />;
      case 'UNDER_REVIEW':
        return <Clock className="h-4 w-4" />;
      case 'REJECTED':
        return <AlertCircle className="h-4 w-4" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // دالة لتحديد نص الحالة بالعربية
  const getStatusText = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'معتمد';
      case 'UNDER_REVIEW':
        return 'تحت المراجعة';
      case 'REJECTED':
        return 'مرفوض';
      case 'COMPLETED':
        return 'مكتمل';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            العودة
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              تفاصيل طلب الشراء
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {request.requestNumber}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {onPrint && (
            <Button
              variant="outline"
              onClick={() => onPrint(request)}
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              طباعة
            </Button>
          )}
          {onExport && (
            <Button
              variant="outline"
              onClick={() => onExport(request)}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              تصدير
            </Button>
          )}
          {onEdit && (
            <Button
              variant="outline"
              onClick={() => onEdit(request)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              تعديل
            </Button>
          )}
          {onApprove && request.status === 'UNDER_REVIEW' && (
            <Button
              onClick={() => onApprove(request)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="h-4 w-4" />
              اعتماد الطلب
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                معلومات طلب الشراء
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    رقم الطلب
                  </label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {request.requestNumber}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    الحالة
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      {getStatusText(request.status)}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    تاريخ الطلب
                  </label>
                  <p className="text-lg text-gray-900 dark:text-white">
                    {new Date(request.date).toLocaleDateString('ar-SA')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    المبلغ الإجمالي
                  </label>
                  <p className="text-lg font-semibold text-green-600">
                    {request.estimatedCost.toLocaleString('ar-SA')} ر.س
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Supplier Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                معلومات المورد
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    اسم المورد
                  </label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {request.supplierName || 'مورد افتراضي'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    رقم المورد
                  </label>
                  <p className="text-lg text-gray-900 dark:text-white">
                    SUPP-{request.id.slice(-6)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    نوع المورد
                  </label>
                  <p className="text-lg text-gray-900 dark:text-white">
                    شركة
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    التصنيف
                  </label>
                  <p className="text-lg text-gray-900 dark:text-white">
                    مورد معتمد
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Request Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                العناصر المطلوبة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                        العنصر
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                        الكمية
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                        السعر
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                        الإجمالي
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        {request.type || 'عناصر متنوعة'}
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        {request.quantity || 1}
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        {((request.estimatedCost || 0) / (request.quantity || 1)).toLocaleString('ar-SA')} ر.س
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        {request.estimatedCost.toLocaleString('ar-SA')} ر.س
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                معلومات إضافية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  الوصف
                </label>
                <p className="text-gray-900 dark:text-white mt-1">
                  {request.type || 'لا يوجد وصف إضافي'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  ملاحظات
                </label>
                <p className="text-gray-900 dark:text-white mt-1">
                  لا توجد ملاحظات إضافية
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                مسار الطلب
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      تم إنشاء الطلب
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(request.date).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${request.status === 'UNDER_REVIEW' ? 'bg-yellow-500' : 'bg-gray-300'}`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      تحت المراجعة
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      في انتظار الاعتماد
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${request.status === 'APPROVED' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      معتمد
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      جاهز للتنفيذ
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${request.status === 'COMPLETED' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      مكتمل
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      تم التسليم
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                إجراءات سريعة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {onEdit && (
                <Button
                  variant="outline"
                  onClick={() => onEdit(request)}
                  className="w-full justify-start"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  تعديل الطلب
                </Button>
              )}
              {onApprove && request.status === 'UNDER_REVIEW' && (
                <Button
                  onClick={() => onApprove(request)}
                  className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  اعتماد الطلب
                </Button>
              )}
              {onExport && (
                <Button
                  variant="outline"
                  onClick={() => onExport(request)}
                  className="w-full justify-start"
                >
                  <Download className="h-4 w-4 mr-2" />
                  تصدير PDF
                </Button>
              )}
              {onPrint && (
                <Button
                  variant="outline"
                  onClick={() => onPrint(request)}
                  className="w-full justify-start"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  طباعة الطلب
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Request Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                ملخص الطلب
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">المبلغ الإجمالي:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {request.estimatedCost.toLocaleString('ar-SA')} ر.س
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">الضريبة:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {((request.estimatedCost || 0) * 0.15).toLocaleString('ar-SA')} ر.س
                </span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-900 dark:text-white">المجموع النهائي:</span>
                  <span className="text-lg font-bold text-green-600">
                    {((request.estimatedCost || 0) * 1.15).toLocaleString('ar-SA')} ر.س
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default PurchaseRequestDetails;
