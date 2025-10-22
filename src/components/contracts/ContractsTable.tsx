'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ContractsStats } from './ContractsStats';
import {
  Search,
  // Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Calendar,
  User,
  DollarSign,
  Package,
  MapPin,
  ExternalLink,
} from 'lucide-react';

interface Contract {
  id: string;
  customerName: string;
  type: 'تأجير' | 'بيع';
  amount: number;
  status: 'مدفوعة' | 'غير مدفوعة' | 'معلقة';
  startDate: string;
  endDate: string;
  equipment: string;
  contractNumber: string;
  createdDate: string;
  deliveryAddress: string;
  locationMapLink?: string;
  totalAfterDiscount: number;
  totalPayments: number;
  remainingAmount: number;
}

interface ContractsTableProps {
  contracts: Contract[];
  onAddContract: () => void;
  onEditContract: (contract: Contract) => void;
  onDeleteContract: (id: string) => void;
  onViewContract: (contract: Contract) => void;
}

export function ContractsTable({
  contracts,
  onAddContract,
  onEditContract,
  onDeleteContract,
  onViewContract,
}: ContractsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch =
      contract.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contractNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      contract.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || contract.status === statusFilter;
    const matchesType = typeFilter === 'all' || contract.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مدفوعة':
        return 'bg-accent text-white';
      case 'غير مدفوعة':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'معلقة':
        return 'bg-tertiary/20 text-tertiary';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'تأجير':
        return 'bg-primary/20 text-primary';
      case 'بيع':
        return 'bg-secondary/20 text-secondary';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='space-y-6'>
      {/* Statistics Cards */}
      <ContractsStats contracts={contracts} />

      <Card>
        <CardHeader>
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
            <CardTitle className='text-xl font-semibold text-gray-900 dark:text-white'>
              إدارة العقود
            </CardTitle>
            <Button
              onClick={onAddContract}
              className='bg-primary hover:bg-primary/90'
            >
              <Plus className='h-4 w-4 ml-2' />
              إضافة عقد جديد
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6'>
            <div className='relative flex-1'>
              <Search className='absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              <input
                type='text'
                placeholder='البحث في العقود...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
              />
            </div>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
            >
              <option value='all'>جميع الحالات</option>
              <option value='مدفوعة'>مدفوعة</option>
              <option value='غير مدفوعة'>غير مدفوعة</option>
              <option value='معلقة'>معلقة</option>
            </select>

            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
            >
              <option value='all'>جميع الأنواع</option>
              <option value='تأجير'>تأجير</option>
              <option value='بيع'>بيع</option>
            </select>
          </div>

          {/* Table */}
          <div className='overflow-x-auto'>
            <table className='w-full min-w-[1200px]'>
              <thead>
                <tr className='border-b border-gray-200 dark:border-gray-700'>
                  <th className='text-right py-3 px-2 sm:px-4 font-medium text-gray-900 dark:text-white text-sm'>
                    رقم العقد
                  </th>
                  <th className='text-right py-3 px-2 sm:px-4 font-medium text-gray-900 dark:text-white text-sm'>
                    العميل
                  </th>
                  <th className='text-right py-3 px-2 sm:px-4 font-medium text-gray-900 dark:text-white text-sm'>
                    النوع
                  </th>
                  <th className='text-right py-3 px-2 sm:px-4 font-medium text-gray-900 dark:text-white text-sm'>
                    الإجمالي
                  </th>
                  <th className='text-right py-3 px-2 sm:px-4 font-medium text-gray-900 dark:text-white text-sm hidden md:table-cell'>
                    المدفوع
                  </th>
                  <th className='text-right py-3 px-2 sm:px-4 font-medium text-gray-900 dark:text-white text-sm hidden md:table-cell'>
                    المتبقي
                  </th>
                  <th className='text-right py-3 px-2 sm:px-4 font-medium text-gray-900 dark:text-white text-sm'>
                    الحالة
                  </th>
                  <th className='text-right py-3 px-2 sm:px-4 font-medium text-gray-900 dark:text-white text-sm hidden lg:table-cell'>
                    عنوان التوصيل
                  </th>
                  <th className='text-right py-3 px-2 sm:px-4 font-medium text-gray-900 dark:text-white text-sm hidden xl:table-cell'>
                    التواريخ
                  </th>
                  <th className='text-right py-3 px-2 sm:px-4 font-medium text-gray-900 dark:text-white text-sm'>
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredContracts.map(contract => (
                  <tr
                    key={contract.id}
                    className='border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  >
                    <td className='py-3 px-2 sm:px-4'>
                      <div className='font-medium text-gray-900 dark:text-white text-sm'>
                        {contract.contractNumber}
                      </div>
                    </td>
                    <td className='py-3 px-2 sm:px-4'>
                      <div className='flex items-center space-x-2 rtl:space-x-reverse'>
                        <User className='h-4 w-4 text-gray-400' />
                        <span className='text-gray-900 dark:text-white text-sm'>
                          {contract.customerName}
                        </span>
                      </div>
                    </td>
                    <td className='py-3 px-2 sm:px-4'>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(contract.type)}`}
                      >
                        {contract.type}
                      </span>
                    </td>
                    <td className='py-3 px-2 sm:px-4'>
                      <div className='flex items-center space-x-1 rtl:space-x-reverse'>
                        <DollarSign className='h-4 w-4 text-gray-400' />
                        <span className='font-medium text-gray-900 dark:text-white text-sm'>
                          {contract.totalAfterDiscount.toFixed(2)} ر.ع
                        </span>
                      </div>
                    </td>
                    <td className='py-3 px-2 sm:px-4 hidden md:table-cell'>
                      <div className='flex items-center space-x-1 rtl:space-x-reverse'>
                        <span className='font-medium text-green-600 dark:text-green-400 text-sm'>
                          {contract.totalPayments.toFixed(2)} ر.ع
                        </span>
                      </div>
                    </td>
                    <td className='py-3 px-2 sm:px-4 hidden md:table-cell'>
                      <div className='flex items-center space-x-1 rtl:space-x-reverse'>
                        <span className={`font-medium text-sm ${
                          contract.remainingAmount > 0 
                            ? 'text-orange-600 dark:text-orange-400' 
                            : 'text-green-600 dark:text-green-400'
                        }`}>
                          {contract.remainingAmount.toFixed(2)} ر.ع
                        </span>
                      </div>
                    </td>
                    <td className='py-3 px-2 sm:px-4'>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}
                      >
                        {contract.status}
                      </span>
                    </td>
                    <td className='py-3 px-2 sm:px-4 hidden lg:table-cell'>
                      <div className='flex flex-col space-y-1'>
                        <div className='flex items-center space-x-1 rtl:space-x-reverse'>
                          <MapPin className='h-4 w-4 text-gray-400 flex-shrink-0' />
                          <span className='text-gray-600 dark:text-gray-400 text-sm truncate max-w-[200px]'>
                            {contract.deliveryAddress}
                          </span>
                        </div>
                        {contract.locationMapLink && (
                          <a
                            href={contract.locationMapLink}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-center space-x-1 rtl:space-x-reverse text-blue-600 hover:text-blue-700 text-xs'
                          >
                            <ExternalLink className='h-3 w-3' />
                            <span>موقع قوقل ماب</span>
                          </a>
                        )}
                      </div>
                    </td>
                    <td className='py-3 px-2 sm:px-4 hidden xl:table-cell'>
                      <div className='flex items-center space-x-1 rtl:space-x-reverse'>
                        <Calendar className='h-4 w-4 text-gray-400' />
                        <div className='text-sm text-gray-600 dark:text-gray-400'>
                          <div>من: {contract.startDate}</div>
                          <div>إلى: {contract.endDate}</div>
                        </div>
                      </div>
                    </td>
                    <td className='py-3 px-2 sm:px-4'>
                      <div className='flex items-center space-x-1 sm:space-x-2 rtl:space-x-reverse'>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => onViewContract(contract)}
                          className='p-1 sm:p-2'
                          title='عرض'
                        >
                          <Eye className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => onEditContract(contract)}
                          className='p-1 sm:p-2'
                          title='تعديل'
                        >
                          <Edit className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => onDeleteContract(contract.id)}
                          className='p-1 sm:p-2 text-red-600 hover:text-red-700'
                          title='حذف'
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='p-1 sm:p-2 hidden sm:inline-flex'
                          title='تحميل'
                        >
                          <Download className='h-4 w-4' />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredContracts.length === 0 && (
            <div className='text-center py-8'>
              <Package className='h-12 w-12 text-gray-400 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
                لا توجد عقود
              </h3>
              <p className='text-gray-600 dark:text-gray-400 mb-4'>
                لم يتم العثور على عقود تطابق معايير البحث
              </p>
              <Button
                onClick={onAddContract}
                className='bg-primary hover:bg-primary/90'
              >
                <Plus className='h-4 w-4 ml-2' />
                إضافة عقد جديد
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
