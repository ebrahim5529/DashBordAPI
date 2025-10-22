/**
 * بيانات وهمية للوحدات المالية
 */

import {
  FinancialTransaction,
  TransactionTableData,
  TransactionStats,
  PurchaseRequest,
  PurchaseRequestTableData,
  PurchaseRequestStats,
  Invoice,
  InvoiceTableData,
  InvoiceStats,
  QuickFinancialStats,
} from '@/lib/types/financial';

// بيانات المعاملات المالية الوهمية
export const mockTransactions: FinancialTransaction[] = [
  {
    id: '1',
    transactionNumber: 'TXN-20250113001',
    type: 'INCOME',
    date: new Date('2025-01-13'),
    description: 'تحويل من الحساب البنكي الرئيسي',
    amount: 15000,
    paymentMethod: 'BANK_TRANSFER',
    account: 'حساب الشركة - البنك الأهلي',
    status: 'COMPLETED',
    attachments: ['bank_receipt.pdf'],
    notes: 'تحويل شهري للمصروفات التشغيلية',
    createdAt: new Date('2025-01-13'),
    updatedAt: new Date('2025-01-13'),
  },
  {
    id: '2',
    transactionNumber: 'TXN-20250113002',
    type: 'EXPENSE',
    date: new Date('2025-01-13'),
    description: 'دفع فاتورة الكهرباء',
    amount: 2500,
    paymentMethod: 'BANK_TRANSFER',
    account: 'حساب الشركة - البنك الأهلي',
    status: 'COMPLETED',
    attachments: ['electricity_bill.pdf'],
    notes: 'فاتورة شهر ديسمبر 2024',
    createdAt: new Date('2025-01-13'),
    updatedAt: new Date('2025-01-13'),
  },
  {
    id: '3',
    transactionNumber: 'TXN-20250112001',
    type: 'INCOME',
    date: new Date('2025-01-12'),
    description: 'دفع من عميل - عقد صيانة',
    amount: 8500,
    paymentMethod: 'CASH',
    account: 'الصندوق النقدي',
    status: 'COMPLETED',
    attachments: ['receipt.pdf'],
    notes: 'دفع جزئي من عقد الصيانة الشهري',
    createdAt: new Date('2025-01-12'),
    updatedAt: new Date('2025-01-12'),
  },
  {
    id: '4',
    transactionNumber: 'TXN-20250112002',
    type: 'EXPENSE',
    date: new Date('2025-01-12'),
    description: 'شراء مواد مكتبية',
    amount: 750,
    paymentMethod: 'CARD',
    account: 'حساب الشركة - البنك الأهلي',
    status: 'COMPLETED',
    attachments: ['office_supplies_invoice.pdf'],
    notes: 'أوراق، أقلام، ملفات',
    createdAt: new Date('2025-01-12'),
    updatedAt: new Date('2025-01-12'),
  },
  {
    id: '5',
    transactionNumber: 'TXN-20250111001',
    type: 'TRANSFER',
    date: new Date('2025-01-11'),
    description: 'تحويل من الحساب الجاري إلى حساب التوفير',
    amount: 10000,
    paymentMethod: 'BANK_TRANSFER',
    account: 'حساب الشركة - البنك الأهلي',
    status: 'PENDING',
    attachments: [],
    notes: 'تحويل أموال للاحتياطي',
    createdAt: new Date('2025-01-11'),
    updatedAt: new Date('2025-01-11'),
  },
];

// بيانات المعاملات للجدول
export const mockTransactionTableData: TransactionTableData[] = mockTransactions.map(transaction => ({
  id: transaction.id,
  transactionNumber: transaction.transactionNumber,
  type: transaction.type,
  date: transaction.date,
  description: transaction.description,
  amount: transaction.amount,
  paymentMethod: transaction.paymentMethod,
  account: transaction.account,
  status: transaction.status,
  hasAttachments: Boolean(transaction.attachments && transaction.attachments.length > 0),
  createdAt: transaction.createdAt,
}));

// إحصائيات المعاملات المالية
export const mockTransactionStats: TransactionStats = {
  totalTransactions: mockTransactions.length,
  totalIncome: mockTransactions
    .filter(t => t.type === 'INCOME' && t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.amount, 0),
  totalExpenses: mockTransactions
    .filter(t => t.type === 'EXPENSE' && t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.amount, 0),
  netProfit: mockTransactions
    .filter(t => t.type === 'INCOME' && t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.amount, 0) - 
    mockTransactions
    .filter(t => t.type === 'EXPENSE' && t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.amount, 0),
  todayTransactions: mockTransactions
    .filter(t => t.date.toDateString() === new Date().toDateString()).length,
  pendingTransactions: mockTransactions.filter(t => t.status === 'PENDING').length,
  completedTransactions: mockTransactions.filter(t => t.status === 'COMPLETED').length,
  cancelledTransactions: mockTransactions.filter(t => t.status === 'CANCELLED').length,
  monthlyIncome: {
    '2025-01': 23000,
    '2024-12': 45000,
    '2024-11': 38000,
  },
  monthlyExpenses: {
    '2025-01': 3250,
    '2024-12': 28000,
    '2024-11': 22000,
  },
  typeDistribution: {
    INCOME: mockTransactions.filter(t => t.type === 'INCOME').length,
    EXPENSE: mockTransactions.filter(t => t.type === 'EXPENSE').length,
    TRANSFER: mockTransactions.filter(t => t.type === 'TRANSFER').length,
  },
  paymentMethodDistribution: {
    CASH: mockTransactions.filter(t => t.paymentMethod === 'CASH').length,
    BANK_TRANSFER: mockTransactions.filter(t => t.paymentMethod === 'BANK_TRANSFER').length,
    CHECK: mockTransactions.filter(t => t.paymentMethod === 'CHECK').length,
    CARD: mockTransactions.filter(t => t.paymentMethod === 'CARD').length,
  },
};

// بيانات طلبات الشراء الوهمية
export const mockPurchaseRequests: PurchaseRequest[] = [
  {
    id: '1',
    requestNumber: 'PO-20250113001',
    date: new Date('2025-01-13'),
    supplier: {
      id: '1',
      name: 'شركة الرواد للتوريد',
      contactPerson: 'أحمد الرواد',
      phone: '+96891234567',
      email: 'ahmed@alrawad.com',
    },
    department: 'الصيانة',
    type: 'EQUIPMENT',
    quantity: 20,
    estimatedCost: 5000,
    status: 'NEW',
    attachments: ['quote.pdf'],
    notes: 'شراء معدات صيانة جديدة',
    createdAt: new Date('2025-01-13'),
    updatedAt: new Date('2025-01-13'),
  },
  {
    id: '2',
    requestNumber: 'PO-20250112001',
    date: new Date('2025-01-12'),
    supplier: {
      id: '2',
      name: 'شركة البناء الحديث',
      contactPerson: 'محمد البناء',
      phone: '+96824567890',
      email: 'mohammed@modernbuilding.com',
    },
    department: 'المشاريع',
    type: 'MATERIALS',
    quantity: 50,
    estimatedCost: 12000,
    status: 'UNDER_REVIEW',
    attachments: ['proposal.pdf', 'catalog.pdf'],
    notes: 'مواد بناء لمشروع الجسر الجديد',
    createdAt: new Date('2025-01-12'),
    updatedAt: new Date('2025-01-12'),
  },
  {
    id: '3',
    requestNumber: 'PO-20250111001',
    date: new Date('2025-01-11'),
    supplier: {
      id: '3',
      name: 'شركة الخدمات التقنية',
      contactPerson: 'فاطمة التقنية',
      phone: '+96837890123',
      email: 'fatima@techservices.com',
    },
    department: 'التقنية',
    type: 'SERVICES',
    quantity: 1,
    estimatedCost: 3000,
    status: 'APPROVED',
    attachments: ['service_agreement.pdf'],
    notes: 'خدمات صيانة الشبكات',
    createdAt: new Date('2025-01-11'),
    updatedAt: new Date('2025-01-11'),
  },
];

// بيانات طلبات الشراء للجدول
export const mockPurchaseRequestTableData: PurchaseRequestTableData[] = mockPurchaseRequests.map(request => ({
  id: request.id,
  requestNumber: request.requestNumber,
  date: request.date,
  supplierName: request.supplier.name,
  department: request.department,
  type: request.type,
  quantity: request.quantity,
  estimatedCost: request.estimatedCost,
  status: request.status,
  hasAttachments: Boolean(request.attachments && request.attachments.length > 0),
  createdAt: request.createdAt,
}));

// إحصائيات طلبات الشراء
export const mockPurchaseRequestStats: PurchaseRequestStats = {
  totalRequests: mockPurchaseRequests.length,
  newRequests: mockPurchaseRequests.filter(r => r.status === 'NEW').length,
  underReviewRequests: mockPurchaseRequests.filter(r => r.status === 'UNDER_REVIEW').length,
  approvedRequests: mockPurchaseRequests.filter(r => r.status === 'APPROVED').length,
  rejectedRequests: mockPurchaseRequests.filter(r => r.status === 'REJECTED').length,
  completedRequests: mockPurchaseRequests.filter(r => r.status === 'COMPLETED').length,
  totalSpending: mockPurchaseRequests.reduce((sum, r) => sum + r.estimatedCost, 0),
  averageRequestValue: mockPurchaseRequests.reduce((sum, r) => sum + r.estimatedCost, 0) / mockPurchaseRequests.length,
  departmentDistribution: {
    'الصيانة': mockPurchaseRequests.filter(r => r.department === 'الصيانة').length,
    'المشاريع': mockPurchaseRequests.filter(r => r.department === 'المشاريع').length,
    'التقنية': mockPurchaseRequests.filter(r => r.department === 'التقنية').length,
  },
  typeDistribution: {
    MATERIALS: mockPurchaseRequests.filter(r => r.type === 'MATERIALS').length,
    EQUIPMENT: mockPurchaseRequests.filter(r => r.type === 'EQUIPMENT').length,
    SERVICES: mockPurchaseRequests.filter(r => r.type === 'SERVICES').length,
  },
  monthlyRequests: {
    '2025-01': 3,
    '2024-12': 8,
    '2024-11': 5,
  },
  monthlySpending: {
    '2025-01': 20000,
    '2024-12': 45000,
    '2024-11': 32000,
  },
};

// بيانات الفواتير الوهمية
export const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-20250113001',
    date: new Date('2025-01-13'),
    type: 'OUTGOING',
    party: {
      id: '1',
      name: 'شركة النخيل للتجارة',
      type: 'CUSTOMER',
    },
    totalAmount: 2500,
    tax: 375,
    totalAfterTax: 2875,
    status: 'PAID',
    paymentMethod: 'BANK_TRANSFER',
    attachments: ['invoice.pdf'],
    notes: 'فاتورة خدمات صيانة شهرية',
    createdAt: new Date('2025-01-13'),
    updatedAt: new Date('2025-01-13'),
  },
  {
    id: '2',
    invoiceNumber: 'INV-20250112001',
    date: new Date('2025-01-12'),
    type: 'INCOMING',
    party: {
      id: '2',
      name: 'شركة المعدات الصناعية',
      type: 'SUPPLIER',
    },
    totalAmount: 8500,
    tax: 1275,
    totalAfterTax: 9775,
    status: 'UNPAID',
    paymentMethod: 'BANK_TRANSFER',
    attachments: ['supplier_invoice.pdf'],
    notes: 'فاتورة شراء معدات جديدة',
    createdAt: new Date('2025-01-12'),
    updatedAt: new Date('2025-01-12'),
  },
  {
    id: '3',
    invoiceNumber: 'INV-20250111001',
    date: new Date('2025-01-11'),
    type: 'OUTGOING',
    party: {
      id: '3',
      name: 'بلدية مسقط',
      type: 'CUSTOMER',
    },
    totalAmount: 15000,
    tax: 2250,
    totalAfterTax: 17250,
    status: 'PENDING',
    paymentMethod: 'BANK_TRANSFER',
    attachments: ['municipality_invoice.pdf'],
    notes: 'فاتورة مشروع صيانة الطرق',
    createdAt: new Date('2025-01-11'),
    updatedAt: new Date('2025-01-11'),
  },
];

// بيانات الفواتير للجدول
export const mockInvoiceTableData: InvoiceTableData[] = mockInvoices.map(invoice => ({
  id: invoice.id,
  invoiceNumber: invoice.invoiceNumber,
  date: invoice.date,
  type: invoice.type,
  partyName: invoice.party.name,
  partyType: invoice.party.type,
  totalAmount: invoice.totalAmount,
  tax: invoice.tax,
  totalAfterTax: invoice.totalAfterTax,
  status: invoice.status,
  paymentMethod: invoice.paymentMethod,
  hasAttachments: Boolean(invoice.attachments && invoice.attachments.length > 0),
  createdAt: invoice.createdAt,
}));

// إحصائيات الفواتير
export const mockInvoiceStats: InvoiceStats = {
  totalInvoices: mockInvoices.length,
  paidInvoices: mockInvoices.filter(i => i.status === 'PAID').length,
  unpaidInvoices: mockInvoices.filter(i => i.status === 'UNPAID').length,
  pendingInvoices: mockInvoices.filter(i => i.status === 'PENDING').length,
  overdueInvoices: mockInvoices.filter(i => i.status === 'OVERDUE').length,
  totalAmount: mockInvoices.reduce((sum, i) => sum + i.totalAfterTax, 0),
  paidAmount: mockInvoices
    .filter(i => i.status === 'PAID')
    .reduce((sum, i) => sum + i.totalAfterTax, 0),
  unpaidAmount: mockInvoices
    .filter(i => i.status === 'UNPAID')
    .reduce((sum, i) => sum + i.totalAfterTax, 0),
  averageInvoiceValue: mockInvoices.reduce((sum, i) => sum + i.totalAfterTax, 0) / mockInvoices.length,
  typeDistribution: {
    OUTGOING: mockInvoices.filter(i => i.type === 'OUTGOING').length,
    INCOMING: mockInvoices.filter(i => i.type === 'INCOMING').length,
  },
  statusDistribution: {
    PAID: mockInvoices.filter(i => i.status === 'PAID').length,
    UNPAID: mockInvoices.filter(i => i.status === 'UNPAID').length,
    PENDING: mockInvoices.filter(i => i.status === 'PENDING').length,
    OVERDUE: mockInvoices.filter(i => i.status === 'OVERDUE').length,
  },
  monthlyInvoices: {
    '2025-01': 3,
    '2024-12': 12,
    '2024-11': 8,
  },
  monthlyAmounts: {
    '2025-01': 29900,
    '2024-12': 125000,
    '2024-11': 89000,
  },
};

// إحصائيات سريعة للتقارير المالية
export const mockQuickFinancialStats: QuickFinancialStats = {
  monthlyIncome: 23000,
  monthlyExpenses: 3250,
  netProfit: 19750,
  growthPercentage: 12.5,
  totalTransactions: mockTransactions.length,
  totalInvoices: mockInvoices.length,
  totalPurchases: mockPurchaseRequests.length,
};

// قوائم الاختيار
export const transactionTypes = [
  { value: 'INCOME', label: 'إيراد' },
  { value: 'EXPENSE', label: 'مصروف' },
  { value: 'TRANSFER', label: 'تحويل' },
];

export const paymentMethods = [
  { value: 'CASH', label: 'نقدي' },
  { value: 'BANK_TRANSFER', label: 'تحويل بنكي' },
  { value: 'CHECK', label: 'شيك' },
  { value: 'CARD', label: 'بطاقة' },
];

export const transactionStatuses = [
  { value: 'PENDING', label: 'في الانتظار' },
  { value: 'COMPLETED', label: 'مكتملة' },
  { value: 'CANCELLED', label: 'ملغية' },
];

export const purchaseRequestStatuses = [
  { value: 'NEW', label: 'جديد' },
  { value: 'UNDER_REVIEW', label: 'قيد المراجعة' },
  { value: 'APPROVED', label: 'معتمد' },
  { value: 'REJECTED', label: 'مرفوض' },
  { value: 'COMPLETED', label: 'مكتمل' },
];

export const purchaseTypes = [
  { value: 'MATERIALS', label: 'مواد' },
  { value: 'EQUIPMENT', label: 'معدات' },
  { value: 'SERVICES', label: 'خدمات' },
];

export const invoiceTypes = [
  { value: 'OUTGOING', label: 'صادرة' },
  { value: 'INCOMING', label: 'واردة' },
];

export const invoiceStatuses = [
  { value: 'PAID', label: 'مدفوعة' },
  { value: 'UNPAID', label: 'غير مدفوعة' },
  { value: 'PENDING', label: 'معلقة' },
  { value: 'OVERDUE', label: 'متأخرة' },
];

export const departments = [
  'الصيانة',
  'المشاريع',
  'التقنية',
  'المحاسبة',
  'الموارد البشرية',
];

export const accounts = [
  'حساب الشركة - البنك الأهلي',
  'حساب الشركة - البنك الوطني',
  'الصندوق النقدي',
  'حساب التوفير',
  'حساب الاستثمار',
];
