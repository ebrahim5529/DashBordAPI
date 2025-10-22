/**
 * خدمة إدارة العقود
 * تحتوي على جميع دوال التعامل مع API العقود
 */

import api from '../api';

/**
 * الحصول على قائمة العقود
 */
export const getContracts = async (params?: {
  search?: string;
  status?: string;
  contract_type?: string;
  customer_id?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}) => {
  const response = await api.get('/contracts', { params });
  return response.data;
};

/**
 * الحصول على تفاصيل عقد محدد
 */
export const getContract = async (id: string | number) => {
  const response = await api.get(`/contracts/${id}`);
  return response.data;
};

/**
 * إنشاء عقد جديد
 */
export const createContract = async (contractData: any) => {
  const response = await api.post('/contracts', contractData);
  return response.data;
};

/**
 * تحديث بيانات عقد
 */
export const updateContract = async (id: string | number, contractData: any) => {
  const response = await api.put(`/contracts/${id}`, contractData);
  return response.data;
};

/**
 * حذف عقد
 */
export const deleteContract = async (id: string | number) => {
  const response = await api.delete(`/contracts/${id}`);
  return response.data;
};

/**
 * الحصول على إحصائيات العقود
 */
export const getContractStats = async () => {
  const response = await api.get('/contracts/stats');
  return response.data;
};

/**
 * إضافة توقيع للعقد
 */
export const addContractSignature = async (contractId: string | number, signatureData: any) => {
  const response = await api.post(`/contracts/${contractId}/signature`, signatureData);
  return response.data;
};

/**
 * تحميل PDF للعقد
 */
export const downloadContractPdf = async (contractId: string | number) => {
  const response = await api.get(`/contracts/${contractId}/pdf`, {
    responseType: 'blob',
  });
  return response.data;
};

/**
 * إرسال العقد عبر WhatsApp
 */
export const sendContractWhatsApp = async (contractId: string | number, phoneNumber: string) => {
  const response = await api.post(`/contracts/${contractId}/send-whatsapp`, {
    phone: phoneNumber,
  });
  return response.data;
};

/**
 * الحصول على قائمة العملاء لاستخدامها في نموذج العقد
 */
export const getCustomersForContract = async () => {
  const response = await api.get('/customers');
  return response.data;
};

/**
 * تحويل حالة العقد من الإنجليزية إلى العربية
 */
const translateContractStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'ACTIVE': 'نشط',
    'EXPIRED': 'منتهي',
    'CANCELLED': 'ملغي',
    'PENDING': 'معلق',
    'APPROVED': 'معتمد',
  };
  return statusMap[status?.toUpperCase()] || status;
};

/**
 * تحويل نوع العقد من الإنجليزية إلى العربية
 */
const translateContractType = (type: string): string => {
  const typeMap: Record<string, string> = {
    'RENTAL': 'تأجير',
    'SALE': 'شراء',
    'MAINTENANCE': 'صيانة',
    'INSTALLATION': 'تركيب',
  };
  return typeMap[type?.toUpperCase()] || type;
};

/**
 * تحويل بيانات Laravel إلى نوع ContractTableData
 */
export const transformContractToTableData = (contract: any) => {
  return {
    id: contract.id?.toString() || '',
    contractNumber: contract.contract_number || '',
    customerName: contract.customer_name || contract.customer?.name || '',
    customerId: contract.customer_id?.toString() || '',
    contractDate: contract.contract_date || contract.created_at,
    startDate: contract.start_date,
    endDate: contract.end_date,
    totalValue: contract.total_contract_value || contract.total_after_discount || 0,
    status: translateContractStatus(contract.status || 'ACTIVE'), // تحويل إلى العربية
    contractType: translateContractType(contract.contract_type || 'RENTAL'), // تحويل إلى العربية
    location: contract.delivery_address || '',
    paidAmount: contract.paid_amount || 0,
    remainingAmount: contract.remaining_amount || 0,
    createdAt: contract.created_at,
    updatedAt: contract.updated_at,
  };
};

