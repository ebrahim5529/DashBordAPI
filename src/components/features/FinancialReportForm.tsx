/**
 * نموذج إنشاء تقرير مالي
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { 
  Save, 
  X, 
  FileText, 
  BarChart3,
  DollarSign,
  TrendingUp,
  Download,
  Eye
} from 'lucide-react';

export interface FinancialReportFormData {
  id?: string;
  reportName: string;
  reportType: 'monthly' | 'quarterly' | 'yearly' | 'custom';
  startDate: string;
  endDate: string;
  includeRevenue: boolean;
  includeExpenses: boolean;
  includeProfitLoss: boolean;
  includeContracts: boolean;
  includeInventory: boolean;
  includeCustomers: boolean;
  currency: 'SAR' | 'USD' | 'EUR';
  format: 'pdf' | 'excel' | 'csv';
  description?: string;
  filters: {
    departments?: string[];
    contractTypes?: string[];
    paymentStatus?: string[];
    dateRange?: {
      start: string;
      end: string;
    };
  };
}

interface FinancialReportFormProps {
  onSubmit: (data: FinancialReportFormData) => void;
  onCancel: () => void;
  initialData?: Partial<FinancialReportFormData>;
  isLoading?: boolean;
  title?: string;
  description?: string;
}

const FinancialReportForm: React.FC<FinancialReportFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
  title = 'إنشاء تقرير مالي جديد',
  description = 'قم بتكوين التقرير المالي حسب احتياجاتك',
}) => {
  const [formData, setFormData] = useState<FinancialReportFormData>({
    reportName: initialData?.reportName || '',
    reportType: initialData?.reportType || 'monthly',
    startDate: initialData?.startDate || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: initialData?.endDate || new Date().toISOString().split('T')[0],
    includeRevenue: initialData?.includeRevenue ?? true,
    includeExpenses: initialData?.includeExpenses ?? true,
    includeProfitLoss: initialData?.includeProfitLoss ?? true,
    includeContracts: initialData?.includeContracts ?? true,
    includeInventory: initialData?.includeInventory ?? false,
    includeCustomers: initialData?.includeCustomers ?? false,
    currency: initialData?.currency || 'SAR',
    format: initialData?.format || 'pdf',
    description: initialData?.description || '',
    filters: initialData?.filters || {
      departments: [],
      contractTypes: [],
      paymentStatus: [],
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);

  // تحديث حقل في النموذج
  const updateField = (field: keyof FinancialReportFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // إزالة الخطأ عند التحديث
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // تحديث فلتر
  const updateFilter = (filterKey: keyof typeof formData.filters, value: any) => {
    setFormData(prev => ({
      ...prev,
      filters: { ...prev.filters, [filterKey]: value }
    }));
  };

  // التحقق من صحة البيانات
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.reportName.trim()) {
      newErrors.reportName = 'اسم التقرير مطلوب';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'تاريخ البداية مطلوب';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'تاريخ النهاية مطلوب';
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.dateRange = 'تاريخ البداية يجب أن يكون قبل تاريخ النهاية';
    }

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

  // معاينة التقرير
  const handlePreview = () => {
    if (validateForm()) {
      setShowPreview(true);
      // محاكاة إنشاء معاينة
      setTimeout(() => setShowPreview(false), 3000);
    }
  };

  const reportTypes = [
    { value: 'monthly', label: 'تقرير شهري' },
    { value: 'quarterly', label: 'تقرير ربع سنوي' },
    { value: 'yearly', label: 'تقرير سنوي' },
    { value: 'custom', label: 'تقرير مخصص' },
  ];

  const currencies = [
    { value: 'SAR', label: 'ريال سعودي' },
    { value: 'USD', label: 'دولار أمريكي' },
    { value: 'EUR', label: 'يورو' },
  ];

  const formats = [
    { value: 'pdf', label: 'PDF', icon: FileText },
    { value: 'excel', label: 'Excel', icon: BarChart3 },
    { value: 'csv', label: 'CSV', icon: Download },
  ];

  const departments = [
    'المبيعات',
    'المشتريات',
    'التشغيل',
    'المحاسبة',
    'الموارد البشرية',
    'التقنية',
  ];

  const contractTypes = [
    'بيع',
    'تأجير',
    'صيانة',
    'استشارات',
  ];

  const paymentStatuses = [
    'مدفوع',
    'معلق',
    'متأخر',
    'مدفوع جزئياً',
  ];

  if (showPreview) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            معاينة التقرير المالي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-green-800 font-medium">جاري إنشاء معاينة التقرير...</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-600">الإيرادات</p>
                      <p className="text-2xl font-bold">2,450,000</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-8 w-8 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-600">المصروفات</p>
                      <p className="text-2xl font-bold">1,890,000</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600">صافي الربح</p>
                      <p className="text-2xl font-bold">560,000</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex items-center justify-center">
              <Button onClick={() => setShowPreview(false)}>
                إغلاق المعاينة
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
            {/* معلومات التقرير الأساسية */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="reportName">اسم التقرير *</Label>
                <Input
                  id="reportName"
                  value={formData.reportName}
                  onChange={(e) => updateField('reportName', e.target.value)}
                  placeholder="مثال: التقرير المالي الشهري - يناير 2024"
                  className={errors.reportName ? 'border-red-500' : ''}
                />
                {errors.reportName && (
                  <p className="text-sm text-red-500">{errors.reportName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reportType">نوع التقرير</Label>
                <Select value={formData.reportType} onValueChange={(value: any) => updateField('reportType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">تاريخ البداية *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => updateField('startDate', e.target.value)}
                  className={errors.startDate ? 'border-red-500' : ''}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-500">{errors.startDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">تاريخ النهاية *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => updateField('endDate', e.target.value)}
                  className={errors.endDate ? 'border-red-500' : ''}
                />
                {errors.endDate && (
                  <p className="text-sm text-red-500">{errors.endDate}</p>
                )}
              </div>

              {errors.dateRange && (
                <div className="md:col-span-2">
                  <p className="text-sm text-red-500">{errors.dateRange}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="currency">العملة</Label>
                <Select value={formData.currency} onValueChange={(value: any) => updateField('currency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(currency => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="format">تنسيق التقرير</Label>
                <Select value={formData.format} onValueChange={(value: any) => updateField('format', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {formats.map(format => {
                      const Icon = format.icon;
                      return (
                        <SelectItem key={format.value} value={format.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {format.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* محتوى التقرير */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">محتوى التقرير</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeRevenue"
                    checked={formData.includeRevenue}
                    onChange={(e) => updateField('includeRevenue', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="includeRevenue">الإيرادات</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeExpenses"
                    checked={formData.includeExpenses}
                    onChange={(e) => updateField('includeExpenses', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="includeExpenses">المصروفات</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeProfitLoss"
                    checked={formData.includeProfitLoss}
                    onChange={(e) => updateField('includeProfitLoss', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="includeProfitLoss">الأرباح والخسائر</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeContracts"
                    checked={formData.includeContracts}
                    onChange={(e) => updateField('includeContracts', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="includeContracts">العقود</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeInventory"
                    checked={formData.includeInventory}
                    onChange={(e) => updateField('includeInventory', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="includeInventory">المخزون</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="includeCustomers"
                    checked={formData.includeCustomers}
                    onChange={(e) => updateField('includeCustomers', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="includeCustomers">العملاء</Label>
                </div>
              </div>
            </div>

            {/* الفلاتر */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">فلاتر إضافية</Label>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>الأقسام</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-2">
                    {departments.map(dept => (
                      <div key={dept} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`dept_${dept}`}
                          checked={formData.filters.departments?.includes(dept) || false}
                          onChange={(e) => {
                            const current = formData.filters.departments || [];
                            const updated = e.target.checked 
                              ? [...current, dept]
                              : current.filter(d => d !== dept);
                            updateFilter('departments', updated);
                          }}
                          className="rounded"
                        />
                        <Label htmlFor={`dept_${dept}`} className="text-sm">{dept}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>أنواع العقود</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-2">
                    {contractTypes.map(type => (
                      <div key={type} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`contract_${type}`}
                          checked={formData.filters.contractTypes?.includes(type) || false}
                          onChange={(e) => {
                            const current = formData.filters.contractTypes || [];
                            const updated = e.target.checked 
                              ? [...current, type]
                              : current.filter(t => t !== type);
                            updateFilter('contractTypes', updated);
                          }}
                          className="rounded"
                        />
                        <Label htmlFor={`contract_${type}`} className="text-sm">{type}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>حالة الدفع</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-2">
                    {paymentStatuses.map(status => (
                      <div key={status} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`status_${status}`}
                          checked={formData.filters.paymentStatus?.includes(status) || false}
                          onChange={(e) => {
                            const current = formData.filters.paymentStatus || [];
                            const updated = e.target.checked 
                              ? [...current, status]
                              : current.filter(s => s !== status);
                            updateFilter('paymentStatus', updated);
                          }}
                          className="rounded"
                        />
                        <Label htmlFor={`status_${status}`} className="text-sm">{status}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* وصف التقرير */}
            <div className="space-y-2">
              <Label htmlFor="description">وصف التقرير</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="وصف إضافي للتقرير أو ملاحظات مهمة..."
                rows={3}
              />
            </div>

            {/* ملخص التقرير */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">نوع التقرير</Label>
                    <p className="font-semibold">
                      {reportTypes.find(t => t.value === formData.reportType)?.label}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">الفترة الزمنية</Label>
                    <p className="font-semibold">
                      {new Date(formData.startDate).toLocaleDateString('ar-SA')} - {new Date(formData.endDate).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">العملة</Label>
                    <p className="font-semibold">
                      {currencies.find(c => c.value === formData.currency)?.label}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">التنسيق</Label>
                    <p className="font-semibold">
                      {formats.find(f => f.value === formData.format)?.label}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* أزرار الإجراءات */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handlePreview}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                معاينة
              </Button>
              
              <div className="flex items-center gap-2">
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
                  {isLoading ? 'جاري الإنشاء...' : 'إنشاء التقرير'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialReportForm;
