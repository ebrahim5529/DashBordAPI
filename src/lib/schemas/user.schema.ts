/**
 * مخططات Zod للتحقق من البيانات
 * يستخدم للتحقق من صحة البيانات المدخلة من المستخدم
 */

import { z } from 'zod';

// مخطط المستخدم الأساسي
export const userSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(2, 'الاسم يجب أن يكون على الأقل حرفين')
    .max(50, 'الاسم يجب أن يكون أقل من 50 حرف'),
  email: z
    .string()
    .email('البريد الإلكتروني غير صحيح')
    .min(1, 'البريد الإلكتروني مطلوب'),
  phone: z
    .string()
    .regex(/^[0-9+\-\s()]+$/, 'رقم الهاتف غير صحيح')
    .min(10, 'رقم الهاتف يجب أن يكون على الأقل 10 أرقام'),
  role: z.enum(['ADMIN', 'MANAGER', 'USER'], {
    errorMap: () => ({ message: 'الدور يجب أن يكون: ADMIN, MANAGER, أو USER' }),
  }),
  isActive: z.boolean().default(true),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// مخطط إنشاء مستخدم جديد
export const createUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// مخطط تحديث مستخدم
export const updateUserSchema = userSchema.partial().omit({
  id: true,
  createdAt: true,
});

// مخطط تسجيل الدخول
export const loginSchema = z.object({
  email: z
    .string()
    .email('البريد الإلكتروني غير صحيح')
    .min(1, 'البريد الإلكتروني مطلوب'),
  password: z
    .string()
    .min(6, 'كلمة المرور يجب أن تكون على الأقل 6 أحرف')
    .max(100, 'كلمة المرور طويلة جداً'),
  rememberMe: z.boolean().default(false),
});

// مخطط تغيير كلمة المرور
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'كلمة المرور الحالية مطلوبة'),
    newPassword: z
      .string()
      .min(6, 'كلمة المرور الجديدة يجب أن تكون على الأقل 6 أحرف')
      .max(100, 'كلمة المرور طويلة جداً'),
    confirmPassword: z.string().min(1, 'تأكيد كلمة المرور مطلوب'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'كلمة المرور الجديدة وتأكيدها غير متطابقتين',
    path: ['confirmPassword'],
  });

// أنواع TypeScript المستخرجة من المخططات
export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
