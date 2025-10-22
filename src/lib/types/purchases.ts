/**
 * أنواع البيانات الخاصة بالمشتريات والفواتير
 */

// حالة فاتورة المشتريات
export type PurchaseInvoiceStatus = 'مدفوعة' | 'غير مدفوعة' | 'جزئية';

// نوع المشتريات
export type PurchaseType = 'معدات' | 'مواد خام' | 'أدوات' | 'خدمات' | 'أخرى';

// فاتورة المشتريات
export interface PurchaseInvoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  supplierName: string;
  supplierId: string;
  totalAmount: number;
  status: PurchaseInvoiceStatus;
  paidAmount: number;
  remainingAmount: number;
  dueDate: string;
  notes?: string;
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
}

// تفاصيل المشتريات
export interface PurchaseDetailItem {
  id: string;
  invoiceId: string;
  itemName: string;
  itemType: PurchaseType;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unit: string;
  description?: string;
  purchaseDate: string;
  receivedDate?: string;
  status: 'مستلم' | 'في الطريق' | 'معلق';
  createdAt: Date;
  updatedAt: Date;
}

// فلاتر المشتريات
export interface PurchaseFilters {
  search?: string;
  supplierId?: string;
  status?: PurchaseInvoiceStatus;
  purchaseType?: PurchaseType;
  dateFrom?: Date;
  dateTo?: Date;
  minAmount?: number;
  maxAmount?: number;
}

// إحصائيات المشتريات
export interface PurchaseStats {
  totalInvoices: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  invoicesThisMonth: number;
  averageInvoiceAmount: number;
  topSuppliers: Array<{
    supplierName: string;
    totalAmount: number;
    invoiceCount: number;
  }>;
  purchasesByType: Record<PurchaseType, number>;
  invoicesByStatus: Record<PurchaseInvoiceStatus, number>;
}

// بيانات إنشاء فاتورة جديدة
export interface CreateInvoiceData {
  supplierId: string;
  invoiceDate: string;
  dueDate: string;
  items: Array<{
    itemName: string;
    itemType: PurchaseType;
    quantity: number;
    unitPrice: number;
    unit: string;
    description?: string;
  }>;
  notes?: string;
}

// بيانات تحديث الفاتورة
export interface UpdateInvoiceData {
  status?: PurchaseInvoiceStatus;
  paidAmount?: number;
  notes?: string;
}

// بيانات إنشاء مشتريات جديدة
export interface CreatePurchaseData {
  invoiceId: string;
  itemName: string;
  itemType: PurchaseType;
  quantity: number;
  unitPrice: number;
  unit: string;
  description?: string;
  purchaseDate: string;
}

// بيانات تحديث المشتريات
export interface UpdatePurchaseData {
  quantity?: number;
  unitPrice?: number;
  status?: 'مستلم' | 'في الطريق' | 'معلق';
  receivedDate?: string;
  description?: string;
}