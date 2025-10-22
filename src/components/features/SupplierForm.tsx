/**
 * نموذج إضافة/تعديل المورد
 */

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { SupplierFormData, supplierFormSchema } from '@/lib/schemas/supplier.schema';
import { Supplier, SupplierType } from '@/lib/types/supplier';
import { 
  availableNationalities, 
  supplierTypes, 
  supplierStatuses 
} from '@/data/suppliersData';
import {
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  FileText,
  AlertTriangle,
  Star,
  UserCheck,
  X,
  Save,
  Building,
} from 'lucide-react';

interface SupplierFormProps {
  supplier?: Supplier;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function SupplierForm({ 
  supplier, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: SupplierFormProps) {
  const [supplierType, setSupplierType] = useState<SupplierType>(
    supplier?.supplierType || 'INDIVIDUAL'
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      name: supplier?.name || '',
      email: supplier?.email || '',
      phone: supplier?.phone || '',
      address: supplier?.address || '',
      nationality: supplier?.nationality || '',
      supplierType: supplier?.supplierType || 'INDIVIDUAL',
      commercialRecord: supplier?.commercialRecord || '',
      taxNumber: supplier?.taxNumber || '',
      status: supplier?.status || 'ACTIVE',
      contactPerson: supplier?.contactPerson || '',
      contactPersonPhone: supplier?.contactPersonPhone || '',
      contactPersonEmail: supplier?.contactPersonEmail || '',
      bankName: supplier?.bankName || '',
      bankAccount: supplier?.bankAccount || '',
      iban: supplier?.iban || '',
      swiftCode: supplier?.swiftCode || '',
      notes: supplier?.notes || '',
      rating: supplier?.rating || undefined,
    },
  });

  const _watchedSupplierType = watch('supplierType');

  const handleFormSubmit = (data: SupplierFormData) => {
    onSubmit(data);
  };

  const handleSupplierTypeChange = (type: SupplierType) => {
    setSupplierType(type);
    setValue('supplierType', type);
    
    // مسح الحقول غير المناسبة
    if (type === 'INDIVIDUAL') {
      setValue('commercialRecord', '');
    } else {
      setValue('idNumber', '');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {supplier ? (
              <>
                <UserCheck className="h-5 w-5" />
                تعديل بيانات المورد
              </>
            ) : (
              <>
                <User className="h-5 w-5" />
                إضافة مورد جديد
              </>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* المعلومات الأساسية */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                المعلومات الأساسية
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* اسم المورد */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    اسم المورد <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="أدخل اسم المورد"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* نوع المورد */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    نوع المورد <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    {supplierTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleSupplierTypeChange(type.value)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                          supplierType === type.value
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {type.value === 'COMPANY' ? (
                          <Building2 className="h-4 w-4" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                        {type.label}
                      </button>
                    ))}
                  </div>
                  {errors.supplierType && (
                    <p className="text-red-500 text-xs mt-1">{errors.supplierType.message}</p>
                  )}
                </div>

                {/* رقم الهوية أو السجل التجاري */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {supplierType === 'COMPANY' ? 'السجل التجاري' : 'رقم الهوية'}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      {...register(supplierType === 'COMPANY' ? 'commercialRecord' : 'idNumber')}
                      type="text"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder={
                        supplierType === 'COMPANY' 
                          ? 'أدخل السجل التجاري' 
                          : 'أدخل رقم الهوية'
                      }
                    />
                  </div>
                  {errors.idNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.idNumber.message}</p>
                  )}
                  {errors.commercialRecord && (
                    <p className="text-red-500 text-xs mt-1">{errors.commercialRecord.message}</p>
                  )}
                </div>

                {/* الرقم الضريبي */}
                <div>
                  <label className="block text-sm font-medium mb-1">الرقم الضريبي</label>
                  <input
                    {...register('taxNumber')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="أدخل الرقم الضريبي"
                  />
                  {errors.taxNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.taxNumber.message}</p>
                  )}
                </div>

                {/* الجنسية */}
                <div>
                  <label className="block text-sm font-medium mb-1">الجنسية</label>
                  <select
                    {...register('nationality')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">اختر الجنسية</option>
                    {availableNationalities.map((nationality) => (
                      <option key={nationality} value={nationality}>
                        {nationality}
                      </option>
                    ))}
                  </select>
                  {errors.nationality && (
                    <p className="text-red-500 text-xs mt-1">{errors.nationality.message}</p>
                  )}
                </div>

                {/* الهاتف */}
                <div>
                  <label className="block text-sm font-medium mb-1">رقم الهاتف</label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      {...register('phone')}
                      type="tel"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="أدخل رقم الهاتف"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                  )}
                </div>

                {/* البريد الإلكتروني */}
                <div>
                  <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="أدخل البريد الإلكتروني"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* العنوان */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">العنوان</label>
                  <div className="relative">
                    <MapPin className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    <textarea
                      {...register('address')}
                      rows={3}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="أدخل العنوان الكامل"
                    />
                  </div>
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
                  )}
                </div>

                {/* حالة المورد */}
                <div>
                  <label className="block text-sm font-medium mb-1">حالة المورد</label>
                  <select
                    {...register('status')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {supplierStatuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                  {errors.status && (
                    <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>
                  )}
                </div>

                {/* التقييم */}
                <div>
                  <label className="block text-sm font-medium mb-1">التقييم</label>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <select
                      {...register('rating', { valueAsNumber: true })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">اختر التقييم</option>
                      <option value={1}>1 - ضعيف</option>
                      <option value={2}>2 - مقبول</option>
                      <option value={3}>3 - جيد</option>
                      <option value={4}>4 - جيد جداً</option>
                      <option value={5}>5 - ممتاز</option>
                    </select>
                  </div>
                  {errors.rating && (
                    <p className="text-red-500 text-xs mt-1">{errors.rating.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* معلومات الشخص المسؤول */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                معلومات الشخص المسؤول
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">اسم الشخص المسؤول</label>
                  <input
                    {...register('contactPerson')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="أدخل اسم الشخص المسؤول"
                  />
                  {errors.contactPerson && (
                    <p className="text-red-500 text-xs mt-1">{errors.contactPerson.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">هاتف الشخص المسؤول</label>
                  <input
                    {...register('contactPersonPhone')}
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="أدخل هاتف الشخص المسؤول"
                  />
                  {errors.contactPersonPhone && (
                    <p className="text-red-500 text-xs mt-1">{errors.contactPersonPhone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">بريد الشخص المسؤول</label>
                  <input
                    {...register('contactPersonEmail')}
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="أدخل بريد الشخص المسؤول"
                  />
                  {errors.contactPersonEmail && (
                    <p className="text-red-500 text-xs mt-1">{errors.contactPersonEmail.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* معلومات البنك */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Building className="h-5 w-5" />
                معلومات البنك
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">اسم البنك</label>
                  <input
                    {...register('bankName')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="أدخل اسم البنك"
                  />
                  {errors.bankName && (
                    <p className="text-red-500 text-xs mt-1">{errors.bankName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">رقم الحساب</label>
                  <input
                    {...register('bankAccount')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="أدخل رقم الحساب"
                  />
                  {errors.bankAccount && (
                    <p className="text-red-500 text-xs mt-1">{errors.bankAccount.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">رقم الآيبان</label>
                  <input
                    {...register('iban')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="أدخل رقم الآيبان"
                  />
                  {errors.iban && (
                    <p className="text-red-500 text-xs mt-1">{errors.iban.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">رمز السويفت</label>
                  <input
                    {...register('swiftCode')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="أدخل رمز السويفت"
                  />
                  {errors.swiftCode && (
                    <p className="text-red-500 text-xs mt-1">{errors.swiftCode.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* الملاحظات والتحذيرات */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                الملاحظات والتحذيرات
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">ملاحظات عامة</label>
                  <textarea
                    {...register('notes')}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="أدخل أي ملاحظات عامة عن المورد"
                  />
                  {errors.notes && (
                    <p className="text-red-500 text-xs mt-1">{errors.notes.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    تحذيرات خاصة
                  </label>
                  <textarea
                    {...register('warnings')}
                    rows={4}
                    className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="أدخل أي تحذيرات خاصة عن المورد"
                  />
                  {errors.warnings && (
                    <p className="text-red-500 text-xs mt-1">{errors.warnings.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isLoading ? 'جاري الحفظ...' : supplier ? 'تحديث المورد' : 'إضافة المورد'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
