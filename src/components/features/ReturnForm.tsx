/**
 * مكون نموذج المرتجع
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReturnTableData } from '@/lib/types/return';
import { Save, X } from 'lucide-react';

interface ReturnFormProps {
  returnItem?: ReturnTableData | null;
  onSave: (returnItem: ReturnTableData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ReturnForm({ returnItem, onSave, onCancel, isLoading = false }: ReturnFormProps) {
  const [formData, setFormData] = useState({
    itemName: '',
    customerName: '',
    returnDate: '',
    quantity: '',
    reason: '',
    condition: 'good' as 'excellent' | 'good' | 'fair' | 'poor',
    notes: '',
  });

  useEffect(() => {
    if (returnItem) {
      setFormData({
        itemName: returnItem.itemName,
        customerName: returnItem.customerName,
        returnDate: returnItem.returnDate,
        quantity: returnItem.quantity.toString(),
        reason: returnItem.reason,
        condition: returnItem.condition,
        notes: '',
      });
    } else {
      setFormData({
        itemName: '',
        customerName: '',
        returnDate: new Date().toISOString().split('T')[0],
        quantity: '',
        reason: '',
        condition: 'good',
        notes: '',
      });
    }
  }, [returnItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newReturnItem: ReturnTableData = {
      id: returnItem?.id || Date.now().toString(),
      itemName: formData.itemName,
      customerName: formData.customerName,
      returnDate: formData.returnDate,
      quantity: parseInt(formData.quantity),
      reason: formData.reason,
      condition: formData.condition,
      status: 'pending',
      value: returnItem?.value || 0,
    };

    onSave(newReturnItem);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* عنوان الصفحة */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {returnItem ? 'تعديل المرتجع' : 'إضافة مرتجع جديد'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {returnItem ? 'تعديل بيانات المرتجع' : 'إضافة مرتجع جديد للنظام'}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          <X className="h-4 w-4 ml-2" />
          إلغاء
        </Button>
      </div>

      {/* نموذج البيانات */}
      <Card>
        <CardHeader>
          <CardTitle>بيانات المرتجع</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* اسم الصنف */}
              <div className="space-y-2">
                <Label htmlFor="itemName">اسم الصنف *</Label>
                <Input
                  id="itemName"
                  value={formData.itemName}
                  onChange={(e) => handleInputChange('itemName', e.target.value)}
                  placeholder="أدخل اسم الصنف"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* اسم العميل */}
              <div className="space-y-2">
                <Label htmlFor="customerName">اسم العميل *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  placeholder="أدخل اسم العميل"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* تاريخ الإرجاع */}
              <div className="space-y-2">
                <Label htmlFor="returnDate">تاريخ الإرجاع *</Label>
                <Input
                  id="returnDate"
                  type="date"
                  value={formData.returnDate}
                  onChange={(e) => handleInputChange('returnDate', e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* الكمية */}
              <div className="space-y-2">
                <Label htmlFor="quantity">الكمية *</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  placeholder="أدخل الكمية"
                  required
                  disabled={isLoading}
                  min="1"
                />
              </div>

              {/* السبب */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="reason">سبب الإرجاع *</Label>
                <Select
                  value={formData.reason}
                  onValueChange={(value) => handleInputChange('reason', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر سبب الإرجاع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="عيب في التصنيع">عيب في التصنيع</SelectItem>
                    <SelectItem value="تلف أثناء النقل">تلف أثناء النقل</SelectItem>
                    <SelectItem value="عدم مطابقة المواصفات">عدم مطابقة المواصفات</SelectItem>
                    <SelectItem value="انتهاء صلاحية">انتهاء صلاحية</SelectItem>
                    <SelectItem value="طلب العميل">طلب العميل</SelectItem>
                    <SelectItem value="أخرى">أخرى</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* حالة الصنف */}
              <div className="space-y-2">
                <Label htmlFor="condition">حالة الصنف *</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value: 'excellent' | 'good' | 'fair' | 'poor') => 
                    handleInputChange('condition', value)
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر حالة الصنف" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">ممتاز</SelectItem>
                    <SelectItem value="good">جيد</SelectItem>
                    <SelectItem value="fair">متوسط</SelectItem>
                    <SelectItem value="poor">ضعيف</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* ملاحظات إضافية */}
              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات إضافية</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="أدخل أي ملاحظات إضافية"
                  rows={3}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t">
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
              >
                <Save className="h-4 w-4 ml-2" />
                {isLoading ? 'جاري الحفظ...' : 'حفظ المرتجع'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
