/**
 * مكون تفاصيل إيصال التسليم
 */

'use client';

import React from 'react';
import { 
  Receipt, 
  User, 
  Phone, 
  MapPin, 
  Package, 
  Clock, 
  FileText, 
  Camera, 
  CheckCircle, 
  Printer, 
  Edit,
  ArrowRight,
  Calendar,
  Truck,
  CreditCard
} from 'lucide-react';
import { DeliveryReceiptData } from '@/data/operationsData';

interface DeliveryReceiptDetailsProps {
  receipt: DeliveryReceiptData;
  onEdit: (receipt: DeliveryReceiptData) => void;
  onPrint: (receipt: DeliveryReceiptData) => void;
  onBack: () => void;
}

export function DeliveryReceiptDetails({ 
  receipt, 
  onEdit, 
  onPrint, 
  onBack 
}: DeliveryReceiptDetailsProps) {
  
  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // تنسيق الوقت
  const formatTime = (timeString: string) => {
    return timeString;
  };

  // الحصول على لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مكتمل': return 'bg-green-100 text-green-800 border-green-200';
      case 'معلق': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'مرفوض': return 'bg-red-100 text-red-800 border-red-200';
      case 'في الانتظار': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // الحصول على لون نوع الإيصال
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'تسليم': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'استرجاع': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'تسليم واسترجاع': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* العنوان والتحكم */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="العودة للقائمة"
          >
            <ArrowRight className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <Receipt className="h-6 w-6 text-[#58d2c8]" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              تفاصيل إيصال التسليم
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(receipt)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            تعديل
          </button>
          <button
            onClick={() => onPrint(receipt)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            طباعة
          </button>
        </div>
      </div>

      {/* معلومات الإيصال الأساسية */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-[#58d2c8]" />
          <h2 className="text-xl font-semibold text-gray-900">معلومات الإيصال</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* رقم الإيصال */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">رقم الإيصال</label>
            <div className="text-lg font-bold text-gray-900">{receipt.receiptNumber}</div>
            <div className="text-sm text-gray-500">رقم الطلب: {receipt.orderNumber}</div>
          </div>

          {/* نوع الإيصال */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">نوع الإيصال</label>
            <div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(receipt.equipmentType)}`}>
                {receipt.equipmentType}
              </span>
            </div>
          </div>

          {/* الحالة */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">الحالة</label>
            <div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(receipt.status)}`}>
                {receipt.status}
              </span>
            </div>
          </div>

          {/* تاريخ الإنشاء */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">تاريخ الإنشاء</label>
            <div className="flex items-center gap-2 text-gray-900">
              <Calendar className="h-4 w-4" />
              {formatDate(receipt.createdAt)}
            </div>
          </div>

          {/* تاريخ التحديث */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">آخر تحديث</label>
            <div className="flex items-center gap-2 text-gray-900">
              <Clock className="h-4 w-4" />
              {formatDate(receipt.updatedAt)}
            </div>
          </div>

          {/* نسبة التحقق */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">نسبة التحقق</label>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-lg font-semibold text-green-600">85%</span>
            </div>
          </div>
        </div>
      </div>

      {/* معلومات العميل والمستلم */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* معلومات العميل */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">معلومات العميل</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">اسم العميل</label>
              <div className="text-gray-900 font-medium">{receipt.customerName}</div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">رقم الهاتف</label>
              <div className="flex items-center gap-2 text-gray-900">
                <Phone className="h-4 w-4" />
                {receipt.customerPhone}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">العنوان</label>
              <div className="flex items-start gap-2 text-gray-900">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>{receipt.customerAddress}</span>
              </div>
            </div>
          </div>
        </div>

        {/* معلومات المستلم */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">معلومات المستلم</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">اسم المستلم</label>
              <div className="text-gray-900 font-medium">{receipt.recipientName}</div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">رقم الهاتف</label>
              <div className="flex items-center gap-2 text-gray-900">
                <Phone className="h-4 w-4" />
                {receipt.customerPhone}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">صلة القرابة</label>
              <div className="text-gray-900">أخ</div>
            </div>
          </div>
        </div>
      </div>

      {/* معلومات التسليم والمعدات */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* معلومات التسليم */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Truck className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">معلومات التسليم</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">تاريخ التسليم</label>
              <div className="flex items-center gap-2 text-gray-900">
                <Calendar className="h-4 w-4" />
                {formatDate(receipt.deliveryDate)}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">وقت التسليم المحدد</label>
              <div className="flex items-center gap-2 text-gray-900">
                <Clock className="h-4 w-4" />
                {formatTime(receipt.deliveryDate)}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">وقت التسليم الفعلي</label>
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                {formatTime(receipt.deliveryDate)}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">اسم السائق</label>
              <div className="text-gray-900 font-medium">{receipt.driverName}</div>
            </div>
          </div>
        </div>

        {/* معلومات المعدات */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">معلومات المعدات</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">نوع المعدات</label>
              <div className="text-gray-900 font-medium">{receipt.equipmentType}</div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">الكمية</label>
              <div className="text-gray-900 font-medium">{receipt.equipmentQuantity} قطعة</div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">القيمة الإجمالية</label>
              <div className="flex items-center gap-2 text-gray-900">
                <CreditCard className="h-4 w-4" />
                {receipt.equipmentQuantity} قطعة
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* الصور المرفقة */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Camera className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">الصور المرفقة</h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
            {receipt.photos.length} صورة
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {receipt.photos.map((photo, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">صورة {index + 1}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {receipt.photos.length === 0 && (
          <div className="text-center py-8">
            <Camera className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">لا توجد صور مرفقة</p>
          </div>
        )}
      </div>

      {/* ملاحظات إضافية */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">ملاحظات إضافية</h3>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-600">ملاحظات السائق</label>
            <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
              <p className="text-gray-900">تم التسليم بنجاح مع التوقيع الإلكتروني والتحقق من الهوية.</p>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600">ملاحظات المستلم</label>
            <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
              <p className="text-gray-900">تم استلام المعدات بحالة جيدة.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
