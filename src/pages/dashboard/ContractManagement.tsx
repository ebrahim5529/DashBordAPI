/**
 * صفحة إدارة العقود والاتفاقيات
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, CheckCircle, XCircle, Clock, Plus, DollarSign } from 'lucide-react';
import { ContractsManagementTable } from '@/components/features/ContractsManagementTable';
import ContractFormSinglePage from '@/components/features/ContractFormSinglePage';
import InvoiceModal from '@/components/features/InvoiceModal';
import ContractDetailsModal from '@/components/features/ContractDetailsModal';
import { mockContractsManagementData, contractsManagementStats, ContractManagementData } from '@/data/contractsManagementData';
import { ContractFormData } from '@/lib/types/contract';
import * as contractsService from '@/lib/services/contracts.service';
import { useToast } from '@/hooks/use-toast';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

type ViewMode = 'list' | 'form';

export default function ContractManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [_selectedContract, setSelectedContract] = useState<ContractManagementData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [contracts, setContracts] = useState<ContractManagementData[]>([]);
  const [isClient, setIsClient] = useState(false);
  
  // نوافذ منبثقة
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedContractForInvoice, setSelectedContractForInvoice] = useState<ContractManagementData | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedContractForDetails, setSelectedContractForDetails] = useState<ContractManagementData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contractToDelete, setContractToDelete] = useState<ContractManagementData | null>(null);

  // تحديد أن المكون تم تحميله في المتصفح
  useEffect(() => {
    setIsClient(true);
  }, []);

  // تحميل البيانات
  useEffect(() => {
    if (!isClient) return;
    loadContracts();
  }, [isClient]);

  // دالة تحميل العقود
  const loadContracts = async () => {
    setIsLoading(true);
    try {
      const response = await contractsService.getContracts();
      
      if (response.success) {
        const contractsData = response.data.data.map((contract: any) => 
          contractsService.transformContractToTableData(contract)
        );
        setContracts(contractsData as any);
      } else {
        console.error('فشل في تحميل العقود:', response.message);
        setContracts([]);
      }
    } catch (error) {
      console.error('خطأ في تحميل العقود:', error);
      setContracts([]);
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
      navigate(pathname, { replace: true });
    }
  }, [navigate, pathname]);

  // معالجة إضافة عقد جديد
  const handleAddContract = () => {
    setSelectedContract(null);
    setViewMode('form');
  };

  // معالجة حفظ العقد
  const handleSaveContract = async (contractData: ContractFormData, action: 'save' | 'send' | 'send_warehouse') => {
    setIsLoading(true);
    try {
      const result = _selectedContract 
        ? await contractsService.updateContract(_selectedContract.id, contractData)
        : await contractsService.createContract(contractData);

      if (result.success) {
        let message = '';
        if (action === 'save') {
          message = _selectedContract ? 'تم تحديث العقد بنجاح' : 'تم إنشاء العقد بنجاح';
        } else if (action === 'send') {
          message = 'تم تخزين وإرسال العقد بنجاح';
        } else if (action === 'send_warehouse') {
          message = 'تم تخزين العقد وإرساله للمخزن بنجاح';
        }

        toast({
          title: "تم بنجاح",
          description: message,
          variant: "success",
        });
        setViewMode('list');
        await loadContracts();
      } else {
        toast({
          title: "خطأ في الحفظ",
          description: result.message || 'حدث خطأ في حفظ العقد',
          variant: "error",
        });
      }
    } catch (error: any) {
      console.error('خطأ في حفظ العقد:', error);
      toast({
        title: "خطأ في الحفظ",
        description: error.response?.data?.message || 'حدث خطأ في حفظ العقد',
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // معالجة إغلاق النموذج
  const handleCloseForm = () => {
    setViewMode('list');
    setSelectedContract(null);
  };

  // معالجة عرض تفاصيل العقد
  const handleViewContract = (contract: ContractManagementData) => {
    console.log('عرض العقد:', contract.contractNumber);
    setSelectedContractForDetails(contract);
    setShowDetailsModal(true);
  };

  // إغلاق نافذة التفاصيل
  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedContractForDetails(null);
  };

  // معالجة تعديل العقد
  const handleEditContract = (contract: ContractManagementData) => {
    console.log('تعديل العقد:', contract.contractNumber);
    setSelectedContract(contract);
    setViewMode('form');
  };

  // معالجة فتح نافذة الحذف
  const handleDeleteContract = (contract: ContractManagementData) => {
    setContractToDelete(contract);
    setDeleteDialogOpen(true);
  };

  // تأكيد حذف العقد
  const confirmDeleteContract = async () => {
    if (!contractToDelete) return;

    setIsLoading(true);
    try {
      const result = await contractsService.deleteContract(contractToDelete.id);
      
      if (result.success) {
        toast({
          title: "تم الحذف بنجاح",
          description: "تم حذف العقد بنجاح",
          variant: "success",
        });
        await loadContracts();
      } else {
        toast({
          title: "خطأ في الحذف",
          description: result.message || 'حدث خطأ في حذف العقد',
          variant: "error",
        });
      }
    } catch (error: any) {
      console.error('خطأ في حذف العقد:', error);
      toast({
        title: "خطأ في الحذف",
        description: error.response?.data?.message || 'حدث خطأ في حذف العقد',
        variant: "error",
      });
    } finally {
      setIsLoading(false);
      setContractToDelete(null);
    }
  };

  // معالجة طباعة العقد
  const handlePrintContract = (contract: ContractManagementData) => {
    console.log('طباعة العقد:', contract.contractNumber);
    // فتح نافذة العقد ثم طباعة
    setSelectedContractForInvoice(contract);
    setShowInvoiceModal(true);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  // معالجة إصدار فاتورة
  const handleGenerateInvoice = (contract: ContractManagementData) => {
    console.log('إصدار فاتورة للعقد:', contract.contractNumber);
    setSelectedContractForInvoice(contract);
    setShowInvoiceModal(true);
  };

  // إغلاق نافذة الفاتورة
  const handleCloseInvoiceModal = () => {
    setShowInvoiceModal(false);
    setSelectedContractForInvoice(null);
  };

  // عرض نموذج العقد
  if (viewMode === 'form') {
    return (
      <ContractFormSinglePage
        onSubmit={handleSaveContract}
        onCancel={handleCloseForm}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div className='space-y-6'>
      {/* العنوان الرئيسي */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-[#58d2c8]" />
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            العقود
          </h1>
        </div>
        <button 
          onClick={handleAddContract}
          className="bg-[#58d2c8] text-white px-4 py-2 rounded-lg hover:bg-[#4AB8B3] transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          إضافة عقد جديد
        </button>
      </div>
    
      {/* إحصائيات العقود */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <h2 className="text-xl font-semibold">إحصائيات العقود</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* إجمالي العقود */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[120px]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm text-gray-600 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
                  إجمالي العقود
                </h3>
                <div className="text-2xl font-bold text-[#58d2c8] group-hover:text-[#4AB8B3] transition-colors duration-300 font-tajawal">
                  {contractsManagementStats.totalContracts}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {contractsManagementStats.activeContracts} نشط، {contractsManagementStats.expiredContracts} منتهي
                </p>
              </div>
              <div className="p-2 bg-[#58d2c8]/10 rounded-lg group-hover:bg-[#58d2c8]/20 transition-all duration-300">
                <FileText className="h-6 w-6 text-[#58d2c8] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </div>

          {/* العقود النشطة */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[120px]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm text-gray-600 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
                  العقود النشطة
                </h3>
                <div className="text-2xl font-bold text-[#58d2c8] group-hover:text-[#4AB8B3] transition-colors duration-300 font-tajawal">
                  {contractsManagementStats.activeContracts}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {contractsManagementStats.partialPaymentContracts} مدفوع جزئياً
                </p>
              </div>
              <div className="p-2 bg-[#58d2c8]/10 rounded-lg group-hover:bg-[#58d2c8]/20 transition-all duration-300">
                <CheckCircle className="h-6 w-6 text-[#58d2c8] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </div>

          {/* العقود المنتهية */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[120px]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm text-gray-600 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
                  العقود المنتهية
                </h3>
                <div className="text-2xl font-bold text-[#58d2c8] group-hover:text-[#4AB8B3] transition-colors duration-300 font-tajawal">
                  {contractsManagementStats.expiredContracts}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {contractsManagementStats.paidContracts} مدفوع بالكامل
                </p>
              </div>
              <div className="p-2 bg-[#58d2c8]/10 rounded-lg group-hover:bg-[#58d2c8]/20 transition-all duration-300">
                <Clock className="h-6 w-6 text-[#58d2c8] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </div>

          {/* القيمة الإجمالية */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[120px]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm text-gray-600 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
                  القيمة الإجمالية
                </h3>
                <div className="text-2xl font-bold text-[#58d2c8] group-hover:text-[#4AB8B3] transition-colors duration-300 font-tajawal">
                  {new Intl.NumberFormat('ar-SA', {
                    style: 'currency',
                    currency: 'OMR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(contractsManagementStats.totalValue)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {contractsManagementStats.pendingContracts} غير مدفوع
                </p>
              </div>
              <div className="p-2 bg-[#58d2c8]/10 rounded-lg group-hover:bg-[#58d2c8]/20 transition-all duration-300">
                <DollarSign className="h-6 w-6 text-[#58d2c8] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* جدول العقود */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <h2 className="text-xl font-semibold">جدول العقود</h2>
        </div>
        {isClient && (
          <ContractsManagementTable
            data={contracts.length > 0 ? contracts : mockContractsManagementData}
            onViewContract={handleViewContract}
            onEditContract={handleEditContract}
            onDeleteContract={handleDeleteContract}
            onPrintContract={handlePrintContract}
            onGenerateInvoice={handleGenerateInvoice}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* روابط سريعة لإدارة العقود */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <h2 className="text-xl font-semibold">أنواع العقود</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* عقود التأجير */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">عقود التأجير</h3>
                <p className="text-sm text-gray-600">عقود تأجير المعدات</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>عدد العقود:</span>
                <span className="font-medium text-[#58d2c8]">
                  {mockContractsManagementData.filter(c => c.contractType === 'تأجير').length}
                </span>
              </div>
            </div>
          </div>

          {/* عقود الشراء */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">عقود الشراء</h3>
                <p className="text-sm text-gray-600">عقود شراء المعدات</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>عدد العقود:</span>
                <span className="font-medium text-[#58d2c8]">
                  {mockContractsManagementData.filter(c => c.contractType === 'شراء').length}
                </span>
              </div>
            </div>
          </div>

          {/* عقود الصيانة */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">عقود الصيانة</h3>
                <p className="text-sm text-gray-600">عقود صيانة المعدات</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>عدد العقود:</span>
                <span className="font-medium text-[#58d2c8]">
                  {mockContractsManagementData.filter(c => c.contractType === 'صيانة').length}
                </span>
              </div>
            </div>
          </div>

          {/* عقود التركيب */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <XCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">عقود التركيب</h3>
                <p className="text-sm text-gray-600">عقود تركيب المعدات</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>عدد العقود:</span>
                <span className="font-medium text-[#58d2c8]">
                  {mockContractsManagementData.filter(c => c.contractType === 'تركيب').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* نافذة الفاتورة/العقد */}
      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={handleCloseInvoiceModal}
        contract={selectedContractForInvoice}
      />

      {/* نافذة عرض التفاصيل */}
      <ContractDetailsModal
        isOpen={showDetailsModal}
        onClose={handleCloseDetailsModal}
        contract={selectedContractForDetails}
      />

      {/* نافذة تأكيد الحذف */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDeleteContract}
        title="تأكيد حذف العقد"
        description={`هل أنت متأكد من حذف العقد "${contractToDelete?.contractNumber}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmText="حذف"
        cancelText="إلغاء"
        variant="danger"
      />

    </div>
  );
}

