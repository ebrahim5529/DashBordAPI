/**
 * مكون عرض تفاصيل الفاتورة الشامل
 * يعرض جميع تفاصيل الفاتورة مع إمكانية الطباعة والإرسال
 */

'use client';

import React, { useState } from 'react';
import { InvoiceTableData } from '@/lib/types/financial';
import { Button } from '@/components/shared/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import {
  ArrowLeft,
  FileText,
  Building2,
  DollarSign,
  Printer,
  Mail,
  Download,
  Edit,
  CheckCircle,
  Clock,
  AlertCircle,
  Package,
  CreditCard,
  Send,
  Copy,
  Eye,
} from 'lucide-react';

interface InvoiceDetailsProps {
  invoice: InvoiceTableData;
  onBack: () => void;
  onEdit?: (invoice: InvoiceTableData) => void;
  onConfirmPayment?: (invoice: InvoiceTableData) => void;
  onExport?: (invoice: InvoiceTableData) => void;
  onPrint?: (invoice: InvoiceTableData) => void;
  onSendEmail?: (invoice: InvoiceTableData) => void;
}

export function InvoiceDetails({
  invoice,
  onBack,
  onEdit,
  onConfirmPayment,
  onExport,
  onPrint,
  onSendEmail,
}: InvoiceDetailsProps) {
  const [copied, setCopied] = useState(false);

  // دالة لتحديد لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'UNPAID':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'OVERDUE':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // دالة لتحديد أيقونة الحالة
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle className="h-4 w-4" />;
      case 'UNPAID':
        return <AlertCircle className="h-4 w-4" />;
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      case 'OVERDUE':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // دالة لتحديد نص الحالة بالعربية
  const getStatusText = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'مدفوعة';
      case 'UNPAID':
        return 'غير مدفوعة';
      case 'PENDING':
        return 'في الانتظار';
      case 'OVERDUE':
        return 'متأخرة';
      default:
        return status;
    }
  };

  // دالة لتحديد نوع الفاتورة
  const getTypeText = (type: string) => {
    switch (type) {
      case 'OUTGOING':
        return 'فاتورة صادرة';
      case 'INCOMING':
        return 'فاتورة واردة';
      default:
        return type;
    }
  };

  // دالة نسخ رقم الفاتورة
  const handleCopyInvoiceNumber = () => {
    navigator.clipboard.writeText(invoice.invoiceNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // حساب الضريبة
  const taxAmount = invoice.totalAmount * 0.15;
  const totalWithTax = invoice.totalAmount + taxAmount;

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
              تفاصيل الفاتورة
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-gray-600 dark:text-gray-400">
                {invoice.invoiceNumber}
              </p>
              <button
                onClick={handleCopyInvoiceNumber}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors duration-200"
                title="نسخ رقم الفاتورة"
              >
                <Copy className="h-4 w-4 text-gray-500" />
              </button>
              {copied && (
                <span className="text-green-600 text-sm">تم النسخ!</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {onPrint && (
          <Button
            variant="outline"
              onClick={() => onPrint(invoice)}
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            طباعة
          </Button>
          )}
          {onSendEmail && (
            <Button
              variant="outline"
              onClick={() => onSendEmail(invoice)}
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              إرسال
            </Button>
          )}
          {onExport && (
          <Button
            variant="outline"
              onClick={() => onExport(invoice)}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            تصدير
          </Button>
          )}
          {onEdit && (
          <Button
              variant="outline"
              onClick={() => onEdit(invoice)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            تعديل
          </Button>
          )}
          {onConfirmPayment && invoice.status !== 'PAID' && (
            <Button
              onClick={() => onConfirmPayment(invoice)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="h-4 w-4" />
              تأكيد الدفع
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Information */}
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                معلومات الفاتورة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    رقم الفاتورة
                  </label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {invoice.invoiceNumber}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    الحالة
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(invoice.status)}`}>
              {getStatusIcon(invoice.status)}
              {getStatusText(invoice.status)}
            </span>
          </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    تاريخ الفاتورة
                  </label>
                  <p className="text-lg text-gray-900 dark:text-white">
                    {new Date(invoice.date).toLocaleDateString('ar-SA')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    نوع الفاتورة
                  </label>
                  <p className="text-lg text-gray-900 dark:text-white">
                    {getTypeText(invoice.type)}
                  </p>
                </div>
                  <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    المبلغ الإجمالي
                  </label>
                  <p className="text-lg font-semibold text-green-600">
                    {invoice.totalAmount.toLocaleString('ar-SA')} ر.س
                  </p>
                  </div>
                  <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    طريقة الدفع
                  </label>
                  <p className="text-lg text-gray-900 dark:text-white">
                    {invoice.paymentMethod || 'غير محدد'}
                  </p>
                  </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer/Supplier Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                معلومات {invoice.partyType === 'CUSTOMER' ? 'العميل' : 'المورد'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    الاسم
                  </label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {invoice.partyName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    النوع
                  </label>
                  <p className="text-lg text-gray-900 dark:text-white">
                    {invoice.partyType === 'CUSTOMER' ? 'عميل' : 'مورد'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    العنوان
                  </label>
                  <p className="text-lg text-gray-900 dark:text-white">
                    الرياض، المملكة العربية السعودية
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    الهاتف
                  </label>
                  <p className="text-lg text-gray-900 dark:text-white">
                    +966 50 123 4567
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    البريد الإلكتروني
                  </label>
                  <p className="text-lg text-gray-900 dark:text-white">
                    info@{invoice.partyName.toLowerCase().replace(/\s+/g, '')}.com
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    الموقع الإلكتروني
                  </label>
                  <p className="text-lg text-gray-900 dark:text-white">
                    www.{invoice.partyName.toLowerCase().replace(/\s+/g, '')}.com
                  </p>
            </div>
          </div>
        </CardContent>
      </Card>

          {/* Invoice Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            عناصر الفاتورة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                    الوصف
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
                        خدمة أو منتج
                    </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        1
                    </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        {invoice.totalAmount.toLocaleString('ar-SA')} ر.س
                    </td>
                      <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        {invoice.totalAmount.toLocaleString('ar-SA')} ر.س
                    </td>
                  </tr>
              </tbody>
            </table>
          </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                معلومات الدفع
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    طريقة الدفع
                  </label>
                  <p className="text-lg text-gray-900 dark:text-white">
                    {invoice.paymentMethod || 'تحويل بنكي'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    تاريخ الاستحقاق
                  </label>
                  <p className="text-lg text-gray-900 dark:text-white">
                    {new Date(invoice.date.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('ar-SA')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    رقم الحساب
                  </label>
                  <p className="text-lg text-gray-900 dark:text-white">
                    SA03 8000 0000 6080 1016 7519
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    البنك
                  </label>
                  <p className="text-lg text-gray-900 dark:text-white">
                    البنك الأهلي السعودي
                  </p>
                </div>
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
                مسار الفاتورة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      تم إنشاء الفاتورة
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(invoice.date).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${invoice.status === 'PENDING' ? 'bg-yellow-500' : 'bg-gray-300'}`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      مرسلة للعميل
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      في انتظار المراجعة
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${invoice.status === 'PAID' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      مدفوعة
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      تم استلام الدفع
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
                <Send className="h-5 w-5" />
                إجراءات سريعة
            </CardTitle>
          </CardHeader>
            <CardContent className="space-y-3">
              {onEdit && (
                <Button
                  variant="outline"
                  onClick={() => onEdit(invoice)}
                  className="w-full justify-start"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  تعديل الفاتورة
                </Button>
              )}
              {onConfirmPayment && invoice.status !== 'PAID' && (
                <Button
                  onClick={() => onConfirmPayment(invoice)}
                  className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  تأكيد الدفع
                </Button>
              )}
              {onSendEmail && (
                <Button
                  variant="outline"
                  onClick={() => onSendEmail(invoice)}
                  className="w-full justify-start"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  إرسال عبر البريد
                </Button>
              )}
              {onExport && (
                <Button
                  variant="outline"
                  onClick={() => onExport(invoice)}
                  className="w-full justify-start"
                >
                  <Download className="h-4 w-4 mr-2" />
                  تصدير PDF
                </Button>
              )}
              {onPrint && (
                <Button
                  variant="outline"
                  onClick={() => onPrint(invoice)}
                  className="w-full justify-start"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  طباعة الفاتورة
                </Button>
              )}
          </CardContent>
        </Card>

          {/* Invoice Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                ملخص الفاتورة
          </CardTitle>
        </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">المبلغ الأساسي:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {invoice.totalAmount.toLocaleString('ar-SA')} ر.س
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">الضريبة (15%):</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {taxAmount.toLocaleString('ar-SA')} ر.س
                </span>
            </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-900 dark:text-white">المجموع النهائي:</span>
                  <span className="text-lg font-bold text-green-600">
                    {totalWithTax.toLocaleString('ar-SA')} ر.س
                  </span>
            </div>
          </div>
        </CardContent>
      </Card>

          {/* Payment Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                حالة الدفع
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
                  {getStatusIcon(invoice.status)}
                  {getStatusText(invoice.status)}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  آخر تحديث: {new Date(invoice.createdAt).toLocaleDateString('ar-SA')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default InvoiceDetails;