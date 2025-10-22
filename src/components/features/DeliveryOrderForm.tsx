/**
 * نموذج إنشاء/تعديل أمر التوصيل
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
  Truck, 
  Package, 
  User,
  Calendar
} from 'lucide-react';

export interface DeliveryOrderFormData {
  id?: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryDate: string;
  deliveryTime: string;
  orderType: 'delivery' | 'return' | 'both';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'assigned' | 'in_progress' | 'delivered' | 'cancelled';
  driverId?: string;
  driverName?: string;
  notes?: string;
  items: DeliveryItem[];
}

export interface DeliveryItem {
  id: string;
  itemName: string;
  itemCode: string;
  quantity: number;
  condition: 'new' | 'used' | 'damaged';
  description?: string;
}

interface DeliveryOrderFormProps {
  onSubmit: (data: DeliveryOrderFormData) => void;
  onCancel: () => void;
  initialData?: Partial<DeliveryOrderFormData>;
  isLoading?: boolean;
  title?: string;
  description?: string;
}

const DeliveryOrderForm: React.FC<DeliveryOrderFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
  title = 'إنشاء أمر توصيل جديد',
  description = 'املأ البيانات التالية لإنشاء أمر توصيل جديد',
}) => {
  const [formData, setFormData] = useState<DeliveryOrderFormData>({
    orderNumber: initialData?.orderNumber || `DO-${Date.now()}`,
    customerId: initialData?.customerId || '',
    customerName: initialData?.customerName || '',
    customerPhone: initialData?.customerPhone || '',
    customerEmail: initialData?.customerEmail || '',
    deliveryAddress: initialData?.deliveryAddress || '',
    deliveryCity: initialData?.deliveryCity || '',
    deliveryDate: initialData?.deliveryDate || new Date().toISOString().split('T')[0],
    deliveryTime: initialData?.deliveryTime || '09:00',
    orderType: initialData?.orderType || 'delivery',
    priority: initialData?.priority || 'medium',
    status: initialData?.status || 'pending',
    driverId: initialData?.driverId || '',
    driverName: initialData?.driverName || '',
    notes: initialData?.notes || '',
    items: initialData?.items || [{
      id: '1',
      itemName: '',
      itemCode: '',
      quantity: 1,
      condition: 'new',
      description: ''
    }],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // تحديث حقل في النموذج
  const updateField = (field: keyof DeliveryOrderFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // إزالة الخطأ عند التحديث
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // تحديث عنصر في قائمة العناصر
  const updateItem = (itemId: string, field: keyof DeliveryItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId ? { ...item, [field]: value } : item
      )
    }));
  };

  // إضافة عنصر جديد
  const addItem = () => {
    const newItem: DeliveryItem = {
      id: Date.now().toString(),
      itemName: '',
      itemCode: '',
      quantity: 1,
      condition: 'new',
      description: ''
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

  // تحديث معلومات العميل عند اختيار عميل
  const handleCustomerSelect = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      updateField('customerId', customer.id);
      updateField('customerName', customer.name);
      updateField('customerPhone', customer.phone);
      updateField('customerEmail', customer.email);
      updateField('deliveryAddress', customer.address);
      updateField('deliveryCity', customer.city);
    }
  };

  // تحديث معلومات السائق عند اختيار سائق
  const handleDriverSelect = (driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    if (driver) {
      updateField('driverId', driver.id);
      updateField('driverName', driver.name);
    }
  };

  // التحقق من صحة البيانات
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.orderNumber.trim()) {
      newErrors.orderNumber = 'رقم الأمر مطلوب';
    }
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'اسم العميل مطلوب';
    }
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'رقم هاتف العميل مطلوب';
    }
    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'عنوان التوصيل مطلوب';
    }
    if (!formData.deliveryDate) {
      newErrors.deliveryDate = 'تاريخ التوصيل مطلوب';
    }

    // التحقق من العناصر
    formData.items.forEach((item, index) => {
      if (!item.itemName.trim()) {
        newErrors[`item_${index}_name`] = 'اسم العنصر مطلوب';
      }
      if (item.quantity <= 0) {
        newErrors[`item_${index}_quantity`] = 'الكمية يجب أن تكون أكبر من صفر';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // إرسال النموذج
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const dataToSubmit = {
        ...formData,
        id: initialData?.id || Date.now().toString(),
      };
      onSubmit(dataToSubmit);
    }
  };

  // بيانات العملاء
  const customers = [
    { id: '1', name: 'أحمد محمد علي', phone: '0501234567', email: 'ahmed@example.com', address: 'شارع الملك فهد، الرياض', city: 'الرياض' },
    { id: '2', name: 'فاطمة أحمد السعيد', phone: '0507654321', email: 'fatima@example.com', address: 'شارع العليا، جدة', city: 'جدة' },
    { id: '3', name: 'محمد خالد الحربي', phone: '0509876543', email: 'mohammed@example.com', address: 'شارع التحلية، الدمام', city: 'الدمام' },
    { id: '4', name: 'سارة عبدالله النجار', phone: '0505555555', email: 'sara@example.com', address: 'شارع الجامعة، المدينة', city: 'المدينة المنورة' },
  ];

  // بيانات السائقين
  const drivers = [
    { id: '1', name: 'خالد أحمد المطيري', phone: '0511111111' },
    { id: '2', name: 'عبدالرحمن محمد العتيبي', phone: '0512222222' },
    { id: '3', name: 'نواف سعد القحطاني', phone: '0513333333' },
    { id: '4', name: 'بدر عبدالعزيز الشمري', phone: '0514444444' },
  ];

  const orderTypes = [
    { value: 'delivery', label: 'توصيل فقط' },
    { value: 'return', label: 'استرجاع فقط' },
    { value: 'both', label: 'توصيل واسترجاع' },
  ];

  const priorities = [
    { value: 'low', label: 'منخفضة', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'متوسطة', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'عالية', color: 'bg-orange-100 text-orange-800' },
    { value: 'urgent', label: 'عاجلة', color: 'bg-red-100 text-red-800' },
  ];

  const statuses = [
    { value: 'pending', label: 'معلق', color: 'bg-gray-100 text-gray-800' },
    { value: 'assigned', label: 'مكلف', color: 'bg-blue-100 text-blue-800' },
    { value: 'in_progress', label: 'قيد التنفيذ', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'delivered', label: 'تم التسليم', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'ملغي', color: 'bg-red-100 text-red-800' },
  ];

  const conditions = [
    { value: 'new', label: 'جديد' },
    { value: 'used', label: 'مستعمل' },
    { value: 'damaged', label: 'تالف' },
  ];

  const cities = [
    'الرياض',
    'جدة',
    'مكة المكرمة',
    'المدينة المنورة',
    'الدمام',
    'الخبر',
    'الظهران',
    'تبوك',
    'بريدة',
    'الهفوف',
    'حائل',
    'نجران',
    'الطائف',
    'أخرى'
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            {title}
          </CardTitle>
          <p className="text-gray-600">{description}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* معلومات الأمر الأساسية */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="orderNumber">رقم الأمر *</Label>
                <Input
                  id="orderNumber"
                  value={formData.orderNumber}
                  onChange={(e) => updateField('orderNumber', e.target.value)}
                  placeholder="DO-2024-001"
                  className={errors.orderNumber ? 'border-red-500' : ''}
                />
                {errors.orderNumber && (
                  <p className="text-sm text-red-500">{errors.orderNumber}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="orderType">نوع الأمر</Label>
                <Select value={formData.orderType} onValueChange={(value: any) => updateField('orderType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {orderTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">الأولوية</Label>
                <Select value={formData.priority} onValueChange={(value: any) => updateField('priority', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map(priority => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <div className="flex items-center gap-2">
                          <Badge className={priority.color}>
                            {priority.label}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">الحالة</Label>
                <Select value={formData.status} onValueChange={(value: any) => updateField('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        <div className="flex items-center gap-2">
                          <Badge className={status.color}>
                            {status.label}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* معلومات العميل */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                معلومات العميل
              </Label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="customerId">العميل *</Label>
                  <Select value={formData.customerId} onValueChange={handleCustomerSelect}>
                    <SelectTrigger className={errors.customerName ? 'border-red-500' : ''}>
                      <SelectValue placeholder="اختر العميل" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map(customer => (
                        <SelectItem key={customer.id} value={customer.id}>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-sm text-gray-500">{customer.phone}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.customerName && (
                    <p className="text-sm text-red-500">{errors.customerName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerPhone">رقم الهاتف *</Label>
                  <Input
                    id="customerPhone"
                    value={formData.customerPhone}
                    onChange={(e) => updateField('customerPhone', e.target.value)}
                    placeholder="0501234567"
                    className={errors.customerPhone ? 'border-red-500' : ''}
                  />
                  {errors.customerPhone && (
                    <p className="text-sm text-red-500">{errors.customerPhone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerEmail">البريد الإلكتروني</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => updateField('customerEmail', e.target.value)}
                    placeholder="customer@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryCity">المدينة</Label>
                  <Select value={formData.deliveryCity} onValueChange={(value) => updateField('deliveryCity', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المدينة" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map(city => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deliveryAddress">عنوان التوصيل *</Label>
                <Textarea
                  id="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={(e) => updateField('deliveryAddress', e.target.value)}
                  placeholder="العنوان التفصيلي للتوصيل..."
                  rows={3}
                  className={errors.deliveryAddress ? 'border-red-500' : ''}
                />
                {errors.deliveryAddress && (
                  <p className="text-sm text-red-500">{errors.deliveryAddress}</p>
                )}
              </div>
            </div>

            {/* معلومات التوصيل */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                معلومات التوصيل
              </Label>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="deliveryDate">تاريخ التوصيل *</Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) => updateField('deliveryDate', e.target.value)}
                    className={errors.deliveryDate ? 'border-red-500' : ''}
                  />
                  {errors.deliveryDate && (
                    <p className="text-sm text-red-500">{errors.deliveryDate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryTime">وقت التوصيل</Label>
                  <Input
                    id="deliveryTime"
                    type="time"
                    value={formData.deliveryTime}
                    onChange={(e) => updateField('deliveryTime', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="driverId">السائق</Label>
                  <Select value={formData.driverId || ''} onValueChange={handleDriverSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر السائق" />
                    </SelectTrigger>
                    <SelectContent>
                      {drivers.map(driver => (
                        <SelectItem key={driver.id} value={driver.id}>
                          <div>
                            <p className="font-medium">{driver.name}</p>
                            <p className="text-sm text-gray-500">{driver.phone}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* قائمة العناصر */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  عناصر التوصيل
                </Label>
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
                          <Label htmlFor={`item_${index}_code`}>كود العنصر</Label>
                          <Input
                            id={`item_${index}_code`}
                            value={item.itemCode}
                            onChange={(e) => updateItem(item.id, 'itemCode', e.target.value)}
                            placeholder="SKU-001"
                          />
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
                            onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                            className={errors[`item_${index}_quantity`] ? 'border-red-500' : ''}
                          />
                          {errors[`item_${index}_quantity`] && (
                            <p className="text-sm text-red-500">{errors[`item_${index}_quantity`]}</p>
                          )}
                        </div>

                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <Label>الإجراءات</Label>
                            <div className="h-10 flex items-center">
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

            {/* ملاحظات */}
            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="أي ملاحظات إضافية أو تعليمات خاصة..."
                rows={3}
              />
            </div>

            {/* ملخص الأمر */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <Label className="text-sm text-gray-600">عدد العناصر</Label>
                    <p className="text-lg font-semibold">{formData.items.length}</p>
                  </div>
                  <div className="text-center">
                    <Label className="text-sm text-gray-600">نوع الأمر</Label>
                    <p className="text-lg font-semibold">
                      {orderTypes.find(t => t.value === formData.orderType)?.label}
                    </p>
                  </div>
                  <div className="text-center">
                    <Label className="text-sm text-gray-600">الأولوية</Label>
                    <Badge className={priorities.find(p => p.value === formData.priority)?.color}>
                      {priorities.find(p => p.value === formData.priority)?.label}
                    </Badge>
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
                {isLoading ? 'جاري الحفظ...' : 'حفظ أمر التوصيل'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryOrderForm;
