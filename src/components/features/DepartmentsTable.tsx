'use client';

import React, { useState } from 'react';
import { Search, Filter, Plus, Eye, Edit, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DepartmentTableData } from '@/lib/types/departments';
import { getDepartmentStatusLabel, getDepartmentStatusColor, formatDate, formatNumber } from '@/data/departmentsData';

interface DepartmentsTableProps {
  data: DepartmentTableData[];
  onAddDepartment: () => void;
  onEditDepartment: (department: DepartmentTableData) => void;
  onDeleteDepartment: (department: DepartmentTableData) => void;
  onViewDepartment: (department: DepartmentTableData) => void;
  onExportDepartments: () => void;
}

export function DepartmentsTable({
  data,
  onAddDepartment,
  onEditDepartment,
  onDeleteDepartment,
  onViewDepartment,
  onExportDepartments
}: DepartmentsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [managerFilter, setManagerFilter] = useState('');

  // Filter data based on search and filters
  const filteredData = data.filter(department => {
    const matchesSearch = department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         department.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         department.managerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || department.status === statusFilter;
    const matchesManager = !managerFilter || department.managerName.toLowerCase().includes(managerFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesManager;
  });

  const getStatusBadge = (status: string) => {
    const label = getDepartmentStatusLabel(status);
    const colorClass = getDepartmentStatusColor(status);
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* شريط الأدوات */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
            {/* البحث */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="البحث في الأقسام..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 text-right"
              />
            </div>

            {/* الفلاتر */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              فلاتر
            </Button>
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExportDepartments}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              تصدير
            </Button>
            <Button
              onClick={onAddDepartment}
              className="bg-[#58d2c8] hover:bg-[#4AB8B3] text-white flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              إضافة قسم
            </Button>
          </div>
        </div>

        {/* الفلاتر المتقدمة */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="ACTIVE">نشط</option>
                  <option value="INACTIVE">غير نشط</option>
                  <option value="SUSPENDED">معلق</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المدير</label>
                <Input
                  type="text"
                  placeholder="البحث بالمدير..."
                  value={managerFilter}
                  onChange={(e) => setManagerFilter(e.target.value)}
                  className="text-right"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* الجدول */}
      <div className="rounded-md border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                اسم القسم
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                المدير
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                عدد الموظفين
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                تاريخ الإنشاء
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                الحالة
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((department) => (
              <tr key={department.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 rounded-full bg-[#58d2c8]/10 flex items-center justify-center">
                        <span className="text-[#58d2c8] font-medium text-xs">
                          {department.code}
                        </span>
                      </div>
                    </div>
                    <div className="mr-3">
                      <div className="text-sm font-medium text-gray-900">{department.name}</div>
                      <div className="text-xs text-gray-500">{department.code}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {department.managerName}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {formatNumber(department.employeeCount)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {formatDate(department.createdAt)}
                </td>
                <td className="px-4 py-3">
                  {getStatusBadge(department.status)}
                </td>
                <td className="px-4 py-3 text-sm font-medium">
                  <div className="flex items-center gap-0.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDepartment(department)}
                      className="h-6 w-6 p-0 hover:bg-blue-100"
                      title="عرض التفاصيل"
                    >
                      <Eye className="h-3 w-3 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditDepartment(department)}
                      className="h-6 w-6 p-0 hover:bg-green-100"
                      title="تعديل"
                    >
                      <Edit className="h-3 w-3 text-green-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteDepartment(department)}
                      className="h-6 w-6 p-0 hover:bg-red-100"
                      title="حذف"
                    >
                      <Trash2 className="h-3 w-3 text-red-600" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* تذييل الجدول */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            عرض {filteredData.length} من {data.length} قسم
          </div>
          <div className="text-sm text-gray-500">
            آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
          </div>
        </div>
      </div>
    </div>
  );
}
