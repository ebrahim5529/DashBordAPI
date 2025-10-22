/**
 * جدول تفاصيل المشتريات (سجل المشتريات)
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
import { PurchaseDetailItem, PurchaseType } from '@/lib/types/purchases';
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Package,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
} from 'lucide-react';

interface PurchaseItemsTableProps {
  data: PurchaseDetailItem[];
  onViewItem: (item: PurchaseDetailItem) => void;
  isLoading?: boolean;
}

export function PurchaseItemsTable({
  data,
  onViewItem,
  isLoading: _isLoading = false,
}: PurchaseItemsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // تعريف أعمدة الجدول
  const columns: ColumnDef<PurchaseDetailItem>[] = useMemo(
    () => [
      {
        accessorKey: 'itemName',
        header: 'اسم العنصر',
        cell: ({ row }) => (
          <div className="text-sm font-medium text-gray-900">
            {row.getValue('itemName')}
          </div>
        ),
      },
      {
        accessorKey: 'itemType',
        header: 'النوع',
        cell: ({ row }) => {
          const type = row.getValue('itemType') as PurchaseType;
          const typeConfig = {
            'معدات': { color: 'bg-blue-100 text-blue-700 border-blue-200' },
            'مواد خام': { color: 'bg-green-100 text-green-700 border-green-200' },
            'أدوات': { color: 'bg-purple-100 text-purple-700 border-purple-200' },
            'خدمات': { color: 'bg-orange-100 text-orange-700 border-orange-200' },
            'أخرى': { color: 'bg-gray-100 text-gray-700 border-gray-200' },
          };
          const config = typeConfig[type];
          return (
            <span className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium text-xs ${config.color}`}>
              {type}
            </span>
          );
        },
      },
      {
        accessorKey: 'quantity',
        header: 'الكمية',
        cell: ({ row }) => {
          const quantity = row.getValue('quantity') as number;
          const unit = row.original.unit;
          return (
            <div className="text-sm font-medium text-gray-900">
              {quantity} {unit}
            </div>
          );
        },
      },
      {
        accessorKey: 'unitPrice',
        header: 'سعر الوحدة',
        cell: ({ row }) => (
          <div className="text-sm font-medium text-gray-900">
            {row.getValue('unitPrice')} ر.ع.
          </div>
        ),
      },
      {
        accessorKey: 'totalPrice',
        header: 'السعر الإجمالي',
        cell: ({ row }) => (
          <div className="text-sm font-medium text-gray-900">
            {row.getValue('totalPrice')} ر.ع.
          </div>
        ),
      },
      {
        accessorKey: 'purchaseDate',
        header: 'تاريخ الشراء',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {row.getValue('purchaseDate')}
          </div>
        ),
      },
      {
        accessorKey: 'invoiceId',
        header: 'رقم الفاتورة',
        cell: ({ row }) => (
          <div className="font-mono text-sm text-gray-600">
            {row.getValue('invoiceId')}
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'الحالة',
        cell: ({ row }) => {
          const status = row.getValue('status') as string;
          const statusConfig = {
            'مستلم': { 
              color: 'bg-green-100 text-green-700 border-green-200',
              icon: CheckCircle 
            },
            'في الطريق': { 
              color: 'bg-blue-100 text-blue-700 border-blue-200',
              icon: Clock 
            },
            'معلق': { 
              color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
              icon: AlertTriangle 
            },
          };
          const config = statusConfig[status as keyof typeof statusConfig] || { 
            color: 'bg-gray-100 text-gray-700 border-gray-200',
            icon: Package 
          };
          const Icon = config.icon;
          return (
            <span className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium text-xs ${config.color}`}>
              <Icon className="h-3 w-3 mr-1" />
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: 'receivedDate',
        header: 'تاريخ الاستلام',
        cell: ({ row }) => {
          const date = row.getValue('receivedDate') as string;
          return date ? (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {date}
            </div>
          ) : (
            <span className="text-gray-400">—</span>
          );
        },
      },
      {
        id: 'actions',
        header: 'الإجراءات',
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewItem(item)}
                className="h-8 w-8 p-0"
                title="عرض التفاصيل"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [onViewItem]
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
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              سجل المشتريات
            </CardTitle>
            <div className="text-sm text-gray-600">إجمالي العناصر: {data.length}</div>
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
                placeholder="البحث في المشتريات..."
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
                <label className="block text-sm font-medium mb-1">نوع المشتريات</label>
                <select
                  value={(table.getColumn('itemType')?.getFilterValue() as string) ?? ''}
                  onChange={(e) =>
                    table.getColumn('itemType')?.setFilterValue(e.target.value || undefined)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">جميع الأنواع</option>
                  <option value="معدات">معدات</option>
                  <option value="مواد خام">مواد خام</option>
                  <option value="أدوات">أدوات</option>
                  <option value="خدمات">خدمات</option>
                  <option value="أخرى">أخرى</option>
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
                  <option value="مستلم">مستلم</option>
                  <option value="في الطريق">في الطريق</option>
                  <option value="معلق">معلق</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">من تاريخ</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">إلى تاريخ</label>
                <input
                  type="date"
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
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b bg-gray-50 dark:bg-gray-800">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
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
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 text-sm">
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
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              عرض {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} إلى{' '}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}{' '}
              من {table.getFilteredRowModel().rows.length} عنصر
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
              <span className="text-sm text-gray-600">
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
      </CardContent>
    </Card>
  );
}
