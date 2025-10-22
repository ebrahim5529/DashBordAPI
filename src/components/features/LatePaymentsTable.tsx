/**
 * مكون جدول المدفوعات المتأخرة
 * جدول تفاعلي مع إمكانية البحث والفرز والتصفية
 */

'use client';

import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import {
  Search,
  Filter,
  Download,
  Phone,
  Mail,
  MessageSquare,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  MoreHorizontal,
  Calendar,
  DollarSign,
  Clock,
  User,
} from 'lucide-react';
import { Installment } from '@/lib/schemas/payment.schema';
import { formatDate } from '@/lib/utils/formatDate.util';

// تعريف العمود المساعد
const _columnHelper = createColumnHelper<Installment>();

// مكون البحث
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'البحث...',
}) => (
  <div className='relative'>
    <Search className='absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
    <input
      type='text'
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className='w-full pr-10 pl-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
    />
  </div>
);

// مكون فلتر الحالة
interface StatusFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ value, onChange }) => {
  const statusOptions: { value: string; label: string; color: string }[] = [
    {
      value: 'PENDING',
      label: 'معلق',
      color:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    },
    {
      value: 'PAID',
      label: 'مدفوع',
      color:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    },
    {
      value: 'OVERDUE',
      label: 'متأخر',
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    },
    {
      value: 'CANCELLED',
      label: 'ملغي',
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    },
  ];

  const toggleStatus = (status: string) => {
    if (value.includes(status)) {
      onChange(value.filter(s => s !== status));
    } else {
      onChange([...value, status]);
    }
  };

  return (
    <div className='flex flex-wrap gap-2'>
      {statusOptions.map(option => (
        <button
          key={option.value}
          onClick={() => toggleStatus(option.value)}
          className={`px-3 py-1 text-xs rounded-full border transition-colors ${
            value.includes(option.value)
              ? option.color
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

// مكون فلتر الأولوية
interface PriorityFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const PriorityFilter: React.FC<PriorityFilterProps> = ({ value, onChange }) => {
  const priorityOptions: { value: string; label: string; color: string }[] = [
    {
      value: 'low',
      label: 'منخفضة',
      color:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    },
    {
      value: 'medium',
      label: 'متوسطة',
      color:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    },
    {
      value: 'high',
      label: 'عالية',
      color:
        'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    },
    {
      value: 'urgent',
      label: 'عاجلة',
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    },
  ];

  const togglePriority = (priority: string) => {
    if (value.includes(priority)) {
      onChange(value.filter(p => p !== priority));
    } else {
      onChange([...value, priority]);
    }
  };

  return (
    <div className='flex flex-wrap gap-2'>
      {priorityOptions.map(option => (
        <button
          key={option.value}
          onClick={() => togglePriority(option.value)}
          className={`px-3 py-1 text-xs rounded-full border transition-colors ${
            value.includes(option.value)
              ? option.color
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

// تعريف أعمدة الجدول
const createColumns = (): ColumnDef<Installment>[] => [
  // عمود العميل
  {
    id: 'customer',
    header: 'اسم العميل',
    cell: ({ row: _row }) => (
      <div className='flex items-center space-x-3 rtl:space-x-reverse'>
        <div className='p-2 bg-red-100 dark:bg-red-900 rounded-lg'>
          <AlertCircle className='h-4 w-4 text-red-600 dark:text-red-400' />
        </div>
        <div>
          <div className='font-medium text-gray-900 dark:text-white'>
            عميل غير محدد
          </div>
          <div className='text-sm text-gray-500 dark:text-gray-400'>
            عقد غير محدد
          </div>
        </div>
      </div>
    ),
  },

  // عمود المبلغ
  {
    id: 'amount',
    accessorKey: 'amount',
    header: 'المبلغ',
    cell: ({ getValue }) => (
      <div className='flex items-center space-x-1 rtl:space-x-reverse'>
        <DollarSign className='h-4 w-4 text-gray-400' />
        <span className='font-medium text-gray-900 dark:text-white'>
          {(getValue() as number).toLocaleString()} ريال
        </span>
      </div>
    ),
  },

  // عمود تاريخ الاستحقاق
  {
    id: 'dueDate',
    accessorKey: 'dueDate',
    header: 'تاريخ الاستحقاق',
    cell: ({ getValue }) => (
      <div className='flex items-center space-x-1 rtl:space-x-reverse'>
        <Calendar className='h-4 w-4 text-gray-400' />
        <span className='text-gray-900 dark:text-white'>
          {formatDate(getValue() as Date)}
        </span>
      </div>
    ),
  },

  // عمود الأيام المتأخرة
  {
    id: 'daysLate',
    header: 'الأيام المتأخرة',
    cell: ({ row }) => {
      const dueDate = new Date(row.original.dueDate);
      const today = new Date();
      const daysLate = Math.floor(
        (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const colorClass =
        daysLate > 10
          ? 'text-red-600 dark:text-red-400'
          : daysLate > 5
            ? 'text-orange-600 dark:text-orange-400'
            : 'text-yellow-600 dark:text-yellow-400';

      return (
        <div className='flex items-center space-x-1 rtl:space-x-reverse'>
          <Clock className='h-4 w-4 text-gray-400' />
          <span className={`font-medium ${colorClass}`}>{daysLate} يوم</span>
        </div>
      );
    },
  },

  // عمود الشخص المسؤول
  {
    id: 'contactPerson',
    header: 'الشخص المسؤول',
    cell: ({ row }) => (
      <div>
        <div className='flex items-center space-x-1 rtl:space-x-reverse'>
          <User className='h-4 w-4 text-gray-400' />
          <span className='font-medium text-gray-900 dark:text-white'>
            عميل #{row.original.contractId}
          </span>
        </div>
        <div className='text-sm text-gray-500 dark:text-gray-400'>
          رقم العقد: {row.original.contractId}
        </div>
      </div>
    ),
  },

  // عمود الحالة
  {
    id: 'status',
    accessorKey: 'status',
    header: 'الحالة',
    cell: ({ getValue }) => {
      const status = getValue() as 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
      const statusConfig = {
        PENDING: {
          label: 'معلق',
          color:
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        },
        PAID: {
          label: 'مدفوع',
          color:
            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        },
        OVERDUE: {
          label: 'متأخر',
          color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        },
        CANCELLED: {
          label: 'ملغي',
          color:
            'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
        },
      };

      const config = statusConfig[status as keyof typeof statusConfig];
      return (
        <span
          className={`px-2 py-1 text-xs rounded-full ${config?.color || 'bg-gray-100 text-gray-800'}`}
        >
          {config?.label || status}
        </span>
      );
    },
  },

  // عمود الأولوية
  {
    id: 'priority',
    header: 'الأولوية',
    cell: ({ row }) => {
      const dueDate = new Date(row.original.dueDate);
      const today = new Date();
      const daysLate = Math.floor(
        (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      let priority = 'low';
      if (daysLate > 30) priority = 'urgent';
      else if (daysLate > 15) priority = 'high';
      else if (daysLate > 5) priority = 'medium';

      const priorityConfig = {
        low: {
          label: 'منخفضة',
          color:
            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        },
        medium: {
          label: 'متوسطة',
          color:
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        },
        high: {
          label: 'عالية',
          color:
            'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
        },
        urgent: {
          label: 'عاجلة',
          color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        },
      };

      const config = priorityConfig[priority as keyof typeof priorityConfig];
      return (
        <span className={`px-2 py-1 text-xs rounded-full ${config.color}`}>
          {config.label}
        </span>
      );
    },
  },

  // عمود الإجراءات
  {
    id: 'actions',
    header: 'الإجراءات',
    cell: ({ row: _row }) => (
      <div className='flex items-center space-x-2 rtl:space-x-reverse'>
        <Button variant='outline' size='sm' title='اتصال'>
          <Phone className='h-4 w-4' />
        </Button>
        <Button variant='outline' size='sm' title='إرسال بريد إلكتروني'>
          <Mail className='h-4 w-4' />
        </Button>
        <Button variant='outline' size='sm' title='إرسال رسالة'>
          <MessageSquare className='h-4 w-4' />
        </Button>
        <Button variant='outline' size='sm' title='المزيد'>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </div>
    ),
  },
];

// مكون الجدول الرئيسي
interface LatePaymentsTableProps {
  data: Installment[];
  isLoading?: boolean;
}

const LatePaymentsTable: React.FC<LatePaymentsTableProps> = ({
  data,
  isLoading = false,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);

  // إنشاء الأعمدة
  const columns = useMemo(() => createColumns(), []);

  // تصفية البيانات
  const filteredData = useMemo(() => {
    return data.filter(installment => {
      // فلتر الحالة
      if (
        statusFilter.length > 0 &&
        !statusFilter.includes(installment.status)
      ) {
        return false;
      }

      // فلتر الأولوية (حساب الأولوية بناءً على الأيام المتأخرة)
      if (priorityFilter.length > 0) {
        const dueDate = new Date(installment.dueDate);
        const today = new Date();
        const daysLate = Math.floor(
          (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        let priority = 'low';
        if (daysLate > 30) priority = 'urgent';
        else if (daysLate > 15) priority = 'high';
        else if (daysLate > 5) priority = 'medium';

        if (!priorityFilter.includes(priority)) {
          return false;
        }
      }

      return true;
    });
  }, [data, statusFilter, priorityFilter]);

  // إنشاء الجدول
  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div>
            <CardTitle>قائمة المدفوعات المتأخرة</CardTitle>
            <CardDescription>
              جميع المدفوعات المتأخرة مع إمكانية البحث والفرز
            </CardDescription>
          </div>
          <div className='flex items-center space-x-2 rtl:space-x-reverse'>
            <Button variant='outline' size='sm'>
              <Download className='h-4 w-4 mr-2' />
              تصدير
            </Button>
            <Button variant='outline' size='sm'>
              <Filter className='h-4 w-4 mr-2' />
              فلتر متقدم
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* شريط البحث والفلترة */}
        <div className='space-y-4 mb-6'>
          {/* البحث العام */}
          <div className='max-w-md'>
            <SearchInput
              value={globalFilter}
              onChange={setGlobalFilter}
              placeholder='البحث في جميع الحقول...'
            />
          </div>

          {/* فلاتر الحالة والأولوية */}
          <div className='space-y-3'>
            <div>
              <label className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block'>
                فلتر حسب الحالة:
              </label>
              <StatusFilter value={statusFilter} onChange={setStatusFilter} />
            </div>

            <div>
              <label className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block'>
                فلتر حسب الأولوية:
              </label>
              <PriorityFilter
                value={priorityFilter}
                onChange={setPriorityFilter}
              />
            </div>
          </div>
        </div>

        {/* الجدول */}
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr
                  key={headerGroup.id}
                  className='border-b border-gray-200 dark:border-gray-700'
                >
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className='px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800'
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={`flex items-center space-x-1 rtl:space-x-reverse ${
                            header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : ''
                          }`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <span>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </span>
                          {header.column.getCanSort() && (
                            <span className='text-gray-400'>
                              {{
                                asc: <ChevronUp className='h-4 w-4' />,
                                desc: <ChevronDown className='h-4 w-4' />,
                              }[header.column.getIsSorted() as string] ?? (
                                <ChevronsUpDown className='h-4 w-4' />
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                // حالة التحميل
                Array.from({ length: 5 }).map((_, index) => (
                  <tr
                    key={index}
                    className='border-b border-gray-200 dark:border-gray-700'
                  >
                    {columns.map((_, colIndex) => (
                      <td key={colIndex} className='px-4 py-4'>
                        <div className='animate-pulse'>
                          <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded'></div>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : table.getRowModel().rows.length === 0 ? (
                // حالة عدم وجود بيانات
                <tr>
                  <td
                    colSpan={columns.length}
                    className='px-4 py-8 text-center text-gray-500 dark:text-gray-400'
                  >
                    لا توجد مدفوعات متأخرة
                  </td>
                </tr>
              ) : (
                // البيانات الفعلية
                table.getRowModel().rows.map(row => (
                  <tr
                    key={row.id}
                    className='border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
                  >
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className='px-4 py-4'>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* شريط التنقل */}
        <div className='flex items-center justify-between mt-6'>
          <div className='text-sm text-gray-700 dark:text-gray-300'>
            عرض{' '}
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}{' '}
            إلى{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{' '}
            من {table.getFilteredRowModel().rows.length} نتيجة
          </div>

          <div className='flex items-center space-x-2 rtl:space-x-reverse'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              الأولى
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              السابقة
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              التالية
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              الأخيرة
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LatePaymentsTable;
