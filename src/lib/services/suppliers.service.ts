/**
 * خدمة إدارة الموردين
 * تحتوي على جميع دوال التعامل مع API الموردين
 */

import api from '../api';

/**
 * الحصول على قائمة الموردين
 */
export const getSuppliers = async (params?: {
  search?: string;
  supplier_type?: string;
  status?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}) => {
  const response = await api.get('/suppliers', { params });
  return response.data;
};

/**
 * الحصول على تفاصيل مورد محدد
 */
export const getSupplier = async (id: string | number) => {
  const response = await api.get(`/suppliers/${id}`);
  return response.data;
};

/**
 * إنشاء مورد جديد
 */
export const createSupplier = async (supplierData: any) => {
  const response = await api.post('/suppliers', supplierData);
  return response.data;
};

/**
 * تحديث بيانات مورد
 */
export const updateSupplier = async (id: string | number, supplierData: any) => {
  const response = await api.put(`/suppliers/${id}`, supplierData);
  return response.data;
};

/**
 * حذف مورد
 */
export const deleteSupplier = async (id: string | number) => {
  const response = await api.delete(`/suppliers/${id}`);
  return response.data;
};

/**
 * الحصول على إحصائيات الموردين
 */
export const getSupplierStats = async () => {
  const response = await api.get('/suppliers/stats');
  return response.data;
};

/**
 * تفعيل مورد
 */
export const activateSupplier = async (id: string | number) => {
  const response = await api.post(`/suppliers/${id}/activate`);
  return response.data;
};

/**
 * إلغاء تفعيل مورد
 */
export const deactivateSupplier = async (id: string | number) => {
  const response = await api.post(`/suppliers/${id}/deactivate`);
  return response.data;
};

/**
 * تعليق مورد
 */
export const suspendSupplier = async (id: string | number) => {
  const response = await api.post(`/suppliers/${id}/suspend`);
  return response.data;
};

/**
 * تحديث تقييم المورد
 */
export const updateSupplierRating = async (id: string | number, rating: number) => {
  const response = await api.post(`/suppliers/${id}/update-rating`, { rating });
  return response.data;
};

/**
 * تحويل بيانات Laravel إلى نوع SupplierTableData
 */
export const transformSupplierToTableData = (supplier: any) => {
  return {
    id: supplier.id?.toString() || '',
    supplierNumber: supplier.supplier_number || '',
    name: supplier.name || '',
    email: supplier.email || '',
    phone: supplier.phone || '',
    nationality: supplier.nationality || '',
    supplierType: supplier.supplier_type || 'COMPANY',
    idNumber: supplier.commercial_record || supplier.id_number || '',
    status: supplier.status || 'ACTIVE',
    registrationDate: supplier.registration_date ? new Date(supplier.registration_date) : new Date(),
    rating: supplier.rating || 0,
    hasWarnings: supplier.has_warnings || false,
    invoicesCount: supplier.invoices_count || 0,
    totalInvoices: supplier.total_invoices || 0,
    paidAmount: supplier.paid_amount || 0,
    pendingAmount: supplier.pending_amount || 0,
    overdueAmount: supplier.overdue_amount || 0,
    purchasesCount: supplier.purchases_count || 0,
    totalPurchases: supplier.total_purchases || 0,
  };
};

