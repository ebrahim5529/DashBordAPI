/**
 * مخططات Zod للمدفوعات
 * يستخدم للتحقق من صحة بيانات المدفوعات
 */

import { z } from 'zod';

// مخطط المدفوعة الأساسي
export const paymentSchema = z.object({
  id: z.string().optional(),
  amount: z
    .number()
    .positive('المبلغ يجب أن يكون أكبر من صفر')
    .max(1000000, 'المبلغ كبير جداً'),
  paymentDate: z.date(),
  paymentMethod: z.enum(['CASH', 'BANK_TRANSFER', 'CHECK', 'CREDIT_CARD'], {
    errorMap: () => ({ message: 'طريقة الدفع غير صحيحة' }),
  }),
  status: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'], {
    errorMap: () => ({ message: 'حالة الدفع غير صحيحة' }),
  }),
  notes: z.string().max(500, 'الملاحظات طويلة جداً').optional(),
  contractId: z.string().min(1, 'معرف العقد مطلوب'),
  customerId: z.string().min(1, 'معرف العميل مطلوب'),
  userId: z.string().min(1, 'معرف المستخدم مطلوب'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// مخطط إنشاء مدفوعة جديدة
export const createPaymentSchema = paymentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// مخطط تحديث مدفوعة
export const updatePaymentSchema = paymentSchema.partial().omit({
  id: true,
  createdAt: true,
});

// مخطط القسط
export const installmentSchema = z.object({
  id: z.string().optional(),
  installmentNumber: z
    .number()
    .int('رقم القسط يجب أن يكون رقماً صحيحاً')
    .positive('رقم القسط يجب أن يكون أكبر من صفر'),
  amount: z
    .number()
    .positive('مبلغ القسط يجب أن يكون أكبر من صفر')
    .max(1000000, 'مبلغ القسط كبير جداً'),
  dueDate: z.date(),
  status: z.enum(['PENDING', 'PAID', 'OVERDUE', 'CANCELLED'], {
    errorMap: () => ({ message: 'حالة القسط غير صحيحة' }),
  }),
  paidDate: z.date().optional(),
  contractId: z.string().min(1, 'معرف العقد مطلوب'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// مخطط إنشاء قسط جديد
export const createInstallmentSchema = installmentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// مخطط تحديث قسط
export const updateInstallmentSchema = installmentSchema.partial().omit({
  id: true,
  createdAt: true,
});

// مخطط البحث والفلترة
export const paymentFilterSchema = z.object({
  status: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED']).optional(),
  paymentMethod: z
    .enum(['CASH', 'BANK_TRANSFER', 'CHECK', 'CREDIT_CARD'])
    .optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  customerId: z.string().optional(),
  contractId: z.string().optional(),
  minAmount: z.number().positive().optional(),
  maxAmount: z.number().positive().optional(),
});

// مخطط إحصائيات المدفوعات
export const paymentStatsSchema = z.object({
  totalAmount: z.number(),
  completedAmount: z.number(),
  pendingAmount: z.number(),
  overdueAmount: z.number(),
  totalCount: z.number(),
  completedCount: z.number(),
  pendingCount: z.number(),
  overdueCount: z.number(),
});

// أنواع TypeScript المستخرجة من المخططات
export type Payment = z.infer<typeof paymentSchema>;
export type CreatePayment = z.infer<typeof createPaymentSchema>;
export type UpdatePayment = z.infer<typeof updatePaymentSchema>;
export type Installment = z.infer<typeof installmentSchema>;
export type CreateInstallment = z.infer<typeof createInstallmentSchema>;
export type UpdateInstallment = z.infer<typeof updateInstallmentSchema>;
export type PaymentFilter = z.infer<typeof paymentFilterSchema>;
export type PaymentStats = z.infer<typeof paymentStatsSchema>;



