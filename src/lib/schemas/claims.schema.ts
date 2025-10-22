/**
 * مخططات التحقق من بيانات المطالبات باستخدام Zod
 */

import { z } from 'zod';

// مخطط حالة المطالبة
export const claimStatusSchema = z.enum(['PENDING', 'PARTIAL', 'PAID', 'OVERDUE', 'CANCELLED'], {
  errorMap: () => ({ message: 'حالة المطالبة غير صحيحة' })
});

// مخطط نوع التذكير
export const reminderTypeSchema = z.enum(['SMS', 'EMAIL', 'CALL', 'LETTER'], {
  errorMap: () => ({ message: 'نوع التذكير غير صحيح' })
});

// مخطط نوع الدفعة
export const paymentTypeSchema = z.enum(['CASH', 'BANK_TRANSFER', 'CHECK', 'CREDIT_CARD', 'INSTALLMENT'], {
  errorMap: () => ({ message: 'نوع الدفعة غير صحيح' })
});

// مخطط أولوية المطالبة
export const claimPrioritySchema = z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT'], {
  errorMap: () => ({ message: 'أولوية المطالبة غير صحيحة' })
});

// مخطط تسجيل دفعة جديدة
export const paymentFormSchema = z.object({
  amount: z.number()
    .min(0.01, 'المبلغ يجب أن يكون أكبر من صفر')
    .max(999999, 'المبلغ كبير جداً'),
  
  paymentType: paymentTypeSchema,
  
  paymentDate: z.date({
    required_error: 'تاريخ الدفعة مطلوب'
  }),
  
  reference: z.string()
    .max(100, 'المرجع يجب أن يكون أقل من 100 حرف')
    .optional()
    .or(z.literal('')),
  
  notes: z.string()
    .max(500, 'الملاحظات يجب أن تكون أقل من 500 حرف')
    .optional()
    .or(z.literal('')),
});

// مخطط إصدار إيصال
export const receiptFormSchema = z.object({
  receiptNumber: z.string()
    .min(1, 'رقم الإيصال مطلوب')
    .max(50, 'رقم الإيصال يجب أن يكون أقل من 50 حرف'),
  
  paymentAmount: z.number()
    .min(0.01, 'المبلغ يجب أن يكون أكبر من صفر'),
  
  paymentType: paymentTypeSchema,
  
  paymentDate: z.date({
    required_error: 'تاريخ الدفعة مطلوب'
  }),
  
  reference: z.string()
    .max(100, 'المرجع يجب أن يكون أقل من 100 حرف')
    .optional()
    .or(z.literal('')),
  
  notes: z.string()
    .max(500, 'الملاحظات يجب أن تكون أقل من 500 حرف')
    .optional()
    .or(z.literal('')),
});

// مخطط إرسال تذكير
export const reminderFormSchema = z.object({
  reminderType: reminderTypeSchema,
  
  message: z.string()
    .min(10, 'الرسالة يجب أن تكون على الأقل 10 أحرف')
    .max(500, 'الرسالة يجب أن تكون أقل من 500 حرف'),
  
  scheduledDate: z.date({
    required_error: 'تاريخ الإرسال المحدد مطلوب'
  }),
});

// مخطط إضافة ملاحظة للمطالبة
export const claimNoteSchema = z.object({
  content: z.string()
    .min(5, 'محتوى الملاحظة يجب أن يكون على الأقل 5 أحرف')
    .max(1000, 'محتوى الملاحظة يجب أن يكون أقل من 1000 حرف'),
  
  priority: claimPrioritySchema.default('NORMAL'),
  
  isPrivate: z.boolean().default(false),
});

// مخطط فلاتر المطالبات
export const claimsFiltersSchema = z.object({
  search: z.string().optional(),
  status: claimStatusSchema.optional(),
  priority: claimPrioritySchema.optional(),
  minAmount: z.number().min(0).optional(),
  maxAmount: z.number().min(0).optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  hasOverdue: z.boolean().optional(),
});

// مخطط خيارات التصدير
export const claimsExportSchema = z.object({
  format: z.enum(['EXCEL', 'PDF', 'CSV']),
  includePayments: z.boolean().default(false),
  includeReminders: z.boolean().default(false),
  includeNotes: z.boolean().default(false),
  filters: claimsFiltersSchema.optional(),
});

// أنواع البيانات المستخرجة من المخططات
export type PaymentFormData = z.infer<typeof paymentFormSchema>;
export type ReceiptFormData = z.infer<typeof receiptFormSchema>;
export type ReminderFormData = z.infer<typeof reminderFormSchema>;
export type ClaimNoteData = z.infer<typeof claimNoteSchema>;
export type ClaimsFilters = z.infer<typeof claimsFiltersSchema>;
export type ClaimsExportOptions = z.infer<typeof claimsExportSchema>;
