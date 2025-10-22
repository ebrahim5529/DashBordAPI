/**
 * نموذج إضافة/تعديل المعاملة المالية
 */

'use client';

import React, { useState } from 'react';
import { TransactionTableData } from '@/lib/types/financial';
import { Button } from '@/components/ui/button';
import { 
  Save, 
  X, 
  Calendar,
  Upload,
  AlertCircle
} from 'lucide-react';

interface TransactionFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: TransactionTableData | null;
  isLoading?: boolean;
}

export function TransactionForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}: TransactionFormProps) {
  const [formData, setFormData] = useState({
    type: initialData?.type || 'INCOME',
    date: initialData?.date ? initialData.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    description: initialData?.description || '',
    amount: initialData?.amount || '',
    paymentMethod: initialData?.paymentMethod || 'CASH',
    account: initialData?.account || '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // إزالة الخطأ عند التعديل
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = 'الوصف مطلوب';
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = 'المبلغ يجب أن يكون أكبر من صفر';
    }

    if (!formData.account.trim()) {
      newErrors.account = 'الحساب مطلوب';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const submitData = {
        ...formData,
        amount: parseFloat(formData.amount.toString()),
        date: new Date(formData.date),
      };
      onSubmit(submitData);
    }
  };

  const transactionTypes = [
    { value: 'INCOME', label: 'إيراد' },
    { value: 'EXPENSE', label: 'مصروف' },
    { value: 'TRANSFER', label: 'تحويل' },
  ];

  const paymentMethods = [
    { value: 'CASH', label: 'نقدي' },
    { value: 'BANK_TRANSFER', label: 'تحويل بنكي' },
    { value: 'CHECK', label: 'شيك' },
    { value: 'CARD', label: 'بطاقة' },
  ];

  const accounts = [
    'حساب الشركة - البنك الأهلي',
    'حساب الشركة - البنك الوطني',
    'الصندوق النقدي',
    'حساب التوفير',
    'حساب الاستثمار',
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {initialData ? 'تعديل المعاملة المالية' : 'إضافة معاملة مالية جديدة'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {initialData ? 'تعديل بيانات المعاملة المالية' : 'تسجيل معاملة مالية جديدة في النظام'}
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
                نوع المعاملة *
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
              >
                {transactionTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.type}
                </p>
              )}
            </div>

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
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              الوصف *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="وصف المعاملة المالية..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent resize-none"
            />
            {errors.description && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Amount and Payment Method */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Amount */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                المبلغ *
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  ريال
                </span>
              </div>
              {errors.amount && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.amount}
                </p>
              )}
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                طريقة الدفع *
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
          </div>

          {/* Account */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              الحساب المالي *
            </label>
            <select
              value={formData.account}
              onChange={(e) => handleInputChange('account', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
            >
              <option value="">اختر الحساب</option>
              {accounts.map(account => (
                <option key={account} value={account}>
                  {account}
                </option>
              ))}
            </select>
            {errors.account && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.account}
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              ملاحظات إضافية
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="أي ملاحظات إضافية..."
              rows={2}
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
                PDF, JPG, PNG حتى 10MB
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
                  {initialData ? 'تحديث المعاملة' : 'حفظ المعاملة'}
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
