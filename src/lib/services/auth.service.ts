/**
 * خدمة المصادقة
 * تحتوي على جميع دوال المصادقة مع Laravel Backend
 */

import * as api from '../api';
import { User } from '../types/user';

// تعريف أنواع البيانات
export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    token_type: string;
  };
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  role: string;
}

/**
 * تسجيل الدخول
 */
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await api.login(email, password);
  return response;
};

/**
 * تسجيل الخروج
 */
export const logoutUser = async (): Promise<void> => {
  await api.logout();
};

/**
 * الحصول على معلومات المستخدم الحالي
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.getMe();
  return response.data.user;
};

/**
 * التحقق من صحة Token
 */
export const validateToken = async (): Promise<boolean> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    // محاولة الحصول على معلومات المستخدم للتحقق من Token
    await getCurrentUser();
    return true;
  } catch {
    return false;
  }
};

/**
 * تحديث Token
 */
export const refreshToken = async (): Promise<string> => {
  const response = await api.default.post('/auth/refresh');
  const { data } = response.data;
  
  if (data.token) {
    localStorage.setItem('token', data.token);
    return data.token;
  }
  
  throw new Error('فشل في تحديث Token');
};

/**
 * تسجيل مستخدم جديد
 */
export const registerUser = async (userData: RegisterData): Promise<LoginResponse> => {
  const response = await api.default.post('/auth/register', userData);
  
  const { data } = response.data;
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  if (data.user) {
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  
  return response.data;
};

/**
 * الحصول على بيانات المستخدم من localStorage
 */
export const getStoredUser = (): User | null => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * الحصول على Token من localStorage
 */
export const getStoredToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * مسح بيانات المصادقة من localStorage
 */
export const clearAuthData = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

