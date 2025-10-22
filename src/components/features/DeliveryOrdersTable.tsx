/**
 * مكون جدول أوامر التوصيل
 */

'use client';

import React, { useState, useMemo } from 'react';
import { DeliveryOrderData } from '@/data/operationsData';
import { Search, Eye, Printer, Edit, Trash2, Truck, Package, Clock, Phone, User } from 'lucide-react';

interface DeliveryOrdersTableProps {
  data: DeliveryOrderData[];
  onViewOrder?: (order: DeliveryOrderData) => void;
  onEditOrder?: (order: DeliveryOrderData) => void;
  onDeleteOrder?: (order: DeliveryOrderData) => void;
  onPrintOrder?: (order: DeliveryOrderData) => void;
  onOpenDetails?: (orderNumber: string) => void;
  isLoading?: boolean;
}

export function DeliveryOrdersTable({
  data,
  onEditOrder,
  onDeleteOrder,
  onPrintOrder,
  onOpenDetails,
  isLoading = false
}: DeliveryOrdersTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('الكل');
  const [typeFilter, setTypeFilter] = useState<string>('الكل');
  const [priorityFilter, setPriorityFilter] = useState<string>('الكل');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // تصفية وترتيب البيانات
  const filteredData = useMemo(() => {
    const filtered = data.filter(order => {
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerPhone.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'الكل' || order.status === statusFilter;
      const matchesType = typeFilter === 'الكل' || order.orderType === typeFilter;
      const matchesPriority = priorityFilter === 'الكل' || order.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesType && matchesPriority;
    });

    // ترتيب البيانات
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof DeliveryOrderData];
      let bValue: any = b[sortBy as keyof DeliveryOrderData];

      if (sortBy === 'scheduledDate') {
        aValue = new Date(a.scheduledDate).getTime();
        bValue = new Date(b.scheduledDate).getTime();
      } else if (sortBy === 'equipmentQuantity') {
        aValue = a.equipmentQuantity;
        bValue = b.equipmentQuantity;
      } else if (sortBy === 'priority') {
        aValue = a.priority;
        bValue = b.priority;
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
      case 'معلق': return 'bg-yellow-100 text-yellow-800';
      case 'قيد التنفيذ': return 'bg-blue-100 text-blue-800';
      case 'مكتمل': return 'bg-green-100 text-green-800';
      case 'ملغي': return 'bg-red-100 text-red-800';
      case 'متأخر': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // الحصول على لون الأولوية
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'عالي': return 'bg-red-100 text-red-800';
      case 'متوسط': return 'bg-yellow-100 text-yellow-800';
      case 'منخفض': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // الحصول على لون نوع الطلب
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'توصيل': return 'bg-blue-100 text-blue-800';
      case 'استرجاع': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  // تنسيق الوقت
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // تنسيق المبلغ
  const _formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'OMR',
      minimumFractionDigits: 0
    }).format(amount);
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
                placeholder="البحث في رقم الطلب، اسم العميل، أو رقم الهاتف..."
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
              <option value="معلق">معلق</option>
              <option value="قيد التنفيذ">قيد التنفيذ</option>
              <option value="مكتمل">مكتمل</option>
              <option value="ملغي">ملغي</option>
              <option value="متأخر">متأخر</option>
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
              <option value="توصيل">توصيل</option>
              <option value="استرجاع">استرجاع</option>
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
          عرض {filteredData.length} من أصل {data.length} أمر توصيل
        </div>
      </div>

      {/* الجدول */}
      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-2 py-3 text-right text-sm font-medium text-gray-500 cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                onClick={() => handleSort('orderNumber')}
              >
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  رقم الطلب
                  {sortBy === 'orderNumber' && (
                    <span className="text-[#58d2c8]">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-2 py-3 text-right text-sm font-medium text-gray-500 cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                onClick={() => handleSort('customerName')}
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  العميل
                  {sortBy === 'customerName' && (
                    <span className="text-[#58d2c8]">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-2 py-3 text-right text-sm font-medium text-gray-500 whitespace-nowrap">
                النوع/الحالة/الأولوية
              </th>
              <th 
                className="px-2 py-3 text-right text-sm font-medium text-gray-500 cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                onClick={() => handleSort('scheduledDate')}
              >
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  الموعد المحدد
                  {sortBy === 'scheduledDate' && (
                    <span className="text-[#58d2c8]">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-2 py-3 text-right text-sm font-medium text-gray-500 cursor-pointer hover:bg-gray-100 whitespace-nowrap"
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
              <th className="px-2 py-3 text-right text-sm font-medium text-gray-500 whitespace-nowrap">
                السائق/المركبة
              </th>
              <th className="px-2 py-3 text-right text-sm font-medium text-gray-500 whitespace-nowrap">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-2 py-3 text-sm whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.orderNumber}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </div>
                </td>
                <td className="px-2 py-3 text-sm whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.customerName}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Phone className="h-3 w-3" />
                    {order.customerPhone}
                  </div>
                </td>
                <td className="px-2 py-3 text-sm whitespace-nowrap">
                  <div className="space-y-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(order.orderType)}`}>
                      {order.orderType}
                    </span>
                    <br />
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <br />
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                      {order.priority}
                    </span>
                  </div>
                </td>
                <td className="px-2 py-3 text-sm whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatDate(order.scheduledDate)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatTime(order.scheduledDate)}
                  </div>
                  {order.actualDate && (
                    <div className="text-xs text-green-600">
                      تم: {formatTime(order.actualDate)}
                    </div>
                  )}
                </td>
                <td className="px-2 py-3 text-sm whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.equipmentType}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.equipmentQuantity} قطعة
                  </div>
                  <div className="text-xs text-gray-500">
                    {order.orderType}
                  </div>
                </td>
                <td className="px-2 py-3 text-sm whitespace-nowrap">
                  {order.driverName ? (
                    <>
                      <div className="text-sm font-medium text-gray-900">
                        {order.driverName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.vehicleNumber}
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-400">
                      لم يتم تعيين
                    </div>
                  )}
                </td>
                <td className="px-2 py-3 text-sm whitespace-nowrap">
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => onOpenDetails?.(order.orderNumber)}
                      className="text-[#58d2c8] hover:text-[#4AB8B3] transition-colors p-1"
                      title="عرض التفاصيل"
                    >
                      <Eye className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => onEditOrder?.(order)}
                      className="text-blue-600 hover:text-blue-700 transition-colors p-1"
                      title="تعديل"
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => onPrintOrder?.(order)}
                      className="text-green-600 hover:text-green-700 transition-colors p-1"
                      title="طباعة"
                    >
                      <Printer className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => onDeleteOrder?.(order)}
                      className="text-red-600 hover:text-red-700 transition-colors p-1"
                      title="حذف"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>

      {/* رسالة عدم وجود نتائج */}
      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <Truck className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد أوامر توصيل</h3>
          <p className="mt-1 text-sm text-gray-500">
            لم يتم العثور على أوامر توصيل تطابق معايير البحث المحددة.
          </p>
        </div>
      )}
    </div>
  );
}
