/**
 * مكون نموذج الموظف
 */

import React, { useState } from 'react';
import { EmployeeTableData } from '@/lib/types/employee';
import { Button } from '@/components/ui/button';
import { MultiFileUpload } from './MultiFileUpload';
import { X, Save, User, Briefcase, DollarSign, FileText } from 'lucide-react';

interface EmployeeFormProps {
  employee?: EmployeeTableData | null;
  onSave: (employee: EmployeeTableData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function EmployeeForm({ 
  employee, 
  onSave, 
  onCancel, 
  isLoading = false 
}: EmployeeFormProps) {
  const [formData, setFormData] = useState({
    name: employee?.name || '',
    employeeId: employee?.employeeId || '',
    position: employee?.position || '',
    department: employee?.department || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    hireDate: employee?.hireDate || '',
    status: employee?.status || 'active',
    salary: employee?.salary || 0,
    manager: employee?.manager || '',
    location: employee?.location || ''
  });

  const [activeTab, setActiveTab] = useState<'personal' | 'work' | 'salary' | 'files'>('personal');

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const employeeData: EmployeeTableData = {
      id: employee?.id || Date.now().toString(),
      ...formData,
      salary: Number(formData.salary)
    };
    
    onSave(employeeData);
  };

  const tabs = [
    { id: 'personal', label: 'البيانات الشخصية', icon: User },
    { id: 'work', label: 'البيانات الوظيفية', icon: Briefcase },
    { id: 'salary', label: 'البيانات المالية', icon: DollarSign },
    { id: 'files', label: 'الملفات والمرفقات', icon: FileText }
  ] as const;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* رأس النموذج */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {employee ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {employee ? 'تعديل معلومات الموظف' : 'إضافة موظف جديد إلى النظام'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* تبويبات النموذج */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#58d2c8] text-[#58d2c8]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* محتوى النموذج */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم الموظف *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الموظف *
                  </label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => handleInputChange('employeeId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'work' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المنصب *
                  </label>
                  <select
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
                    required
                  >
                    <option value="">اختر المنصب</option>
                    <option value="مدير المبيعات">مدير المبيعات</option>
                    <option value="محاسبة">محاسبة</option>
                    <option value="مطور برمجيات">مطور برمجيات</option>
                    <option value="أخصائية موارد بشرية">أخصائية موارد بشرية</option>
                    <option value="مندوب مبيعات">مندوب مبيعات</option>
                    <option value="مساعد إداري">مساعد إداري</option>
                    <option value="مهندس شبكات">مهندس شبكات</option>
                    <option value="مديرة الموارد البشرية">مديرة الموارد البشرية</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    القسم *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
                    required
                  >
                    <option value="">اختر القسم</option>
                    <option value="المبيعات">المبيعات</option>
                    <option value="المالية">المالية</option>
                    <option value="التقنية">التقنية</option>
                    <option value="الموارد البشرية">الموارد البشرية</option>
                    <option value="الإدارة">الإدارة</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المدير المباشر
                  </label>
                  <input
                    type="text"
                    value={formData.manager}
                    onChange={(e) => handleInputChange('manager', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الموقع
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
                  >
                    <option value="">اختر الموقع</option>
                    <option value="مسقط">مسقط</option>
                    <option value="صلالة">صلالة</option>
                    <option value="نزوى">نزوى</option>
                    <option value="صور">صور</option>
                    <option value="البريمي">البريمي</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاريخ التوظيف *
                  </label>
                  <input
                    type="date"
                    value={formData.hireDate}
                    onChange={(e) => handleInputChange('hireDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الحالة *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
                    required
                  >
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                    <option value="on_leave">في إجازة</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'salary' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الراتب الأساسي (ر.ع) *
                  </label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => handleInputChange('salary', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-blue-900 mb-2">
                  رفع ملفات الموظف
                </h3>
                <p className="text-blue-700 text-sm">
                  يمكنك رفع ملفات متعلقة بالموظف مثل الصور الشخصية، المستندات، والسير الذاتية
                </p>
              </div>
              
              <MultiFileUpload
                onFilesUploaded={(files) => {
                  console.log('تم رفع ملفات الموظف:', files);
                  alert(`تم رفع ${files.length} ملف بنجاح`);
                }}
                maxFiles={10}
                maxFileSize={10}
                acceptedTypes={[
                  'image/*',
                  'application/pdf',
                  'text/*',
                  'application/msword',
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                ]}
                title="ملفات الموظف"
                description="اسحب وأفلت ملفات الموظف هنا أو انقر للاختيار"
              />
            </div>
          )}
        </form>

        {/* أزرار الإجراءات */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-[#58d2c8] hover:bg-[#4AB8B3] gap-2"
          >
            <Save className="h-4 w-4" />
            {isLoading ? 'جاري الحفظ...' : 'حفظ'}
          </Button>
        </div>
      </div>
    </div>
  );
}
