/**
 * صفحة العقود المنتهية الصلاحية
 */

import React, { useState } from 'react';
import { ExpiredContractsStats } from '@/components/features/ExpiredContractsStats';
import { ExpiredContractsTable } from '@/components/features/ExpiredContractsTable';
import { ExpiredContractDetails } from '@/components/features/ExpiredContractDetails';
import { mockExpiredContractsStats, mockExpiredContractsData } from '@/data/expiredContractsData';
import { ContractsTableData } from '@/lib/types/contracts';
import { FileX, TrendingDown, AlertTriangle } from 'lucide-react';

type ViewMode = 'list' | 'details';

export default function ExpiredContractsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedContract, setSelectedContract] = useState<ContractsTableData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // معالجة عرض تفاصيل العقد
  const handleViewContract = (contract: ContractsTableData) => {
    setSelectedContract(contract);
    setViewMode('details');
  };

  // معالجة تعديل العقد
  const handleEditContract = (contract: ContractsTableData) => {
    setSelectedContract(contract);
    // يمكن إضافة منطق التعديل هنا
    alert(`تعديل العقد: ${contract.contractNumber}`);
  };

  // معالجة حذف العقد
  const handleDeleteContract = async (contract: ContractsTableData) => {
    if (window.confirm(`هل أنت متأكد من حذف العقد "${contract.contractNumber}"؟`)) {
      setIsLoading(true);
      try {
        // هنا سيتم استدعاء API لحذف العقد
        console.log('حذف العقد:', contract.id);
        setTimeout(() => {
          setIsLoading(false);
          alert('تم حذف العقد بنجاح');
        }, 1000);
      } catch (error) {
        console.error('خطأ في حذف العقد:', error);
        setIsLoading(false);
        alert('حدث خطأ في حذف العقد');
      }
    }
  };

  // معالجة إضافة عقد جديد (غير متاح للعقود المنتهية)
  const handleAddContract = () => {
    alert('لا يمكن إضافة عقود جديدة في قسم العقود المنتهية الصلاحية');
  };

  // معالجة تصدير العقود
  const handleExportContracts = () => {
    console.log('تصدير العقود المنتهية الصلاحية');
    alert('تم تصدير العقود المنتهية الصلاحية بنجاح');
  };

  // معالجة العودة من التفاصيل
  const handleBackFromDetails = () => {
    setViewMode('list');
    setSelectedContract(null);
  };

  // معالجة طباعة العقد
  const handlePrintContract = () => {
    console.log('طباعة العقد:', selectedContract?.id);
    window.print();
  };

  // معالجة تصدير العقد
  const handleExportContract = () => {
    console.log('تصدير العقد:', selectedContract?.id);
    alert('تم تصدير العقد بنجاح');
  };

  // معالجة تعديل العقد من التفاصيل
  const handleEditFromDetails = () => {
    if (selectedContract) {
      handleEditContract(selectedContract);
    }
  };

  // معالجة حذف العقد من التفاصيل
  const handleDeleteFromDetails = () => {
    if (selectedContract) {
      handleDeleteContract(selectedContract);
    }
  };

  // عرض تفاصيل العقد
  if (viewMode === 'details' && selectedContract) {
    return (
      <ExpiredContractDetails
        contract={selectedContract}
        onEdit={handleEditFromDetails}
        onDelete={handleDeleteFromDetails}
        onBack={handleBackFromDetails}
        onPrint={handlePrintContract}
        onExport={handleExportContract}
      />
    );
  }

  // العرض الافتراضي - قائمة العقود المنتهية الصلاحية
  return (
    <div className="space-y-6">
      {/* العنوان الرئيسي */}
      <div className="flex items-center gap-2">
        <FileX className="h-6 w-6 text-red-600" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          العقود المنتهية
        </h1>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        عرض وإدارة العقود التي انتهت صلاحيتها مع إمكانية مراجعة المبالغ المستحقة
      </p>

      {/* تحذير العقود المنتهية */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-400">
            تحذير: عقود منتهية الصلاحية
          </h3>
        </div>
        <p className="text-red-700 dark:text-red-300 mt-2">
          هذه العقود انتهت صلاحيتها. يرجى مراجعة المبالغ المستحقة واتخاذ الإجراءات اللازمة.
        </p>
      </div>

      {/* إحصائيات العقود المنتهية الصلاحية */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5" />
          <h2 className="text-xl font-semibold">إحصائيات العقود المنتهية الصلاحية</h2>
        </div>
        <ExpiredContractsStats stats={mockExpiredContractsStats} />
      </div>

      {/* جدول العقود المنتهية الصلاحية */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileX className="h-5 w-5" />
          <h2 className="text-xl font-semibold">قائمة العقود المنتهية الصلاحية</h2>
        </div>
        <ExpiredContractsTable
          data={mockExpiredContractsData || []}
          onAddContract={handleAddContract}
          onEditContract={handleEditContract}
          onDeleteContract={handleDeleteContract}
          onViewContract={handleViewContract}
          onExportContracts={handleExportContracts}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}