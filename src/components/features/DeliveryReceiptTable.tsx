/**
 * مكون جدول إيصالات التسليم
 */

'use client';

import React, { useState, useMemo } from 'react';
import { DeliveryReceiptData } from '@/data/operationsData';
import { Search, Eye, Printer, Edit, CheckCircle, Clock, User, Phone, Package, MapPin, Camera, FileText } from 'lucide-react';

interface DeliveryReceiptTableProps {
  data: DeliveryReceiptData[];
  onViewReceipt?: (receipt: DeliveryReceiptData) => void;
  onEditReceipt?: (receipt: DeliveryReceiptData) => void;
  onPrintReceipt?: (receipt: DeliveryReceiptData) => void;
  onVerifyReceipt?: (receipt: DeliveryReceiptData) => void;
  isLoading?: boolean;
}

export function DeliveryReceiptTable({
  data,
  onViewReceipt,
  onEditReceipt,
  onPrintReceipt,
  onVerifyReceipt,
  isLoading = false
}: DeliveryReceiptTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('الكل');
  const [typeFilter, setTypeFilter] = useState<string>('الكل');
  const [priorityFilter, setPriorityFilter] = useState<string>('الكل');
  const [sortBy, setSortBy] = useState<string>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // تصفية وترتيب البيانات
  const filteredData = useMemo(() => {
    const filtered = data.filter(receipt => {
      const matchesSearch = 
        receipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.customerAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.driverName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'الكل' || receipt.status === statusFilter;
      const matchesType = typeFilter === 'الكل' || receipt.equipmentType === typeFilter;
      const matchesPriority = priorityFilter === 'الكل' || true; // لا توجد خاصية أولوية
      
      return matchesSearch && matchesStatus && matchesType && matchesPriority;
    });

    // ترتيب البيانات
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof DeliveryReceiptData];
      let bValue: any = b[sortBy as keyof DeliveryReceiptData];

      if (sortBy === 'deliveryDate') {
        aValue = new Date(a.deliveryDate).getTime();
        bValue = new Date(b.deliveryDate).getTime();
      } else if (sortBy === 'updatedAt') {
        aValue = new Date(a.updatedAt).getTime();
        bValue = new Date(b.updatedAt).getTime();
      } else if (sortBy === 'equipmentQuantity') {
        aValue = a.equipmentQuantity;
        bValue = b.equipmentQuantity;
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
      case 'معلق': return 'bg-yellow-100 text-yellow-800';
      case 'مرفوض': return 'bg-red-100 text-red-800';
      case 'في الانتظار': return 'bg-blue-100 text-blue-800';
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

  // الحصول على لون نوع الإيصال
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'تسليم': return 'bg-blue-100 text-blue-800';
      case 'استرجاع': return 'bg-orange-100 text-orange-800';
      case 'تسليم واسترجاع': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // الحصول على لون حالة الدفع
  const _getPaymentColor = (payment: string) => {
    switch (payment) {
      case 'مدفوع': return 'bg-green-100 text-green-800';
      case 'غير مدفوع': return 'bg-red-100 text-red-800';
      case 'مدفوع جزئياً': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
  const _formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'OMR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // حساب نسبة التحقق
  const _getVerificationPercentage = () => {
    return 85; // نسبة افتراضية
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
                placeholder="البحث في رقم الإيصال، اسم العميل، المستلم، أو السائق..."
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
              <option value="معلق">معلق</option>
              <option value="مرفوض">مرفوض</option>
              <option value="في الانتظار">في الانتظار</option>
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
              <option value="تسليم">تسليم</option>
              <option value="استرجاع">استرجاع</option>
              <option value="تسليم واسترجاع">تسليم واسترجاع</option>
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
          عرض {filteredData.length} من أصل {data.length} إيصال تسليم
        </div>
      </div>

      {/* الجدول */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('receiptNumber')}
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  رقم الإيصال
                  {sortBy === 'receiptNumber' && (
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
                  العميل/المستلم
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
                onClick={() => handleSort('deliveryDate')}
              >
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  تاريخ/وقت التسليم
                  {sortBy === 'deliveryDate' && (
                    <span className="text-[#58d2c8]">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  العنوان
                </div>
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('totalValue')}
              >
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  المعدات/القيمة
                  {sortBy === 'totalValue' && (
                    <span className="text-[#58d2c8]">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  التحقق/الدفع
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((receipt) => (
              <tr key={receipt.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {receipt.receiptNumber}
                  </div>
                  <div className="text-sm text-gray-500">
                    {receipt.orderNumber}
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatDate(receipt.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {receipt.customerName}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <User className="h-3 w-3" />
                    {receipt.recipientName}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Phone className="h-3 w-3" />
                    {receipt.customerPhone}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(receipt.equipmentType)}`}>
                      {receipt.equipmentType}
                    </span>
                    <br />
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(receipt.status)}`}>
                      {receipt.status}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      {receipt.equipmentQuantity} قطعة
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatDate(receipt.deliveryDate)}
                  </div>
                  <div className="text-sm text-gray-500">
                    المحدد: {formatTime(receipt.deliveryDate)}
                  </div>
                  <div className="text-sm text-green-600">
                    تم: {formatTime(receipt.deliveryDate)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    {receipt.customerAddress}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {receipt.equipmentType}
                  </div>
                  <div className="text-sm text-gray-500">
                    {receipt.equipmentQuantity} قطعة
                  </div>
                  <div className="text-xs text-gray-500">
                    {receipt.driverName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-gray-600">
                        85%
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(receipt.status)}`}>
                      {receipt.status}
                    </span>
                    <div className="flex items-center gap-1 text-xs">
                      <Camera className="h-3 w-3 text-blue-500" />
                      <span className="text-gray-500">
                        {receipt.photos.length} صورة
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewReceipt?.(receipt)}
                      className="text-[#58d2c8] hover:text-[#4AB8B3] transition-colors"
                      title="عرض التفاصيل"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEditReceipt?.(receipt)}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                      title="تعديل"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onPrintReceipt?.(receipt)}
                      className="text-green-600 hover:text-green-700 transition-colors"
                      title="طباعة"
                    >
                      <Printer className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onVerifyReceipt?.(receipt)}
                      className="text-orange-600 hover:text-orange-700 transition-colors"
                      title="التحقق"
                    >
                      <CheckCircle className="h-4 w-4" />
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد إيصالات تسليم</h3>
          <p className="mt-1 text-sm text-gray-500">
            لم يتم العثور على إيصالات تسليم تطابق معايير البحث المحددة.
          </p>
        </div>
      )}
    </div>
  );
}
