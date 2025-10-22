import React, { useState } from 'react';
import { Building2, BarChart3 } from 'lucide-react';
import { DepartmentsStats } from '@/components/features/DepartmentsStats';
import { DepartmentsTable } from '@/components/features/DepartmentsTable';
import DepartmentForm from '@/components/features/DepartmentForm';
import DepartmentDetails from '@/components/features/DepartmentDetails';
import { DepartmentTableData } from '@/lib/types/departments';
import { mockDepartmentStats, mockDepartmentTableData } from '@/data/departmentsData';

type ViewMode = 'list' | 'form' | 'details';

export default function DepartmentsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentTableData | null>(null);
  const [_isLoading, setIsLoading] = useState(false);

  // معالجة إضافة قسم جديد
  const handleAddDepartment = () => {
    setSelectedDepartment(null);
    setViewMode('form');
  };

  // معالجة تعديل قسم
  const handleEditDepartment = (department: DepartmentTableData) => {
    setSelectedDepartment(department);
    setViewMode('form');
  };

  // معالجة حذف قسم
  const handleDeleteDepartment = async (department: DepartmentTableData) => {
    if (window.confirm(`هل أنت متأكد من حذف قسم "${department.name}"؟`)) {
      setIsLoading(true);
      try {
        // منطق الحذف
        setTimeout(() => {
          setIsLoading(false);
          alert('تم حذف القسم بنجاح');
        }, 1000);
      } catch (error) {
        console.error('خطأ في الحذف:', error);
        setIsLoading(false);
        alert('حدث خطأ في الحذف');
      }
    }
  };

  // معالجة عرض تفاصيل القسم
  const handleViewDepartment = (department: DepartmentTableData) => {
    setSelectedDepartment(department);
    setViewMode('details');
  };

  // معالجة تصدير الأقسام
  const handleExportDepartments = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('تم تصدير بيانات الأقسام بنجاح');
    }, 1000);
  };

  // معالجة العودة للقائمة
  const handleBackToList = () => {
    setViewMode('list');
    setSelectedDepartment(null);
  };

  // معالجة حفظ النموذج
  const handleSaveDepartment = async (_formData: any) => {
    setIsLoading(true);
    try {
      // منطق الحفظ
      setTimeout(() => {
        setIsLoading(false);
        alert(selectedDepartment ? 'تم تحديث القسم بنجاح' : 'تم إضافة القسم بنجاح');
        setViewMode('list');
        setSelectedDepartment(null);
      }, 1000);
    } catch (error) {
      console.error('خطأ في الحفظ:', error);
      setIsLoading(false);
      alert('حدث خطأ في الحفظ');
    }
  };

  // عرض النموذج
  if (viewMode === 'form') {
    return (
      <div className="space-y-6">
        <DepartmentForm
          department={selectedDepartment}
          onSave={handleSaveDepartment}
          onCancel={handleBackToList}
          isLoading={_isLoading}
        />
      </div>
    );
  }

  // عرض التفاصيل
  if (viewMode === 'details' && selectedDepartment) {
    return (
      <div className="space-y-6">
        <DepartmentDetails
          department={selectedDepartment}
          onEdit={() => handleEditDepartment(selectedDepartment)}
          onDelete={() => handleDeleteDepartment(selectedDepartment)}
          onBack={handleBackToList}
          isLoading={_isLoading}
        />
      </div>
    );
  }

  // العرض الافتراضي - قائمة الأقسام
  return (
    <div className="space-y-6">
      {/* عنوان الصفحة */}
      <div className="flex items-center gap-2">
        <Building2 className="h-5 w-5" />
        <h1 className="text-xl font-semibold">الأقسام</h1>
      </div>

      {/* إحصائيات الأقسام */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          <h2 className="text-xl font-semibold">إحصائيات الأقسام</h2>
        </div>
        <DepartmentsStats stats={mockDepartmentStats} />
      </div>

      {/* جدول الأقسام */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          <h2 className="text-xl font-semibold">الأقسام</h2>
        </div>
        <DepartmentsTable
          data={mockDepartmentTableData || []}
          onAddDepartment={handleAddDepartment}
          onEditDepartment={handleEditDepartment}
          onDeleteDepartment={handleDeleteDepartment}
          onViewDepartment={handleViewDepartment}
          onExportDepartments={handleExportDepartments}
        />
      </div>
    </div>
  );
}
