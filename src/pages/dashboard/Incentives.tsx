/**
 * صفحة الحوافز
 */

import React, { useState } from 'react';
import { IncentiveStats } from '@/components/features/IncentiveStats';
import { IncentivesTable } from '@/components/features/IncentivesTable';
import IncentiveForm from '@/components/features/IncentiveForm';
import { IncentiveDetails } from '@/components/features/IncentiveDetails';
import { mockIncentiveStats, mockIncentiveTableData } from '@/data/incentivesData';
import { IncentiveData } from '@/lib/types/employee';
import { Gift, TrendingUp } from 'lucide-react';

type ViewMode = 'list' | 'form' | 'details';

export default function IncentivesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedIncentive, setSelectedIncentive] = useState<IncentiveData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // معالجة إضافة حافز جديد
  const handleAddIncentive = () => {
    setSelectedIncentive(null);
    setViewMode('form');
  };

  // معالجة تعديل حافز
  const handleEditIncentive = (incentive: IncentiveData) => {
    setSelectedIncentive(incentive);
    setViewMode('form');
  };

  // معالجة حذف حافز
  const handleDeleteIncentive = async (incentive: IncentiveData) => {
    if (window.confirm(`هل أنت متأكد من حذف حافز "${incentive.employeeName}"؟`)) {
      setIsLoading(true);
      try {
        // هنا سيتم استدعاء API لحذف الحافز
        console.log('حذف الحافز:', incentive.id);
        setTimeout(() => {
          setIsLoading(false);
          alert('تم حذف الحافز بنجاح');
        }, 1000);
      } catch (error) {
        console.error('خطأ في حذف الحافز:', error);
        setIsLoading(false);
        alert('حدث خطأ في حذف الحافز');
      }
    }
  };

  // معالجة عرض تفاصيل الحافز
  const handleViewIncentive = (incentive: IncentiveData) => {
    setSelectedIncentive(incentive);
    setViewMode('details');
  };

  // معالجة طباعة الحافز
  const handlePrintIncentive = (incentive: IncentiveData) => {
    alert(`سيتم طباعة تفاصيل الحافز: ${incentive.id}`);
  };

  // معالجة تصدير الحافز
  const handleExportIncentive = (incentive: IncentiveData) => {
    alert(`سيتم تصدير تفاصيل الحافز: ${incentive.id}`);
  };

  // معالجة العودة من التفاصيل
  const handleBackFromDetails = () => {
    setViewMode('list');
    setSelectedIncentive(null);
  };

  // معالجة حفظ الحافز
  const handleSaveIncentive = async (incentive: IncentiveData) => {
    setIsLoading(true);
    try {
      // هنا سيتم استدعاء API لحفظ الحافز
      console.log('حفظ الحافز:', incentive);
      setTimeout(() => {
        setIsLoading(false);
        setViewMode('list');
        alert('تم حفظ الحافز بنجاح');
      }, 1000);
    } catch (error) {
      console.error('خطأ في حفظ الحافز:', error);
      setIsLoading(false);
      alert('حدث خطأ في حفظ الحافز');
    }
  };

  // معالجة إغلاق النموذج
  const handleCloseForm = () => {
    setViewMode('list');
    setSelectedIncentive(null);
  };

  // معالجة تصدير قائمة الحوافز
  const handleExportIncentives = () => {
    console.log('تصدير قائمة الحوافز');
    alert('تم تصدير قائمة الحوافز بنجاح');
  };

  // عرض نموذج الحافز
  if (viewMode === 'form') {
    return (
      <IncentiveForm
        incentive={selectedIncentive}
        onSave={handleSaveIncentive}
        onCancel={handleCloseForm}
        isLoading={isLoading}
      />
    );
  }

  // عرض تفاصيل الحافز
  if (viewMode === 'details' && selectedIncentive) {
    return (
      <IncentiveDetails
        incentive={selectedIncentive}
        onBack={handleBackFromDetails}
        onEdit={handleEditIncentive}
        onDelete={handleDeleteIncentive}
        onPrint={handlePrintIncentive}
        onExport={handleExportIncentive}
      />
    );
  }

  return (
    <div className='space-y-6'>
      {/* إحصائيات الحوافز */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          <h2 className="text-xl font-semibold">إحصائيات الحوافز</h2>
        </div>
        <IncentiveStats stats={mockIncentiveStats} />
      </div>

      {/* جدول/قائمة الحوافز */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <h2 className="text-xl font-semibold">الحوافز</h2>
        </div>
        <IncentivesTable
          data={mockIncentiveTableData || []}
          onAddIncentive={handleAddIncentive}
          onEditIncentive={handleEditIncentive}
          onDeleteIncentive={handleDeleteIncentive}
          onViewIncentive={handleViewIncentive}
          onExportIncentives={handleExportIncentives}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
