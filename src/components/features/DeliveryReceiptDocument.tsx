/**
 * مكون سند الاستلام - عرض وطباعة سند استلام البضاعة
 */

'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PrintStyles from './PrintStyles';
import { PDFDownloadButton } from './PDFGenerator';
import { 
  Printer, 
  PackageCheck, 
  User, 
  Calendar, 
  Hash, 
  Truck,
  FileText,
  PenTool,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { formatDate } from '@/lib/utils/formatDate.util';
import { DigitalSignatureModal } from './DigitalSignatureModal';

export interface DeliveryReceiptData {
  receiptNumber: string;
  deliveryDate: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  driverName: string;
  driverPhone: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    condition: 'good' | 'damaged' | 'missing';
    notes?: string;
  }>;
  totalItems: number;
  status: 'pending' | 'completed' | 'cancelled';
  receiverName?: string;
  receiverPhone?: string;
  receiverSignature?: string;
  delivererSignature?: string;
  notes?: string;
  relatedOrders?: string[];
}

interface DeliveryReceiptDocumentProps {
  data: DeliveryReceiptData;
  onPrint?: () => void;
  onDownload?: () => void;
  onEdit?: () => void;
  onBack?: () => void;
  showActions?: boolean;
  onSignatureUpdate?: (updatedData: DeliveryReceiptData) => void;
}

export default function DeliveryReceiptDocument({ 
  data, 
  onPrint, 
  onDownload, 
  onEdit,
  onBack,
  showActions = true,
  onSignatureUpdate
}: DeliveryReceiptDocumentProps) {
  const [isReceiverSignatureModalOpen, setIsReceiverSignatureModalOpen] = React.useState(false);
  const [isDelivererSignatureModalOpen, setIsDelivererSignatureModalOpen] = React.useState(false);

  // معالجة حفظ توقيع المستلم
  const handleReceiverSignatureSave = (signature: string) => {
    const updatedData = {
      ...data,
      receiverSignature: signature,
      receiverName: data.receiverName || 'مجهول'
    };
    onSignatureUpdate?.(updatedData);
  };

  // معالجة حفظ توقيع المسلم
  const handleDelivererSignatureSave = (signature: string) => {
    const updatedData = {
      ...data,
      delivererSignature: signature
    };
    onSignatureUpdate?.(updatedData);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'في انتظار التسليم';
      case 'completed':
        return 'تم التسليم';
      case 'cancelled':
        return 'ملغي';
      default:
        return 'غير محدد';
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'good':
        return 'جيد';
      case 'damaged':
        return 'تالف';
      case 'missing':
        return 'مفقود';
      default:
        return 'غير محدد';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'good':
        return 'bg-green-100 text-green-800';
      case 'damaged':
        return 'bg-red-100 text-red-800';
      case 'missing':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePrint = () => {
    console.log('طباعة سند الاستلام:', data.receiptNumber);
    
    // التأكد من أن المحتوى مرئي للطباعة
    setTimeout(() => {
      window.print();
      onPrint?.();
    }, 100);
  };


  return (
    <>
      <PrintStyles />
      <div className="space-y-6">
      {/* أزرار الإجراءات */}
      {showActions && (
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200 no-print">
          <div className="flex items-center gap-2">
            <PackageCheck className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">سند الاستلام</h2>
            <Badge className={`${getStatusColor(data.status)} flex items-center gap-2 border`}>
              {getStatusIcon(data.status)}
              {getStatusText(data.status)}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {onBack && (
              <Button
                variant="outline"
                onClick={onBack}
                className="flex items-center gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                الرجوع
              </Button>
            )}
            {onEdit && (
              <Button
                variant="outline"
                onClick={onEdit}
                className="flex items-center gap-2"
              >
                <PenTool className="h-4 w-4" />
                تعديل
              </Button>
            )}
            <PDFDownloadButton
              data={data}
              onDownload={onDownload}
              onError={(error) => alert(error)}
              className="flex items-center gap-2"
            />
            <Button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Printer className="h-4 w-4" />
              طباعة
            </Button>
          </div>
        </div>
      )}

      {/* سند الاستلام الرئيسي */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm delivery-receipt-print">
        {/* رأس السند */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200 p-6 receipt-header">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                سند استلام بضاعة
              </h1>
              <p className="text-lg text-gray-600">
                Receipt of Goods
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">رقم السند:</p>
              <p className="text-xl font-bold text-blue-600 receipt-number">
                {data.receiptNumber}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8 print:space-y-2 print:p-2">
          {/* معلومات أساسية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:gap-4">
            {/* معلومات العميل */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                معلومات العميل
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">اسم العميل:</p>
                  <p className="font-medium text-gray-900">{data.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">رقم الهاتف:</p>
                  <p className="font-medium text-gray-900">{data.customerPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">عنوان التسليم:</p>
                  <p className="font-medium text-gray-900">{data.deliveryAddress}</p>
                </div>
              </div>
            </div>

            {/* معلومات التسليم */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
                <Truck className="h-5 w-5 text-green-600" />
                معلومات التسليم
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">تاريخ التسليم:</p>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                     {formatDate(data.deliveryDate, 'LONG')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">اسم السائق:</p>
                  <p className="font-medium text-gray-900">{data.driverName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">رقم هاتف السائق:</p>
                  <p className="font-medium text-gray-900">{data.driverPhone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* قائمة الأصناف */}
          <div className="space-y-4 print:space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
              <PackageCheck className="h-5 w-5 text-purple-600" />
              قائمة الأصناف المستلمة
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg receipt-table">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b border-gray-200">
                      #
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b border-gray-200">
                      اسم الصنف
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 border-b border-gray-200">
                      الكمية
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 border-b border-gray-200">
                      الحالة
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b border-gray-200">
                      ملاحظات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-100">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 border-b border-gray-100">
                        {item.name}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-900 border-b border-gray-100">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-center border-b border-gray-100">
                        <Badge className={`${getConditionColor(item.condition)} text-xs`}>
                          {getConditionText(item.condition)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 border-b border-gray-100">
                        {item.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={2} className="px-4 py-3 text-sm font-medium text-gray-700">
                      المجموع الكلي للأصناف:
                    </td>
                    <td className="px-4 py-3 text-center text-sm font-bold text-gray-900">
                      {data.totalItems}
                    </td>
                    <td colSpan={2} className="px-4 py-3"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* التوقيعات */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:gap-4">
            {/* توقيع المستلم */}
            <div className="space-y-4">
              <div className="signature-section">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
                  <PenTool className="h-5 w-5 text-green-600" />
                  توقيع المستلم
                </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">اسم المستلم:</p>
                  <p className="font-medium text-gray-900">
                    {data.receiverName || 'لم يتم التوقيع بعد'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">رقم هاتف المستلم:</p>
                  <p className="font-medium text-gray-900">
                    {data.receiverPhone || '-'}
                  </p>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 min-h-[120px] flex items-center justify-center">
                  {data.receiverSignature ? (
                    <div className="text-center">
                      <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-green-600 font-medium">تم التوقيع</p>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400">
                      <PenTool className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">مساحة التوقيع</p>
                    </div>
                  )}
                </div>
                
                {/* زر التوقيع للمستلم */}
                {!data.receiverSignature && showActions && (
                  <Button
                    onClick={() => setIsReceiverSignatureModalOpen(true)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    <PenTool className="h-4 w-4 mr-2" />
                    إضافة توقيع المستلم
                  </Button>
                )}
              </div>
              </div>
            </div>

            {/* توقيع المسلم */}
            <div className="space-y-4">
              <div className="signature-section">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
                  <PenTool className="h-5 w-5 text-blue-600" />
                  توقيع المسلم
                </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">اسم المسلم:</p>
                  <p className="font-medium text-gray-900">{data.driverName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">رقم هاتف المسلم:</p>
                  <p className="font-medium text-gray-900">{data.driverPhone}</p>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 min-h-[120px] flex items-center justify-center">
                  {data.delivererSignature ? (
                    <div className="text-center">
                      <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-green-600 font-medium">تم التوقيع</p>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400">
                      <PenTool className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">مساحة التوقيع</p>
                    </div>
                  )}
                </div>
                
                {/* زر التوقيع للمسلم */}
                {!data.delivererSignature && showActions && (
                  <Button
                    onClick={() => setIsDelivererSignatureModalOpen(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    <PenTool className="h-4 w-4 mr-2" />
                    إضافة توقيع المسلم
                  </Button>
                )}
              </div>
              </div>
            </div>
          </div>

          {/* ملاحظات إضافية */}
          {data.notes && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-600" />
                ملاحظات إضافية
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-700">{data.notes}</p>
              </div>
            </div>
          )}

          {/* الأوامر المرتبطة */}
          {data.relatedOrders && data.relatedOrders.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
                <Hash className="h-5 w-5 text-purple-600" />
                الأوامر المرتبطة
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.relatedOrders.map((order, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {order}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* تذييل السند */}
        <div className="bg-gray-50 border-t border-gray-200 p-4 receipt-footer">
          <div className="text-center text-sm text-gray-500">
            <p>تم إنشاء هذا السند تلقائياً بتاريخ {formatDate(new Date().toISOString(), 'LONG')}</p>
            <p className="mt-1">جميع الحقوق محفوظة © 2024</p>
          </div>
        </div>
      </div>

      {/* مكونات التوقيع الإلكتروني */}
      <DigitalSignatureModal
        isOpen={isReceiverSignatureModalOpen}
        onClose={() => setIsReceiverSignatureModalOpen(false)}
        onSave={handleReceiverSignatureSave}
        signerName={data.receiverName || 'المستلم'}
        title="توقيع المستلم"
      />

      <DigitalSignatureModal
        isOpen={isDelivererSignatureModalOpen}
        onClose={() => setIsDelivererSignatureModalOpen(false)}
        onSave={handleDelivererSignatureSave}
        signerName={data.driverName}
        title="توقيع المسلم"
      />
    </div>
    </>
  );
}
