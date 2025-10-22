/**
 * صفحة إدارة الموردين
 */

import React, { useState, useEffect, useCallback } from 'react';
import { SupplierStats } from '@/components/features/SupplierStats';
import { SuppliersTable } from '@/components/features/SuppliersTable';
import SupplierForm from '@/components/features/SupplierForm';
import { SupplierDetails } from '@/components/features/SupplierDetails';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/shared/Pagination';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useToast } from '@/components/shared/Toast';
import { 
  getSuppliers, 
  getSupplierStats, 
  createSupplier, 
  updateSupplier, 
  deleteSupplier,
  activateSupplier,
  deactivateSupplier,
  suspendSupplier,
  transformSupplierToTableData
} from '@/lib/services';
import { SupplierTableData, SupplierDetails as SupplierDetailsType, SupplierQueryParams } from '@/lib/types/supplier';
import { BarChart3, TrendingUp, FileText, ShoppingCart } from 'lucide-react';

type ViewMode = 'list' | 'form' | 'details';

export default function SupplierManagementPage() {
  const toast = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierTableData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<SupplierTableData[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<SupplierTableData | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 15,
    total: 0,
    lastPage: 1
  });
  const [filters] = useState<SupplierQueryParams>({
    search: '',
    supplier_type: undefined,
    status: undefined,
    sort_by: 'created_at',
    sort_order: 'desc'
  });

  // Load Suppliers
  const loadSuppliers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getSuppliers({
        ...filters,
        page: pagination.currentPage,
        per_page: pagination.perPage
      });
      
      if (response.success && response.data) {
        const transformedData = response.data.data.map((s: any) => transformSupplierToTableData(s));
        console.log('✅ Loaded suppliers:', transformedData.length);
        setSuppliers(transformedData);
        setPagination({
          currentPage: response.data.current_page,
          perPage: response.data.per_page,
          total: response.data.total,
          lastPage: response.data.last_page
        });
      } else {
        console.warn('⚠️ No data in response');
        setSuppliers([]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'فشل تحميل الموردين');
      console.error('Error loading suppliers:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination.currentPage, pagination.perPage]);

  // Load Stats
  const loadStats = useCallback(async () => {
    try {
      const response = await getSupplierStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  }, []);

  // Load data on mount and when page changes
  useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  // Load stats on mount only
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // معالجة إضافة مورد جديد
  const handleAddSupplier = () => {
    setSelectedSupplier(null);
    setViewMode('form');
  };

  // معالجة تعديل مورد
  const handleEditSupplier = (supplier: SupplierTableData) => {
    setSelectedSupplier(supplier);
    setViewMode('form');
  };

  // معالجة حذف مورد - فتح الـ dialog
  const handleDeleteSupplier = (supplier: SupplierTableData) => {
    setSupplierToDelete(supplier);
    setShowDeleteDialog(true);
  };

  // تأكيد الحذف
  const confirmDelete = async () => {
    if (!supplierToDelete) return;
    
    try {
      const response = await deleteSupplier(supplierToDelete.id);
      if (response.success) {
        toast.success('تم حذف المورد بنجاح');
        loadSuppliers();
        loadStats();
        setSupplierToDelete(null);
      }
    } catch (error: any) {
      console.error('خطأ في حذف المورد:', error);
      toast.error(error.response?.data?.message || 'حدث خطأ في حذف المورد');
    }
  };

  // معالجة عرض تفاصيل المورد
  const handleViewSupplier = (supplier: SupplierTableData) => {
    setSelectedSupplier(supplier);
    setViewMode('details');
  };

  // معالجة حفظ المورد
  const handleSaveSupplier = async (data: any) => {
    setIsLoading(true);
    try {
      if (selectedSupplier) {
        const response = await updateSupplier(selectedSupplier.id, data);
        if (response.success) {
          toast.success('تم تحديث المورد بنجاح');
          setViewMode('list');
          setSelectedSupplier(null);
          await loadSuppliers();
          await loadStats();
        }
      } else {
        const response = await createSupplier(data);
        console.log('✅ Create response:', response);
        if (response.success) {
          toast.success('تم إضافة المورد بنجاح');
          setViewMode('list');
          setSelectedSupplier(null);
          // Reset to page 1 and force reload
          setPagination(prev => ({ ...prev, currentPage: 1 }));
          await loadSuppliers();
          await loadStats();
        }
      }
    } catch (error: any) {
      console.error('خطأ في حفظ المورد:', error);
      toast.error(error.response?.data?.message || 'حدث خطأ في حفظ المورد');
    } finally {
      setIsLoading(false);
    }
  };

  // Status Operations (متاحة للاستخدام المستقبلي)
  const _handleActivate = async (supplier: SupplierTableData) => {
    try {
      await activateSupplier(supplier.id);
      toast.success('تم تفعيل المورد بنجاح');
      loadSuppliers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'فشل تفعيل المورد');
    }
  };

  const _handleDeactivate = async (supplier: SupplierTableData) => {
    try {
      await deactivateSupplier(supplier.id);
      toast.success('تم إلغاء تفعيل المورد بنجاح');
      loadSuppliers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'فشل إلغاء تفعيل المورد');
    }
  };

  const _handleSuspend = async (supplier: SupplierTableData) => {
    try {
      await suspendSupplier(supplier.id);
      toast.success('تم تعليق المورد بنجاح');
      loadSuppliers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'فشل تعليق المورد');
    }
  };

  // Pagination
  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, currentPage: page });
  };

  // معالجة إلغاء النموذج
  const handleCancelForm = () => {
    setViewMode('list');
    setSelectedSupplier(null);
  };

  // معالجة العودة من التفاصيل
  const handleBackFromDetails = () => {
    setViewMode('list');
    setSelectedSupplier(null);
  };

  // معالجة طباعة ملف المورد
  const handlePrintSupplier = () => {
    window.print();
  };

  // معالجة تصدير ملف المورد
  const handleExportSupplier = () => {
    toast.info('سيتم تصدير ملف المورد قريباً');
  };

  // معالجة تصدير جميع الموردين
  const handleExportSuppliers = () => {
    toast.info('سيتم تصدير جميع الموردين قريباً');
  };

  // معالجة الانتقال لصفحة الفواتير
  const handleGoToInvoices = () => {
    window.location.href = '/dashboard/supplier-invoices';
  };

  // معالجة الانتقال لصفحة المشتريات
  const handleGoToPurchases = () => {
    window.location.href = '/dashboard/supplier-purchases';
  };

  // إنشاء بيانات المورد التفصيلية للعرض
  const createSupplierDetails = (supplier: SupplierTableData): SupplierDetailsType => {
    return {
      id: supplier.id,
      supplierNumber: supplier.supplierNumber,
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: '',
      nationality: supplier.nationality,
      supplierType: supplier.supplierType,
      commercialRecord: supplier.idNumber,
      taxNumber: supplier.idNumber,
      status: supplier.status,
      registrationDate: supplier.registrationDate,
      contactPerson: '',
      contactPersonPhone: '',
      contactPersonEmail: '',
      bankName: '',
      bankAccount: '',
      iban: '',
      swiftCode: '',
      notes: '',
      warnings: supplier.hasWarnings ? 'يوجد تحذيرات خاصة' : '',
      rating: supplier.rating,
      createdAt: new Date(),
      updatedAt: new Date(),
      invoicesSummary: {
        total: supplier.invoicesCount,
        pending: Math.floor(supplier.invoicesCount * 0.3),
        paid: Math.floor(supplier.invoicesCount * 0.6),
        overdue: Math.floor(supplier.invoicesCount * 0.1),
        totalAmount: supplier.totalInvoices,
      },
      purchasesSummary: {
        total: supplier.purchasesCount,
        pending: Math.floor(supplier.purchasesCount * 0.2),
        confirmed: Math.floor(supplier.purchasesCount * 0.3),
        delivered: Math.floor(supplier.purchasesCount * 0.5),
        totalAmount: supplier.totalPurchases,
      },
      recentActivity: [
        {
          id: '1',
          action: 'تسجيل دخول',
          description: 'تم تسجيل دخول المورد إلى النظام',
          entityType: 'supplier',
          entityId: supplier.id,
          createdAt: new Date(),
          user: { id: '1', email: 'admin@example.com', name: 'المدير', role: 'ADMIN', createdAt: new Date(), updatedAt: new Date() },
        },
        {
          id: '2',
          action: 'تحديث البيانات',
          description: 'تم تحديث معلومات المورد',
          entityType: 'supplier',
          entityId: supplier.id,
          createdAt: new Date(Date.now() - 86400000),
          user: { id: '1', email: 'admin@example.com', name: 'المدير', role: 'ADMIN', createdAt: new Date(), updatedAt: new Date() },
        },
      ],
      attachments: [],
    };
  };

  // عرض النموذج
  if (viewMode === 'form') {
    return (
      <SupplierForm
        supplier={selectedSupplier ? {
          id: selectedSupplier.id,
          supplierNumber: selectedSupplier.supplierNumber,
          name: selectedSupplier.name,
          email: selectedSupplier.email,
          phone: selectedSupplier.phone,
          address: '',
          nationality: selectedSupplier.nationality,
          supplierType: selectedSupplier.supplierType,
          commercialRecord: selectedSupplier.idNumber,
          taxNumber: '',
          status: selectedSupplier.status,
          registrationDate: selectedSupplier.registrationDate,
          contactPerson: '',
          contactPersonPhone: '',
          contactPersonEmail: '',
          bankName: '',
          bankAccount: '',
          iban: '',
          swiftCode: '',
          notes: '',
          rating: selectedSupplier.rating,
          createdAt: new Date(),
          updatedAt: new Date(),
        } : undefined}
        onSubmit={handleSaveSupplier}
        onCancel={handleCancelForm}
        isLoading={isLoading}
      />
    );
  }

  // عرض تفاصيل المورد
  if (viewMode === 'details' && selectedSupplier) {
    return (
      <SupplierDetails
        supplier={createSupplierDetails(selectedSupplier)}
        onEdit={() => handleEditSupplier(selectedSupplier)}
        onBack={handleBackFromDetails}
        onPrint={handlePrintSupplier}
        onExport={handleExportSupplier}
      />
    );
  }

  // العرض الافتراضي - قائمة الموردين
  return (
    <div className="space-y-6">
      {/* أزرار الوصول السريع */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          <h2 className="text-xl font-semibold">الموردين</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleGoToInvoices}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            فواتير الموردين
          </Button>
          <Button
            variant="outline"
            onClick={handleGoToPurchases}
            className="flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            مشتريات الموردين
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setSupplierToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="تأكيد حذف المورد"
        message={`هل أنت متأكد من حذف المورد "${supplierToDelete?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
        confirmText="حذف"
        cancelText="إلغاء"
        variant="danger"
      />

      {/* Error Message */}
      {error && (
        <ErrorMessage 
          message={error} 
          onClose={() => setError(null)}
        />
      )}

      {/* إحصائيات الموردين */}
      {stats && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <h2 className="text-xl font-semibold">إحصائيات الموردين</h2>
          </div>
          <SupplierStats stats={stats} />
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <LoadingSpinner text="جاري تحميل الموردين..." />
      ) : (
        <>
          {/* جدول الموردين */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <h2 className="text-xl font-semibold">قائمة الموردين</h2>
            </div>
            {suppliers.length > 0 ? (
              <>
                <SuppliersTable
                  data={suppliers}
                  onAddSupplier={handleAddSupplier}
                  onEditSupplier={handleEditSupplier}
                  onDeleteSupplier={handleDeleteSupplier}
                  onViewSupplier={handleViewSupplier}
                  onExportSuppliers={handleExportSuppliers}
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
                <p className="text-gray-500">لا توجد بيانات لعرضها</p>
                <Button onClick={handleAddSupplier} className="mt-4">
                  إضافة مورد جديد
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}