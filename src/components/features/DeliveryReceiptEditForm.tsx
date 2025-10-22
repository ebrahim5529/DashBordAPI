/**
 * مكون تعديل سند الاستلام
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { DeliveryReceiptData } from './DeliveryReceiptDocument';
import { 
  Save, 
  X, 
  Plus, 
  Trash2, 
  PackageCheck,
  User,
  FileText,
  PenTool
} from 'lucide-react';

interface DeliveryReceiptEditFormProps {
  data: DeliveryReceiptData;
  onSave: (updatedData: DeliveryReceiptData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function DeliveryReceiptEditForm({ 
  data, 
  onSave, 
  onCancel, 
  isLoading = false 
}: DeliveryReceiptEditFormProps) {
  const [formData, setFormData] = useState<DeliveryReceiptData>(data);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(data);
  }, [data]);

  // معالجة تغيير البيانات الأساسية
  const handleBasicInfoChange = (field: keyof DeliveryReceiptData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // مسح الخطأ عند التعديل
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // معالجة تغيير بيانات الصنف
  const handleItemChange = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items?.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // إضافة صنف جديد
  const addNewItem = () => {
    const newItem = {
      id: `item-${Date.now()}`,
      name: '',
      quantity: 1,
      condition: 'good' as const,
      notes: ''
    };
    
    setFormData(prev => ({
      ...prev,
      items: [...(prev.items || []), newItem],
      totalItems: (prev.totalItems || 0) + 1
    }));
  };

  // حذف صنف
  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items?.filter((_, i) => i !== index),
      totalItems: Math.max(0, (prev.totalItems || 0) - 1)
    }));
  };

  // التحقق من صحة البيانات
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'اسم العميل مطلوب';
    }
    
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'رقم هاتف العميل مطلوب';
    }
    
    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'عنوان التسليم مطلوب';
    }
    
    if (!formData.driverName.trim()) {
      newErrors.driverName = 'اسم السائق مطلوب';
    }
    
    if (!formData.driverPhone.trim()) {
      newErrors.driverPhone = 'رقم هاتف السائق مطلوب';
    }

    if (!formData.items || formData.items.length === 0) {
      newErrors.items = 'يجب إضافة صنف واحد على الأقل';
    } else {
      formData.items.forEach((item, index) => {
        if (!item.name.trim()) {
          newErrors[`item_${index}_name`] = 'اسم الصنف مطلوب';
        }
        if (item.quantity <= 0) {
          newErrors[`item_${index}_quantity`] = 'الكمية يجب أن تكون أكبر من صفر';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // معالجة الحفظ
  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="space-y-6">
      {/* عنوان النموذج */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PenTool className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">تعديل سند الاستلام</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            <X className="h-4 w-4 ml-2" />
            إلغاء
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="h-4 w-4 ml-2" />
            {isLoading ? 'جاري الحفظ...' : 'حفظ'}
          </Button>
        </div>
      </div>

      {/* معلومات أساسية */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PackageCheck className="h-5 w-5" />
            المعلومات الأساسية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم السند
                </label>
                <input
                  type="text"
                  value={formData.receiptNumber}
                  onChange={(e) => handleBasicInfoChange('receiptNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم العميل *
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => handleBasicInfoChange('customerName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.customerName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="اسم العميل"
                />
                {errors.customerName && (
                  <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم هاتف العميل *
                </label>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => handleBasicInfoChange('customerPhone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.customerPhone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+966501234567"
                />
                {errors.customerPhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاريخ التسليم
                </label>
                <input
                  type="datetime-local"
                  value={formData.deliveryDate}
                  onChange={(e) => handleBasicInfoChange('deliveryDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم السائق *
                </label>
                <input
                  type="text"
                  value={formData.driverName}
                  onChange={(e) => handleBasicInfoChange('driverName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.driverName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="اسم السائق"
                />
                {errors.driverName && (
                  <p className="text-red-500 text-sm mt-1">{errors.driverName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم هاتف السائق *
                </label>
                <input
                  type="tel"
                  value={formData.driverPhone}
                  onChange={(e) => handleBasicInfoChange('driverPhone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.driverPhone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+966501234568"
                />
                {errors.driverPhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.driverPhone}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عنوان التسليم *
            </label>
            <textarea
              value={formData.deliveryAddress}
              onChange={(e) => handleBasicInfoChange('deliveryAddress', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.deliveryAddress ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={3}
              placeholder="عنوان التسليم الكامل"
            />
            {errors.deliveryAddress && (
              <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* قائمة الأصناف */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PackageCheck className="h-5 w-5" />
              قائمة الأصناف
            </div>
            <Button
              onClick={addNewItem}
              variant="outline"
              size="sm"
            >
              <Plus className="h-4 w-4 ml-2" />
              إضافة صنف
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {errors.items && (
            <p className="text-red-500 text-sm mb-4">{errors.items}</p>
          )}
          
          <div className="space-y-4">
            {formData.items?.map((item, index) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">صنف #{index + 1}</h4>
                  {formData.items && formData.items.length > 1 && (
                    <Button
                      onClick={() => removeItem(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اسم الصنف *
                    </label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors[`item_${index}_name`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="اسم الصنف"
                    />
                    {errors[`item_${index}_name`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`item_${index}_name`]}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الكمية *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors[`item_${index}_quantity`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors[`item_${index}_quantity`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`item_${index}_quantity`]}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الحالة
                    </label>
                    <select
                      value={item.condition}
                      onChange={(e) => handleItemChange(index, 'condition', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="good">جيد</option>
                      <option value="damaged">تالف</option>
                      <option value="missing">مفقود</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ملاحظات
                  </label>
                  <textarea
                    value={item.notes || ''}
                    onChange={(e) => handleItemChange(index, 'notes', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    placeholder="ملاحظات إضافية..."
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* معلومات المستلم */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            معلومات المستلم
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم المستلم
              </label>
              <input
                type="text"
                value={formData.receiverName || ''}
                onChange={(e) => handleBasicInfoChange('receiverName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="اسم المستلم"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم هاتف المستلم
              </label>
              <input
                type="tel"
                value={formData.receiverPhone || ''}
                onChange={(e) => handleBasicInfoChange('receiverPhone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+966501234569"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ملاحظات إضافية */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            ملاحظات إضافية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={formData.notes || ''}
            onChange={(e) => handleBasicInfoChange('notes', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="ملاحظات إضافية حول التسليم..."
          />
        </CardContent>
      </Card>

      {/* أزرار الإجراءات */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          <X className="h-4 w-4 ml-2" />
          إلغاء
        </Button>
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Save className="h-4 w-4 ml-2" />
          {isLoading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
        </Button>
      </div>
    </div>
  );
}
