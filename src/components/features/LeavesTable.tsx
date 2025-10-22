'use client';

import React, { useState } from 'react';
import { Search, Filter, Plus, Eye, Edit, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LeaveTableData } from '@/lib/types/leaves';
import { getLeaveTypeLabel, getLeaveTypeColor, getLeaveStatusLabel, getLeaveStatusColor, formatDate } from '@/data/leavesData';

interface LeavesTableProps {
  data: LeaveTableData[];
  onAddLeave: () => void;
  onEditLeave: (leave: LeaveTableData) => void;
  onDeleteLeave: (leave: LeaveTableData) => void;
  onViewLeave: (leave: LeaveTableData) => void;
  onExportLeaves: () => void;
}

export function LeavesTable({
  data,
  onAddLeave,
  onEditLeave,
  onDeleteLeave,
  onViewLeave,
  onExportLeaves
}: LeavesTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState('');

  // Filter data based on search and filters
  const filteredData = data.filter(leave => {
    const matchesSearch = leave.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leave.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || leave.status === statusFilter;
    const matchesType = typeFilter === 'all' || leave.leaveType === typeFilter;
    const matchesDepartment = !departmentFilter || leave.department.toLowerCase().includes(departmentFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesType && matchesDepartment;
  });

  const getTypeBadge = (type: string) => {
    const label = getLeaveTypeLabel(type);
    const colorClass = getLeaveTypeColor(type);
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {label}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const label = getLeaveStatusLabel(status);
    const colorClass = getLeaveStatusColor(status);
    
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
                placeholder="البحث في الإجازات..."
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
              onClick={onExportLeaves}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              تصدير
            </Button>
            <Button
              onClick={onAddLeave}
              className="bg-[#58d2c8] hover:bg-[#4AB8B3] text-white flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              إضافة طلب إجازة
            </Button>
          </div>
        </div>

        {/* الفلاتر المتقدمة */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="PENDING">قيد الانتظار</option>
                  <option value="APPROVED">موافق عليها</option>
                  <option value="REJECTED">مرفوضة</option>
                  <option value="CANCELLED">ملغية</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع الإجازة</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
                >
                  <option value="all">جميع الأنواع</option>
                  <option value="ANNUAL">إجازة سنوية</option>
                  <option value="SICK">إجازة مرضية</option>
                  <option value="EMERGENCY">إجازة طارئة</option>
                  <option value="MATERNITY">إجازة أمومة</option>
                  <option value="PATERNITY">إجازة أبوة</option>
                  <option value="STUDY">إجازة دراسية</option>
                  <option value="UNPAID">إجازة بدون راتب</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">القسم</label>
                <Input
                  type="text"
                  placeholder="البحث بالقسم..."
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
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
                الموظف
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                نوع الإجازة
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                الفترة
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                عدد الأيام
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
            {filteredData.map((leave) => (
              <tr key={leave.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 rounded-full bg-[#58d2c8]/10 flex items-center justify-center">
                        <span className="text-[#58d2c8] font-medium text-xs">
                          {leave.employeeName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                    </div>
                    <div className="mr-3">
                      <div className="text-sm font-medium text-gray-900">{leave.employeeName}</div>
                      <div className="text-xs text-gray-500">{leave.department}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {getTypeBadge(leave.leaveType)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <div>{formatDate(leave.startDate)}</div>
                  <div className="text-xs text-gray-500">إلى {formatDate(leave.endDate)}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {leave.totalDays} يوم
                </td>
                <td className="px-4 py-3">
                  {getStatusBadge(leave.status)}
                </td>
                <td className="px-4 py-3 text-sm font-medium">
                  <div className="flex items-center gap-0.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewLeave(leave)}
                      className="h-6 w-6 p-0 hover:bg-blue-100"
                      title="عرض التفاصيل"
                    >
                      <Eye className="h-3 w-3 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditLeave(leave)}
                      className="h-6 w-6 p-0 hover:bg-green-100"
                      title="تعديل"
                    >
                      <Edit className="h-3 w-3 text-green-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteLeave(leave)}
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
            عرض {filteredData.length} من {data.length} طلب إجازة
          </div>
          <div className="text-sm text-gray-500">
            آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
          </div>
        </div>
      </div>
    </div>
  );
}
