/**
 * مخططات Zod للعقود المتقدمة
 * يستخدم للتحقق من صحة بيانات العقود المتقدمة
 */

import { z } from 'zod';

// مخطط نوع العقد
export const contractTypeSchema = z.enum(['تأجير', 'شراء', 'صيانة', 'خدمة', 'تقسيط'], {
  errorMap: () => ({ message: 'نوع العقد غير صحيح' }),
});

// مخطط حالة العقد
export const contractStatusSchema = z.enum(['نشط', 'مسودة', 'معتمد', 'منتهي', 'ملغى', 'متأخر'], {
  errorMap: () => ({ message: 'حالة العقد غير صحيحة' }),
});

// مخطط حالة الدفع
export const paymentStatusSchema = z.enum(['مدفوع بالكامل', 'مدفوع جزئياً', 'غير مسدد', 'بدون فاتورة'], {
  errorMap: () => ({ message: 'حالة الدفع غير صحيحة' }),
});

// مخطط الفرع
export const branchSchema = z.enum(['فرع الرياض الرئيسي', 'فرع الدمام', 'فرع جدة'], {
  errorMap: () => ({ message: 'الفرع غير صحيح' }),
});

// مخطط التقدم
export const progressSchema = z.object({
  stages: z.array(z.string()).min(1, 'يجب أن يكون هناك مرحلة واحدة على الأقل'),
  currentStage: z.number().int().min(0, 'المرحلة الحالية يجب أن تكون 0 أو أكبر'),
});

// مخطط العناصر
export const itemSchema = z.object({
  name: z.string().min(1, 'اسم العنصر مطلوب'),
  quantity: z.number().int().positive('الكمية يجب أن تكون أكبر من صفر'),
  hasStockIssue: z.boolean().default(false),
});

// مخطط فترة العقد
export const contractPeriodSchema = z.object({
  from: z.string().min(1, 'تاريخ البداية مطلوب'),
  to: z.string().min(1, 'تاريخ النهاية مطلوب'),
}).nullable();

// مخطط العقد المتقدم
export const advancedContractSchema = z.object({
  id: z.string().min(1, 'معرف العقد مطلوب'),
  contractNumber: z.string().min(1, 'رقم العقد مطلوب'),
  customerName: z.string().min(1, 'اسم العميل مطلوب'),
  contractType: contractTypeSchema,
  status: contractStatusSchema,
  paymentStatus: paymentStatusSchema,
  branch: branchSchema,
  createdDate: z.string().min(1, 'تاريخ الإنشاء مطلوب'),
  contractPeriod: contractPeriodSchema,
  totalAmount: z.number().positive('المبلغ الإجمالي يجب أن يكون أكبر من صفر'),
  paidAmount: z.number().min(0, 'المبلغ المدفوع يجب أن يكون 0 أو أكبر'),
  remainingAmount: z.number().min(0, 'المبلغ المتبقي يجب أن يكون 0 أو أكبر'),
  hasOverdue: z.boolean().default(false),
  progress: progressSchema,
  items: z.array(itemSchema).min(1, 'يجب أن يكون هناك عنصر واحد على الأقل'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// مخطط فلاتر العقود المتقدمة
export const advancedContractFiltersSchema = z.object({
  contractType: contractTypeSchema.optional(),
  status: contractStatusSchema.optional(),
  paymentStatus: paymentStatusSchema.optional(),
  branch: branchSchema.optional(),
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }).optional(),
});

// مخطط إنشاء عقد متقدم جديد
export const createAdvancedContractSchema = advancedContractSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// مخطط تحديث عقد متقدم
export const updateAdvancedContractSchema = advancedContractSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// أنواع TypeScript المستخرجة من المخططات
export type ContractType = z.infer<typeof contractTypeSchema>;
export type ContractStatus = z.infer<typeof contractStatusSchema>;
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;
export type Branch = z.infer<typeof branchSchema>;
export type AdvancedContract = z.infer<typeof advancedContractSchema>;
export type AdvancedContractFilters = z.infer<typeof advancedContractFiltersSchema>;
export type CreateAdvancedContract = z.infer<typeof createAdvancedContractSchema>;
export type UpdateAdvancedContract = z.infer<typeof updateAdvancedContractSchema>;
