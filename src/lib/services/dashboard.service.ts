/**
 * خدمة Dashboard
 * تحتوي على جميع دوال التعامل مع API Dashboard
 */

import api from '../api';

/**
 * الحصول على إحصائيات Dashboard الرئيسية
 */
export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

/**
 * الحصول على بيانات الرسوم البيانية
 */
export const getDashboardCharts = async () => {
  const response = await api.get('/dashboard/charts');
  return response.data;
};

/**
 * الحصول على النشاطات الأخيرة
 */
export const getRecentActivity = async () => {
  const response = await api.get('/dashboard/recent-activity');
  return response.data;
};

