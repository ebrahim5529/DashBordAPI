'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  X,
  Download,
  Edit,
  Calendar,
  User,
  Package,
  DollarSign,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
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
  notes?: string;
}

interface ContractDetailsProps {
  contract: Contract;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (contract: Contract) => void;
}

export function ContractDetails({
  contract,
  isOpen,
  onClose,
  onEdit,
}: ContractDetailsProps) {
  if (!isOpen) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'مدفوعة':
        return <CheckCircle className='h-5 w-5 text-accent' />;
      case 'غير مدفوعة':
        return <AlertCircle className='h-5 w-5 text-red-500' />;
      case 'معلقة':
        return <Clock className='h-5 w-5 text-tertiary' />;
      default:
        return <Clock className='h-5 w-5 text-gray-500' />;
    }
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const calculateDuration = () => {
    const start = new Date(contract.startDate);
    const end = new Date(contract.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <Card className='w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
        <CardHeader>
          <div className='flex justify-between items-center'>
            <div className='flex items-center space-x-3 rtl:space-x-reverse'>
              <FileText className='h-6 w-6 text-primary' />
              <div>
                <CardTitle className='text-xl font-semibold text-gray-900 dark:text-white'>
                  تفاصيل العقد
                </CardTitle>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  رقم العقد: {contract.contractNumber}
                </p>
              </div>
            </div>
            <div className='flex items-center space-x-2 rtl:space-x-reverse'>
              <Button variant='outline' size='sm' onClick={() => window.print()}>
                <Download className='h-4 w-4 ml-2' />
                طباعة
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => onEdit(contract)}
              >
                <Edit className='h-4 w-4 ml-2' />
                تعديل
              </Button>
              <Button variant='ghost' size='sm' onClick={onClose}>
                <X className='h-5 w-5' />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Contract Status and Type */}
          <div className='flex flex-wrap gap-4'>
            <div className='flex items-center space-x-2 rtl:space-x-reverse'>
              {getStatusIcon(contract.status)}
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(contract.status)}`}
              >
                {contract.status}
              </span>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(contract.type)}`}
            >
              {contract.type}
            </span>
          </div>

          {/* Main Information Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {/* Customer Information */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center'>
                  <User className='h-4 w-4 ml-2' />
                  معلومات العميل
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      اسم العميل
                    </p>
                    <p className='font-medium text-gray-900 dark:text-white'>
                      {contract.customerName}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      رقم العقد
                    </p>
                    <p className='font-medium text-gray-900 dark:text-white'>
                      {contract.contractNumber}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Information */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center'>
                  <DollarSign className='h-4 w-4 ml-2' />
                  المعلومات المالية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      المبلغ الإجمالي
                    </p>
                    <p className='font-medium text-gray-900 dark:text-white text-lg'>
                      ${contract.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      نوع العقد
                    </p>
                    <p className='font-medium text-gray-900 dark:text-white'>
                      {contract.type}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Duration Information */}
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center'>
                  <Calendar className='h-4 w-4 ml-2' />
                  مدة العقد
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      تاريخ البداية
                    </p>
                    <p className='font-medium text-gray-900 dark:text-white'>
                      {formatDate(contract.startDate)}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      تاريخ النهاية
                    </p>
                    <p className='font-medium text-gray-900 dark:text-white'>
                      {formatDate(contract.endDate)}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      المدة
                    </p>
                    <p className='font-medium text-gray-900 dark:text-white'>
                      {calculateDuration()} يوم
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Equipment Information */}
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center'>
                <Package className='h-4 w-4 ml-2' />
                المعدات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-gray-900 dark:text-white'>
                {contract.equipment}
              </p>
            </CardContent>
          </Card>

          {/* Notes */}
          {contract.notes && (
            <Card>
              <CardHeader className='pb-3'>
                <CardTitle className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                  ملاحظات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-900 dark:text-white'>
                  {contract.notes}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Contract Timeline */}
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                سجل العقد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center space-x-3 rtl:space-x-reverse'>
                  <div className='w-2 h-2 bg-primary rounded-full'></div>
                  <div>
                    <p className='text-sm font-medium text-gray-900 dark:text-white'>
                      تم إنشاء العقد
                    </p>
                    <p className='text-xs text-gray-600 dark:text-gray-400'>
                      {formatDate(contract.createdDate)}
                    </p>
                  </div>
                </div>
                <div className='flex items-center space-x-3 rtl:space-x-reverse'>
                  <div className='w-2 h-2 bg-accent rounded-full'></div>
                  <div>
                    <p className='text-sm font-medium text-gray-900 dark:text-white'>
                      تاريخ بداية العقد
                    </p>
                    <p className='text-xs text-gray-600 dark:text-gray-400'>
                      {formatDate(contract.startDate)}
                    </p>
                  </div>
                </div>
                <div className='flex items-center space-x-3 rtl:space-x-reverse'>
                  <div className='w-2 h-2 bg-tertiary rounded-full'></div>
                  <div>
                    <p className='text-sm font-medium text-gray-900 dark:text-white'>
                      تاريخ انتهاء العقد
                    </p>
                    <p className='text-xs text-gray-600 dark:text-gray-400'>
                      {formatDate(contract.endDate)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
