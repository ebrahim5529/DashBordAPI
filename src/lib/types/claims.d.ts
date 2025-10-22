/**
 * أنواع البيانات الخاصة بالمطالبات والتحصيل
 */

// حالة المطالبة
export type ClaimStatus = 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'CANCELLED';

// نوع التذكير
export type ReminderType = 'SMS' | 'EMAIL' | 'CALL' | 'LETTER';

// نوع الدفعة
export type PaymentType = 'CASH' | 'BANK_TRANSFER' | 'CHECK' | 'CREDIT_CARD' | 'INSTALLMENT';

// بيانات المطالبة في الجدول
export interface ClaimsTableData {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  totalContracts: number;
  totalPayments: number;
  pendingAmount: number;
  comments: string;
  status: ClaimStatus;
  lastPaymentDate?: Date;
  nextDueDate?: Date;
  lastContactDate?: Date; // آخر تاريخ تواصل
  nextContactDate?: Date; // الموعد القادم للتواصل
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  createdAt: Date;
  updatedAt: Date;
}

// تعليق المطالبة مع الهاشتاجات
export interface ClaimComment {
  id: string;
  claimId: string;
  content: string;
  hashtags: string[]; // الهاشتاجات المستخرجة
  createdAt: Date;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

// إحصائيات المطالبات
export interface ClaimsStats {
  totalClaims: number;
  totalPendingAmount: number;
  overdueClaims: number;
  overdueAmount: number;
  highPriorityClaims: number;
  claimsThisMonth: number;
  averageClaimAmount: number;
  collectionRate: number;
}

// بيانات الدفعة
export interface PaymentData {
  id?: string;
  claimId: string;
  amount: number;
  paymentType: PaymentType;
  paymentDate: Date;
  reference?: string;
  notes?: string;
  receiptNumber?: string;
}

// بيانات الإيصال
export interface ReceiptData {
  receiptNumber: string;
  customerName: string;
  customerPhone: string;
  paymentAmount: number;
  paymentType: PaymentType;
  paymentDate: Date;
  reference?: string;
  notes?: string;
}

// بيانات التذكير
export interface ReminderData {
  id?: string;
  claimId: string;
  reminderType: ReminderType;
  message: string;
  scheduledDate: Date;
  sentDate?: Date;
  status: 'PENDING' | 'SENT' | 'FAILED';
}

// تفاصيل المطالبة
export interface ClaimsDetails {
  claim: ClaimsTableData;
  contracts: {
    id: string;
    contractNumber: string;
    contractType: string;
    startDate: Date;
    endDate: Date;
    totalValue: number;
    paidAmount: number;
    pendingAmount: number;
    status: string;
  }[];
  payments: {
    id: string;
    amount: number;
    paymentType: PaymentType;
    paymentDate: Date;
    reference?: string;
    receiptNumber?: string;
  }[];
  reminders: {
    id: string;
    reminderType: ReminderType;
    message: string;
    sentDate: Date;
    status: string;
  }[];
  notes: {
    id: string;
    content: string;
    createdAt: Date;
    createdBy: string;
  }[];
}

// فلاتر المطالبات
export interface ClaimsFilters {
  search?: string;
  status?: ClaimStatus;
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  minAmount?: number;
  maxAmount?: number;
  dateFrom?: Date;
  dateTo?: Date;
  hasOverdue?: boolean;
}

// خيارات التصدير
export interface ClaimsExportOptions {
  format: 'EXCEL' | 'PDF' | 'CSV';
  includePayments: boolean;
  includeReminders: boolean;
  includeNotes: boolean;
  filters?: ClaimsFilters;
}
