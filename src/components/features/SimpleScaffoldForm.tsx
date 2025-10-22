/**
 * نموذج إضافة معدة مبسط
 */

'use client';

import React, { useState } from 'react';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { ArrowRight, Save, X } from 'lucide-react';

interface SimpleScaffoldFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

interface FormData {
  itemCode: string;
  arabicDescription: string;
  englishDescription: string;
  dailyRentalPrice: number;
  monthlyRentalPrice: number;
  quantity: number;
}

interface FormErrors {
  itemCode?: string;
  arabicDescription?: string;
  englishDescription?: string;
  dailyRentalPrice?: string;
  monthlyRentalPrice?: string;
  quantity?: string;
}

export default function SimpleScaffoldForm({
  onSubmit,
  onCancel,
  isLoading = false,
}: SimpleScaffoldFormProps) {
  const [formData, setFormData] = useState<FormData>({
    itemCode: '',
    arabicDescription: '',
    englishDescription: '',
    dailyRentalPrice: 0,
    monthlyRentalPrice: 0,
    quantity: 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // معالجة تغيير القيم
  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // إزالة الخطأ عند التعديل
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // التحقق من صحة البيانات
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.itemCode.trim()) {
      newErrors.itemCode = 'كود الصنف مطلوب';
    }

    if (!formData.arabicDescription.trim()) {
      newErrors.arabicDescription = 'الوصف العربي مطلوب';
    }

    if (!formData.englishDescription.trim()) {
      newErrors.englishDescription = 'الوصف الإنجليزي مطلوب';
    }

    if (formData.dailyRentalPrice <= 0) {
      newErrors.dailyRentalPrice = 'قيمة الإيجار اليومي يجب أن تكون أكبر من صفر';
    }

    if (formData.monthlyRentalPrice <= 0) {
      newErrors.monthlyRentalPrice = 'قيمة الإيجار الشهري يجب أن تكون أكبر من صفر';
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = 'الكمية يجب أن تكون أكبر من صفر';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // معالجة إرسال النموذج
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="space-y-6">
      {/* شريط العنوان */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            onClick={onCancel}
            variant="outline"
            className="p-2"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              إضافة معدة جديد
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              إدخال بيانات المعدة الجديدة
            </p>
          </div>
        </div>
      </div>

      {/* النموذج */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* المعلومات الأساسية */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              المعلومات الأساسية
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.itemCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="مثال: SCAF-001"
                />
                {errors.itemCode && (
                  <p className="text-red-500 text-xs mt-1">{errors.itemCode}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الكمية *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.quantity ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="1"
                />
                {errors.quantity && (
                  <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
                )}
              </div>
            </div>
          </div>

          {/* الأوصاف */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              أوصاف الصنف
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوصف العربي للصنف *
                </label>
                <input
                  type="text"
                  value={formData.arabicDescription}
                  onChange={(e) => handleInputChange('arabicDescription', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.arabicDescription ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="مثال: معدة حديدية متعددة الطوابق"
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.englishDescription ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Example: Multi-level Steel Scaffolding"
                />
                {errors.englishDescription && (
                  <p className="text-red-500 text-xs mt-1">{errors.englishDescription}</p>
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
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

          {/* أزرار الإجراءات */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  حفظ المعدة
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
