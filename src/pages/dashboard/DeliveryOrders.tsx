/**
 * صفحة إدارة أوامر التوصيل
 */

import React, { useState } from 'react';
import { Truck, Package, Calendar, User, MapPin, Clock, Plus, BarChart3, TrendingUp, FileText, Eye, ExternalLink } from 'lucide-react';
import { DeliveryOrdersTable } from '@/components/features/DeliveryOrdersTable';
import DeliveryOrderForm from '@/components/features/DeliveryOrderForm';
import { DeliveryOrderFormData } from '@/components/features/DeliveryOrderForm';
import { mockDeliveryOrdersData, deliveryOrdersStats, DeliveryOrderData } from '@/data/operationsData';
import { mockDeliveryReceiptData } from '@/data/deliveryReceiptData';

type ViewMode = 'list' | 'form' | 'details';

export default function DeliveryOrders() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrderData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // معالجة إنشاء أمر توصيل جديد
  const handleAddOrder = () => {
    setSelectedOrder(null);
    setViewMode('form');
  };

  // معالجة حفظ أمر التوصيل
  const handleSaveOrder = async (data: DeliveryOrderFormData) => {
    setIsLoading(true);
    try {
      // محاكاة حفظ البيانات
      new Promise(resolve => setTimeout(resolve, 1000));
      console.log('حفظ أمر التوصيل:', data);
      setIsLoading(false);
      setViewMode('list');
      alert('تم حفظ أمر التوصيل بنجاح');
    } catch (error) {
      console.error('خطأ في حفظ أمر التوصيل:', error);
      setIsLoading(false);
      alert('حدث خطأ في حفظ أمر التوصيل');
    }
  };

  // إغلاق النموذج
  const handleCloseForm = () => {
    setViewMode('list');
  };

  // معالجة عرض تفاصيل الطلب
  const handleViewOrder = (order: DeliveryOrderData) => {
    setSelectedOrder(order);
    setViewMode('details');
  };

  // معالجة فتح صفحة تفاصيل أمر التوصيل
  const handleOpenOrderDetails = (orderNumber: string) => {
    // حفظ رقم الأمر في localStorage لاستخدامه في صفحة التفاصيل
    localStorage.setItem('selectedOrderNumber', orderNumber);
    window.location.href = `/dashboard/delivery-orders-details`;
  };

  // معالجة تعديل الطلب
  const handleEditOrder = (order: DeliveryOrderData) => {
    setSelectedOrder(order);
    setViewMode('form');
  };

  // معالجة حذف الطلب
  const handleDeleteOrder = async (order: DeliveryOrderData) => {
    if (window.confirm(`هل أنت متأكد من حذف طلب التوصيل "${order.orderNumber}"؟`)) {
      setIsLoading(true);
      try {
        console.log('حذف طلب التوصيل:', order.orderNumber);
        setTimeout(() => {
          setIsLoading(false);
          alert(`تم حذف طلب التوصيل "${order.orderNumber}" بنجاح`);
        }, 1000);
      } catch (error) {
        console.error('خطأ في حذف طلب التوصيل:', error);
        setIsLoading(false);
        alert('حدث خطأ في حذف طلب التوصيل');
      }
    }
  };

  // معالجة طباعة الطلب
  const handlePrintOrder = (order: DeliveryOrderData) => {
    console.log('طباعة طلب التوصيل:', order.orderNumber);
    window.print();
  };

  // العثور على سندات الاستلام المرتبطة بأمر التسليم
  const _getRelatedReceipts = (orderNumber: string) => {
    return mockDeliveryReceiptData.filter(receipt => 
      receipt.relatedOrders?.includes(orderNumber)
    );
  };

  // معالجة عرض سند الاستلام
  const handleViewReceipt = (receiptNumber: string) => {
    console.log('عرض سند الاستلام:', receiptNumber);
    // يمكن إضافة التنقل إلى صفحة سند الاستلام هنا
    window.open(`/dashboard/delivery-receipt?receipt=${receiptNumber}`, '_blank');
  };

  // عرض النموذج
  if (viewMode === 'form') {
    return (
      <DeliveryOrderForm
        onSubmit={handleSaveOrder}
        onCancel={handleCloseForm}
        initialData={selectedOrder ? {
          orderNumber: selectedOrder.orderNumber,
          customerName: selectedOrder.customerName,
          customerPhone: selectedOrder.customerPhone,
          deliveryAddress: selectedOrder.customerAddress || '',
          deliveryDate: selectedOrder.scheduledDate || new Date().toISOString().split('T')[0],
          priority: selectedOrder.priority === 'عادية' ? 'medium' : selectedOrder.priority === 'عالية' ? 'high' : 'urgent',
          status: selectedOrder.status === 'معلق' ? 'pending' : selectedOrder.status === 'قيد التنفيذ' ? 'in_progress' : selectedOrder.status === 'مكتمل' ? 'delivered' : 'cancelled',
          notes: selectedOrder.notes
        } : undefined}
        isLoading={isLoading}
        title={selectedOrder ? 'تعديل أمر التوصيل' : 'إنشاء أمر توصيل جديد'}
        description={selectedOrder ? 'تعديل بيانات أمر التوصيل' : 'إنشاء أمر توصيل جديد للعميل'}
      />
    );
  }

  // عرض التفاصيل
  if (viewMode === 'details' && selectedOrder) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              أمر التوصيل
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {selectedOrder.orderNumber}
            </p>
          </div>
          <button
            onClick={() => setViewMode('list')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            العودة
          </button>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">
            تفاصيل أمر التوصيل ستظهر هنا مع معلومات العميل والمعدات
          </p>
        </div>
      </div>
    );
  }

  // العرض الافتراضي - قائمة أوامر التوصيل
  return (
    <div className="space-y-6">
      {/* أزرار الوصول السريع */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          <h2 className="text-xl font-semibold">أوامر التوصيل</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddOrder}
            className="flex items-center gap-2 bg-[#58d2c8] hover:bg-[#4bb8ad] text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            إنشاء أمر توصيل جديد
          </button>
        </div>
      </div>

      {/* إحصائيات أوامر التوصيل */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          <h2 className="text-xl font-semibold">إحصائيات أوامر التوصيل</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* الأوامر المعلقة */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[120px]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm text-gray-600 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
                  الأوامر المعلقة
                </h3>
                <div className="text-2xl font-bold text-[#58d2c8] group-hover:text-[#4AB8B3] transition-colors duration-300 font-tajawal">
                  {deliveryOrdersStats.pendingOrders}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {deliveryOrdersStats.deliveryOrders} توصيل، {deliveryOrdersStats.returnOrders} استرجاع
                </p>
              </div>
              <div className="p-2 bg-[#58d2c8]/10 rounded-lg group-hover:bg-[#58d2c8]/20 transition-all duration-300">
                <Clock className="h-6 w-6 text-[#58d2c8] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </div>

          {/* الأوامر قيد التنفيذ */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[120px]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm text-gray-600 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
                  قيد التنفيذ
                </h3>
                <div className="text-2xl font-bold text-[#58d2c8] group-hover:text-[#4AB8B3] transition-colors duration-300 font-tajawal">
                  {deliveryOrdersStats.inProgressOrders}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {deliveryOrdersStats.highPriorityOrders} عالية الأولوية
                </p>
              </div>
              <div className="p-2 bg-[#58d2c8]/10 rounded-lg group-hover:bg-[#58d2c8]/20 transition-all duration-300">
                <Truck className="h-6 w-6 text-[#58d2c8] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </div>

          {/* الأوامر المكتملة */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[120px]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm text-gray-600 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
                  المكتملة
                </h3>
                <div className="text-2xl font-bold text-[#58d2c8] group-hover:text-[#4AB8B3] transition-colors duration-300 font-tajawal">
                  {deliveryOrdersStats.completedOrders}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round(deliveryOrdersStats.averageDeliveryTime)} دقيقة متوسط
                </p>
              </div>
              <div className="p-2 bg-[#58d2c8]/10 rounded-lg group-hover:bg-[#58d2c8]/20 transition-all duration-300">
                <Package className="h-6 w-6 text-[#58d2c8] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </div>

          {/* الأوامر المتأخرة */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[120px]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm text-gray-600 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
                  المتأخرة
                </h3>
                <div className="text-2xl font-bold text-[#58d2c8] group-hover:text-[#4AB8B3] transition-colors duration-300 font-tajawal">
                  {deliveryOrdersStats.delayedOrders}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  تحتاج متابعة عاجلة
                </p>
              </div>
              <div className="p-2 bg-[#58d2c8]/10 rounded-lg group-hover:bg-[#58d2c8]/20 transition-all duration-300">
                <Clock className="h-6 w-6 text-[#58d2c8] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* جدول أوامر التوصيل */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <h2 className="text-xl font-semibold">جدول أوامر التوصيل</h2>
        </div>
        <DeliveryOrdersTable
          data={mockDeliveryOrdersData}
          onViewOrder={handleViewOrder}
          onEditOrder={handleEditOrder}
          onDeleteOrder={handleDeleteOrder}
          onPrintOrder={handlePrintOrder}
          onOpenDetails={handleOpenOrderDetails}
          isLoading={isLoading}
        />
      </div>

      {/* ميزات إدارة أوامر التوصيل */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          <h2 className="text-xl font-semibold">ميزات أوامر التوصيل</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* تفاصيل المعدات */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">تفاصيل المعدات</h3>
                <p className="text-sm text-gray-600">معلومات شاملة عن المعدات</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>نوع المعدة</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>العدد المتاح</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>حالة المعدة</span>
              </div>
            </div>
          </div>

          {/* معلومات العميل */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">معلومات العميل</h3>
                <p className="text-sm text-gray-600">بيانات العميل وجهة التوصيل</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>اسم العميل</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>رقم الهاتف</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>العنوان</span>
              </div>
            </div>
          </div>

          {/* تاريخ التسليم/الاسترجاع */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">تاريخ التسليم/الاسترجاع</h3>
                <p className="text-sm text-gray-600">جدولة المواعيد والمتابعة</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>تاريخ التسليم المحدد</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>تاريخ الاسترجاع المتوقع</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>تذكير تلقائي</span>
              </div>
            </div>
          </div>

          {/* إنشاء أوامر التوصيل */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Truck className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">إنشاء أوامر التوصيل</h3>
                <p className="text-sm text-gray-600">إنشاء ومتابعة أوامر التوصيل</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>إنشاء أمر توصيل جديد</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>تتبع حالة الأوامر</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>إرسال طلب تلقائي</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* ملاحظة مهمة */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-900">ربط أقسام النظام</h4>
              <p className="text-sm text-blue-700 mt-1">
                يربط بين قسم المبيعات وقسم التشغيل لضمان تنفيذ أوامر التوصيل بكفاءة عالية
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* سندات الاستلام المرتبطة */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <h2 className="text-xl font-semibold">سندات الاستلام المرتبطة</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockDeliveryReceiptData.slice(0, 3).map((receipt) => (
            <div key={receipt.receiptNumber} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900 text-sm">{receipt.receiptNumber}</span>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  receipt.status === 'completed' ? 'bg-green-100 text-green-800' :
                  receipt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {receipt.status === 'completed' ? 'مكتمل' : 
                   receipt.status === 'pending' ? 'معلق' : 'ملغي'}
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p><strong>العميل:</strong> {receipt.customerName}</p>
                <p><strong>التاريخ:</strong> {new Date(receipt.deliveryDate).toLocaleDateString('ar-SA')}</p>
                <p><strong>عدد الأصناف:</strong> {receipt.totalItems}</p>
                {receipt.receiverName && (
                  <p><strong>المستلم:</strong> {receipt.receiverName}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleViewReceipt(receipt.receiptNumber)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <Eye className="h-4 w-4" />
                  عرض السند
                </button>
                <button
                  onClick={() => {
                    window.open(`/dashboard/delivery-receipt?receipt=${receipt.receiptNumber}&print=true`, '_blank');
                  }}
                  className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  <FileText className="h-4 w-4" />
                  طباعة
                </button>
                {receipt.relatedOrders && receipt.relatedOrders.length > 0 && (
                  <button
                    onClick={() => handleOpenOrderDetails(receipt.relatedOrders![0])}
                    className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    <ExternalLink className="h-4 w-4" />
                    أمر التوصيل
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* رابط إلى صفحة سندات الاستلام */}
        <div className="text-center">
          <button
            onClick={() => window.open('/dashboard/delivery-receipt', '_blank')}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            عرض جميع سندات الاستلام →
          </button>
        </div>
      </div>
    </div>
  );
}
