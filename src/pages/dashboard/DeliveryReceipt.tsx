/**
 * صفحة سند الاستلام - إدارة سندات استلام البضاعة
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DeliveryStats } from '@/components/features/DeliveryStats';
import { DeliveriesTable } from '@/components/features/DeliveriesTable';
import DeliveryForm from '@/components/features/DeliveryForm';
import DeliveryDetails from '@/components/features/DeliveryDetails';
import DeliveryReceiptDocument from '@/components/features/DeliveryReceiptDocument';
import DeliveryReceiptEditForm from '@/components/features/DeliveryReceiptEditForm';
import { mockDeliveryStats, mockDeliveryTableData } from '@/data/deliveriesData';
import { mockDeliveryReceiptData } from '@/data/deliveryReceiptData';
import { DeliveryTableData } from '@/lib/types/delivery';
import { DeliveryReceiptData } from '@/components/features/DeliveryReceiptDocument';
import { PackageCheck, TrendingUp, FileText, Eye, Plus } from 'lucide-react';

type ViewMode = 'list' | 'form' | 'details' | 'receipt' | 'edit';

export default function DeliveryReceiptPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryTableData | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<DeliveryReceiptData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();

  // معالجة URL parameters
  useEffect(() => {
    const receiptParam = searchParams.get('receipt');
    const printParam = searchParams.get('print');
    
    if (receiptParam) {
      const receipt = mockDeliveryReceiptData.find(r => r.receiptNumber === receiptParam);
      if (receipt) {
        setSelectedReceipt(receipt);
        setViewMode('receipt');
        
        // طباعة تلقائية إذا كان معامل print=true
        if (printParam === 'true') {
          setTimeout(() => {
            window.print();
          }, 1000);
        }
      }
    }
  }, [searchParams]);

  // معالجة إضافة إيصال تسليم جديد
  const handleAddDelivery = () => {
    setSelectedDelivery(null);
    setViewMode('form');
  };

  // معالجة تعديل إيصال تسليم
  const handleEditDelivery = (delivery: DeliveryTableData) => {
    setSelectedDelivery(delivery);
    setViewMode('form');
  };

  // معالجة حذف إيصال تسليم
  const handleDeleteDelivery = async (delivery: DeliveryTableData) => {
    if (window.confirm(`هل أنت متأكد من حذف إيصال التسليم "${delivery.receiptNumber}"؟`)) {
      setIsLoading(true);
      try {
        // هنا سيتم استدعاء API لحذف إيصال التسليم
        console.log('حذف إيصال التسليم:', delivery.id);
        setTimeout(() => {
          setIsLoading(false);
          alert('تم حذف إيصال التسليم بنجاح');
        }, 1000);
      } catch (error) {
        console.error('خطأ في حذف إيصال التسليم:', error);
        setIsLoading(false);
        alert('حدث خطأ في حذف إيصال التسليم');
      }
    }
  };

  // معالجة عرض تفاصيل إيصال التسليم
  const handleViewDelivery = (delivery: DeliveryTableData) => {
    setSelectedDelivery(delivery);
    setViewMode('details');
  };

  // معالجة حفظ إيصال التسليم
  const handleSaveDelivery = async (delivery: DeliveryTableData) => {
    setIsLoading(true);
    try {
      // هنا سيتم استدعاء API لحفظ إيصال التسليم
      console.log('حفظ إيصال التسليم:', delivery);
      setTimeout(() => {
        setIsLoading(false);
        setViewMode('list');
        alert('تم حفظ إيصال التسليم بنجاح');
      }, 1000);
    } catch (error) {
      console.error('خطأ في حفظ إيصال التسليم:', error);
      setIsLoading(false);
      alert('حدث خطأ في حفظ إيصال التسليم');
    }
  };

  // معالجة إغلاق النموذج
  const handleCloseForm = () => {
    setViewMode('list');
    setSelectedDelivery(null);
  };

  // معالجة تصدير قائمة إيصالات التسليم
  const handleExportDeliveries = () => {
    console.log('تصدير قائمة إيصالات التسليم');
    alert('تم تصدير قائمة إيصالات التسليم بنجاح');
  };

  // معالجة عرض سند الاستلام
  const _handleViewReceipt = (delivery: DeliveryTableData) => {
    const receipt = mockDeliveryReceiptData.find(r => r.receiptNumber === delivery.receiptNumber);
    if (receipt) {
      setSelectedReceipt(receipt);
      setViewMode('receipt');
    } else {
      alert('لم يتم العثور على سند الاستلام');
    }
  };

  // معالجة إنشاء سند استلام جديد
  const _handleCreateReceipt = (delivery: DeliveryTableData) => {
    // إنشاء سند استلام جديد من بيانات التسليم
    const newReceipt: DeliveryReceiptData = {
      receiptNumber: delivery.receiptNumber,
      deliveryDate: delivery.deliveryDate,
      customerName: delivery.customerName,
      customerPhone: '+966501234567', // رقم وهمي
      deliveryAddress: delivery.deliveryAddress,
      driverName: delivery.driverName,
      driverPhone: '+966501234568', // رقم وهمي
      items: [
        {
          id: '1',
          name: 'معدات متعددة',
          quantity: delivery.itemsCount,
          condition: 'good',
          notes: 'يتم تحديث القائمة عند إنشاء السند'
        }
      ],
      totalItems: delivery.itemsCount,
      status: delivery.status as 'pending' | 'completed' | 'cancelled',
      relatedOrders: [delivery.receiptNumber]
    };
    
    setSelectedReceipt(newReceipt);
    setViewMode('receipt');
  };

  // معالجة طباعة سند الاستلام
  const handlePrintReceipt = () => {
    console.log('طباعة سند الاستلام:', selectedReceipt?.receiptNumber);
    window.print();
  };

  // معالجة تحميل سند الاستلام
  const handleDownloadReceipt = () => {
    console.log('تحميل سند الاستلام:', selectedReceipt?.receiptNumber);
    alert('سيتم تحميل سند الاستلام كـ PDF قريباً');
  };

  // معالجة تعديل سند الاستلام
  const handleEditReceipt = () => {
    console.log('تعديل سند الاستلام:', selectedReceipt?.receiptNumber);
    setViewMode('edit');
  };

  // معالجة حفظ التعديلات
  const handleSaveReceiptEdit = async (updatedData: DeliveryReceiptData) => {
    setIsLoading(true);
    try {
      // محاكاة حفظ البيانات
      new Promise(resolve => setTimeout(resolve, 1000));
      console.log('حفظ تعديلات سند الاستلام:', updatedData);
      
      // تحديث البيانات المحلية
      setSelectedReceipt(updatedData);
      setIsLoading(false);
      setViewMode('receipt');
      alert('تم حفظ التعديلات بنجاح');
    } catch (error) {
      console.error('خطأ في حفظ التعديلات:', error);
      setIsLoading(false);
      alert('حدث خطأ في حفظ التعديلات');
    }
  };

  // معالجة إلغاء التعديل
  const handleCancelReceiptEdit = () => {
    setViewMode('receipt');
  };

  // معالجة الرجوع للقائمة
  const handleBackToList = () => {
    setViewMode('list');
    setSelectedReceipt(null);
  };

  // معالجة تحديث التوقيعات
  const handleSignatureUpdate = (updatedReceipt: DeliveryReceiptData) => {
    setSelectedReceipt(updatedReceipt);
    // يمكن إضافة حفظ في قاعدة البيانات هنا
    console.log('تم تحديث التوقيعات:', updatedReceipt);
  };

  // عرض نموذج إيصال التسليم
  if (viewMode === 'form') {
    return (
      <DeliveryForm
        delivery={selectedDelivery}
        onSave={handleSaveDelivery}
        onCancel={handleCloseForm}
        isLoading={isLoading}
      />
    );
  }

  // عرض تفاصيل إيصال التسليم
  if (viewMode === 'details' && selectedDelivery) {
    return (
      <DeliveryDetails
        delivery={selectedDelivery}
        onClose={() => setViewMode('list')}
        onEdit={() => handleEditDelivery(selectedDelivery)}
      />
    );
  }

  // عرض نموذج التعديل
  if (viewMode === 'edit' && selectedReceipt) {
    return (
      <DeliveryReceiptEditForm
        data={selectedReceipt}
        onSave={handleSaveReceiptEdit}
        onCancel={handleCancelReceiptEdit}
        isLoading={isLoading}
      />
    );
  }

  // عرض سند الاستلام
  if (viewMode === 'receipt' && selectedReceipt) {
    return (
      <DeliveryReceiptDocument
        data={selectedReceipt}
        onPrint={handlePrintReceipt}
        onDownload={handleDownloadReceipt}
        onEdit={handleEditReceipt}
        onBack={handleBackToList}
        showActions={true}
        onSignatureUpdate={handleSignatureUpdate}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* عنوان الصفحة وأزرار الإجراءات */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PackageCheck className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">إيصال التسليم</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddDelivery}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            إضافة تسليم جديد
          </button>
        </div>
      </div>

      {/* إحصائيات التسليم */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <h2 className="text-xl font-semibold">إحصائيات التسليم</h2>
        </div>
        <DeliveryStats stats={mockDeliveryStats} />
      </div>

      {/* قائمة سندات الاستلام المتاحة */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <h2 className="text-xl font-semibold">إيصالات التسليم</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockDeliveryReceiptData.slice(0, 6).map((receipt) => (
            <div key={receipt.receiptNumber} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900">{receipt.receiptNumber}</span>
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
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedReceipt(receipt);
                    setViewMode('receipt');
                  }}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <Eye className="h-4 w-4" />
                  عرض السند
                </button>
                <button
                  onClick={() => {
                    setSelectedReceipt(receipt);
                    setViewMode('receipt');
                    setTimeout(() => window.print(), 100);
                  }}
                  className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  <FileText className="h-4 w-4" />
                  طباعة
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* جدول/قائمة إيصالات التسليم */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <h2 className="text-xl font-semibold">إيصالات التسليم</h2>
        </div>
        <DeliveriesTable
          data={mockDeliveryTableData || []}
          onAddDelivery={handleAddDelivery}
          onEditDelivery={handleEditDelivery}
          onDeleteDelivery={handleDeleteDelivery}
          onViewDelivery={handleViewDelivery}
          onExportDeliveries={handleExportDeliveries}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}