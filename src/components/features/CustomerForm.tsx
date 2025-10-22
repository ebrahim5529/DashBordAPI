/**
 * نموذج إضافة/تعديل العميل
 */

'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { CustomerFormData, customerFormSchema } from '@/lib/schemas/customer.schema';
import { Customer, CustomerType } from '@/lib/types/customer';
import { availableNationalities, customerTypes, customerStatuses } from '@/data/customersData';
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
  Plus,
  Trash2,
  Upload,
  Image,
} from 'lucide-react';

interface CustomerFormProps {
  customer?: Customer;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function CustomerForm({ customer, onSubmit, onCancel, isLoading = false }: CustomerFormProps) {
  const [customerType, setCustomerType] = useState<CustomerType>(
    customer?.customerType || 'INDIVIDUAL'
  );
  const [showGuarantorData, setShowGuarantorData] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<{
    idCardCopy?: File;
    guarantorIdCardCopy?: File;
    commercialRecordCopy?: File;
  }>({});
  const [previewUrls, setPreviewUrls] = useState<{
    idCardCopy?: string;
    guarantorIdCardCopy?: string;
    commercialRecordCopy?: string;
  }>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: customer?.name || '',
      email: customer?.email || '',
      phone: customer?.phone || '',
      phones: customer?.phones || [],
      address: customer?.address || '',
      nationality: customer?.nationality || '',
      customerType: customer?.customerType || 'INDIVIDUAL',
      idNumber: customer?.idNumber || '',
      commercialRecord: customer?.commercialRecord || '',
      status: customer?.status || 'ACTIVE',
      guarantorName: customer?.guarantorName || '',
      guarantorPhone: customer?.guarantorPhone || '',
      guarantorId: customer?.guarantorId || '',
      guarantorData: customer?.guarantorData ? {
        name: customer.guarantorData.name || '',
        phone: customer.guarantorData.phone || '',
        idNumber: customer.guarantorData.idNumber || '',
        nationality: customer.guarantorData.nationality || '',
        address: customer.guarantorData.address || '',
        relationship: customer.guarantorData.relationship || '',
        workPlace: customer.guarantorData.workPlace || '',
        workPhone: customer.guarantorData.workPhone || '',
      } : undefined,
      notes: customer?.notes || '',
      warnings: customer?.warnings || '',
      rating: customer?.rating || undefined,
    },
  });

  const { fields: phoneFields, append: appendPhone, remove: removePhone } = useFieldArray({
    control,
    name: 'phones',
  });

  const watchedCustomerType = watch('customerType');
  const watchedNationality = watch('nationality');

  // تنظيف URLs عند إلغاء المكون
  React.useEffect(() => {
    return () => {
      Object.values(previewUrls).forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls]);

  // تحميل الملفات الموجودة مسبقاً عند التعديل
  React.useEffect(() => {
    if (customer) {
      // هنا يمكن إضافة منطق لتحميل الملفات الموجودة من الخادم
      // إذا كانت هناك ملفات محفوظة مسبقاً
    }
  }, [customer]);

  // معالجة رفع الملفات
  const handleFileChange = (fieldName: string, file: File | null) => {
    setSelectedFiles(prev => ({
      ...prev,
      [fieldName]: file || undefined
    }));

    // إنشاء URL معاينة للصور
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrls(prev => ({
        ...prev,
        [fieldName]: url
      }));
    } else if (file) {
      // للملفات غير الصور (مثل PDF)، احذف المعاينة
      setPreviewUrls(prev => {
        const newUrls = { ...prev };
        delete newUrls[fieldName as keyof typeof newUrls];
        return newUrls;
      });
    } else {
      // إذا لم يتم اختيار ملف، احذف المعاينة
      setPreviewUrls(prev => {
        const newUrls = { ...prev };
        delete newUrls[fieldName as keyof typeof newUrls];
        return newUrls;
      });
    }
  };

  const handleFormSubmit = (data: any) => {
    // إضافة الملفات المختارة إلى البيانات
    const formData = {
      ...data,
      idCardCopy: selectedFiles.idCardCopy,
      guarantorIdCardCopy: selectedFiles.guarantorIdCardCopy,
      commercialRecordCopy: selectedFiles.commercialRecordCopy,
    };
    onSubmit(formData);
  };

  const handleCustomerTypeChange = (type: CustomerType) => {
    setCustomerType(type);
    setValue('customerType', type);
    
    // لا نحتاج لمسح أي حقول لأن كلاهما متاح الآن
  };

  // إضافة رقم هاتف جديد
  const addPhoneNumber = () => {
    if (phoneFields.length < 3) {
      appendPhone({
        number: '',
        isPrimary: phoneFields.length === 0, // الأول يكون رئيسي
        type: 'MOBILE',
        label: '',
      });
    }
  };

  // تعيين رقم هاتف كرئيسي
  const setPrimaryPhone = (index: number) => {
    phoneFields.forEach((_, i) => {
      setValue(`phones.${i}.isPrimary`, i === index);
    });
  };

  // التحقق من إظهار بيانات الضامن
  React.useEffect(() => {
    const shouldShowGuarantor = Boolean(
      watchedNationality && 
      watchedNationality !== 'عماني' && 
      watchedCustomerType === 'INDIVIDUAL'
    );
    setShowGuarantorData(shouldShowGuarantor);
  }, [watchedNationality, watchedCustomerType]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {customer ? (
              <>
                <UserCheck className="h-5 w-5" />
                تعديل بيانات العميل
              </>
            ) : (
              <>
                <User className="h-5 w-5" />
                إضافة عميل جديد
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
                {/* اسم العميل */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    اسم العميل <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="أدخل اسم العميل"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* نوع العميل */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    نوع العميل <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    {customerTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleCustomerTypeChange(type.value)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                          customerType === type.value
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
                  {errors.customerType && (
                    <p className="text-red-500 text-xs mt-1">{errors.customerType.message}</p>
                  )}
                </div>

                {/* رقم الهوية */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    رقم الهوية
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      {...register('idNumber')}
                      type="text"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="أدخل رقم الهوية"
                    />
                  </div>
                  {errors.idNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.idNumber.message}</p>
                  )}
                </div>

                {/* السجل التجاري */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    السجل التجاري
                  </label>
                  <div className="relative">
                    <Building2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      {...register('commercialRecord')}
                      type="text"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="أدخل السجل التجاري"
                    />
                  </div>
                  {errors.commercialRecord && (
                    <p className="text-red-500 text-xs mt-1">{errors.commercialRecord.message}</p>
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

                {/* الهاتف الرئيسي */}
                <div>
                  <label className="block text-sm font-medium mb-1">رقم الهاتف الرئيسي</label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      {...register('phone')}
                      type="tel"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="أدخل رقم الهاتف الرئيسي"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                  )}
                </div>

                {/* أرقام الهواتف الإضافية */}
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">أرقام هواتف إضافية (اختياري)</label>
                    {phoneFields.length < 3 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addPhoneNumber}
                        className="flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        إضافة رقم
                      </Button>
                    )}
                  </div>
                  
                  {phoneFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2 mb-2">
                      <div className="flex-1">
                        <input
                          {...register(`phones.${index}.number`)}
                          type="tel"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="رقم الهاتف"
                        />
                      </div>
                      <div className="w-32">
                        <select
                          {...register(`phones.${index}.type`)}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        >
                          <option value="MOBILE">جوال</option>
                          <option value="LANDLINE">أرضي</option>
                          <option value="WHATSAPP">واتساب</option>
                        </select>
                      </div>
                      <div className="w-24">
                        <input
                          {...register(`phones.${index}.label`)}
                          type="text"
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                          placeholder="تسمية"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setPrimaryPhone(index)}
                          className={`h-8 w-8 p-0 ${
                            field.isPrimary 
                              ? 'bg-primary text-white' 
                              : 'bg-gray-100 text-gray-600'
                          }`}
                          title="رقم رئيسي"
                        >
                          <Star className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePhone(index)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          title="حذف"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {errors.phones && (
                    <p className="text-red-500 text-xs mt-1">{errors.phones.message}</p>
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

                {/* حالة العميل */}
                <div>
                  <label className="block text-sm font-medium mb-1">حالة العميل</label>
                  <select
                    {...register('status')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {customerStatuses.map((status) => (
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

            {/* معلومات الضامن */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                معلومات الضامن {showGuarantorData ? '(مطلوب للعملاء غير العمانيين)' : '(اختياري)'}
              </h3>
              
              {showGuarantorData ? (
                // بيانات الضامن الكاملة للعملاء غير العمانيين
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      اسم الضامن <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('guarantorData.name')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="أدخل اسم الضامن"
                    />
                    {errors.guarantorData?.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.guarantorData.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      هاتف الضامن <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('guarantorData.phone')}
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="أدخل هاتف الضامن"
                    />
                    {errors.guarantorData?.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.guarantorData.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      رقم هوية الضامن <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('guarantorData.idNumber')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="أدخل رقم هوية الضامن"
                    />
                    {errors.guarantorData?.idNumber && (
                      <p className="text-red-500 text-xs mt-1">{errors.guarantorData.idNumber.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      جنسية الضامن <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('guarantorData.nationality')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">اختر جنسية الضامن</option>
                      {availableNationalities.map((nationality) => (
                        <option key={nationality} value={nationality}>
                          {nationality}
                        </option>
                      ))}
                    </select>
                    {errors.guarantorData?.nationality && (
                      <p className="text-red-500 text-xs mt-1">{errors.guarantorData.nationality.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      صلة القرابة <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('guarantorData.relationship')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="مثل: أخ، أب، صديق"
                    />
                    {errors.guarantorData?.relationship && (
                      <p className="text-red-500 text-xs mt-1">{errors.guarantorData.relationship.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">مكان العمل</label>
                    <input
                      {...register('guarantorData.workPlace')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="أدخل مكان العمل"
                    />
                    {errors.guarantorData?.workPlace && (
                      <p className="text-red-500 text-xs mt-1">{errors.guarantorData.workPlace.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      عنوان الضامن <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      {...register('guarantorData.address')}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="أدخل عنوان الضامن الكامل"
                    />
                    {errors.guarantorData?.address && (
                      <p className="text-red-500 text-xs mt-1">{errors.guarantorData.address.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      نسخة بطاقة الضامن الشخصية
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        id="guarantor-id-card"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          handleFileChange('guarantorIdCardCopy', file);
                        }}
                      />
                      <label
                        htmlFor="guarantor-id-card"
                        className="cursor-pointer text-sm text-gray-600 hover:text-primary"
                      >
                        اضغط لرفع نسخة البطاقة الشخصية (PDF أو صورة)
                      </label>
                    </div>
                    {errors.guarantorData && (
                      <p className="text-red-500 text-xs mt-1">خطأ في بيانات الضامن</p>
                    )}
                  </div>
                </div>
              ) : (
                // بيانات الضامن البسيطة
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">اسم الضامن</label>
                    <input
                      {...register('guarantorName')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="أدخل اسم الضامن"
                    />
                    {errors.guarantorName && (
                      <p className="text-red-500 text-xs mt-1">{errors.guarantorName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">هاتف الضامن</label>
                    <input
                      {...register('guarantorPhone')}
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="أدخل هاتف الضامن"
                    />
                    {errors.guarantorPhone && (
                      <p className="text-red-500 text-xs mt-1">{errors.guarantorPhone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">رقم هوية الضامن</label>
                    <input
                      {...register('guarantorId')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="أدخل رقم هوية الضامن"
                    />
                    {errors.guarantorId && (
                      <p className="text-red-500 text-xs mt-1">{errors.guarantorId.message}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* المرفقات */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  المرفقات
                </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    نسخة البطاقة الشخصية للعميل
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {previewUrls.idCardCopy ? (
                      <div className="space-y-2">
                        <img
                          src={previewUrls.idCardCopy}
                          alt="معاينة البطاقة الشخصية"
                          className="max-w-full h-32 object-contain mx-auto rounded border"
                        />
                        <p className="text-sm text-green-600">{selectedFiles.idCardCopy?.name}</p>
                        <button
                          type="button"
                          onClick={() => handleFileChange('idCardCopy', null)}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          إزالة الصورة
                        </button>
                      </div>
                    ) : (customer as any)?.idCardCopyPath ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center h-32 bg-gray-100 rounded border">
                          <div className="text-center">
                            <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">ملف موجود</p>
                            <a
                              href={(customer as any).idCardCopyPath}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-700"
                            >
                              عرض الملف
                            </a>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => document.getElementById('customer-id-card')?.click()}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          استبدال الملف
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          id="customer-id-card"
                          onChange={(e) => handleFileChange('idCardCopy', e.target.files?.[0] || null)}
                        />
                        <label
                          htmlFor="customer-id-card"
                          className="cursor-pointer text-sm text-gray-600 hover:text-primary"
                        >
                          {selectedFiles.idCardCopy ? selectedFiles.idCardCopy.name : 'اضغط لرفع نسخة البطاقة الشخصية (PDF أو صورة)'}
                        </label>
                      </>
                    )}
                  </div>
                  {errors.idCardCopy && (
                    <p className="text-red-500 text-xs mt-1">خطأ في رفع الملف</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    نسخة بطاقة الضامن الشخصية
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {previewUrls.guarantorIdCardCopy ? (
                      <div className="space-y-2">
                        <img
                          src={previewUrls.guarantorIdCardCopy}
                          alt="معاينة بطاقة الضامن"
                          className="max-w-full h-32 object-contain mx-auto rounded border"
                        />
                        <p className="text-sm text-green-600">{selectedFiles.guarantorIdCardCopy?.name}</p>
                        <button
                          type="button"
                          onClick={() => handleFileChange('guarantorIdCardCopy', null)}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          إزالة الصورة
                        </button>
                      </div>
                    ) : (customer as any)?.guarantorIdCardCopyPath ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center h-32 bg-gray-100 rounded border">
                          <div className="text-center">
                            <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">ملف موجود</p>
                            <a
                              href={(customer as any).guarantorIdCardCopyPath}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-700"
                            >
                              عرض الملف
                            </a>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => document.getElementById('guarantor-id-card-main')?.click()}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          استبدال الملف
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          id="guarantor-id-card-main"
                          onChange={(e) => handleFileChange('guarantorIdCardCopy', e.target.files?.[0] || null)}
                        />
                        <label
                          htmlFor="guarantor-id-card-main"
                          className="cursor-pointer text-sm text-gray-600 hover:text-primary"
                        >
                          {selectedFiles.guarantorIdCardCopy ? selectedFiles.guarantorIdCardCopy.name : 'اضغط لرفع نسخة بطاقة الضامن (PDF أو صورة)'}
                        </label>
                      </>
                    )}
                  </div>
                  {errors.guarantorIdCardCopy && (
                    <p className="text-red-500 text-xs mt-1">خطأ في رفع الملف</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    نسخة السجل التجاري
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {previewUrls.commercialRecordCopy ? (
                      <div className="space-y-2">
                        <img
                          src={previewUrls.commercialRecordCopy}
                          alt="معاينة السجل التجاري"
                          className="max-w-full h-32 object-contain mx-auto rounded border"
                        />
                        <p className="text-sm text-green-600">{selectedFiles.commercialRecordCopy?.name}</p>
                        <button
                          type="button"
                          onClick={() => handleFileChange('commercialRecordCopy', null)}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          إزالة الصورة
                        </button>
                      </div>
                    ) : (customer as any)?.commercialRecordCopyPath ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center h-32 bg-gray-100 rounded border">
                          <div className="text-center">
                            <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">ملف موجود</p>
                            <a
                              href={(customer as any).commercialRecordCopyPath}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-700"
                            >
                              عرض الملف
                            </a>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => document.getElementById('commercial-record')?.click()}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          استبدال الملف
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          id="commercial-record"
                          onChange={(e) => handleFileChange('commercialRecordCopy', e.target.files?.[0] || null)}
                        />
                        <label
                          htmlFor="commercial-record"
                          className="cursor-pointer text-sm text-gray-600 hover:text-primary"
                        >
                          {selectedFiles.commercialRecordCopy ? selectedFiles.commercialRecordCopy.name : 'اضغط لرفع نسخة السجل التجاري (PDF أو صورة)'}
                        </label>
                      </>
                    )}
                  </div>
                  {errors.commercialRecordCopy && (
                    <p className="text-red-500 text-xs mt-1">خطأ في رفع الملف</p>
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
                    placeholder="أدخل أي ملاحظات عامة عن العميل"
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
                    placeholder="أدخل أي تحذيرات خاصة عن العميل"
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
                {isLoading ? 'جاري الحفظ...' : customer ? 'تحديث العميل' : 'إضافة العميل'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
