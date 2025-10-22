/**
 * بيانات المرتجعات الوهمية
 * تستخدم في التطوير والاختبار
 */

export interface ReturnStatsData {
  totalReturns: number;
  pendingReturns: number;
  processedReturns: number;
  totalValue: number;
}

export interface ReturnTableData {
  id: string;
  itemName: string;
  customerName: string;
  returnDate: string;
  quantity: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  value: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
}

export const mockReturnStats: ReturnStatsData = {
  totalReturns: 156,
  pendingReturns: 23,
  processedReturns: 133,
  totalValue: 87500,
};

export const mockReturnTableData: ReturnTableData[] = [
  {
    id: '1',
    itemName: 'سقالة معدنية 2 متر',
    customerName: 'شركة البناء الحديث',
    returnDate: '2024-01-15',
    quantity: 5,
    reason: 'عيب في التصنيع',
    status: 'pending',
    value: 2500,
    condition: 'good',
  },
  {
    id: '2',
    itemName: 'لوح خشبي عريض',
    customerName: 'مؤسسة الإنشاءات الكبرى',
    returnDate: '2024-01-14',
    quantity: 10,
    reason: 'تلف أثناء النقل',
    status: 'approved',
    value: 800,
    condition: 'fair',
  },
  {
    id: '3',
    itemName: 'حبل أمان 50 متر',
    customerName: 'شركة المشاريع المتقدمة',
    returnDate: '2024-01-13',
    quantity: 2,
    reason: 'انتهاء صلاحية',
    status: 'processed',
    value: 300,
    condition: 'poor',
  },
  {
    id: '4',
    itemName: 'درابزين أمان',
    customerName: 'مجموعة البناء الشامل',
    returnDate: '2024-01-12',
    quantity: 8,
    reason: 'عدم مطابقة المواصفات',
    status: 'rejected',
    value: 1200,
    condition: 'excellent',
  },
  {
    id: '5',
    itemName: 'سلم متحرك 3 متر',
    customerName: 'شركة التطوير العمراني',
    returnDate: '2024-01-11',
    quantity: 1,
    reason: 'عيب في التصنيع',
    status: 'pending',
    value: 450,
    condition: 'good',
  },
  {
    id: '6',
    itemName: 'صفيحة معدنية',
    customerName: 'مؤسسة الإنشاءات الحديثة',
    returnDate: '2024-01-10',
    quantity: 15,
    reason: 'تلف أثناء النقل',
    status: 'approved',
    value: 1800,
    condition: 'fair',
  },
  {
    id: '7',
    itemName: 'مسامير تثبيت',
    customerName: 'شركة المشاريع الكبرى',
    returnDate: '2024-01-09',
    quantity: 100,
    reason: 'عدم مطابقة المواصفات',
    status: 'processed',
    value: 250,
    condition: 'poor',
  },
  {
    id: '8',
    itemName: 'غطاء حماية',
    customerName: 'مجموعة البناء المتقدم',
    returnDate: '2024-01-08',
    quantity: 20,
    reason: 'انتهاء صلاحية',
    status: 'pending',
    value: 600,
    condition: 'excellent',
  },
];
