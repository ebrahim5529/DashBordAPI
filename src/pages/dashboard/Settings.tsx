/**
 * صفحة إعدادات الحساب
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shared/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Settings as SettingsIcon, User, Bell, Shield, Globe, Palette, Save, RotateCcw } from 'lucide-react';

type SettingsTab = 'profile' | 'notifications' | 'security' | 'preferences' | 'appearance';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isLoading, setIsLoading] = useState(false);

  // بيانات الإعدادات
  const [settings, setSettings] = useState({
    // إعدادات الملف الشخصي
    profile: {
      name: 'أحمد محمد',
      email: 'ahmed@example.com',
      phone: '+966501234567',
      position: 'مدير النظام',
      department: 'تقنية المعلومات',
    },
    // إعدادات الإشعارات
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      contractAlerts: true,
      paymentReminders: true,
      maintenanceAlerts: true,
    },
    // إعدادات الأمان
    security: {
      twoFactorAuth: false,
      sessionTimeout: '30',
      passwordExpiry: '90',
      loginAlerts: true,
    },
    // إعدادات التفضيلات
    preferences: {
      language: 'ar',
      timezone: 'Asia/Riyadh',
      dateFormat: 'dd/mm/yyyy',
      currency: 'SAR',
      itemsPerPage: '25',
    },
    // إعدادات المظهر
    appearance: {
      theme: 'system',
      fontSize: 'medium',
      compactMode: false,
    },
  });

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // محاكاة حفظ الإعدادات
      new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
      alert('تم حفظ الإعدادات بنجاح');
    } catch (error) {
      console.error('خطأ في حفظ الإعدادات:', error);
      setIsLoading(false);
      alert('حدث خطأ في حفظ الإعدادات');
    }
  };

  const handleResetSettings = () => {
    if (window.confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات؟')) {
      alert('تم إعادة تعيين الإعدادات');
    }
  };

  const updateSetting = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const tabs = [
    { id: 'profile' as SettingsTab, label: 'الملف الشخصي', icon: User },
    { id: 'notifications' as SettingsTab, label: 'الإشعارات', icon: Bell },
    { id: 'security' as SettingsTab, label: 'الأمان', icon: Shield },
    { id: 'preferences' as SettingsTab, label: 'التفضيلات', icon: Globe },
    { id: 'appearance' as SettingsTab, label: 'المظهر', icon: Palette },
  ];

  return (
    <div className="space-y-6">
      {/* عنوان الصفحة */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            إعدادات الحساب
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            إدارة إعدادات حسابك وتفضيلاتك
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleResetSettings}
            disabled={isLoading}
          >
            <RotateCcw className="h-4 w-4 ml-2" />
            إعادة تعيين
          </Button>
          <Button
            onClick={handleSaveSettings}
            disabled={isLoading}
          >
            <Save className="h-4 w-4 ml-2" />
            {isLoading ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* قائمة التبويبات */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              الإعدادات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
  return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-right transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </CardContent>
        </Card>

        {/* محتوى التبويب النشط */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>الملف الشخصي</CardTitle>
                <CardDescription>تحديث معلوماتك الشخصية</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم الكامل *</Label>
                    <Input
                      id="name"
                      value={settings.profile.name}
                      onChange={(e) => updateSetting('profile', 'name', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => updateSetting('profile', 'email', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      value={settings.profile.phone}
                      onChange={(e) => updateSetting('profile', 'phone', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">المنصب</Label>
                    <Input
                      id="position"
                      value={settings.profile.position}
                      onChange={(e) => updateSetting('profile', 'position', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="department">القسم</Label>
                    <Input
                      id="department"
                      value={settings.profile.department}
                      onChange={(e) => updateSetting('profile', 'department', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>الإشعارات</CardTitle>
                <CardDescription>إدارة تفضيلات الإشعارات</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(settings.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <Label htmlFor={key}>
                          {key === 'emailNotifications' && 'إشعارات البريد الإلكتروني'}
                          {key === 'smsNotifications' && 'إشعارات الرسائل النصية'}
                          {key === 'pushNotifications' && 'الإشعارات الفورية'}
                          {key === 'contractAlerts' && 'تنبيهات العقود'}
                          {key === 'paymentReminders' && 'تذكيرات الدفع'}
                          {key === 'maintenanceAlerts' && 'تنبيهات الصيانة'}
                        </Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {key === 'emailNotifications' && 'تلقي الإشعارات عبر البريد الإلكتروني'}
                          {key === 'smsNotifications' && 'تلقي الإشعارات عبر الرسائل النصية'}
                          {key === 'pushNotifications' && 'تلقي الإشعارات الفورية في المتصفح'}
                          {key === 'contractAlerts' && 'تنبيهات عند انتهاء أو تجديد العقود'}
                          {key === 'paymentReminders' && 'تذكيرات بمواعيد الدفع المستحقة'}
                          {key === 'maintenanceAlerts' && 'تنبيهات مواعيد الصيانة المجدولة'}
                        </p>
                      </div>
                      <Switch
                        id={key}
                        checked={value}
                        onCheckedChange={(checked) => updateSetting('notifications', key, checked)}
                        disabled={isLoading}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>الأمان</CardTitle>
                <CardDescription>إدارة إعدادات الأمان والحماية</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="twoFactorAuth">المصادقة الثنائية</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        تفعيل المصادقة الثنائية لحماية إضافية
                      </p>
                    </div>
                    <Switch
                      id="twoFactorAuth"
                      checked={settings.security.twoFactorAuth}
                      onCheckedChange={(checked) => updateSetting('security', 'twoFactorAuth', checked)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">مهلة انتهاء الجلسة (دقيقة)</Label>
                    <Select
                      value={settings.security.sessionTimeout}
                      onValueChange={(value) => updateSetting('security', 'sessionTimeout', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 دقيقة</SelectItem>
                        <SelectItem value="30">30 دقيقة</SelectItem>
                        <SelectItem value="60">ساعة واحدة</SelectItem>
                        <SelectItem value="120">ساعتين</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passwordExpiry">انتهاء صلاحية كلمة المرور (يوم)</Label>
                    <Select
                      value={settings.security.passwordExpiry}
                      onValueChange={(value) => updateSetting('security', 'passwordExpiry', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 يوم</SelectItem>
                        <SelectItem value="60">60 يوم</SelectItem>
                        <SelectItem value="90">90 يوم</SelectItem>
                        <SelectItem value="180">180 يوم</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="loginAlerts">تنبيهات تسجيل الدخول</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        إشعار عند تسجيل الدخول من جهاز جديد
                      </p>
                    </div>
                    <Switch
                      id="loginAlerts"
                      checked={settings.security.loginAlerts}
                      onCheckedChange={(checked) => updateSetting('security', 'loginAlerts', checked)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'preferences' && (
            <Card>
              <CardHeader>
                <CardTitle>التفضيلات</CardTitle>
                <CardDescription>إدارة تفضيلات النظام العامة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="language">اللغة</Label>
                    <Select
                      value={settings.preferences.language}
                      onValueChange={(value) => updateSetting('preferences', 'language', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">المنطقة الزمنية</Label>
                    <Select
                      value={settings.preferences.timezone}
                      onValueChange={(value) => updateSetting('preferences', 'timezone', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Riyadh">الرياض (GMT+3)</SelectItem>
                        <SelectItem value="Asia/Dubai">دبي (GMT+4)</SelectItem>
                        <SelectItem value="Asia/Kuwait">الكويت (GMT+3)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">تنسيق التاريخ</Label>
                    <Select
                      value={settings.preferences.dateFormat}
                      onValueChange={(value) => updateSetting('preferences', 'dateFormat', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd/mm/yyyy">يوم/شهر/سنة</SelectItem>
                        <SelectItem value="mm/dd/yyyy">شهر/يوم/سنة</SelectItem>
                        <SelectItem value="yyyy-mm-dd">سنة-شهر-يوم</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">العملة</Label>
                    <Select
                      value={settings.preferences.currency}
                      onValueChange={(value) => updateSetting('preferences', 'currency', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                        <SelectItem value="AED">درهم إماراتي (AED)</SelectItem>
                        <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="itemsPerPage">عدد العناصر في الصفحة</Label>
                    <Select
                      value={settings.preferences.itemsPerPage}
                      onValueChange={(value) => updateSetting('preferences', 'itemsPerPage', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 عناصر</SelectItem>
                        <SelectItem value="25">25 عنصر</SelectItem>
                        <SelectItem value="50">50 عنصر</SelectItem>
                        <SelectItem value="100">100 عنصر</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'appearance' && (
      <Card>
        <CardHeader>
                <CardTitle>المظهر</CardTitle>
                <CardDescription>تخصيص مظهر واجهة النظام</CardDescription>
        </CardHeader>
        <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="theme">المظهر</Label>
                    <Select
                      value={settings.appearance.theme}
                      onValueChange={(value) => updateSetting('appearance', 'theme', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">فاتح</SelectItem>
                        <SelectItem value="dark">داكن</SelectItem>
                        <SelectItem value="system">حسب النظام</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fontSize">حجم الخط</Label>
                    <Select
                      value={settings.appearance.fontSize}
                      onValueChange={(value) => updateSetting('appearance', 'fontSize', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">صغير</SelectItem>
                        <SelectItem value="medium">متوسط</SelectItem>
                        <SelectItem value="large">كبير</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="compactMode">الوضع المدمج</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        تقليل المسافات لعرض المزيد من المحتوى
                      </p>
                    </div>
                    <Switch
                      id="compactMode"
                      checked={settings.appearance.compactMode}
                      onCheckedChange={(checked) => updateSetting('appearance', 'compactMode', checked)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
        </CardContent>
      </Card>
          )}
        </div>
      </div>
    </div>
  );
}
