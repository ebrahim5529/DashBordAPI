/**
 * نموذج إضافة/تعديل طلب الشراء
 */

'use client';

import React, { useState } from 'react';
import { PurchaseRequestTableData } from '@/lib/types/financial';
import { Button } from '@/components/ui/button';
import { 
  Save, 
  X, 
  Calendar,
  Upload,
  AlertCircle,
  Plus,
  Trash2
} from 'lucide-react';

interface PurchaseRequestFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: PurchaseRequestTableData | null;
  isLoading?: boolean;
}

interface PurchaseItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export function PurchaseRequestForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}: PurchaseRequestFormProps) {
  const [formData, setFormData] = useState({
    date: initialData?.date ? initialData.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    supplier: '',
    department: initialData?.department || 'الصيانة',
    type: initialData?.type || 'MATERIALS',
    notes: '',
  });

  const [items, setItems] = useState<PurchaseItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0, total: 0 }
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleItemChange = (id: string, field: keyof PurchaseItem, value: any) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const addItem = () => {
    const newItem: PurchaseItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    setItems(prev => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.supplier.trim()) {
      newErrors.supplier = 'المورد مطلوب';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'القسم مطلوب';
    }

    // التحقق من العناصر
    const validItems = items.filter(item => 
      item.description.trim() && item.quantity > 0 && item.unitPrice > 0
    );

    if (validItems.length === 0) {
      newErrors.items = 'يجب إضافة عنصر واحد على الأقل';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const validItems = items.filter(item => 
        item.description.trim() && item.quantity > 0 && item.unitPrice > 0
      );
      
      const totalAmount = validItems.reduce((sum, item) => sum + item.total, 0);
      
      const submitData = {
        ...formData,
        date: new Date(formData.date),
        items: validItems,
        totalAmount,
      };
      onSubmit(submitData);
    }
  };

  const departments = [
    'الصيانة',
    'المشاريع',
    'التقنية',
    'المحاسبة',
    'الموارد البشرية',
  ];

  const purchaseTypes = [
    { value: 'MATERIALS', label: 'مواد' },
    { value: 'EQUIPMENT', label: 'معدات' },
    { value: 'SERVICES', label: 'خدمات' },
  ];

  const suppliers = [
    'شركة الرواد للتوريد',
    'شركة البناء الحديث',
    'شركة الخدمات التقنية',
    'شركة المعدات الصناعية',
    'شركة المواد المكتبية',
  ];

  const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {initialData ? 'تعديل طلب الشراء' : 'طلب شراء جديد'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {initialData ? 'تعديل بيانات طلب الشراء' : 'إنشاء طلب شراء جديد'}
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                التاريخ *
              </label>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
                />
              </div>
            </div>

            {/* Supplier */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                المورد *
              </label>
              <select
                value={formData.supplier}
                onChange={(e) => handleInputChange('supplier', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
              >
                <option value="">اختر المورد</option>
                {suppliers.map(supplier => (
                  <option key={supplier} value={supplier}>
                    {supplier}
                  </option>
                ))}
              </select>
              {errors.supplier && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.supplier}
                </p>
              )}
            </div>

            {/* Department */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                القسم *
              </label>
              <select
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.department}
                </p>
              )}
            </div>
          </div>

          {/* Purchase Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              نوع الشراء
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
            >
              {purchaseTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">العناصر المطلوبة</h3>
              <Button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 bg-[#58d2c8] hover:bg-[#4bb8ad]"
              >
                <Plus className="h-4 w-4" />
                إضافة عنصر
              </Button>
            </div>

            {errors.items && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.items}
              </p>
            )}

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">عنصر #{index + 1}</h4>
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الوصف
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                        placeholder="وصف العنصر..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        الكمية
                      </label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        السعر الوحدة
                      </label>
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="mt-3 text-right">
                    <span className="text-lg font-semibold text-[#58d2c8]">
                      المجموع: {item.total.toLocaleString()} ريال
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-end">
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    الإجمالي: {totalAmount.toLocaleString()} ريال
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              ملاحظات إضافية
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="أي ملاحظات إضافية حول طلب الشراء..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent resize-none"
            />
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              المرفقات
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#58d2c8] transition-colors">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                اسحب الملفات هنا أو انقر للاختيار
              </p>
              <p className="text-xs text-gray-500 mt-1">
                عرض أسعار، كتالوج، عقد خدمة (PDF, JPG, PNG)
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
              />
            </div>
          </div>

          {/* Actions */}
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
              className="bg-[#58d2c8] hover:bg-[#4bb8ad]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  جاري الحفظ...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {initialData ? 'تحديث الطلب' : 'إرسال الطلب'}
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
