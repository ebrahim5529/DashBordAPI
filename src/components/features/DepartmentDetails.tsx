/**
 * مكون عرض تفاصيل القسم
 */

'use client';

import React from 'react';
import { 
  Building2, 
  Users, 
  User, 
  ArrowLeft,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Department, DepartmentStatus } from '@/lib/types/departments';
import { formatDate } from '@/lib/utils/formatDate.util';

interface DepartmentDetailsProps {
  department: Department;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export default function DepartmentDetails({ 
  department, 
  onEdit, 
  onDelete, 
  onBack, 
  isLoading = false 
}: DepartmentDetailsProps) {
  
  // تحويل حالة القسم إلى نص عربي
  const getStatusLabel = (status: DepartmentStatus): string => {
    const statuses: Record<DepartmentStatus, string> = {
      ACTIVE: 'نشط',
      INACTIVE: 'غير نشط',
      SUSPENDED: 'معلق',
    };
    return statuses[status] || status;
  };

  // الحصول على لون الحالة
  const getStatusColor = (status: DepartmentStatus): string => {
    const colors: Record<DepartmentStatus, string> = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-gray-100 text-gray-800',
      SUSPENDED: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // الحصول على أيقونة الحالة
  const getStatusIcon = (status: DepartmentStatus) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="h-4 w-4" />;
      case 'INACTIVE':
        return <XCircle className="h-4 w-4" />;
      case 'SUSPENDED':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            العودة
          </button>
          <div className="h-6 w-px bg-gray-300" />
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-[#58d2c8]" />
            <h2 className="text-xl font-semibold">تفاصيل القسم</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-[#58d2c8] text-white rounded-md hover:bg-[#58d2c8]/90 focus:outline-none focus:ring-2 focus:ring-[#58d2c8] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Edit className="h-4 w-4" />
            تعديل
          </button>

          <button
            onClick={onDelete}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            حذف
          </button>
        </div>
      </div>

      {/* معلومات القسم */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* العمود الأول - معلومات القسم الأساسية */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#58d2c8]" />
              معلومات القسم
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">اسم القسم:</span>
                <span className="font-medium">{department.name}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">رمز القسم:</span>
                <span className="font-medium font-mono bg-gray-100 px-2 py-1 rounded">
                  {department.code}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">الحالة:</span>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(department.status)}`}>
                  {getStatusIcon(department.status)}
                  {getStatusLabel(department.status)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">تاريخ الإنشاء:</span>
                <span className="font-medium">{formatDate(department.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-[#58d2c8]" />
              إحصائيات الموظفين
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">عدد الموظفين:</span>
                <span className="font-medium text-[#58d2c8] text-lg">
                  {department.employeeCount} موظف
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">المدير المسؤول:</span>
                <span className="font-medium">{department.managerName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* العمود الثاني - معلومات إضافية */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-[#58d2c8]" />
              المدير المسؤول
            </h3>
            
            <div className="bg-white rounded-md p-4 border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#58d2c8] rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{department.managerName}</h4>
                  <p className="text-sm text-gray-600">مدير القسم</p>
                </div>
              </div>
            </div>
          </div>

          {department.description && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#58d2c8]" />
                وصف القسم
              </h3>
              
              <div className="bg-white rounded-md p-4 border">
                <p className="text-gray-700 leading-relaxed">{department.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ملاحظات إضافية */}
      {department.status === 'SUSPENDED' && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-800">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">ملاحظة:</span>
          </div>
          <p className="text-yellow-700 mt-2">
            هذا القسم معلق حالياً. يرجى مراجعة المدير المسؤول للحصول على مزيد من التفاصيل.
          </p>
        </div>
      )}

      {department.status === 'INACTIVE' && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-2 text-gray-800">
            <XCircle className="h-5 w-5" />
            <span className="font-medium">ملاحظة:</span>
          </div>
          <p className="text-gray-700 mt-2">
            هذا القسم غير نشط حالياً. قد تحتاج إلى تفعيله لاستخدامه في العمليات الجديدة.
          </p>
        </div>
      )}

      {department.status === 'ACTIVE' && department.employeeCount === 0 && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-blue-800">
            <Users className="h-5 w-5" />
            <span className="font-medium">ملاحظة:</span>
          </div>
          <p className="text-blue-700 mt-2">
            هذا القسم نشط ولكن لا يحتوي على موظفين حالياً. يمكنك إضافة موظفين إليه من صفحة إدارة الموظفين.
          </p>
        </div>
      )}

      {/* معلومات إضافية للقسم النشط */}
      {department.status === 'ACTIVE' && department.employeeCount > 0 && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">ملاحظة:</span>
          </div>
          <p className="text-green-700 mt-2">
            هذا القسم نشط ويحتوي على {department.employeeCount} موظف. يمكنك إدارة الموظفين من صفحة إدارة الموظفين.
          </p>
        </div>
      )}
    </div>
  );
}
