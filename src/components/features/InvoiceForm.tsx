/**
 * نموذج إنشاء/تعديل الفاتورة
 */

'use client';

import React, { useState } from 'react';
import { InvoiceTableData } from '@/lib/types/financial';
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

interface InvoiceFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: InvoiceTableData | null;
  isLoading?: boolean;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export function InvoiceForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}: InvoiceFormProps) {
  const [formData, setFormData] = useState({
    type: initialData?.type || 'OUTGOING',
    date: initialData?.date ? initialData.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    party: '',
    partyType: 'CUSTOMER',
    paymentMethod: 'BANK_TRANSFER',
    notes: '',
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0, total: 0 }
  ]);

  const [taxRate] = useState(15); // ضريبة القيمة المضافة 15%

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: any) => {
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
    const newItem: InvoiceItem = {
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

    if (!formData.party.trim()) {
      newErrors.party = 'الطرف (العميل/المورد) مطلوب';
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
      
      const subtotal = validItems.reduce((sum, item) => sum + item.total, 0);
      const tax = subtotal * (taxRate / 100);
      const total = subtotal + tax;
      
      const submitData = {
        ...formData,
        date: new Date(formData.date),
        items: validItems,
        subtotal,
        tax,
        total,
        taxRate,
      };
      onSubmit(submitData);
    }
  };

  const invoiceTypes = [
    { value: 'OUTGOING', label: 'فاتورة صادرة' },
    { value: 'INCOMING', label: 'فاتورة واردة' },
  ];

  const partyTypes = [
    { value: 'CUSTOMER', label: 'عميل' },
    { value: 'SUPPLIER', label: 'مورد' },
  ];

  const paymentMethods = [
    { value: 'CASH', label: 'نقدي' },
    { value: 'BANK_TRANSFER', label: 'تحويل بنكي' },
    { value: 'CHECK', label: 'شيك' },
    { value: 'CARD', label: 'بطاقة' },
  ];

  const customers = [
    'شركة النخيل للتجارة',
    'بلدية مسقط',
    'وزارة النقل والاتصالات',
    'شركة عمان للإسكان',
    'شركة عمان للطيران',
  ];

  const suppliers = [
    'شركة المعدات الصناعية',
    'شركة المواد المكتبية',
    'شركة الخدمات التقنية',
    'شركة البناء الحديث',
    'شركة الرواد للتوريد',
  ];

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {initialData ? 'تعديل الفاتورة' : 'إنشاء فاتورة جديدة'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {initialData ? 'تعديل بيانات الفاتورة' : 'إنشاء فاتورة جديدة (صادرة أو واردة)'}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                نوع الفاتورة *
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
              >
                {invoiceTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                تاريخ الفاتورة *
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
          </div>

          {/* Party Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Party Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                نوع الطرف *
              </label>
              <select
                value={formData.partyType}
                onChange={(e) => {
                  handleInputChange('partyType', e.target.value);
                  handleInputChange('party', ''); // إعادة تعيين الطرف
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
              >
                {partyTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Party */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {formData.partyType === 'CUSTOMER' ? 'العميل' : 'المورد'} *
              </label>
              <select
                value={formData.party}
                onChange={(e) => handleInputChange('party', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
              >
                <option value="">اختر {formData.partyType === 'CUSTOMER' ? 'العميل' : 'المورد'}</option>
                {(formData.partyType === 'CUSTOMER' ? customers : suppliers).map(party => (
                  <option key={party} value={party}>
                    {party}
                  </option>
                ))}
              </select>
              {errors.party && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.party}
                </p>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              طريقة الدفع
            </label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
            >
              {paymentMethods.map(method => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>

          {/* Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">عناصر الفاتورة</h3>
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
                        placeholder="وصف السلعة أو الخدمة..."
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
          </div>

          {/* Totals */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">المجموع الفرعي:</span>
                <span className="font-medium">{subtotal.toLocaleString()} ريال</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">
                  ضريبة القيمة المضافة ({taxRate}%):
                </span>
                <span className="font-medium">{tax.toLocaleString()} ريال</span>
              </div>
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">الإجمالي:</span>
                  <span className="text-xl font-bold text-[#58d2c8]">
                    {total.toLocaleString()} ريال
                  </span>
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
              placeholder="أي ملاحظات إضافية حول الفاتورة..."
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
                نسخة الفاتورة الأصلية (PDF, JPG, PNG)
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
                  {initialData ? 'تحديث الفاتورة' : 'إنشاء الفاتورة'}
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}