/**
 * مكون تفاصيل فحص الاسترجاع
 */

'use client';

import React from 'react';
import { 
  Search, 
  User, 
  Package, 
  Clock, 
  FileText, 
  Camera, 
  CheckCircle, 
  AlertTriangle,
  Edit,
  ArrowRight,
  Calendar,
  MapPin,
  Thermometer,
  Shield,
  XCircle,
  CreditCard,
  Activity
} from 'lucide-react';
import { ReturnInspectionData } from '@/data/operationsData';

interface ReturnInspectionDetailsProps {
  inspection: ReturnInspectionData;
  onEdit: (inspection: ReturnInspectionData) => void;
  onApprove: (inspection: ReturnInspectionData) => void;
  onReject: (inspection: ReturnInspectionData) => void;
  onBack: () => void;
}

export function ReturnInspectionDetails({ 
  inspection, 
  onEdit, 
  onApprove, 
  onReject, 
  onBack 
}: ReturnInspectionDetailsProps) {
  
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

  // تنسيق المبلغ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'OMR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // الحصول على لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مكتمل': return 'bg-green-100 text-green-800 border-green-200';
      case 'قيد الفحص': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'مرفوض': return 'bg-red-100 text-red-800 border-red-200';
      case 'في الانتظار': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'يحتاج إصلاح': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // الحصول على لون نوع الفحص
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'فحص استرجاع': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'فحص تلف': return 'bg-red-100 text-red-800 border-red-200';
      case 'فحص شامل': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'فحص سريع': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // الحصول على لون حالة المعدات
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'ممتاز': return 'bg-green-100 text-green-800 border-green-200';
      case 'جيد': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'متوسط': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ضعيف': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'تالف': return 'bg-red-100 text-red-800 border-red-200';
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
            <Search className="h-6 w-6 text-[#58d2c8]" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              تفاصيل فحص الاسترجاع
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(inspection)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            تعديل
          </button>
          <button
            onClick={() => onApprove(inspection)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            موافقة
          </button>
          <button
            onClick={() => onReject(inspection)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <XCircle className="h-4 w-4" />
            رفض
          </button>
        </div>
      </div>

      {/* معلومات الفحص الأساسية */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-[#58d2c8]" />
          <h2 className="text-xl font-semibold text-gray-900">معلومات الفحص</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* رقم الفحص */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">رقم الفحص</label>
            <div className="text-lg font-bold text-gray-900">{inspection.inspectionNumber}</div>
            <div className="text-sm text-gray-500">رقم الطلب: {inspection.orderNumber}</div>
          </div>

          {/* نوع الفحص */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">نوع الفحص</label>
            <div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(inspection.equipmentType)}`}>
                {inspection.equipmentType}
              </span>
            </div>
          </div>

          {/* الحالة العامة */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">الحالة العامة</label>
            <div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(inspection.overallStatus)}`}>
                {inspection.overallStatus}
              </span>
            </div>
          </div>

          {/* تاريخ الفحص */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">تاريخ الفحص</label>
            <div className="flex items-center gap-2 text-gray-900">
              <Calendar className="h-4 w-4" />
              {formatDate(inspection.returnDate)}
            </div>
          </div>

          {/* وقت الفحص */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">وقت الفحص</label>
            <div className="flex items-center gap-2 text-gray-900">
              <Clock className="h-4 w-4" />
              {formatTime(inspection.returnDate)}
            </div>
          </div>

          {/* مدة الفحص */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">مدة الفحص</label>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <span className="text-lg font-semibold text-gray-900">25 دقيقة</span>
            </div>
          </div>
        </div>
      </div>

      {/* معلومات العميل والمفتش */}
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
              <div className="text-gray-900 font-medium">{inspection.customerName}</div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">رقم الطلب</label>
              <div className="text-gray-900 font-medium">{inspection.orderNumber}</div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">تاريخ الاسترجاع</label>
              <div className="flex items-center gap-2 text-gray-900">
                <Calendar className="h-4 w-4" />
                {formatDate(inspection.returnDate)}
              </div>
            </div>
          </div>
        </div>

        {/* معلومات المفتش */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">معلومات المفتش</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">اسم المفتش</label>
              <div className="text-gray-900 font-medium">{inspection.inspectorName}</div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">القسم</label>
              <div className="text-gray-900">قسم الفحص</div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">التخصص</label>
              <div className="text-gray-900">فحص المعدات الثقيلة</div>
            </div>
          </div>
        </div>
      </div>

      {/* معلومات المعدات */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">معلومات المعدات</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-600">نوع المعدات</label>
            <div className="text-gray-900 font-medium">{inspection.equipmentType}</div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600">الكمية</label>
            <div className="text-gray-900 font-medium">{inspection.equipmentQuantity} قطعة</div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600">حالة المعدات</label>
            <div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getConditionColor(inspection.equipmentCondition)}`}>
                {inspection.equipmentCondition}
              </span>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600">درجة الجودة</label>
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-green-500" />
              <span className="text-lg font-semibold text-green-600">85%</span>
            </div>
          </div>
        </div>
      </div>

      {/* التلفيات والأضرار */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">التلفيات والأضرار</h3>
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
            {inspection.damages.length} ضرر
          </span>
        </div>
        
        {inspection.damages.length > 0 ? (
          <div className="space-y-4">
            {inspection.damages.map((damage, index) => (
              <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="font-medium text-red-900">ضرر #{index + 1}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-red-700 font-medium">الوصف:</label>
                    <div className="text-red-800">{damage.description}</div>
                  </div>
                  <div>
                    <label className="text-red-700 font-medium">مستوى الضرر:</label>
                    <div className="text-red-800">{damage.severity}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-300 mx-auto mb-3" />
            <p className="text-green-600 font-medium">لا توجد تلفيات أو أضرار</p>
            <p className="text-gray-500 text-sm">المعدات في حالة ممتازة</p>
          </div>
        )}
        
        {/* تكلفة الإصلاح */}
        {inspection.repairCost && inspection.repairCost > 0 && (
          <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="h-4 w-4 text-orange-600" />
              <span className="font-medium text-orange-900">تكلفة الإصلاح المقدرة</span>
            </div>
            <div className="text-2xl font-bold text-orange-700">
              {formatCurrency(inspection.repairCost)}
            </div>
          </div>
        )}
      </div>

      {/* الصور المرفقة */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Camera className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">الصور المرفقة</h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
            {inspection.photos.length} صورة
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {inspection.photos.map((photo, index) => (
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
        
        {inspection.photos.length === 0 && (
          <div className="text-center py-8">
            <Camera className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">لا توجد صور مرفقة</p>
          </div>
        )}
      </div>

      {/* ملاحظات الفحص */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">ملاحظات الفحص</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">ملاحظات المفتش</label>
            <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
              <p className="text-gray-900">
                تم فحص جميع المعدات المسترجعة. المعدات في حالة جيدة عموماً مع وجود بعض التلفيات البسيطة التي تحتاج إصلاح.
              </p>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600">توصيات المفتش</label>
            <div className="mt-1 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-900">
                يوصى بإصلاح التلفيات البسيطة قبل إعادة استخدام المعدات في مشاريع جديدة.
              </p>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600">حالة البيئة</label>
            <div className="mt-1 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 text-green-900">
                <MapPin className="h-4 w-4" />
                <span>موقع الفحص: طقس جيد - إضاءة كافية</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
