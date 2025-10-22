'use client';

/**
 * مكون العميل لأدوار المستخدمين - Client Component
 * يحتوي على جميع الوظائف التفاعلية والحالة
 * 
 * هذا مكون عميل (Client Component) يعمل في المتصفح
 * ويحتوي على useState, useEffect, ومعالجات الأحداث
 */

import React, { useState } from 'react';
import { Button } from '@/components/shared/Button';
import { UserCog, Plus, Shield } from 'lucide-react';
import { UserRolesTable } from '@/components/features/UserRolesTable';
import { PermissionsManager } from '@/components/features/PermissionsManager';
import { userRolesData, permissionCategories } from '@/data/userRolesData';
import type { UserRole, PermissionCategory } from '@/data/userRolesData';

/**
 * Client Component - يعمل في المتصفح
 * يحتوي على الحالة والمعالجات التفاعلية
 */
export function UserRolesPageClient() {
  // الحالة المحلية للمكون
  const [_selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [_showPermissionsManager, setShowPermissionsManager] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'permissions'>('table');

  // معالجات الأحداث - Client-side logic
  const handleEditRole = (role: UserRole) => {
    // TODO: فتح نموذج تعديل الدور
    // يمكن إضافة modal أو navigation هنا
      if (import.meta.env.DEV) {
      console.log('تعديل الدور:', role);
    }
  };

  const handleDeleteRole = (roleId: string) => {
    // TODO: تأكيد الحذف وحذف الدور
    // يمكن إضافة confirmation dialog هنا
      if (import.meta.env.DEV) {
      console.log('حذف الدور:', roleId);
    }
  };

  const handleViewRole = (role: UserRole) => {
    setSelectedRole(role);
    setViewMode('permissions');
    setShowPermissionsManager(true);
  };

  const handleDuplicateRole = (role: UserRole) => {
    // TODO: إنشاء نسخة من الدور
      if (import.meta.env.DEV) {
      console.log('نسخ الدور:', role);
    }
  };

  const handlePermissionToggle = (permissionId: string, enabled: boolean) => {
    // TODO: تحديث الصلاحية في قاعدة البيانات
    // يمكن إضافة API call هنا
      if (import.meta.env.DEV) {
      console.log('تغيير الصلاحية:', permissionId, enabled);
    }
  };

  const handleSavePermissions = (categories: PermissionCategory[]) => {
    // TODO: حفظ الصلاحيات في قاعدة البيانات
    // يمكن إضافة API call هنا
      if (import.meta.env.DEV) {
      console.log('حفظ الصلاحيات:', categories);
    }
  };

  const handleResetPermissions = () => {
    // TODO: إعادة تعيين الصلاحيات
      if (import.meta.env.DEV) {
      console.log('إعادة تعيين الصلاحيات');
    }
  };

  const handleAddNewRole = () => {
    // TODO: فتح نموذج إضافة دور جديد
      if (import.meta.env.DEV) {
      console.log('إضافة دور جديد');
    }
  };

  return (
    <>
      {/* أزرار التحكم - Client Component */}
      <div className='flex items-center justify-end space-x-2 rtl:space-x-reverse mb-6'>
        <Button
          variant={viewMode === 'table' ? 'default' : 'outline'}
          onClick={() => setViewMode('table')}
          className='flex items-center space-x-2 rtl:space-x-reverse'
        >
          <UserCog className='h-4 w-4' />
          <span>الأدوار</span>
        </Button>
        <Button
          variant={viewMode === 'permissions' ? 'default' : 'outline'}
          onClick={() => setViewMode('permissions')}
          className='flex items-center space-x-2 rtl:space-x-reverse'
        >
          <Shield className='h-4 w-4' />
          <span>الصلاحيات</span>
        </Button>
        <Button 
          onClick={handleAddNewRole}
          className='flex items-center space-x-2 rtl:space-x-reverse'
        >
          <Plus className='h-4 w-4' />
          <span>إضافة دور جديد</span>
        </Button>
      </div>

      {/* المحتوى التفاعلي - Client Component */}
      {viewMode === 'table' ? (
        <UserRolesTable
          roles={userRolesData}
          onEdit={handleEditRole}
          onDelete={handleDeleteRole}
          onView={handleViewRole}
          onDuplicate={handleDuplicateRole}
        />
      ) : (
        <PermissionsManager
          categories={permissionCategories}
          onPermissionToggle={handlePermissionToggle}
          onSave={handleSavePermissions}
          onReset={handleResetPermissions}
        />
      )}
    </>
  );
}
