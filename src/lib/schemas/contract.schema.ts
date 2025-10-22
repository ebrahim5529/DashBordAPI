/**
 * مخططات Zod للعقود
 * يستخدم للتحقق من صحة بيانات العقود
 */

import { z } from 'zod';

// مخطط العقد الأساسي (بدون التحقق من التواريخ)
const baseContractSchema = z.object({
  id: z.string().optional(),
  contractNumber: z
    .string()
    .min(1, 'رقم العقد مطلوب')
    .max(50, 'رقم العقد طويل جداً'),
  title: z
    .string()
    .min(3, 'عنوان العقد يجب أن يكون على الأقل 3 أحرف')
    .max(200, 'عنوان العقد طويل جداً'),
  description: z.string().optional(),
  amount: z
    .number()
    .positive('المبلغ يجب أن يكون أكبر من صفر')
    .max(10000000, 'المبلغ كبير جداً'),
  startDate: z.date(),
  endDate: z.date(),
  status: z.enum(['ACTIVE', 'EXPIRED', 'CANCELLED', 'COMPLETED'], {
    errorMap: () => ({ message: 'حالة العقد غير صحيحة' }),
  }),
  paymentType: z.enum(
    ['CASH', 'INSTALLMENT', 'MONTHLY', 'QUARTERLY', 'YEARLY'],
    {
      errorMap: () => ({ message: 'نوع الدفع غير صحيح' }),
    }
  ),
  installmentCount: z
    .number()
    .int('عدد المدفوعات يجب أن يكون رقماً صحيحاً')
    .min(1, 'عدد المدفوعات يجب أن يكون على الأقل 1')
    .max(60, 'عدد المدفوعات كبير جداً')
    .optional(),
  customerId: z.string().min(1, 'معرف العميل مطلوب'),
  userId: z.string().min(1, 'معرف المستخدم مطلوب'),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// مخطط العقد الكامل مع التحقق من التواريخ
export const contractSchema = baseContractSchema.refine(
  data => data.endDate > data.startDate,
  {
    message: 'تاريخ الانتهاء يجب أن يكون بعد تاريخ البداية',
    path: ['endDate'],
  }
);

// مخطط إنشاء عقد جديد
export const createContractSchema = baseContractSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).refine(
  data => data.endDate > data.startDate,
  {
    message: 'تاريخ الانتهاء يجب أن يكون بعد تاريخ البداية',
    path: ['endDate'],
  }
);

// مخطط تحديث عقد
export const updateContractSchema = baseContractSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// مخطط العميل
export const customerSchema = z.object({
  id: z.string().optional(),
  customerNumber: z.string().min(1, 'رقم العميل مطلوب'),
  name: z
    .string()
    .min(2, 'اسم العميل يجب أن يكون على الأقل حرفين')
    .max(100, 'اسم العميل طويل جداً'),
  email: z.string().email('البريد الإلكتروني غير صحيح').optional(),
  phone: z
    .string()
    .regex(/^[0-9+\-\s()]+$/, 'رقم الهاتف غير صحيح')
    .optional(),
  address: z.string().max(500, 'العنوان طويل جداً').optional(),
  customerType: z.string().default('INDIVIDUAL'),
  commercialRecord: z.string().nullable().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// مخطط إنشاء عميل جديد
export const createCustomerSchema = customerSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// مخطط تحديث عميل
export const updateCustomerSchema = customerSchema.partial().omit({
  id: true,
  createdAt: true,
});

// أنواع TypeScript المستخرجة من المخططات
export type Contract = z.infer<typeof contractSchema>;
export type CreateContract = z.infer<typeof createContractSchema>;
export type UpdateContract = z.infer<typeof updateContractSchema>;
export type Customer = z.infer<typeof customerSchema>;
export type CreateCustomer = z.infer<typeof createCustomerSchema>;
export type UpdateCustomer = z.infer<typeof updateCustomerSchema>;
