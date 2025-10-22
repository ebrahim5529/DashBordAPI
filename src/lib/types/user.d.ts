/**
 * تعريف أنواع TypeScript للمستخدمين
 * يحتوي على جميع الأنواع المتعلقة بالمستخدمين
 */

// نوع المستخدم الأساسي
export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  isActive: boolean
  avatar?: string
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

// أدوار المستخدمين
export type UserRole = 'admin' | 'manager' | 'employee'

// بيانات إنشاء مستخدم جديد
export interface CreateUserData {
  name: string
  email: string
  phone: string
  role: UserRole
  password: string
  isActive?: boolean
}

// بيانات تحديث مستخدم
export interface UpdateUserData {
  name?: string
  email?: string
  phone?: string
  role?: UserRole
  isActive?: boolean
  avatar?: string
}

// بيانات تسجيل الدخول
export interface LoginData {
  email: string
  password: string
  rememberMe?: boolean
}

// بيانات تغيير كلمة المرور
export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// استجابة API للمستخدمين
export interface UserResponse {
  success: boolean
  data: User
  message?: string
}

// استجابة API لقائمة المستخدمين
export interface UsersResponse {
  success: boolean
  data: User[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  message?: string
}

// حالة المستخدم الحالي
export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// إعدادات المستخدم
export interface UserSettings {
  theme: 'light' | 'dark' | 'system'
  language: 'ar' | 'en'
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  dashboard: {
    defaultView: 'grid' | 'list'
    itemsPerPage: number
  }
}

// إحصائيات المستخدم
export interface UserStats {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  newUsersThisMonth: number
  usersByRole: {
    admin: number
    manager: number
    employee: number
  }
}
