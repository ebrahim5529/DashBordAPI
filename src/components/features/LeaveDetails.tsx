/**
 * مكون عرض تفاصيل طلب الإجازة
 */

'use client';

import React from 'react';
import { 
  Calendar, 
  User, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ArrowLeft,
  Edit,
  Trash2,
  Paperclip,
  Eye,
  Download
} from 'lucide-react';
import { Leave, LeaveType, LeaveStatus } from '@/lib/types/leaves';
import { formatDate } from '@/lib/utils/formatDate.util';

interface LeaveDetailsProps {
  leave: Leave;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export default function LeaveDetails({ 
  leave, 
  onEdit, 
  onDelete, 
  onBack, 
  isLoading = false 
}: LeaveDetailsProps) {
  
  // تنسيق حجم الملف
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 بايت';
    const k = 1024;
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // تحميل مستند
  const handleDownloadDocument = (document: any) => {
    if (document.url) {
      const link = document.createElement('a');
      link.href = document.url;
      link.download = document.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  // تحويل نوع الإجازة إلى نص عربي
  const getLeaveTypeLabel = (type: LeaveType): string => {
    const types: Record<LeaveType, string> = {
      ANNUAL: 'إجازة سنوية',
      SICK: 'إجازة مرضية',
      EMERGENCY: 'إجازة طارئة',
      MATERNITY: 'إجازة أمومة',
      PATERNITY: 'إجازة أبوة',
      STUDY: 'إجازة دراسية',
      UNPAID: 'إجازة بدون راتب',
    };
    return types[type] || type;
  };

  // تحويل حالة الطلب إلى نص عربي
  const getStatusLabel = (status: LeaveStatus): string => {
    const statuses: Record<LeaveStatus, string> = {
      PENDING: 'قيد الانتظار',
      APPROVED: 'موافق عليه',
      REJECTED: 'مرفوض',
      CANCELLED: 'ملغي',
    };
    return statuses[status] || status;
  };

  // الحصول على لون الحالة
  const getStatusColor = (status: LeaveStatus): string => {
    const colors: Record<LeaveStatus, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      CANCELLED: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // الحصول على أيقونة الحالة
  const getStatusIcon = (status: LeaveStatus) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4" />;
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      case 'CANCELLED':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            العودة
          </button>
          <div className="h-6 w-px bg-gray-300" />
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#58d2c8]" />
            <h2 className="text-xl font-semibold">تفاصيل طلب الإجازة</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-[#58d2c8] text-white rounded-md hover:bg-[#58d2c8]/90 focus:outline-none focus:ring-2 focus:ring-[#58d2c8] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Edit className="h-4 w-4" />
            تعديل
          </button>

          <button
            onClick={onDelete}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            حذف
          </button>
        </div>
      </div>

      {/* معلومات الطلب */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* العمود الأول - معلومات الموظف */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-[#58d2c8]" />
              معلومات الموظف
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">اسم الموظف:</span>
                <span className="font-medium">{leave.employeeName}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">المنصب:</span>
                <span className="font-medium">{leave.position}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">القسم:</span>
                <span className="font-medium">{leave.department}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#58d2c8]" />
              تفاصيل الإجازة
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">نوع الإجازة:</span>
                <span className="font-medium">{getLeaveTypeLabel(leave.leaveType)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">تاريخ البداية:</span>
                <span className="font-medium">{formatDate(leave.startDate)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">تاريخ النهاية:</span>
                <span className="font-medium">{formatDate(leave.endDate)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">عدد الأيام:</span>
                <span className="font-medium text-[#58d2c8]">{leave.totalDays} يوم</span>
              </div>
            </div>
          </div>
        </div>

        {/* العمود الثاني - حالة الطلب */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#58d2c8]" />
              حالة الطلب
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">الحالة:</span>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(leave.status)}`}>
                  {getStatusIcon(leave.status)}
                  {getStatusLabel(leave.status)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">تاريخ الطلب:</span>
                <span className="font-medium">{formatDate(leave.appliedDate)}</span>
              </div>
              
              {leave.approvedBy && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">وافق عليه:</span>
                  <span className="font-medium">{leave.approvedBy}</span>
                </div>
              )}
              
              {leave.approvedDate && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">تاريخ الموافقة:</span>
                  <span className="font-medium">{formatDate(leave.approvedDate)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#58d2c8]" />
              سبب الإجازة
            </h3>
            
            <div className="bg-white rounded-md p-4 border">
              <p className="text-gray-700 leading-relaxed">{leave.reason}</p>
            </div>
          </div>

          {/* المستندات المرفقة */}
          {leave.documents && leave.documents.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Paperclip className="h-5 w-5 text-[#58d2c8]" />
                المستندات المرفقة ({leave.documents.length})
              </h3>
              
              <div className="space-y-3">
                {leave.documents.map((document) => (
                  <div
                    key={document.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        {document.type.includes('pdf') && <span className="text-2xl">📄</span>}
                        {document.type.includes('word') && <span className="text-2xl">📝</span>}
                        {document.type.includes('image') && <span className="text-2xl">🖼️</span>}
                        {!document.type.includes('pdf') && !document.type.includes('word') && !document.type.includes('image') && (
                          <span className="text-2xl">📎</span>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {document.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(document.size)} • {formatDate(document.uploadedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.open(document.url, '_blank')}
                        className="p-2 text-gray-400 hover:text-[#58d2c8] transition-colors"
                        title="معاينة"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDownloadDocument(document)}
                        className="p-2 text-gray-400 hover:text-[#58d2c8] transition-colors"
                        title="تحميل"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ملاحظات إضافية */}
      {leave.status === 'PENDING' && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-800">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">ملاحظة:</span>
          </div>
          <p className="text-yellow-700 mt-2">
            هذا الطلب قيد الانتظار للمراجعة والموافقة من قبل المدير المسؤول.
          </p>
        </div>
      )}

      {leave.status === 'REJECTED' && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-800">
            <XCircle className="h-5 w-5" />
            <span className="font-medium">ملاحظة:</span>
          </div>
          <p className="text-red-700 mt-2">
            تم رفض هذا الطلب. يرجى مراجعة المدير المسؤول للحصول على مزيد من التفاصيل.
          </p>
        </div>
      )}

      {leave.status === 'APPROVED' && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">ملاحظة:</span>
          </div>
          <p className="text-green-700 mt-2">
            تم الموافقة على هذا الطلب. يمكن للموظف أخذ الإجازة في التواريخ المحددة.
          </p>
        </div>
      )}
    </div>
  );
}
