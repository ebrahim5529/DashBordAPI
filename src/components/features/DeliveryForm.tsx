/**
 * مكون نموذج إيصال التسليم
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DeliveryTableData } from '@/lib/types/delivery';
import { Save, X } from 'lucide-react';

interface DeliveryFormProps {
  delivery?: DeliveryTableData | null;
  onSave: (delivery: DeliveryTableData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function DeliveryForm({ delivery, onSave, onCancel, isLoading = false }: DeliveryFormProps) {
  const [formData, setFormData] = useState({
    receiptNumber: '',
    customerName: '',
    deliveryDate: '',
    itemsCount: '',
    deliveryAddress: '',
    driverName: '',
    notes: '',
  });

  useEffect(() => {
    if (delivery) {
      setFormData({
        receiptNumber: delivery.receiptNumber,
        customerName: delivery.customerName,
        deliveryDate: delivery.deliveryDate,
        itemsCount: delivery.itemsCount.toString(),
        deliveryAddress: delivery.deliveryAddress,
        driverName: delivery.driverName,
        notes: '',
      });
    } else {
      setFormData({
        receiptNumber: '',
        customerName: '',
        deliveryDate: new Date().toISOString().split('T')[0],
        itemsCount: '',
        deliveryAddress: '',
        driverName: '',
        notes: '',
      });
    }
  }, [delivery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newDelivery: DeliveryTableData = {
      id: delivery?.id || Date.now().toString(),
      receiptNumber: formData.receiptNumber,
      customerName: formData.customerName,
      deliveryDate: formData.deliveryDate,
      itemsCount: parseInt(formData.itemsCount),
      deliveryAddress: formData.deliveryAddress,
      driverName: formData.driverName,
      status: 'pending',
      value: delivery?.value || 0,
    };

    onSave(newDelivery);
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
            {delivery ? 'تعديل إيصال التسليم' : 'إضافة إيصال تسليم جديد'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {delivery ? 'تعديل بيانات إيصال التسليم' : 'إضافة إيصال تسليم جديد للنظام'}
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
          <CardTitle>بيانات إيصال التسليم</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* رقم الإيصال */}
              <div className="space-y-2">
                <Label htmlFor="receiptNumber">رقم الإيصال *</Label>
                <Input
                  id="receiptNumber"
                  value={formData.receiptNumber}
                  onChange={(e) => handleInputChange('receiptNumber', e.target.value)}
                  placeholder="أدخل رقم الإيصال"
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

              {/* تاريخ التسليم */}
              <div className="space-y-2">
                <Label htmlFor="deliveryDate">تاريخ التسليم *</Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* عدد الأصناف */}
              <div className="space-y-2">
                <Label htmlFor="itemsCount">عدد الأصناف *</Label>
                <Input
                  id="itemsCount"
                  type="number"
                  value={formData.itemsCount}
                  onChange={(e) => handleInputChange('itemsCount', e.target.value)}
                  placeholder="أدخل عدد الأصناف"
                  required
                  disabled={isLoading}
                  min="1"
                />
              </div>

              {/* السائق */}
              <div className="space-y-2">
                <Label htmlFor="driverName">اسم السائق *</Label>
                <Input
                  id="driverName"
                  value={formData.driverName}
                  onChange={(e) => handleInputChange('driverName', e.target.value)}
                  placeholder="أدخل اسم السائق"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* عنوان التسليم */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="deliveryAddress">عنوان التسليم *</Label>
                <Textarea
                  id="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                  placeholder="أدخل عنوان التسليم"
                  rows={3}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* ملاحظات إضافية */}
              <div className="space-y-2 md:col-span-2">
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
                {isLoading ? 'جاري الحفظ...' : 'حفظ إيصال التسليم'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
