/**
 * بيانات وهمية لأدوار المستخدمين والصلاحيات
 */

// أنواع البيانات
export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  color: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  isEnabled: boolean;
}

export interface PermissionCategory {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

// بيانات أدوار المستخدمين
export const userRolesData: UserRole[] = [
  {
    id: '1',
    name: 'مدير النظام',
    description: 'صلاحيات كاملة على جميع أجزاء النظام',
    permissions: ['read', 'write', 'delete', 'admin', 'user_management', 'system_settings'],
    userCount: 2,
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'مدير المبيعات',
    description: 'إدارة المبيعات والعقود والعملاء',
    permissions: ['read', 'write', 'sales', 'contracts', 'customers'],
    userCount: 5,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    isActive: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-20T14:15:00Z',
  },
  {
    id: '3',
    name: 'محاسب',
    description: 'إدارة الحسابات والمدفوعات والتقارير المالية',
    permissions: ['read', 'write', 'financial', 'payments', 'reports'],
    userCount: 3,
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    isActive: true,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-18T09:45:00Z',
  },
  {
    id: '4',
    name: 'موظف مخازن',
    description: 'إدارة المخزون والمعدات والمشتريات',
    permissions: ['read', 'write', 'inventory', 'warehouse', 'purchases'],
    userCount: 8,
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    isActive: true,
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-22T16:20:00Z',
  },
  {
    id: '5',
    name: 'موظف استقبال',
    description: 'الوصول المحدود للقراءة فقط',
    permissions: ['read'],
    userCount: 4,
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    isActive: true,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-10T11:30:00Z',
  },
  {
    id: '6',
    name: 'مدير الموارد البشرية',
    description: 'إدارة الموظفين والرواتب والحضور',
    permissions: ['read', 'write', 'hr', 'employees', 'salaries', 'attendance'],
    userCount: 2,
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    isActive: true,
    createdAt: '2024-01-06T00:00:00Z',
    updatedAt: '2024-01-25T13:45:00Z',
  },
  {
    id: '7',
    name: 'مشرف العمليات',
    description: 'إدارة عمليات التوصيل والشحن',
    permissions: ['read', 'write', 'operations', 'delivery', 'shipping'],
    userCount: 3,
    color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    isActive: true,
    createdAt: '2024-01-07T00:00:00Z',
    updatedAt: '2024-01-28T08:15:00Z',
  },
  {
    id: '8',
    name: 'مراجع',
    description: 'مراجعة البيانات والتقارير فقط',
    permissions: ['read', 'audit'],
    userCount: 1,
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    isActive: false,
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-12T15:30:00Z',
  },
];

// بيانات فئات الصلاحيات
export const permissionCategories: PermissionCategory[] = [
  {
    id: 'dashboard',
    name: 'لوحة التحكم',
    description: 'صلاحيات الوصول إلى لوحة التحكم والتقارير',
    permissions: [
      {
        id: 'dashboard_view',
        name: 'عرض لوحة التحكم',
        description: 'القدرة على عرض لوحة التحكم الرئيسية',
        category: 'dashboard',
        isEnabled: true,
      },
      {
        id: 'dashboard_analytics',
        name: 'التحليلات والإحصائيات',
        description: 'عرض التحليلات والإحصائيات المتقدمة',
        category: 'dashboard',
        isEnabled: false,
      },
      {
        id: 'dashboard_reports',
        name: 'التقارير',
        description: 'إنشاء وتصدير التقارير',
        category: 'dashboard',
        isEnabled: false,
      },
    ],
  },
  {
    id: 'users',
    name: 'إدارة المستخدمين',
    description: 'صلاحيات إدارة المستخدمين والأدوار',
    permissions: [
      {
        id: 'users_view',
        name: 'عرض المستخدمين',
        description: 'عرض قائمة المستخدمين',
        category: 'users',
        isEnabled: true,
      },
      {
        id: 'users_create',
        name: 'إضافة مستخدمين',
        description: 'إضافة مستخدمين جدد',
        category: 'users',
        isEnabled: false,
      },
      {
        id: 'users_edit',
        name: 'تعديل المستخدمين',
        description: 'تعديل بيانات المستخدمين',
        category: 'users',
        isEnabled: false,
      },
      {
        id: 'users_delete',
        name: 'حذف المستخدمين',
        description: 'حذف المستخدمين',
        category: 'users',
        isEnabled: false,
      },
      {
        id: 'roles_manage',
        name: 'إدارة الأدوار',
        description: 'إدارة أدوار المستخدمين',
        category: 'users',
        isEnabled: false,
      },
    ],
  },
  {
    id: 'customers',
    name: 'إدارة العملاء',
    description: 'صلاحيات إدارة العملاء والعقود',
    permissions: [
      {
        id: 'customers_view',
        name: 'عرض العملاء',
        description: 'عرض قائمة العملاء',
        category: 'customers',
        isEnabled: true,
      },
      {
        id: 'customers_create',
        name: 'إضافة عملاء',
        description: 'إضافة عملاء جدد',
        category: 'customers',
        isEnabled: false,
      },
      {
        id: 'customers_edit',
        name: 'تعديل العملاء',
        description: 'تعديل بيانات العملاء',
        category: 'customers',
        isEnabled: false,
      },
      {
        id: 'contracts_manage',
        name: 'إدارة العقود',
        description: 'إدارة العقود والاتفاقيات',
        category: 'customers',
        isEnabled: false,
      },
    ],
  },
  {
    id: 'financial',
    name: 'الإدارة المالية',
    description: 'صلاحيات إدارة المدفوعات والحسابات',
    permissions: [
      {
        id: 'payments_view',
        name: 'عرض المدفوعات',
        description: 'عرض سجل المدفوعات',
        category: 'financial',
        isEnabled: true,
      },
      {
        id: 'payments_create',
        name: 'تسجيل مدفوعات',
        description: 'تسجيل مدفوعات جديدة',
        category: 'financial',
        isEnabled: false,
      },
      {
        id: 'payments_edit',
        name: 'تعديل المدفوعات',
        description: 'تعديل بيانات المدفوعات',
        category: 'financial',
        isEnabled: false,
      },
      {
        id: 'financial_reports',
        name: 'التقارير المالية',
        description: 'إنشاء التقارير المالية',
        category: 'financial',
        isEnabled: false,
      },
    ],
  },
  {
    id: 'inventory',
    name: 'إدارة المخزون',
    description: 'صلاحيات إدارة المخزون والمعدات',
    permissions: [
      {
        id: 'inventory_view',
        name: 'عرض المخزون',
        description: 'عرض حالة المخزون',
        category: 'inventory',
        isEnabled: true,
      },
      {
        id: 'inventory_manage',
        name: 'إدارة المخزون',
        description: 'إضافة وتعديل عناصر المخزون',
        category: 'inventory',
        isEnabled: false,
      },
      {
        id: 'purchases_manage',
        name: 'إدارة المشتريات',
        description: 'إدارة عمليات الشراء',
        category: 'inventory',
        isEnabled: false,
      },
      {
        id: 'warehouse_manage',
        name: 'إدارة المخازن',
        description: 'إدارة المخازن والمستودعات',
        category: 'inventory',
        isEnabled: false,
      },
    ],
  },
  {
    id: 'operations',
    name: 'إدارة العمليات',
    description: 'صلاحيات إدارة عمليات التوصيل والشحن',
    permissions: [
      {
        id: 'operations_view',
        name: 'عرض العمليات',
        description: 'عرض عمليات التوصيل والشحن',
        category: 'operations',
        isEnabled: true,
      },
      {
        id: 'delivery_manage',
        name: 'إدارة التوصيل',
        description: 'إدارة طلبات التوصيل',
        category: 'operations',
        isEnabled: false,
      },
      {
        id: 'shipping_track',
        name: 'تتبع الشحن',
        description: 'تتبع عمليات الشحن',
        category: 'operations',
        isEnabled: false,
      },
    ],
  },
  {
    id: 'system',
    name: 'إعدادات النظام',
    description: 'صلاحيات إعدادات النظام المتقدمة',
    permissions: [
      {
        id: 'system_settings',
        name: 'إعدادات النظام',
        description: 'تعديل إعدادات النظام العامة',
        category: 'system',
        isEnabled: false,
      },
      {
        id: 'system_backup',
        name: 'النسخ الاحتياطي',
        description: 'إدارة النسخ الاحتياطية',
        category: 'system',
        isEnabled: false,
      },
      {
        id: 'system_logs',
        name: 'سجلات النظام',
        description: 'عرض سجلات النظام',
        category: 'system',
        isEnabled: false,
      },
    ],
  },
];

// إحصائيات سريعة
export const userRolesStats = {
  totalRoles: userRolesData.length,
  activeRoles: userRolesData.filter(role => role.isActive).length,
  totalUsers: userRolesData.reduce((sum, role) => sum + role.userCount, 0),
  customRoles: userRolesData.filter(role => role.name !== 'مدير النظام' && role.name !== 'موظف استقبال').length,
  totalPermissions: permissionCategories.reduce((sum, category) => sum + category.permissions.length, 0),
  permissionCategories: permissionCategories.length,
};
