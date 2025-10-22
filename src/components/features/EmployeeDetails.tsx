/**
 * مكون تفاصيل الموظف
 */

import React from 'react';
import { EmployeeTableData } from '@/lib/types/employee';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { 
  X, 
  Edit, 
  Printer, 
  Download, 
  User, 
  Briefcase, 
  DollarSign, 
  FileText,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  UserCheck,
  Clock
} from 'lucide-react';
import { formatNumber } from '@/lib/utils/formatNumbers';
import { mockEmployeeDetails } from '@/data/employeesData';

interface EmployeeDetailsProps {
  employee: EmployeeTableData;
  onClose: () => void;
  onEdit: (employee: EmployeeTableData) => void;
  onPrint: (employee: EmployeeTableData) => void;
}

export default function EmployeeDetails({ 
  employee, 
  onClose, 
  onEdit, 
  onPrint 
}: EmployeeDetailsProps) {
  // استخدام البيانات الوهمية للتفاصيل
  const details = mockEmployeeDetails;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'نشط', className: 'bg-green-100 text-green-800' },
      inactive: { label: 'غير نشط', className: 'bg-red-100 text-red-800' },
      on_leave: { label: 'في إجازة', className: 'bg-yellow-100 text-yellow-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const formatSalary = (salary: number) => {
    return `${formatNumber(salary)} ر.ع`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* رأس التفاصيل */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-[#58d2c8]/10 flex items-center justify-center">
              <span className="text-[#58d2c8] font-bold text-xl">
                {`${employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}`}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{employee.name}</h2>
              <p className="text-gray-600">{employee.position} - {employee.department}</p>
              <div className="flex items-center gap-2 mt-1">
                {getStatusBadge(employee.status)}
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{employee.employeeId}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPrint(employee)}
              className="gap-2"
            >
              <Printer className="h-4 w-4" />
              طباعة
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(employee)}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              تعديل
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* محتوى التفاصيل */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* البيانات الشخصية */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-[#58d2c8]" />
                  البيانات الشخصية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                      <p className="font-medium">{details.personalInfo.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">رقم الهاتف</p>
                      <p className="font-medium">{details.personalInfo.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">العنوان</p>
                      <p className="font-medium">{details.personalInfo.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">تاريخ الميلاد</p>
                      <p className="font-medium">{formatDate(details.personalInfo.dateOfBirth)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <UserCheck className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">الجنسية</p>
                      <p className="font-medium">{details.personalInfo.nationality}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* البيانات الوظيفية */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-[#58d2c8]" />
                  البيانات الوظيفية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-3">
                    <Building className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">القسم</p>
                      <p className="font-medium">{details.workInfo.department}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">المدير المباشر</p>
                      <p className="font-medium">{details.workInfo.manager}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">الموقع</p>
                      <p className="font-medium">{details.workInfo.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">تاريخ التوظيف</p>
                      <p className="font-medium">{formatDate(details.workInfo.hireDate)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">ساعات العمل</p>
                      <p className="font-medium">{details.workInfo.workSchedule}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* البيانات المالية */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-[#58d2c8]" />
                  البيانات المالية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">الراتب الأساسي</span>
                    <span className="font-medium">{formatSalary(details.salaryInfo.basicSalary)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">البدلات</span>
                    <span className="font-medium">{formatSalary(details.salaryInfo.allowances)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between border-t pt-2">
                    <span className="text-sm font-medium text-gray-700">إجمالي الراتب</span>
                    <span className="font-bold text-[#58d2c8]">{formatSalary(details.salaryInfo.totalSalary)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">طريقة الدفع</span>
                    <span className="font-medium">
                      {details.salaryInfo.paymentMethod === 'bank_transfer' ? 'تحويل بنكي' : 
                       details.salaryInfo.paymentMethod === 'cash' ? 'نقداً' : 'شيك'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* المستندات */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#58d2c8]" />
                  المستندات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {details.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium text-sm">{doc.name}</p>
                          <p className="text-xs text-gray-500">{formatDate(doc.uploadDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          doc.status === 'valid' ? 'bg-green-100 text-green-800' :
                          doc.status === 'expired' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {doc.status === 'valid' ? 'صالح' :
                           doc.status === 'expired' ? 'منتهي' : 'معلق'}
                        </span>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
