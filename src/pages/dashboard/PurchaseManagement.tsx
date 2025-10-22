/**
 * صفحة إدارة عمليات الشراء
 */

import React, { useState } from 'react';
import { PurchaseRequestStats } from '@/components/features/PurchaseRequestStats';
import { PurchaseRequestsTable } from '@/components/features/PurchaseRequestsTable';
import { PurchaseRequestForm } from '@/components/features/PurchaseRequestForm';
import { PurchaseRequestDetails } from '@/components/features/PurchaseRequestDetails';
import { mockPurchaseRequestStats, mockPurchaseRequestTableData } from '@/data/financialData';
import { PurchaseRequestTableData } from '@/lib/types/financial';
import { BarChart3, TrendingUp, ShoppingCart, Plus } from 'lucide-react';

type ViewMode = 'list' | 'form' | 'details';

export default function PurchaseManagementPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedPurchaseRequest, setSelectedPurchaseRequest] = useState<PurchaseRequestTableData | null>(null);
  const [_isLoading, _setIsLoading] = useState(false);

  // معالجة إضافة طلب شراء جديد
  const handleAddPurchaseRequest = () => {
    setSelectedPurchaseRequest(null);
    setViewMode('form');
  };

  // معالجة تعديل طلب شراء
  const handleEditPurchaseRequest = (request: PurchaseRequestTableData) => {
    setSelectedPurchaseRequest(request);
    setViewMode('form');
  };

  // معالجة حذف طلب شراء
  const handleDeletePurchaseRequest = async (request: PurchaseRequestTableData) => {
    if (window.confirm(`هل أنت متأكد من حذف طلب الشراء "${request.requestNumber}"؟`)) {
      _setIsLoading(true);
      try {
        // هنا سيتم استدعاء API لحذف طلب الشراء
        console.log('حذف طلب الشراء:', request.id);
        // إعادة تحميل البيانات
        setTimeout(() => {
          _setIsLoading(false);
          alert('تم حذف طلب الشراء بنجاح');
        }, 1000);
      } catch (error) {
        console.error('خطأ في حذف طلب الشراء:', error);
        _setIsLoading(false);
        alert('حدث خطأ في حذف طلب الشراء');
      }
    }
  };

  // معالجة اعتماد طلب شراء
  const handleApprovePurchaseRequest = async (request: PurchaseRequestTableData) => {
    if (window.confirm(`هل أنت متأكد من اعتماد طلب الشراء "${request.requestNumber}"؟`)) {
      _setIsLoading(true);
      try {
        // هنا سيتم استدعاء API لاعتماد طلب الشراء
        console.log('اعتماد طلب الشراء:', request.id);
        setTimeout(() => {
          _setIsLoading(false);
          alert('تم اعتماد طلب الشراء بنجاح');
        }, 1000);
      } catch (error) {
        console.error('خطأ في اعتماد طلب الشراء:', error);
        _setIsLoading(false);
        alert('حدث خطأ في اعتماد طلب الشراء');
      }
    }
  };

  // معالجة تصدير طلب الشراء
  const handleExportPurchaseRequest = (request: PurchaseRequestTableData) => {
    alert(`سيتم تصدير طلب الشراء: ${request.requestNumber}`);
  };

  // معالجة طباعة طلب الشراء
  const handlePrintPurchaseRequest = (request: PurchaseRequestTableData) => {
    alert(`سيتم طباعة طلب الشراء: ${request.requestNumber}`);
  };

  // معالجة عرض تفاصيل طلب الشراء
  const handleViewPurchaseRequest = (request: PurchaseRequestTableData) => {
    setSelectedPurchaseRequest(request);
    setViewMode('details');
  };

  // معالجة تصدير طلبات الشراء
  const handleExportPurchaseRequests = () => {
    alert('سيتم تصدير جميع طلبات الشراء');
  };

  // معالجة حفظ طلب الشراء
  const handleSavePurchaseRequest = async (data: any) => {
    _setIsLoading(true);
    try {
      // محاكاة حفظ طلب الشراء
      new Promise(resolve => setTimeout(resolve, 2000));
      console.log('حفظ طلب الشراء:', data);
      _setIsLoading(false);
      setViewMode('list');
      alert('تم إرسال طلب الشراء بنجاح');
    } catch (error) {
      console.error('خطأ في حفظ طلب الشراء:', error);
      _setIsLoading(false);
      alert('حدث خطأ في حفظ طلب الشراء');
    }
  };

  // عرض النموذج
  if (viewMode === 'form') {
    return (
      <PurchaseRequestForm
        onSubmit={handleSavePurchaseRequest}
        onCancel={() => setViewMode('list')}
        initialData={selectedPurchaseRequest}
        isLoading={_isLoading}
      />
    );
  }

  // عرض التفاصيل
  if (viewMode === 'details' && selectedPurchaseRequest) {
    return (
      <PurchaseRequestDetails
        request={selectedPurchaseRequest}
        onBack={() => setViewMode('list')}
        onEdit={handleEditPurchaseRequest}
        onApprove={handleApprovePurchaseRequest}
        onExport={handleExportPurchaseRequest}
        onPrint={handlePrintPurchaseRequest}
      />
    );
  }

  // العرض الافتراضي - قائمة طلبات الشراء
  return (
    <div className="space-y-6">
      {/* أزرار الوصول السريع */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          <h2 className="text-xl font-semibold">عمليات الشراء</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddPurchaseRequest}
            className="flex items-center gap-2 bg-[#58d2c8] hover:bg-[#4bb8ad] text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            طلب شراء جديد
          </button>
        </div>
      </div>

      {/* إحصائيات طلبات الشراء */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          <h2 className="text-xl font-semibold">إحصائيات طلبات الشراء</h2>
        </div>
        <PurchaseRequestStats stats={mockPurchaseRequestStats} />
      </div>

      {/* جدول طلبات الشراء */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <h2 className="text-xl font-semibold">طلبات الشراء</h2>
        </div>
        <PurchaseRequestsTable
          data={mockPurchaseRequestTableData || []}
          onAddPurchaseRequest={handleAddPurchaseRequest}
          onEditPurchaseRequest={handleEditPurchaseRequest}
          onDeletePurchaseRequest={handleDeletePurchaseRequest}
          onViewPurchaseRequest={handleViewPurchaseRequest}
          onApprovePurchaseRequest={handleApprovePurchaseRequest}
          onExportPurchaseRequests={handleExportPurchaseRequests}
        />
      </div>
    </div>
  );
}
