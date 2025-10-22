/**
 * صفحة شراء معدات جديدة
 */

import React, { useState } from 'react';
import { EquipmentPurchaseStats } from '@/components/features/EquipmentPurchaseStats';
import { EquipmentPurchasesTable } from '@/components/features/EquipmentPurchasesTable';
import EquipmentPurchaseForm from '@/components/features/EquipmentPurchaseForm';
import { 
  mockPurchaseStats, 
  mockEquipmentPurchaseTableData 
} from '@/data/inventoryData';
import { EquipmentPurchaseTableData } from '@/lib/types/inventory';
import { 
  ShoppingCart, 
  BarChart3, 
  TrendingUp,
} from 'lucide-react';

type ViewMode = 'list' | 'form' | 'details';

export default function PurchaseEquipmentPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedPurchase, setSelectedPurchase] = useState<EquipmentPurchaseTableData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // معالجة إضافة شراء جديد
  const handleAddPurchase = () => {
    setSelectedPurchase(null);
    setViewMode('form');
  };

  // معالجة تعديل شراء
  const handleEditPurchase = (purchase: EquipmentPurchaseTableData) => {
    setSelectedPurchase(purchase);
    setViewMode('form');
  };

  // معالجة حذف شراء
  const handleDeletePurchase = async (purchase: EquipmentPurchaseTableData) => {
    if (window.confirm(`هل أنت متأكد من حذف عملية الشراء "${purchase.purchaseNumber}"؟`)) {
      setIsLoading(true);
      try {
        // هنا سيتم استدعاء API لحذف عملية الشراء
        console.log('حذف عملية الشراء:', purchase.id);
        setTimeout(() => {
          setIsLoading(false);
          alert('تم حذف عملية الشراء بنجاح');
        }, 1000);
      } catch (error) {
        console.error('خطأ في حذف عملية الشراء:', error);
        setIsLoading(false);
        alert('حدث خطأ في حذف عملية الشراء');
      }
    }
  };

  // معالجة عرض تفاصيل الشراء
  const handleViewPurchase = (purchase: EquipmentPurchaseTableData) => {
    alert(`عرض تفاصيل عملية الشراء: ${purchase.purchaseNumber}`);
  };

  // معالجة حفظ عملية الشراء
  const handleSavePurchase = async (data: any) => {
    setIsLoading(true);
    try {
      // هنا سيتم استدعاء API لحفظ عملية الشراء
      console.log('حفظ عملية الشراء:', data);
      setTimeout(() => {
        setIsLoading(false);
        setViewMode('list');
        alert(selectedPurchase ? 'تم تحديث عملية الشراء بنجاح' : 'تم إضافة عملية الشراء بنجاح');
      }, 1000);
    } catch (error) {
      console.error('خطأ في حفظ عملية الشراء:', error);
      setIsLoading(false);
      alert('حدث خطأ في حفظ عملية الشراء');
    }
  };

  // معالجة إلغاء النموذج
  const handleCancelForm = () => {
    setViewMode('list');
    setSelectedPurchase(null);
  };

  // معالجة تصدير عمليات الشراء
  const handleExportPurchases = () => {
    alert('سيتم تصدير جميع عمليات الشراء');
  };

  // عرض النموذج
  if (viewMode === 'form') {
    return (
      <EquipmentPurchaseForm
        purchase={selectedPurchase ? {
          id: selectedPurchase.id,
          purchaseNumber: selectedPurchase.purchaseNumber,
          supplier: {
            id: '1',
            name: selectedPurchase.supplierName,
            contactPerson: 'أحمد محمد',
            phone: '+96891234567',
            email: 'ahmed@example.com',
          },
          items: [],
          totalAmount: selectedPurchase.totalAmount,
          purchaseDate: selectedPurchase.purchaseDate,
          deliveryDate: selectedPurchase.deliveryDate,
          status: selectedPurchase.status,
          paymentStatus: selectedPurchase.paymentStatus,
          paidAmount: selectedPurchase.paidAmount,
          remainingAmount: selectedPurchase.remainingAmount,
          invoiceNumber: selectedPurchase.invoiceNumber,
          notes: selectedPurchase.notes,
          attachments: [],
          createdAt: selectedPurchase.createdAt,
          updatedAt: selectedPurchase.updatedAt,
        } : undefined}
        onSubmit={handleSavePurchase}
        onCancel={handleCancelForm}
        isLoading={isLoading}
      />
    );
  }

  // العرض الافتراضي - قائمة عمليات الشراء
  return (
    <div className="space-y-6">
      {/* أزرار الوصول السريع */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          <h2 className="text-xl font-semibold">شراء المعدات</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.location.href = '/dashboard/inventory-status'}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <BarChart3 className="h-4 w-4" />
            حالة المخزون
          </button>
        </div>
      </div>

      {/* إحصائيات المشتريات */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          <h2 className="text-xl font-semibold">إحصائيات المشتريات</h2>
        </div>
        <EquipmentPurchaseStats stats={mockPurchaseStats} />
      </div>

      {/* جدول عمليات الشراء */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <h2 className="text-xl font-semibold">عمليات الشراء</h2>
        </div>
        <EquipmentPurchasesTable
          data={mockEquipmentPurchaseTableData || []}
          onAddPurchase={handleAddPurchase}
          onEditPurchase={handleEditPurchase}
          onDeletePurchase={handleDeletePurchase}
          onViewPurchase={handleViewPurchase}
          onExportPurchases={handleExportPurchases}
        />
      </div>
    </div>
  );
}
