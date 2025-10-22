/**
 * جدول مشتريات الموردين
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
import { SupplierPurchase } from '@/lib/types/supplier';
import {
  Search,
  Filter,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Plus,
} from 'lucide-react';

interface SupplierPurchasesTableProps {
  data: SupplierPurchase[];
  onViewPurchase: (purchase: SupplierPurchase) => void;
  onEditPurchase: (purchase: SupplierPurchase) => void;
  onDeletePurchase: (purchase: SupplierPurchase) => void;
  onAddPurchase: () => void;
  isLoading?: boolean;
}

export function SupplierPurchasesTable({
  data,
  onViewPurchase,
  onEditPurchase,
  onDeletePurchase: _onDeletePurchase,
  onAddPurchase,
  isLoading: _isLoading = false,
}: SupplierPurchasesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // تعريف أعمدة الجدول
  const columns: ColumnDef<SupplierPurchase>[] = useMemo(
    () => [
      {
        accessorKey: 'purchaseNumber',
        header: 'رقم الطلب',
        cell: ({ row }) => (
          <div className="font-mono text-sm text-gray-600">
            {row.getValue('purchaseNumber')}
          </div>
        ),
      },
      {
        accessorKey: 'supplierName',
        header: 'اسم المورد',
        cell: ({ row }) => (
          <div className="text-sm font-medium text-gray-900">
            {row.getValue('supplierName')}
          </div>
        ),
      },
      {
        accessorKey: 'orderDate',
        header: 'تاريخ الطلب',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {row.getValue('orderDate')}
          </div>
        ),
      },
      {
        accessorKey: 'expectedDeliveryDate',
        header: 'تاريخ التسليم المتوقع',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {row.getValue('expectedDeliveryDate')}
          </div>
        ),
      },
      {
        accessorKey: 'totalAmount',
        header: 'المبلغ الإجمالي',
        cell: ({ row }) => (
          <div className="text-sm font-medium text-gray-900">
            {row.getValue('totalAmount')} ر.ع.
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'الحالة',
        cell: ({ row }) => {
          const status = row.getValue('status') as string;
          const statusConfig = {
            'PENDING': { 
              color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
              icon: Clock,
              label: 'معلق'
            },
            'CONFIRMED': { 
              color: 'bg-blue-100 text-blue-700 border-blue-200',
              icon: CheckCircle,
              label: 'مؤكد'
            },
            'DELIVERED': { 
              color: 'bg-green-100 text-green-700 border-green-200',
              icon: CheckCircle,
              label: 'مسلم'
            },
            'CANCELLED': { 
              color: 'bg-red-100 text-red-700 border-red-200',
              icon: XCircle,
              label: 'ملغي'
            },
          };
          const config = statusConfig[status as keyof typeof statusConfig] || { 
            color: 'bg-gray-100 text-gray-700 border-gray-200',
            icon: FileText,
            label: status
          };
          const Icon = config.icon;
          return (
            <span className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium text-xs ${config.color}`}>
              <Icon className="h-3 w-3 mr-1" />
              {config.label}
            </span>
          );
        },
      },
      {
        accessorKey: 'items',
        header: 'العناصر',
        cell: ({ row }) => {
          const items = row.getValue('items') as any[];
          return (
            <div className="text-sm text-gray-600">
              {items.length} عنصر
            </div>
          );
        },
      },
      {
        id: 'actions',
        header: 'الإجراءات',
        cell: ({ row }) => {
          const purchase = row.original;
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewPurchase(purchase)}
                className="h-8 w-8 p-0"
                title="عرض التفاصيل"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditPurchase(purchase)}
                className="h-8 w-8 p-0"
                title="تعديل الطلب"
              >
                <FileText className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [onViewPurchase, onEditPurchase]
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
            <CardTitle>جدول مشتريات الموردين</CardTitle>
            <div className="text-sm text-gray-600">إجمالي الطلبات: {data.length}</div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => console.log('تصدير المشتريات')}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              تصدير
            </Button>
            <Button
              onClick={onAddPurchase}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              إضافة طلب
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
                  <option value="CONFIRMED">مؤكد</option>
                  <option value="DELIVERED">مسلم</option>
                  <option value="CANCELLED">ملغي</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">المورد</label>
                <select
                  value={(table.getColumn('supplierName')?.getFilterValue() as string) ?? ''}
                  onChange={(e) =>
                    table.getColumn('supplierName')?.setFilterValue(e.target.value || undefined)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">جميع الموردين</option>
                  <option value="شركة المعدات الحديثة">شركة المعدات الحديثة</option>
                  <option value="مؤسسة المواد الخام">مؤسسة المواد الخام</option>
                  <option value="شركة الأدوات المتقدمة">شركة الأدوات المتقدمة</option>
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
              من {table.getFilteredRowModel().rows.length} طلب
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
