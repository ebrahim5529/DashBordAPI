/**
 * صفحة الرواتب
 */

import React, { useState } from 'react';
import { SalaryStats } from '@/components/features/SalaryStats';
import { SalariesTable } from '@/components/features/SalariesTable';
import SalaryForm from '@/components/features/SalaryForm';
import { mockSalaryStats, mockSalaryTableData } from '@/data/salariesData';
import { SalaryData } from '@/lib/types/employee';
import { DollarSign, TrendingUp } from 'lucide-react';

type ViewMode = 'list' | 'form';

export default function SalariesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedSalary, setSelectedSalary] = useState<SalaryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // معالجة إضافة راتب جديد
  const handleAddSalary = () => {
    setSelectedSalary(null);
    setViewMode('form');
  };

  // معالجة تعديل راتب
  const handleEditSalary = (salary: SalaryData) => {
    setSelectedSalary(salary);
    setViewMode('form');
  };

  // معالجة حذف راتب
  const handleDeleteSalary = async (salary: SalaryData) => {
    if (window.confirm(`هل أنت متأكد من حذف راتب "${salary.employeeName}"؟`)) {
      setIsLoading(true);
      try {
        // هنا سيتم استدعاء API لحذف الراتب
        console.log('حذف الراتب:', salary.id);
        setTimeout(() => {
          setIsLoading(false);
          alert('تم حذف الراتب بنجاح');
        }, 1000);
      } catch (error) {
        console.error('خطأ في حذف الراتب:', error);
        setIsLoading(false);
        alert('حدث خطأ في حذف الراتب');
      }
    }
  };

  // معالجة عرض تفاصيل الراتب
  const handleViewSalary = (salary: SalaryData) => {
    console.log('عرض تفاصيل الراتب:', salary.id);
    alert('سيتم إضافة نافذة تفاصيل الراتب قريباً');
  };

  // معالجة حفظ الراتب
  const handleSaveSalary = async (salary: SalaryData) => {
    setIsLoading(true);
    try {
      // هنا سيتم استدعاء API لحفظ الراتب
      console.log('حفظ الراتب:', salary);
      setTimeout(() => {
        setIsLoading(false);
        setViewMode('list');
        alert('تم حفظ الراتب بنجاح');
      }, 1000);
    } catch (error) {
      console.error('خطأ في حفظ الراتب:', error);
      setIsLoading(false);
      alert('حدث خطأ في حفظ الراتب');
    }
  };

  // معالجة إغلاق النموذج
  const handleCloseForm = () => {
    setViewMode('list');
    setSelectedSalary(null);
  };

  // معالجة تصدير قائمة الرواتب
  const handleExportSalaries = () => {
    console.log('تصدير قائمة الرواتب');
    alert('تم تصدير قائمة الرواتب بنجاح');
  };

  // عرض نموذج الراتب
  if (viewMode === 'form') {
    return (
      <SalaryForm
        salary={selectedSalary}
        onSave={handleSaveSalary}
        onCancel={handleCloseForm}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div className='space-y-6'>
      {/* إحصائيات الرواتب */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          <h2 className="text-xl font-semibold">إحصائيات الرواتب</h2>
        </div>
        <SalaryStats stats={mockSalaryStats} />
      </div>

      {/* جدول/قائمة الرواتب */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <h2 className="text-xl font-semibold">الرواتب</h2>
        </div>
        <SalariesTable
          data={mockSalaryTableData || []}
          onAddSalary={handleAddSalary}
          onEditSalary={handleEditSalary}
          onDeleteSalary={handleDeleteSalary}
          onViewSalary={handleViewSalary}
          onExportSalaries={handleExportSalaries}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
