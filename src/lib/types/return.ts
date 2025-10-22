/**
 * أنواع البيانات المتعلقة بالمرتجعات
 */

export interface ReturnDetails {
  id: string;
  itemName: string;
  itemCode: string;
  customerName: string;
  customerId: string;
  returnDate: string;
  quantity: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  value: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  notes?: string;
  processedBy?: string;
  processedDate?: string;
  refundAmount?: number;
  refundMethod?: string;
  images?: string[];
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

export interface ReturnStatsData {
  totalReturns: number;
  pendingReturns: number;
  processedReturns: number;
  totalValue: number;
}

export interface ReturnFormData {
  itemName: string;
  itemCode: string;
  customerId: string;
  quantity: number;
  reason: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  notes?: string;
  images?: File[];
}
