/**
 * مكونات الشاشات المنبثقة لتتبع الشحن
 */

'use client';

import React from 'react';
import { X, MapPin, Clock, User, Phone, Package, Truck, Navigation } from 'lucide-react';
import { ShippingTrackingData } from '@/data/operationsData';

interface TrackingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tracking: ShippingTrackingData | null;
}

export function TrackingDetailsModal({ isOpen, onClose, tracking }: TrackingDetailsModalProps) {
  if (!isOpen || !tracking) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 text-[#58d2c8]" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              تفاصيل التتبع
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* معلومات أساسية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">رقم التتبع</h3>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{tracking.trackingNumber}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">رقم الطلب</h3>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{tracking.orderNumber}</p>
            </div>
          </div>

          {/* معلومات العميل */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              معلومات العميل
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">اسم العميل</p>
                <p className="font-medium text-gray-900 dark:text-white">{tracking.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">العنوان</p>
                <p className="font-medium text-gray-900 dark:text-white">{tracking.currentLocation.address}</p>
              </div>
            </div>
          </div>

          {/* معلومات السائق */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
              <Truck className="h-4 w-4" />
              معلومات السائق والمركبة
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">اسم السائق</p>
                <p className="font-medium text-gray-900 dark:text-white">{tracking.driverName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">رقم الهاتف</p>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <p className="font-medium text-gray-900 dark:text-white">{tracking.driverPhone}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">رقم المركبة</p>
                <p className="font-medium text-gray-900 dark:text-white">{tracking.vehicleNumber}</p>
              </div>
            </div>
          </div>

          {/* معلومات الشحنة */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
              <Package className="h-4 w-4" />
              معلومات الشحنة
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">نوع المعدات</p>
                <p className="font-medium text-gray-900 dark:text-white">{tracking.equipmentType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">الكمية</p>
                <p className="font-medium text-gray-900 dark:text-white">{tracking.equipmentQuantity} قطعة</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">الحالة</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  tracking.status === 'قيد التوصيل' ? 'bg-blue-100 text-blue-800' :
                  tracking.status === 'تم التسليم' ? 'bg-green-100 text-green-800' :
                  tracking.status === 'متأخر' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {tracking.status}
                </span>
              </div>
            </div>
          </div>

          {/* التوقيت */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              التوقيت
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">آخر تحديث</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(tracking.updatedAt).toLocaleString('ar-SA')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">الوصول المتوقع</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(tracking.estimatedArrival).toLocaleString('ar-SA')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  tracking: ShippingTrackingData | null;
}

export function MapModal({ isOpen, onClose, tracking }: MapModalProps) {
  if (!isOpen || !tracking) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <MapPin className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              موقع الشحنة على الخريطة
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* معلومات الموقع */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">رقم التتبع</h3>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{tracking.trackingNumber}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">العميل</h3>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{tracking.customerName}</p>
            </div>
          </div>

          {/* العنوان */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              العنوان الحالي
            </h3>
            <p className="text-gray-900 dark:text-white">{tracking.currentLocation.address}</p>
          </div>

          {/* الإحداثيات */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">الإحداثيات</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">خط العرض</p>
                <p className="font-mono text-gray-900 dark:text-white">{tracking.currentLocation.coordinates.lat}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">خط الطول</p>
                <p className="font-mono text-gray-900 dark:text-white">{tracking.currentLocation.coordinates.lng}</p>
              </div>
            </div>
          </div>

          {/* الخريطة المزيفة */}
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 text-center">
            <MapPin className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">خريطة تفاعلية</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              هنا ستظهر الخريطة التفاعلية مع موقع الشحنة الحالي
            </p>
            <div className="bg-white dark:bg-gray-600 rounded-lg p-4 inline-block">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                الإحداثيات: {tracking.currentLocation.coordinates.lat}, {tracking.currentLocation.coordinates.lng}
              </p>
            </div>
          </div>

          {/* معلومات إضافية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">السائق</h3>
              <p className="text-gray-900 dark:text-white">{tracking.driverName}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">رقم المركبة</h3>
              <p className="text-gray-900 dark:text-white">{tracking.vehicleNumber}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}

interface UpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  tracking: ShippingTrackingData | null;
  onUpdate: (newStatus: string) => void;
}

export function UpdateStatusModal({ isOpen, onClose, tracking, onUpdate }: UpdateStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = React.useState('');
  const [notes, setNotes] = React.useState('');

  React.useEffect(() => {
    if (tracking) {
      setSelectedStatus(tracking.status);
    }
  }, [tracking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStatus && tracking) {
      onUpdate(selectedStatus);
      onClose();
      setNotes('');
    }
  };

  if (!isOpen || !tracking) return null;

  const statusOptions = [
    { value: 'في المستودع', label: 'في المستودع', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'قيد التوصيل', label: 'قيد التوصيل', color: 'bg-blue-100 text-blue-800' },
    { value: 'تم التسليم', label: 'تم التسليم', color: 'bg-green-100 text-green-800' },
    { value: 'متأخر', label: 'متأخر', color: 'bg-red-100 text-red-800' },
    { value: 'ملغاة', label: 'ملغاة', color: 'bg-gray-100 text-gray-800' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Navigation className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              تحديث حالة الشحنة
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* معلومات الشحنة */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">رقم التتبع</h3>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{tracking.trackingNumber}</p>
          </div>

          {/* الحالة الحالية */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الحالة الحالية
            </label>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                tracking.status === 'قيد التوصيل' ? 'bg-blue-100 text-blue-800' :
                tracking.status === 'تم التسليم' ? 'bg-green-100 text-green-800' :
                tracking.status === 'متأخر' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {tracking.status}
              </span>
            </div>
          </div>

          {/* الحالة الجديدة */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الحالة الجديدة
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* ملاحظات */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ملاحظات (اختياري)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="أضف أي ملاحظات حول التحديث..."
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              تحديث الحالة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
