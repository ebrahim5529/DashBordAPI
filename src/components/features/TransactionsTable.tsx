/**
 * مكون جدول المعاملات المالية
 */

'use client';

import React, { useState } from 'react';
import { TransactionTableData } from '@/lib/types/financial';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface TransactionsTableProps {
  data: TransactionTableData[];
  onAddTransaction: () => void;
  onEditTransaction: (transaction: TransactionTableData) => void;
  onDeleteTransaction: (transaction: TransactionTableData) => void;
  onViewTransaction: (transaction: TransactionTableData) => void;
  onExportTransactions: () => void;
}

export function TransactionsTable({
  data,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
  onViewTransaction,
  onExportTransactions,
}: TransactionsTableProps) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    paymentMethod: '',
    status: '',
    account: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // تقليل العدد لتجنب scroll bar

  // تطبيق الفلاتر
  const filteredData = data.filter((item) => {
    // فلترة النص العام
    if (globalFilter && !item.transactionNumber.toLowerCase().includes(globalFilter.toLowerCase()) &&
        !item.description.toLowerCase().includes(globalFilter.toLowerCase())) {
      return false;
    }
    
    // فلترة النوع
    if (filters.type && item.type !== filters.type) return false;
    
    // فلترة طريقة الدفع
    if (filters.paymentMethod && item.paymentMethod !== filters.paymentMethod) return false;
    
    // فلترة الحالة
    if (filters.status && item.status !== filters.status) return false;
    
    // فلترة الحساب
    if (filters.account && item.account !== filters.account) return false;
    
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const getTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      INCOME: 'إيراد',
      EXPENSE: 'مصروف',
      TRANSFER: 'تحويل',
    };
    return typeLabels[type] || type;
  };

  const getPaymentMethodLabel = (method: string) => {
    const methodLabels: Record<string, string> = {
      CASH: 'نقدي',
      BANK_TRANSFER: 'تحويل بنكي',
      CHECK: 'شيك',
      CARD: 'بطاقة',
    };
    return methodLabels[method] || method;
  };

  const getStatusLabel = (status: string) => {
    const statusLabels: Record<string, string> = {
      PENDING: 'في الانتظار',
      COMPLETED: 'مكتملة',
      CANCELLED: 'ملغية',
    };
    return statusLabels[status] || status;
  };

  const getTypeColor = (type: string) => {
    const typeColors: Record<string, string> = {
      INCOME: 'bg-green-100 text-green-800',
      EXPENSE: 'bg-red-100 text-red-800',
      TRANSFER: 'bg-blue-100 text-blue-800',
    };
    return typeColors[type] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
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
              placeholder="البحث في المعاملات..."
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
            onClick={onAddTransaction}
            className="flex items-center gap-2 bg-[#58d2c8] hover:bg-[#4bb8ad]"
          >
            <Plus className="h-4 w-4" />
            إضافة معاملة
          </Button>
          <Button
            variant="outline"
            onClick={onExportTransactions}
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
              <option value="INCOME">إيراد</option>
              <option value="EXPENSE">مصروف</option>
              <option value="TRANSFER">تحويل</option>
            </select>

            <select
              value={filters.paymentMethod}
              onChange={(e) => setFilters(prev => ({ ...prev, paymentMethod: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="">جميع طرق الدفع</option>
              <option value="CASH">نقدي</option>
              <option value="BANK_TRANSFER">تحويل بنكي</option>
              <option value="CHECK">شيك</option>
              <option value="CARD">بطاقة</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="">جميع الحالات</option>
              <option value="PENDING">في الانتظار</option>
              <option value="COMPLETED">مكتملة</option>
              <option value="CANCELLED">ملغية</option>
            </select>

            <select
              value={filters.account}
              onChange={(e) => setFilters(prev => ({ ...prev, account: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="">جميع الحسابات</option>
              <option value="حساب الشركة - البنك الأهلي">حساب الشركة - البنك الأهلي</option>
              <option value="حساب الشركة - البنك الوطني">حساب الشركة - البنك الوطني</option>
              <option value="الصندوق النقدي">الصندوق النقدي</option>
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
                رقم المعاملة
              </th>
              <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                التاريخ
              </th>
              <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                النوع
              </th>
              <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                الوصف
              </th>
              <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                المبلغ
              </th>
              <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                طريقة الدفع
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
                  key={row.transactionNumber}
                  className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-2 py-3 text-sm">
                    <div className="font-medium text-[#58d2c8]">
                      {row.transactionNumber}
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
                    <div className="max-w-[200px] truncate">
                      {row.description}
                    </div>
                  </td>
                  <td className="px-2 py-3 text-sm">
                    <div className={`font-medium ${row.type === 'INCOME' ? 'text-green-600' : row.type === 'EXPENSE' ? 'text-red-600' : 'text-blue-600'}`}>
                      {row.amount.toLocaleString()} ريال
                    </div>
                  </td>
                  <td className="px-2 py-3 text-sm">
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                      {getPaymentMethodLabel(row.paymentMethod)}
                    </span>
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
                        onClick={() => onViewTransaction(row)}
                        className="h-6 w-6 p-0 hover:bg-blue-100"
                        title="عرض التفاصيل"
                      >
                        <Eye className="h-3 w-3 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditTransaction(row)}
                        className="h-6 w-6 p-0 hover:bg-green-100"
                        title="تعديل"
                      >
                        <Edit className="h-3 w-3 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteTransaction(row)}
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
                  لا توجد معاملات
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
          من {filteredData.length} معاملة
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
