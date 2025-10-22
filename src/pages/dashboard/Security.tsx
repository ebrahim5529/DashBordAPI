/**
 * صفحة الأمان والخصوصية
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Save
} from 'lucide-react';

export default function SecurityPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [_showCurrentPassword, _setShowCurrentPassword] = useState(false);
  const [_showNewPassword, _setShowNewPassword] = useState(false);
  const [_showConfirmPassword, _setShowConfirmPassword] = useState(false);

  // حالة الأمان
  const [securityState, setSecurityState] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: '30',
    passwordExpiry: '90',
    trustedDevices: [
      { id: 1, name: 'جهاز الكمبيوتر المكتبي', location: 'الرياض، السعودية', lastUsed: '2024-01-15T10:30:00Z', isCurrent: true },
      { id: 2, name: 'هاتف iPhone', location: 'الرياض، السعودية', lastUsed: '2024-01-14T15:20:00Z', isCurrent: false },
      { id: 3, name: 'لابتوب العمل', location: 'جدة، السعودية', lastUsed: '2024-01-12T09:15:00Z', isCurrent: false },
    ],
    recentLogins: [
      { id: 1, timestamp: '2024-01-15T10:30:00Z', location: 'الرياض، السعودية', device: 'جهاز الكمبيوتر المكتبي', ip: '192.168.1.100', status: 'success' },
      { id: 2, timestamp: '2024-01-14T15:20:00Z', location: 'الرياض، السعودية', device: 'هاتف iPhone', ip: '10.0.0.5', status: 'success' },
      { id: 3, timestamp: '2024-01-12T09:15:00Z', location: 'جدة، السعودية', device: 'لابتوب العمل', ip: '172.16.0.50', status: 'success' },
      { id: 4, timestamp: '2024-01-10T14:45:00Z', location: 'مكة المكرمة، السعودية', device: 'جهاز غير معروف', ip: '203.0.113.1', status: 'failed' },
    ],
    passwordForm: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  });

  const handleSaveSecurity = async () => {
    setIsLoading(true);
    try {
      // محاكاة حفظ إعدادات الأمان
      new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
      alert('تم حفظ إعدادات الأمان بنجاح');
    } catch (error) {
      setIsLoading(false);
      alert('حدث خطأ في حفظ إعدادات الأمان');
    }
  };

  const _handleChangePassword = async () => {
    if (securityState.passwordForm.newPassword !== securityState.passwordForm.confirmPassword) {
      alert('كلمة المرور الجديدة وتأكيدها غير متطابقتين');
      return;
    }
    if (securityState.passwordForm.newPassword.length < 8) {
      alert('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }

    setIsLoading(true);
    try {
      // محاكاة تغيير كلمة المرور
      new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
      alert('تم تغيير كلمة المرور بنجاح');
      setSecurityState(prev => ({
        ...prev,
        passwordForm: { currentPassword: '', newPassword: '', confirmPassword: '' }
      }));
    } catch (error) {
      setIsLoading(false);
      alert('حدث خطأ في تغيير كلمة المرور');
    }
  };

  const _updateSecuritySetting = (_field: string, _value: any) => {
    setSecurityState(prev => ({
      ...prev,
      [_field]: _value,
    }));
  };

  const _updatePasswordForm = (_field: string, _value: string) => {
    setSecurityState(prev => ({
      ...prev,
      passwordForm: {
        ...prev.passwordForm,
        [_field]: _value,
      },
    }));
  };

  const _formatDate = (_dateString: string) => {
    return new Date(_dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const _getStatusBadge = (_status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">نجح</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">فشل</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">غير محدد</Badge>;
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 6) return { strength: 1, label: 'ضعيف', color: 'text-red-500' };
    if (password.length < 8) return { strength: 2, label: 'متوسط', color: 'text-yellow-500' };
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { strength: 4, label: 'قوي جداً', color: 'text-green-500' };
    }
    return { strength: 3, label: 'قوي', color: 'text-blue-500' };
  };

  const _passwordStrength = getPasswordStrength(securityState.passwordForm.newPassword);

  return (
    <div className="space-y-6">
      {/* عنوان الصفحة */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            الأمان والخصوصية
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            إدارة إعدادات الأمان وحماية حسابك
          </p>
        </div>
        <Button
          onClick={handleSaveSecurity}
          disabled={isLoading}
        >
          <Save className="h-4 w-4 ml-2" />
          {isLoading ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
        </Button>
      </div>

      {/* باقي المحتوى سيتم إضافته في الجزء التالي */}
    </div>
  );
}
