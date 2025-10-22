/**
 * نموذج إضافة/تعديل شراء المعدات
 */

'use client';

import React, { useState, useEffect } from 'react';
import { EquipmentPurchase } from '@/lib/types/inventory';
import { Button } from '@/components/ui/button';
import { 
  Save, 
  X, 
  Plus, 
  Trash2,
  ShoppingCart,
} from 'lucide-react';

interface EquipmentPurchaseFormProps {
  purchase?: EquipmentPurchase;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

interface PurchaseItem {
  scaffoldId: string;
  scaffoldNumber: string;
  type: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export default function EquipmentPurchaseForm({ 
  purchase, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: EquipmentPurchaseFormProps) {
  const [formData, setFormData] = useState({
    purchaseNumber: '',
    supplier: {
      id: '',
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
    },
    items: [] as PurchaseItem[],
    totalAmount: 0,
    purchaseDate: new Date().toISOString().split('T')[0],
    deliveryDate: '',
    status: 'PENDING' as 'PENDING' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED',
    paymentStatus: 'PENDING' as 'PENDING' | 'PARTIAL' | 'PAID',
    paidAmount: 0,
    remainingAmount: 0,
    invoiceNumber: '',
    notes: '',
    attachments: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // تحميل بيانات الشراء عند التعديل
  useEffect(() => {
    if (purchase) {
      setFormData({
        purchaseNumber: purchase.purchaseNumber,
        supplier: purchase.supplier,
        items: purchase.items,
        totalAmount: purchase.totalAmount,
        purchaseDate: purchase.purchaseDate.toISOString().split('T')[0],
        deliveryDate: purchase.deliveryDate ? purchase.deliveryDate.toISOString().split('T')[0] : '',
        status: purchase.status,
        paymentStatus: purchase.paymentStatus,
        paidAmount: purchase.paidAmount,
        remainingAmount: purchase.remainingAmount,
        invoiceNumber: purchase.invoiceNumber || '',
        notes: purchase.notes || '',
        attachments: purchase.attachments || [],
      });
    }
  }, [purchase]);

  // تحديث المبلغ الإجمالي عند تغيير الأصناف
  useEffect(() => {
    const total = formData.items.reduce((sum, item) => sum + item.totalPrice, 0);
    setFormData(prev => ({
      ...prev,
      totalAmount: total,
      remainingAmount: total - prev.paidAmount,
    }));
  }, [formData.items, formData.paidAmount]);

  // التحقق من صحة البيانات
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.purchaseNumber.trim()) {
      newErrors.purchaseNumber = 'رقم الشراء مطلوب';
    }

    if (!formData.supplier.name.trim()) {
      newErrors.supplierName = 'اسم المورد مطلوب';
    }

    if (!formData.supplier.contactPerson.trim()) {
      newErrors.contactPerson = 'اسم الشخص المسؤول مطلوب';
    }

    if (!formData.supplier.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    }

    if (!formData.supplier.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    }

    if (formData.items.length === 0) {
      newErrors.items = 'يجب إضافة صنف واحد على الأقل';
    }

    if (formData.paidAmount < 0) {
      newErrors.paidAmount = 'المبلغ المدفوع لا يمكن أن يكون سالباً';
    }

    if (formData.paidAmount > formData.totalAmount) {
      newErrors.paidAmount = 'المبلغ المدفوع لا يمكن أن يكون أكبر من المبلغ الإجمالي';
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
      purchaseDate: new Date(formData.purchaseDate),
      deliveryDate: formData.deliveryDate ? new Date(formData.deliveryDate) : undefined,
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

  // معالجة تغيير بيانات المورد
  const handleSupplierChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      supplier: {
        ...prev.supplier,
        [field]: value,
      },
    }));

    // إزالة خطأ المورد
    if (errors[`supplier${field.charAt(0).toUpperCase() + field.slice(1)}`]) {
      setErrors(prev => ({
        ...prev,
        [`supplier${field.charAt(0).toUpperCase() + field.slice(1)}`]: '',
      }));
    }
  };

  // إضافة صنف جديد
  const addItem = () => {
    const newItem: PurchaseItem = {
      scaffoldId: '',
      scaffoldNumber: '',
      type: 'FIXED',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    };

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  // تحديث صنف
  const updateItem = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.totalPrice = updatedItem.quantity * updatedItem.unitPrice;
          }
          return updatedItem;
        }
        return item;
      }),
    }));
  };

  // حذف صنف
  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* رأس النموذج */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-6 w-6 text-[#913D95]" />
            <h2 className="text-xl font-semibold text-gray-900">
              {purchase ? 'تعديل عملية الشراء' : 'إضافة عملية شراء جديدة'}
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
          {/* معلومات الشراء الأساسية */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              معلومات الشراء الأساسية
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الشراء *
                </label>
                <input
                  type="text"
                  value={formData.purchaseNumber}
                  onChange={(e) => handleInputChange('purchaseNumber', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent ${
                    errors.purchaseNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="مثال: PUR-001"
                />
                {errors.purchaseNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.purchaseNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاريخ الشراء *
                </label>
                <input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاريخ التسليم المتوقع
                </label>
                <input
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الفاتورة
                </label>
                <input
                  type="text"
                  value={formData.invoiceNumber}
                  onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent"
                  placeholder="مثال: INV-2023-001"
                />
              </div>
            </div>
          </div>

          {/* معلومات المورد */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              معلومات المورد
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم المورد *
                </label>
                <input
                  type="text"
                  value={formData.supplier.name}
                  onChange={(e) => handleSupplierChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent ${
                    errors.supplierName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="اسم المورد"
                />
                {errors.supplierName && (
                  <p className="text-red-500 text-xs mt-1">{errors.supplierName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الشخص المسؤول *
                </label>
                <input
                  type="text"
                  value={formData.supplier.contactPerson}
                  onChange={(e) => handleSupplierChange('contactPerson', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent ${
                    errors.contactPerson ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="اسم الشخص المسؤول"
                />
                {errors.contactPerson && (
                  <p className="text-red-500 text-xs mt-1">{errors.contactPerson}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف *
                </label>
                <input
                  type="tel"
                  value={formData.supplier.phone}
                  onChange={(e) => handleSupplierChange('phone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+96891234567"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني *
                </label>
                <input
                  type="email"
                  value={formData.supplier.email}
                  onChange={(e) => handleSupplierChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="email@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* الأصناف */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                الأصناف المشتراة
              </h3>
              <Button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 bg-[#913D95] hover:bg-[#7A2F7D]"
              >
                <Plus className="h-4 w-4" />
                إضافة صنف
              </Button>
            </div>

            {errors.items && (
              <p className="text-red-500 text-sm">{errors.items}</p>
            )}

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-gray-700">
                      صنف #{index + 1}
                    </h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        رقم السقالة
                      </label>
                      <input
                        type="text"
                        value={item.scaffoldNumber}
                        onChange={(e) => updateItem(index, 'scaffoldNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent"
                        placeholder="SCF-001"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        النوع
                      </label>
                      <select
                        value={item.type}
                        onChange={(e) => updateItem(index, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent"
                      >
                        <option value="FIXED">مثبتة</option>
                        <option value="MOBILE">متحركة</option>
                        <option value="TOWER">برجية</option>
                        <option value="CANTILEVER">كابولية</option>
                        <option value="SUSPENDED">معلقة</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الكمية
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        سعر الوحدة (ريال)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        المبلغ الإجمالي (ريال)
                      </label>
                      <input
                        type="number"
                        value={item.totalPrice}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* المبلغ والدفع */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              المبلغ والدفع
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المبلغ الإجمالي (ريال)
                </label>
                <input
                  type="number"
                  value={formData.totalAmount}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المبلغ المدفوع (ريال)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.paidAmount}
                  onChange={(e) => handleInputChange('paidAmount', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent ${
                    errors.paidAmount ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.paidAmount && (
                  <p className="text-red-500 text-xs mt-1">{errors.paidAmount}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المبلغ المتبقي (ريال)
                </label>
                <input
                  type="number"
                  value={formData.remainingAmount}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  حالة الشراء
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent"
                >
                  <option value="PENDING">في الانتظار</option>
                  <option value="CONFIRMED">مؤكدة</option>
                  <option value="DELIVERED">مسلمة</option>
                  <option value="CANCELLED">ملغاة</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  حالة الدفع
                </label>
                <select
                  value={formData.paymentStatus}
                  onChange={(e) => handleInputChange('paymentStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#913D95] focus:border-transparent"
                >
                  <option value="PENDING">في الانتظار</option>
                  <option value="PARTIAL">جزئية</option>
                  <option value="PAID">مدفوعة</option>
                </select>
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
                placeholder="أي ملاحظات إضافية حول عملية الشراء..."
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
                  {purchase ? 'تحديث عملية الشراء' : 'إضافة عملية الشراء'}
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
