/**
 * الجدول المتقدم للعقود مع جميع الميزات المتقدمة
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
import { AdvancedContract, AdvancedContractFilters, ContractType, ContractStatus } from '@/lib/types/contracts';
import {
  Search,
  Filter,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  CreditCard,
} from 'lucide-react';

interface AdvancedContractsTableProps {
  data: AdvancedContract[];
  onViewContract: (contract: AdvancedContract) => void;
  onEditContract: (contract: AdvancedContract) => void;
  onPrintContract: (contract: AdvancedContract) => void;
  filters?: AdvancedContractFilters;
  isLoading?: boolean;
}

export function AdvancedContractsTable({
  data,
  onViewContract,
  onEditContract,
  onPrintContract: _onPrintContract,
  filters: _filters = {},
  isLoading: _isLoading = false,
}: AdvancedContractsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // تعريف أعمدة الجدول المتقدم
  const columns: ColumnDef<AdvancedContract>[] = useMemo(
    () => [
      {
        accessorKey: 'contractNumber',
        header: 'رقم العقد',
        cell: ({ row }) => (
          <div className="font-mono text-sm text-gray-600">
            {row.getValue('contractNumber')}
          </div>
        ),
      },
      {
        accessorKey: 'customerName',
        header: 'اسم العميل',
        cell: ({ row }) => (
          <div className="text-sm font-medium text-gray-900">
            {row.getValue('customerName')}
          </div>
        ),
      },
      {
        accessorKey: 'contractType',
        header: 'نوع العقد',
        cell: ({ row }) => {
          const type = row.getValue('contractType') as ContractType;
          const typeConfig: Record<ContractType, { color: string }> = {
            'تأجير': { color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
            'شراء': { color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
            'صيانة': { color: 'bg-purple-100 text-purple-700 border-purple-200' },
            'خدمة': { color: 'bg-orange-100 text-orange-700 border-orange-200' },
            'تقسيط': { color: 'bg-pink-100 text-pink-700 border-pink-200' },
            'تركيب': { color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
          };
          const config = typeConfig[type] || typeConfig['تأجير'];
          return (
            <span className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium text-xs ${config.color}`}>
              {type}
            </span>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'الحالة',
        cell: ({ row }) => {
          const contract = row.original;
          const status = row.getValue('status') as ContractStatus;
          const statusConfig: Record<ContractStatus, { color: string }> = {
            'نشط': { color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
            'مسودة': { color: 'bg-gray-100 text-gray-700 border-gray-200' },
            'معتمد': { color: 'bg-blue-100 text-blue-700 border-blue-200' },
            'منتهي': { color: 'bg-slate-100 text-slate-700 border-slate-200' },
            'ملغى': { color: 'bg-rose-100 text-rose-700 border-rose-200' },
            'متأخر': { color: 'bg-red-100 text-red-700 border-red-200' },
            'ملغي': { color: 'bg-rose-100 text-rose-700 border-rose-200' },
            'معلق': { color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
          };
          const config = statusConfig[status] || statusConfig['نشط'];
          return (
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium text-xs ${config.color}`}>
                {status}
              </span>
              {contract.hasOverdue && (
                <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium text-xs bg-red-100 text-red-700 border-red-200">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  متأخر
                </span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'progress',
        header: 'التقدم',
        cell: ({ row }) => {
          const progress = row.getValue('progress') as { stages: string[]; currentStage: number };
          return (
            <div className="flex items-center gap-1 min-w-[250px]">
              {progress.stages.map((stage, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`relative w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      index <= progress.currentStage 
                        ? 'bg-gradient-to-r from-green-400 to-green-500 border-green-500 shadow-lg shadow-green-200'
                        : 'bg-gray-100 border-gray-300 hover:border-gray-400'
                    }`}>
                      {index <= progress.currentStage ? (
                        <CheckCircle className="w-3 h-3 text-white" />
                      ) : (
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      )}
                    </div>
                    <span className={`text-[9px] mt-1 text-center font-medium transition-colors duration-200 max-w-[50px] leading-tight ${
                      index <= progress.currentStage ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {stage}
                    </span>
                  </div>
                  {index < progress.stages.length - 1 && (
                    <div className={`h-1 w-4 mx-0.5 rounded-full transition-all duration-500 ${
                      index < progress.currentStage 
                        ? 'bg-gradient-to-r from-green-400 to-green-500 shadow-sm'
                        : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          );
        },
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
        id: 'actions',
        header: 'الإجراءات',
        cell: ({ row }) => {
          const contract = row.original;
          return (
            <div className="flex items-center gap-2">
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
                onClick={() => onEditContract(contract)}
                className="h-8 w-8 p-0"
                title="تعديل العقد"
              >
                <CreditCard className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [onViewContract, onEditContract]
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
            <CardTitle>جدول العقود</CardTitle>
            <div className="text-sm text-gray-600">إجمالي العقود: {data.length}</div>
          </div>
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
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="البحث في العقود..."
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
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
                  <option value="مسودة">مسودة</option>
                  <option value="معتمد">معتمد</option>
                  <option value="منتهي">منتهي</option>
                  <option value="ملغى">ملغى</option>
                </select>
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
              من {table.getFilteredRowModel().rows.length} عقود
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
