/**
 * صفحة إدارة العملاء
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CustomerStats } from '@/components/features/CustomerStats';
import { CustomersTable } from '@/components/features/CustomersTable';
import CustomerForm from '@/components/features/CustomerForm';
import CustomerDetails from '@/components/features/CustomerDetails';
import { CustomerStatusManager } from './_components/CustomerStatusManager';
import { mockCustomerStats } from '@/data/customersData';
import { CustomerTableData, CustomerDetails as CustomerDetailsType } from '@/lib/types/customer';
import { BarChart3, TrendingUp, Settings } from 'lucide-react';
import * as customersService from '@/lib/services/customers.service';
import { useToast } from '@/hooks/use-toast';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

type ViewMode = 'list' | 'form' | 'details' | 'status';

export default function CustomerManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerTableData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState<CustomerTableData[]>([]);
  const [_customerStats, _setCustomerStats] = useState(mockCustomerStats);
  const [isClient, setIsClient] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<CustomerTableData | null>(null);

  // تحديد أن المكون تم تحميله في المتصفح
  useEffect(() => {
    setIsClient(true);
  }, []);

  // تحميل البيانات
  useEffect(() => {
    if (!isClient) return; // انتظار تحميل المكون في المتصفح
    
    loadCustomers();
  }, [isClient]);

  // دالة تحميل العملاء
  const loadCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await customersService.getCustomers();
      
      if (response.success) {
        // تحويل بيانات Laravel إلى تنسيق الجدول
        const customersData = response.data.data.map((customer: any) => 
          customersService.transformCustomerToTableData(customer)
        );
        setCustomers(customersData);
      } else {
        console.error('فشل في تحميل العملاء:', response.message);
        setCustomers([]);
      }
    } catch (error) {
      console.error('خطأ في تحميل العملاء:', error);
      setCustomers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // التحقق من معامل mode في URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    if (mode === 'form') {
      setViewMode('form');
      // إزالة المعامل من URL بعد فتح النموذج
      navigate(pathname, { replace: true });
    }
  }, [navigate, pathname]);

  // معالجة إضافة عميل جديد
  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setViewMode('form');
  };

  // معالجة تعديل عميل
  const handleEditCustomer = (customer: CustomerTableData) => {
    setSelectedCustomer(customer);
    setViewMode('form');
  };

  // معالجة حذف عميل - فتح Dialog
  const handleDeleteCustomer = (customer: CustomerTableData) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  };

  // تأكيد الحذف
  const confirmDelete = async () => {
    if (!customerToDelete) return;

    setIsLoading(true);
    try {
      const result = await customersService.deleteCustomer(customerToDelete.id);
      
      if (result.success) {
        toast({
          title: "تم الحذف بنجاح",
          description: "تم حذف العميل بنجاح",
          variant: "success",
        });
        // إعادة تحميل قائمة العملاء
        await loadCustomers();
      } else {
        toast({
          title: "خطأ في الحذف",
          description: result.message || 'حدث خطأ في حذف العميل',
          variant: "error",
        });
      }
    } catch (error: any) {
      console.error('خطأ في حذف العميل:', error);
      toast({
        title: "خطأ في الحذف",
        description: error.response?.data?.message || 'حدث خطأ في حذف العميل',
        variant: "error",
      });
    } finally {
      setIsLoading(false);
      setCustomerToDelete(null);
    }
  };

  // معالجة عرض تفاصيل العميل
  const handleViewCustomer = (customer: CustomerTableData) => {
    setSelectedCustomer(customer);
    setViewMode('details');
  };

  // معالجة حفظ العميل
  const handleSaveCustomer = async (data: any) => {
    setIsLoading(true);
    try {
      // تحويل البيانات إلى تنسيق Laravel
      const customerData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        phones: data.phones,
        address: data.address,
        nationality: data.nationality,
        customer_type: data.customerType || data.customer_type,
        id_number: data.idNumber || data.id_number,
        commercial_record: data.commercialRecord || data.commercial_record,
        status: data.status,
        guarantor_name: data.guarantorName || data.guarantor_name,
        guarantor_phone: data.guarantorPhone || data.guarantor_phone,
        guarantor_id: data.guarantorId || data.guarantor_id,
        guarantor_data: data.guarantorData || data.guarantor_data,
        notes: data.notes,
        warnings: data.warnings,
        rating: data.rating,
      };

      let result;
      if (selectedCustomer) {
        // تحديث عميل موجود
        result = await customersService.updateCustomer(selectedCustomer.id, customerData);
      } else {
        // إنشاء عميل جديد
        result = await customersService.createCustomer(customerData);
      }

      if (result.success) {
        toast({
          title: selectedCustomer ? "تم التحديث بنجاح" : "تم الإضافة بنجاح",
          description: selectedCustomer ? "تم تحديث بيانات العميل بنجاح" : "تم إضافة العميل بنجاح",
          variant: "success",
        });
        setViewMode('list');
        // إعادة تحميل قائمة العملاء
        await loadCustomers();
      } else {
        toast({
          title: "خطأ في الحفظ",
          description: result.message || 'حدث خطأ في حفظ العميل',
          variant: "error",
        });
      }
    } catch (error: any) {
      console.error('خطأ في حفظ العميل:', error);
      toast({
        title: "خطأ في الحفظ",
        description: error.response?.data?.message || 'حدث خطأ في حفظ العميل',
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // معالجة إلغاء النموذج
  const handleCancelForm = () => {
    setViewMode('list');
    setSelectedCustomer(null);
  };

  // معالجة العودة من التفاصيل
  const handleBackFromDetails = () => {
    setViewMode('list');
    setSelectedCustomer(null);
  };

  // معالجة طباعة ملف العميل
  const handlePrintCustomer = () => {
    window.print();
  };

  // معالجة تصدير ملف العميل
  const handleExportCustomer = () => {
    alert('سيتم تصدير ملف العميل');
  };

  // معالجة تصدير جميع العملاء
  const handleExportCustomers = () => {
    alert('سيتم تصدير جميع العملاء');
  };

  // إنشاء بيانات العميل التفصيلية للعرض
  const createCustomerDetails = (customer: CustomerTableData): CustomerDetailsType => {
    return {
      ...customer,
      createdAt: new Date(),
      updatedAt: new Date(),
      contractsSummary: {
        total: customer.contractsCount,
        active: Math.floor(customer.contractsCount * 0.7),
        completed: Math.floor(customer.contractsCount * 0.2),
        cancelled: Math.floor(customer.contractsCount * 0.1),
        totalValue: customer.totalPayments + customer.pendingAmount,
      },
      paymentsSummary: {
        total: Math.floor(customer.contractsCount * 2),
        paid: Math.floor(customer.contractsCount * 1.5),
        pending: Math.floor(customer.contractsCount * 0.3),
        overdue: Math.floor(customer.contractsCount * 0.2),
        totalAmount: customer.totalPayments,
      },
      recentActivity: [
        {
          id: '1',
          action: 'تسجيل دخول',
          description: 'تم تسجيل دخول العميل إلى النظام',
          entityType: 'customer',
          entityId: customer.id,
          createdAt: new Date(),
          user: { id: '1', email: 'admin@example.com', name: 'المدير', role: 'ADMIN', createdAt: new Date(), updatedAt: new Date() },
        },
        {
          id: '2',
          action: 'تحديث البيانات',
          description: 'تم تحديث معلومات العميل',
          entityType: 'customer',
          entityId: customer.id,
          createdAt: new Date(Date.now() - 86400000),
          user: { id: '1', email: 'admin@example.com', name: 'المدير', role: 'ADMIN', createdAt: new Date(), updatedAt: new Date() },
        },
      ],
      attachments: [],
    };
  };

  // عرض loading أثناء انتظار تحميل المكون في المتصفح
  if (!isClient) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري التحميل...</p>
          </div>
        </div>
      </div>
    );
  }

  // عرض النموذج
  if (viewMode === 'form') {
    return (
      <CustomerForm
        customer={selectedCustomer ? {
          id: selectedCustomer.id,
          customerNumber: selectedCustomer.customerNumber,
          name: selectedCustomer.name,
          email: selectedCustomer.email,
          phone: selectedCustomer.phone,
          address: '',
          nationality: selectedCustomer.nationality,
          customerType: selectedCustomer.customerType,
          idNumber: selectedCustomer.idNumber,
          commercialRecord: '',
          status: selectedCustomer.status,
          registrationDate: selectedCustomer.registrationDate,
          guarantorName: '',
          guarantorPhone: '',
          guarantorId: '',
          notes: '',
          warnings: '',
          rating: selectedCustomer.rating,
          attachments: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        } : undefined}
        onSubmit={handleSaveCustomer}
        onCancel={handleCancelForm}
        isLoading={isLoading}
      />
    );
  }

  // عرض تفاصيل العميل
  if (viewMode === 'details' && selectedCustomer) {
    return (
      <CustomerDetails
        customer={createCustomerDetails(selectedCustomer)}
        onEdit={() => handleEditCustomer(selectedCustomer)}
        onBack={handleBackFromDetails}
        onPrint={handlePrintCustomer}
        onExport={handleExportCustomer}
      />
    );
  }

  // عرض إدارة حالة العملاء
  if (viewMode === 'status') {
    return (
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <h2 className="text-xl font-semibold">إدارة حالة العملاء</h2>
          </div>
          <button
            onClick={() => setViewMode('list')}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            العودة للقائمة
          </button>
        </div>
        <CustomerStatusManager />
      </div>
    );
  }

  // العرض الافتراضي - قائمة العملاء
  return (
    <div className="w-full space-y-6">
      {/* أزرار الوصول السريع */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          <h2 className="text-xl font-semibold">العملاء</h2>
        </div>
        <button
          onClick={() => setViewMode('status')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Settings className="h-4 w-4" />
          إدارة الحالة
        </button>
      </div>

      {/* إحصائيات العملاء */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          <h2 className="text-xl font-semibold">إحصائيات العملاء</h2>
        </div>
        {isClient && <CustomerStats stats={mockCustomerStats} />}
      </div>

      {/* جدول العملاء */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <h2 className="text-xl font-semibold">قائمة العملاء</h2>
        </div>
        {isClient && (
          <CustomersTable
            data={customers || []}
            onAddCustomer={handleAddCustomer}
            onEditCustomer={handleEditCustomer}
            onDeleteCustomer={handleDeleteCustomer}
            onViewCustomer={handleViewCustomer}
            onExportCustomers={handleExportCustomers}
          />
        )}
      </div>

      {/* Dialog تأكيد الحذف */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="تأكيد حذف العميل"
        description={`هل أنت متأكد من حذف العميل "${customerToDelete?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmText="حذف"
        cancelText="إلغاء"
        variant="danger"
      />
    </div>
  );
}

