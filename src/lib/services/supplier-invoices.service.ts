/**
 * خدمة إدارة فواتير الموردين
 * تحتوي على جميع دوال التعامل مع API فواتير الموردين
 */

import api from '../api';

/**
 * الحصول على قائمة الفواتير
 */
export const getSupplierInvoices = async (params?: {
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
  const response = await api.get('/supplier-invoices', { params });
  return response.data;
};

/**
 * الحصول على تفاصيل فاتورة محددة
 */
export const getSupplierInvoice = async (id: string | number) => {
  const response = await api.get(`/supplier-invoices/${id}`);
  return response.data;
};

/**
 * إنشاء فاتورة جديدة
 */
export const createSupplierInvoice = async (invoiceData: any) => {
  const response = await api.post('/supplier-invoices', invoiceData);
  return response.data;
};

/**
 * تحديث بيانات فاتورة
 */
export const updateSupplierInvoice = async (id: string | number, invoiceData: any) => {
  const response = await api.put(`/supplier-invoices/${id}`, invoiceData);
  return response.data;
};

/**
 * حذف فاتورة
 */
export const deleteSupplierInvoice = async (id: string | number) => {
  const response = await api.delete(`/supplier-invoices/${id}`);
  return response.data;
};

/**
 * الحصول على إحصائيات الفواتير
 */
export const getSupplierInvoiceStats = async (supplierId?: string | number) => {
  const params = supplierId ? { supplier_id: supplierId } : {};
  const response = await api.get('/supplier-invoices/stats', { params });
  return response.data;
};

/**
 * تحديد فاتورة كمدفوعة
 */
export const markInvoiceAsPaid = async (
  id: string | number,
  data?: {
    payment_date?: string;
    payment_method?: string;
  }
) => {
  const response = await api.post(`/supplier-invoices/${id}/mark-as-paid`, data);
  return response.data;
};

/**
 * تحديد فاتورة كمتأخرة
 */
export const markInvoiceAsOverdue = async (id: string | number) => {
  const response = await api.post(`/supplier-invoices/${id}/mark-as-overdue`);
  return response.data;
};

/**
 * إلغاء فاتورة
 */
export const cancelInvoice = async (id: string | number) => {
  const response = await api.post(`/supplier-invoices/${id}/cancel`);
  return response.data;
};

/**
 * تحويل بيانات Laravel إلى نوع SupplierInvoice
 */
export const transformInvoiceData = (invoice: any) => {
  return {
    id: invoice.id?.toString() || '',
    invoiceNumber: invoice.invoice_number || '',
    supplierId: invoice.supplier_id?.toString() || '',
    supplier: invoice.supplier || { name: 'غير معروف' },
    supplierName: invoice.supplier?.name || 'غير معروف',
    amount: parseFloat(invoice.amount) || 0,
    status: invoice.status || 'PENDING',
    dueDate: invoice.due_date ? new Date(invoice.due_date) : new Date(),
    paymentDate: invoice.payment_date ? new Date(invoice.payment_date) : undefined,
    paymentMethod: invoice.payment_method || undefined,
    description: invoice.description || '',
    createdAt: invoice.created_at ? new Date(invoice.created_at) : new Date(),
    updatedAt: invoice.updated_at ? new Date(invoice.updated_at) : new Date(),
  };
};

