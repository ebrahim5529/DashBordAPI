/**
 * بيانات المشتريات
 */

export interface PurchaseStats {
  totalPurchases: number;
  totalAmount: number;
  pendingPurchases: number;
  completedPurchases: number;
  cancelledPurchases: number;
  averagePurchaseValue: number;
}

export interface PurchaseTableData {
  id: string;
  purchaseNumber: string;
  supplierName: string;
  purchaseDate: string;
  totalAmount: number;
  status: 'completed' | 'pending' | 'cancelled' | 'in_transit';
  paymentStatus: 'paid' | 'pending' | 'overdue';
  itemsCount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockPurchaseStats: PurchaseStats = {
  totalPurchases: 89,
  totalAmount: 850000,
  pendingPurchases: 8,
  completedPurchases: 75,
  cancelledPurchases: 6,
  averagePurchaseValue: 9550,
};

export const mockPurchaseTableData: PurchaseTableData[] = [
  {
    id: '1',
    purchaseNumber: 'PUR-2024-001',
    supplierName: 'شركة مواد البناء المتقدمة',
    purchaseDate: '2024-02-15',
    totalAmount: 45000,
    status: 'completed',
    paymentStatus: 'paid',
    itemsCount: 12,
    notes: 'مواد سقالات جديدة',
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-02-15T10:00:00Z',
  },
  {
    id: '2',
    purchaseNumber: 'PUR-2024-002',
    supplierName: 'مؤسسة المعدات الصناعية',
    purchaseDate: '2024-02-20',
    totalAmount: 28000,
    status: 'in_transit',
    paymentStatus: 'pending',
    itemsCount: 8,
    notes: 'معدات أمان',
    createdAt: '2024-02-20T14:30:00Z',
    updatedAt: '2024-02-20T14:30:00Z',
  },
  {
    id: '3',
    purchaseNumber: 'PUR-2024-003',
    supplierName: 'شركة الخدمات التقنية',
    purchaseDate: '2024-02-25',
    totalAmount: 15000,
    status: 'pending',
    paymentStatus: 'pending',
    itemsCount: 5,
    notes: 'أدوات صيانة',
    createdAt: '2024-02-25T09:15:00Z',
    updatedAt: '2024-02-25T09:15:00Z',
  },
  {
    id: '4',
    purchaseNumber: 'PUR-2024-004',
    supplierName: 'مورد المعدات الثقيلة',
    purchaseDate: '2024-02-10',
    totalAmount: 95000,
    status: 'completed',
    paymentStatus: 'paid',
    itemsCount: 3,
    notes: 'معدات ثقيلة للاستئجار',
    createdAt: '2024-02-10T11:45:00Z',
    updatedAt: '2024-02-10T11:45:00Z',
  },
  {
    id: '5',
    purchaseNumber: 'PUR-2024-005',
    supplierName: 'شركة الإمدادات العامة',
    purchaseDate: '2024-02-28',
    totalAmount: 12000,
    status: 'cancelled',
    paymentStatus: 'pending',
    itemsCount: 7,
    notes: 'تم الإلغاء - تغيير في المواصفات',
    createdAt: '2024-02-28T16:20:00Z',
    updatedAt: '2024-02-28T16:20:00Z',
  },
];
