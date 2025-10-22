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
  UserCog,
  Plus,
  Edit,
  Trash2,
  Users,
  Search,
  Eye,
  Copy,
} from 'lucide-react';

// أنواع البيانات
interface UserRole {
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

interface UserRolesTableProps {
  roles: UserRole[];
  onEdit?: (role: UserRole) => void;
  onDelete?: (roleId: string) => void;
  onView?: (role: UserRole) => void;
  onDuplicate?: (role: UserRole) => void;
}

/**
 * جدول أدوار المستخدمين التفاعلي
 * يعرض قائمة شاملة لأدوار المستخدمين مع إمكانيات الإدارة
 */
export function UserRolesTable({
  roles,
  onEdit,
  onDelete,
  onView,
  onDuplicate,
}: UserRolesTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'userCount' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // تصفية وترتيب البيانات
  const filteredRoles = roles
    .filter(role => {
      const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           role.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || 
                           (filterStatus === 'active' && role.isActive) ||
                           (filterStatus === 'inactive' && !role.isActive);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'userCount':
          comparison = a.userCount - b.userCount;
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleSort = (field: 'name' | 'userCount' | 'createdAt') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>قائمة أدوار المستخدمين</CardTitle>
            <CardDescription>
              إدارة وتخصيص أدوار المستخدمين وصلاحياتهم
            </CardDescription>
          </div>
          <Button className="flex items-center space-x-2 rtl:space-x-reverse">
            <Plus className="h-4 w-4" />
            <span>إضافة دور جديد</span>
          </Button>
        </div>

        {/* شريط البحث والتصفية */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في الأدوار..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
            >
              <option value="all">جميع الأدوار</option>
              <option value="active">نشطة</option>
              <option value="inactive">غير نشطة</option>
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Container مع scrollbar للجدول */}
        <div className="overflow-x-auto overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
          {/* عرض للجوال - بطاقات منفصلة */}
          <div className="md:hidden space-y-4">
            {filteredRoles.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <UserCog className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>لا توجد أدوار مطابقة للبحث</p>
              </div>
            ) : (
              filteredRoles.map((role) => (
                <div
                  key={role.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <div className={`p-2 rounded-lg ${role.color}`}>
                        <UserCog className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {role.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {role.userCount} مستخدم
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        role.isActive
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {role.isActive ? 'نشط' : 'غير نشط'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {role.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {role.permissions.slice(0, 3).map((permission, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                      >
                        {permission}
                      </span>
                    ))}
                    {role.permissions.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                        +{role.permissions.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      تم الإنشاء: {new Date(role.createdAt).toLocaleDateString('ar-SA')}
                    </p>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView?.(role)}
                        title="عرض التفاصيل"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit?.(role)}
                        title="تعديل"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDuplicate?.(role)}
                        title="نسخ"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete?.(role.id)}
                        className="text-red-600 hover:text-red-700"
                        title="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* عرض للديسكتوب - جدول */}
          <div className="hidden md:block">
          {/* رؤوس الجدول */}
          <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4 text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[800px]">
          <div className="col-span-4 cursor-pointer" onClick={() => handleSort('name')}>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <span>اسم الدور</span>
              {sortBy === 'name' && (
                <span className="text-primary">{sortOrder === 'asc' ? '↑' : '↓'}</span>
              )}
            </div>
          </div>
          <div className="col-span-3">الوصف</div>
          <div className="col-span-2">الصلاحيات</div>
          <div className="col-span-1 cursor-pointer" onClick={() => handleSort('userCount')}>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <span>المستخدمين</span>
              {sortBy === 'userCount' && (
                <span className="text-primary">{sortOrder === 'asc' ? '↑' : '↓'}</span>
              )}
            </div>
          </div>
          <div className="col-span-1">الحالة</div>
          <div className="col-span-1">الإجراءات</div>
        </div>

          {/* قائمة الأدوار */}
          <div className="space-y-4">
            {filteredRoles.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <UserCog className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>لا توجد أدوار مطابقة للبحث</p>
              </div>
            ) : (
              filteredRoles.map((role) => (
                <div
                  key={role.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors min-w-[800px]"
                >
                {/* اسم الدور */}
                <div className="md:col-span-4">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className={`p-2 rounded-lg ${role.color}`}>
                      <UserCog className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {role.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        تم الإنشاء: {new Date(role.createdAt).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* الوصف */}
                <div className="md:col-span-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {role.description}
                  </p>
                </div>

                {/* الصلاحيات */}
                <div className="md:col-span-2">
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.slice(0, 2).map((permission, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                      >
                        {permission}
                      </span>
                    ))}
                    {role.permissions.length > 2 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                        +{role.permissions.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                {/* عدد المستخدمين */}
                <div className="md:col-span-1">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">{role.userCount}</span>
                  </div>
                </div>

                {/* الحالة */}
                <div className="md:col-span-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      role.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    {role.isActive ? 'نشط' : 'غير نشط'}
                  </span>
                </div>

                {/* الإجراءات */}
                <div className="md:col-span-1">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView?.(role)}
                      title="عرض التفاصيل"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit?.(role)}
                      title="تعديل"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDuplicate?.(role)}
                      title="نسخ"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete?.(role.id)}
                      className="text-red-600 hover:text-red-700"
                      title="حذف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                </div>
              ))
            )}
          </div>

            {/* معلومات إضافية */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div>
                  عرض {filteredRoles.length} من أصل {roles.length} دور
                </div>
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <span>إجمالي المستخدمين: {roles.reduce((sum, role) => sum + role.userCount, 0)}</span>
                  <span>الأدوار النشطة: {roles.filter(role => role.isActive).length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default UserRolesTable;
