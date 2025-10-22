/**
 * بيانات الفواتير
 */

export interface InvoiceStats {
  totalInvoices: number;
  totalAmount: number;
  paidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  averageInvoiceValue: number;
}

export interface InvoiceTableData {
  id: string;
  invoiceNumber: string;
  contractNumber: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockInvoiceStats: InvoiceStats = {
  totalInvoices: 156,
  totalAmount: 2100000,
  paidInvoices: 120,
  pendingInvoices: 28,
  overdueInvoices: 8,
  averageInvoiceValue: 13461,
};

export const mockInvoiceTableData: InvoiceTableData[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    contractNumber: 'CON-2024-001',
    customerName: 'شركة البناء الحديثة',
    issueDate: '2024-02-15',
    dueDate: '2024-03-15',
    totalAmount: 25000,
    paidAmount: 25000,
    status: 'paid',
    paymentMethod: 'تحويل بنكي',
    notes: 'فاتورة الدفعة الأولى',
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-02-15T10:00:00Z',
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    contractNumber: 'CON-2024-002',
    customerName: 'مؤسسة الإنشاءات المتقدمة',
    issueDate: '2024-02-20',
    dueDate: '2024-03-20',
    totalAmount: 18000,
    paidAmount: 0,
    status: 'pending',
    notes: 'فاتورة الدفعة الثانية',
    createdAt: '2024-02-20T14:30:00Z',
    updatedAt: '2024-02-20T14:30:00Z',
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    contractNumber: 'CON-2024-003',
    customerName: 'شركة المقاولات الكبرى',
    issueDate: '2024-02-25',
    dueDate: '2024-03-25',
    totalAmount: 35000,
    paidAmount: 35000,
    status: 'paid',
    paymentMethod: 'بطاقة ائتمانية',
    notes: 'فاتورة الدفعة النهائية',
    createdAt: '2024-02-25T09:15:00Z',
    updatedAt: '2024-02-25T09:15:00Z',
  },
  {
    id: '4',
    invoiceNumber: 'INV-2024-004',
    contractNumber: 'CON-2024-004',
    customerName: 'شركة الإنشاءات الشرقية',
    issueDate: '2024-02-10',
    dueDate: '2024-03-10',
    totalAmount: 22000,
    paidAmount: 0,
    status: 'overdue',
    notes: 'فاتورة متأخرة - تحتاج متابعة',
    createdAt: '2024-02-10T11:45:00Z',
    updatedAt: '2024-02-10T11:45:00Z',
  },
  {
    id: '5',
    invoiceNumber: 'INV-2024-005',
    contractNumber: 'CON-2024-005',
    customerName: 'مؤسسة البناء المتطورة',
    issueDate: '2024-02-28',
    dueDate: '2024-03-28',
    totalAmount: 15000,
    paidAmount: 0,
    status: 'pending',
    notes: 'فاتورة جديدة',
    createdAt: '2024-02-28T16:20:00Z',
    updatedAt: '2024-02-28T16:20:00Z',
  },
];
