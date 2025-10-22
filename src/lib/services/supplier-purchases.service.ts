/**
 * خدمة إدارة مشتريات الموردين
 * تحتوي على جميع دوال التعامل مع API مشتريات الموردين
 */

import api from '../api';

/**
 * الحصول على قائمة المشتريات
 */
export const getSupplierPurchases = async (params?: {
  search?: string;
  supplier_id?: string | number;
  status?: string;
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}) => {
  const response = await api.get('/supplier-purchases', { params });
  return response.data;
};

/**
 * الحصول على تفاصيل مشترى محدد
 */
export const getSupplierPurchase = async (id: string | number) => {
  const response = await api.get(`/supplier-purchases/${id}`);
  return response.data;
};

/**
 * إنشاء مشترى جديد
 */
export const createSupplierPurchase = async (purchaseData: any) => {
  const response = await api.post('/supplier-purchases', purchaseData);
  return response.data;
};

/**
 * تحديث بيانات مشترى
 */
export const updateSupplierPurchase = async (id: string | number, purchaseData: any) => {
  const response = await api.put(`/supplier-purchases/${id}`, purchaseData);
  return response.data;
};

/**
 * حذف مشترى
 */
export const deleteSupplierPurchase = async (id: string | number) => {
  const response = await api.delete(`/supplier-purchases/${id}`);
  return response.data;
};

/**
 * الحصول على إحصائيات المشتريات
 */
export const getSupplierPurchaseStats = async (supplierId?: string | number) => {
  const params = supplierId ? { supplier_id: supplierId } : {};
  const response = await api.get('/supplier-purchases/stats', { params });
  return response.data;
};

/**
 * تأكيد مشترى
 */
export const confirmPurchase = async (id: string | number) => {
  const response = await api.post(`/supplier-purchases/${id}/confirm`);
  return response.data;
};

/**
 * تحديد مشترى كمسلم
 */
export const markPurchaseAsDelivered = async (id: string | number, deliveryDate?: string) => {
  const response = await api.post(`/supplier-purchases/${id}/mark-as-delivered`, {
    delivery_date: deliveryDate,
  });
  return response.data;
};

/**
 * إلغاء مشترى
 */
export const cancelPurchase = async (id: string | number) => {
  const response = await api.post(`/supplier-purchases/${id}/cancel`);
  return response.data;
};

/**
 * إضافة عنصر للمشترى
 */
export const addPurchaseItem = async (purchaseId: string | number, itemData: any) => {
  const response = await api.post(`/supplier-purchases/${purchaseId}/items`, itemData);
  return response.data;
};

/**
 * إزالة عنصر من المشترى
 */
export const removePurchaseItem = async (purchaseId: string | number, itemId: string | number) => {
  const response = await api.delete(`/supplier-purchases/${purchaseId}/items/${itemId}`);
  return response.data;
};

/**
 * الحصول على قائمة عناصر المشتريات
 */
export const getPurchaseItems = async (params?: {
  purchase_id?: string | number;
  status?: string;
  category?: string;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}) => {
  const response = await api.get('/purchase-items', { params });
  return response.data;
};

/**
 * الحصول على تفاصيل عنصر محدد
 */
export const getPurchaseItem = async (id: string | number) => {
  const response = await api.get(`/purchase-items/${id}`);
  return response.data;
};

/**
 * إنشاء عنصر جديد
 */
export const createPurchaseItem = async (itemData: any) => {
  const response = await api.post('/purchase-items', itemData);
  return response.data;
};

/**
 * تحديث بيانات عنصر
 */
export const updatePurchaseItem = async (id: string | number, itemData: any) => {
  const response = await api.put(`/purchase-items/${id}`, itemData);
  return response.data;
};

/**
 * حذف عنصر
 */
export const deletePurchaseItem = async (id: string | number) => {
  const response = await api.delete(`/purchase-items/${id}`);
  return response.data;
};

/**
 * تحديد عنصر كمستلم
 */
export const markItemAsReceived = async (id: string | number, receivedDate?: string) => {
  const response = await api.post(`/purchase-items/${id}/mark-as-received`, {
    received_date: receivedDate,
  });
  return response.data;
};

/**
 * تحديد عنصر كفي الطريق
 */
export const markItemAsInTransit = async (id: string | number) => {
  const response = await api.post(`/purchase-items/${id}/mark-as-in-transit`);
  return response.data;
};

/**
 * تحويل بيانات Laravel إلى نوع SupplierPurchase
 */
export const transformPurchaseData = (purchase: any) => {
  return {
    id: purchase.id?.toString() || '',
    purchaseNumber: purchase.purchase_number || '',
    supplierId: purchase.supplier_id?.toString() || '',
    supplierName: purchase.supplier?.name || '',
    purchaseDate: purchase.purchase_date || '',
    deliveryDate: purchase.delivery_date || null,
    status: purchase.status || 'PENDING',
    totalAmount: purchase.total_amount || 0,
    invoiceId: purchase.invoice_id?.toString() || null,
    notes: purchase.notes || '',
    items: purchase.items || [],
    createdAt: purchase.created_at || '',
  };
};

/**
 * تحويل بيانات Laravel إلى نوع PurchaseItem
 */
export const transformPurchaseItemData = (item: any) => {
  return {
    id: item.id?.toString() || '',
    purchaseId: item.purchase_id?.toString() || '',
    name: item.name || '',
    description: item.description || '',
    quantity: item.quantity || 0,
    unitPrice: item.unit_price || 0,
    totalPrice: item.total_price || 0,
    category: item.category || '',
    unit: item.unit || '',
    receivedDate: item.received_date || null,
    status: item.status || 'معلق',
  };
};

