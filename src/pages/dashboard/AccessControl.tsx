/**
 * صفحة التحكم في الوصول
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shared/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Users, 
  Key, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  Search,
  Filter,
  UserCheck
} from 'lucide-react';

export default function AccessControlPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showPermissions, setShowPermissions] = useState(false);

  // بيانات المستخدمين والصلاحيات
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'أحمد محمد',
      email: 'ahmed@company.com',
      role: 'مدير النظام',
      department: 'تقنية المعلومات',
      status: 'active',
      lastLogin: '2024-01-15T10:30:00Z',
      permissions: ['read', 'write', 'delete', 'admin']
    },
    {
      id: 2,
      name: 'فاطمة أحمد',
      email: 'fatima@company.com',
      role: 'محاسب',
      department: 'المحاسبة',
      status: 'active',
      lastLogin: '2024-01-14T15:20:00Z',
      permissions: ['read', 'write']
    },
    {
      id: 3,
      name: 'محمد علي',
      email: 'mohammed@company.com',
      role: 'موظف',
      department: 'المبيعات',
      status: 'inactive',
      lastLogin: '2024-01-10T09:15:00Z',
      permissions: ['read']
    },
    {
      id: 4,
      name: 'سارة خالد',
      email: 'sara@company.com',
      role: 'مدير المبيعات',
      department: 'المبيعات',
      status: 'active',
      lastLogin: '2024-01-15T08:45:00Z',
      permissions: ['read', 'write', 'reports']
    }
  ]);

  const [permissionTypes] = useState([
    { id: 'read', name: 'قراءة', description: 'عرض البيانات والمعلومات' },
    { id: 'write', name: 'كتابة', description: 'تعديل وإضافة البيانات' },
    { id: 'delete', name: 'حذف', description: 'حذف البيانات والسجلات' },
    { id: 'admin', name: 'إدارة', description: 'صلاحيات إدارية كاملة' },
    { id: 'reports', name: 'تقارير', description: 'إنشاء وعرض التقارير' },
    { id: 'export', name: 'تصدير', description: 'تصدير البيانات' }
  ]);

  const [roles] = useState([
    { id: 'admin', name: 'مدير النظام', permissions: ['read', 'write', 'delete', 'admin', 'reports', 'export'] },
    { id: 'manager', name: 'مدير', permissions: ['read', 'write', 'reports', 'export'] },
    { id: 'accountant', name: 'محاسب', permissions: ['read', 'write', 'reports'] },
    { id: 'employee', name: 'موظف', permissions: ['read'] }
  ]);

  const handleSaveUser = async () => {
    setIsLoading(true);
    try {
      // محاكاة حفظ المستخدم
      new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
      alert('تم حفظ المستخدم بنجاح');
      setSelectedUser(null);
      setShowPermissions(false);
    } catch (error) {
      setIsLoading(false);
      alert('حدث خطأ في حفظ المستخدم');
    }
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setShowPermissions(true);
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      setIsLoading(true);
      try {
        new Promise(resolve => setTimeout(resolve, 1000));
        setUsers(prev => prev.filter(user => user.id !== userId));
        setIsLoading(false);
        alert('تم حذف المستخدم بنجاح');
      } catch (error) {
        setIsLoading(false);
        alert('حدث خطأ في حذف المستخدم');
      }
    }
  };

  const handleTogglePermission = (permission: string) => {
    if (!selectedUser) return;
    
    const updatedUser = { ...selectedUser };
    if (updatedUser.permissions.includes(permission)) {
      updatedUser.permissions = updatedUser.permissions.filter((p: string) => p !== permission);
    } else {
      updatedUser.permissions.push(permission);
    }
    setSelectedUser(updatedUser);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">نشط</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">غير نشط</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">غير محدد</Badge>;
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* عنوان الصفحة */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            التحكم في الوصول
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            إدارة صلاحيات المستخدمين والتحكم في الوصول
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedUser({
              id: Date.now(),
              name: '',
              email: '',
              role: '',
              department: '',
              status: 'active',
              permissions: []
            });
            setShowPermissions(true);
          }}
          disabled={isLoading}
        >
          <Plus className="h-4 w-4 ml-2" />
          إضافة مستخدم
        </Button>
      </div>

      {/* شريط البحث والفلترة */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="البحث عن المستخدمين..."
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
        {/* قائمة المستخدمين */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                المستخدمون ({filteredUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{user.role}</Badge>
                          {getStatusBadge(user.status)}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          آخر تسجيل دخول: {formatDate(user.lastLogin)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                        disabled={isLoading}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
                الصلاحيات
              </CardTitle>
              <CardDescription>
                إدارة صلاحيات المستخدمين
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roles.map((role) => (
                  <div key={role.id} className="p-3 border rounded-lg">
                    <h4 className="font-medium mb-2">{role.name}</h4>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((permission) => (
                        <Badge key={permission} variant="secondary" className="text-xs">
                          {permissionTypes.find(p => p.id === permission)?.name || permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* إحصائيات الوصول */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                إحصائيات الوصول
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">المستخدمون النشطون:</span>
                <Badge className="bg-green-100 text-green-800">
                  {users.filter(u => u.status === 'active').length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">المستخدمون غير النشطين:</span>
                <Badge className="bg-red-100 text-red-800">
                  {users.filter(u => u.status === 'inactive').length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">إجمالي الصلاحيات:</span>
                <Badge className="bg-blue-100 text-blue-800">
                  {permissionTypes.length}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* نافذة تعديل الصلاحيات */}
      {showPermissions && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                إدارة صلاحيات المستخدم
              </CardTitle>
              <CardDescription>
                {selectedUser.name || 'مستخدم جديد'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* معلومات المستخدم */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم *</Label>
                  <Input
                    id="name"
                    value={selectedUser.name}
                    onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">الدور</Label>
                  <select
                    id="role"
                    value={selectedUser.role}
                    onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">اختر الدور</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.name}>{role.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">القسم</Label>
                  <Input
                    id="department"
                    value={selectedUser.department}
                    onChange={(e) => setSelectedUser({...selectedUser, department: e.target.value})}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* الصلاحيات */}
              <div>
                <Label className="text-base font-medium">الصلاحيات</Label>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {permissionTypes.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={permission.id}
                        checked={selectedUser.permissions.includes(permission.id)}
                        onChange={() => handleTogglePermission(permission.id)}
                        disabled={isLoading}
                        className="rounded border-gray-300"
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

              {/* أزرار الإجراءات */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPermissions(false);
                    setSelectedUser(null);
                  }}
                  disabled={isLoading}
                >
                  إلغاء
                </Button>
                <Button
                  onClick={handleSaveUser}
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