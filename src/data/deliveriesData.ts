/**
 * بيانات إيصالات التسليم الوهمية
 * تستخدم في التطوير والاختبار
 */

export interface DeliveryStatsData {
  totalDeliveries: number;
  completedDeliveries: number;
  pendingDeliveries: number;
  totalValue: number;
}

export interface DeliveryTableData {
  id: string;
  receiptNumber: string;
  customerName: string;
  deliveryDate: string;
  itemsCount: number;
  status: 'pending' | 'completed' | 'cancelled';
  value: number;
  deliveryAddress: string;
  driverName: string;
}

export const mockDeliveryStats: DeliveryStatsData = {
  totalDeliveries: 245,
  completedDeliveries: 198,
  pendingDeliveries: 47,
  totalValue: 156800,
};

export const mockDeliveryTableData: DeliveryTableData[] = [
  {
    id: '1',
    receiptNumber: 'DR-CTR-2024-010-941794',
    customerName: 'شركة البناء الحديث',
    deliveryDate: '2024-01-15',
    itemsCount: 15,
    status: 'completed',
    value: 8500,
    deliveryAddress: 'الرياض، حي النرجس، شارع الملك فهد',
    driverName: 'أحمد محمد',
  },
  {
    id: '2',
    receiptNumber: 'DR-2024-002',
    customerName: 'مؤسسة الإنشاءات الكبرى',
    deliveryDate: '2024-01-14',
    itemsCount: 8,
    status: 'pending',
    value: 4200,
    deliveryAddress: 'جدة، حي الزهراء، شارع الأمير سلطان',
    driverName: 'محمد علي',
  },
  {
    id: '3',
    receiptNumber: 'DR-2024-003',
    customerName: 'شركة المشاريع المتقدمة',
    deliveryDate: '2024-01-13',
    itemsCount: 22,
    status: 'completed',
    value: 12800,
    deliveryAddress: 'الدمام، حي الشاطئ، شارع الكورنيش',
    driverName: 'سعد أحمد',
  },
  {
    id: '4',
    receiptNumber: 'DR-2024-004',
    customerName: 'مجموعة البناء الشامل',
    deliveryDate: '2024-01-12',
    itemsCount: 12,
    status: 'cancelled',
    value: 6500,
    deliveryAddress: 'الرياض، حي الملز، شارع العليا',
    driverName: 'خالد حسن',
  },
  {
    id: '5',
    receiptNumber: 'DR-2024-005',
    customerName: 'شركة التطوير العمراني',
    deliveryDate: '2024-01-11',
    itemsCount: 18,
    status: 'pending',
    value: 9200,
    deliveryAddress: 'جدة، حي الروضة، شارع التحلية',
    driverName: 'عبدالله محمد',
  },
  {
    id: '6',
    receiptNumber: 'DR-2024-006',
    customerName: 'مؤسسة الإنشاءات الحديثة',
    deliveryDate: '2024-01-10',
    itemsCount: 6,
    status: 'completed',
    value: 3200,
    deliveryAddress: 'الدمام، حي الفيصلية، شارع الملك عبدالعزيز',
    driverName: 'فهد العتيبي',
  },
  {
    id: '7',
    receiptNumber: 'DR-2024-007',
    customerName: 'شركة المشاريع الكبرى',
    deliveryDate: '2024-01-09',
    itemsCount: 25,
    status: 'completed',
    value: 14500,
    deliveryAddress: 'الرياض، حي النهضة، شارع الملك عبدالله',
    driverName: 'ناصر القحطاني',
  },
  {
    id: '8',
    receiptNumber: 'DR-2024-008',
    customerName: 'مجموعة البناء المتقدم',
    deliveryDate: '2024-01-08',
    itemsCount: 14,
    status: 'pending',
    value: 7800,
    deliveryAddress: 'جدة، حي الصفا، شارع الأمير محمد',
    driverName: 'ماجد الشمري',
  },
];
