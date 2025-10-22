/**
 * خدمة إدارة العملاء
 * تحتوي على جميع دوال التعامل مع API العملاء
 */

import api from '../api';
import { Customer, CustomerTableData } from '../types/customer';

/**
 * الحصول على قائمة العملاء
 */
export const getCustomers = async (params?: {
  search?: string;
  customer_number?: string;
  customer_type?: string;
  status?: string;
  nationality?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}) => {
  const response = await api.get('/customers', { params });
  return response.data;
};

/**
 * الحصول على تفاصيل عميل محدد
 */
export const getCustomer = async (id: string | number) => {
  const response = await api.get(`/customers/${id}`);
  return response.data;
};

/**
 * إنشاء عميل جديد
 */
export const createCustomer = async (customerData: Partial<Customer>) => {
  const response = await api.post('/customers', customerData);
  return response.data;
};

/**
 * تحديث بيانات عميل
 */
export const updateCustomer = async (id: string | number, customerData: Partial<Customer>) => {
  const response = await api.put(`/customers/${id}`, customerData);
  return response.data;
};

/**
 * حذف عميل
 */
export const deleteCustomer = async (id: string | number) => {
  const response = await api.delete(`/customers/${id}`);
  return response.data;
};

/**
 * الحصول على إحصائيات العملاء
 */
export const getCustomerStats = async () => {
  const response = await api.get('/customers/stats');
  return response.data;
};

/**
 * إضافة ملاحظة لعميل
 */
export const addCustomerNote = async (customerId: string | number, note: {
  content: string;
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
}) => {
  const response = await api.post(`/customers/${customerId}/notes`, note);
  return response.data;
};

/**
 * إضافة تعليق لعميل
 */
export const addCustomerComment = async (customerId: string | number, comment: {
  content: string;
  hashtags?: string[];
}) => {
  const response = await api.post(`/customers/${customerId}/comments`, comment);
  return response.data;
};

/**
 * رفع صورة البطاقة الشخصية
 */
export const uploadIdCard = async (customerId: string | number, file: File, type: 'customer' | 'guarantor') => {
  const formData = new FormData();
  formData.append('id_card', file);
  formData.append('type', type);

  const response = await api.post(`/customers/${customerId}/upload-id-card`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * تحويل بيانات Laravel إلى نوع CustomerTableData
 */
export const transformCustomerToTableData = (customer: any): CustomerTableData => {
  return {
    id: customer.id?.toString() || '',
    customerNumber: customer.customer_number || '',
    name: customer.name || '',
    phone: customer.phone || '',
    email: customer.email || '',
    nationality: customer.nationality || '',
    customerType: customer.customer_type || 'INDIVIDUAL',
    idNumber: customer.id_number || '',
    status: customer.status || 'ACTIVE',
    registrationDate: customer.registration_date || customer.created_at,
    contractsCount: customer.contracts_count || 0,
    totalPayments: customer.total_payments || 0,
    pendingAmount: customer.pending_amount || 0,
    rating: customer.rating || 0,
    hasWarnings: Boolean(customer.warnings),
    claimsCount: customer.claims_count || 0,
    idCardCopyPath: customer.id_card_copy || '',
    guarantorIdCardCopyPath: customer.guarantor_id_card_copy || '',
  };
};

/**
 * جلب عقود عميل معين
 */
export const getCustomerContracts = async (customerId: string) => {
  const response = await api.get(`/customers/${customerId}/contracts`);
  return response.data;
};

/**
 * إحصائيات عقود عميل معين
 */
export const getCustomerContractsStats = async (customerId: string) => {
  const response = await api.get(`/customers/${customerId}/contracts/stats`);
  return response.data;
};

/**
 * جلب مطالبات عميل معين (المدفوعات المتأخرة)
 */
export const getCustomerClaims = async (customerId: string) => {
  const response = await api.get(`/customers/${customerId}/claims`);
  return response.data;
};

/**
 * إحصائيات مطالبات عميل معين
 */
export const getCustomerClaimsStats = async (customerId: string) => {
  const response = await api.get(`/customers/${customerId}/claims/stats`);
  return response.data;
};

