/**
 * مكون تفاصيل الرواتب
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  DollarSign, 
  User, 
  Calendar, 
  Banknote,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  FileText,
  Download,
  Edit,
  Calculator
} from 'lucide-react';

export interface SalaryDetailsData {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  salaryMonth: string;
  salaryYear: string;
  baseSalary: number;
  allowances: {
    housing: number;
    transportation: number;
    food: number;
    other: number;
  };
  deductions: {
    tax: number;
    socialInsurance: number;
    healthInsurance: number;
    other: number;
  };
  overtimeHours?: number;
  overtimeRate?: number;
  overtimeAmount?: number;
  bonuses?: {
    performance: number;
    attendance: number;
    other: number;
  };
  netSalary: number;
  grossSalary: number;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  paymentMethod: 'bank_transfer' | 'cash' | 'check';
  bankAccount?: string;
  bankName?: string;
  paymentDate?: string;
  approvedBy?: string;
  notes?: string;
  currency: 'SAR' | 'USD';
}

interface SalaryDetailsProps {
  salary: SalaryDetailsData;
  onClose: () => void;
  onEdit?: (salary: SalaryDetailsData) => void;
  onExport?: (salary: SalaryDetailsData) => void;
  onApprove?: (salary: SalaryDetailsData) => void;
  onPay?: (salary: SalaryDetailsData) => void;
}

const SalaryDetails: React.FC<SalaryDetailsProps> = ({
  salary,
  onClose,
  onEdit,
  onExport,
  onApprove,
  onPay,
}) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">في الانتظار</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">معتمد</Badge>;
      case 'paid':
        return <Badge className="bg-blue-100 text-blue-800">مدفوع</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">ملغي</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">غير محدد</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'paid':
        return <DollarSign className="h-5 w-5 text-blue-500" />;
      case 'cancelled':
        return <Clock className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'bank_transfer':
        return 'تحويل بنكي';
      case 'cash':
        return 'نقداً';
      case 'check':
        return 'شيك';
      default:
        return method;
    }
  };

  const totalAllowances = Object.values(salary.allowances).reduce((sum, amount) => sum + amount, 0);
  const totalDeductions = Object.values(salary.deductions).reduce((sum, amount) => sum + amount, 0);
  const totalBonuses = salary.bonuses ? Object.values(salary.bonuses).reduce((sum, amount) => sum + amount, 0) : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              تفاصيل الراتب
            </CardTitle>
            <div className="flex items-center gap-2">
              {onExport && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onExport(salary)}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  تصدير
                </Button>
              )}
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(salary)}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  تعديل
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
              >
                إغلاق
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              {getStatusIcon(salary.status)}
              {getStatusBadge(salary.status)}
            </div>
            <Badge className="bg-primary/10 text-primary">
              {salary.salaryMonth} {salary.salaryYear}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* معلومات الموظف والراتب الأساسية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-4 w-4" />
                  معلومات الموظف
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-600">رقم الموظف</Label>
                  <span className="font-semibold">{salary.employeeId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-600">الاسم</Label>
                  <span className="font-semibold">{salary.employeeName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-600">القسم</Label>
                  <span className="font-medium">{salary.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-600">المنصب</Label>
                  <span className="font-medium">{salary.position}</span>
                </div>
                {salary.approvedBy && (
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-gray-600">معتمد من</Label>
                    <span className="font-medium">{salary.approvedBy}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  معلومات الراتب
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-600">الشهر</Label>
                  <span className="font-semibold">{salary.salaryMonth}</span>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-600">السنة</Label>
                  <span className="font-semibold">{salary.salaryYear}</span>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-600">طريقة الدفع</Label>
                  <span className="font-medium">{getPaymentMethodLabel(salary.paymentMethod)}</span>
                </div>
                {salary.paymentDate && (
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-gray-600">تاريخ الدفع</Label>
                    <span className="font-medium">{formatDate(salary.paymentDate)}</span>
                  </div>
                )}
                {salary.bankAccount && (
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-gray-600">رقم الحساب</Label>
                    <span className="font-medium">{salary.bankAccount}</span>
                  </div>
                )}
                {salary.bankName && (
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-gray-600">اسم البنك</Label>
                    <span className="font-medium">{salary.bankName}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* تفاصيل الراتب */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                تفاصيل الراتب
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* الراتب الأساسي */}
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">الراتب الأساسي</span>
                </div>
                <span className="font-semibold">
                  {formatCurrency(salary.baseSalary, salary.currency)}
                </span>
              </div>

              {/* البدلات */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-green-700">البدلات</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mr-6">
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm">بدل السكن</span>
                    <span className="font-medium text-green-700">
                      {formatCurrency(salary.allowances.housing, salary.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm">بدل المواصلات</span>
                    <span className="font-medium text-green-700">
                      {formatCurrency(salary.allowances.transportation, salary.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm">بدل الطعام</span>
                    <span className="font-medium text-green-700">
                      {formatCurrency(salary.allowances.food, salary.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm">بدلات أخرى</span>
                    <span className="font-medium text-green-700">
                      {formatCurrency(salary.allowances.other, salary.currency)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-100 rounded-lg border border-green-200">
                  <span className="font-semibold text-green-800">إجمالي البدلات</span>
                  <span className="font-bold text-green-800">
                    {formatCurrency(totalAllowances, salary.currency)}
                  </span>
                </div>
              </div>

              {/* الخصومات */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="font-medium text-red-700">الخصومات</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mr-6">
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span className="text-sm">الضريبة</span>
                    <span className="font-medium text-red-700">
                      {formatCurrency(salary.deductions.tax, salary.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span className="text-sm">التأمين الاجتماعي</span>
                    <span className="font-medium text-red-700">
                      {formatCurrency(salary.deductions.socialInsurance, salary.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span className="text-sm">التأمين الصحي</span>
                    <span className="font-medium text-red-700">
                      {formatCurrency(salary.deductions.healthInsurance, salary.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span className="text-sm">خصومات أخرى</span>
                    <span className="font-medium text-red-700">
                      {formatCurrency(salary.deductions.other, salary.currency)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-2 bg-red-100 rounded-lg border border-red-200">
                  <span className="font-semibold text-red-800">إجمالي الخصومات</span>
                  <span className="font-bold text-red-800">
                    {formatCurrency(totalDeductions, salary.currency)}
                  </span>
                </div>
              </div>

              {/* ساعات العمل الإضافي */}
              {salary.overtimeHours && salary.overtimeAmount && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="font-medium text-orange-700">العمل الإضافي</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mr-6">
                    <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                      <span className="text-sm">عدد الساعات</span>
                      <span className="font-medium">{salary.overtimeHours}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                      <span className="text-sm">سعر الساعة</span>
                      <span className="font-medium">
                        {formatCurrency(salary.overtimeRate || 0, salary.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                      <span className="text-sm">الإجمالي</span>
                      <span className="font-medium text-orange-700">
                        {formatCurrency(salary.overtimeAmount, salary.currency)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* المكافآت */}
              {salary.bonuses && totalBonuses > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-blue-700">المكافآت</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mr-6">
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span className="text-sm">مكافأة الأداء</span>
                      <span className="font-medium text-blue-700">
                        {formatCurrency(salary.bonuses.performance, salary.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span className="text-sm">مكافأة الحضور</span>
                      <span className="font-medium text-blue-700">
                        {formatCurrency(salary.bonuses.attendance, salary.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <span className="text-sm">مكافآت أخرى</span>
                      <span className="font-medium text-blue-700">
                        {formatCurrency(salary.bonuses.other, salary.currency)}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-100 rounded-lg border border-blue-200">
                    <span className="font-semibold text-blue-800">إجمالي المكافآت</span>
                    <span className="font-bold text-blue-800">
                      {formatCurrency(totalBonuses, salary.currency)}
                    </span>
                  </div>
                </div>
              )}

              {/* الراتب الصافي */}
              <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg border-2 border-primary">
                <span className="font-bold text-lg">الراتب الصافي</span>
                <span className="font-bold text-2xl text-primary">
                  {formatCurrency(salary.netSalary, salary.currency)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* الملاحظات */}
          {salary.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  ملاحظات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="p-3 bg-gray-50 rounded-lg">{salary.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* أزرار الإجراءات */}
          {salary.status === 'pending' && onApprove && (
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-yellow-800">الراتب في انتظار الاعتماد</h3>
                    <p className="text-sm text-yellow-600">يمكنك اعتماد هذا الراتب للموظف</p>
                  </div>
                  <Button
                    onClick={() => onApprove(salary)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    اعتماد الراتب
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {salary.status === 'approved' && onPay && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-green-800">الراتب معتمد</h3>
                    <p className="text-sm text-green-600">يمكنك الآن دفع الراتب للموظف</p>
                  </div>
                  <Button
                    onClick={() => onPay(salary)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    دفع الراتب
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ملخص الراتب */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">ملخص الراتب</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrency(salary.grossSalary, salary.currency)}
                  </div>
                  <div className="text-sm text-gray-600">الراتب الإجمالي</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalAllowances, salary.currency)}
                  </div>
                  <div className="text-sm text-gray-600">البدلات</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(totalDeductions, salary.currency)}
                  </div>
                  <div className="text-sm text-gray-600">الخصومات</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(salary.netSalary, salary.currency)}
                  </div>
                  <div className="text-sm text-gray-600">الراتب الصافي</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalaryDetails;
