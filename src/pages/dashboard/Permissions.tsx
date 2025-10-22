/**
 * صفحة إدارة الصلاحيات
 */

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shared/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Key, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  Search,
  Filter,
  UserCheck,
  Clock
} from 'lucide-react';

export default function PermissionsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [showRoleForm, setShowRoleForm] = useState(false);

  // بيانات الأدوار والصلاحيات
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'مدير النظام',
      description: 'صلاحيات إدارية كاملة لجميع أجزاء النظام',
      permissions: ['dashboard', 'users', 'contracts', 'inventory', 'reports', 'settings', 'security'],
      usersCount: 2,
      createdAt: '2024-01-01T00:00:00Z',
      isDefault: true
    },
    {
      id: 2,
      name: 'مدير المبيعات',
      description: 'إدارة قسم المبيعات والعقود',
      permissions: ['dashboard', 'contracts', 'customers', 'reports'],
      usersCount: 5,
      createdAt: '2024-01-01T00:00:00Z',
      isDefault: true
    },
    {
      id: 3,
      name: 'محاسب',
      description: 'إدارة الحسابات والمدفوعات',
      permissions: ['dashboard', 'payments', 'invoices', 'reports'],
      usersCount: 3,
      createdAt: '2024-01-01T00:00:00Z',
      isDefault: true
    },
    {
      id: 4,
      name: 'موظف',
      description: 'صلاحيات أساسية للوصول للنظام',
      permissions: ['dashboard', 'profile'],
      usersCount: 15,
      createdAt: '2024-01-01T00:00:00Z',
      isDefault: true
    },
    {
      id: 5,
      name: 'مدير المخازن',
      description: 'إدارة المخازن والأصناف',
      permissions: ['dashboard', 'inventory', 'warehouses', 'reports'],
      usersCount: 2,
      createdAt: '2024-01-15T10:30:00Z',
      isDefault: false
    }
  ]);

  const [permissions] = useState([
    { id: 'dashboard', name: 'لوحة التحكم', category: 'عام', description: 'الوصول إلى لوحة التحكم الرئيسية' },
    { id: 'users', name: 'إدارة المستخدمين', category: 'إدارة', description: 'إضافة وتعديل وحذف المستخدمين' },
    { id: 'contracts', name: 'العقود', category: 'عمليات', description: 'إدارة العقود والاتفاقيات' },
    { id: 'customers', name: 'العملاء', category: 'عمليات', description: 'إدارة بيانات العملاء' },
    { id: 'inventory', name: 'المخزون', category: 'عمليات', description: 'إدارة المخزون والأصناف' },
    { id: 'warehouses', name: 'المخازن', category: 'عمليات', description: 'إدارة المخازن والمواقع' },
    { id: 'payments', name: 'المدفوعات', category: 'مالية', description: 'إدارة المدفوعات والفواتير' },
    { id: 'invoices', name: 'الفواتير', category: 'مالية', description: 'إنشاء وإدارة الفواتير' },
    { id: 'reports', name: 'التقارير', category: 'تقارير', description: 'عرض وتصدير التقارير' },
    { id: 'settings', name: 'الإعدادات', category: 'إدارة', description: 'تعديل إعدادات النظام' },
    { id: 'security', name: 'الأمان', category: 'إدارة', description: 'إدارة الأمان والصلاحيات' },
    { id: 'profile', name: 'الملف الشخصي', category: 'عام', description: 'تعديل الملف الشخصي' }
  ]);

  const [permissionCategories] = useState([
    { id: 'general', name: 'عام', color: 'bg-blue-100 text-blue-800' },
    { id: 'management', name: 'إدارة', color: 'bg-red-100 text-red-800' },
    { id: 'operations', name: 'عمليات', color: 'bg-green-100 text-green-800' },
    { id: 'financial', name: 'مالية', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'reports', name: 'تقارير', color: 'bg-purple-100 text-purple-800' }
  ]);

  const handleSaveRole = async () => {
    if (!selectedRole.name) {
      alert('يرجى إدخال اسم الدور');
      return;
    }

    setIsLoading(true);
    try {
      // محاكاة حفظ الدور
      new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
      alert('تم حفظ الدور بنجاح');
      setSelectedRole(null);
      setShowRoleForm(false);
    } catch (error) {
      setIsLoading(false);
      alert('حدث خطأ في حفظ الدور');
    }
  };

  const handleEditRole = (role: any) => {
    setSelectedRole(role);
    setShowRoleForm(true);
  };

  const handleDeleteRole = async (roleId: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الدور؟')) {
      setIsLoading(true);
      try {
        new Promise(resolve => setTimeout(resolve, 1000));
        setRoles(prev => prev.filter(role => role.id !== roleId));
        setIsLoading(false);
        alert('تم حذف الدور بنجاح');
      } catch (error) {
        setIsLoading(false);
        alert('حدث خطأ في حذف الدور');
      }
    }
  };

  const handleTogglePermission = (permissionId: string) => {
    if (!selectedRole) return;
    
    const updatedRole = { ...selectedRole };
    if (updatedRole.permissions.includes(permissionId)) {
      updatedRole.permissions = updatedRole.permissions.filter((p: string) => p !== permissionId);
    } else {
      updatedRole.permissions.push(permissionId);
    }
    setSelectedRole(updatedRole);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const getPermissionCategory = (permissionId: string) => {
    const permission = permissions.find(p => p.id === permissionId);
    return permission?.category || 'عام';
  };

  const getCategoryColor = (category: string) => {
    const cat = permissionCategories.find(c => c.name === category);
    return cat?.color || 'bg-gray-100 text-gray-800';
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* عنوان الصفحة */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            إدارة الصلاحيات
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            إدارة أدوار المستخدمين وصلاحياتهم في النظام
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedRole({
              id: Date.now(),
              name: '',
              description: '',
              permissions: [],
              usersCount: 0,
              isDefault: false
            });
            setShowRoleForm(true);
          }}
          disabled={isLoading}
        >
          <Plus className="h-4 w-4 ml-2" />
          إضافة دور
        </Button>
      </div>

      {/* شريط البحث والفلترة */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="البحث عن الأدوار..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 ml-2" />
              فلترة
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* قائمة الأدوار */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                الأدوار ({filteredRoles.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRoles.map((role) => (
                  <div key={role.id} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{role.name}</h3>
                          {role.isDefault && (
                            <Badge className="bg-blue-100 text-blue-800">افتراضي</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {role.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {role.usersCount} مستخدم
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatDate(role.createdAt)}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {role.permissions.slice(0, 5).map((permission) => (
                            <Badge 
                              key={permission} 
                              className={`text-xs ${getCategoryColor(getPermissionCategory(permission))}`}
                            >
                              {permissions.find(p => p.id === permission)?.name || permission}
                            </Badge>
                          ))}
                          {role.permissions.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{role.permissions.length - 5} أخرى
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditRole(role)}
                          disabled={isLoading || role.isDefault}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteRole(role.id)}
                          disabled={isLoading || role.isDefault}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* لوحة الصلاحيات */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                الصلاحيات المتاحة
              </CardTitle>
              <CardDescription>
                جميع الصلاحيات في النظام
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {permissionCategories.map((category) => {
                  const categoryPermissions = permissions.filter(p => p.category === category.name);
                  return (
                    <div key={category.id} className="border rounded-lg p-3">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Badge className={category.color}>
                          {category.name}
                        </Badge>
                      </h4>
                      <div className="space-y-2">
                        {categoryPermissions.map((permission) => (
                          <div key={permission.id} className="flex items-start gap-2">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{permission.name}</p>
                              <p className="text-xs text-gray-500">{permission.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* إحصائيات الصلاحيات */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                إحصائيات الصلاحيات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">إجمالي الأدوار:</span>
                <Badge className="bg-blue-100 text-blue-800">
                  {roles.length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">الأدوار الافتراضية:</span>
                <Badge className="bg-green-100 text-green-800">
                  {roles.filter(r => r.isDefault).length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">الأدوار المخصصة:</span>
                <Badge className="bg-purple-100 text-purple-800">
                  {roles.filter(r => !r.isDefault).length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">إجمالي الصلاحيات:</span>
                <Badge className="bg-yellow-100 text-yellow-800">
                  {permissions.length}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* نافذة تعديل الدور */}
      {showRoleForm && selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                {selectedRole.id === Date.now() ? 'إضافة دور جديد' : 'تعديل الدور'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* معلومات الدور */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="roleName">اسم الدور *</Label>
                  <Input
                    id="roleName"
                    value={selectedRole.name}
                    onChange={(e) => setSelectedRole({...selectedRole, name: e.target.value})}
                    disabled={isLoading}
                    placeholder="مثال: مدير المبيعات"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usersCount">عدد المستخدمين</Label>
                  <Input
                    id="usersCount"
                    type="number"
                    value={selectedRole.usersCount}
                    onChange={(e) => setSelectedRole({...selectedRole, usersCount: parseInt(e.target.value) || 0})}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="roleDescription">وصف الدور</Label>
                <textarea
                  id="roleDescription"
                  value={selectedRole.description}
                  onChange={(e) => setSelectedRole({...selectedRole, description: e.target.value})}
                  disabled={isLoading}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="وصف مختصر للدور وصلاحياته..."
                />
              </div>

              {/* الصلاحيات */}
              <div>
                <Label className="text-base font-medium">الصلاحيات</Label>
                <div className="space-y-4 mt-3">
                  {permissionCategories.map((category) => {
                    const categoryPermissions = permissions.filter(p => p.category === category.name);
                    return (
                      <div key={category.id} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Badge className={category.color}>
                            {category.name}
                          </Badge>
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {categoryPermissions.map((permission) => (
                            <div key={permission.id} className="flex items-start space-x-2">
                              <input
                                type="checkbox"
                                id={permission.id}
                                checked={selectedRole.permissions.includes(permission.id)}
                                onChange={() => handleTogglePermission(permission.id)}
                                disabled={isLoading}
                                className="mt-1 rounded border-gray-300"
                              />
                              <div className="flex-1">
                                <Label htmlFor={permission.id} className="font-medium">
                                  {permission.name}
                                </Label>
                                <p className="text-xs text-gray-500">{permission.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* أزرار الإجراءات */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRoleForm(false);
                    setSelectedRole(null);
                  }}
                  disabled={isLoading}
                >
                  إلغاء
                </Button>
                <Button
                  onClick={handleSaveRole}
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 ml-2" />
                  {isLoading ? 'جاري الحفظ...' : 'حفظ'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
