/**
 * مكون جدول عمليات شراء المعدات
 */

'use client';

import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { EquipmentPurchaseTableData } from '@/lib/types/inventory';
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

interface EquipmentPurchasesTableProps {
  data: EquipmentPurchaseTableData[];
  onAddPurchase: () => void;
  onEditPurchase: (purchase: EquipmentPurchaseTableData) => void;
  onDeletePurchase: (purchase: EquipmentPurchaseTableData) => void;
  onViewPurchase: (purchase: EquipmentPurchaseTableData) => void;
  onExportPurchases: () => void;
}

const columnHelper = createColumnHelper<EquipmentPurchaseTableData>();

export function EquipmentPurchasesTable({
  data,
  onAddPurchase,
  onEditPurchase,
  onDeletePurchase,
  onViewPurchase,
  onExportPurchases,
}: EquipmentPurchasesTableProps) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
    supplierName: '',
    hasInvoice: '',
  });

  // تعريف الأعمدة
  const columns = useMemo<any[]>(
    () => [
      columnHelper.accessor('purchaseNumber', {
        header: 'رقم الشراء',
        cell: (info) => (
          <div className="font-medium text-[#913D95]">
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor('supplierName', {
        header: 'المورد',
        cell: (info) => (
          <div className="font-medium text-gray-900">
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor('totalAmount', {
        header: 'المبلغ الإجمالي',
        cell: (info) => (
          <div className="text-sm font-medium text-[#913D95]">
            {info.getValue().toLocaleString()} ريال
          </div>
        ),
      }),
      columnHelper.accessor('itemCount', {
        header: 'عدد الأصناف',
        cell: (info) => (
          <div className="text-center">
            <div className="font-medium">{info.getValue()}</div>
            <div className="text-xs text-gray-500">
              {info.row.original.totalQuantity} قطعة
            </div>
          </div>
        ),
      }),
      columnHelper.accessor('purchaseDate', {
        header: 'تاريخ الشراء',
        cell: (info) => (
          <div className="text-sm text-gray-600">
            {info.getValue().toLocaleDateString('ar-SA')}
          </div>
        ),
      }),
      columnHelper.accessor('deliveryDate', {
        header: 'تاريخ التسليم',
        cell: (info) => (
          <div className="text-sm text-gray-600">
            {info.getValue() ? info.getValue()?.toLocaleDateString('ar-SA') : 'لم يتم تحديده'}
          </div>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'حالة الشراء',
        cell: (info) => {
          const status = info.getValue();
          const statusLabels = {
            PENDING: 'في الانتظار',
            CONFIRMED: 'مؤكدة',
            DELIVERED: 'مسلمة',
            CANCELLED: 'ملغاة',
          };
          const statusColors = {
            PENDING: 'bg-yellow-100 text-yellow-800',
            CONFIRMED: 'bg-blue-100 text-blue-800',
            DELIVERED: 'bg-green-100 text-green-800',
            CANCELLED: 'bg-red-100 text-red-800',
          };
          return (
            <span className={`px-2 py-1 rounded-full text-xs ${statusColors[status]}`}>
              {statusLabels[status]}
            </span>
          );
        },
      }),
      columnHelper.accessor('paymentStatus', {
        header: 'حالة الدفع',
        cell: (info) => {
          const status = info.getValue();
          const statusLabels = {
            PENDING: 'في الانتظار',
            PARTIAL: 'جزئية',
            PAID: 'مدفوعة',
          };
          const statusColors = {
            PENDING: 'bg-yellow-100 text-yellow-800',
            PARTIAL: 'bg-orange-100 text-orange-800',
            PAID: 'bg-green-100 text-green-800',
          };
          return (
            <span className={`px-2 py-1 rounded-full text-xs ${statusColors[status]}`}>
              {statusLabels[status]}
            </span>
          );
        },
      }),
      columnHelper.accessor('paidAmount', {
        header: 'المبلغ المدفوع',
        cell: (info) => (
          <div className="text-sm">
            <div className="font-medium text-green-600">
              {info.getValue().toLocaleString()} ريال
            </div>
            <div className="text-xs text-gray-500">
              متبقي: {info.row.original.remainingAmount.toLocaleString()} ريال
            </div>
          </div>
        ),
      }),
      columnHelper.accessor('invoiceNumber', {
        header: 'رقم الفاتورة',
        cell: (info) => (
          <div className="text-sm text-gray-600">
            {info.getValue() || 'غير محدد'}
          </div>
        ),
      }),
      columnHelper.accessor('hasAttachments', {
        header: 'مرفقات',
        cell: (info) => (
          <div className="text-center">
            {info.getValue() ? (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                موجودة
              </span>
            ) : (
              <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                غير موجودة
              </span>
            )}
          </div>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: 'الإجراءات',
        cell: (info) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewPurchase(info.row.original)}
              className="h-8 w-8 p-0 hover:bg-blue-100"
            >
              <Eye className="h-4 w-4 text-blue-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditPurchase(info.row.original)}
              className="h-8 w-8 p-0 hover:bg-green-100"
            >
              <Edit className="h-4 w-4 text-green-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeletePurchase(info.row.original)}
              className="h-8 w-8 p-0 hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        ),
      }),
    ],
    [onViewPurchase, onEditPurchase, onDeletePurchase]
  );

  // إنشاء الجدول
  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: 'includesString',
  });

  // تطبيق الفلاتر
  const _filteredData = useMemo(() => {
    return data.filter((item) => {
      if (filters.status && item.status !== filters.status) return false;
      if (filters.paymentStatus && item.paymentStatus !== filters.paymentStatus) return false;
      if (filters.supplierName && !item.supplierName.includes(filters.supplierName)) return false;
      if (filters.hasInvoice && item.invoiceNumber && filters.hasInvoice === 'no') return false;
      if (filters.hasInvoice && !item.invoiceNumber && filters.hasInvoice === 'yes') return false;
      return true;
    });
  }, [data, filters]);

  // تحديث الجدول بالبيانات المفلترة
  // React.useEffect(() => {
  //   table.setData(filteredData);
  // }, [filteredData, table]);

  return (
    <div className="space-y-4">
      {/* شريط البحث والفلترة */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="البحث في عمليات الشراء..."
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
            onClick={onAddPurchase}
            className="flex items-center gap-2 bg-[#913D95] hover:bg-[#7A2F7D]"
          >
            <Plus className="h-4 w-4" />
            إضافة شراء
          </Button>
          <Button
            variant="outline"
            onClick={onExportPurchases}
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
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="">جميع حالات الشراء</option>
              <option value="PENDING">في الانتظار</option>
              <option value="CONFIRMED">مؤكدة</option>
              <option value="DELIVERED">مسلمة</option>
              <option value="CANCELLED">ملغاة</option>
            </select>

            <select
              value={filters.paymentStatus}
              onChange={(e) => setFilters(prev => ({ ...prev, paymentStatus: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="">جميع حالات الدفع</option>
              <option value="PENDING">في الانتظار</option>
              <option value="PARTIAL">جزئية</option>
              <option value="PAID">مدفوعة</option>
            </select>

            <input
              type="text"
              placeholder="اسم المورد..."
              value={filters.supplierName}
              onChange={(e) => setFilters(prev => ({ ...prev, supplierName: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />

            <select
              value={filters.hasInvoice}
              onChange={(e) => setFilters(prev => ({ ...prev, hasInvoice: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="">جميع الفواتير</option>
              <option value="yes">لها فاتورة</option>
              <option value="no">بدون فاتورة</option>
            </select>
          </div>
        )}
      </div>

      {/* الجدول */}
      <div className="rounded-md border overflow-x-auto">
        <table className="w-full min-w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b bg-gray-50">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="h-24 text-center text-gray-500">
                  لا توجد عمليات شراء
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* التحكم في الصفحات */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          عرض {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} إلى{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{' '}
          من {table.getFilteredRowModel().rows.length} عملية شراء
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="flex items-center gap-1"
          >
            <ChevronRight className="h-4 w-4" />
            السابق
          </Button>
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-700">صفحة</span>
            <span className="font-medium">
              {table.getState().pagination.pageIndex + 1} من {table.getPageCount()}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
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
