/**
 * مكون جدول الفواتير
 */

'use client';

import React, { useState } from 'react';
import { InvoiceTableData } from '@/lib/types/financial';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface InvoicesTableProps {
  data: InvoiceTableData[];
  onAddInvoice: () => void;
  onEditInvoice: (invoice: InvoiceTableData) => void;
  onDeleteInvoice: (invoice: InvoiceTableData) => void;
  onViewInvoice: (invoice: InvoiceTableData) => void;
  onConfirmPayment: (invoice: InvoiceTableData) => void;
  onExportInvoices: () => void;
}

export function InvoicesTable({
  data,
  onAddInvoice,
  onEditInvoice,
  onDeleteInvoice,
  onViewInvoice,
  onConfirmPayment,
  onExportInvoices,
}: InvoicesTableProps) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    partyType: '',
    status: '',
    party: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // تقليل العدد لتجنب scroll bar

  // تطبيق الفلاتر
  const filteredData = data.filter((item) => {
    // فلترة النص العام
    if (globalFilter && !item.invoiceNumber.toLowerCase().includes(globalFilter.toLowerCase()) &&
        !item.partyName.toLowerCase().includes(globalFilter.toLowerCase())) {
      return false;
    }
    
    // فلترة النوع
    if (filters.type && item.type !== filters.type) return false;
    
    // فلترة نوع الطرف
    if (filters.partyType && item.partyType !== filters.partyType) return false;
    
    // فلترة الحالة
    if (filters.status && item.status !== filters.status) return false;
    
    // فلترة الطرف
    if (filters.party && item.partyName !== filters.party) return false;
    
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const getTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      OUTGOING: 'صادرة',
      INCOMING: 'واردة',
    };
    return typeLabels[type] || type;
  };

  const getPartyTypeLabel = (partyType: string) => {
    const partyTypeLabels: Record<string, string> = {
      CUSTOMER: 'عميل',
      SUPPLIER: 'مورد',
    };
    return partyTypeLabels[partyType] || partyType;
  };

  const getStatusLabel = (status: string) => {
    const statusLabels: Record<string, string> = {
      PAID: 'مدفوعة',
      UNPAID: 'غير مدفوعة',
      PENDING: 'معلقة',
      OVERDUE: 'متأخرة',
    };
    return statusLabels[status] || status;
  };

  const getTypeColor = (type: string) => {
    const typeColors: Record<string, string> = {
      OUTGOING: 'bg-green-100 text-green-800',
      INCOMING: 'bg-blue-100 text-blue-800',
    };
    return typeColors[type] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      PAID: 'bg-green-100 text-green-800',
      UNPAID: 'bg-red-100 text-red-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      OVERDUE: 'bg-orange-100 text-orange-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPartyTypeColor = (partyType: string) => {
    const partyTypeColors: Record<string, string> = {
      CUSTOMER: 'bg-purple-100 text-purple-800',
      SUPPLIER: 'bg-indigo-100 text-indigo-800',
    };
    return partyTypeColors[partyType] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      {/* شريط البحث والفلترة */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="البحث في الفواتير..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            فلاتر
            {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <Button
            onClick={onAddInvoice}
            className="flex items-center gap-2 bg-[#58d2c8] hover:bg-[#4bb8ad]"
          >
            <Plus className="h-4 w-4" />
            إضافة فاتورة
          </Button>
          <Button
            variant="outline"
            onClick={onExportInvoices}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            تصدير
          </Button>
        </div>

        {/* الفلاتر المتقدمة */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="">جميع الأنواع</option>
              <option value="OUTGOING">صادرة</option>
              <option value="INCOMING">واردة</option>
            </select>

            <select
              value={filters.partyType}
              onChange={(e) => setFilters(prev => ({ ...prev, partyType: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="">جميع الأطراف</option>
              <option value="CUSTOMER">عملاء</option>
              <option value="SUPPLIER">موردين</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="">جميع الحالات</option>
              <option value="PAID">مدفوعة</option>
              <option value="UNPAID">غير مدفوعة</option>
              <option value="PENDING">معلقة</option>
              <option value="OVERDUE">متأخرة</option>
            </select>

            <select
              value={filters.party}
              onChange={(e) => setFilters(prev => ({ ...prev, party: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="">جميع الأطراف</option>
              <option value="شركة النخيل للتجارة">شركة النخيل للتجارة</option>
              <option value="شركة المعدات الصناعية">شركة المعدات الصناعية</option>
              <option value="بلدية مسقط">بلدية مسقط</option>
            </select>
          </div>
        )}
      </div>

      {/* الجدول */}
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                رقم الفاتورة
              </th>
              <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                التاريخ
              </th>
              <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                النوع
              </th>
              <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                الطرف
              </th>
              <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                المبلغ
              </th>
              <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                الضريبة
              </th>
              <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                الحالة
              </th>
              <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((row) => (
                <tr
                  key={row.invoiceNumber}
                  className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-2 py-3 text-sm">
                    <div className="font-medium text-[#58d2c8]">
                      {row.invoiceNumber}
                    </div>
                  </td>
                  <td className="px-2 py-3 text-sm">
                    <div className="text-gray-600">
                      {row.date.toLocaleDateString('ar-SA')}
                    </div>
                  </td>
                  <td className="px-2 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(row.type)}`}>
                      {getTypeLabel(row.type)}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-sm">
                    <div className="space-y-1">
                      <div className="max-w-[150px] truncate">
                        {row.partyName}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${getPartyTypeColor(row.partyType)}`}>
                        {getPartyTypeLabel(row.partyType)}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-3 text-sm">
                    <div className="text-right">
                      <div className="font-medium text-[#58d2c8]">
                        {row.totalAmount.toLocaleString()} ريال
                      </div>
                      <div className="text-xs text-gray-500">
                        شامل الضريبة: {row.totalAfterTax.toLocaleString()} ريال
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-3 text-sm">
                    <div className="font-medium text-gray-600">
                      {row.tax.toLocaleString()} ريال
                    </div>
                  </td>
                  <td className="px-2 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(row.status)}`}>
                      {getStatusLabel(row.status)}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-sm">
                    <div className="flex items-center gap-0.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewInvoice(row)}
                        className="h-6 w-6 p-0 hover:bg-blue-100"
                        title="عرض التفاصيل"
                      >
                        <Eye className="h-3 w-3 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditInvoice(row)}
                        className="h-6 w-6 p-0 hover:bg-green-100"
                        title="تعديل"
                      >
                        <Edit className="h-3 w-3 text-green-600" />
                      </Button>
                      {row.status === 'UNPAID' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onConfirmPayment(row)}
                          className="h-6 w-6 p-0 hover:bg-green-100"
                          title="تأكيد الدفع"
                        >
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteInvoice(row)}
                        className="h-6 w-6 p-0 hover:bg-red-100"
                        title="حذف"
                      >
                        <Trash2 className="h-3 w-3 text-red-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="h-24 text-center text-gray-500">
                  لا توجد فواتير
                </td>
              </tr>
            )}
          </tbody>
          </table>
        </div>
      </div>

      {/* التحكم في الصفحات */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          عرض {startIndex + 1} إلى{' '}
          {Math.min(endIndex, filteredData.length)}{' '}
          من {filteredData.length} فاتورة
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1"
          >
            <ChevronRight className="h-4 w-4" />
            السابق
          </Button>
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-700">صفحة</span>
            <span className="font-medium">
              {currentPage} من {totalPages}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1"
          >
            التالي
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}