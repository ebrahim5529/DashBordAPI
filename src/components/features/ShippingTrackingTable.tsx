/**
 * مكون جدول تتبع الشحن
 */

'use client';

import React, { useState, useMemo } from 'react';
import { ShippingTrackingData } from '@/data/operationsData';
import { Search, Eye, MapPin, Truck, Package, Clock, User, Phone, Navigation } from 'lucide-react';
import { TrackingDetailsModal, MapModal, UpdateStatusModal } from './ShippingTrackingModals';

interface ShippingTrackingTableProps {
  data: ShippingTrackingData[];
  onViewTracking?: (tracking: ShippingTrackingData) => void;
  onViewMap?: (tracking: ShippingTrackingData) => void;
  onUpdateStatus?: (tracking: ShippingTrackingData) => void;
  isLoading?: boolean;
}

export function ShippingTrackingTable({
  data,
  onViewTracking,
  onViewMap,
  onUpdateStatus,
  isLoading = false
}: ShippingTrackingTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('الكل');
  const [typeFilter, setTypeFilter] = useState<string>('الكل');
  const [priorityFilter, setPriorityFilter] = useState<string>('الكل');
  const [sortBy, setSortBy] = useState<string>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Modal states
  const [selectedTracking, setSelectedTracking] = useState<ShippingTrackingData | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // تصفية وترتيب البيانات
  const filteredData = useMemo(() => {
    const filtered = data.filter(tracking => {
      const matchesSearch = 
        tracking.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tracking.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tracking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tracking.currentLocation.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tracking.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tracking.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'الكل' || tracking.status === statusFilter;
      const matchesType = typeFilter === 'الكل' || tracking.equipmentType === typeFilter;
      const matchesPriority = priorityFilter === 'الكل' || true; // لا توجد خاصية أولوية
      
      return matchesSearch && matchesStatus && matchesType && matchesPriority;
    });

    // ترتيب البيانات
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof ShippingTrackingData];
      let bValue: any = b[sortBy as keyof ShippingTrackingData];

      if (sortBy === 'updatedAt') {
        aValue = new Date(a.updatedAt).getTime();
        bValue = new Date(b.updatedAt).getTime();
      } else if (sortBy === 'estimatedArrival') {
        aValue = new Date(a.estimatedArrival).getTime();
        bValue = new Date(b.estimatedArrival).getTime();
      } else if (sortBy === 'route.totalDistance') {
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

  // Modal handlers
  const handleViewTracking = (tracking: ShippingTrackingData) => {
    setSelectedTracking(tracking);
    setIsDetailsModalOpen(true);
    onViewTracking?.(tracking);
  };

  const handleViewMap = (tracking: ShippingTrackingData) => {
    setSelectedTracking(tracking);
    setIsMapModalOpen(true);
    onViewMap?.(tracking);
  };

  const handleUpdateStatus = (tracking: ShippingTrackingData) => {
    setSelectedTracking(tracking);
    setIsUpdateModalOpen(true);
    onUpdateStatus?.(tracking);
  };

  const handleStatusUpdate = (newStatus: string) => {
    if (selectedTracking) {
      console.log(`تحديث حالة ${selectedTracking.trackingNumber} إلى: ${newStatus}`);
      alert(`تم تحديث حالة الشحنة ${selectedTracking.trackingNumber} إلى: ${newStatus}`);
    }
  };

  const closeModals = () => {
    setIsDetailsModalOpen(false);
    setIsMapModalOpen(false);
    setIsUpdateModalOpen(false);
    setSelectedTracking(null);
  };

  // الحصول على لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'قيد التوصيل': return 'bg-blue-100 text-blue-800';
      case 'مسلمة': return 'bg-green-100 text-green-800';
      case 'متأخرة': return 'bg-red-100 text-red-800';
      case 'ملغاة': return 'bg-gray-100 text-gray-800';
      case 'في المستودع': return 'bg-yellow-100 text-yellow-800';
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

  // الحصول على لون نوع الشحنة
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'توصيل': return 'bg-blue-100 text-blue-800';
      case 'استرجاع': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // تنسيق التاريخ
  const _formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  // تنسيق الوقت
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // حساب الوقت المتبقي
  const getTimeRemaining = (estimatedArrival: string) => {
    const now = new Date();
    const arrival = new Date(estimatedArrival);
    const diff = arrival.getTime() - now.getTime();
    
    if (diff <= 0) return 'متأخر';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}س ${minutes}د`;
    return `${minutes} دقيقة`;
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
                placeholder="البحث في رقم التتبع، اسم العميل، السائق، أو رقم المركبة..."
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
              <option value="قيد التوصيل">قيد التوصيل</option>
              <option value="مسلمة">مسلمة</option>
              <option value="متأخرة">متأخرة</option>
              <option value="ملغاة">ملغاة</option>
              <option value="في المستودع">في المستودع</option>
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
          عرض {filteredData.length} من أصل {data.length} شحنة
        </div>
      </div>

      {/* الجدول */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('trackingNumber')}
              >
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  رقم التتبع
                  {sortBy === 'trackingNumber' && (
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
                  العميل/الوجهة
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
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  السائق/المركبة
                </div>
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('estimatedArrival')}
              >
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  الوقت المتبقي/الموقع
                  {sortBy === 'estimatedArrival' && (
                    <span className="text-[#58d2c8]">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  المعدات/المسافة
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((tracking) => (
              <tr key={tracking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {tracking.trackingNumber}
                  </div>
                  <div className="text-sm text-gray-500">
                    {tracking.orderNumber}
                  </div>
                  <div className="text-xs text-gray-400">
                    آخر تحديث: {formatTime(tracking.updatedAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {tracking.customerName}
                  </div>
                  <div className="text-sm text-gray-500 max-w-xs truncate">
                    {tracking.currentLocation.address}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(tracking.equipmentType)}`}>
                      {tracking.equipmentType}
                    </span>
                    <br />
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tracking.status)}`}>
                      {tracking.status}
                    </span>
                    <br />
                    <div className="text-xs text-gray-500 mt-1">
                      {tracking.equipmentQuantity} قطعة
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {tracking.driverName}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Phone className="h-3 w-3" />
                    {tracking.driverPhone}
                  </div>
                  <div className="text-sm text-gray-500">
                    {tracking.vehicleNumber}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {tracking.status === 'تم التسليم' ? 'مكتملة' : getTimeRemaining(tracking.estimatedArrival)}
                  </div>
                  <div className="text-sm text-gray-500 max-w-xs truncate">
                    {tracking.currentLocation.address}
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatTime(tracking.estimatedArrival)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {tracking.equipmentQuantity} قطعة
                  </div>
                  <div className="text-sm text-gray-500">
                    {tracking.equipmentType}
                  </div>
                  <div className="text-xs text-gray-500">
                    {tracking.equipmentType}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewTracking(tracking)}
                      className="text-[#58d2c8] hover:text-[#4AB8B3] transition-colors"
                      title="عرض تفاصيل التتبع"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleViewMap(tracking)}
                      className="text-green-600 hover:text-green-700 transition-colors"
                      title="عرض على الخريطة"
                    >
                      <MapPin className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(tracking)}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                      title="تحديث الحالة"
                    >
                      <Navigation className="h-4 w-4" />
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
          <Truck className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد شحنات</h3>
          <p className="mt-1 text-sm text-gray-500">
            لم يتم العثور على شحنات تطابق معايير البحث المحددة.
          </p>
        </div>
      )}

      {/* Modals */}
      <TrackingDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={closeModals}
        tracking={selectedTracking}
      />
      
      <MapModal
        isOpen={isMapModalOpen}
        onClose={closeModals}
        tracking={selectedTracking}
      />
      
      <UpdateStatusModal
        isOpen={isUpdateModalOpen}
        onClose={closeModals}
        tracking={selectedTracking}
        onUpdate={handleStatusUpdate}
      />
    </div>
  );
}
