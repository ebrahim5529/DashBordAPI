/**
 * نافذة إصدار إيصال إلكتروني
 */

'use client';

import React, { useState } from 'react';
import { ClaimsTableData } from '@/lib/types/claims';
import { Button } from '@/components/shared/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { ReceiptFormData } from '@/lib/schemas/claims.schema';
import {
  X,
  Receipt,
  Calendar,
  FileText,
  MessageSquare,
  CreditCard,
  Banknote,
  Check,
  Building,
  Smartphone,
  Download,
  Printer,
} from 'lucide-react';

interface ReceiptModalProps {
  claim: ClaimsTableData;
  onGenerate: (receiptData: ReceiptFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ReceiptModal({ claim, onGenerate, onCancel, isLoading = false }: ReceiptModalProps) {
  const [formData, setFormData] = useState<ReceiptFormData>({
    receiptNumber: `RCP-${Date.now()}`,
    paymentAmount: claim.pendingAmount,
    paymentType: 'CASH',
    paymentDate: new Date(),
    reference: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // معالجة تغيير القيم
  const handleInputChange = (field: keyof ReceiptFormData, value: any) => {
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
    
    if (!formData.receiptNumber.trim()) {
      newErrors.receiptNumber = 'رقم الإيصال مطلوب';
    }
    
    if (!formData.paymentAmount || formData.paymentAmount <= 0) {
      newErrors.paymentAmount = 'المبلغ مطلوب ويجب أن يكون أكبر من صفر';
    }
    
    if (!formData.paymentDate) {
      newErrors.paymentDate = 'تاريخ الدفعة مطلوب';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onGenerate(formData);
  };

  // معالجة طباعة الإيصال
  const handlePrint = () => {
    window.print();
  };

  // معالجة تحميل الإيصال
  const handleDownload = () => {
    // محاكاة تحميل الإيصال
    const element = document.createElement('a');
    const file = new Blob(['إيصال الدفع'], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `receipt-${formData.receiptNumber}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
            <Receipt className="h-5 w-5 text-blue-600" />
            إصدار إيصال إلكتروني
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
          {/* معاينة الإيصال */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold">إيصال دفع</h2>
              <p className="text-sm text-muted-foreground">Receipt</p>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">رقم الإيصال:</span>
                <span className="font-mono font-medium">{formData.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">التاريخ:</span>
                <span>{formData.paymentDate.toLocaleDateString('ar-SA')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">اسم العميل:</span>
                <span className="font-medium">{claim.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">الهاتف:</span>
                <span>{claim.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">نوع الدفع:</span>
                <span>{paymentTypes.find(t => t.value === formData.paymentType)?.label}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-muted-foreground">المبلغ:</span>
                <span className="font-bold text-lg">{formData.paymentAmount.toLocaleString()} ر.ع</span>
              </div>
              {formData.reference && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المرجع:</span>
                  <span>{formData.reference}</span>
                </div>
              )}
              {formData.notes && (
                <div className="border-t pt-2">
                  <span className="text-muted-foreground">ملاحظات:</span>
                  <p className="mt-1 text-sm">{formData.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* نموذج الإيصال */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* رقم الإيصال */}
            <div>
              <label className="block text-sm font-medium mb-2">
                رقم الإيصال <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.receiptNumber}
                  onChange={(e) => handleInputChange('receiptNumber', e.target.value)}
                  className={`w-full pr-10 pl-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.receiptNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="رقم الإيصال"
                />
              </div>
              {errors.receiptNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.receiptNumber}</p>
              )}
            </div>

            {/* المبلغ */}
            <div>
              <label className="block text-sm font-medium mb-2">
                المبلغ <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Receipt className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="number"
                  value={formData.paymentAmount}
                  onChange={(e) => handleInputChange('paymentAmount', parseFloat(e.target.value) || 0)}
                  className={`w-full pr-10 pl-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.paymentAmount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="أدخل المبلغ"
                  step="0.01"
                  min="0.01"
                />
              </div>
              {errors.paymentAmount && (
                <p className="text-red-500 text-xs mt-1">{errors.paymentAmount}</p>
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
                type="button"
                variant="outline"
                onClick={handlePrint}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                طباعة
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleDownload}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                تحميل
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    جاري الإصدار...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    إصدار الإيصال
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
