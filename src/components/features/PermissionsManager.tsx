'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import {
  Shield,
  Check,
  X,
  Lock,
  Unlock,
  Save,
} from 'lucide-react';

// أنواع الصلاحيات
interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  isEnabled: boolean;
}

interface PermissionCategory {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

interface PermissionsManagerProps {
  categories: PermissionCategory[];
  onPermissionToggle?: (permissionId: string, enabled: boolean) => void;
  onSave?: (categories: PermissionCategory[]) => void;
  onReset?: () => void;
}

/**
 * مكون إدارة الصلاحيات
 * يسمح بتخصيص الصلاحيات لكل دور من أدوار المستخدمين
 */
export function PermissionsManager({
  categories,
  onPermissionToggle,
  onSave,
  onReset,
}: PermissionsManagerProps) {
  const [localCategories, setLocalCategories] = useState<PermissionCategory[]>(categories);
  const [hasChanges, setHasChanges] = useState(false);

  const handlePermissionToggle = (categoryId: string, permissionId: string) => {
    setLocalCategories(prev => 
      prev.map(category => 
        category.id === categoryId
          ? {
              ...category,
              permissions: category.permissions.map(permission =>
                permission.id === permissionId
                  ? { ...permission, isEnabled: !permission.isEnabled }
                  : permission
              )
            }
          : category
      )
    );
    setHasChanges(true);
    onPermissionToggle?.(permissionId, !localCategories
      .find(cat => cat.id === categoryId)
      ?.permissions.find(perm => perm.id === permissionId)?.isEnabled || false);
  };

  const handleCategoryToggle = (categoryId: string) => {
    const category = localCategories.find(cat => cat.id === categoryId);
    if (!category) return;

    const allEnabled = category.permissions.every(perm => perm.isEnabled);
    
    setLocalCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId
          ? {
              ...cat,
              permissions: cat.permissions.map(permission => ({
                ...permission,
                isEnabled: !allEnabled
              }))
            }
          : cat
      )
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave?.(localCategories);
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalCategories(categories);
    setHasChanges(false);
    onReset?.();
  };

  const getEnabledPermissionsCount = (category: PermissionCategory) => {
    return category.permissions.filter(perm => perm.isEnabled).length;
  };

  const getTotalEnabledPermissions = () => {
    return localCategories.reduce((total, category) => 
      total + getEnabledPermissionsCount(category), 0);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
              <Shield className="h-5 w-5" />
              <span>إدارة الصلاحيات</span>
            </CardTitle>
            <CardDescription>
              تخصيص الصلاحيات لكل دور من أدوار المستخدمين
            </CardDescription>
          </div>
          
          {hasChanges && (
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Button variant="outline" onClick={handleReset}>
                <X className="h-4 w-4" />
                إلغاء
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4" />
                حفظ التغييرات
              </Button>
            </div>
          )}
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                إجمالي الصلاحيات: {localCategories.reduce((total, cat) => total + cat.permissions.length, 0)}
              </span>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                الصلاحيات المفعلة: {getTotalEnabledPermissions()}
              </span>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Lock className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                الفئات: {localCategories.length}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {localCategories.map((category) => (
            <div key={category.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              {/* رأس الفئة */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {category.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {getEnabledPermissionsCount(category)} / {category.permissions.length}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCategoryToggle(category.id)}
                    className="flex items-center space-x-2 rtl:space-x-reverse"
                  >
                    {category.permissions.every(perm => perm.isEnabled) ? (
                      <>
                        <Lock className="h-4 w-4" />
                        <span>إلغاء الكل</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="h-4 w-4" />
                        <span>تفعيل الكل</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* قائمة الصلاحيات */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {category.permissions.map((permission) => (
                  <div
                    key={permission.id}
                    className={`p-3 rounded-lg border transition-colors ${
                      permission.isEnabled
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                          {permission.name}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {permission.description}
                        </p>
                      </div>
                      <button
                        onClick={() => handlePermissionToggle(category.id, permission.id)}
                        className={`ml-3 p-1 rounded-full transition-colors ${
                          permission.isEnabled
                            ? 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                        }`}
                      >
                        {permission.isEnabled ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ملخص الصلاحيات المحددة */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            ملخص الصلاحيات المحددة
          </h4>
          <div className="space-y-2">
            {localCategories.map((category) => {
              const enabledPermissions = category.permissions.filter(perm => perm.isEnabled);
              if (enabledPermissions.length === 0) return null;
              
              return (
                <div key={category.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{category.name}:</span>
                  <div className="flex flex-wrap gap-1">
                    {enabledPermissions.map((permission) => (
                      <span
                        key={permission.id}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                      >
                        {permission.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PermissionsManager;
