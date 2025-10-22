/**
 * مكون نموذج إضافة/تعديل طلب إجازة
 */

'use client';

import React, { useState } from 'react';
import { FileText, X, Save, Paperclip } from 'lucide-react';
import { Leave, LeaveType, LeaveStatus, LeaveDocument } from '@/lib/types/leaves';
import DocumentUpload, { DocumentFile } from './DocumentUpload';
import EmployeeSearchDropdown from './EmployeeSearchDropdown';

interface LeaveFormProps {
  leave?: Leave | null;
  onSave: (leaveData: Partial<Leave>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function LeaveForm({ leave, onSave, onCancel, isLoading = false }: LeaveFormProps) {
  const [formData, setFormData] = useState({
    employeeId: leave?.employeeId || '',
    employeeName: leave?.employeeName || '',
    position: leave?.position || '',
    department: leave?.department || '',
    leaveType: leave?.leaveType || 'ANNUAL' as LeaveType,
    startDate: leave?.startDate || '',
    endDate: leave?.endDate || '',
    reason: leave?.reason || '',
    status: leave?.status || 'PENDING' as LeaveStatus,
  });

  // حالة الموظف المحدد
  const [selectedEmployee, setSelectedEmployee] = useState<{
    id: string;
    name: string;
    position: string;
    department: string;
    phone: string;
    employeeId: string;
  } | null>(() => {
    if (leave?.employeeId) {
      const employee = mockEmployees.find(emp => emp.id === leave.employeeId);
      return employee || null;
    }
    return null;
  });

  // حالة المستندات
  const [documents, setDocuments] = useState<DocumentFile[]>(() => {
    if (leave?.documents) {
      return leave.documents.map(doc => ({
        id: doc.id,
        name: doc.name,
        size: doc.size,
        type: doc.type,
        url: doc.url,
        uploadedAt: doc.uploadedAt
      }));
    }
    return [];
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // أنواع الإجازات
  const leaveTypes: { value: LeaveType; label: string }[] = [
    { value: 'ANNUAL', label: 'إجازة سنوية' },
    { value: 'SICK', label: 'إجازة مرضية' },
    { value: 'EMERGENCY', label: 'إجازة طارئة' },
    { value: 'MATERNITY', label: 'إجازة أمومة' },
    { value: 'PATERNITY', label: 'إجازة أبوة' },
    { value: 'STUDY', label: 'إجازة دراسية' },
    { value: 'UNPAID', label: 'إجازة بدون راتب' },
  ];

  // حالات الطلب
  const leaveStatuses: { value: LeaveStatus; label: string }[] = [
    { value: 'PENDING', label: 'قيد الانتظار' },
    { value: 'APPROVED', label: 'موافق عليه' },
    { value: 'REJECTED', label: 'مرفوض' },
    { value: 'CANCELLED', label: 'ملغي' },
  ];

  // الموظفين الوهميين
  const mockEmployees = [
    { id: '1', name: 'أحمد محمد العتيبي', position: 'مطور برمجيات', department: 'تقنية المعلومات', phone: '0501234567', employeeId: 'EMP001' },
    { id: '2', name: 'فاطمة أحمد السالمي', position: 'محاسبة', department: 'المالية', phone: '0501234568', employeeId: 'EMP002' },
    { id: '3', name: 'محمد سالم الكندي', position: 'مدير مشروع', department: 'إدارة المشاريع', phone: '0501234569', employeeId: 'EMP003' },
    { id: '4', name: 'سارة علي النعماني', position: 'مصممة', department: 'التصميم', phone: '0501234570', employeeId: 'EMP004' },
    { id: '5', name: 'عبدالله خالد الشنفري', position: 'محلل أعمال', department: 'التحليل', phone: '0501234571', employeeId: 'EMP005' },
    { id: '6', name: 'نورا محمد الراشدي', position: 'منسق مشاريع', department: 'المشاريع', phone: '0501234572', employeeId: 'EMP006' },
    { id: '7', name: 'خالد عبدالله الشامسي', position: 'موظف استلام', department: 'المخزن', phone: '0501234573', employeeId: 'EMP007' },
    { id: '8', name: 'مريم سعد الزهراني', position: 'مشرف جودة', department: 'الجودة', phone: '0501234574', employeeId: 'EMP008' },
    { id: '9', name: 'عبدالله أحمد البوسعيدي', position: 'فني صيانة', department: 'الصيانة', phone: '0501234575', employeeId: 'EMP009' },
    { id: '10', name: 'سالم علي الكندي', position: 'مدير المبيعات', department: 'المبيعات', phone: '0501234576', employeeId: 'EMP010' },
    { id: '11', name: 'عائشة عبدالله الحارثي', position: 'مدير موارد بشرية', department: 'الموارد البشرية', phone: '0501234577', employeeId: 'EMP011' },
    { id: '12', name: 'عبدالرحمن خالد الغافري', position: 'فني تركيب', department: 'التركيب', phone: '0501234578', employeeId: 'EMP012' },
    { id: '13', name: 'سارة عبدالله النعيمي', position: 'مشرف ميداني', department: 'الميدان', phone: '0501234579', employeeId: 'EMP013' },
    { id: '14', name: 'محمد سالم الخليلي', position: 'مدير العمليات', department: 'العمليات', phone: '0501234580', employeeId: 'EMP014' },
    { id: '15', name: 'فاطمة أحمد السعيد', position: 'موظف توصيل', department: 'التوصيل', phone: '0501234581', employeeId: 'EMP015' },
  ];

  // حساب عدد الأيام
  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  // التحقق من صحة البيانات
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.employeeId) {
      newErrors.employeeId = 'يرجى اختيار الموظف';
    }

    if (!formData.leaveType) {
      newErrors.leaveType = 'يرجى اختيار نوع الإجازة';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'يرجى تحديد تاريخ البداية';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'يرجى تحديد تاريخ النهاية';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (end < start) {
        newErrors.endDate = 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية';
      }
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'يرجى كتابة سبب الإجازة';
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

    const numberOfDays = calculateDays();
    
    // تحويل المستندات إلى النوع المطلوب
    const leaveDocuments: LeaveDocument[] = documents.map(doc => ({
      id: doc.id,
      name: doc.name,
      size: doc.size,
      type: doc.type,
      url: doc.url || '',
      uploadedAt: doc.uploadedAt || new Date().toISOString()
    }));

    const leaveData: Partial<Leave> = {
      ...formData,
      totalDays: numberOfDays,
      appliedDate: new Date().toISOString(),
      documents: leaveDocuments,
    };

    onSave(leaveData);
  };

  // معالجة اختيار الموظف
  const handleEmployeeSelect = (employee: {
    id: string;
    name: string;
    position: string;
    department: string;
    phone: string;
    employeeId: string;
  } | null) => {
    setSelectedEmployee(employee);
    if (employee) {
      setFormData(prev => ({
        ...prev,
        employeeId: employee.id,
        employeeName: employee.name,
        position: employee.position,
        department: employee.department,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        employeeId: '',
        employeeName: '',
        position: '',
        department: '',
      }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-5 w-5 text-[#58d2c8]" />
        <h2 className="text-xl font-semibold">
          {leave ? 'تعديل طلب الإجازة' : 'إضافة طلب إجازة جديد'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* معلومات الموظف */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الموظف <span className="text-red-500">*</span>
            </label>
            <EmployeeSearchDropdown
              employees={mockEmployees}
              selectedEmployee={selectedEmployee}
              onSelectEmployee={handleEmployeeSelect}
              placeholder="ابحث عن الموظف بالاسم أو المنصب أو القسم..."
              disabled={isLoading}
              required={true}
              error={errors.employeeId}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نوع الإجازة <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.leaveType}
              onChange={(e) => setFormData(prev => ({ ...prev, leaveType: e.target.value as LeaveType }))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#58d2c8] ${
                errors.leaveType ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
            >
              {leaveTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.leaveType && (
              <p className="text-red-500 text-sm mt-1">{errors.leaveType}</p>
            )}
          </div>
        </div>

        {/* تواريخ الإجازة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تاريخ البداية <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#58d2c8] ${
                errors.startDate ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تاريخ النهاية <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#58d2c8] ${
                errors.endDate ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {errors.endDate && (
              <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عدد الأيام
            </label>
            <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
              {calculateDays()} يوم
            </div>
          </div>
        </div>

        {/* سبب الإجازة */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            سبب الإجازة <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.reason}
            onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#58d2c8] ${
              errors.reason ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="اكتب سبب طلب الإجازة..."
            disabled={isLoading}
          />
          {errors.reason && (
            <p className="text-red-500 text-sm mt-1">{errors.reason}</p>
          )}
        </div>

        {/* رفع المستندات */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <Paperclip className="h-4 w-4" />
              المستندات المرفقة (اختياري)
            </div>
          </label>
          <DocumentUpload
            documents={documents}
            onDocumentsChange={setDocuments}
            maxFiles={5}
            maxSizePerFile={10}
            acceptedTypes={['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']}
            disabled={isLoading}
            className="mt-2"
          />
          <p className="text-xs text-gray-500 mt-2">
            يمكنك رفع المستندات الداعمة لطلب الإجازة مثل التقارير الطبية أو المستندات الرسمية
          </p>
        </div>

        {/* حالة الطلب (للتعديل فقط) */}
        {leave && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              حالة الطلب
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as LeaveStatus }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#58d2c8]"
              disabled={isLoading}
            >
              {leaveStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
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
            {isLoading ? 'جاري الحفظ...' : (leave ? 'تحديث الطلب' : 'إضافة الطلب')}
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
