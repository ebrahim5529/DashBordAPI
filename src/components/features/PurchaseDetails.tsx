/**
 * صفحة تفاصيل الشراء
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { SupplierPurchase } from '@/lib/types/supplier';
import {
  ShoppingCart,
  ArrowLeft,
  Edit,
  Printer,
  Download,
  Calendar,
  User,
  CheckCircle,
  Clock,
  Package,
  XCircle,
  FileText,
  Truck,
} from 'lucide-react';

interface PurchaseDetailsProps {
  purchase: SupplierPurchase;
  onEdit: () => void;
  onBack: () => void;
  onPrint: () => void;
  onExport: () => void;
}

export function PurchaseDetails({
  purchase,
  onEdit,
  onBack,
  onPrint,
  onExport,
}: PurchaseDetailsProps) {
  // تحديد لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // تحديد نص الحالة
  const getStatusText = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'مسلمة';
      case 'CONFIRMED':
        return 'مؤكدة';
      case 'PENDING':
        return 'في الانتظار';
      case 'CANCELLED':
        return 'ملغاة';
      default:
        return status;
    }
  };

  // تحديد أيقونة الحالة
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircle className="h-4 w-4" />;
      case 'CONFIRMED':
        return <Package className="h-4 w-4" />;
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* شريط الإجراءات */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          العودة للقائمة
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onPrint}
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            طباعة
          </Button>
          <Button
            variant="outline"
            onClick={onExport}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            تصدير
          </Button>
          <Button
            onClick={onEdit}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            تعديل
          </Button>
        </div>
      </div>

      {/* معلومات الشراء الأساسية */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-purple-600" />
              {purchase.purchaseNumber}
            </CardTitle>
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(purchase.status)}`}
            >
              {getStatusIcon(purchase.status)}
              {getStatusText(purchase.status)}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* معلومات المورد */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                معلومات المورد
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">اسم المورد</label>
                  <p className="text-sm font-medium">{purchase.supplier.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">رقم المورد</label>
                  <p className="text-sm font-mono">{purchase.supplier.supplierNumber}</p>
                </div>
                {purchase.supplier.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">الهاتف</label>
                    <p className="text-sm">{purchase.supplier.phone}</p>
                  </div>
                )}
                {purchase.supplier.email && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">البريد الإلكتروني</label>
                    <p className="text-sm">{purchase.supplier.email}</p>
                  </div>
                )}
              </div>
            </div>

            {/* تواريخ الشراء */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                تواريخ الشراء
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">تاريخ الشراء</label>
                  <p className="text-sm flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(purchase.purchaseDate).toLocaleDateString('ar-SA')}
                  </p>
                </div>
                {purchase.deliveryDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">تاريخ التسليم المتوقع</label>
                    <p className="text-sm flex items-center gap-1">
                      <Truck className="h-3 w-3" />
                      {new Date(purchase.deliveryDate).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-600">تاريخ الإنشاء</label>
                  <p className="text-sm flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(purchase.createdAt).toLocaleDateString('ar-SA')}
                  </p>
                </div>
              </div>
            </div>

            {/* معلومات الفاتورة */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                معلومات الفاتورة
              </h3>
              <div className="space-y-3">
                {purchase.invoice ? (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-600">رقم الفاتورة</label>
                      <p className="text-sm font-mono">{purchase.invoice.invoiceNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">تاريخ الفاتورة</label>
                      <p className="text-sm">
                        {new Date(purchase.invoice.createdAt).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">حالة الفاتورة</label>
                      <p className="text-sm">{purchase.invoice.status}</p>
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="text-sm font-medium text-gray-600">الفاتورة</label>
                    <p className="text-sm text-gray-500">غير مرتبطة بفاتورة</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-600">إجمالي الشراء</label>
                  <p className="text-lg font-bold text-primary">
                    {purchase.totalAmount.toLocaleString()} ريال
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* عناصر الشراء */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            عناصر الشراء
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50 dark:bg-gray-800">
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                    اسم العنصر
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                    الوصف
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                    الفئة
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                    الكمية
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                    سعر الوحدة
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                    السعر الإجمالي
                  </th>
                </tr>
              </thead>
              <tbody>
                {purchase.items.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3 text-sm">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        {item.category && (
                          <div className="text-xs text-gray-500 mt-1">
                            {item.category}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {item.description || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {item.category || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {item.unitPrice.toLocaleString()} ريال
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {item.totalPrice.toLocaleString()} ريال
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* إجمالي الشراء */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">إجمالي الشراء</h3>
              <div className="text-2xl font-bold text-primary">
                {purchase.totalAmount.toLocaleString()} ريال
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* الملاحظات */}
      {purchase.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              الملاحظات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {purchase.notes}
            </p>
          </CardContent>
        </Card>
      )}

      {/* معلومات إضافية */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            معلومات إضافية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">عدد العناصر</label>
              <p className="text-sm">{purchase.items.length} عنصر</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">آخر تحديث</label>
              <p className="text-sm flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(purchase.updatedAt).toLocaleDateString('ar-SA')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
