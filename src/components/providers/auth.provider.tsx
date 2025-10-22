/**
 * مزود المصادقة
 * يدير حالة المستخدم والمصادقة في التطبيق
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthState } from '@/lib/types/user';
import * as authService from '@/lib/services/auth.service';

// تعريف نوع السياق
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  refreshToken: () => Promise<void>;
}

// إنشاء السياق
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// تعريف Props للمزود
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * مزود المصادقة
 * @param children - العناصر الفرعية
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // تهيئة حالة المصادقة عند تحميل المكون
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);

        // التحقق من وجود window (client-side)
        if (typeof window === 'undefined') {
          setIsLoading(false);
          return;
        }

        // محاولة استرداد بيانات المستخدم من التخزين المحلي
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('token');

        if (savedUser && savedToken) {
          const userData = JSON.parse(savedUser);

          // التحقق من صحة الرمز المميز
          const isValid = await validateToken(savedToken);

          if (isValid) {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // الرمز المميز غير صحيح، مسح البيانات المحفوظة
            localStorage.removeItem('user');
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('خطأ في تهيئة المصادقة:', error);
        }
        setError('فشل في تحميل بيانات المستخدم');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // التحقق من صحة الرمز المميز
  const validateToken = async (_token: string): Promise<boolean> => {
    try {
      // استخدام خدمة المصادقة للتحقق من Token
      return await authService.validateToken();
    } catch {
      return false;
    }
  };

  // تسجيل الدخول
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // استخدام Laravel Backend
      const response = await authService.loginUser(email, password);

      if (response.success && response.data) {
        // تحويل البيانات من Laravel format إلى Frontend format
        const laravelUser = response.data.user as any;
        const userData: User = {
          id: laravelUser.id?.toString() || '',
          name: laravelUser.name,
          email: laravelUser.email,
          phone: laravelUser.phone || '',
          role: laravelUser.role || 'user',
          isActive: laravelUser.is_active ?? true,
          createdAt: laravelUser.created_at || new Date().toISOString(),
          updatedAt: laravelUser.updated_at || new Date().toISOString(),
        };

        setUser(userData);
        setIsAuthenticated(true);
      } else {
        throw new Error(response.message || 'فشل في تسجيل الدخول');
      }
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('خطأ في تسجيل الدخول:', error);
      }
      
      // استخراج رسالة الخطأ من الاستجابة
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'فشل في تسجيل الدخول. تحقق من بياناتك.';
      
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // تسجيل الخروج
  const logout = async (): Promise<void> => {
    try {
      // استخدام Laravel Backend
      await authService.logoutUser();

      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('خطأ في تسجيل الخروج:', error);
      }
      // حتى لو فشل الطلب، نقوم بتسجيل الخروج محلياً
      authService.clearAuthData();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // تسجيل مستخدم جديد
  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // محاكاة طلب التسجيل
      await new Promise(resolve => setTimeout(resolve, 1000));

      // في التطبيق الحقيقي، سترسل البيانات إلى API
      if (import.meta.env.DEV) {
        console.log('تسجيل مستخدم جديد:', userData);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('خطأ في التسجيل:', error);
      }
      setError('فشل في إنشاء الحساب');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // تحديث ملف المستخدم
  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user) {
        throw new Error('المستخدم غير مسجل');
      }

      // محاكاة طلب التحديث
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedUser = {
        ...user,
        ...userData,
        updatedAt: new Date().toISOString(),
      };

      // حفظ البيانات المحدثة (client-side only)
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      setUser(updatedUser);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('خطأ في تحديث الملف:', error);
      }
      setError('فشل في تحديث الملف');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // تجديد الرمز المميز
  const refreshToken = async (): Promise<void> => {
    try {
      if (typeof window === 'undefined') {
        throw new Error('لا يمكن تجديد الرمز في server-side');
      }

      // استخدام Laravel Backend
      await authService.refreshToken();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('خطأ في تجديد الرمز:', error);
      }
      // في حالة فشل التجديد، تسجيل الخروج
      await logout();
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register,
    updateProfile,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook لاستخدام سياق المصادقة
 * @returns سياق المصادقة
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
