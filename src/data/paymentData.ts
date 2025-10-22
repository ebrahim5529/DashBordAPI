/**
 * بيانات المدفوعات
 */

export interface PaymentStats {
  totalPayments: number;
  totalAmount: number;
  pendingPayments: number;
  completedPayments: number;
  overduePayments: number;
  averagePaymentTime: number;
}

export interface PaymentTableData {
  id: string;
  contractNumber: string;
  customerName: string;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'overdue' | 'cancelled';
  receiptNumber: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockPaymentStats: PaymentStats = {
  totalPayments: 245,
  totalAmount: 1250000,
  pendingPayments: 15,
  completedPayments: 220,
  overduePayments: 10,
  averagePaymentTime: 2.5,
};

export const mockPaymentTableData: PaymentTableData[] = [
  {
    id: '1',
    contractNumber: 'CON-2024-001',
    customerName: 'شركة البناء الحديثة',
    paymentDate: '2024-02-15',
    amount: 25000,
    paymentMethod: 'تحويل بنكي',
    status: 'completed',
    receiptNumber: 'RCP-2024-001',
    notes: 'دفعة أولى للمشروع',
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-02-15T10:00:00Z',
  },
  {
    id: '2',
    contractNumber: 'CON-2024-002',
    customerName: 'مؤسسة الإنشاءات المتقدمة',
    paymentDate: '2024-02-20',
    amount: 18000,
    paymentMethod: 'نقدي',
    status: 'completed',
    receiptNumber: 'RCP-2024-002',
    notes: 'دفعة ثانية',
    createdAt: '2024-02-20T14:30:00Z',
    updatedAt: '2024-02-20T14:30:00Z',
  },
  {
    id: '3',
    contractNumber: 'CON-2024-003',
    customerName: 'شركة المقاولات الكبرى',
    paymentDate: '2024-02-25',
    amount: 35000,
    paymentMethod: 'بطاقة ائتمانية',
    status: 'pending',
    receiptNumber: 'RCP-2024-003',
    notes: 'في انتظار التأكيد',
    createdAt: '2024-02-25T09:15:00Z',
    updatedAt: '2024-02-25T09:15:00Z',
  },
  {
    id: '4',
    contractNumber: 'CON-2024-004',
    customerName: 'شركة الإنشاءات الشرقية',
    paymentDate: '2024-02-10',
    amount: 22000,
    paymentMethod: 'تحويل بنكي',
    status: 'overdue',
    receiptNumber: 'RCP-2024-004',
    notes: 'متأخرة - تحتاج متابعة',
    createdAt: '2024-02-10T11:45:00Z',
    updatedAt: '2024-02-10T11:45:00Z',
  },
  {
    id: '5',
    contractNumber: 'CON-2024-005',
    customerName: 'مؤسسة البناء المتطورة',
    paymentDate: '2024-02-28',
    amount: 15000,
    paymentMethod: 'دفع إلكتروني',
    status: 'pending',
    receiptNumber: 'RCP-2024-005',
    notes: 'في انتظار المعالجة',
    createdAt: '2024-02-28T16:20:00Z',
    updatedAt: '2024-02-28T16:20:00Z',
  },
];
