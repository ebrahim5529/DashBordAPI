/**
 * صفحة قائمة المشتريات
 * تعرض فواتير المشتريات وسجل المشتريات مع الإحصائيات
 */

import React, { useState } from 'react';
import { PurchaseInvoicesStats } from '@/components/features/PurchaseInvoicesStats';
import { PurchasesTable } from '@/components/features/PurchasesTable';
import { PurchaseItemsTable } from '@/components/features/PurchaseItemsTable';
import PurchaseForm from '@/components/features/PurchaseForm';
import { 
  purchaseInvoices, 
  purchaseItems, 
  purchaseStats 
} from '@/data/purchasesData';
import { mockPurchaseTableData } from '@/data/purchaseData';
import { PurchaseInvoice, PurchaseDetailItem } from '@/lib/types/purchases';
import { PurchaseFormData } from '@/components/features/PurchaseForm';
import { Button } from '@/components/shared/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import {
  Receipt,
  Package,
  BarChart3,
  FileText,
  Plus,
  Search,
  Download,
  Link,
  DollarSign,
} from 'lucide-react';

export default function PurchasesListPage() {
  const [activeTab, setActiveTab] = useState<'invoices' | 'items' | 'stats'>('invoices');
  const [selectedInvoice, setSelectedInvoice] = useState<PurchaseInvoice | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // معالجة عرض تفاصيل الفاتورة
  const _handleViewInvoice = (invoice: PurchaseInvoice) => {
    console.log('عرض تفاصيل الفاتورة:', invoice.invoiceNumber);
    setSelectedInvoice(invoice);
    // هنا يمكن فتح نافذة منبثقة أو الانتقال لصفحة التفاصيل
  };

  // معالجة تعديل الفاتورة
  const _handleEditInvoice = (invoice: PurchaseInvoice) => {
    console.log('تعديل الفاتورة:', invoice.invoiceNumber);
    // هنا يمكن فتح نموذج التعديل
  };

  // معالجة إضافة مشتريات جديدة
  const handleAddPurchase = () => {
    setShowForm(true);
  };

  // معالجة حفظ المشتريات
  const handleSavePurchase = async (data: PurchaseFormData) => {
    setIsLoading(true);
    try {
      // محاكاة حفظ البيانات
      new Promise(resolve => setTimeout(resolve, 1000));
      console.log('حفظ المشتريات:', data);
      setIsLoading(false);
      setShowForm(false);
      alert('تم حفظ المشتريات بنجاح');
    } catch (error) {
      console.error('خطأ في حفظ المشتريات:', error);
      setIsLoading(false);
      alert('حدث خطأ في حفظ المشتريات');
    }
  };

  // إغلاق النموذج
  const handleCloseForm = () => {
    setShowForm(false);
  };

  // معالجة عرض تفاصيل العنصر
  const handleViewItem = (item: PurchaseDetailItem) => {
    console.log('عرض تفاصيل العنصر:', item.itemName);
    // هنا يمكن فتح نافذة منبثقة أو الانتقال لصفحة التفاصيل
  };

  // فلترة العناصر حسب الفاتورة المحددة
  const filteredItems = selectedInvoice 
    ? purchaseItems.filter(item => item.invoiceId === selectedInvoice.id)
    : purchaseItems;

  const tabs = [
    {
      id: 'invoices' as const,
      label: 'فواتير المشتريات',
      icon: Receipt,
      count: purchaseInvoices.length,
    },
    {
      id: 'items' as const,
      label: 'سجل المشتريات',
      icon: Package,
      count: purchaseItems.length,
    },
    {
      id: 'stats' as const,
      label: 'الإحصائيات',
      icon: BarChart3,
    },
  ];

  // عرض النموذج
  if (showForm) {
    return (
      <PurchaseForm
        onSubmit={handleSavePurchase}
        onCancel={handleCloseForm}
        isLoading={isLoading}
        title="إضافة مشتريات جديدة"
        description="املأ البيانات التالية لإضافة مشتريات جديدة"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* العنوان والإجراءات الرئيسية */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">المشتريات</h1>
          <p className="text-gray-600">إدارة فواتير المشتريات وسجل المشتريات</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log('البحث المتقدم')}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            بحث متقدم
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log('تصدير البيانات')}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            تصدير
          </Button>
          <Button
            onClick={handleAddPurchase}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            إضافة مشتريات
          </Button>
        </div>
      </div>

      {/* الإجراءات السريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">عرض الفواتير</p>
                <p className="text-lg font-bold text-gray-900">{purchaseInvoices.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">عناصر المشتريات</p>
                <p className="text-lg font-bold text-gray-900">{purchaseItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Link className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">ربط بالمخزون</p>
                <p className="text-lg font-bold text-gray-900">متاح</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">ربط مالي</p>
                <p className="text-lg font-bold text-gray-900">متاح</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* التبويبات */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                    {tab.count !== undefined && (
                      <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* محتوى التبويبات */}
          {activeTab === 'invoices' && (
            <PurchasesTable
              data={mockPurchaseTableData}
              onAddPurchase={handleAddPurchase}
              onEditPurchase={() => {}}
              onDeletePurchase={() => {}}
              onViewPurchase={() => {}}
              onExportPurchases={() => {}}
            />
          )}

          {activeTab === 'items' && (
            <div className="space-y-4">
              {selectedInvoice && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-blue-900">
                        عرض عناصر الفاتورة: {selectedInvoice.invoiceNumber}
                      </h3>
                      <p className="text-sm text-blue-700">
                        المورد: {selectedInvoice.supplierName}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedInvoice(null)}
                    >
                      عرض جميع العناصر
                    </Button>
                  </div>
                </div>
              )}
              <PurchaseItemsTable
                data={filteredItems}
                onViewItem={handleViewItem}
              />
            </div>
          )}

          {activeTab === 'stats' && (
            <PurchaseInvoicesStats stats={purchaseStats} />
          )}
        </CardContent>
      </Card>

      {/* معلومات إضافية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              ملخص الفواتير
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">إجمالي الفواتير</span>
                <span className="font-semibold">{purchaseInvoices.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">إجمالي المبلغ</span>
                <span className="font-semibold">{purchaseStats.totalAmount.toLocaleString()} ر.ع.</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">المبلغ المدفوع</span>
                <span className="font-semibold text-green-600">{purchaseStats.paidAmount.toLocaleString()} ر.ع.</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">المبلغ المتبقي</span>
                <span className="font-semibold text-orange-600">{purchaseStats.pendingAmount.toLocaleString()} ر.ع.</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              ملخص المشتريات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">إجمالي العناصر</span>
                <span className="font-semibold">{purchaseItems.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">مستلمة</span>
                <span className="font-semibold text-green-600">
                  {purchaseItems.filter(item => item.status === 'مستلم').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">في الطريق</span>
                <span className="font-semibold text-blue-600">
                  {purchaseItems.filter(item => item.status === 'في الطريق').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">معلقة</span>
                <span className="font-semibold text-yellow-600">
                  {purchaseItems.filter(item => item.status === 'معلق').length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}