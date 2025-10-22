/**
 * نافذة تسجيل دفعة جديدة
 */

'use client';

import React, { useState } from 'react';
import { ClaimsTableData } from '@/lib/types/claims';
import { Button } from '@/components/shared/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { PaymentFormData } from '@/lib/schemas/claims.schema';
import {
  X,
  DollarSign,
  Calendar,
  FileText,
  MessageSquare,
  CreditCard,
  Banknote,
  Check,
  Building,
  Smartphone,
} from 'lucide-react';

interface PaymentModalProps {
  claim: ClaimsTableData;
  onSave: (paymentData: PaymentFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PaymentModal({ claim, onSave, onCancel, isLoading = false }: PaymentModalProps) {
  const [formData, setFormData] = useState<PaymentFormData>({
    amount: claim.pendingAmount,
    paymentType: 'CASH',
    paymentDate: new Date(),
    reference: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // معالجة تغيير القيم
  const handleInputChange = (field: keyof PaymentFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // مسح الخطأ عند التغيير
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // معالجة الإرسال
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من صحة البيانات
    const newErrors: Record<string, string> = {};
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'المبلغ مطلوب ويجب أن يكون أكبر من صفر';
    }
    
    if (formData.amount > claim.pendingAmount) {
      newErrors.amount = 'المبلغ لا يمكن أن يكون أكبر من المبلغ المتبقي';
    }
    
    if (!formData.paymentDate) {
      newErrors.paymentDate = 'تاريخ الدفعة مطلوب';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSave(formData);
  };

  // أنواع الدفع
  const paymentTypes = [
    { value: 'CASH', label: 'نقداً', icon: Banknote },
    { value: 'BANK_TRANSFER', label: 'تحويل بنكي', icon: Building },
    { value: 'CHECK', label: 'شيك', icon: FileText },
    { value: 'CREDIT_CARD', label: 'بطاقة ائتمان', icon: CreditCard },
    { value: 'INSTALLMENT', label: 'تقسيط', icon: Smartphone },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            تسجيل دفعة جديدة
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* معلومات العميل */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">معلومات العميل</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">الاسم:</span>
                <span className="font-medium mr-2">{claim.customerName}</span>
              </div>
              <div>
                <span className="text-muted-foreground">الهاتف:</span>
                <span className="font-medium mr-2">{claim.customerPhone}</span>
              </div>
              <div>
                <span className="text-muted-foreground">المبلغ المتبقي:</span>
                <span className="font-medium text-red-600 mr-2">
                  {claim.pendingAmount.toLocaleString()} ر.ع
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">إجمالي العقود:</span>
                <span className="font-medium mr-2">{claim.totalContracts}</span>
              </div>
            </div>
          </div>

          {/* نموذج الدفعة */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* المبلغ */}
            <div>
              <label className="block text-sm font-medium mb-2">
                المبلغ <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                  className={`w-full pr-10 pl-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.amount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="أدخل المبلغ"
                  step="0.01"
                  min="0.01"
                  max={claim.pendingAmount}
                />
              </div>
              {errors.amount && (
                <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
              )}
            </div>

            {/* نوع الدفع */}
            <div>
              <label className="block text-sm font-medium mb-2">
                نوع الدفع <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {paymentTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleInputChange('paymentType', type.value)}
                      className={`p-3 border rounded-lg flex items-center gap-2 transition-colors ${
                        formData.paymentType === type.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* تاريخ الدفع */}
            <div>
              <label className="block text-sm font-medium mb-2">
                تاريخ الدفع <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  value={formData.paymentDate.toISOString().split('T')[0]}
                  onChange={(e) => handleInputChange('paymentDate', new Date(e.target.value))}
                  className={`w-full pr-10 pl-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.paymentDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.paymentDate && (
                <p className="text-red-500 text-xs mt-1">{errors.paymentDate}</p>
              )}
            </div>

            {/* المرجع */}
            <div>
              <label className="block text-sm font-medium mb-2">المرجع</label>
              <div className="relative">
                <FileText className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.reference}
                  onChange={(e) => handleInputChange('reference', e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="رقم المرجع أو المعاملة"
                />
              </div>
            </div>

            {/* الملاحظات */}
            <div>
              <label className="block text-sm font-medium mb-2">الملاحظات</label>
              <div className="relative">
                <MessageSquare className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="أي ملاحظات إضافية..."
                  rows={3}
                />
              </div>
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex justify-end gap-3 pt-4 border-t">
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
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    تسجيل الدفعة
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
