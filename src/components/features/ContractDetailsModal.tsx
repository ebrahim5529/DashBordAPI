/**
 * مكون نافذة عرض تفاصيل العقد
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Calendar, DollarSign, MapPin, Package, User, FileText, Clock, AlertTriangle, Send, Users, Check, Search, ChevronDown, Paperclip, Download, Eye, CreditCard, TrendingUp, Activity, CheckCircle, GitBranch } from 'lucide-react';
import { ContractManagementData } from '@/data/contractsManagementData';
import DeliveryReceiptGenerator from './DeliveryReceiptGenerator';

interface ContractDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: ContractManagementData | null;
}

export default function ContractDetailsModal({ isOpen, onClose, contract }: ContractDetailsModalProps) {
  const [showEmployeeSelection, setShowEmployeeSelection] = useState(false);
  
  if (!isOpen || !contract) return null;

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // تنسيق المبلغ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'OMR',
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    }).format(amount);
  };

  // حساب مدة العقد
  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const duration = calculateDuration(contract.startDate, contract.endDate);

  // الحصول على لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'نشط': return 'bg-green-100 text-green-800 border-green-300';
      case 'منتهي': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'ملغي': return 'bg-red-100 text-red-800 border-red-300';
      case 'معلق': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'معتمد': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#58d2c8]/10 rounded-lg">
              <FileText className="h-6 w-6 text-[#58d2c8]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">تفاصيل العقد</h2>
              <p className="text-sm text-gray-600 mt-1">{contract.contractNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Contract Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Info */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-5 w-5 text-blue-600" />
                <h3 className="font-bold text-gray-900">معلومات العميل</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">اسم العميل</p>
                  <p className="font-semibold text-gray-900">{contract.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">رقم العميل</p>
                  <p className="font-semibold text-gray-900">{contract.customerId}</p>
                </div>
              </div>
            </div>

            {/* Contract Info */}
            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-purple-600" />
                <h3 className="font-bold text-gray-900">معلومات العقد</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">رقم العقد</p>
                  <p className="font-semibold text-gray-900">{contract.contractNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">نوع العقد</p>
                  <p className="font-semibold text-gray-900">{contract.contractType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">الحالة</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border-2 ${getStatusColor(contract.status)}`}>
                    {contract.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-5 w-5 text-green-600" />
              <h3 className="font-bold text-gray-900">التواريخ والمدة</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">تاريخ البدء</p>
                <p className="font-semibold text-gray-900">{formatDate(contract.startDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">تاريخ الانتهاء</p>
                <p className="font-semibold text-gray-900">{formatDate(contract.endDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">مدة العقد</p>
                <p className="font-semibold text-gray-900">{duration} يوم</p>
              </div>
            </div>
          </div>

          {/* Financial Info */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="h-5 w-5 text-yellow-600" />
              <h3 className="font-bold text-gray-900">المعلومات المالية</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">إجمالي العقد</p>
                <p className="font-bold text-xl text-[#58d2c8]">{formatCurrency(contract.totalValue)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">المبلغ المدفوع</p>
                <p className="font-bold text-xl text-green-600">{formatCurrency(contract.paidAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">المبلغ المتبقي</p>
                <p className={`font-bold text-xl ${contract.remainingAmount > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                  {formatCurrency(contract.remainingAmount)}
                </p>
              </div>
            </div>
          </div>

          {/* Location & Equipment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-5 w-5 text-gray-600" />
                <h3 className="font-bold text-gray-900">الموقع</h3>
              </div>
              <p className="text-gray-900">{contract.location}</p>
            </div>

            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Package className="h-5 w-5 text-gray-600" />
                <h3 className="font-bold text-gray-900">المعدات</h3>
              </div>
              <p className="text-gray-900">
                <span className="font-semibold text-2xl text-[#58d2c8]">{contract.equipmentCount}</span>{' '}
                <span className="text-gray-600">قطعة</span>
              </p>
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-gray-600" />
              <h3 className="font-bold text-gray-900">معلومات النظام</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">تاريخ الإنشاء</p>
                <p className="font-semibold text-gray-900">{formatDate(contract.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">آخر تحديث</p>
                <p className="font-semibold text-gray-900">{formatDate(contract.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Priority Badge */}
          {contract.priority === 'عالي' && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <p className="font-bold text-red-600">عقد ذو أولوية عالية</p>
              </div>
            </div>
          )}

          {/* Payment Status Details */}
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="h-5 w-5 text-indigo-600" />
              <h3 className="font-bold text-gray-900">تفاصيل حالة الدفع</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">حالة الدفع</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  contract.remainingAmount === 0 ? 'bg-green-100 text-green-800' : 
                  contract.paidAmount > 0 ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {contract.remainingAmount === 0 ? 'مدفوع بالكامل' : 
                   contract.paidAmount > 0 ? 'مدفوع جزئياً' : 
                   'غير مدفوع'}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">نسبة الدفع</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(contract.paidAmount / contract.totalValue) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-semibold text-sm">
                    {((contract.paidAmount / contract.totalValue) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-teal-50 border-2 border-teal-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="h-5 w-5 text-teal-600" />
              <h3 className="font-bold text-gray-900">معلومات إضافية</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">عدد الأيام المتبقية</p>
                <p className="font-semibold text-gray-900">
                  {Math.max(0, Math.ceil((new Date(contract.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} يوم
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">عدد الأيام المنقضية</p>
                <p className="font-semibold text-gray-900">
                  {Math.max(0, Math.ceil((new Date().getTime() - new Date(contract.startDate).getTime()) / (1000 * 60 * 60 * 24)))} يوم
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">القيمة اليومية</p>
                <p className="font-semibold text-gray-900">
                  {formatCurrency(contract.totalValue / duration)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">حالة التقدم</p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-teal-600" />
                  <span className="font-semibold text-sm">
                    {Math.min(100, ((new Date().getTime() - new Date(contract.startDate).getTime()) / (new Date(contract.endDate).getTime() - new Date(contract.startDate).getTime())) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contract Stages */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <GitBranch className="h-5 w-5 text-purple-600" />
              <h3 className="font-bold text-gray-900">مراحل العقد</h3>
            </div>
            
            {/* المراحل */}
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-1 w-full justify-center flex-wrap">
                {/* المرحلة 1: توقيع العقد */}
                <div className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className="relative w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 bg-gradient-to-r from-green-400 to-green-500 border-green-500 shadow-lg shadow-green-200">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs mt-2 text-center font-medium transition-colors duration-200 max-w-[80px] leading-tight text-green-600">
                      توقيع العقد
                    </span>
                  </div>
                  <div className="h-1 w-12 mx-2 rounded-full transition-all duration-500 bg-green-400"></div>
                </div>

                {/* المرحلة 2: التسليم */}
                <div className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`relative w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      contract.status === 'نشط' 
                        ? 'bg-gradient-to-r from-green-400 to-green-500 border-green-500 shadow-lg shadow-green-200'
                        : 'bg-gray-100 border-gray-300'
                    }`}>
                      {contract.status === 'نشط' ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      )}
                    </div>
                    <span className={`text-xs mt-2 text-center font-medium transition-colors duration-200 max-w-[80px] leading-tight ${
                      contract.status === 'نشط' ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      التسليم
                    </span>
                  </div>
                  <div className={`h-1 w-12 mx-2 rounded-full transition-all duration-500 ${
                    contract.status === 'نشط' ? 'bg-green-400' : 'bg-gray-200'
                  }`}></div>
                </div>

                {/* المرحلة 3: الحالة (نشط/غير نشط) */}
                <div className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`relative w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      contract.status === 'نشط'
                        ? 'bg-gradient-to-r from-blue-400 to-blue-500 border-blue-500 shadow-lg shadow-blue-200'
                        : 'bg-gray-100 border-gray-300'
                    }`}>
                      {contract.status === 'نشط' ? (
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      ) : (
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      )}
                    </div>
                    <span className={`text-xs mt-2 text-center font-medium transition-colors duration-200 max-w-[80px] leading-tight ${
                      contract.status === 'نشط' ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {contract.status === 'نشط' ? 'نشط' : 'غير نشط'}
                    </span>
                  </div>
                  <div className={`h-1 w-12 mx-2 rounded-full transition-all duration-500 ${
                    contract.status === 'منتهي' ? 'bg-green-400' : 'bg-gray-200'
                  }`}></div>
                </div>

                {/* المرحلة 4: انتهاء العقد */}
                <div className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`relative w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      contract.status === 'منتهي'
                        ? 'bg-gradient-to-r from-green-400 to-green-500 border-green-500 shadow-lg shadow-green-200'
                        : 'bg-gray-100 border-gray-300'
                    }`}>
                      {contract.status === 'منتهي' ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      )}
                    </div>
                    <span className={`text-xs mt-2 text-center font-medium transition-colors duration-200 max-w-[80px] leading-tight ${
                      contract.status === 'منتهي' ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      انتهاء العقد
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ملاحظة حالة العقد */}
            <div className="mt-4 p-3 bg-white rounded-lg border border-purple-200">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">الحالة الحالية:</span> {contract.status}
              </p>
              {contract.status === 'نشط' && (
                <p className="text-xs text-blue-600 mt-1">
                  ⚡ العقد نشط حالياً ويتم تنفيذه
                </p>
              )}
              {contract.status === 'منتهي' && (
                <p className="text-xs text-gray-600 mt-1">
                  ✓ تم إتمام العقد بنجاح
                </p>
              )}
              {contract.status === 'معلق' && (
                <p className="text-xs text-yellow-600 mt-1">
                  ⏸ العقد معلق في انتظار الاعتماد
                </p>
              )}
            </div>
          </div>

          {/* Attachments Section */}
          <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Paperclip className="h-5 w-5 text-orange-600" />
              <h3 className="font-bold text-gray-900">المرفقات والمستندات</h3>
            </div>
            <div className="space-y-2">
              {/* Example attachments - يمكن استبدالها ببيانات حقيقية */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200 hover:border-orange-300 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-gray-900">عقد الإيجار الموقع</p>
                    <p className="text-xs text-gray-500">PDF • {(Math.random() * 2 + 0.5).toFixed(1)} MB</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-orange-100 rounded-lg transition-colors" title="معاينة">
                    <Eye className="h-4 w-4 text-orange-600" />
                  </button>
                  <button className="p-2 hover:bg-orange-100 rounded-lg transition-colors" title="تحميل">
                    <Download className="h-4 w-4 text-orange-600" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200 hover:border-orange-300 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-gray-900">صور المعدات</p>
                    <p className="text-xs text-gray-500">ZIP • {(Math.random() * 5 + 2).toFixed(1)} MB</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-orange-100 rounded-lg transition-colors" title="معاينة">
                    <Eye className="h-4 w-4 text-orange-600" />
                  </button>
                  <button className="p-2 hover:bg-orange-100 rounded-lg transition-colors" title="تحميل">
                    <Download className="h-4 w-4 text-orange-600" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200 hover:border-orange-300 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-gray-900">هوية العميل</p>
                    <p className="text-xs text-gray-500">PDF • {(Math.random() * 1 + 0.3).toFixed(1)} MB</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-orange-100 rounded-lg transition-colors" title="معاينة">
                    <Eye className="h-4 w-4 text-orange-600" />
                  </button>
                  <button className="p-2 hover:bg-orange-100 rounded-lg transition-colors" title="تحميل">
                    <Download className="h-4 w-4 text-orange-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={() => setShowEmployeeSelection(true)}
              className="flex-1 px-6 py-3 bg-[#58d2c8] hover:bg-[#4AB8B3] text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              إرسال سند استلام بضاعة
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>

      {/* نافذة اختيار الموظف */}
      {showEmployeeSelection && (
        <EmployeeSelectionModal
          isOpen={showEmployeeSelection}
          onClose={() => setShowEmployeeSelection(false)}
          contract={contract}
        />
      )}
    </div>
  );
}

// مكون نافذة اختيار الموظف
interface EmployeeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: ContractManagementData;
}

function EmployeeSelectionModal({ isOpen, onClose, contract }: EmployeeSelectionModalProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showReceiptGenerator, setShowReceiptGenerator] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // بيانات الموظفين المزيفة
  const employees = [
    { id: '1', name: 'أحمد محمد علي', position: 'مشرف مخزن', department: 'المخزن', phone: '91234567' },
    { id: '2', name: 'فاطمة أحمد السعيد', position: 'موظف توصيل', department: 'التوصيل', phone: '91234568' },
    { id: '3', name: 'محمد سالم الخليلي', position: 'مدير العمليات', department: 'العمليات', phone: '91234569' },
    { id: '4', name: 'سارة عبدالله النعيمي', position: 'مشرف ميداني', department: 'الميدان', phone: '91234570' },
    { id: '5', name: 'عبدالرحمن خالد الغافري', position: 'فني تركيب', department: 'التركيب', phone: '91234571' },
    { id: '6', name: 'خالد عبدالله الشامسي', position: 'موظف استلام', department: 'المخزن', phone: '91234572' },
    { id: '7', name: 'مريم سعد الزهراني', position: 'مشرف جودة', department: 'الجودة', phone: '91234573' },
    { id: '8', name: 'عبدالله أحمد البوسعيدي', position: 'فني صيانة', department: 'الصيانة', phone: '91234574' },
    { id: '9', name: 'نورا محمد الراشدي', position: 'منسق مشاريع', department: 'المشاريع', phone: '91234575' },
    { id: '10', name: 'سالم علي الكندي', position: 'مدير المبيعات', department: 'المبيعات', phone: '91234576' },
  ];

  // تصفية الموظفين حسب البحث
  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.phone.includes(searchTerm)
  );

  // الحصول على الموظف المحدد
  const selectedEmployeeData = employees.find(emp => emp.id === selectedEmployee);

  // إغلاق الـ dropdown عند النقر خارجه
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // اختيار موظف
  const handleSelectEmployee = (employeeId: string) => {
    setSelectedEmployee(employeeId);
    setIsDropdownOpen(false);
    setSearchTerm('');
  };

  // مسح البحث
  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleSendReceipt = async () => {
    if (!selectedEmployee) {
      alert('يرجى اختيار الموظف أولاً');
      return;
    }

    setIsLoading(true);
    try {
      // إنشاء سند الاستلام
      const receiptData = {
        contractId: contract.id,
        contractNumber: contract.contractNumber,
        employeeId: selectedEmployee,
        employeeName: employees.find(emp => emp.id === selectedEmployee)?.name,
        timestamp: new Date().toISOString(),
        equipmentItems: [
          {
            code: 'EQ-001',
            descriptionAr: 'سقالة معدنية متحركة',
            descriptionEn: 'Mobile Metal Scaffold',
            quantity: contract.equipmentCount || 10,
            notes: 'حالة جيدة'
          }
        ],
        generalCondition: 'جيد',
        additionalNotes: 'تم فحص المعدات والتأكد من مطابقتها للمواصفات'
      };

      // إرسال البيانات إلى API
      const response = await fetch('/api/delivery-receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(receiptData),
      });

      const result = await response.json();

      if (result.success) {
        // عرض مولد السند
        setShowReceiptGenerator(true);
      } else {
        throw new Error(result.message || 'فشل في إرسال سند الاستلام');
      }
    } catch (error) {
      console.error('خطأ في إرسال سند الاستلام:', error);
      alert(`حدث خطأ في إرسال سند الاستلام: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#58d2c8]/10 rounded-lg">
              <Users className="h-6 w-6 text-[#58d2c8]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">اختيار الموظف</h2>
              <p className="text-sm text-gray-600 mt-1">اختر الموظف المسؤول عن استلام البضاعة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* معلومات العقد */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">معلومات العقد</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">رقم العقد:</span>
                <span className="font-medium mr-2">{contract.contractNumber}</span>
              </div>
              <div>
                <span className="text-gray-600">العميل:</span>
                <span className="font-medium mr-2">{contract.customerName}</span>
              </div>
              <div>
                <span className="text-gray-600">الموقع:</span>
                <span className="font-medium mr-2">{contract.location}</span>
              </div>
              <div>
                <span className="text-gray-600">عدد المعدات:</span>
                <span className="font-medium mr-2">{contract.equipmentCount} قطعة</span>
              </div>
            </div>
          </div>

          {/* اختيار الموظف */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">اختر الموظف</h3>
            
            {/* Dropdown للموظفين */}
            <div className="relative" ref={dropdownRef}>
              {/* زر فتح/إغلاق الـ dropdown */}
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-3 text-right border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-[#58d2c8] transition-colors flex items-center justify-between"
              >
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                <span className={selectedEmployee ? 'text-gray-900' : 'text-gray-500'}>
                  {selectedEmployeeData ? selectedEmployeeData.name : 'اختر الموظف...'}
                </span>
              </button>

              {/* محتوى الـ dropdown */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-80 overflow-hidden">
                  {/* شريط البحث */}
                  <div className="p-3 border-b border-gray-200">
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="ابحث عن الموظف..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-[#58d2c8] transition-colors"
                      />
                      {searchTerm && (
                        <button
                          onClick={handleClearSearch}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* قائمة الموظفين */}
                  <div className="max-h-60 overflow-y-auto">
                    {filteredEmployees.length > 0 ? (
                      filteredEmployees.map((employee) => (
                        <div
                          key={employee.id}
                          className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                            selectedEmployee === employee.id ? 'bg-[#58d2c8]/10' : ''
                          }`}
                          onClick={() => handleSelectEmployee(employee.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedEmployee === employee.id
                                ? 'border-[#58d2c8] bg-[#58d2c8]'
                                : 'border-gray-300'
                            }`}>
                              {selectedEmployee === employee.id && (
                                <Check className="h-3 w-3 text-white" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{employee.name}</p>
                              <p className="text-sm text-gray-600">{employee.position} - {employee.department}</p>
                              <p className="text-xs text-gray-500">📞 {employee.phone}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center text-gray-500">
                        <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p>لا توجد نتائج للبحث</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* عرض الموظف المحدد */}
            {selectedEmployeeData && (
              <div className="mt-4 p-4 bg-[#58d2c8]/10 border border-[#58d2c8]/30 rounded-lg">
                <h4 className="font-semibold text-[#58d2c8] mb-2">الموظف المحدد:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">الاسم:</span>
                    <span className="font-medium mr-2">{selectedEmployeeData.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">المنصب:</span>
                    <span className="font-medium mr-2">{selectedEmployeeData.position}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">القسم:</span>
                    <span className="font-medium mr-2">{selectedEmployeeData.department}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">الهاتف:</span>
                    <span className="font-medium mr-2">{selectedEmployeeData.phone}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={handleSendReceipt}
              disabled={!selectedEmployee || isLoading}
              className="flex-1 px-6 py-3 bg-[#58d2c8] hover:bg-[#4AB8B3] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  إرسال سند الاستلام
                </>
              )}
            </button>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>

      {/* مولد سند الاستلام */}
      {showReceiptGenerator && (
        <DeliveryReceiptGenerator
          contract={contract}
          employeeName={employees.find(emp => emp.id === selectedEmployee)?.name || ''}
          onClose={() => {
            setShowReceiptGenerator(false);
            onClose();
          }}
        />
      )}
    </div>
  );
}
