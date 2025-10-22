/**
 * صفحة إدارة الفواتير
 */

import React, { useState } from 'react';
import { InvoiceStats } from '@/components/features/InvoiceStats';
import { InvoicesTable } from '@/components/features/InvoicesTable';
import { InvoiceForm } from '@/components/features/InvoiceForm';
import { InvoiceDetails } from '@/components/features/InvoiceDetails';
import { mockInvoiceStats, mockInvoiceTableData } from '@/data/financialData';
import { InvoiceTableData } from '@/lib/types/financial';
import { BarChart3, TrendingUp, FileText, Plus } from 'lucide-react';

type ViewMode = 'list' | 'form' | 'details';

export default function InvoicesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceTableData | null>(null);
  const [_isLoading, _setIsLoading] = useState(false);

  // معالجة إنشاء فاتورة جديدة
  const handleAddInvoice = () => {
    setSelectedInvoice(null);
    setViewMode('form');
  };

  // معالجة تعديل فاتورة
  const handleEditInvoice = (invoice: InvoiceTableData) => {
    setSelectedInvoice(invoice);
    setViewMode('form');
  };

  // معالجة حذف فاتورة
  const handleDeleteInvoice = async (invoice: InvoiceTableData) => {
    if (window.confirm(`هل أنت متأكد من حذف الفاتورة "${invoice.invoiceNumber}"؟`)) {
      _setIsLoading(true);
      try {
        // هنا سيتم استدعاء API لحذف الفاتورة
        console.log('حذف الفاتورة:', invoice.id);
        // إعادة تحميل البيانات
        setTimeout(() => {
          _setIsLoading(false);
          alert('تم حذف الفاتورة بنجاح');
        }, 1000);
      } catch (error) {
        console.error('خطأ في حذف الفاتورة:', error);
        _setIsLoading(false);
        alert('حدث خطأ في حذف الفاتورة');
      }
    }
  };

  // معالجة تأكيد الدفع
  const handleConfirmPayment = async (invoice: InvoiceTableData) => {
    if (window.confirm(`هل أنت متأكد من تأكيد دفع الفاتورة "${invoice.invoiceNumber}"؟`)) {
      _setIsLoading(true);
      try {
        // هنا سيتم استدعاء API لتأكيد الدفع
        console.log('تأكيد دفع الفاتورة:', invoice.id);
        setTimeout(() => {
          _setIsLoading(false);
          alert('تم تأكيد الدفع بنجاح');
        }, 1000);
      } catch (error) {
        console.error('خطأ في تأكيد الدفع:', error);
        _setIsLoading(false);
        alert('حدث خطأ في تأكيد الدفع');
      }
    }
  };

  // معالجة عرض تفاصيل الفاتورة
  const handleViewInvoice = (invoice: InvoiceTableData) => {
    setSelectedInvoice(invoice);
    setViewMode('details');
  };

  // معالجة تصدير الفواتير
  const handleExportInvoices = () => {
    alert('سيتم تصدير جميع الفواتير');
  };

  // معالجة طباعة الفاتورة
  const handlePrintInvoice = (invoice: InvoiceTableData) => {
    alert(`سيتم طباعة الفاتورة: ${invoice.invoiceNumber}`);
  };

  // معالجة إرسال الفاتورة عبر البريد
  const handleSendEmailInvoice = (invoice: InvoiceTableData) => {
    alert(`سيتم إرسال الفاتورة عبر البريد: ${invoice.invoiceNumber}`);
  };

  // معالجة تصدير الفاتورة
  const handleExportInvoice = (invoice: InvoiceTableData) => {
    alert(`سيتم تصدير الفاتورة: ${invoice.invoiceNumber}`);
  };

  // معالجة حفظ الفاتورة
  const handleSaveInvoice = async (data: any) => {
    _setIsLoading(true);
    try {
      // محاكاة حفظ الفاتورة
      new Promise(resolve => setTimeout(resolve, 2000));
      console.log('حفظ الفاتورة:', data);
      _setIsLoading(false);
      setViewMode('list');
      alert('تم إنشاء الفاتورة بنجاح');
    } catch (error) {
      console.error('خطأ في حفظ الفاتورة:', error);
      _setIsLoading(false);
      alert('حدث خطأ في حفظ الفاتورة');
    }
  };

  // عرض النموذج
  if (viewMode === 'form') {
    return (
      <InvoiceForm
        onSubmit={handleSaveInvoice}
        onCancel={() => setViewMode('list')}
        initialData={selectedInvoice}
        isLoading={_isLoading}
      />
    );
  }

  // عرض التفاصيل
  if (viewMode === 'details' && selectedInvoice) {
    return (
      <InvoiceDetails
        invoice={selectedInvoice}
        onBack={() => setViewMode('list')}
        onEdit={handleEditInvoice}
        onConfirmPayment={handleConfirmPayment}
        onExport={handleExportInvoice}
        onPrint={handlePrintInvoice}
        onSendEmail={handleSendEmailInvoice}
      />
    );
  }

  // العرض الافتراضي - قائمة الفواتير
  return (
    <div className="space-y-6">
      {/* أزرار الوصول السريع */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <h2 className="text-xl font-semibold">الفواتير</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddInvoice}
            className="flex items-center gap-2 bg-[#58d2c8] hover:bg-[#4bb8ad] text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            إنشاء فاتورة جديدة
          </button>
        </div>
      </div>

      {/* إحصائيات الفواتير */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          <h2 className="text-xl font-semibold">إحصائيات الفواتير</h2>
        </div>
        <InvoiceStats stats={mockInvoiceStats} />
      </div>

      {/* جدول الفواتير */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <h2 className="text-xl font-semibold">الفواتير</h2>
        </div>
        <InvoicesTable
          data={mockInvoiceTableData || []}
          onAddInvoice={handleAddInvoice}
          onEditInvoice={handleEditInvoice}
          onDeleteInvoice={handleDeleteInvoice}
          onViewInvoice={handleViewInvoice}
          onConfirmPayment={handleConfirmPayment}
          onExportInvoices={handleExportInvoices}
        />
      </div>
    </div>
  );
}
