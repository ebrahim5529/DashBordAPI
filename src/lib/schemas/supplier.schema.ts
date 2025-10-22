/**
 * مخططات التحقق من البيانات للموردين
 */

import { z } from 'zod';

// مخطط التحقق من بيانات المورد
export const supplierFormSchema = z.object({
  name: z.string().min(1, 'اسم المورد مطلوب').max(100, 'اسم المورد طويل جداً'),
  email: z.string().email('البريد الإلكتروني غير صحيح').optional().or(z.literal('')),
  phone: z.string().min(8, 'رقم الهاتف قصير جداً').max(20, 'رقم الهاتف طويل جداً').optional().or(z.literal('')),
  address: z.string().max(500, 'العنوان طويل جداً').optional().or(z.literal('')),
  nationality: z.string().max(50, 'الجنسية طويلة جداً').optional().or(z.literal('')),
  supplierType: z.enum(['INDIVIDUAL', 'COMPANY'], {
    required_error: 'نوع المورد مطلوب',
  }),
  idNumber: z.string().max(50, 'رقم الهوية طويل جداً').optional().or(z.literal('')),
  commercialRecord: z.string().max(50, 'السجل التجاري طويل جداً').optional().or(z.literal('')),
  taxNumber: z.string().max(50, 'الرقم الضريبي طويل جداً').optional().or(z.literal('')),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED'], {
    required_error: 'حالة المورد مطلوبة',
  }),
  contactPerson: z.string().max(100, 'اسم الشخص المسؤول طويل جداً').optional().or(z.literal('')),
  contactPersonPhone: z.string().max(20, 'هاتف الشخص المسؤول طويل جداً').optional().or(z.literal('')),
  contactPersonEmail: z.string().email('بريد الشخص المسؤول غير صحيح').optional().or(z.literal('')),
  bankName: z.string().max(100, 'اسم البنك طويل جداً').optional().or(z.literal('')),
  bankAccount: z.string().max(50, 'رقم الحساب طويل جداً').optional().or(z.literal('')),
  iban: z.string().max(50, 'رقم الآيبان طويل جداً').optional().or(z.literal('')),
  swiftCode: z.string().max(20, 'رمز السويفت طويل جداً').optional().or(z.literal('')),
  notes: z.string().max(1000, 'الملاحظات طويلة جداً').optional().or(z.literal('')),
  warnings: z.string().max(1000, 'التحذيرات طويلة جداً').optional().or(z.literal('')),
  rating: z.number().min(1, 'التقييم يجب أن يكون 1 على الأقل').max(5, 'التقييم يجب أن يكون 5 على الأكثر').optional(),
}).refine((data) => {
  // التحقق من أن رقم الهوية مطلوب للأفراد
  if (data.supplierType === 'INDIVIDUAL' && !data.idNumber) {
    return false;
  }
  // التحقق من أن السجل التجاري مطلوب للشركات
  if (data.supplierType === 'COMPANY' && !data.commercialRecord) {
    return false;
  }
  return true;
}, {
  message: 'رقم الهوية مطلوب للأفراد والسجل التجاري مطلوب للشركات',
  path: ['idNumber'],
});

// مخطط التحقق من بيانات الفاتورة
export const invoiceFormSchema = z.object({
  supplierId: z.string().min(1, 'المورد مطلوب'),
  invoiceNumber: z.string().min(1, 'رقم الفاتورة مطلوب').max(50, 'رقم الفاتورة طويل جداً'),
  invoiceDate: z.date({
    required_error: 'تاريخ الفاتورة مطلوب',
  }),
  dueDate: z.date({
    required_error: 'تاريخ الاستحقاق مطلوب',
  }),
  description: z.string().max(500, 'الوصف طويل جداً').optional().or(z.literal('')),
  items: z.array(z.object({
    description: z.string().min(1, 'وصف العنصر مطلوب').max(200, 'وصف العنصر طويل جداً'),
    quantity: z.number().min(0.01, 'الكمية يجب أن تكون أكبر من صفر'),
    unitPrice: z.number().min(0, 'سعر الوحدة يجب أن يكون أكبر من أو يساوي صفر'),
    totalPrice: z.number().min(0, 'السعر الإجمالي يجب أن يكون أكبر من أو يساوي صفر'),
    category: z.string().max(50, 'الفئة طويلة جداً').optional().or(z.literal('')),
  })).min(1, 'يجب إضافة عنصر واحد على الأقل'),
  paymentMethod: z.enum(['CASH', 'BANK_TRANSFER', 'CHECK', 'CREDIT_CARD']).optional(),
  notes: z.string().max(1000, 'الملاحظات طويلة جداً').optional().or(z.literal('')),
}).refine((data) => {
  // التحقق من أن تاريخ الاستحقاق بعد تاريخ الفاتورة
  return data.dueDate >= data.invoiceDate;
}, {
  message: 'تاريخ الاستحقاق يجب أن يكون بعد تاريخ الفاتورة',
  path: ['dueDate'],
});

// مخطط التحقق من بيانات الشراء
export const purchaseFormSchema = z.object({
  supplierId: z.string().min(1, 'المورد مطلوب'),
  purchaseNumber: z.string().min(1, 'رقم الشراء مطلوب').max(50, 'رقم الشراء طويل جداً'),
  purchaseDate: z.date({
    required_error: 'تاريخ الشراء مطلوب',
  }),
  deliveryDate: z.date().optional(),
  items: z.array(z.object({
    itemName: z.string().min(1, 'اسم العنصر مطلوب').max(200, 'اسم العنصر طويل جداً'),
    description: z.string().max(500, 'الوصف طويل جداً').optional().or(z.literal('')),
    quantity: z.number().min(0.01, 'الكمية يجب أن تكون أكبر من صفر'),
    unitPrice: z.number().min(0, 'سعر الوحدة يجب أن يكون أكبر من أو يساوي صفر'),
    totalPrice: z.number().min(0, 'السعر الإجمالي يجب أن يكون أكبر من أو يساوي صفر'),
    category: z.string().max(50, 'الفئة طويلة جداً').optional().or(z.literal('')),
    specifications: z.string().max(500, 'المواصفات طويلة جداً').optional().or(z.literal('')),
  })).min(1, 'يجب إضافة عنصر واحد على الأقل'),
  invoiceId: z.string().optional(),
  notes: z.string().max(1000, 'الملاحظات طويلة جداً').optional().or(z.literal('')),
}).refine((data) => {
  // التحقق من أن تاريخ التسليم بعد تاريخ الشراء
  if (data.deliveryDate) {
    return data.deliveryDate >= data.purchaseDate;
  }
  return true;
}, {
  message: 'تاريخ التسليم يجب أن يكون بعد تاريخ الشراء',
  path: ['deliveryDate'],
});

// تصدير الأنواع
export type SupplierFormData = z.infer<typeof supplierFormSchema>;
export type InvoiceFormData = z.infer<typeof invoiceFormSchema>;
export type PurchaseFormData = z.infer<typeof purchaseFormSchema>;
