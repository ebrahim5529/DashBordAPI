/**
 * أنواع البيانات الخاصة بالعقود
 */

// نوع العقد
export type ContractType = 'تأجير' | 'شراء' | 'صيانة' | 'خدمة' | 'تقسيط' | 'تركيب';

// حالة العقد
export type ContractStatus = 'نشط' | 'مسودة' | 'معتمد' | 'منتهي' | 'ملغى' | 'متأخر' | 'ملغي' | 'معلق';

// حالة الدفع
export type PaymentStatus = 'مدفوع بالكامل' | 'مدفوع جزئياً' | 'غير مسدد' | 'بدون فاتورة';

// الفرع
export type Branch = 'فرع الرياض الرئيسي' | 'فرع الدمام' | 'فرع جدة';

// العقد المتقدم
export interface AdvancedContract {
  id: string;
  contractNumber: string;
  customerName: string;
  contractType: ContractType;
  status: ContractStatus;
  paymentStatus: PaymentStatus;
  branch: Branch;
  createdDate: string;
  contractPeriod: {
    from: string;
    to: string;
  } | null;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  hasOverdue: boolean;
  progress: {
    stages: string[];
    currentStage: number;
  };
  items: Array<{
    name: string;
    quantity: number;
    hasStockIssue: boolean;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// فلاتر العقود المتقدمة
export interface AdvancedContractFilters {
  contractType?: ContractType;
  status?: ContractStatus;
  paymentStatus?: PaymentStatus;
  branch?: Branch;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// بيانات العقد في الجدول
export interface ContractsTableData {
  id: string;
  contractNumber: string;
  customerId: string;
  customerName: string;
  contractType: ContractType;
  startDate: Date;
  endDate: Date;
  totalValue: number;
  paidAmount: number;
  pendingAmount: number;
  status: ContractStatus;
  attachments: string[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

// إحصائيات العقود
export interface ContractsStats {
  totalContracts: number;
  activeContracts: number;
  expiredContracts: number;
  cancelledContracts: number;
  totalValue: number;
  totalPaid: number;
  totalPending: number;
  contractsThisMonth: number;
  averageContractValue: number;
  completionRate: number;
}

// تفاصيل العقد
export interface ContractDetails {
  contract: ContractsTableData;
  customer: {
    id: string;
    name: string;
    phone: string;
    email?: string;
    address?: string;
  };
  terms: {
    duration: number; // بالأشهر
    paymentSchedule: string;
    lateFees: number;
    penalties: number;
    renewalTerms?: string;
  };
  payments: {
    id: string;
    amount: number;
    dueDate: Date;
    paidDate?: Date;
    status: 'PENDING' | 'PAID' | 'OVERDUE';
    paymentType?: string;
  }[];
  documents: {
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: Date;
  }[];
  history: {
    id: string;
    action: string;
    description: string;
    date: Date;
    user: string;
  }[];
}

// فلاتر العقود
export interface ContractFilters {
  search?: string;
  contractType?: ContractType;
  status?: ContractStatus;
  customerId?: string;
  minValue?: number;
  maxValue?: number;
  startDateFrom?: Date;
  startDateTo?: Date;
  endDateFrom?: Date;
  endDateTo?: Date;
  hasOverdue?: boolean;
}

// خيارات التصدير
export interface ContractExportOptions {
  format: 'EXCEL' | 'PDF' | 'CSV';
  includePayments: boolean;
  includeDocuments: boolean;
  includeHistory: boolean;
  filters?: ContractFilters;
}

// بيانات إنشاء عقد جديد
export interface CreateContractData {
  customerId: string;
  contractType: ContractType;
  startDate: Date;
  endDate: Date;
  totalValue: number;
  paymentSchedule: string;
  lateFees: number;
  penalties: number;
  notes?: string;
  terms?: string;
}

// بيانات تحديث العقد
export interface UpdateContractData {
  contractType?: ContractType;
  endDate?: Date;
  totalValue?: number;
  paymentSchedule?: string;
  lateFees?: number;
  penalties?: number;
  notes?: string;
  terms?: string;
  status?: ContractStatus;
}
