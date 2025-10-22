/**
 * خدمة إدارة المدفوعات
 * تحتوي على جميع دوال التعامل مع API المدفوعات
 */

import api from '../api';

/**
 * الحصول على قائمة المدفوعات
 */
export const getPayments = async (params?: {
  search?: string;
  status?: string;
  payment_method?: string;
  customer_id?: string;
  contract_id?: string;
  start_date?: string;
  end_date?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}) => {
  const response = await api.get('/payments', { params });
  return response.data;
};

/**
 * الحصول على تفاصيل دفعة محددة
 */
export const getPayment = async (id: string | number) => {
  const response = await api.get(`/payments/${id}`);
  return response.data;
};

/**
 * إنشاء دفعة جديدة
 */
export const createPayment = async (paymentData: any) => {
  const response = await api.post('/payments', paymentData);
  return response.data;
};

/**
 * تحديث بيانات دفعة
 */
export const updatePayment = async (id: string | number, paymentData: any) => {
  const response = await api.put(`/payments/${id}`, paymentData);
  return response.data;
};

/**
 * حذف دفعة
 */
export const deletePayment = async (id: string | number) => {
  const response = await api.delete(`/payments/${id}`);
  return response.data;
};

/**
 * الحصول على إحصائيات المدفوعات
 */
export const getPaymentStats = async () => {
  const response = await api.get('/payments/stats');
  return response.data;
};

/**
 * رفع صورة شيك
 */
export const uploadCheckImage = async (paymentId: string | number, file: File) => {
  const formData = new FormData();
  formData.append('check_image', file);

  const response = await api.post(`/payments/${paymentId}/upload-check-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * تحويل بيانات Laravel إلى نوع PaymentTableData
 */
export const transformPaymentToTableData = (payment: any) => {
  return {
    id: payment.id?.toString() || '',
    transactionNumber: payment.transaction_number || `PAY-${payment.id}`,
    customerName: payment.customer?.name || '',
    customerId: payment.customer_id?.toString() || '',
    contractNumber: payment.contract?.contract_number || '',
    amount: payment.amount || 0,
    paymentDate: payment.payment_date,
    paymentMethod: payment.payment_method || 'cash',
    status: payment.status || 'pending',
    description: payment.description || '',
  };
};

