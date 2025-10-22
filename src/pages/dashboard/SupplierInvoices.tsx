/**
 * صفحة فواتير الموردين
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Pagination } from '@/components/shared/Pagination';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useToast } from '@/components/shared/Toast';
import { SupplierInvoiceForm } from '@/components/features/SupplierInvoiceForm';
import { InvoiceDetails } from '@/components/features/InvoiceDetails';
import {
  getSupplierInvoices,
  getSupplierInvoiceStats,
  createSupplierInvoice,
  updateSupplierInvoice,
  deleteSupplierInvoice,
  markInvoiceAsPaid,
  markInvoiceAsOverdue,
  cancelInvoice,
  transformInvoiceData
} from '@/lib/services';
import { InvoiceStatus, SupplierInvoice, InvoiceQueryParams } from '@/lib/types/supplier';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  User,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function SupplierInvoicesPage() {
  const toast = useToast();
  const [invoices, setInvoices] = useState<SupplierInvoice[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | ''>('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<SupplierInvoice | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'form' | 'details'>('list');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<any>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [invoiceToCancel, setInvoiceToCancel] = useState<any>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 15,
    total: 0,
    lastPage: 1
  });
  const [filters] = useState<InvoiceQueryParams>({
    search: '',
    supplier_id: undefined,
    status: undefined,
    sort_by: 'created_at',
    sort_order: 'desc'
  });

  // Load Invoices
  const loadInvoices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('🔄 Loading invoices...');
      const response = await getSupplierInvoices({
        ...filters,
        search: searchTerm,
        status: statusFilter || undefined,
        page: pagination.currentPage,
        per_page: pagination.perPage
      });
      
      console.log('📦 API Response:', response);
      
      if (response.success && response.data) {
        const transformedData = response.data.data.map((inv: any) => {
          console.log('🔄 Transforming invoice:', inv);
          return transformInvoiceData(inv);
        });
        console.log('✅ Loaded invoices:', transformedData.length);
        setInvoices(transformedData);
        setPagination({
          currentPage: response.data.current_page,
          perPage: response.data.per_page,
          total: response.data.total,
          lastPage: response.data.last_page
        });
      } else {
        console.warn('⚠️ No data in response');
        setInvoices([]);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'فشل تحميل الفواتير';
      setError(errorMsg);
      console.error('❌ Error loading invoices:', err);
      console.error('❌ Error response:', err.response);
    } finally {
      setIsLoading(false);
    }
  }, [filters, searchTerm, statusFilter, pagination.currentPage, pagination.perPage]);

  // Load Stats
  const loadStats = useCallback(async () => {
    try {
      const response = await getSupplierInvoiceStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // معالجة إضافة فاتورة جديدة
  const handleAddInvoice = () => {
    setSelectedInvoice(null);
    setViewMode('form');
  };

  // معالجة حفظ الفاتورة
  const handleSaveInvoice = async (data: any) => {
    setIsLoading(true);
    try {
      if (selectedInvoice) {
        const response = await updateSupplierInvoice(selectedInvoice.id, data);
        if (response.success) {
          toast.success('تم تحديث الفاتورة بنجاح');
          setViewMode('list');
          setSelectedInvoice(null);
          await loadInvoices();
          await loadStats();
        }
      } else {
        const response = await createSupplierInvoice(data);
        if (response.success) {
          toast.success('تم إضافة الفاتورة بنجاح');
          setViewMode('list');
          setSelectedInvoice(null);
          setPagination(prev => ({ ...prev, currentPage: 1 }));
          await loadInvoices();
          await loadStats();
        }
      }
    } catch (error: any) {
      console.error('خطأ في حفظ الفاتورة:', error);
      toast.error(error.response?.data?.message || 'حدث خطأ في حفظ الفاتورة');
    } finally {
      setIsLoading(false);
    }
  };

  // معالجة إلغاء النموذج
  const handleCancelForm = () => {
    setViewMode('list');
    setSelectedInvoice(null);
  };

  // معالجة عرض تفاصيل الفاتورة
  const handleViewInvoice = (invoice: SupplierInvoice) => {
    setSelectedInvoice(invoice);
    setViewMode('details');
  };

  // معالجة تعديل الفاتورة
  const handleEditInvoice = (invoice: SupplierInvoice) => {
    setSelectedInvoice(invoice);
    setViewMode('form');
  };

  // معالجة العودة من التفاصيل
  const handleBackFromDetails = () => {
    setViewMode('list');
    setSelectedInvoice(null);
  };

  // معالجة طباعة الفاتورة
  const handlePrintInvoice = () => {
    window.print();
  };

  // معالجة تصدير الفاتورة
  const handleExportInvoice = () => {
    toast.info('سيتم تصدير الفاتورة قريباً');
  };

  // معالجة تصدير الفواتير
  const handleExportInvoices = () => {
    toast.info('سيتم تصدير جميع الفواتير قريباً');
  };

  // معالجة حذف الفاتورة - فتح dialog
  const handleDeleteInvoice = (invoice: any) => {
    setInvoiceToDelete(invoice);
    setShowDeleteDialog(true);
  };

  // تأكيد حذف الفاتورة
  const confirmDeleteInvoice = async () => {
    if (!invoiceToDelete) return;
    
    try {
      const response = await deleteSupplierInvoice(invoiceToDelete.id);
      if (response.success) {
        toast.success('تم حذف الفاتورة بنجاح');
        loadInvoices();
        loadStats();
        setInvoiceToDelete(null);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'حدث خطأ في حذف الفاتورة');
    }
  };

  // معالجة تحديد فاتورة كمدفوعة
  const _handleMarkAsPaid = async (invoice: any, paymentData: any) => {
    try {
      const response = await markInvoiceAsPaid(invoice.id, paymentData);
      if (response.success) {
        toast.success('تم تحديد الفاتورة كمدفوعة');
        loadInvoices();
        loadStats();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'فشل تحديث الفاتورة');
    }
  };

  // معالجة تحديد فاتورة كمتأخرة  
  const _handleMarkAsOverdue = async (invoice: any) => {
    try {
      const response = await markInvoiceAsOverdue(invoice.id);
      if (response.success) {
        toast.warning('تم تحديد الفاتورة كمتأخرة');
        loadInvoices();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'فشل تحديث الفاتورة');
    }
  };

  // معالجة إلغاء فاتورة - فتح dialog
  const _handleCancelInvoice = (invoice: any) => {
    setInvoiceToCancel(invoice);
    setShowCancelDialog(true);
  };

  // تأكيد إلغاء الفاتورة
  const confirmCancelInvoice = async () => {
    if (!invoiceToCancel) return;
    
    try {
      const response = await cancelInvoice(invoiceToCancel.id);
      if (response.success) {
        toast.info('تم إلغاء الفاتورة');
        loadInvoices();
        loadStats();
        setInvoiceToCancel(null);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'فشل إلغاء الفاتورة');
    }
  };

  // Pagination
  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, currentPage: page });
  };

  // تحديد لون الحالة
  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'PARTIAL':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // تحديد نص الحالة
  const getStatusText = (status: InvoiceStatus) => {
    switch (status) {
      case 'PAID':
        return 'مدفوعة';
      case 'PENDING':
        return 'في الانتظار';
      case 'PARTIAL':
        return 'جزئية';
      case 'OVERDUE':
        return 'متأخرة';
      case 'CANCELLED':
        return 'ملغاة';
      default:
        return status;
    }
  };

  // تحديد أيقونة الحالة
  const getStatusIcon = (status: InvoiceStatus) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle className="h-4 w-4" />;
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      case 'PARTIAL':
        return <DollarSign className="h-4 w-4" />;
      case 'OVERDUE':
        return <AlertTriangle className="h-4 w-4" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };



  // تحويل SupplierInvoice إلى InvoiceTableData
  const convertToInvoiceTableData = (supplierInvoice: SupplierInvoice | null) => {
    if (!supplierInvoice) return null;
    
    // تحويل الحالة من supplier InvoiceStatus إلى financial InvoiceStatus
    const convertStatus = (status: any): 'PAID' | 'UNPAID' | 'PENDING' | 'OVERDUE' => {
      switch (status) {
        case 'PAID':
          return 'PAID';
        case 'PENDING':
          return 'PENDING';
        case 'OVERDUE':
          return 'OVERDUE';
        case 'PARTIAL':
        case 'CANCELLED':
        default:
          return 'UNPAID';
      }
    };

    // تحويل PaymentMethod من supplier إلى financial
    const convertPaymentMethod = (paymentMethod: any): 'CASH' | 'BANK_TRANSFER' | 'CHECK' | 'CARD' | undefined => {
      if (!paymentMethod) return undefined;
      switch (paymentMethod) {
        case 'CASH':
          return 'CASH';
        case 'BANK_TRANSFER':
          return 'BANK_TRANSFER';
        case 'CHECK':
          return 'CHECK';
        case 'CREDIT_CARD':
          return 'CARD';
        default:
          return undefined;
      }
    };
    
    return {
      id: supplierInvoice.id,
      invoiceNumber: supplierInvoice.invoiceNumber,
      date: supplierInvoice.createdAt,
      type: 'INCOMING' as const,
      partyName: supplierInvoice.supplier.name,
      partyType: 'SUPPLIER' as const,
      totalAmount: supplierInvoice.amount,
      tax: 0, // يمكن إضافة حساب الضريبة لاحقاً
      totalAfterTax: supplierInvoice.amount,
      status: convertStatus(supplierInvoice.status),
      paymentMethod: convertPaymentMethod(supplierInvoice.paymentMethod),
      hasAttachments: false, // يمكن إضافة منطق للتحقق من المرفقات لاحقاً
      createdAt: supplierInvoice.createdAt,
    };
  };

  // عرض النموذج
  if (viewMode === 'form') {
    return (
      <SupplierInvoiceForm
        invoice={selectedInvoice}
        onSubmit={handleSaveInvoice}
        onCancel={handleCancelForm}
        isLoading={isLoading}
      />
    );
  }

  // عرض تفاصيل الفاتورة
  if (viewMode === 'details' && selectedInvoice) {
    const convertedInvoice = convertToInvoiceTableData(selectedInvoice);
    if (!convertedInvoice) return null;
    
    return (
      <InvoiceDetails
        invoice={convertedInvoice}
        onEdit={() => handleEditInvoice(selectedInvoice)}
        onBack={handleBackFromDetails}
        onPrint={handlePrintInvoice}
        onExport={handleExportInvoice}
      />
    );
  }

  // العرض الافتراضي - قائمة الفواتير
  return (
    <div className="space-y-6">
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setInvoiceToDelete(null);
        }}
        onConfirm={confirmDeleteInvoice}
        title="تأكيد حذف الفاتورة"
        message={`هل أنت متأكد من حذف الفاتورة "${invoiceToDelete?.invoiceNumber}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
        confirmText="حذف"
        cancelText="إلغاء"
        variant="danger"
      />

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showCancelDialog}
        onClose={() => {
          setShowCancelDialog(false);
          setInvoiceToCancel(null);
        }}
        onConfirm={confirmCancelInvoice}
        title="تأكيد إلغاء الفاتورة"
        message={`هل أنت متأكد من إلغاء الفاتورة "${invoiceToCancel?.invoiceNumber}"؟`}
        confirmText="إلغاء الفاتورة"
        cancelText="رجوع"
        variant="warning"
      />

      {/* Error Message */}
      {error && (
        <ErrorMessage 
          message={error} 
          onClose={() => setError(null)}
        />
      )}

      {/* إحصائيات الفواتير */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الفواتير</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total || 0}</div>
              <p className="text-xs text-muted-foreground">
                بقيمة {(stats.total_amount || 0).toLocaleString()} ريال
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">مدفوعة</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.paid || 0}</div>
              <p className="text-xs text-muted-foreground">
                بقيمة {(stats.paid_amount || 0).toLocaleString()} ريال
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">معلقة</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending || 0}</div>
              <p className="text-xs text-muted-foreground">
                بقيمة {(stats.pending_amount || 0).toLocaleString()} ريال
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">متأخرة</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.overdue || 0}</div>
              <p className="text-xs text-muted-foreground">
                بقيمة {(stats.overdue_amount || 0).toLocaleString()} ريال
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* جدول الفواتير */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
          <CardTitle>فواتير الموردين</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportInvoices}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                تصدير
              </Button>
              <Button
                onClick={handleAddInvoice}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                إضافة فاتورة
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* شريط البحث والفلترة */}
          <div className="mb-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="البحث في الفواتير..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                فلترة
                {showFilters ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* فلاتر متقدمة */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <label className="block text-sm font-medium mb-1">حالة الفاتورة</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as InvoiceStatus | '')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">جميع الحالات</option>
                    <option value="PENDING">في الانتظار</option>
                    <option value="PAID">مدفوعة</option>
                    <option value="PARTIAL">جزئية</option>
                    <option value="OVERDUE">متأخرة</option>
                    <option value="CANCELLED">ملغاة</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* الجدول */}
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50 dark:bg-gray-800">
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                    رقم الفاتورة
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                    المورد
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                    تاريخ الفاتورة
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                    تاريخ الاستحقاق
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                    المبلغ الإجمالي
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                    المدفوع
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                    المتبقي
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                    الحالة
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm">
                      <div className="font-medium text-primary">
                        {invoice.invoiceNumber}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>{invoice.supplier.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(invoice.createdAt).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(invoice.dueDate).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="font-medium">
                        {invoice.amount.toLocaleString()} ريال
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="text-green-600">
                        {invoice.status === 'PAID' ? invoice.amount.toLocaleString() : '0'} ريال
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="text-red-600">
                        {invoice.status === 'PAID' ? '0' : invoice.amount.toLocaleString()} ريال
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}
                      >
                        {getStatusIcon(invoice.status)}
                        {getStatusText(invoice.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewInvoice(invoice)}
                          className="h-8 w-8 p-0"
                          title="عرض التفاصيل"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditInvoice(invoice)}
                          className="h-8 w-8 p-0"
                          title="تعديل"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteInvoice(invoice)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          title="حذف"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* رسالة عدم وجود بيانات */}
          {invoices.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">لا توجد فواتير للعرض</p>
              <Button onClick={handleAddInvoice}>
                إضافة فاتورة جديدة
              </Button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <LoadingSpinner text="جاري تحميل الفواتير..." />
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.total > 0 && !isLoading && (
        <Pagination 
          currentPage={pagination.currentPage}
          totalPages={pagination.lastPage}
          total={pagination.total}
          perPage={pagination.perPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}