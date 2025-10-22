// ملف تكوين API للاتصال بـ Laravel Backend
import axios from 'axios';

// إعدادات API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// إنشاء instance من axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// إضافة interceptor للطلبات
api.interceptors.request.use(
  (config) => {
    // إضافة token إذا كان موجوداً
    const token = localStorage.getItem('token'); // تغيير من auth_token إلى token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (import.meta.env.DEV) {
      console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// إضافة interceptor للاستجابات
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status, error.config?.url);
    
    // التعامل مع أخطاء المصادقة
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// دالة اختبار الاتصال
export const testConnection = async () => {
  try {
    const response = await api.get('/test');
    console.log('✅ Laravel API متصل:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ فشل الاتصال بـ Laravel API:', error);
    throw error;
  }
};

// دالة تسجيل الدخول
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    
    const { data } = response.data;
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ فشل تسجيل الدخول:', error);
    throw error;
  }
};

// دالة تسجيل الخروج
export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('❌ فشل تسجيل الخروج:', error);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// دالة الحصول على معلومات المستخدم
export const getMe = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('❌ فشل الحصول على معلومات المستخدم:', error);
    throw error;
  }
};

// دالة الحصول على العملاء
export const getCustomers = async (params?: any) => {
  try {
    const response = await api.get('/customers', { params });
    return response.data;
  } catch (error) {
    console.error('❌ فشل الحصول على العملاء:', error);
    throw error;
  }
};

// دالة إنشاء عميل جديد
export const createCustomer = async (customerData: any) => {
  try {
    const response = await api.post('/customers', customerData);
    return response.data;
  } catch (error) {
    console.error('❌ فشل إنشاء العميل:', error);
    throw error;
  }
};

// دالة الحصول على العقود
export const getContracts = async (params?: any) => {
  try {
    const response = await api.get('/contracts', { params });
    return response.data;
  } catch (error) {
    console.error('❌ فشل الحصول على العقود:', error);
    throw error;
  }
};

// دالة الحصول على المدفوعات
export const getPayments = async (params?: any) => {
  try {
    const response = await api.get('/payments', { params });
    return response.data;
  } catch (error) {
    console.error('❌ فشل الحصول على المدفوعات:', error);
    throw error;
  }
};

// دالة الحصول على السقالات
export const getScaffolds = async (params?: any) => {
  try {
    const response = await api.get('/scaffolds', { params });
    return response.data;
  } catch (error) {
    console.error('❌ فشل الحصول على السقالات:', error);
    throw error;
  }
};

// دالة الحصول على إحصائيات Dashboard
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/dashboard/stats');
    return response.data;
  } catch (error) {
    console.error('❌ فشل الحصول على إحصائيات Dashboard:', error);
    throw error;
  }
};

export default api;
