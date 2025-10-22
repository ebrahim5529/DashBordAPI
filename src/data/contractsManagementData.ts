/**
 * بيانات تجريبية لإدارة العقود
 */

export interface ContractManagementData {
  id: string;
  contractNumber: string;
  customerName: string;
  customerId: string;
  contractType: 'تأجير' | 'شراء' | 'صيانة' | 'تركيب';
  status: 'نشط' | 'منتهي' | 'ملغي' | 'معلق' | 'معتمد';
  totalValue: number;
  paidAmount: number;
  remainingAmount: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  paymentStatus: 'مدفوع بالكامل' | 'مدفوع جزئياً' | 'غير مدفوع';
  equipmentCount: number;
  location: string;
  priority: 'عالي' | 'متوسط' | 'منخفض';
}

export const mockContractsManagementData: ContractManagementData[] = [
  {
    id: '1',
    contractNumber: 'CTR-2024-001',
    customerName: 'شركة البناء الحديث',
    customerId: 'CUST-001',
    contractType: 'تأجير',
    status: 'نشط',
    totalValue: 15000,
    paidAmount: 7500,
    remainingAmount: 7500,
    startDate: '2024-01-15',
    endDate: '2024-07-15',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-15',
    notes: 'عقد تأجير سقالات لمشروع بناء',
    paymentStatus: 'مدفوع جزئياً',
    equipmentCount: 45,
    location: 'مسقط، سلطنة عمان',
    priority: 'عالي'
  },
  {
    id: '2',
    contractNumber: 'CTR-2024-002',
    customerName: 'مؤسسة النهضة للمقاولات',
    customerId: 'CUST-002',
    contractType: 'شراء',
    status: 'معتمد',
    totalValue: 85000,
    paidAmount: 85000,
    remainingAmount: 0,
    startDate: '2024-02-01',
    endDate: '2024-02-01',
    createdAt: '2024-01-25',
    updatedAt: '2024-02-01',
    notes: 'شراء معدات بناء متكاملة',
    paymentStatus: 'مدفوع بالكامل',
    equipmentCount: 120,
    location: 'صلالة، سلطنة عمان',
    priority: 'عالي'
  },
  {
    id: '3',
    contractNumber: 'CTR-2024-003',
    customerName: 'شركة الأمان للإنشاءات',
    customerId: 'CUST-003',
    contractType: 'تأجير',
    status: 'منتهي',
    totalValue: 12000,
    paidAmount: 12000,
    remainingAmount: 0,
    startDate: '2023-11-01',
    endDate: '2024-01-31',
    createdAt: '2023-10-25',
    updatedAt: '2024-01-31',
    notes: 'عقد تأجير منتهي الصلاحية',
    paymentStatus: 'مدفوع بالكامل',
    equipmentCount: 30,
    location: 'نزوى، سلطنة عمان',
    priority: 'متوسط'
  },
  {
    id: '4',
    contractNumber: 'CTR-2024-004',
    customerName: 'شركة الخليج للمشاريع',
    customerId: 'CUST-004',
    contractType: 'صيانة',
    status: 'نشط',
    totalValue: 8500,
    paidAmount: 0,
    remainingAmount: 8500,
    startDate: '2024-01-20',
    endDate: '2024-04-20',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    notes: 'عقد صيانة دورية للمعدات',
    paymentStatus: 'غير مدفوع',
    equipmentCount: 15,
    location: 'صحار، سلطنة عمان',
    priority: 'متوسط'
  },
  {
    id: '5',
    contractNumber: 'CTR-2024-005',
    customerName: 'شركة الرؤية المتقدمة',
    customerId: 'CUST-005',
    contractType: 'تركيب',
    status: 'معلق',
    totalValue: 25000,
    paidAmount: 0,
    remainingAmount: 25000,
    startDate: '2024-03-01',
    endDate: '2024-05-01',
    createdAt: '2024-02-15',
    updatedAt: '2024-02-20',
    notes: 'عقد تركيب في انتظار الموافقة',
    paymentStatus: 'غير مدفوع',
    equipmentCount: 60,
    location: 'صور، سلطنة عمان',
    priority: 'عالي'
  },
  {
    id: '6',
    contractNumber: 'CTR-2024-006',
    customerName: 'شركة المستقبل للاستثمار',
    customerId: 'CUST-006',
    contractType: 'تأجير',
    status: 'ملغي',
    totalValue: 18000,
    paidAmount: 0,
    remainingAmount: 18000,
    startDate: '2024-02-15',
    endDate: '2024-08-15',
    createdAt: '2024-02-10',
    updatedAt: '2024-02-25',
    notes: 'تم إلغاء العقد من قبل العميل',
    paymentStatus: 'غير مدفوع',
    equipmentCount: 50,
    location: 'البريمي، سلطنة عمان',
    priority: 'منخفض'
  },
  {
    id: '7',
    contractNumber: 'CTR-2024-007',
    customerName: 'شركة التقنية المتطورة',
    customerId: 'CUST-007',
    contractType: 'شراء',
    status: 'نشط',
    totalValue: 95000,
    paidAmount: 95000,
    remainingAmount: 0,
    startDate: '2024-01-10',
    endDate: '2024-01-10',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-10',
    notes: 'شراء معدات تقنية متقدمة',
    paymentStatus: 'مدفوع بالكامل',
    equipmentCount: 200,
    location: 'مسقط، سلطنة عمان',
    priority: 'عالي'
  },
  {
    id: '8',
    contractNumber: 'CTR-2024-008',
    customerName: 'شركة الإبداع للإنشاءات',
    customerId: 'CUST-008',
    contractType: 'تأجير',
    status: 'نشط',
    totalValue: 13500,
    paidAmount: 6750,
    remainingAmount: 6750,
    startDate: '2024-02-01',
    endDate: '2024-08-01',
    createdAt: '2024-01-25',
    updatedAt: '2024-02-01',
    notes: 'عقد تأجير طويل الأجل',
    paymentStatus: 'مدفوع جزئياً',
    equipmentCount: 35,
    location: 'عبري، سلطنة عمان',
    priority: 'متوسط'
  },
  {
    id: '9',
    contractNumber: 'CTR-2024-009',
    customerName: 'شركة العمارة الحديثة',
    customerId: 'CUST-009',
    contractType: 'صيانة',
    status: 'منتهي',
    totalValue: 6500,
    paidAmount: 6500,
    remainingAmount: 0,
    startDate: '2023-12-01',
    endDate: '2024-01-31',
    createdAt: '2023-11-25',
    updatedAt: '2024-01-31',
    notes: 'صيانة دورية مكتملة',
    paymentStatus: 'مدفوع بالكامل',
    equipmentCount: 25,
    location: 'الباطنة، سلطنة عمان',
    priority: 'منخفض'
  },
  {
    id: '10',
    contractNumber: 'CTR-2024-010',
    customerName: 'شركة الابتكار للمشاريع',
    customerId: 'CUST-010',
    contractType: 'تركيب',
    status: 'نشط',
    totalValue: 32000,
    paidAmount: 16000,
    remainingAmount: 16000,
    startDate: '2024-02-15',
    endDate: '2024-06-15',
    createdAt: '2024-02-10',
    updatedAt: '2024-02-15',
    notes: 'تركيب نظام متكامل',
    paymentStatus: 'مدفوع جزئياً',
    equipmentCount: 80,
    location: 'الظاهرة، سلطنة عمان',
    priority: 'عالي'
  }
];

// إحصائيات العقود
export const contractsManagementStats = {
  totalContracts: mockContractsManagementData.length,
  activeContracts: mockContractsManagementData.filter(c => c.status === 'نشط').length,
  expiredContracts: mockContractsManagementData.filter(c => c.status === 'منتهي').length,
  cancelledContracts: mockContractsManagementData.filter(c => c.status === 'ملغي').length,
  totalValue: mockContractsManagementData.reduce((sum, c) => sum + c.totalValue, 0),
  paidContracts: mockContractsManagementData.filter(c => c.paymentStatus === 'مدفوع بالكامل').length,
  pendingContracts: mockContractsManagementData.filter(c => c.paymentStatus === 'غير مدفوع').length,
  partialPaymentContracts: mockContractsManagementData.filter(c => c.paymentStatus === 'مدفوع جزئياً').length
};

// إحصائيات العقود النشطة
export const activeContractsStats = {
  totalActiveContracts: mockContractsManagementData.filter(c => c.status === 'نشط').length,
  highValueContracts: mockContractsManagementData.filter(c => c.status === 'نشط' && c.totalValue > 50000).length,
  nearExpiryContracts: mockContractsManagementData.filter(c => c.status === 'نشط').length, // يمكن تحسينها لاحقاً
  totalActiveValue: mockContractsManagementData.filter(c => c.status === 'نشط').reduce((sum, c) => sum + c.totalValue, 0),
  averageContractValue: Math.round(mockContractsManagementData.filter(c => c.status === 'نشط').reduce((sum, c) => sum + c.totalValue, 0) / mockContractsManagementData.filter(c => c.status === 'نشط').length),
  monthlyRevenue: 245000,
};

// نوع بيانات العقود النشطة
export type ActiveContractData = ContractManagementData;

// البيانات التجريبية للعقود النشطة
export const mockActiveContractsData: ActiveContractData[] = mockContractsManagementData.filter(
  contract => contract.status === 'نشط'
);
