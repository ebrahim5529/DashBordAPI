/**
 * صفحة الملف الشخصي
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Shield, 
  Edit, 
  Save, 
  Camera,
  Award,
  Globe
} from 'lucide-react';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // بيانات الملف الشخصي
  const [profile, setProfile] = useState({
    personalInfo: {
      name: 'أحمد محمد علي',
      email: 'ahmed.mohammed@company.com',
      phone: '+966501234567',
      alternatePhone: '+966509876543',
      birthDate: '1985-03-15',
      nationality: 'Saudi',
      address: 'شارع الملك فهد، حي النخيل، الرياض 12345',
      city: 'الرياض',
      country: 'المملكة العربية السعودية',
    },
    workInfo: {
      employeeId: 'EMP-2024-001',
      position: 'مدير قسم تقنية المعلومات',
      department: 'تقنية المعلومات',
      manager: 'محمد أحمد السعيد',
      hireDate: '2020-01-15',
      workLocation: 'مكتب الرياض الرئيسي',
      workPhone: '+966112345678',
      workEmail: 'ahmed.it@company.com',
    },
    security: {
      lastLogin: '2024-01-15T10:30:00Z',
      loginCount: 156,
      status: 'active',
      twoFactorEnabled: false,
      passwordLastChanged: '2023-12-01T00:00:00Z',
    },
    skills: [
      'إدارة المشاريع',
      'تطوير البرمجيات',
      'إدارة قواعد البيانات',
      'الأمن السيبراني',
      'الذكاء الاصطناعي'
    ],
    languages: [
      { language: 'العربية', level: 'اللغة الأم' },
      { language: 'الإنجليزية', level: 'متقدم' },
      { language: 'الفرنسية', level: 'مبتدئ' }
    ],
    emergencyContact: {
      name: 'فاطمة محمد علي',
      relationship: 'زوجة',
      phone: '+966507654321',
      email: 'fatima@example.com',
    },
    bio: 'خبرة أكثر من 10 سنوات في مجال تقنية المعلومات، متخصص في إدارة المشاريع التقنية وتطوير الحلول الرقمية. حاصل على شهادات متعددة في إدارة قواعد البيانات والأمن السيبراني.'
  });

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // محاكاة حفظ الملف الشخصي
      new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
      setIsEditing(false);
      alert('تم حفظ الملف الشخصي بنجاح');
    } catch (error) {
      console.error('خطأ في حفظ الملف الشخصي:', error);
      setIsLoading(false);
      alert('حدث خطأ في حفظ الملف الشخصي');
    }
  };

  const updateProfile = (section: string, field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof typeof prev] as any),
        [field]: value,
      },
    }));
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

  return (
    <div className="space-y-6">
      {/* عنوان الصفحة */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            الملف الشخصي
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            إدارة معلوماتك الشخصية والمهنية
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
            >
              <Edit className="h-4 w-4 ml-2" />
              تعديل الملف
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
              >
                إلغاء
              </Button>
              <Button
                onClick={handleSaveProfile}
                disabled={isLoading}
              >
                <Save className="h-4 w-4 ml-2" />
                {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* معلومات أساسية */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {profile.personalInfo.name.charAt(0)}
                  </div>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full p-0"
                    >
                      <Camera className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{profile.personalInfo.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {profile.workInfo.position}
                  </p>
                  {getStatusBadge(profile.security.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{profile.personalInfo.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{profile.personalInfo.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{profile.personalInfo.city}</span>
              </div>
              <div className="flex items-center gap-3">
                <Building className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{profile.workInfo.department}</span>
              </div>
            </CardContent>
          </Card>

          {/* معلومات الأمان */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                معلومات الأمان
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">آخر تسجيل دخول:</span>
                <span className="text-sm">{formatDate(profile.security.lastLogin)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">عدد مرات تسجيل الدخول:</span>
                <span className="text-sm">{profile.security.loginCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">المصادقة الثنائية:</span>
                <Badge className={profile.security.twoFactorEnabled ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {profile.security.twoFactorEnabled ? 'مفعلة' : 'غير مفعلة'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">آخر تغيير كلمة المرور:</span>
                <span className="text-sm">{formatDate(profile.security.passwordLastChanged)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="lg:col-span-2 space-y-6">
          {/* المعلومات الشخصية */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                المعلومات الشخصية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم الكامل *</Label>
                  <Input
                    id="name"
                    value={profile.personalInfo.name}
                    onChange={(e) => updateProfile('personalInfo', 'name', e.target.value)}
                    disabled={!isEditing || isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.personalInfo.email}
                    onChange={(e) => updateProfile('personalInfo', 'email', e.target.value)}
                    disabled={!isEditing || isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف الرئيسي *</Label>
                  <Input
                    id="phone"
                    value={profile.personalInfo.phone}
                    onChange={(e) => updateProfile('personalInfo', 'phone', e.target.value)}
                    disabled={!isEditing || isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alternatePhone">رقم هاتف بديل</Label>
                  <Input
                    id="alternatePhone"
                    value={profile.personalInfo.alternatePhone}
                    onChange={(e) => updateProfile('personalInfo', 'alternatePhone', e.target.value)}
                    disabled={!isEditing || isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">تاريخ الميلاد</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={profile.personalInfo.birthDate}
                    onChange={(e) => updateProfile('personalInfo', 'birthDate', e.target.value)}
                    disabled={!isEditing || isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality">الجنسية</Label>
                  <Select
                    value={profile.personalInfo.nationality}
                    onValueChange={(value) => updateProfile('personalInfo', 'nationality', value)}
                    disabled={!isEditing || isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Saudi">سعودي</SelectItem>
                      <SelectItem value="Emirati">إماراتي</SelectItem>
                      <SelectItem value="Kuwaiti">كويتي</SelectItem>
                      <SelectItem value="Egyptian">مصري</SelectItem>
                      <SelectItem value="Jordanian">أردني</SelectItem>
                      <SelectItem value="Lebanese">لبناني</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">العنوان</Label>
                  <Textarea
                    id="address"
                    value={profile.personalInfo.address}
                    onChange={(e) => updateProfile('personalInfo', 'address', e.target.value)}
                    disabled={!isEditing || isLoading}
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* المعلومات المهنية */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                المعلومات المهنية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeId">رقم الموظف</Label>
                  <Input
                    id="employeeId"
                    value={profile.workInfo.employeeId}
                    disabled
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">المنصب</Label>
                  <Input
                    id="position"
                    value={profile.workInfo.position}
                    disabled
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">القسم</Label>
                  <Input
                    id="department"
                    value={profile.workInfo.department}
                    disabled
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manager">المدير المباشر</Label>
                  <Input
                    id="manager"
                    value={profile.workInfo.manager}
                    disabled
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hireDate">تاريخ التعيين</Label>
                  <Input
                    id="hireDate"
                    value={profile.workInfo.hireDate}
                    disabled
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workLocation">موقع العمل</Label>
                  <Input
                    id="workLocation"
                    value={profile.workInfo.workLocation}
                    onChange={(e) => updateProfile('workInfo', 'workLocation', e.target.value)}
                    disabled={!isEditing || isLoading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* المهارات واللغات */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                المهارات واللغات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">المهارات</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-base font-medium">اللغات</Label>
                <div className="space-y-2 mt-2">
                  {profile.languages.map((lang, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{lang.language}</span>
                      <Badge variant="outline">{lang.level}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* معلومات الطوارئ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                جهة الاتصال في حالات الطوارئ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyName">الاسم</Label>
                  <Input
                    id="emergencyName"
                    value={profile.emergencyContact.name}
                    onChange={(e) => updateProfile('emergencyContact', 'name', e.target.value)}
                    disabled={!isEditing || isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyRelationship">صلة القرابة</Label>
                  <Input
                    id="emergencyRelationship"
                    value={profile.emergencyContact.relationship}
                    onChange={(e) => updateProfile('emergencyContact', 'relationship', e.target.value)}
                    disabled={!isEditing || isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">رقم الهاتف</Label>
                  <Input
                    id="emergencyPhone"
                    value={profile.emergencyContact.phone}
                    onChange={(e) => updateProfile('emergencyContact', 'phone', e.target.value)}
                    disabled={!isEditing || isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyEmail">البريد الإلكتروني</Label>
                  <Input
                    id="emergencyEmail"
                    type="email"
                    value={profile.emergencyContact.email}
                    onChange={(e) => updateProfile('emergencyContact', 'email', e.target.value)}
                    disabled={!isEditing || isLoading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* نبذة شخصية */}
      <Card>
        <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                نبذة شخصية
              </CardTitle>
        </CardHeader>
        <CardContent>
              <div className="space-y-2">
                <Label htmlFor="bio">نبذة عنك</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  disabled={!isEditing || isLoading}
                  rows={4}
                  placeholder="اكتب نبذة مختصرة عنك..."
                />
              </div>
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  );
}
