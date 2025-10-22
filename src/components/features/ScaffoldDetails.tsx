/**
 * مكون تفاصيل السقالة
 */

'use client';

import React from 'react';
import { Scaffold } from '@/lib/types/inventory';
import { Button } from '@/components/ui/button';
import { 
  Edit, 
  ArrowRight, 
  Printer, 
  Download,
  Package,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Image,
} from 'lucide-react';

interface ScaffoldDetailsProps {
  scaffold: Scaffold;
  onEdit: () => void;
  onBack: () => void;
  onPrint: () => void;
  onExport: () => void;
}

export function ScaffoldDetails({ scaffold, onEdit, onBack, onPrint, onExport }: ScaffoldDetailsProps) {
  // تحويل الأنواع إلى نصوص عربية
  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      FIXED: 'مثبتة',
      MOBILE: 'متحركة',
      TOWER: 'برجية',
      CANTILEVER: 'كابولية',
      SUSPENDED: 'معلقة',
    };
    return types[type] || type;
  };

  const getMaterialLabel = (material: string) => {
    const materials: Record<string, string> = {
      STEEL: 'حديد',
      ALUMINUM: 'ألومنيوم',
      WOOD: 'خشب',
      COMPOSITE: 'مركب',
    };
    return materials[material] || material;
  };

  const getConditionLabel = (condition: string) => {
    const conditions: Record<string, string> = {
      NEW: 'جديد',
      USED: 'مستعمل',
      REFURBISHED: 'معاد تأهيله',
    };
    return conditions[condition] || condition;
  };

  const getStatusLabel = (status: string) => {
    const statuses: Record<string, string> = {
      AVAILABLE: 'متوفرة',
      RENTED: 'مستأجرة',
      SOLD: 'مباعة',
      MAINTENANCE: 'تحت الصيانة',
      RESERVED: 'محجوزة',
    };
    return statuses[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      AVAILABLE: 'bg-green-100 text-green-800',
      RENTED: 'bg-blue-100 text-blue-800',
      SOLD: 'bg-purple-100 text-purple-800',
      MAINTENANCE: 'bg-orange-100 text-orange-800',
      RESERVED: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* رأس الصفحة */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 text-[#913D95]" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                تفاصيل السقالة
              </h2>
              <p className="text-sm text-gray-500">
                {scaffold.scaffoldNumber}
              </p>
            </div>
          </div>
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
              className="flex items-center gap-2 bg-[#913D95] hover:bg-[#7A2F7D]"
            >
              <Edit className="h-4 w-4" />
              تعديل
            </Button>
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              العودة
            </Button>
          </div>
        </div>

        {/* محتوى التفاصيل */}
        <div className="p-6 space-y-6">
          {/* المعلومات الأساسية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                المعلومات الأساسية
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">رقم السقالة:</span>
                  <span className="text-sm text-gray-900 font-medium">{scaffold.scaffoldNumber}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">النوع:</span>
                  <span className="text-sm text-gray-900">{getTypeLabel(scaffold.type)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">المادة:</span>
                  <span className="text-sm text-gray-900">{getMaterialLabel(scaffold.material)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">الحالة:</span>
                  <span className="text-sm text-gray-900">{getConditionLabel(scaffold.condition)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">حالة المخزون:</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(scaffold.status)}`}>
                    {getStatusLabel(scaffold.status)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                الأبعاد والكمية
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">الأبعاد:</span>
                  <span className="text-sm text-gray-900">
                    {scaffold.size.height} × {scaffold.size.width} × {scaffold.size.length} متر
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">الكمية الإجمالية:</span>
                  <span className="text-sm text-gray-900 font-medium">{scaffold.quantity}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">الكمية المتوفرة:</span>
                  <span className="text-sm text-gray-900 font-medium">{scaffold.availableQuantity}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">الكمية المستخدمة:</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {scaffold.quantity - scaffold.availableQuantity}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* الموقع والتخزين */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                الموقع والتخزين
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">الموقع:</span>
                  <span className="text-sm text-gray-900">{scaffold.location}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">موقع المخزن:</span>
                  <span className="text-sm text-gray-900">{scaffold.warehouseLocation}</span>
                </div>
                
                {scaffold.supplier && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">المورد:</span>
                    <span className="text-sm text-gray-900">{scaffold.supplier.name}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                الأسعار
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">سعر البيع:</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {scaffold.sellingPrice.toLocaleString()} ريال
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">سعر الإيجار اليومي:</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {scaffold.dailyRentalPrice.toLocaleString()} ريال
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">سعر الإيجار الشهري:</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {scaffold.monthlyRentalPrice.toLocaleString()} ريال
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* التواريخ */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              التواريخ
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500 mb-1">تاريخ الإدخال للمخزون</div>
                <div className="text-sm text-gray-900">
                  {scaffold.entryDate.toLocaleDateString('ar-SA')}
                </div>
              </div>
              
              {scaffold.lastMaintenanceDate && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-500 mb-1">آخر صيانة</div>
                  <div className="text-sm text-gray-900">
                    {scaffold.lastMaintenanceDate.toLocaleDateString('ar-SA')}
                  </div>
                </div>
              )}
              
              {scaffold.nextMaintenanceDate && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-500 mb-1">صيانة قادمة</div>
                  <div className="text-sm text-gray-900">
                    {scaffold.nextMaintenanceDate.toLocaleDateString('ar-SA')}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* المرفقات */}
          {(scaffold.images && scaffold.images.length > 0) || (scaffold.attachments && scaffold.attachments.length > 0) ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                المرفقات
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* الصور */}
                {scaffold.images && scaffold.images.length > 0 && (
                  <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Image className="h-4 w-4" />
                الصور ({scaffold.images.length})
              </h4>
                    <div className="space-y-2">
                      {scaffold.images.map((image, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <span className="text-sm text-gray-700">{image}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#913D95] hover:text-[#7A2F7D]"
                          >
                            عرض
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* المرفقات */}
                {scaffold.attachments && scaffold.attachments.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      المرفقات ({scaffold.attachments.length})
                    </h4>
                    <div className="space-y-2">
                      {scaffold.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <span className="text-sm text-gray-700">{attachment}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#913D95] hover:text-[#7A2F7D]"
                          >
                            تحميل
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* الملاحظات */}
          {scaffold.notes && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                الملاحظات
              </h3>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {scaffold.notes}
                </p>
              </div>
            </div>
          )}

          {/* معلومات إضافية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">تاريخ الإنشاء:</span>
                <span className="text-sm text-gray-900">
                  {scaffold.createdAt.toLocaleDateString('ar-SA')}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">آخر تحديث:</span>
                <span className="text-sm text-gray-900">
                  {scaffold.updatedAt.toLocaleDateString('ar-SA')}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">القيمة الإجمالية:</span>
                <span className="text-sm text-gray-900 font-medium">
                  {(scaffold.sellingPrice * scaffold.quantity).toLocaleString()} ريال
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">القيمة المتوفرة:</span>
                <span className="text-sm text-gray-900 font-medium">
                  {(scaffold.sellingPrice * scaffold.availableQuantity).toLocaleString()} ريال
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
