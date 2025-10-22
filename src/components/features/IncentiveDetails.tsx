/**
 * مكون عرض تفاصيل الحوافز مع إمكانية البحث عن الموظفين
 */

'use client';

import React, { useState, useMemo } from 'react';
import { IncentiveData } from '@/lib/types/employee';
import { Button } from '@/components/shared/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { SafeDate } from '@/components/ui/SafeDate';
import {
  ArrowLeft,
  Search,
  User,
  DollarSign,
  Award,
  Filter,
  Download,
  Printer,
  Eye,
  Plus,
  Edit,
  Trash2,
} from 'lucide-react';

interface IncentiveDetailsProps {
  incentive: IncentiveData;
  onBack: () => void;
  onEdit?: (incentive: IncentiveData) => void;
  onDelete?: (incentive: IncentiveData) => void;
  onPrint?: (incentive: IncentiveData) => void;
  onExport?: (incentive: IncentiveData) => void;
}

export function IncentiveDetails({
  incentive,
  onBack,
  onEdit,
  onDelete,
  onPrint,
  onExport,
}: IncentiveDetailsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  // قائمة الموظفين الوهمية للبحث
  const mockEmployees = [
    { id: '1', name: 'أحمد محمد علي', department: 'المبيعات', position: 'مدير مبيعات' },
    { id: '2', name: 'فاطمة أحمد السعيد', department: 'التقنية', position: 'مطور برمجيات' },
    { id: '3', name: 'محمد سالم الكندي', department: 'المالية', position: 'محاسب' },
    { id: '4', name: 'عائشة عبدالله الحارثي', department: 'الموارد البشرية', position: 'أخصائي موارد بشرية' },
    { id: '5', name: 'خالد أحمد الشنفري', department: 'الإدارة', position: 'مدير إداري' },
    { id: '6', name: 'نورا محمد النوفلي', department: 'المبيعات', position: 'مندوب مبيعات' },
    { id: '7', name: 'عبدالرحمن سالم العبري', department: 'التقنية', position: 'مطور ويب' },
    { id: '8', name: 'مريم أحمد الزهراني', department: 'المالية', position: 'محاسب أول' },
  ];

  // تصفية الموظفين حسب البحث
  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return mockEmployees;
    return mockEmployees.filter(employee =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // دالة لتحديد لون نوع الحافز
  const getIncentiveTypeColor = (type: string) => {
    switch (type) {
      case 'bonus':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'commission':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'overtime':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'performance':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // دالة لتحديد نص نوع الحافز
  const getIncentiveTypeText = (type: string) => {
    switch (type) {
      case 'bonus':
        return 'مكافأة';
      case 'commission':
        return 'عمولة';
      case 'overtime':
        return 'ساعات إضافية';
      case 'performance':
        return 'أداء';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            العودة
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              تفاصيل الحافز
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {incentive.id}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {onExport && (
            <Button
              variant="outline"
              onClick={() => onExport(incentive)}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              تصدير
            </Button>
          )}
          {onPrint && (
            <Button
              variant="outline"
              onClick={() => onPrint(incentive)}
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              طباعة
            </Button>
          )}
          {onEdit && (
            <Button
              variant="outline"
              onClick={() => onEdit(incentive)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              تعديل
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              onClick={() => onDelete(incentive)}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              حذف
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Incentive Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                معلومات الحافز
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    رقم الحافز
                  </label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {incentive.id}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    نوع الحافز
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getIncentiveTypeColor(incentive.incentiveType)}`}>
                      {getIncentiveTypeText(incentive.incentiveType)}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    المبلغ
                  </label>
                  <p className="text-lg font-semibold text-green-600">
                    {incentive.amount.toLocaleString('ar-SA')} ر.ع
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    تاريخ الحافز
                  </label>
                  <p className="text-lg text-gray-900 dark:text-white">
                    <SafeDate date={incentive.date} />
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    الحالة
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      incentive.status === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : incentive.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {incentive.status === 'approved' ? 'معتمد' : incentive.status === 'pending' ? 'في الانتظار' : 'مرفوض'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    الموظف
                  </label>
                  <p className="text-lg text-gray-900 dark:text-white">
                    {incentive.employeeName}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employee Search */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                البحث عن الموظفين
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ابحث عن الموظف بالاسم، القسم، أو الوظيفة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Employees List */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <div
                      key={employee.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors duration-200 ${
                        selectedEmployee === employee.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedEmployee(employee.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {employee.name}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {employee.position} - {employee.department}
                            </p>
                          </div>
                        </div>
                        {selectedEmployee === employee.id && (
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      لا توجد نتائج للبحث
                    </p>
                  </div>
                )}
              </div>

              {/* Selected Employee Actions */}
              {selectedEmployee && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-blue-900">
                        موظف محدد
                      </h4>
                      <p className="text-sm text-blue-700">
                        {filteredEmployees.find(emp => emp.id === selectedEmployee)?.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 border-blue-300 hover:bg-blue-100"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        عرض التفاصيل
                      </Button>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        إضافة حافز
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                إحصائيات سريعة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {incentive.amount.toLocaleString('ar-SA')}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  ر.ع
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">النوع:</span>
                  <span className="font-medium">{getIncentiveTypeText(incentive.incentiveType)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">الحالة:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    incentive.status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : incentive.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {incentive.status === 'approved' ? 'معتمد' : incentive.status === 'pending' ? 'في الانتظار' : 'مرفوض'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">التاريخ:</span>
                  <span className="font-medium"><SafeDate date={incentive.date} /></span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                إجراءات سريعة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {/* إضافة حافز جديد */}}
              >
                <Plus className="h-4 w-4 mr-2" />
                إضافة حافز جديد
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {/* عرض تقرير */}}
              >
                <Eye className="h-4 w-4 mr-2" />
                عرض تقرير الحوافز
              </Button>
              {onPrint && (
                <Button
                  variant="outline"
                  onClick={() => onPrint(incentive)}
                  className="w-full justify-start"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  طباعة التفاصيل
                </Button>
              )}
              {onExport && (
                <Button
                  variant="outline"
                  onClick={() => onExport(incentive)}
                  className="w-full justify-start"
                >
                  <Download className="h-4 w-4 mr-2" />
                  تصدير البيانات
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default IncentiveDetails;