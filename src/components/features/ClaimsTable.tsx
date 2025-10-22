/**
 * جدول المطالبات مع البحث والفلترة والإجراءات
 */

'use client';

import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { Button } from '@/components/shared/Button';
import { ClaimsTableData, ClaimStatus } from '@/lib/types/claims';
import {
  Search,
  Filter,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Receipt,
  Bell,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  User,
  FileText,
  MessageSquare,
  Calendar,
} from 'lucide-react';

interface ClaimsTableProps {
  data: ClaimsTableData[];
  onRecordPayment: (claim: ClaimsTableData) => void;
  onGenerateReceipt: (claim: ClaimsTableData) => void;
  onViewDetails: (claim: ClaimsTableData) => void;
  onSendReminder: (claim: ClaimsTableData) => void;
  onAddComment: (claim: ClaimsTableData) => void;
  isLoading?: boolean;
}

export function ClaimsTable({
  data,
  onRecordPayment,
  onGenerateReceipt,
  onViewDetails,
  onSendReminder,
  onAddComment,
  isLoading: _isLoading = false,
}: ClaimsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // تعريف أعمدة الجدول
  const columns: ColumnDef<ClaimsTableData>[] = useMemo(
    () => [
      {
        accessorKey: 'customerName',
        header: 'اسم العميل',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-blue-600" />
            <span className="font-medium">{row.getValue('customerName')}</span>
          </div>
        ),
      },
      {
        accessorKey: 'totalContracts',
        header: 'إجمالي العقود',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-purple-600" />
            <span className="font-medium">{row.getValue('totalContracts')}</span>
          </div>
        ),
      },
      {
        accessorKey: 'totalPayments',
        header: 'إجمالي المدفوعات',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-600">
              {(row.getValue('totalPayments') as number).toLocaleString()} ر.ع
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'pendingAmount',
        header: 'المتبقي',
        cell: ({ row }) => {
          const amount = row.getValue('pendingAmount') as number;
          return (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-red-600" />
              <span className={`font-medium ${amount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {amount.toLocaleString()} ر.ع
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'الحالة',
        cell: ({ row }) => {
          const status = row.getValue('status') as ClaimStatus;
          const statusConfig = {
            PENDING: { label: 'معلق', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: Clock },
            PARTIAL: { label: 'جزئي', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: Clock },
            PAID: { label: 'مدفوع', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle },
            OVERDUE: { label: 'متأخر', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: AlertTriangle },
            CANCELLED: { label: 'ملغي', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200', icon: XCircle },
          };
          const config = statusConfig[status];
          const Icon = config.icon;
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}>
              <Icon className="h-3 w-3" />
              {config.label}
            </span>
          );
        },
      },
      {
        accessorKey: 'priority',
        header: 'الأولوية',
        cell: ({ row }) => {
          const priority = row.getValue('priority') as string;
          const priorityConfig = {
            LOW: { label: 'منخفضة', color: 'bg-gray-100 text-gray-800' },
            NORMAL: { label: 'عادية', color: 'bg-blue-100 text-blue-800' },
            HIGH: { label: 'عالية', color: 'bg-orange-100 text-orange-800' },
            URGENT: { label: 'عاجلة', color: 'bg-red-100 text-red-800' },
          };
          const config = priorityConfig[priority as keyof typeof priorityConfig];
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
              {config.label}
            </span>
          );
        },
      },
      {
        accessorKey: 'lastContactDate',
        header: 'آخر تواصل',
        cell: ({ row }) => {
          const date = row.getValue('lastContactDate') as Date;
          return date ? (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-blue-600" />
              <span className="text-sm">
                {new Date(date).toLocaleDateString('ar-SA')}
              </span>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">-</span>
          );
        },
      },
      {
        accessorKey: 'nextContactDate',
        header: 'الموعد القادم',
        cell: ({ row }) => {
          const date = row.getValue('nextContactDate') as Date;
          const now = new Date();
          const isOverdue = date && new Date(date) < now;
          const isToday = date && new Date(date).toDateString() === now.toDateString();
          
          return date ? (
            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600' : isToday ? 'text-orange-600' : 'text-green-600'}`}>
              <Clock className="h-3 w-3" />
              <span className="text-sm">
                {new Date(date).toLocaleDateString('ar-SA')}
              </span>
              {isOverdue && (
                <AlertTriangle className="h-3 w-3 text-red-500" />
              )}
              {isToday && (
                <Bell className="h-3 w-3 text-orange-500" />
              )}
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">-</span>
          );
        },
      },
      {
        id: 'actions',
        header: 'الإجراءات',
        cell: ({ row }) => {
          const claim = row.original;
          return (
            <div className="flex items-center gap-0.5 flex-wrap">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewDetails(claim)}
                className="h-6 w-6 p-0"
                title="عرض التفاصيل"
              >
                <Eye className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRecordPayment(claim)}
                className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                title="تسجيل دفعة"
              >
                <DollarSign className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onGenerateReceipt(claim)}
                className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700"
                title="إصدار إيصال"
              >
                <Receipt className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAddComment(claim)}
                className="h-6 w-6 p-0 text-purple-600 hover:text-purple-700"
                title="إضافة تعليق"
              >
                <MessageSquare className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSendReminder(claim)}
                className="h-6 w-6 p-0 text-orange-600 hover:text-orange-700"
                title="إرسال تذكير"
              >
                <Bell className="h-3 w-3" />
              </Button>
            </div>
          );
        },
      },
    ],
    [onViewDetails, onRecordPayment, onGenerateReceipt, onAddComment, onSendReminder]
  );

  // إنشاء الجدول
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
      columnVisibility: {
        status: false,      // إخفاء عمود الحالة
        priority: false,    // إخفاء عمود الأولوية
        lastContactDate: false,  // إخفاء عمود آخر تواصل
        nextContactDate: false,  // إخفاء عمود الموعد القادم على الشاشات الصغيرة
      },
    },
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">قائمة المطالبات</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => console.log('تصدير المطالبات')}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              تصدير
            </Button>
          </div>
        </div>
      </div>
      <div className="p-6">
        {/* شريط البحث والفلترة */}
        <div className="mb-4 space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="البحث في المطالبات..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
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
                <label className="block text-sm font-medium mb-1">الحالة</label>
                <select
                  value={(table.getColumn('status')?.getFilterValue() as string) ?? ''}
                  onChange={(e) =>
                    table.getColumn('status')?.setFilterValue(e.target.value || undefined)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">جميع الحالات</option>
                  <option value="PENDING">معلق</option>
                  <option value="PARTIAL">جزئي</option>
                  <option value="PAID">مدفوع</option>
                  <option value="OVERDUE">متأخر</option>
                  <option value="CANCELLED">ملغي</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الأولوية</label>
                <select
                  value={(table.getColumn('priority')?.getFilterValue() as string) ?? ''}
                  onChange={(e) =>
                    table.getColumn('priority')?.setFilterValue(e.target.value || undefined)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">جميع الأولويات</option>
                  <option value="LOW">منخفضة</option>
                  <option value="NORMAL">عادية</option>
                  <option value="HIGH">عالية</option>
                  <option value="URGENT">عاجلة</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">المبلغ الأدنى</label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">المبلغ الأقصى</label>
                <input
                  type="number"
                  placeholder="999999"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          )}
          
          {/* أزرار الفلاتر */}
          {showFilters && (
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  table.resetColumnFilters();
                  setGlobalFilter('');
                }}
              >
                مسح جميع الفلاتر
              </Button>
            </div>
          )}
        </div>

        {/* الجدول */}
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b bg-gray-50 dark:bg-gray-800">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap"
                      style={{ minWidth: header.id === 'customerName' ? '120px' : header.id === 'actions' ? '140px' : header.id === 'pendingAmount' ? '90px' : header.id === 'totalPayments' ? '110px' : '80px' }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? 'cursor-pointer select-none flex items-center gap-1'
                              : ''
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && (
                            <div className="flex flex-col">
                              {header.column.getIsSorted() === 'asc' ? (
                                <ChevronUp className="h-3 w-3" />
                              ) : header.column.getIsSorted() === 'desc' ? (
                                <ChevronDown className="h-3 w-3" />
                              ) : (
                                <div className="h-3 w-3" />
                              )}
                            </div>
                          )}
                        </div>
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
                      <td key={cell.id} className="px-2 py-3 text-sm whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                    لا توجد بيانات للعرض
                  </td>
                </tr>
              )}
            </tbody>
            </table>
          </div>
        </div>

        {/* التنقل بين الصفحات */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              عرض {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} إلى{' '}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}{' '}
              من {table.getFilteredRowModel().rows.length} مطالبة
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
              السابق
            </Button>
            <span className="text-sm">
              صفحة {table.getState().pagination.pageIndex + 1} من {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              التالي
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
