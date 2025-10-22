/**
 * خدمة إدارة السقالات
 * تحتوي على جميع دوال التعامل مع API السقالات
 */

import api from '../api';

/**
 * الحصول على قائمة السقالات
 */
export const getScaffolds = async (params?: {
  search?: string;
  status?: string;
  type?: string;
  material?: string;
  condition?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}) => {
  const response = await api.get('/scaffolds', { params });
  return response.data;
};

/**
 * الحصول على السقالات المتاحة فقط
 */
export const getAvailableScaffolds = async () => {
  const response = await api.get('/scaffolds/available');
  return response.data;
};

/**
 * الحصول على تفاصيل سقالة محددة
 */
export const getScaffold = async (id: string | number) => {
  const response = await api.get(`/scaffolds/${id}`);
  return response.data;
};

/**
 * إنشاء سقالة جديدة
 */
export const createScaffold = async (scaffoldData: any) => {
  const response = await api.post('/scaffolds', scaffoldData);
  return response.data;
};

/**
 * تحديث بيانات سقالة
 */
export const updateScaffold = async (id: string | number, scaffoldData: any) => {
  const response = await api.put(`/scaffolds/${id}`, scaffoldData);
  return response.data;
};

/**
 * حذف سقالة
 */
export const deleteScaffold = async (id: string | number) => {
  const response = await api.delete(`/scaffolds/${id}`);
  return response.data;
};

/**
 * الحصول على إحصائيات السقالات
 */
export const getScaffoldStats = async () => {
  const response = await api.get('/scaffolds/stats');
  return response.data;
};

/**
 * إضافة صيانة للسقالة
 */
export const addScaffoldMaintenance = async (scaffoldId: string | number, maintenanceData: any) => {
  const response = await api.post(`/scaffolds/${scaffoldId}/maintenance`, maintenanceData);
  return response.data;
};

/**
 * تحويل بيانات Laravel إلى نوع ScaffoldTableData
 */
export const transformScaffoldToTableData = (scaffold: any) => {
  const size = typeof scaffold.size === 'string' ? JSON.parse(scaffold.size) : scaffold.size;
  
  return {
    id: scaffold.id?.toString() || '',
    scaffoldNumber: scaffold.scaffold_number || '',
    type: scaffold.type || 'STANDARD',
    material: scaffold.material || 'STEEL',
    height: size?.height || 0,
    width: size?.width || 0,
    length: size?.length || 0,
    quantity: scaffold.quantity || 1,
    availableQuantity: scaffold.available_quantity || 0,
    status: scaffold.status || 'AVAILABLE',
    condition: scaffold.condition || 'GOOD',
    location: scaffold.warehouse_location || scaffold.location || '',
    dailyRentalPrice: scaffold.daily_rental_price || 0,
    monthlyRentalPrice: scaffold.monthly_rental_price || 0,
    sellingPrice: scaffold.selling_price || 0,
    entryDate: scaffold.entry_date,
  };
};

