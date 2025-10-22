/**
 * ثوابت API العامة
 * يحتوي على جميع الروابط والثوابت المتعلقة بـ API
 */

// Base URL للـ API
export const API_BASE_URL =
  import.meta.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Endpoints للـ API
export const API_ENDPOINTS = {
  // المستخدمين
  USERS: '/users',
  USER_BY_ID: (id: string) => `/users/${id}`,

  // العقود
  CONTRACTS: '/contracts',
  CONTRACT_BY_ID: (id: string) => `/contracts/${id}`,

  // العملاء
  CUSTOMERS: '/customers',
  CUSTOMER_BY_ID: (id: string) => `/customers/${id}`,

  // المعدات
  EQUIPMENT: '/equipment',
  EQUIPMENT_BY_ID: (id: string) => `/equipment/${id}`,

  // التقارير
  REPORTS: '/reports',
  DASHBOARD_STATS: '/reports/dashboard-stats',
} as const;

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
} as const;

// Status Codes
export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Request Timeout
export const REQUEST_TIMEOUT = 10000; // 10 seconds

// تصدير الثوابت العمانية
export * from './oman.constant';
