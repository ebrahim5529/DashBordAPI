/**
 * صفحة فحص المرتجعات
 */

import React, { useState } from 'react';
import { ReturnStats } from '@/components/features/ReturnStats';
import { ReturnsTable } from '@/components/features/ReturnsTable';
import ReturnForm from '@/components/features/ReturnForm';
import ReturnDetails from '@/components/features/ReturnDetails';
import { mockReturnStats, mockReturnTableData } from '@/data/returnsData';
import { mockDeliveryReceiptData } from '@/data/deliveryReceiptData';
import { ReturnTableData } from '@/lib/types/return';
import { RotateCcw, TrendingUp, FileText, Eye, Package, AlertTriangle } from 'lucide-react';

type ViewMode = 'list' | 'form' | 'details';

export default function ReturnInspectionPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedReturn, setSelectedReturn] = useState<ReturnTableData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // معالجة إضافة مرتجع جديد
  const handleAddReturn = () => {
    setSelectedReturn(null);
    setViewMode('form');
  };

  // معالجة تعديل مرتجع
  const handleEditReturn = (returnItem: ReturnTableData) => {
    setSelectedReturn(returnItem);
    setViewMode('form');
  };

  // معالجة حذف مرتجع
  const handleDeleteReturn = async (returnItem: ReturnTableData) => {
    if (window.confirm(`هل أنت متأكد من حذف المرتجع "${returnItem.itemName}"؟`)) {
      setIsLoading(true);
      try {
        // هنا سيتم استدعاء API لحذف المرتجع
        console.log('حذف المرتجع:', returnItem.id);
        setTimeout(() => {
          setIsLoading(false);
          alert('تم حذف المرتجع بنجاح');
        }, 1000);
      } catch (error) {
        console.error('خطأ في حذف المرتجع:', error);
        setIsLoading(false);
        alert('حدث خطأ في حذف المرتجع');
      }
    }
  };

  // معالجة عرض تفاصيل المرتجع
  const handleViewReturn = (returnItem: ReturnTableData) => {
    setSelectedReturn(returnItem);
    setViewMode('details');
  };

  // معالجة حفظ المرتجع
  const handleSaveReturn = async (returnItem: ReturnTableData) => {
    setIsLoading(true);
    try {
      // هنا سيتم استدعاء API لحفظ المرتجع
      console.log('حفظ المرتجع:', returnItem);
      setTimeout(() => {
        setIsLoading(false);
        setViewMode('list');
        alert('تم حفظ المرتجع بنجاح');
      }, 1000);
    } catch (error) {
      console.error('خطأ في حفظ المرتجع:', error);
      setIsLoading(false);
      alert('حدث خطأ في حفظ المرتجع');
    }
  };

  // معالجة إغلاق النموذج
  const handleCloseForm = () => {
    setViewMode('list');
    setSelectedReturn(null);
  };

  // معالجة تصدير قائمة المرتجعات
  const handleExportReturns = () => {
    console.log('تصدير قائمة المرتجعات');
    alert('تم تصدير قائمة المرتجعات بنجاح');
  };

  // العثور على سندات الاستلام المرتبطة بالمرتجعات
  const getRelatedReceipts = () => {
    return mockDeliveryReceiptData.filter(receipt => 
      receipt.items?.some(item => item.condition === 'damaged' || item.condition === 'missing')
    );
  };

  // معالجة عرض سند الاستلام
  const handleViewReceipt = (receiptNumber: string) => {
    console.log('عرض سند الاستلام:', receiptNumber);
    window.open(`/dashboard/delivery-receipt?receipt=${receiptNumber}`, '_blank');
  };

  // عرض نموذج المرتجع
  if (viewMode === 'form') {
    return (
      <ReturnForm
        returnItem={selectedReturn}
        onSave={handleSaveReturn}
        onCancel={handleCloseForm}
        isLoading={isLoading}
      />
    );
  }

  // عرض تفاصيل المرتجع
  if (viewMode === 'details' && selectedReturn) {
    return (
      <ReturnDetails
        returnItem={selectedReturn}
        onClose={() => setViewMode('list')}
        onEdit={() => handleEditReturn(selectedReturn)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* إحصائيات المرتجعات */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <RotateCcw className="h-5 w-5" />
          <h2 className="text-xl font-semibold">إحصائيات المرتجعات</h2>
        </div>
        <ReturnStats stats={mockReturnStats} />
      </div>

      {/* جدول/قائمة المرتجعات */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <h2 className="text-xl font-semibold">المرتجعات</h2>
        </div>
        <ReturnsTable
          data={mockReturnTableData || []}
          onAddReturn={handleAddReturn}
          onEditReturn={handleEditReturn}
          onDeleteReturn={handleDeleteReturn}
          onViewReturn={handleViewReturn}
          onExportReturns={handleExportReturns}
          isLoading={isLoading}
        />
      </div>

      {/* سندات الاستلام المرتبطة بالمرتجعات */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <h2 className="text-xl font-semibold">سندات الاستلام</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getRelatedReceipts().map((receipt) => (
            <div key={receipt.receiptNumber} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900 text-sm">{receipt.receiptNumber}</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <span className="text-xs text-orange-600 font-medium">يحتاج فحص</span>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p><strong>العميل:</strong> {receipt.customerName}</p>
                <p><strong>التاريخ:</strong> {new Date(receipt.deliveryDate).toLocaleDateString('ar-SA')}</p>
                <p><strong>عدد الأصناف:</strong> {receipt.totalItems}</p>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-orange-600" />
                  <span className="text-orange-600 font-medium">
                    {receipt.items?.filter(item => item.condition === 'damaged' || item.condition === 'missing').length || 0} صنف يحتاج فحص
                  </span>
                </div>
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
              </div>
            </div>
          ))}
        </div>
        
        {getRelatedReceipts().length === 0 && (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">لا توجد سندات استلام تحتوي على أصناف تحتاج فحص</p>
          </div>
        )}
        
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