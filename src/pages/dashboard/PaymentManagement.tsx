/**
 * صفحة إدارة المعاملات المالية
 */

import React, { useState, useEffect } from 'react';
import { TransactionStats } from '@/components/features/TransactionStats';
import { TransactionsTable } from '@/components/features/TransactionsTable';
import { TransactionForm } from '@/components/features/TransactionForm';
import { mockTransactionStats, mockTransactionTableData } from '@/data/financialData';
import { TransactionTableData } from '@/lib/types/financial';
import { BarChart3, TrendingUp, CreditCard, Plus } from 'lucide-react';
import * as paymentsService from '@/lib/services/payments.service';
import { useToast } from '@/hooks/use-toast';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

type ViewMode = 'list' | 'form' | 'details';

export default function PaymentManagement() {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionTableData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [payments, setPayments] = useState<TransactionTableData[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState<TransactionTableData | null>(null);

  // تحديد أن المكون تم تحميله في المتصفح
  useEffect(() => {
    setIsClient(true);
  }, []);

  // تحميل البيانات
  useEffect(() => {
    if (!isClient) return;
    loadPayments();
  }, [isClient]);

  // دالة تحميل المدفوعات
  const loadPayments = async () => {
    setIsLoading(true);
    try {
      const response = await paymentsService.getPayments();
      
      if (response.success) {
        const paymentsData = response.data.data.map((payment: any) => 
          paymentsService.transformPaymentToTableData(payment)
        );
        setPayments(paymentsData);
      } else {
        console.error('فشل في تحميل المدفوعات:', response.message);
        setPayments([]);
      }
    } catch (error) {
      console.error('خطأ في تحميل المدفوعات:', error);
      setPayments([]);
    } finally {
      setIsLoading(false);
    }
  };

  // معالجة إضافة معاملة جديدة
  const handleAddTransaction = () => {
    setSelectedTransaction(null);
    setViewMode('form');
  };

  // معالجة تعديل معاملة
  const handleEditTransaction = (transaction: TransactionTableData) => {
    setSelectedTransaction(transaction);
    setViewMode('form');
  };

  // معالجة حذف معاملة
  const handleDeleteTransaction = (transaction: TransactionTableData) => {
    setPaymentToDelete(transaction);
    setDeleteDialogOpen(true);
  };

  // تأكيد حذف المعاملة
  const confirmDeletePayment = async () => {
    if (!paymentToDelete) return;

    setIsLoading(true);
    try {
      const result = await paymentsService.deletePayment(paymentToDelete.id);
      
      if (result.success) {
        toast({
          title: "تم الحذف بنجاح",
          description: "تم حذف المعاملة بنجاح",
          variant: "success",
        });
        await loadPayments();
      } else {
        toast({
          title: "خطأ في الحذف",
          description: result.message || 'حدث خطأ في حذف المعاملة',
          variant: "error",
        });
      }
    } catch (error: any) {
      console.error('خطأ في حذف المعاملة:', error);
      toast({
        title: "خطأ في الحذف",
        description: error.response?.data?.message || 'حدث خطأ في حذف المعاملة',
        variant: "error",
      });
    } finally {
      setIsLoading(false);
      setPaymentToDelete(null);
    }
  };

  // معالجة عرض تفاصيل المعاملة
  const handleViewTransaction = (transaction: TransactionTableData) => {
    setSelectedTransaction(transaction);
    setViewMode('details');
  };

  // معالجة تصدير المعاملات
  const handleExportTransactions = () => {
    alert('سيتم تصدير جميع المعاملات المالية');
  };

  // معالجة حفظ المعاملة
  const handleSaveTransaction = async (data: any) => {
    setIsLoading(true);
    try {
      const result = selectedTransaction
        ? await paymentsService.updatePayment(selectedTransaction.id, data)
        : await paymentsService.createPayment(data);

      if (result.success) {
        toast({
          title: selectedTransaction ? "تم التحديث بنجاح" : "تم الإضافة بنجاح",
          description: selectedTransaction ? "تم تحديث المعاملة بنجاح" : "تم إضافة المعاملة بنجاح",
          variant: "success",
        });
        setViewMode('list');
        await loadPayments();
      } else {
        toast({
          title: "خطأ في الحفظ",
          description: result.message || 'حدث خطأ في حفظ المعاملة',
          variant: "error",
        });
      }
    } catch (error: any) {
      console.error('خطأ في حفظ المعاملة:', error);
      toast({
        title: "خطأ في الحفظ",
        description: error.response?.data?.message || 'حدث خطأ في حفظ المعاملة',
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // عرض النموذج
  if (viewMode === 'form') {
    return (
      <TransactionForm
        onSubmit={handleSaveTransaction}
        onCancel={() => setViewMode('list')}
        initialData={selectedTransaction}
        isLoading={isLoading}
      />
    );
  }

  // عرض التفاصيل
  if (viewMode === 'details' && selectedTransaction) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              تفاصيل المعاملة المالية
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {selectedTransaction.transactionNumber}
            </p>
          </div>
          <button
            onClick={() => setViewMode('list')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            العودة
          </button>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">
            تفاصيل المعاملة المالية ستظهر هنا مع إمكانية الطباعة والإيصالات الإلكترونية
          </p>
        </div>
      </div>
    );
  }

  // العرض الافتراضي - قائمة المعاملات المالية
  return (
    <div className="space-y-6">
      {/* أزرار الوصول السريع */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          <h2 className="text-xl font-semibold">المعاملات المالية</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddTransaction}
            className="flex items-center gap-2 bg-[#58d2c8] hover:bg-[#4bb8ad] text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            إضافة معاملة جديدة
          </button>
        </div>
      </div>

      {/* إحصائيات المعاملات المالية */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          <h2 className="text-xl font-semibold">إحصائيات المعاملات المالية</h2>
        </div>
        <TransactionStats stats={mockTransactionStats} />
      </div>

      {/* جدول المعاملات المالية */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <h2 className="text-xl font-semibold">قائمة المعاملات المالية</h2>
        </div>
        {isClient && (
          <TransactionsTable
            data={payments.length > 0 ? payments : mockTransactionTableData || []}
            onAddTransaction={handleAddTransaction}
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onViewTransaction={handleViewTransaction}
            onExportTransactions={handleExportTransactions}
          />
        )}
      </div>

      {/* نافذة تأكيد الحذف */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDeletePayment}
        title="تأكيد حذف المعاملة"
        description={`هل أنت متأكد من حذف المعاملة "${paymentToDelete?.transactionNumber}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmText="حذف"
        cancelText="إلغاء"
        variant="danger"
      />
    </div>
  );
}
