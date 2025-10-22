/**
 * نموذج إنشاء/تعديل فاتورة المورد
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { useToast } from '@/components/shared/Toast';
import { getSuppliers } from '@/lib/services';
import { SupplierInvoice } from '@/lib/types/supplier';
import { Save, X, Calendar, DollarSign, FileText, AlertCircle } from 'lucide-react';

interface SupplierInvoiceFormProps {
  invoice?: SupplierInvoice | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function SupplierInvoiceForm({
  invoice,
  onSubmit,
  onCancel,
  isLoading = false
}: SupplierInvoiceFormProps) {
  const toast = useToast();
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  
  const [formData, setFormData] = useState({
    supplier_id: invoice?.supplierId || '',
    invoice_number: invoice?.invoiceNumber || '',
    amount: invoice?.amount?.toString() || '',
    due_date: invoice?.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : '',
    payment_date: invoice?.paymentDate ? new Date(invoice.paymentDate).toISOString().split('T')[0] : '',
    payment_method: invoice?.paymentMethod || '',
    description: invoice?.description || '',
    status: invoice?.status || 'PENDING',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load suppliers on mount
  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    setLoadingSuppliers(true);
    try {
      const response = await getSuppliers({ per_page: 100, status: 'ACTIVE' });
      if (response.success && response.data) {
        setSuppliers(response.data.data);
      }
    } catch (err) {
      console.error('Error loading suppliers:', err);
      toast.error('فشل تحميل قائمة الموردين');
    } finally {
      setLoadingSuppliers(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.supplier_id) {
      newErrors.supplier_id = 'المورد مطلوب';
    }

    if (!formData.invoice_number.trim()) {
      newErrors.invoice_number = 'رقم الفاتورة مطلوب';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'المبلغ يجب أن يكون أكبر من صفر';
    }

    if (!formData.due_date) {
      newErrors.due_date = 'تاريخ الاستحقاق مطلوب';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const submitData = {
        ...formData,
        amount: parseFloat(formData.amount),
      };
      onSubmit(submitData);
    }
  };

  const paymentMethods = [
    { value: 'CASH', label: 'نقدي' },
    { value: 'BANK_TRANSFER', label: 'تحويل بنكي' },
    { value: 'CHECK', label: 'شيك' },
    { value: 'CREDIT_CARD', label: 'بطاقة ائتمان' },
  ];

  const statuses = [
    { value: 'PENDING', label: 'معلقة' },
    { value: 'PAID', label: 'مدفوعة' },
    { value: 'PARTIAL', label: 'جزئية' },
    { value: 'OVERDUE', label: 'متأخرة' },
    { value: 'CANCELLED', label: 'ملغاة' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {invoice ? 'تعديل فاتورة المورد' : 'إضافة فاتورة مورد جديدة'}
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {invoice ? 'تعديل معلومات الفاتورة' : 'إنشاء فاتورة جديدة للمورد'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* المورد */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">المورد *</label>
                <select
                  value={formData.supplier_id}
                  onChange={(e) => handleInputChange('supplier_id', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${errors.supplier_id ? 'border-red-500' : 'border-gray-300'}`}
                  disabled={loadingSuppliers}
                >
                  <option value="">اختر المورد</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name} - {supplier.supplier_number}
                    </option>
                  ))}
                </select>
                {errors.supplier_id && (
                  <p className="text-sm text-red-500">{errors.supplier_id}</p>
                )}
                {loadingSuppliers && (
                  <p className="text-sm text-gray-500">جاري تحميل الموردين...</p>
                )}
              </div>

              {/* رقم الفاتورة */}
              <div className="space-y-2">
                <label className="text-sm font-medium">رقم الفاتورة *</label>
                <input
                  type="text"
                  value={formData.invoice_number}
                  onChange={(e) => handleInputChange('invoice_number', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${errors.invoice_number ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="INV-2024-0001"
                />
                {errors.invoice_number && (
                  <p className="text-sm text-red-500">{errors.invoice_number}</p>
                )}
              </div>
            </div>

            {/* المبلغ وتاريخ الاستحقاق */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  المبلغ *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${errors.amount ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="0.00"
                />
                {errors.amount && (
                  <p className="text-sm text-red-500">{errors.amount}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  تاريخ الاستحقاق *
                </label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => handleInputChange('due_date', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md ${errors.due_date ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.due_date && (
                  <p className="text-sm text-red-500">{errors.due_date}</p>
                )}
              </div>
            </div>

            {/* تاريخ الدفع وطريقة الدفع */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">تاريخ الدفع (اختياري)</label>
                <input
                  type="date"
                  value={formData.payment_date}
                  onChange={(e) => handleInputChange('payment_date', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">طريقة الدفع</label>
                <select
                  value={formData.payment_method}
                  onChange={(e) => handleInputChange('payment_method', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md border-gray-300"
                >
                  <option value="">اختر طريقة الدفع</option>
                  {paymentMethods.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* الحالة */}
            <div className="space-y-2">
              <label className="text-sm font-medium">حالة الفاتورة</label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border rounded-md border-gray-300"
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* الوصف */}
            <div className="space-y-2">
              <label className="text-sm font-medium">الوصف</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border rounded-md border-gray-300"
                rows={4}
                placeholder="وصف الفاتورة..."
              />
            </div>

            {/* Error Summary */}
            {Object.keys(errors).length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">يرجى تصحيح الأخطاء التالية:</p>
                    <ul className="list-disc list-inside text-sm text-red-700 mt-2 space-y-1">
                      {Object.values(errors).map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isLoading ? 'جاري الحفظ...' : (invoice ? 'تحديث الفاتورة' : 'حفظ الفاتورة')}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                إلغاء
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

