/**
 * نموذج إضافة/تعديل المشتريات
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  Save, 
  X, 
  FileText
} from 'lucide-react';

export interface PurchaseFormData {
  id?: string;
  invoiceNumber: string;
  supplierName: string;
  supplierId: string;
  purchaseDate: string;
  totalAmount: number;
  paidAmount: number;
  status: 'pending' | 'paid' | 'partial' | 'cancelled';
  paymentMethod: 'cash' | 'bank_transfer' | 'check' | 'credit';
  notes?: string;
  items: PurchaseItem[];
}

export interface PurchaseItem {
  id: string;
  itemName: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
  condition: 'new' | 'used' | 'refurbished';
}

interface PurchaseFormProps {
  onSubmit: (data: PurchaseFormData) => void;
  onCancel: () => void;
  initialData?: Partial<PurchaseFormData>;
  isLoading?: boolean;
  title?: string;
  description?: string;
}

const PurchaseForm: React.FC<PurchaseFormProps> = ({
  onSubmit,
  onCancel, 
  initialData,
  isLoading = false,
  title = 'إضافة مشتريات جديدة',
  description = 'املأ البيانات التالية لإضافة مشتريات جديدة',
}) => {
  const [formData, setFormData] = useState<PurchaseFormData>({
    invoiceNumber: initialData?.invoiceNumber || '',
    supplierName: initialData?.supplierName || '',
    supplierId: initialData?.supplierId || '',
    purchaseDate: initialData?.purchaseDate || new Date().toISOString().split('T')[0],
    totalAmount: initialData?.totalAmount || 0,
    paidAmount: initialData?.paidAmount || 0,
    status: initialData?.status || 'pending',
    paymentMethod: initialData?.paymentMethod || 'cash',
    notes: initialData?.notes || '',
    items: initialData?.items || [{
      id: '1',
      itemName: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      category: 'scaffolding',
      condition: 'new'
    }],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // تحديث حقل في النموذج
  const updateField = (field: keyof PurchaseFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // إزالة الخطأ عند التحديث
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // تحديث عنصر في قائمة العناصر
  const updateItem = (itemId: string, field: keyof PurchaseItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId ? { ...item, [field]: value } : item
      )
    }));
  };

  // إضافة عنصر جديد
  const addItem = () => {
    const newItem: PurchaseItem = {
      id: Date.now().toString(),
      itemName: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      category: 'scaffolding',
      condition: 'new'
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  // حذف عنصر
  const removeItem = (itemId: string) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== itemId)
      }));
    }
  };

  // حساب إجمالي السعر للعنصر
  const calculateItemTotal = (item: PurchaseItem) => {
    const total = item.quantity * item.unitPrice;
    updateItem(item.id, 'totalPrice', total);
    return total;
  };

  // حساب الإجمالي العام
  const calculateTotal = () => {
    const total = formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    updateField('totalAmount', total);
    return total;
  };

  // التحقق من صحة البيانات
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.invoiceNumber.trim()) {
      newErrors.invoiceNumber = 'رقم الفاتورة مطلوب';
    }
    if (!formData.supplierName.trim()) {
      newErrors.supplierName = 'اسم المورد مطلوب';
    }
    if (!formData.purchaseDate) {
      newErrors.purchaseDate = 'تاريخ الشراء مطلوب';
    }
    if (formData.totalAmount <= 0) {
      newErrors.totalAmount = 'المبلغ الإجمالي يجب أن يكون أكبر من صفر';
    }

    // التحقق من العناصر
    formData.items.forEach((item, index) => {
      if (!item.itemName.trim()) {
        newErrors[`item_${index}_name`] = 'اسم العنصر مطلوب';
      }
      if (item.quantity <= 0) {
        newErrors[`item_${index}_quantity`] = 'الكمية يجب أن تكون أكبر من صفر';
      }
      if (item.unitPrice <= 0) {
        newErrors[`item_${index}_unitPrice`] = 'سعر الوحدة يجب أن يكون أكبر من صفر';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // إرسال النموذج
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const total = calculateTotal();
      const dataToSubmit = {
      ...formData,
        totalAmount: total,
        id: initialData?.id || Date.now().toString(),
      };
      onSubmit(dataToSubmit);
    }
  };

  const suppliers = [
    { id: '1', name: 'شركة المعدات المتطورة' },
    { id: '2', name: 'مورد السقالات الأول' },
    { id: '3', name: 'شركة البناء والتشييد' },
    { id: '4', name: 'مورد المعدات الصناعية' },
  ];

  const categories = [
    { value: 'scaffolding', label: 'سقالات' },
    { value: 'safety', label: 'أدوات السلامة' },
    { value: 'tools', label: 'أدوات يدوية' },
    { value: 'materials', label: 'مواد خام' },
    { value: 'equipment', label: 'معدات ثقيلة' },
  ];

  const conditions = [
    { value: 'new', label: 'جديد' },
    { value: 'used', label: 'مستعمل' },
    { value: 'refurbished', label: 'مجدول' },
  ];

  const statusOptions = [
    { value: 'pending', label: 'معلق', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'partial', label: 'مدفوع جزئياً', color: 'bg-blue-100 text-blue-800' },
    { value: 'paid', label: 'مدفوع', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'ملغي', color: 'bg-red-100 text-red-800' },
  ];

  const paymentMethods = [
    { value: 'cash', label: 'نقداً' },
    { value: 'bank_transfer', label: 'تحويل بنكي' },
    { value: 'check', label: 'شيك' },
    { value: 'credit', label: 'آجل' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {title}
          </CardTitle>
          <p className="text-gray-600">{description}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* معلومات الفاتورة الأساسية */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">رقم الفاتورة *</Label>
                <Input
                  id="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={(e) => updateField('invoiceNumber', e.target.value)}
                  placeholder="INV-2024-001"
                  className={errors.invoiceNumber ? 'border-red-500' : ''}
                />
                {errors.invoiceNumber && (
                  <p className="text-sm text-red-500">{errors.invoiceNumber}</p>
                )}
            </div>

              <div className="space-y-2">
                <Label htmlFor="supplierId">المورد *</Label>
                <Select value={formData.supplierId} onValueChange={(value) => {
                  const supplier = suppliers.find(s => s.id === value);
                  updateField('supplierId', value);
                  updateField('supplierName', supplier?.name || '');
                }}>
                  <SelectTrigger className={errors.supplierName ? 'border-red-500' : ''}>
                    <SelectValue placeholder="اختر المورد" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map(supplier => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.supplierName && (
                  <p className="text-sm text-red-500">{errors.supplierName}</p>
                )}
            </div>

              <div className="space-y-2">
                <Label htmlFor="purchaseDate">تاريخ الشراء *</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => updateField('purchaseDate', e.target.value)}
                  className={errors.purchaseDate ? 'border-red-500' : ''}
                />
                {errors.purchaseDate && (
                  <p className="text-sm text-red-500">{errors.purchaseDate}</p>
                )}
        </div>

              <div className="space-y-2">
                <Label htmlFor="status">حالة الدفع</Label>
                <Select value={formData.status} onValueChange={(value: any) => updateField('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                          <Badge className={option.color}>
                            {option.label}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">طريقة الدفع</Label>
                <Select value={formData.paymentMethod} onValueChange={(value: any) => updateField('paymentMethod', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map(method => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                </div>
                
              <div className="space-y-2">
                <Label htmlFor="paidAmount">المبلغ المدفوع</Label>
                <Input
                  id="paidAmount"
                  type="number"
                  value={formData.paidAmount}
                  onChange={(e) => updateField('paidAmount', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  />
                </div>
              </div>

            {/* ملاحظات */}
            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="أي ملاحظات إضافية..."
                rows={3}
              />
            </div>

            {/* قائمة العناصر */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">عناصر المشتريات</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  إضافة عنصر
                </Button>
              </div>
              
              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <Card key={item.id} className="border-l-4 border-l-primary">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div className="md:col-span-2 space-y-2">
                          <Label htmlFor={`item_${index}_name`}>اسم العنصر *</Label>
                          <Input
                            id={`item_${index}_name`}
                            value={item.itemName}
                            onChange={(e) => updateItem(item.id, 'itemName', e.target.value)}
                            placeholder="مثال: سقالة حديد"
                            className={errors[`item_${index}_name`] ? 'border-red-500' : ''}
                          />
                          {errors[`item_${index}_name`] && (
                            <p className="text-sm text-red-500">{errors[`item_${index}_name`]}</p>
                          )}
                </div>
                
                        <div className="space-y-2">
                          <Label htmlFor={`item_${index}_category`}>التصنيف</Label>
                          <Select value={item.category} onValueChange={(value) => updateItem(item.id, 'category', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map(category => (
                                <SelectItem key={category.value} value={category.value}>
                                  {category.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
            </div>

                        <div className="space-y-2">
                          <Label htmlFor={`item_${index}_condition`}>الحالة</Label>
                          <Select value={item.condition} onValueChange={(value: any) => updateItem(item.id, 'condition', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {conditions.map(condition => (
                                <SelectItem key={condition.value} value={condition.value}>
                                  {condition.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
              </div>
              
                        <div className="space-y-2">
                          <Label htmlFor={`item_${index}_quantity`}>الكمية *</Label>
                          <Input
                            id={`item_${index}_quantity`}
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => {
                              const quantity = parseInt(e.target.value) || 0;
                              updateItem(item.id, 'quantity', quantity);
                              calculateItemTotal({ ...item, quantity });
                              calculateTotal();
                            }}
                            className={errors[`item_${index}_quantity`] ? 'border-red-500' : ''}
                          />
                          {errors[`item_${index}_quantity`] && (
                            <p className="text-sm text-red-500">{errors[`item_${index}_quantity`]}</p>
                          )}
                </div>
                
                        <div className="space-y-2">
                          <Label htmlFor={`item_${index}_unitPrice`}>سعر الوحدة *</Label>
                          <Input
                            id={`item_${index}_unitPrice`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => {
                              const unitPrice = parseFloat(e.target.value) || 0;
                              updateItem(item.id, 'unitPrice', unitPrice);
                              calculateItemTotal({ ...item, unitPrice });
                              calculateTotal();
                            }}
                            placeholder="0.00"
                            className={errors[`item_${index}_unitPrice`] ? 'border-red-500' : ''}
                          />
                          {errors[`item_${index}_unitPrice`] && (
                            <p className="text-sm text-red-500">{errors[`item_${index}_unitPrice`]}</p>
                          )}
                </div>
                
                        <div className="flex items-end gap-2">
                          <div className="flex-1 space-y-2">
                            <Label>الإجمالي</Label>
                            <div className="h-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 flex items-center">
                              <span className="font-semibold">
                                {item.totalPrice.toLocaleString()} ر.س
                              </span>
                </div>
                          </div>
                          {formData.items.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
              </div>
            </div>

                      <div className="mt-4 space-y-2">
                        <Label htmlFor={`item_${index}_description`}>وصف العنصر</Label>
                        <Textarea
                          id={`item_${index}_description`}
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          placeholder="وصف تفصيلي للعنصر..."
                          rows={2}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              </div>
              
            {/* ملخص الإجمالي */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <Label className="text-sm text-gray-600">إجمالي العناصر</Label>
                    <p className="text-lg font-semibold">{formData.items.length}</p>
                  </div>
                  <div className="text-center">
                    <Label className="text-sm text-gray-600">الإجمالي العام</Label>
                    <p className="text-lg font-semibold text-primary">
                      {calculateTotal().toLocaleString()} ر.س
                    </p>
              </div>
                  <div className="text-center">
                    <Label className="text-sm text-gray-600">المبلغ المتبقي</Label>
                    <p className="text-lg font-semibold text-orange-600">
                      {(calculateTotal() - formData.paidAmount).toLocaleString()} ر.س
                    </p>
            </div>
          </div>
              </CardContent>
            </Card>

        {/* أزرار الإجراءات */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
                <X className="h-4 w-4 ml-2" />
            إلغاء
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
                className="bg-primary hover:bg-primary/90"
          >
                <Save className="h-4 w-4 ml-2" />
                {isLoading ? 'جاري الحفظ...' : 'حفظ المشتريات'}
          </Button>
        </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseForm;