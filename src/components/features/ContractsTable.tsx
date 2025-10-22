/**
 * جدول العقود مع البحث والفلترة والإجراءات
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { ContractsTableData, ContractType, ContractStatus, ContractFilters } from '@/lib/types/contracts';
import {
  Search,
  Filter,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  FileText,
  DollarSign,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Pause,
  Printer,
} from 'lucide-react';

interface ContractsTableProps {
  data: ContractsTableData[];
  onViewContract: (contract: ContractsTableData) => void;
  onPrintContract: (contract: ContractsTableData) => void;
  filters?: ContractFilters;
  isLoading?: boolean;
}

export function ContractsTable({
  data,
  onViewContract,
  onPrintContract,
  filters: _filters = {},
  isLoading: _isLoading = false,
}: ContractsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // تعريف أعمدة الجدول
  const columns: ColumnDef<ContractsTableData>[] = useMemo(
    () => [
      {
        accessorKey: 'contractNumber',
        header: 'رقم العقد',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-primary">{row.getValue('contractNumber')}</span>
          </div>
        ),
      },
      {
        accessorKey: 'customerName',
        header: 'اسم العميل',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-green-600" />
            <span className="font-medium">{row.getValue('customerName')}</span>
          </div>
        ),
      },
      {
        accessorKey: 'contractType',
        header: 'نوع العقد',
        cell: ({ row }) => {
          const type = row.getValue('contractType') as ContractType;
          const typeConfig = {
            'تأجير': { label: 'تأجير', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
            'شراء': { label: 'شراء', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
            'صيانة': { label: 'صيانة', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
            'خدمة': { label: 'خدمة', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
            'تقسيط': { label: 'تقسيط', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' },
            'تركيب': { label: 'تركيب', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' },
          };
          const config = typeConfig[type] || { label: type, color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' };
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
              {config.label}
            </span>
          );
        },
      },
      {
        accessorKey: 'endDate',
        header: 'تاريخ الانتهاء',
        cell: ({ row }) => {
          const date = row.getValue('endDate') as Date;
          return (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-600" />
              <span className="text-sm">{new Date(date).toLocaleDateString('ar-SA')}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'totalValue',
        header: 'قيمة العقد',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-600">
              {(row.getValue('totalValue') as number).toLocaleString()} ر.ع
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'الحالة',
        cell: ({ row }) => {
          const status = row.getValue('status') as ContractStatus;
          const statusConfig = {
            'نشط': { label: 'نشط', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle },
            'منتهي': { label: 'منتهي', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: XCircle },
            'ملغى': { label: 'ملغى', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200', icon: XCircle },
            'ملغي': { label: 'ملغي', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200', icon: XCircle },
            'مسودة': { label: 'مسودة', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: Pause },
            'معلق': { label: 'معلق', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: Pause },
            'معتمد': { label: 'معتمد', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: CheckCircle },
            'متأخر': { label: 'متأخر', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: XCircle },
          };
          const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200', icon: CheckCircle };
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
        id: 'actions',
        header: 'الإجراءات',
        cell: ({ row }) => {
          const contract = row.original;
          return (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewContract(contract)}
                className="h-8 w-8 p-0"
                title="عرض التفاصيل"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPrintContract(contract)}
                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                title="طباعة العقد"
              >
                <Printer className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [onViewContract, onPrintContract]
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
    },
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>قائمة العقود</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => console.log('تصدير العقود')}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              تصدير
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* شريط البحث والفلترة */}
        <div className="mb-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="البحث في العقود..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <label className="block text-sm font-medium mb-1">نوع العقد</label>
                <select
                  value={(table.getColumn('contractType')?.getFilterValue() as string) ?? ''}
                  onChange={(e) =>
                    table.getColumn('contractType')?.setFilterValue(e.target.value || undefined)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">جميع الأنواع</option>
                  <option value="تأجير">تأجير</option>
                  <option value="شراء">شراء</option>
                  <option value="صيانة">صيانة</option>
                  <option value="خدمة">خدمة</option>
                  <option value="تقسيط">تقسيط</option>
                </select>
              </div>
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
                  <option value="نشط">نشط</option>
                  <option value="منتهي">منتهي</option>
                  <option value="ملغى">ملغى</option>
                  <option value="مسودة">مسودة</option>
                  <option value="معتمد">معتمد</option>
                  <option value="متأخر">متأخر</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">القيمة الأدنى</label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">القيمة الأقصى</label>
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
        <div className="rounded-md border overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b bg-gray-50 dark:bg-gray-800">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap"
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
                      <td key={cell.id} className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
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

        {/* التنقل بين الصفحات */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              عرض {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} إلى{' '}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}{' '}
              من {table.getFilteredRowModel().rows.length} عقد
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
      </CardContent>
    </Card>
  );
}