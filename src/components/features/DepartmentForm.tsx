/**
 * مكون نموذج إضافة/تعديل قسم
 */

'use client';

import React, { useState } from 'react';
import { Building2, Save, X, Users } from 'lucide-react';
import { Department, DepartmentStatus } from '@/lib/types/departments';

interface DepartmentFormProps {
  department?: Department | null;
  onSave: (departmentData: Partial<Department>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function DepartmentForm({ 
  department, 
  onSave, 
  onCancel, 
  isLoading = false 
}: DepartmentFormProps) {
  const [formData, setFormData] = useState({
    name: department?.name || '',
    code: department?.code || '',
    managerId: department?.managerId || '',
    managerName: department?.managerName || '',
    description: department?.description || '',
    status: department?.status || 'ACTIVE' as DepartmentStatus,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // حالات القسم
  const departmentStatuses: { value: DepartmentStatus; label: string }[] = [
    { value: 'ACTIVE', label: 'نشط' },
    { value: 'INACTIVE', label: 'غير نشط' },
    { value: 'SUSPENDED', label: 'معلق' },
  ];

  // المديرين الوهميين
  const mockManagers = [
    { id: '1', name: 'أحمد محمد العتيبي', position: 'مدير تقنية المعلومات' },
    { id: '2', name: 'فاطمة أحمد السالمي', position: 'مدير الموارد البشرية' },
    { id: '3', name: 'محمد سالم الكندي', position: 'مدير المالية' },
    { id: '4', name: 'سارة علي النعماني', position: 'مدير المبيعات' },
    { id: '5', name: 'عبدالله خالد الشنفري', position: 'مدير العمليات' },
    { id: '6', name: 'نورا الشمري', position: 'مدير الجودة' },
    { id: '7', name: 'خالد المطيري', position: 'مدير التطوير' },
    { id: '8', name: 'مريم العتيبي', position: 'مدير العلاقات العامة' },
  ];

  // التحقق من صحة البيانات
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'يرجى إدخال اسم القسم';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'اسم القسم يجب أن يكون على الأقل حرفين';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'يرجى إدخال رمز القسم';
    } else if (formData.code.trim().length < 2) {
      newErrors.code = 'رمز القسم يجب أن يكون على الأقل حرفين';
    } else if (!/^[A-Z0-9]+$/.test(formData.code.trim())) {
      newErrors.code = 'رمز القسم يجب أن يحتوي على أحرف كبيرة وأرقام فقط';
    }

    if (!formData.managerId) {
      newErrors.managerId = 'يرجى اختيار المدير المسؤول';
    }

    if (formData.description && formData.description.trim().length > 500) {
      newErrors.description = 'وصف القسم يجب أن يكون أقل من 500 حرف';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // معالجة إرسال النموذج
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const departmentData: Partial<Department> = {
      ...formData,
      employeeCount: department?.employeeCount || 0, // سيتم حسابه تلقائياً
      createdAt: department?.createdAt || new Date().toISOString(),
    };

    onSave(departmentData);
  };

  // معالجة تغيير المدير
  const handleManagerChange = (managerId: string) => {
    const manager = mockManagers.find(mgr => mgr.id === managerId);
    if (manager) {
      setFormData(prev => ({
        ...prev,
        managerId,
        managerName: manager.name,
      }));
    }
  };

  // توليد رمز القسم تلقائياً من اسم القسم
  const generateCode = () => {
    const name = formData.name.trim();
    if (name.length >= 2) {
      // أخذ أول حرفين من كل كلمة
      const words = name.split(' ');
      const code = words
        .map(word => word.substring(0, 2).toUpperCase())
        .join('')
        .substring(0, 6); // حد أقصى 6 أحرف
      
      setFormData(prev => ({ ...prev, code }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center gap-2 mb-6">
        <Building2 className="h-5 w-5 text-[#58d2c8]" />
        <h2 className="text-xl font-semibold">
          {department ? 'تعديل بيانات القسم' : 'إضافة قسم جديد'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* معلومات القسم الأساسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم القسم <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              onBlur={generateCode}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#58d2c8] ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="مثال: تقنية المعلومات"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رمز القسم <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#58d2c8] ${
                errors.code ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="مثال: IT"
              disabled={isLoading}
            />
            {errors.code && (
              <p className="text-red-500 text-sm mt-1">{errors.code}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              سيتم توليد الرمز تلقائياً عند كتابة اسم القسم
            </p>
          </div>
        </div>

        {/* المدير المسؤول */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            المدير المسؤول <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.managerId}
            onChange={(e) => handleManagerChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#58d2c8] ${
              errors.managerId ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          >
            <option value="">اختر المدير المسؤول</option>
            {mockManagers.map((manager) => (
              <option key={manager.id} value={manager.id}>
                {manager.name} - {manager.position}
              </option>
            ))}
          </select>
          {errors.managerId && (
            <p className="text-red-500 text-sm mt-1">{errors.managerId}</p>
          )}
        </div>

        {/* وصف القسم */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            وصف القسم (اختياري)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#58d2c8] ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="اكتب وصفاً مختصراً عن القسم ومسؤولياته..."
            disabled={isLoading}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {formData.description.length}/500 حرف
          </p>
        </div>

        {/* حالة القسم (للتعديل فقط) */}
        {department && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              حالة القسم
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as DepartmentStatus }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#58d2c8]"
              disabled={isLoading}
            >
              {departmentStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* معلومات إضافية للعرض فقط */}
        {department && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              معلومات إضافية
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">عدد الموظفين:</span>
                <span className="font-medium mr-2">{department.employeeCount}</span>
              </div>
              <div>
                <span className="text-gray-600">تاريخ الإنشاء:</span>
                <span className="font-medium mr-2">
                  {new Date(department.createdAt).toLocaleDateString('ar-SA')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* أزرار الإجراءات */}
        <div className="flex items-center gap-4 pt-6 border-t">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2 bg-[#58d2c8] text-white rounded-md hover:bg-[#58d2c8]/90 focus:outline-none focus:ring-2 focus:ring-[#58d2c8] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="h-4 w-4" />
            {isLoading ? 'جاري الحفظ...' : (department ? 'تحديث القسم' : 'إضافة القسم')}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <X className="h-4 w-4" />
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}
