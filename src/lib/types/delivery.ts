/**
 * أنواع البيانات المتعلقة بإيصالات التسليم
 */

export interface DeliveryItem {
  id: string;
  name: string;
  quantity: number;
  condition: 'good' | 'damaged' | 'missing';
  notes?: string;
}

export interface DeliveryDetails {
  id: string;
  receiptNumber: string;
  customerName: string;
  customerId: string;
  customerPhone?: string;
  deliveryDate: string;
  itemsCount: number;
  status: 'pending' | 'completed' | 'cancelled';
  value: number;
  deliveryAddress: string;
  driverName: string;
  driverId: string;
  driverPhone?: string;
  notes?: string;
  completedDate?: string;
  signature?: string;
  images?: string[];
  // بيانات سند الاستلام الجديدة
  items?: DeliveryItem[];
  totalItems?: number;
  receiverName?: string;
  receiverPhone?: string;
  receiverSignature?: string;
  delivererSignature?: string;
  relatedOrders?: string[];
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

export interface DeliveryStatsData {
  totalDeliveries: number;
  completedDeliveries: number;
  pendingDeliveries: number;
  totalValue: number;
}

export interface DeliveryFormData {
  receiptNumber: string;
  customerId: string;
  deliveryDate: string;
  itemsCount: number;
  deliveryAddress: string;
  driverId: string;
  notes?: string;
}
