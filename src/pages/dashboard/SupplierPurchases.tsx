/**
 * صفحة مشتريات الموردين
 */

import React, { useState, useEffect, useCallback } from 'react';
import { SupplierPurchaseStats } from '@/components/features/SupplierPurchaseStats';
import { SupplierPurchasesTable } from '@/components/features/SupplierPurchasesTable';
import { PurchaseDetails } from '@/components/features/PurchaseDetails';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/shared/Pagination';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useToast } from '@/components/shared/Toast';
import {
  getSupplierPurchases,
  getSupplierPurchaseStats,
  createSupplierPurchase,
  updateSupplierPurchase,
  deleteSupplierPurchase,
  confirmPurchase,
  markPurchaseAsDelivered,
  cancelPurchase,
  transformPurchaseData
} from '@/lib/services';
import { SupplierPurchase, PurchaseQueryParams } from '@/lib/types/supplier';
import { BarChart3, TrendingUp, FileText, ShoppingCart } from 'lucide-react';

type ViewMode = 'list' | 'form' | 'details';

export default function SupplierPurchasesPage() {
  const toast = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedPurchase, setSelectedPurchase] = useState<SupplierPurchase | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [purchases, setPurchases] = useState<SupplierPurchase[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [purchaseToDelete, setPurchaseToDelete] = useState<SupplierPurchase | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [purchaseToCancel, setPurchaseToCancel] = useState<SupplierPurchase | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 15,
    total: 0,
    lastPage: 1
  });
  const [filters] = useState<PurchaseQueryParams>({
    search: '',
    supplier_id: undefined,
    status: undefined,
    sort_by: 'created_at',
    sort_order: 'desc'
  });

  // Load Purchases
  const loadPurchases = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getSupplierPurchases({
        ...filters,
        page: pagination.currentPage,
        per_page: pagination.perPage
      });
      
      if (response.success && response.data) {
        const transformedData = response.data.data.map((p: any) => transformPurchaseData(p));
        console.log('✅ Loaded purchases:', transformedData.length);
        setPurchases(transformedData);
        setPagination({
          currentPage: response.data.current_page,
          perPage: response.data.per_page,
          total: response.data.total,
          lastPage: response.data.last_page
        });
      } else {
        setPurchases([]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'فشل تحميل المشتريات');
      console.error('Error loading purchases:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination.currentPage, pagination.perPage]);

  // Load Stats
  const loadStats = useCallback(async () => {
    try {
      const response = await getSupplierPurchaseStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadPurchases();
  }, [loadPurchases]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // معالجة إضافة شراء جديد
  const handleAddPurchase = () => {
    setSelectedPurchase(null);
    setViewMode('form');
  };

  // معالجة تعديل شراء
  const handleEditPurchase = (purchase: SupplierPurchase) => {
    setSelectedPurchase(purchase);
    setViewMode('form');
  };

  // معالجة حذف شراء - فتح dialog
  const handleDeletePurchase = (purchase: SupplierPurchase) => {
    setPurchaseToDelete(purchase);
    setShowDeleteDialog(true);
  };

  // تأكيد حذف الشراء
  const confirmDeletePurchase = async () => {
    if (!purchaseToDelete) return;
    
    try {
      const response = await deleteSupplierPurchase(purchaseToDelete.id);
      if (response.success) {
        toast.success('تم حذف الشراء بنجاح');
        loadPurchases();
        loadStats();
        setPurchaseToDelete(null);
      }
    } catch (error: any) {
      console.error('خطأ في حذف الشراء:', error);
      toast.error(error.response?.data?.message || 'حدث خطأ في حذف الشراء');
    }
  };

  // معالجة تأكيد شراء
  const _handleConfirmPurchase = async (purchase: SupplierPurchase) => {
    try {
      const response = await confirmPurchase(purchase.id);
      if (response.success) {
        toast.success('تم تأكيد الشراء بنجاح');
        loadPurchases();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'فشل تأكيد الشراء');
    }
  };

  // معالجة تحديد شراء كمسلم
  const _handleMarkAsDelivered = async (purchase: SupplierPurchase, deliveryDate?: string) => {
    try {
      const response = await markPurchaseAsDelivered(purchase.id, deliveryDate);
      if (response.success) {
        toast.success('تم تحديد الشراء كمسلم بنجاح');
        loadPurchases();
        loadStats();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'فشل تحديث الشراء');
    }
  };

  // معالجة إلغاء شراء - فتح dialog
  const _handleCancelPurchase = (purchase: SupplierPurchase) => {
    setPurchaseToCancel(purchase);
    setShowCancelDialog(true);
  };

  // تأكيد إلغاء الشراء
  const confirmCancelPurchase = async () => {
    if (!purchaseToCancel) return;
    
    try {
      const response = await cancelPurchase(purchaseToCancel.id);
      if (response.success) {
        toast.info('تم إلغاء الشراء');
        loadPurchases();
        loadStats();
        setPurchaseToCancel(null);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'فشل إلغاء الشراء');
    }
  };

  // Pagination
  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, currentPage: page });
  };

  // معالجة عرض تفاصيل الشراء
  const handleViewPurchase = (purchase: SupplierPurchase) => {
    setSelectedPurchase(purchase);
    setViewMode('details');
  };

  // معالجة حفظ الشراء
  const _handleSavePurchase = async (data: any) => {
    setIsLoading(true);
    try {
      if (selectedPurchase) {
        const response = await updateSupplierPurchase(selectedPurchase.id, data);
        if (response.success) {
          toast.success('تم تحديث الشراء بنجاح');
          setViewMode('list');
          setSelectedPurchase(null);
          await loadPurchases();
          await loadStats();
        }
      } else {
        const response = await createSupplierPurchase(data);
        if (response.success) {
          toast.success('تم إضافة الشراء بنجاح');
          setViewMode('list');
          setSelectedPurchase(null);
          setPagination(prev => ({ ...prev, currentPage: 1 }));
          await loadPurchases();
          await loadStats();
        }
      }
    } catch (error: any) {
      console.error('خطأ في حفظ الشراء:', error);
      toast.error(error.response?.data?.message || 'حدث خطأ في حفظ الشراء');
    } finally {
      setIsLoading(false);
    }
  };

  // معالجة إلغاء النموذج
  const _handleCancelForm = () => {
    setViewMode('list');
    setSelectedPurchase(null);
  };

  // معالجة العودة من التفاصيل
  const handleBackFromDetails = () => {
    setViewMode('list');
    setSelectedPurchase(null);
  };

  // معالجة طباعة ملف الشراء
  const handlePrintPurchase = () => {
    window.print();
  };

  // معالجة تصدير ملف الشراء
  const handleExportPurchase = () => {
    toast.info('سيتم تصدير ملف الشراء قريباً');
  };

  // معالجة تصدير جميع المشتريات
  const _handleExportPurchases = () => {
    toast.info('سيتم تصدير جميع المشتريات قريباً');
  };

  // معالجة الانتقال لصفحة الموردين
  const handleGoToSuppliers = () => {
    window.location.href = '/dashboard/supplier-management';
  };

  // معالجة الانتقال لصفحة الفواتير
  const handleGoToInvoices = () => {
    window.location.href = '/dashboard/supplier-invoices';
  };


  // عرض النموذج
  if (viewMode === 'form') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {selectedPurchase ? 'تعديل مشتريات المورد' : 'إضافة مشتريات جديدة'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {selectedPurchase ? 'تعديل معلومات مشتريات المورد' : 'إضافة مشتريات جديدة من المورد'}
            </p>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            نموذج إضافة/تعديل مشتريات المورد سيتم تطويره قريباً
          </p>
        </div>
      </div>
    );
  }

  // عرض تفاصيل الشراء
  if (viewMode === 'details' && selectedPurchase) {
    return (
      <PurchaseDetails
        purchase={selectedPurchase}
        onEdit={() => handleEditPurchase(selectedPurchase)}
        onBack={handleBackFromDetails}
        onPrint={handlePrintPurchase}
        onExport={handleExportPurchase}
      />
    );
  }

  // العرض الافتراضي - قائمة المشتريات
  return (
    <div className="space-y-6">
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setPurchaseToDelete(null);
        }}
        onConfirm={confirmDeletePurchase}
        title="تأكيد حذف المشترى"
        message={`هل أنت متأكد من حذف المشترى "${purchaseToDelete?.purchaseNumber}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
        confirmText="حذف"
        cancelText="إلغاء"
        variant="danger"
      />

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showCancelDialog}
        onClose={() => {
          setShowCancelDialog(false);
          setPurchaseToCancel(null);
        }}
        onConfirm={confirmCancelPurchase}
        title="تأكيد إلغاء المشترى"
        message={`هل أنت متأكد من إلغاء المشترى "${purchaseToCancel?.purchaseNumber}"؟`}
        confirmText="إلغاء المشترى"
        cancelText="رجوع"
        variant="warning"
      />

      {/* أزرار الوصول السريع */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          <h2 className="text-xl font-semibold">المشتريات</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleGoToSuppliers}
            className="flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            إدارة الموردين
          </Button>
          <Button
            variant="outline"
            onClick={handleGoToInvoices}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            فواتير الموردين
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage 
          message={error} 
          onClose={() => setError(null)}
        />
      )}

      {/* إحصائيات المشتريات */}
      {stats && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <h2 className="text-xl font-semibold">إحصائيات المشتريات</h2>
          </div>
          <SupplierPurchaseStats stats={stats} />
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <LoadingSpinner text="جاري تحميل المشتريات..." />
      ) : (
        <>
          {/* جدول المشتريات */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <h2 className="text-xl font-semibold">المشتريات</h2>
            </div>
            {purchases.length > 0 ? (
              <>
                <SupplierPurchasesTable
                  data={purchases}
                  onAddPurchase={handleAddPurchase}
                  onEditPurchase={handleEditPurchase}
                  onDeletePurchase={handleDeletePurchase}
                  onViewPurchase={handleViewPurchase}
                />
                
                {/* Pagination */}
                {pagination.total > 0 && (
                  <Pagination 
                    currentPage={pagination.currentPage}
                    totalPages={pagination.lastPage}
                    total={pagination.total}
                    perPage={pagination.perPage}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">لا توجد مشتريات للعرض</p>
                <Button onClick={handleAddPurchase}>
                  إضافة مشترى جديد
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}