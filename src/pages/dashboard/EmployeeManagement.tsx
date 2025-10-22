/**
 * صفحة إدارة الموظفين
 */

import React, { useState } from 'react';
import { EmployeeStats } from '@/components/features/EmployeeStats';
import { EmployeesTable } from '@/components/features/EmployeesTable';
import EmployeeForm from '@/components/features/EmployeeForm';
import EmployeeDetails from '@/components/features/EmployeeDetails';
// import { MultiFileUpload } from '@/components/features/MultiFileUpload';
import { mockEmployeeStats, mockEmployeeTableData } from '@/data/employeesData';
import { EmployeeTableData } from '@/lib/types/employee';
import { Users, TrendingUp, FileText } from 'lucide-react';

type ViewMode = 'list' | 'form' | 'details';

export default function EmployeeManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeTableData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // معالجة إضافة موظف جديد
  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setViewMode('form');
  };

  // معالجة تعديل موظف
  const handleEditEmployee = (employee: EmployeeTableData) => {
    setSelectedEmployee(employee);
    setViewMode('form');
  };

  // معالجة حذف موظف
  const handleDeleteEmployee = async (employee: EmployeeTableData) => {
    if (window.confirm(`هل أنت متأكد من حذف الموظف "${employee.name}"؟`)) {
      setIsLoading(true);
      try {
        // هنا سيتم استدعاء API لحذف الموظف
        console.log('حذف الموظف:', employee.id);
        setTimeout(() => {
          setIsLoading(false);
          alert('تم حذف الموظف بنجاح');
        }, 1000);
      } catch (error) {
        console.error('خطأ في حذف الموظف:', error);
        setIsLoading(false);
        alert('حدث خطأ في حذف الموظف');
      }
    }
  };

  // معالجة عرض تفاصيل الموظف
  const handleViewEmployee = (employee: EmployeeTableData) => {
    setSelectedEmployee(employee);
    setViewMode('details');
  };

  // معالجة حفظ الموظف
  const handleSaveEmployee = async (employee: EmployeeTableData) => {
    setIsLoading(true);
    try {
      // هنا سيتم استدعاء API لحفظ الموظف
      console.log('حفظ الموظف:', employee);
      setTimeout(() => {
        setIsLoading(false);
        setViewMode('list');
        alert('تم حفظ الموظف بنجاح');
      }, 1000);
    } catch (error) {
      console.error('خطأ في حفظ الموظف:', error);
      setIsLoading(false);
      alert('حدث خطأ في حفظ الموظف');
    }
  };

  // معالجة إغلاق النموذج
  const handleCloseForm = () => {
    setViewMode('list');
    setSelectedEmployee(null);
  };

  // معالجة إغلاق التفاصيل
  const handleCloseDetails = () => {
    setViewMode('list');
    setSelectedEmployee(null);
  };

  // معالجة طباعة بيانات الموظف
  const handlePrintEmployee = (employee: EmployeeTableData) => {
    console.log('طباعة بيانات الموظف:', employee.id);
    window.print();
  };

  // معالجة تصدير قائمة الموظفين
  const handleExportEmployees = () => {
    console.log('تصدير قائمة الموظفين');
    alert('تم تصدير قائمة الموظفين بنجاح');
  };


  // عرض نموذج الموظف
  if (viewMode === 'form') {
    return (
      <EmployeeForm
        employee={selectedEmployee}
        onSave={handleSaveEmployee}
        onCancel={handleCloseForm}
        isLoading={isLoading}
      />
    );
  }

  // عرض تفاصيل الموظف
  if (viewMode === 'details' && selectedEmployee) {
    return (
      <EmployeeDetails
        employee={selectedEmployee}
        onClose={handleCloseDetails}
        onEdit={handleEditEmployee}
        onPrint={handlePrintEmployee}
      />
    );
  }


  // العرض الافتراضي - قائمة الموظفين
  return (
    <div className='space-y-6'>
      {/* أزرار الوصول السريع */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <h2 className="text-xl font-semibold">الموظفين</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddEmployee}
            className="flex items-center gap-2 bg-[#58d2c8] hover:bg-[#4bb8ad] text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Users className="h-4 w-4" />
            إضافة موظف جديد
          </button>
          <button
            onClick={handleExportEmployees}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <FileText className="h-4 w-4" />
            تصدير البيانات
          </button>
        </div>
      </div>

      {/* إحصائيات الموظفين */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <h2 className="text-xl font-semibold">إحصائيات الموظفين</h2>
        </div>
        <EmployeeStats stats={mockEmployeeStats} />
      </div>

      {/* جدول/قائمة الموظفين */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <h2 className="text-xl font-semibold">قائمة الموظفين</h2>
        </div>
        <EmployeesTable
          data={mockEmployeeTableData || []}
          onAddEmployee={handleAddEmployee}
          onEditEmployee={handleEditEmployee}
          onDeleteEmployee={handleDeleteEmployee}
          onViewEmployee={handleViewEmployee}
          onExportEmployees={handleExportEmployees}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
