/**
 * نموذج إضافة/تعديل المعدة
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Scaffold, ScaffoldType, ScaffoldMaterial, ScaffoldCondition, ScaffoldStatus } from '@/lib/types/inventory';
import { Button } from '@/components/ui/button';
import { 
  Save, 
  X, 
  Trash2,
  Package,
} from 'lucide-react';

interface ScaffoldFormProps {
  scaffold?: Scaffold;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ScaffoldForm({ scaffold, onSubmit, onCancel, isLoading = false }: ScaffoldFormProps) {
  const [formData, setFormData] = useState({
    itemCode: '', // كود الصنف
    arabicDescription: '', // الوصف العربي للصنف
    englishDescription: '', // الوصف الإنجليزي للصنف
    scaffoldNumber: '',
    type: 'FIXED' as ScaffoldType,
    size: {
      height: 0,
      width: 0,
      length: 0,
    },
    material: 'STEEL' as ScaffoldMaterial,
    condition: 'NEW' as ScaffoldCondition,
    status: 'AVAILABLE' as ScaffoldStatus,
    quantity: 0,
    availableQuantity: 0,
    location: '',
    warehouseLocation: '',
    sellingPrice: 0,
    dailyRentalPrice: 0,
    monthlyRentalPrice: 0,
    entryDate: new Date().toISOString().split('T')[0],
    lastMaintenanceDate: '',
    nextMaintenanceDate: '',
    notes: '',
    images: [] as string[],
    attachments: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // تحميل بيانات المعدة عند التعديل
  useEffect(() => {
    if (scaffold) {
      setFormData({
        itemCode: scaffold.scaffoldNumber || '', // استخدام رقم المعدة ككود الصنف مؤقتاً
        arabicDescription: scaffold.type || '', // استخدام نوع المعدة كوصف عربي مؤقتاً
        englishDescription: scaffold.material || '', // استخدام المادة كوصف إنجليزي مؤقتاً
        scaffoldNumber: scaffold.scaffoldNumber,
        type: scaffold.type,
        size: scaffold.size,
        material: scaffold.material,
        condition: scaffold.condition,
        status: scaffold.status,
        quantity: scaffold.quantity,
        availableQuantity: scaffold.availableQuantity,
        location: scaffold.location,
        warehouseLocation: scaffold.warehouseLocation,
        sellingPrice: scaffold.sellingPrice,
        dailyRentalPrice: scaffold.dailyRentalPrice,
        monthlyRentalPrice: scaffold.monthlyRentalPrice,
        entryDate: scaffold.entryDate.toISOString().split('T')[0],
        lastMaintenanceDate: scaffold.lastMaintenanceDate ? scaffold.lastMaintenanceDate.toISOString().split('T')[0] : '',
        nextMaintenanceDate: scaffold.nextMaintenanceDate ? scaffold.nextMaintenanceDate.toISOString().split('T')[0] : '',
        notes: scaffold.notes || '',
        images: scaffold.images || [],
        attachments: scaffold.attachments || [],
      });
    }
  }, [scaffold]);

  // التحقق من صحة البيانات
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.itemCode.trim()) {
      newErrors.itemCode = 'كود الصنف مطلوب';
    }

    if (!formData.arabicDescription.trim()) {
      newErrors.arabicDescription = 'الوصف العربي للصنف مطلوب';
    }

    if (!formData.englishDescription.trim()) {
      newErrors.englishDescription = 'الوصف الإنجليزي للصنف مطلوب';
    }

    if (!formData.type) {
      newErrors.type = 'نوع المعدة مطلوب';
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = 'الكمية يجب أن تكون أكبر من صفر';
    }

    if (formData.availableQuantity < 0) {
      newErrors.availableQuantity = 'الكمية المتوفرة لا يمكن أن تكون سالبة';
    }

    if (formData.availableQuantity > formData.quantity) {
      newErrors.availableQuantity = 'الكمية المتوفرة لا يمكن أن تكون أكبر من الكمية الإجمالية';
    }

    if (formData.dailyRentalPrice <= 0) {
      newErrors.dailyRentalPrice = 'قيمة الإيجار اليومي يجب أن تكون أكبر من صفر';
    }

    if (formData.monthlyRentalPrice <= 0) {
      newErrors.monthlyRentalPrice = 'قيمة الإيجار الشهري يجب أن تكون أكبر من صفر';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // معالجة إرسال النموذج
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      entryDate: new Date(formData.entryDate),
      lastMaintenanceDate: formData.lastMaintenanceDate ? new Date(formData.lastMaintenanceDate) : undefined,
      nextMaintenanceDate: formData.nextMaintenanceDate ? new Date(formData.nextMaintenanceDate) : undefined,
    };

    onSubmit(submitData);
  };

  // معالجة تغيير الحقول
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // إزالة الخطأ عند التعديل
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  // معالجة تغيير الأبعاد
  const handleSizeChange = (dimension: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      size: {
        ...prev.size,
        [dimension]: value,
      },
    }));

    // إزالة خطأ البعد المحدد
    if (errors[dimension]) {
      setErrors(prev => ({
        ...prev,
        [dimension]: '',
      }));
    }
  };

  // معالجة رفع الصور
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => file.name);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    }
  };

  // معالجة رفع المرفقات
  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAttachments = Array.from(files).map(file => file.name);
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...newAttachments],
      }));
    }
  };

  // حذف صورة
  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // حذف مرفق
  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* رأس النموذج */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 text-[#913D95]" />
            <h2 className="text-xl font-semibold text-gray-900">
              {scaffold ? 'تعديل المعدة' : 'إضافة معدة جديد'}
            </h2>
          </div>
          <Button
            variant="ghost"
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* محتوى النموذج */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* معلومات الصنف الأساسية */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              معلومات الصنف الأساسية
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  كود الصنف *
                </label>
                <input
                  type="text"
                  value={formData.itemCode}
                  onChange={(e) => handleInputChange('itemCode', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent ${
                    errors.itemCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="مثال: SCF-001"
                />
                {errors.itemCode && (
                  <p className="text-red-500 text-xs mt-1">{errors.itemCode}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوصف العربي للصنف *
                </label>
                <input
                  type="text"
                  value={formData.arabicDescription}
                  onChange={(e) => handleInputChange('arabicDescription', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent ${
                    errors.arabicDescription ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="مثال: معدة حديدية مثبتة"
                />
                {errors.arabicDescription && (
                  <p className="text-red-500 text-xs mt-1">{errors.arabicDescription}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوصف الإنجليزي للصنف *
                </label>
                <input
                  type="text"
                  value={formData.englishDescription}
                  onChange={(e) => handleInputChange('englishDescription', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent ${
                    errors.englishDescription ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="مثال: Fixed Steel Scaffold"
                />
                {errors.englishDescription && (
                  <p className="text-red-500 text-xs mt-1">{errors.englishDescription}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الكمية *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent ${
                    errors.quantity ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="50"
                />
                {errors.quantity && (
                  <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
                )}
              </div>
            </div>
          </div>

          {/* أسعار الإيجار */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              أسعار الإيجار (ريال عماني)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  قيمة الإيجار اليومي *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.dailyRentalPrice}
                  onChange={(e) => handleInputChange('dailyRentalPrice', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent ${
                    errors.dailyRentalPrice ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="50.00"
                />
                {errors.dailyRentalPrice && (
                  <p className="text-red-500 text-xs mt-1">{errors.dailyRentalPrice}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  قيمة الإيجار الشهري *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.monthlyRentalPrice}
                  onChange={(e) => handleInputChange('monthlyRentalPrice', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent ${
                    errors.monthlyRentalPrice ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="1200.00"
                />
                {errors.monthlyRentalPrice && (
                  <p className="text-red-500 text-xs mt-1">{errors.monthlyRentalPrice}</p>
                )}
              </div>
            </div>
          </div>

          {/* المعلومات التقنية */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              المعلومات التقنية
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع المعدة *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value as ScaffoldType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent"
                >
                  <option value="">اختر نوع المعدة</option>
                  <option value="FIXED">مثبتة</option>
                  <option value="MOBILE">متحركة</option>
                  <option value="TOWER">برجية</option>
                  <option value="CANTILEVER">كابولية</option>
                  <option value="SUSPENDED">معلقة</option>
                </select>
                {errors.type && (
                  <p className="text-red-500 text-xs mt-1">{errors.type}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم المعدة (اختياري)
                </label>
                <input
                  type="text"
                  value={formData.scaffoldNumber}
                  onChange={(e) => handleInputChange('scaffoldNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent"
                  placeholder="مثال: SCF-001"
                />
                {errors.scaffoldNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.scaffoldNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المادة
                </label>
                <select
                  value={formData.material}
                  onChange={(e) => handleInputChange('material', e.target.value as ScaffoldMaterial)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent"
                >
                  <option value="STEEL">حديد</option>
                  <option value="ALUMINUM">ألومنيوم</option>
                  <option value="WOOD">خشب</option>
                  <option value="COMPOSITE">مركب</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحالة
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) => handleInputChange('condition', e.target.value as ScaffoldCondition)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent"
                >
                  <option value="NEW">جديد</option>
                  <option value="USED">مستعمل</option>
                  <option value="REFURBISHED">معاد تأهيله</option>
                </select>
              </div>
            </div>
          </div>

          {/* الأبعاد */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              الأبعاد (بالمتر)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الارتفاع *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.size.height}
                  onChange={(e) => handleSizeChange('height', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent ${
                    errors.height ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="3.0"
                />
                {errors.height && (
                  <p className="text-red-500 text-xs mt-1">{errors.height}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العرض *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.size.width}
                  onChange={(e) => handleSizeChange('width', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent ${
                    errors.width ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="2.0"
                />
                {errors.width && (
                  <p className="text-red-500 text-xs mt-1">{errors.width}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الطول *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.size.length}
                  onChange={(e) => handleSizeChange('length', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent ${
                    errors.length ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="1.0"
                />
                {errors.length && (
                  <p className="text-red-500 text-xs mt-1">{errors.length}</p>
                )}
              </div>
            </div>
          </div>

          {/* الكمية المتوفرة وحالة المخزون */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              الكمية المتوفرة وحالة المخزون
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الكمية المتوفرة
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.availableQuantity}
                  onChange={(e) => handleInputChange('availableQuantity', parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent ${
                    errors.availableQuantity ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="45"
                />
                {errors.availableQuantity && (
                  <p className="text-red-500 text-xs mt-1">{errors.availableQuantity}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  حالة المخزون
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as ScaffoldStatus)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent"
                >
                  <option value="AVAILABLE">متوفرة</option>
                  <option value="RENTED">مستأجرة</option>
                  <option value="SOLD">مباعة</option>
                  <option value="MAINTENANCE">تحت الصيانة</option>
                  <option value="RESERVED">محجوزة</option>
                </select>
              </div>
            </div>
          </div>

          {/* الموقع والتخزين */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              الموقع والتخزين
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الموقع *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="المخزن الرئيسي"
                />
                {errors.location && (
                  <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  موقع المخزن *
                </label>
                <input
                  type="text"
                  value={formData.warehouseLocation}
                  onChange={(e) => handleInputChange('warehouseLocation', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent ${
                    errors.warehouseLocation ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="المنطقة أ - الرف 1"
                />
                {errors.warehouseLocation && (
                  <p className="text-red-500 text-xs mt-1">{errors.warehouseLocation}</p>
                )}
              </div>
            </div>
          </div>

          {/* سعر البيع */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              سعر البيع (ريال عماني)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  سعر البيع
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.sellingPrice}
                  onChange={(e) => handleInputChange('sellingPrice', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent"
                  placeholder="2500.00"
                />
              </div>
            </div>
          </div>

          {/* التواريخ */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              التواريخ
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاريخ الإدخال للمخزون *
                </label>
                <input
                  type="date"
                  value={formData.entryDate}
                  onChange={(e) => handleInputChange('entryDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  آخر صيانة
                </label>
                <input
                  type="date"
                  value={formData.lastMaintenanceDate}
                  onChange={(e) => handleInputChange('lastMaintenanceDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  صيانة قادمة
                </label>
                <input
                  type="date"
                  value={formData.nextMaintenanceDate}
                  onChange={(e) => handleInputChange('nextMaintenanceDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* المرفقات */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              المرفقات
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* الصور */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الصور
                </label>
                <div className="space-y-3">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent"
                  />
                  {formData.images.length > 0 && (
                    <div className="space-y-2">
                      {formData.images.map((image, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm text-gray-700">{image}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeImage(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* المرفقات */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المرفقات (PDF, DOC, etc.)
                </label>
                <div className="space-y-3">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleAttachmentUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent"
                  />
                  {formData.attachments.length > 0 && (
                    <div className="space-y-2">
                      {formData.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm text-gray-700">{attachment}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttachment(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* قائمة المهام TODO */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              قائمة المهام (TODO)
            </h3>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <h4 className="font-medium text-yellow-800">مهام مطلوبة</h4>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="todo-1" className="rounded" />
                  <label htmlFor="todo-1" className="text-sm text-yellow-700">
                    فحص المعدة قبل الاستخدام
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="todo-2" className="rounded" />
                  <label htmlFor="todo-2" className="text-sm text-yellow-700">
                    التأكد من سلامة جميع الأجزاء
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="todo-3" className="rounded" />
                  <label htmlFor="todo-3" className="text-sm text-yellow-700">
                    تسجيل المعدة في النظام
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="todo-4" className="rounded" />
                  <label htmlFor="todo-4" className="text-sm text-yellow-700">
                    إعداد شهادة السلامة
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="todo-5" className="rounded" />
                  <label htmlFor="todo-5" className="text-sm text-yellow-700">
                    تحديد موقع التخزين
                  </label>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-yellow-200">
                <button
                  type="button"
                  className="text-sm text-yellow-600 hover:text-yellow-800 font-medium"
                  onClick={() => {
                    const newTask = prompt('أضف مهمة جديدة:');
                    if (newTask) {
                      // هنا يمكن إضافة المهمة الجديدة
                      console.log('مهمة جديدة:', newTask);
                    }
                  }}
                >
                  + إضافة مهمة جديدة
                </button>
              </div>
            </div>
          </div>

          {/* الملاحظات */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              ملاحظات إضافية
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الملاحظات
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent"
                placeholder="أي ملاحظات إضافية حول المعدة..."
              />
            </div>
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#913D95] hover:bg-[#7A2F7D] text-white"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  جاري الحفظ...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {scaffold ? 'تحديث المعدة' : 'إضافة المعدة'}
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
