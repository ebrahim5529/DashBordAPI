/**
 * أنواع البيانات الخاصة بالوحدات المالية
 */

// أنواع المعاملات المالية
export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';
export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'CHECK' | 'CARD';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';

// معلومات المعاملة المالية
export interface FinancialTransaction {
  id: string;
  transactionNumber: string;
  type: TransactionType;
  date: Date;
  description: string;
  amount: number;
  paymentMethod: PaymentMethod;
  account: string;
  attachments?: string[];
  status: TransactionStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// بيانات المعاملة للجدول
export interface TransactionTableData {
  id: string;
  transactionNumber: string;
  type: TransactionType;
  date: Date;
  description: string;
  amount: number;
  paymentMethod: PaymentMethod;
  account: string;
  status: TransactionStatus;
  hasAttachments: boolean;
  createdAt: Date;
}

// إحصائيات المعاملات المالية
export interface TransactionStats {
  totalTransactions: number;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  todayTransactions: number;
  pendingTransactions: number;
  completedTransactions: number;
  cancelledTransactions: number;
  monthlyIncome: {
    [key: string]: number;
  };
  monthlyExpenses: {
    [key: string]: number;
  };
  typeDistribution: {
    [key in TransactionType]: number;
  };
  paymentMethodDistribution: {
    [key in PaymentMethod]: number;
  };
}

// أنواع طلبات الشراء
export type PurchaseRequestStatus = 'NEW' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
export type PurchaseType = 'MATERIALS' | 'EQUIPMENT' | 'SERVICES';

// معلومات طلب الشراء
export interface PurchaseRequest {
  id: string;
  requestNumber: string;
  date: Date;
  supplier: {
    id: string;
    name: string;
    contactPerson: string;
    phone: string;
    email: string;
  };
  department: string;
  type: PurchaseType;
  quantity: number;
  estimatedCost: number;
  status: PurchaseRequestStatus;
  attachments?: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// بيانات طلب الشراء للجدول
export interface PurchaseRequestTableData {
  id: string;
  requestNumber: string;
  date: Date;
  supplierName: string;
  department: string;
  type: PurchaseType;
  quantity: number;
  estimatedCost: number;
  status: PurchaseRequestStatus;
  hasAttachments: boolean;
  createdAt: Date;
}

// إحصائيات طلبات الشراء
export interface PurchaseRequestStats {
  totalRequests: number;
  newRequests: number;
  underReviewRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  completedRequests: number;
  totalSpending: number;
  averageRequestValue: number;
  departmentDistribution: {
    [department: string]: number;
  };
  typeDistribution: {
    [key in PurchaseType]: number;
  };
  monthlyRequests: {
    [key: string]: number;
  };
  monthlySpending: {
    [key: string]: number;
  };
}

// أنواع الفواتير
export type InvoiceType = 'OUTGOING' | 'INCOMING';
export type InvoiceStatus = 'PAID' | 'UNPAID' | 'PENDING' | 'OVERDUE';

// معلومات الفاتورة
export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: Date;
  type: InvoiceType;
  party: {
    id: string;
    name: string;
    type: 'CUSTOMER' | 'SUPPLIER';
  };
  totalAmount: number;
  tax: number;
  totalAfterTax: number;
  status: InvoiceStatus;
  paymentMethod?: PaymentMethod;
  attachments?: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// بيانات الفاتورة للجدول
export interface InvoiceTableData {
  id: string;
  invoiceNumber: string;
  date: Date;
  type: InvoiceType;
  partyName: string;
  partyType: 'CUSTOMER' | 'SUPPLIER';
  totalAmount: number;
  tax: number;
  totalAfterTax: number;
  status: InvoiceStatus;
  paymentMethod?: PaymentMethod;
  hasAttachments: boolean;
  createdAt: Date;
}

// إحصائيات الفواتير
export interface InvoiceStats {
  totalInvoices: number;
  paidInvoices: number;
  unpaidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  totalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
  averageInvoiceValue: number;
  typeDistribution: {
    [key in InvoiceType]: number;
  };
  statusDistribution: {
    [key in InvoiceStatus]: number;
  };
  monthlyInvoices: {
    [key: string]: number;
  };
  monthlyAmounts: {
    [key: string]: number;
  };
}

// أنواع التقارير المالية
export type ReportPeriod = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
export type ReportType = 'INCOME' | 'EXPENSES' | 'PROFIT_LOSS' | 'COMPREHENSIVE';

// معلومات التقرير المالي
export interface FinancialReport {
  id: string;
  reportName: string;
  period: ReportPeriod;
  type: ReportType;
  dateFrom: Date;
  dateTo: Date;
  department?: string;
  account?: string;
  data: {
    income: number;
    expenses: number;
    netProfit: number;
    growthPercentage: number;
    transactions: TransactionTableData[];
    invoices: InvoiceTableData[];
    purchases: PurchaseRequestTableData[];
  };
  charts: {
    incomeVsExpenses: any[];
    profitGrowth: any[];
    expenseDistribution: any[];
  };
  createdAt: Date;
}

// إحصائيات سريعة للتقارير
export interface QuickFinancialStats {
  monthlyIncome: number;
  monthlyExpenses: number;
  netProfit: number;
  growthPercentage: number;
  totalTransactions: number;
  totalInvoices: number;
  totalPurchases: number;
}

// فلاتر المعاملات المالية
export interface TransactionFilters {
  type?: TransactionType;
  dateFrom?: Date;
  dateTo?: Date;
  account?: string;
  minAmount?: number;
  maxAmount?: number;
  paymentMethod?: PaymentMethod;
  status?: TransactionStatus;
}

// فلاتر طلبات الشراء
export interface PurchaseRequestFilters {
  requestNumber?: string;
  supplier?: string;
  department?: string;
  status?: PurchaseRequestStatus;
  type?: PurchaseType;
  dateFrom?: Date;
  dateTo?: Date;
  minAmount?: number;
  maxAmount?: number;
}

// فلاتر الفواتير
export interface InvoiceFilters {
  invoiceNumber?: string;
  type?: InvoiceType;
  party?: string;
  status?: InvoiceStatus;
  dateFrom?: Date;
  dateTo?: Date;
  minAmount?: number;
  maxAmount?: number;
}

// فلاتر التقارير المالية
export interface FinancialReportFilters {
  period?: ReportPeriod;
  reportType?: ReportType;
  department?: string;
  account?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

// أنواع الحالة للنماذج
export type FinancialFormMode = 'create' | 'edit' | 'view';

// أنواع الإجراءات
export type FinancialAction = 'add' | 'edit' | 'delete' | 'view' | 'approve' | 'reject' | 'export';

// إعدادات مالية
export interface FinancialSettings {
  defaultPaymentMethod: PaymentMethod;
  defaultAccount: string;
  taxRate: number;
  currency: string;
  requireApprovalForLargeAmounts: boolean;
  largeAmountThreshold: number;
  autoGenerateNumbers: boolean;
  numberPrefixes: {
    transaction: string;
    purchase: string;
    invoice: string;
  };
}

// أنواع التنبيهات
export interface FinancialNotification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// أنواع الأحداث المالية
export type FinancialEvent = 
  | 'TRANSACTION_CREATED'
  | 'TRANSACTION_UPDATED'
  | 'TRANSACTION_DELETED'
  | 'PURCHASE_REQUEST_CREATED'
  | 'PURCHASE_REQUEST_APPROVED'
  | 'PURCHASE_REQUEST_REJECTED'
  | 'INVOICE_CREATED'
  | 'INVOICE_PAID'
  | 'REPORT_GENERATED';

// سجل الأحداث المالية
export interface FinancialEventLog {
  id: string;
  event: FinancialEvent;
  entityId: string;
  entityType: 'TRANSACTION' | 'PURCHASE_REQUEST' | 'INVOICE' | 'REPORT';
  userId: string;
  userName: string;
  timestamp: Date;
  details: any;
}