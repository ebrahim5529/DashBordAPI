/**
 * بيانات تجريبية للجدول المتقدم للعقود
 */

import { 
  AdvancedContract, 
  ContractsStats
} from '@/lib/types/contracts';

// بيانات العقود المتقدمة
export const advancedContractsData: AdvancedContract[] = [
  {
    id: '1',
    contractNumber: '1',
    customerName: 'عميل تجريبي',
    contractType: 'تأجير',
    status: 'نشط',
    progress: {
      stages: ['في المخزن', 'خرج للتسليم', 'لدى العميل', 'عاد إلى المخزن'],
      currentStage: 2 // لدى العميل
    },
    branch: 'فرع الرياض الرئيسي',
    createdDate: '20/01/2024',
    contractPeriod: {
      from: '20/01/2024',
      to: '20/02/2024'
    },
    items: [
      { name: 'Test Frame (2m)', quantity: 10, hasStockIssue: false },
      { name: 'Test Plank (3m)', quantity: 20, hasStockIssue: false }
    ],
    totalAmount: 57.50,
    paymentStatus: 'مدفوع بالكامل',
    paidAmount: 57.50,
    remainingAmount: 0,
    hasOverdue: false,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    contractNumber: '2',
    customerName: 'سارة أحمد',
    contractType: 'تأجير',
    status: 'مسودة',
    progress: {
      stages: ['في المخزن', 'خرج للتسليم', 'لدى العميل', 'عاد إلى المخزن'],
      currentStage: 0 // في المخزن
    },
    branch: 'فرع الرياض الرئيسي',
    createdDate: '18/01/2024',
    contractPeriod: null,
    items: [
      { name: 'Plank (2.5m)', quantity: 35, hasStockIssue: true }
    ],
    totalAmount: 92.00,
    paymentStatus: 'بدون فاتورة',
    paidAmount: 0,
    remainingAmount: 92.00,
    hasOverdue: true,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '3',
    contractNumber: '3',
    customerName: 'أحمد محمد',
    contractType: 'تأجير',
    status: 'نشط',
    progress: {
      stages: ['في المخزن', 'خرج للتسليم', 'لدى العميل', 'عاد إلى المخزن'],
      currentStage: 1 // خرج للتسليم
    },
    branch: 'فرع الرياض الرئيسي',
    createdDate: '15/01/2024',
    contractPeriod: {
      from: '20/01/2024',
      to: '20/02/2024'
    },
    items: [
      { name: 'Frame (2m)', quantity: 20, hasStockIssue: false },
      { name: 'Plank (3m)', quantity: 50, hasStockIssue: false },
      { name: 'Support (متوسط)', quantity: 15, hasStockIssue: true }
    ],
    totalAmount: 115.00,
    paymentStatus: 'مدفوع جزئياً',
    paidAmount: 50.00,
    remainingAmount: 65.00,
    hasOverdue: false,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '4',
    contractNumber: '4',
    customerName: 'خالد عبدالله',
    contractType: 'شراء',
    status: 'نشط',
    progress: {
      stages: ['في المخزن', 'خرج للتسليم', 'لدى العميل', 'عاد إلى المخزن'],
      currentStage: 0 // في المخزن
    },
    branch: 'فرع الدمام',
    createdDate: '14/01/2024',
    contractPeriod: null,
    items: [
      { name: 'Beam (5m)', quantity: 8, hasStockIssue: false },
      { name: 'Connector (متوسط)', quantity: 60, hasStockIssue: false }
    ],
    totalAmount: 126.50,
    paymentStatus: 'غير مسدد',
    paidAmount: 0,
    remainingAmount: 126.50,
    hasOverdue: true,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: '5',
    contractNumber: '5',
    customerName: 'محمد السعد',
    contractType: 'تأجير',
    status: 'معتمد',
    progress: {
      stages: ['في المخزن', 'خرج للتسليم', 'لدى العميل', 'عاد إلى المخزن'],
      currentStage: 2 // لدى العميل
    },
    branch: 'فرع الرياض الرئيسي',
    createdDate: '12/01/2024',
    contractPeriod: {
      from: '25/01/2024',
      to: '25/03/2024'
    },
    items: [
      { name: 'Frame (1.5m)', quantity: 15, hasStockIssue: false },
      { name: 'Support (صغير)', quantity: 40, hasStockIssue: false }
    ],
    totalAmount: 172.50,
    paymentStatus: 'غير مسدد',
    paidAmount: 0,
    remainingAmount: 172.50,
    hasOverdue: false,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: '6',
    contractNumber: '6',
    customerName: 'فاطمة علي',
    contractType: 'شراء',
    status: 'منتهي',
    progress: {
      stages: ['في المخزن', 'خرج للتسليم', 'لدى العميل', 'عاد إلى المخزن'],
      currentStage: 0 // في المخزن
    },
    branch: 'فرع جدة',
    createdDate: '10/01/2024',
    contractPeriod: null,
    items: [
      { name: 'Beam (4m)', quantity: 10, hasStockIssue: false },
      { name: 'Joint (كبير)', quantity: 25, hasStockIssue: false }
    ],
    totalAmount: 287.50,
    paymentStatus: 'مدفوع بالكامل',
    paidAmount: 287.50,
    remainingAmount: 0,
    hasOverdue: false,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '7',
    contractNumber: '7',
    customerName: 'نورا حسن',
    contractType: 'تأجير',
    status: 'ملغى',
    progress: {
      stages: ['في المخزن', 'خرج للتسليم', 'لدى العميل', 'عاد إلى المخزن'],
      currentStage: 0 // في المخزن
    },
    branch: 'فرع جدة',
    createdDate: '08/01/2024',
    contractPeriod: {
      from: '15/01/2024',
      to: '15/02/2024'
    },
    items: [
      { name: 'Frame (3m)', quantity: 12, hasStockIssue: false }
    ],
    totalAmount: 69.00,
    paymentStatus: 'بدون فاتورة',
    paidAmount: 0,
    remainingAmount: 69.00,
    hasOverdue: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
];

// إحصائيات العقود المتقدمة
export const advancedContractsStats: ContractsStats = {
  totalContracts: 7,
  activeContracts: 3,
  expiredContracts: 1,
  cancelledContracts: 0,
  totalValue: 920.00,
  totalPaid: 479.50,
  totalPending: 440.50,
  contractsThisMonth: 7,
  averageContractValue: 131.43,
  completionRate: 85.7
};
