'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Save, Calendar, User, Package, DollarSign } from 'lucide-react';

interface Contract {
  id?: string;
  customerName: string;
  type: 'تأجير' | 'بيع';
  amount: number;
  status: 'مدفوعة' | 'غير مدفوعة' | 'معلقة';
  startDate: string;
  endDate: string;
  equipment: string;
  contractNumber: string;
  notes?: string;
}

interface ContractFormProps {
  contract?: Contract;
  isOpen: boolean;
  onClose: () => void;
  onSave: (contract: Contract) => void;
}

export function ContractForm({
  contract,
  isOpen,
  onClose,
  onSave,
}: ContractFormProps) {
  const [formData, setFormData] = useState<Contract>({
    customerName: '',
    type: 'تأجير',
    amount: 0,
    status: 'معلقة',
    startDate: '',
    endDate: '',
    equipment: '',
    contractNumber: '',
    notes: '',
    ...contract,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'اسم العميل مطلوب';
    }
    if (!formData.contractNumber.trim()) {
      newErrors.contractNumber = 'رقم العقد مطلوب';
    }
    if (formData.amount <= 0) {
      newErrors.amount = 'المبلغ يجب أن يكون أكبر من صفر';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'تاريخ البداية مطلوب';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'تاريخ النهاية مطلوب';
    }
    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.startDate) > new Date(formData.endDate)
    ) {
      newErrors.endDate = 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية';
    }
    if (!formData.equipment.trim()) {
      newErrors.equipment = 'وصف المعدات مطلوب';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleInputChange = (field: keyof Contract, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <Card className='w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
        <CardHeader>
          <div className='flex justify-between items-center'>
            <CardTitle className='text-xl font-semibold text-gray-900 dark:text-white'>
              {contract ? 'تعديل العقد' : 'إضافة عقد جديد'}
            </CardTitle>
            <Button variant='ghost' size='sm' onClick={onClose}>
              <X className='h-5 w-5' />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Customer and Contract Number */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  <User className='h-4 w-4 inline ml-1' />
                  اسم العميل *
                </label>
                <input
                  type='text'
                  value={formData.customerName}
                  onChange={e =>
                    handleInputChange('customerName', e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.customerName
                      ? 'border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                  placeholder='أدخل اسم العميل'
                />
                {errors.customerName && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.customerName}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  رقم العقد *
                </label>
                <input
                  type='text'
                  value={formData.contractNumber}
                  onChange={e =>
                    handleInputChange('contractNumber', e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.contractNumber
                      ? 'border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                  placeholder='أدخل رقم العقد'
                />
                {errors.contractNumber && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.contractNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Type and Amount */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  نوع العقد *
                </label>
                <select
                  value={formData.type}
                  onChange={e =>
                    handleInputChange('type', e.target.value as 'تأجير' | 'بيع')
                  }
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                >
                  <option value='تأجير'>تأجير</option>
                  <option value='بيع'>بيع</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  <DollarSign className='h-4 w-4 inline ml-1' />
                  المبلغ *
                </label>
                <input
                  type='number'
                  value={formData.amount}
                  onChange={e =>
                    handleInputChange('amount', parseFloat(e.target.value) || 0)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.amount
                      ? 'border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                  placeholder='أدخل المبلغ'
                  min='0'
                  step='0.01'
                />
                {errors.amount && (
                  <p className='text-red-500 text-sm mt-1'>{errors.amount}</p>
                )}
              </div>
            </div>

            {/* Dates */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  <Calendar className='h-4 w-4 inline ml-1' />
                  تاريخ البداية *
                </label>
                <input
                  type='date'
                  value={formData.startDate}
                  onChange={e => handleInputChange('startDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.startDate
                      ? 'border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                />
                {errors.startDate && (
                  <p className='text-red-500 text-sm mt-1'>
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  <Calendar className='h-4 w-4 inline ml-1' />
                  تاريخ النهاية *
                </label>
                <input
                  type='date'
                  value={formData.endDate}
                  onChange={e => handleInputChange('endDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.endDate
                      ? 'border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                />
                {errors.endDate && (
                  <p className='text-red-500 text-sm mt-1'>{errors.endDate}</p>
                )}
              </div>
            </div>

            {/* Equipment */}
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                <Package className='h-4 w-4 inline ml-1' />
                وصف المعدات *
              </label>
              <textarea
                value={formData.equipment}
                onChange={e => handleInputChange('equipment', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.equipment
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                placeholder='أدخل وصف المعدات'
              />
              {errors.equipment && (
                <p className='text-red-500 text-sm mt-1'>{errors.equipment}</p>
              )}
            </div>

            {/* Status and Notes */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  حالة العقد
                </label>
                <select
                  value={formData.status}
                  onChange={e =>
                    handleInputChange(
                      'status',
                      e.target.value as 'مدفوعة' | 'غير مدفوعة' | 'معلقة'
                    )
                  }
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                >
                  <option value='معلقة'>معلقة</option>
                  <option value='مدفوعة'>مدفوعة</option>
                  <option value='غير مدفوعة'>غير مدفوعة</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  ملاحظات
                </label>
                <textarea
                  value={formData.notes || ''}
                  onChange={e => handleInputChange('notes', e.target.value)}
                  rows={3}
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                  placeholder='أدخل أي ملاحظات إضافية'
                />
              </div>
            </div>

            {/* Actions */}
            <div className='flex justify-end space-x-3 rtl:space-x-reverse pt-4'>
              <Button type='button' variant='outline' onClick={onClose}>
                إلغاء
              </Button>
              <Button type='submit' className='bg-primary hover:bg-primary/90'>
                <Save className='h-4 w-4 ml-2' />
                {contract ? 'حفظ التعديلات' : 'إضافة العقد'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
