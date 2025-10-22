/**
 * مكون جدول فحص الاسترجاع
 */

'use client';

import React, { useState, useMemo } from 'react';
import { ReturnInspectionData } from '@/data/operationsData';
import { Search, Eye, Edit, CheckCircle, XCircle, Clock, User, Package, MapPin, Camera, FileText, AlertTriangle, Thermometer } from 'lucide-react';

interface ReturnInspectionTableProps {
  data: ReturnInspectionData[];
  onViewInspection?: (inspection: ReturnInspectionData) => void;
  onEditInspection?: (inspection: ReturnInspectionData) => void;
  onApproveInspection?: (inspection: ReturnInspectionData) => void;
  onRejectInspection?: (inspection: ReturnInspectionData) => void;
  isLoading?: boolean;
}

export function ReturnInspectionTable({
  data,
  onViewInspection,
  onEditInspection,
  onApproveInspection,
  onRejectInspection,
  isLoading = false
}: ReturnInspectionTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('الكل');
  const [typeFilter, setTypeFilter] = useState<string>('الكل');
  const [priorityFilter, setPriorityFilter] = useState<string>('الكل');
  const [sortBy, setSortBy] = useState<string>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // تصفية وترتيب البيانات
  const filteredData = useMemo(() => {
    const filtered = data.filter(inspection => {
      const matchesSearch = 
        inspection.inspectionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inspection.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inspection.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inspection.equipmentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inspection.inspectorName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'الكل' || inspection.overallStatus === statusFilter;
      const matchesType = typeFilter === 'الكل' || inspection.equipmentType === typeFilter;
      const matchesPriority = priorityFilter === 'الكل' || true; // لا توجد خاصية أولوية
      
      return matchesSearch && matchesStatus && matchesType && matchesPriority;
    });

    // ترتيب البيانات
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof ReturnInspectionData];
      let bValue: any = b[sortBy as keyof ReturnInspectionData];

      if (sortBy === 'returnDate') {
        aValue = new Date(a.returnDate).getTime();
        bValue = new Date(b.returnDate).getTime();
      } else if (sortBy === 'updatedAt') {
        aValue = new Date(a.updatedAt).getTime();
        bValue = new Date(b.updatedAt).getTime();
      } else if (sortBy === 'equipmentQuantity') {
        aValue = a.equipmentQuantity;
        bValue = b.equipmentQuantity;
      } else if (sortBy === 'equipmentCondition') {
        aValue = a.equipmentCondition;
        bValue = b.equipmentCondition;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [data, searchTerm, statusFilter, typeFilter, priorityFilter, sortBy, sortOrder]);

  // معالجة تغيير الترتيب
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  // الحصول على لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مكتمل': return 'bg-green-100 text-green-800';
      case 'قيد الفحص': return 'bg-blue-100 text-blue-800';
      case 'مرفوض': return 'bg-red-100 text-red-800';
      case 'في الانتظار': return 'bg-yellow-100 text-yellow-800';
      case 'يحتاج إصلاح': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // الحصول على لون الأولوية
  const _getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'عالي': return 'bg-red-100 text-red-800';
      case 'متوسط': return 'bg-yellow-100 text-yellow-800';
      case 'منخفض': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // الحصول على لون نوع الفحص
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'فحص استرجاع': return 'bg-blue-100 text-blue-800';
      case 'فحص تلف': return 'bg-red-100 text-red-800';
      case 'فحص شامل': return 'bg-purple-100 text-purple-800';
      case 'فحص سريع': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // الحصول على لون درجة الجودة
  const _getQualityColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    if (score >= 40) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  // تنسيق الوقت
  const formatTime = (timeString: string) => {
    return timeString;
  };

  // تنسيق المبلغ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'OMR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // تنسيق المدة
  const _formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}س ${remainingMinutes}د`;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* شريط البحث والتصفية */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* البحث */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="البحث في رقم الفحص، اسم العميل، المفتش، أو العنوان..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
              />
            </div>
          </div>

          {/* تصفية الحالة */}
          <div className="lg:w-40">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
            >
              <option value="الكل">جميع الحالات</option>
              <option value="مكتمل">مكتمل</option>
              <option value="قيد الفحص">قيد الفحص</option>
              <option value="مرفوض">مرفوض</option>
              <option value="في الانتظار">في الانتظار</option>
              <option value="يحتاج إصلاح">يحتاج إصلاح</option>
            </select>
          </div>

          {/* تصفية النوع */}
          <div className="lg:w-40">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
            >
              <option value="الكل">جميع الأنواع</option>
              <option value="فحص استرجاع">فحص استرجاع</option>
              <option value="فحص تلف">فحص تلف</option>
              <option value="فحص شامل">فحص شامل</option>
              <option value="فحص سريع">فحص سريع</option>
            </select>
          </div>

          {/* تصفية الأولوية */}
          <div className="lg:w-40">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
            >
              <option value="الكل">جميع الأولويات</option>
              <option value="عالي">عالي</option>
              <option value="متوسط">متوسط</option>
              <option value="منخفض">منخفض</option>
            </select>
          </div>
        </div>

        {/* معلومات النتائج */}
        <div className="mt-4 text-sm text-gray-600">
          عرض {filteredData.length} من أصل {data.length} فحص استرجاع
        </div>
      </div>

      {/* الجدول */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('inspectionNumber')}
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  رقم الفحص
                  {sortBy === 'inspectionNumber' && (
                    <span className="text-[#58d2c8]">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('customerName')}
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  العميل/المفتش
                  {sortBy === 'customerName' && (
                    <span className="text-[#58d2c8]">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                النوع/الحالة/الأولوية
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('inspectionDate')}
              >
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  تاريخ/وقت الفحص
                  {sortBy === 'inspectionDate' && (
                    <span className="text-[#58d2c8]">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  الموقع
                </div>
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('qualityScore')}
              >
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  المعدات/الجودة
                  {sortBy === 'qualityScore' && (
                    <span className="text-[#58d2c8]">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4" />
                  التلف/التكلفة
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((inspection) => (
              <tr key={inspection.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {inspection.inspectionNumber}
                  </div>
                  <div className="text-sm text-gray-500">
                    {inspection.orderNumber}
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatDate(inspection.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {inspection.customerName}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <User className="h-3 w-3" />
                    {inspection.inspectorName}
                  </div>
                  <div className="text-xs text-gray-400">
                    قسم الفحص
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(inspection.equipmentType)}`}>
                      {inspection.equipmentType}
                    </span>
                    <br />
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(inspection.overallStatus)}`}>
                      {inspection.overallStatus}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      {inspection.equipmentQuantity} قطعة
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatDate(inspection.returnDate)}
                  </div>
                  <div className="text-sm text-gray-500">
                    المحدد: {formatTime(inspection.returnDate)}
                  </div>
                  <div className="text-sm text-green-600">
                    تم: {formatTime(inspection.returnDate)}
                  </div>
                  <div className="text-xs text-gray-400">
                    25 دقيقة
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    موقع الفحص
                  </div>
                  <div className="text-xs text-gray-500">
                    طقس جيد - إضاءة كافية
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {inspection.equipmentQuantity} قطعة
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      85%
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {inspection.equipmentType}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {inspection.repairCost ? formatCurrency(inspection.repairCost) : '0 ر.ع'}
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    {inspection.damages.length > 0 ? (
                      <>
                        <AlertTriangle className="h-3 w-3 text-red-500" />
                        <span className="text-red-600">{inspection.damages.length} ضرر</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-green-600">لا يوجد تلف</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs mt-1">
                    <Camera className="h-3 w-3 text-blue-500" />
                    <span className="text-gray-500">
                      {inspection.photos.length} صورة
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewInspection?.(inspection)}
                      className="text-[#58d2c8] hover:text-[#4AB8B3] transition-colors"
                      title="عرض التفاصيل"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEditInspection?.(inspection)}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                      title="تعديل"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onApproveInspection?.(inspection)}
                      className="text-green-600 hover:text-green-700 transition-colors"
                      title="موافقة"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onRejectInspection?.(inspection)}
                      className="text-red-600 hover:text-red-700 transition-colors"
                      title="رفض"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* رسالة عدم وجود نتائج */}
      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد فحوصات استرجاع</h3>
          <p className="mt-1 text-sm text-gray-500">
            لم يتم العثور على فحوصات استرجاع تطابق معايير البحث المحددة.
          </p>
        </div>
      )}
    </div>
  );
}
