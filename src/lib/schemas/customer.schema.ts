/**
 * مخططات التحقق من بيانات العملاء باستخدام Zod
 */

import { z } from 'zod';

// مخطط نوع العميل
export const customerTypeSchema = z.enum(['INDIVIDUAL', 'COMPANY'], {
  errorMap: () => ({ message: 'نوع العميل يجب أن يكون فرد أو شركة' })
});

// مخطط حالة العميل
export const customerStatusSchema = z.enum(['ACTIVE', 'INACTIVE'], {
  errorMap: () => ({ message: 'حالة العميل يجب أن تكون نشط أو غير نشط' })
});

// مخطط نوع الملاحظة
export const noteTypeSchema = z.enum(['GENERAL', 'WARNING', 'RATING', 'COMMENT'], {
  errorMap: () => ({ message: 'نوع الملاحظة غير صحيح' })
});

// مخطط أولوية الملاحظة
export const notePrioritySchema = z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT'], {
  errorMap: () => ({ message: 'أولوية الملاحظة غير صحيحة' })
});

// مخطط رقم الهاتف
export const phoneNumberSchema = z.object({
  id: z.string().optional(),
  number: z.string()
    .regex(/^[0-9+\-\s()]+$/, 'رقم الهاتف غير صحيح')
    .min(8, 'رقم الهاتف يجب أن يكون على الأقل 8 أرقام'),
  isPrimary: z.boolean().default(false),
  type: z.enum(['MOBILE', 'LANDLINE', 'WHATSAPP']).default('MOBILE'),
  label: z.string().max(50, 'تسمية الهاتف يجب أن تكون أقل من 50 حرف').optional(),
});

// مخطط بيانات الضامن الكاملة
export const guarantorDataSchema = z.object({
  name: z.string()
    .min(2, 'اسم الضامن يجب أن يكون على الأقل حرفين')
    .max(100, 'اسم الضامن يجب أن يكون أقل من 100 حرف'),
  phone: z.string()
    .regex(/^[0-9+\-\s()]+$/, 'هاتف الضامن غير صحيح')
    .min(8, 'هاتف الضامن يجب أن يكون على الأقل 8 أرقام'),
  idNumber: z.string()
    .regex(/^[0-9]+$/, 'رقم هوية الضامن يجب أن يحتوي على أرقام فقط')
    .min(5, 'رقم هوية الضامن يجب أن يكون على الأقل 5 أرقام')
    .max(20, 'رقم هوية الضامن يجب أن يكون أقل من 20 رقم'),
  nationality: z.string()
    .max(50, 'جنسية الضامن يجب أن تكون أقل من 50 حرف'),
  address: z.string()
    .max(500, 'عنوان الضامن يجب أن يكون أقل من 500 حرف'),
  relationship: z.string()
    .max(50, 'صلة القرابة يجب أن تكون أقل من 50 حرف'),
  workPlace: z.string()
    .max(100, 'مكان العمل يجب أن يكون أقل من 100 حرف')
    .optional()
    .or(z.literal('')),
  workPhone: z.string()
    .regex(/^[0-9+\-\s()]+$/, 'هاتف العمل غير صحيح')
    .optional()
    .or(z.literal('')),
});

// مخطط إضافة/تعديل العميل
export const customerFormSchema = z.object({
  name: z.string()
    .trim()
    .min(2, 'اسم العميل يجب أن يكون على الأقل حرفين')
    .max(100, 'اسم العميل يجب أن يكون أقل من 100 حرف')
    .refine((val) => val.length >= 2, {
      message: 'اسم العميل مطلوب ويجب أن يكون على الأقل حرفين'
    }),
  
  email: z.string()
    .email('البريد الإلكتروني غير صحيح')
    .optional()
    .or(z.literal('')),
  
  phone: z.string()
    .optional()
    .or(z.literal('')),
  
  phones: z.array(phoneNumberSchema)
    .max(3, 'يمكن إضافة 3 أرقام هواتف كحد أقصى')
    .optional(),
  
  address: z.string()
    .max(500, 'العنوان يجب أن يكون أقل من 500 حرف')
    .optional()
    .or(z.literal('')),
  
  nationality: z.string()
    .max(50, 'الجنسية يجب أن تكون أقل من 50 حرف')
    .optional()
    .or(z.literal('')),
  
  customerType: customerTypeSchema,
  
  idNumber: z.string()
    .regex(/^[0-9]+$/, 'رقم الهوية يجب أن يحتوي على أرقام فقط')
    .min(5, 'رقم الهوية يجب أن يكون على الأقل 5 أرقام')
    .max(20, 'رقم الهوية يجب أن يكون أقل من 20 رقم')
    .optional()
    .or(z.literal('')),
  
  commercialRecord: z.string()
    .regex(/^[0-9]+$/, 'السجل التجاري يجب أن يحتوي على أرقام فقط')
    .optional()
    .or(z.literal('')),
  
  status: customerStatusSchema,
  
  guarantorName: z.string()
    .max(100, 'اسم الضامن يجب أن يكون أقل من 100 حرف')
    .optional()
    .or(z.literal('')),
  
  guarantorPhone: z.string()
    .regex(/^[0-9+\-\s()]+$/, 'هاتف الضامن غير صحيح')
    .optional()
    .or(z.literal('')),
  
  guarantorId: z.string()
    .regex(/^[0-9]+$/, 'رقم هوية الضامن يجب أن يحتوي على أرقام فقط')
    .optional()
    .or(z.literal('')),
  
  guarantorData: guarantorDataSchema.optional(),
  
  notes: z.string()
    .max(1000, 'الملاحظات يجب أن تكون أقل من 1000 حرف')
    .optional()
    .or(z.literal('')),
  
  warnings: z.string()
    .max(1000, 'التحذيرات يجب أن تكون أقل من 1000 حرف')
    .optional()
    .or(z.literal('')),
  
  rating: z.number()
    .min(1, 'التقييم يجب أن يكون على الأقل 1')
    .max(5, 'التقييم يجب أن يكون على الأكثر 5')
    .optional()
    .or(z.literal('')),
  
  // المرفقات (PDF أو صور) - جعلها اختيارية تماماً
  idCardCopy: z.any().optional(),
  guarantorIdCardCopy: z.any().optional(),
  commercialRecordCopy: z.any().optional(),
});

// مخطط ملاحظة العميل
export const customerNoteSchema = z.object({
  title: z.string()
    .min(2, 'عنوان الملاحظة يجب أن يكون على الأقل حرفين')
    .max(100, 'عنوان الملاحظة يجب أن يكون أقل من 100 حرف'),
  
  content: z.string()
    .min(5, 'محتوى الملاحظة يجب أن يكون على الأقل 5 أحرف')
    .max(1000, 'محتوى الملاحظة يجب أن يكون أقل من 1000 حرف'),
  
  noteType: noteTypeSchema,
  
  priority: notePrioritySchema,
  
  isPrivate: z.boolean().default(false),
});

// مخطط البحث والفلترة
export const customerFiltersSchema = z.object({
  search: z.string().optional(),
  status: customerStatusSchema.optional(),
  customerType: customerTypeSchema.optional(),
  nationality: z.string().optional(),
  hasWarnings: z.boolean().optional(),
  minRating: z.number().min(1).max(5).optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
});

// مخطط التصدير
export const customerExportSchema = z.object({
  format: z.enum(['EXCEL', 'PDF', 'CSV']),
  includeContracts: z.boolean().default(false),
  includePayments: z.boolean().default(false),
  includeNotes: z.boolean().default(false),
  filters: customerFiltersSchema.optional(),
});

// أنواع البيانات المستخرجة من المخططات
export type CustomerFormData = z.infer<typeof customerFormSchema>;
export type CustomerNoteData = z.infer<typeof customerNoteSchema>;
export type CustomerFilters = z.infer<typeof customerFiltersSchema>;
export type CustomerExportOptions = z.infer<typeof customerExportSchema>;
export type PhoneNumberData = z.infer<typeof phoneNumberSchema>;
export type GuarantorData = z.infer<typeof guarantorDataSchema>;
