/**
 * تعريف أنواع TypeScript للمدفوعات
 * يحتوي على جميع الأنواع المتعلقة بالمدفوعات والمدفوعات المتأخرة
 */

// نوع المدفوعات المتأخرة
export interface LatePayment {
  id: string
  customerName: string
  contractNumber: string
  amount: number
  dueDate: string
  daysLate: number
  contactPerson: string
  phone: string
  email: string
  lastContact: string
  status: LatePaymentStatus
  priority: PaymentPriority
  notes?: string
  createdAt: string
  updatedAt: string
}

// حالة المدفوعات
export type LatePaymentStatus = 'pending' | 'contacted' | 'escalated' | 'resolved' | 'cancelled'

// أولوية المدفوعات
export type PaymentPriority = 'low' | 'medium' | 'high' | 'urgent'

// بيانات إنشاء مدفوعات متأخرة جديدة
export interface CreateLatePaymentData {
  customerName: string
  contractNumber: string
  amount: number
  dueDate: string
  contactPerson: string
  phone: string
  email: string
  priority: PaymentPriority
  notes?: string
}

// بيانات تحديث مدفوعات متأخرة
export interface UpdateLatePaymentData {
  customerName?: string
  contractNumber?: string
  amount?: number
  dueDate?: string
  contactPerson?: string
  phone?: string
  email?: string
  status?: PaymentStatus
  priority?: PaymentPriority
  notes?: string
  lastContact?: string
}

// استجابة API للمدفوعات المتأخرة
export interface LatePaymentResponse {
  success: boolean
  data: LatePayment
  message?: string
}

// استجابة API لقائمة المدفوعات المتأخرة
export interface LatePaymentsResponse {
  success: boolean
  data: LatePayment[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  message?: string
}

// إحصائيات المدفوعات المتأخرة
export interface LatePaymentStats {
  totalLatePayments: number
  totalAmount: number
  contactedCount: number
  pendingCount: number
  escalatedCount: number
  resolvedCount: number
  averageDaysLate: number
  paymentsByPriority: {
    low: number
    medium: number
    high: number
    urgent: number
  }
  paymentsByStatus: {
    pending: number
    contacted: number
    escalated: number
    resolved: number
    cancelled: number
  }
}

// خيارات البحث والفرز
export interface PaymentSearchFilters {
  search?: string
  status?: PaymentStatus[]
  priority?: PaymentPriority[]
  daysLateMin?: number
  daysLateMax?: number
  amountMin?: number
  amountMax?: number
  dateFrom?: string
  dateTo?: string
}

// خيارات الفرز
export interface PaymentSortOptions {
  field: keyof LatePayment
  direction: 'asc' | 'desc'
}

// إعدادات الجدول
export interface PaymentTableSettings {
  pageSize: number
  currentPage: number
  sortBy: PaymentSortOptions
  filters: PaymentSearchFilters
  visibleColumns: (keyof LatePayment)[]
}
