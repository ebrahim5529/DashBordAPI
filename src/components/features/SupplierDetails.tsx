/**
 * صفحة تفاصيل المورد
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { SupplierDetails as SupplierDetailsType } from '@/lib/types/supplier';
import {
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star,
  AlertTriangle,
  FileText,
  ShoppingCart,
  ArrowLeft,
  Edit,
  Printer,
  Download,
  UserCheck,
  Building,
  CreditCard,
  CheckCircle,
  XCircle,
  Activity,
} from 'lucide-react';

interface SupplierDetailsProps {
  supplier: SupplierDetailsType;
  onEdit: () => void;
  onBack: () => void;
  onPrint: () => void;
  onExport: () => void;
}

export function SupplierDetails({
  supplier,
  onEdit,
  onBack,
  onPrint,
  onExport,
}: SupplierDetailsProps) {
  // تحديد لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // تحديد نص الحالة
  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'نشط';
      case 'INACTIVE':
        return 'غير نشط';
      case 'SUSPENDED':
        return 'معلق';
      default:
        return status;
    }
  };

  // تحديد نوع المورد
  const getSupplierTypeText = (type: string) => {
    return type === 'COMPANY' ? 'شركة' : 'فرد';
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

      {/* معلومات المورد الأساسية */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {supplier.supplierType === 'COMPANY' ? (
                <Building2 className="h-6 w-6 text-blue-600" />
              ) : (
                <User className="h-6 w-6 text-green-600" />
              )}
              {supplier.name}
            </CardTitle>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(supplier.status)}`}
              >
                {getStatusText(supplier.status)}
              </span>
              {supplier.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{supplier.rating}/5</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* المعلومات الأساسية */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                المعلومات الأساسية
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">رقم المورد</label>
                  <p className="text-sm font-mono">{supplier.supplierNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">نوع المورد</label>
                  <p className="text-sm">{getSupplierTypeText(supplier.supplierType)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">الجنسية</label>
                  <p className="text-sm">{supplier.nationality || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">تاريخ التسجيل</label>
                  <p className="text-sm flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(supplier.registrationDate).toLocaleDateString('ar-SA')}
                  </p>
                </div>
              </div>
            </div>

            {/* معلومات التواصل */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Phone className="h-5 w-5" />
                معلومات التواصل
              </h3>
              <div className="space-y-3">
                {supplier.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">الهاتف</label>
                    <p className="text-sm flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {supplier.phone}
                    </p>
                  </div>
                )}
                {supplier.email && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">البريد الإلكتروني</label>
                    <p className="text-sm flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {supplier.email}
                    </p>
                  </div>
                )}
                {supplier.address && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">العنوان</label>
                    <p className="text-sm flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {supplier.address}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* معلومات الهوية */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                معلومات الهوية
              </h3>
              <div className="space-y-3">
                {supplier.commercialRecord && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">رقم السجل التجاري</label>
                    <p className="text-sm font-mono">{supplier.commercialRecord}</p>
                  </div>
                )}
                {supplier.commercialRecord && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">السجل التجاري</label>
                    <p className="text-sm font-mono">{supplier.commercialRecord}</p>
                  </div>
                )}
                {supplier.taxNumber && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">الرقم الضريبي</label>
                    <p className="text-sm font-mono">{supplier.taxNumber}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* معلومات الشخص المسؤول */}
      {supplier.contactPerson && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              معلومات الشخص المسؤول
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">الاسم</label>
                <p className="text-sm">{supplier.contactPerson}</p>
              </div>
              {supplier.contactPersonPhone && (
                <div>
                  <label className="text-sm font-medium text-gray-600">الهاتف</label>
                  <p className="text-sm flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {supplier.contactPersonPhone}
                  </p>
                </div>
              )}
              {supplier.contactPersonEmail && (
                <div>
                  <label className="text-sm font-medium text-gray-600">البريد الإلكتروني</label>
                  <p className="text-sm flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {supplier.contactPersonEmail}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* معلومات البنك */}
      {(supplier.bankName || supplier.bankAccount || supplier.iban || supplier.swiftCode) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              معلومات البنك
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {supplier.bankName && (
                <div>
                  <label className="text-sm font-medium text-gray-600">اسم البنك</label>
                  <p className="text-sm">{supplier.bankName}</p>
                </div>
              )}
              {supplier.bankAccount && (
                <div>
                  <label className="text-sm font-medium text-gray-600">رقم الحساب</label>
                  <p className="text-sm font-mono">{supplier.bankAccount}</p>
                </div>
              )}
              {supplier.iban && (
                <div>
                  <label className="text-sm font-medium text-gray-600">رقم الآيبان</label>
                  <p className="text-sm font-mono">{supplier.iban}</p>
                </div>
              )}
              {supplier.swiftCode && (
                <div>
                  <label className="text-sm font-medium text-gray-600">رمز السويفت</label>
                  <p className="text-sm font-mono">{supplier.swiftCode}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* إحصائيات الفواتير والمشتريات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* إحصائيات الفواتير */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              إحصائيات الفواتير
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {supplier.invoicesSummary.total}
                  </div>
                  <div className="text-sm text-gray-600">إجمالي الفواتير</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {supplier.invoicesSummary.paid}
                  </div>
                  <div className="text-sm text-gray-600">مدفوعة</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {supplier.invoicesSummary.pending}
                  </div>
                  <div className="text-sm text-gray-600">معلقة</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {supplier.invoicesSummary.overdue}
                  </div>
                  <div className="text-sm text-gray-600">متأخرة</div>
                </div>
              </div>
              <div className="text-center pt-2 border-t">
                <div className="text-lg font-bold">
                  {supplier.invoicesSummary.totalAmount.toLocaleString()} ريال
                </div>
                <div className="text-sm text-gray-600">إجمالي المبلغ</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* إحصائيات المشتريات */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              إحصائيات المشتريات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {supplier.purchasesSummary.total}
                  </div>
                  <div className="text-sm text-gray-600">إجمالي المشتريات</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {supplier.purchasesSummary.delivered}
                  </div>
                  <div className="text-sm text-gray-600">مسلمة</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {supplier.purchasesSummary.pending}
                  </div>
                  <div className="text-sm text-gray-600">معلقة</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {supplier.purchasesSummary.confirmed}
                  </div>
                  <div className="text-sm text-gray-600">مؤكدة</div>
                </div>
              </div>
              <div className="text-center pt-2 border-t">
                <div className="text-lg font-bold">
                  {supplier.purchasesSummary.totalAmount.toLocaleString()} ريال
                </div>
                <div className="text-sm text-gray-600">إجمالي المبلغ</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* النشاط الأخير */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            النشاط الأخير
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {supplier.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-shrink-0">
                  {activity.action.includes('إضافة') && (
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  )}
                  {activity.action.includes('تحديث') && (
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Edit className="h-4 w-4 text-blue-600" />
                    </div>
                  )}
                  {activity.action.includes('حذف') && (
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                      <XCircle className="h-4 w-4 text-red-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{activity.action}</h4>
                    <span className="text-xs text-gray-500">
                      {new Date(activity.createdAt).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    بواسطة: {activity.user.name} ({activity.user.email})
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* الملاحظات والتحذيرات */}
      {(supplier.notes || supplier.warnings) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {supplier.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  الملاحظات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {supplier.notes}
                </p>
              </CardContent>
            </Card>
          )}

          {supplier.warnings && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  التحذيرات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-700 dark:text-red-300 whitespace-pre-wrap">
                  {supplier.warnings}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
