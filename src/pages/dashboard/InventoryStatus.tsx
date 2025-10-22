/**
 * صفحة حالة المخزون
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { InventoryStats } from '@/components/features/InventoryStats';
import { ScaffoldsTable } from '@/components/features/ScaffoldsTable';
import SimpleScaffoldForm from '@/components/features/SimpleScaffoldForm';
import { ScaffoldDetails } from '@/components/features/ScaffoldDetails';
import { mockInventoryStats, mockScaffoldTableData } from '@/data/inventoryData';
import { ScaffoldTableData, Scaffold } from '@/lib/types/inventory';
import { BarChart3, TrendingUp, Package, Plus } from 'lucide-react';
import * as scaffoldsService from '@/lib/services/scaffolds.service';
import { useToast } from '@/hooks/use-toast';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

type ViewMode = 'list' | 'form' | 'details';

export default function InventoryStatus() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedScaffold, setSelectedScaffold] = useState<ScaffoldTableData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scaffolds, setScaffolds] = useState<ScaffoldTableData[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scaffoldToDelete, setScaffoldToDelete] = useState<ScaffoldTableData | null>(null);

  // تحديد أن المكون تم تحميله في المتصفح
  useEffect(() => {
    setIsClient(true);
  }, []);

  // تحميل البيانات
  useEffect(() => {
    if (!isClient) return;
    loadScaffolds();
  }, [isClient]);

  // دالة تحميل السقالات
  const loadScaffolds = async () => {
    setIsLoading(true);
    try {
      const response = await scaffoldsService.getScaffolds();
      
      if (response.success) {
        const scaffoldsData = response.data.data.map((scaffold: any) => 
          scaffoldsService.transformScaffoldToTableData(scaffold)
        );
        setScaffolds(scaffoldsData as any);
      } else {
        console.error('فشل في تحميل السقالات:', response.message);
        setScaffolds([]);
      }
    } catch (error) {
      console.error('خطأ في تحميل السقالات:', error);
      setScaffolds([]);
    } finally {
      setIsLoading(false);
    }
  };

  // قراءة معامل mode من URL
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'form') {
      setViewMode('form');
      setSelectedScaffold(null);
    }
  }, [searchParams]);

  // معالجة إضافة معدة جديد
  const handleAddScaffold = () => {
    setSelectedScaffold(null);
    setViewMode('form');
  };

  // معالجة تعديل المعدة
  const handleEditScaffold = (scaffold: ScaffoldTableData) => {
    setSelectedScaffold(scaffold);
    setViewMode('form');
  };

  // معالجة حذف المعدة
  const handleDeleteScaffold = (scaffold: ScaffoldTableData) => {
    setScaffoldToDelete(scaffold);
    setDeleteDialogOpen(true);
  };

  // تأكيد حذف السقالة
  const confirmDeleteScaffold = async () => {
    if (!scaffoldToDelete) return;

    setIsLoading(true);
    try {
      const result = await scaffoldsService.deleteScaffold(scaffoldToDelete.id);
      
      if (result.success) {
        toast({
          title: "تم الحذف بنجاح",
          description: "تم حذف السقالة بنجاح",
          variant: "success",
        });
        await loadScaffolds();
      } else {
        toast({
          title: "خطأ في الحذف",
          description: result.message || 'حدث خطأ في حذف السقالة',
          variant: "error",
        });
      }
    } catch (error: any) {
      console.error('خطأ في حذف السقالة:', error);
      toast({
        title: "خطأ في الحذف",
        description: error.response?.data?.message || 'حدث خطأ في حذف السقالة',
        variant: "error",
      });
    } finally {
      setIsLoading(false);
      setScaffoldToDelete(null);
    }
  };

  // معالجة عرض تفاصيل المعدة
  const handleViewScaffold = (scaffold: ScaffoldTableData) => {
    setSelectedScaffold(scaffold);
    setViewMode('details');
  };

  // معالجة حفظ المعدة
  const handleSaveScaffold = async (data: any) => {
    setIsLoading(true);
    try {
      // هنا سيتم استدعاء API لحفظ المعدة
      console.log('حفظ المعدة:', data);
      // إعادة تحميل البيانات
      setTimeout(() => {
        setIsLoading(false);
        setViewMode('list');
        alert(selectedScaffold ? 'تم تحديث المعدة بنجاح' : 'تم إضافة المعدة بنجاح');
      }, 1000);
    } catch (error) {
      console.error('خطأ في حفظ المعدة:', error);
      setIsLoading(false);
      alert('حدث خطأ في حفظ المعدة');
    }
  };

  // معالجة إلغاء النموذج
  const handleCancelForm = () => {
    setViewMode('list');
    setSelectedScaffold(null);
  };

  // معالجة العودة من التفاصيل
  const handleBackFromDetails = () => {
    setViewMode('list');
    setSelectedScaffold(null);
  };

  // معالجة طباعة ملف المعدة
  const handlePrintScaffold = () => {
    window.print();
  };

  // معالجة تصدير ملف المعدة
  const handleExportScaffold = () => {
    alert('سيتم تصدير ملف المعدة');
  };

  // معالجة تصدير جميع المعدات
  const handleExportScaffolds = () => {
    alert('سيتم تصدير جميع المعدات');
  };

  // إنشاء بيانات المعدة التفصيلية للعرض
  const createScaffoldDetails = (scaffold: ScaffoldTableData): Scaffold => {
    return {
      id: scaffold.id,
      scaffoldNumber: scaffold.scaffoldNumber,
      type: scaffold.type,
      size: { height: 3, width: 2, length: 1 }, // قيم افتراضية
      material: scaffold.material,
      condition: scaffold.condition,
      status: scaffold.status,
      quantity: scaffold.quantity,
      availableQuantity: scaffold.availableQuantity,
      location: scaffold.location,
      warehouseLocation: 'المنطقة أ - الرف 1',
      sellingPrice: scaffold.sellingPrice,
      dailyRentalPrice: scaffold.dailyRentalPrice,
      monthlyRentalPrice: scaffold.monthlyRentalPrice,
      entryDate: scaffold.entryDate,
      lastMaintenanceDate: scaffold.lastMaintenanceDate,
      nextMaintenanceDate: scaffold.nextMaintenanceDate,
      images: scaffold.hasImages ? ['scaffold-1.jpg', 'scaffold-2.jpg'] : [],
      attachments: scaffold.hasAttachments ? ['manual.pdf', 'certificate.pdf'] : [],
      notes: scaffold.notes,
      supplier: scaffold.supplierName ? { id: '1', name: scaffold.supplierName } : undefined,
      createdAt: scaffold.createdAt,
      updatedAt: scaffold.updatedAt,
    };
  };

  // عرض النموذج
  if (viewMode === 'form') {
    return (
      <SimpleScaffoldForm
        onSubmit={handleSaveScaffold}
        onCancel={handleCancelForm}
        isLoading={isLoading}
      />
    );
  }

  // عرض تفاصيل المعدة
  if (viewMode === 'details' && selectedScaffold) {
    return (
      <ScaffoldDetails
        scaffold={createScaffoldDetails(selectedScaffold)}
        onEdit={() => handleEditScaffold(selectedScaffold)}
        onBack={handleBackFromDetails}
        onPrint={handlePrintScaffold}
        onExport={handleExportScaffold}
      />
    );
  }

  // العرض الافتراضي - قائمة السقالات
  return (
    <div className="space-y-6">

      {/* أزرار الوصول السريع */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          <h2 className="text-xl font-semibold">المخزون</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddScaffold}
            className="flex items-center gap-2 bg-[#913D95] hover:bg-[#7A2F7D] text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            إضافة معدة جديد
          </button>
        </div>
      </div>

      {/* إحصائيات المخزون */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          <h2 className="text-xl font-semibold">إحصائيات المخزون</h2>
        </div>
        <InventoryStats stats={mockInventoryStats} />
      </div>

      {/* جدول السقالات */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <h2 className="text-xl font-semibold">السقالات</h2>
        </div>
        {isClient && (
          <ScaffoldsTable
            data={scaffolds.length > 0 ? scaffolds : mockScaffoldTableData || []}
            onAddScaffold={handleAddScaffold}
            onEditScaffold={handleEditScaffold}
            onDeleteScaffold={handleDeleteScaffold}
            onViewScaffold={handleViewScaffold}
            onExportScaffolds={handleExportScaffolds}
          />
        )}
      </div>

      {/* نافذة تأكيد الحذف */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDeleteScaffold}
        title="تأكيد حذف السقالة"
        description={`هل أنت متأكد من حذف السقالة "${scaffoldToDelete?.scaffoldNumber}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmText="حذف"
        cancelText="إلغاء"
        variant="danger"
      />
    </div>
  );
}