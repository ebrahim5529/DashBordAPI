/**
 * صفحة سجل العقود الخاصة بالعملاء
 * تعرض 4 كروت إحصائيات وجدول العقود
 * مربوطة مع Laravel API
 */

import React, { useState, useEffect } from 'react';
import { ContractsTable } from '@/components/features/ContractsTable';
import ContractDetailsModal from '@/components/features/ContractDetailsModal';
import { ContractManagementData } from '@/data/contractsManagementData';
import { FileText, TrendingUp, DollarSign, Calendar, Users } from 'lucide-react';
import * as customersService from '@/lib/services/customers.service';
import * as contractsService from '@/lib/services/contracts.service';
import { useToast } from '@/hooks/use-toast';

export default function CustomerContractsPage() {
  const { toast } = useToast();
  const [selectedContract, setSelectedContract] = useState<ContractManagementData | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contracts, setContracts] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total_contracts: 0,
    active_contracts: 0,
    expired_contracts: 0,
    total_value: 0,
    total_paid: 0,
    total_remaining: 0
  });
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('all');
  const [isClient, setIsClient] = useState(false);

  // تحديد أن المكون تم تحميله في المتصفح
  useEffect(() => {
    setIsClient(true);
  }, []);

  // تحميل العملاء
  useEffect(() => {
    if (!isClient) return;
    loadCustomers();
  }, [isClient]);

  // تحميل العقود عند تغيير العميل
  useEffect(() => {
    if (!isClient) return;
    if (selectedCustomerId === 'all') {
      loadAllContracts();
    } else {
      loadCustomerContracts(selectedCustomerId);
    }
  }, [selectedCustomerId, isClient]);

  const loadCustomers = async () => {
    try {
      const response = await customersService.getCustomers();
      if (response.success && response.data.data) {
        setCustomers(response.data.data);
      }
    } catch (error) {
      console.error('خطأ في تحميل العملاء:', error);
    }
  };

  const loadAllContracts = async () => {
    setIsLoading(true);
    try {
      const response = await contractsService.getContracts();
      if (response.success && response.data.data) {
        setContracts(response.data.data);
        calculateStats(response.data.data);
      }
    } catch (error) {
      console.error('خطأ في تحميل العقود:', error);
      toast({
        title: 'خطأ في التحميل',
        description: 'حدث خطأ في تحميل العقود',
        variant: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadCustomerContracts = async (customerId: string) => {
    setIsLoading(true);
    try {
      const [contractsRes, statsRes] = await Promise.all([
        customersService.getCustomerContracts(customerId),
        customersService.getCustomerContractsStats(customerId)
      ]);

      if (contractsRes.success) {
        setContracts(contractsRes.data);
      }
      if (statsRes.success) {
        setStats(statsRes.data);
      }
    } catch (error) {
      console.error('خطأ في تحميل عقود العميل:', error);
      toast({
        title: 'خطأ في التحميل',
        description: 'حدث خطأ في تحميل عقود العميل',
        variant: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (contractsData: any[]) => {
    setStats({
      total_contracts: contractsData.length,
      active_contracts: contractsData.filter(c => c.status === 'ACTIVE').length,
      expired_contracts: contractsData.filter(c => c.status === 'EXPIRED').length,
      total_value: contractsData.reduce((sum, c) => sum + (parseFloat(c.total_after_discount) || 0), 0),
      total_paid: contractsData.reduce((sum, c) => sum + (parseFloat(c.paid_amount) || 0), 0),
      total_remaining: contractsData.reduce((sum, c) => sum + (parseFloat(c.remaining_amount) || 0), 0)
    });
  };

  // تحويل حالة العقد من الإنجليزية إلى العربية
  const translateStatus = (status: string): 'نشط' | 'منتهي' | 'ملغي' | 'معلق' | 'معتمد' => {
    const statusMap: Record<string, 'نشط' | 'منتهي' | 'ملغي' | 'معلق' | 'معتمد'> = {
      'ACTIVE': 'نشط',
      'EXPIRED': 'منتهي',
      'CANCELLED': 'ملغي',
      'PENDING': 'معلق',
      'APPROVED': 'معتمد',
    };
    return statusMap[status?.toUpperCase()] || 'نشط';
  };

  // تحويل نوع العقد من الإنجليزية إلى العربية
  const translateContractType = (type: string): 'تأجير' | 'شراء' | 'صيانة' | 'تركيب' => {
    const typeMap: Record<string, 'تأجير' | 'شراء' | 'صيانة' | 'تركيب'> = {
      'RENTAL': 'تأجير',
      'SALE': 'شراء',
      'MAINTENANCE': 'صيانة',
      'INSTALLATION': 'تركيب',
    };
    return typeMap[type?.toUpperCase()] || 'تأجير';
  };

  // تحويل بيانات العقود إلى النوع المطلوب للجدول
  const contractsTableData = contracts.map(contract => ({
    id: contract.id?.toString(),
    contractNumber: contract.contract_number || '',
    customerId: contract.customer_id?.toString() || '',
    customerName: contract.customer_name || contract.customer?.name || '',
    contractType: translateContractType(contract.contract_type || 'RENTAL'),
    startDate: new Date(contract.start_date || contract.contract_date),
    endDate: new Date(contract.end_date || contract.start_date),
    totalValue: parseFloat(contract.total_after_discount || 0),
    paidAmount: parseFloat(contract.paid_amount || 0),
    pendingAmount: parseFloat(contract.remaining_amount || 0),
    status: translateStatus(contract.status || 'ACTIVE'),
    attachments: [],
    notes: contract.contract_notes || '',
    createdAt: new Date(contract.created_at),
    updatedAt: new Date(contract.updated_at || contract.created_at),
  }));

  // معالجة عرض تفاصيل العقد
  const handleViewContract = (contract: any) => {
    // البحث عن العقد الأصلي في البيانات
    const originalContract = contracts.find((c: any) => c.id?.toString() === contract.id?.toString());
    if (originalContract) {
      // تحويل إلى ContractManagementData format
      const formattedContract: ContractManagementData = {
        id: originalContract.id?.toString(),
        contractNumber: originalContract.contract_number || '',
        customerName: originalContract.customer_name || originalContract.customer?.name || '',
        customerId: originalContract.customer_id?.toString() || '',
        contractType: translateContractType(originalContract.contract_type || 'RENTAL'),
        totalValue: parseFloat(originalContract.total_after_discount || 0),
        status: translateStatus(originalContract.status || 'ACTIVE'),
        startDate: originalContract.start_date || '',
        endDate: originalContract.end_date || '',
        remainingAmount: parseFloat(originalContract.remaining_amount || 0),
        paidAmount: parseFloat(originalContract.paid_amount || 0),
        createdAt: originalContract.created_at,
        updatedAt: originalContract.updated_at || originalContract.created_at,
        location: originalContract.delivery_address || '',
        equipmentCount: originalContract.rental_details?.length || 0,
        notes: originalContract.contract_notes || '',
        paymentStatus: originalContract.payment_status || 'جزئي',
        priority: originalContract.priority || 'عادي'
      };
      setSelectedContract(formattedContract);
      setShowDetailsModal(true);
    }
  };

  // معالجة طباعة العقد
  const handlePrintContract = (contract: any) => {
    console.log('طباعة العقد:', contract.contractNumber);
    window.print();
  };

  // معالجة إغلاق نافذة التفاصيل
  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedContract(null);
  };

  return (
    <div className='space-y-6'>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            عقود العملاء
          </h1>
        </div>
        
        {/* اختيار العميل */}
        {customers.length > 0 && (
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-gray-600" />
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent bg-white"
            >
              <option value="all">جميع العملاء</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} ({customer.customer_number})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <p className='text-gray-600 dark:text-gray-400 mt-2'>
        إدارة العقود والاتفاقيات مع العملاء
      </p>

      {/* إحصائيات العقود */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <h2 className="text-xl font-semibold">إحصائيات العقود</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* إجمالي العقود */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[120px]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm text-gray-600 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
                  إجمالي العقود
                </h3>
                <div className="text-2xl font-bold text-[#58d2c8] group-hover:text-[#4AB8B3] transition-colors duration-300 font-tajawal">
                  {isLoading ? '...' : stats.total_contracts}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.active_contracts} نشط، {stats.expired_contracts} منتهي
                </p>
              </div>
              <div className="p-2 bg-[#58d2c8]/10 rounded-lg group-hover:bg-[#58d2c8]/20 transition-all duration-300">
                <FileText className="h-6 w-6 text-[#58d2c8] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </div>

          {/* العقود النشطة والمنتهية */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[120px]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm text-gray-600 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
                  حالة العقود
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm">نشط</span>
                    </div>
                    <span className="text-sm font-medium text-[#58d2c8]">{isLoading ? '...' : stats.active_contracts}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-red-600" />
                      <span className="text-sm">منتهي</span>
                    </div>
                    <span className="text-sm font-medium text-[#58d2c8]">{isLoading ? '...' : stats.expired_contracts}</span>
                  </div>
                </div>
              </div>
              <div className="p-2 bg-[#58d2c8]/10 rounded-lg group-hover:bg-[#58d2c8]/20 transition-all duration-300">
                <TrendingUp className="h-6 w-6 text-[#58d2c8] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </div>

          {/* إجمالي القيمة والعقود المنتهية قريباً */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[120px]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm text-gray-600 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
                  القيمة والتنبيهات
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-orange-600" />
                      <span className="text-sm">إجمالي القيمة</span>
                    </div>
                    <span className="text-sm font-medium text-[#58d2c8]">2.45M ر.ع</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-red-600" />
                      <span className="text-sm">منتهي قريباً</span>
                    </div>
                    <span className="text-sm font-medium text-[#58d2c8]">12</span>
                  </div>
                </div>
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
          <h2 className="text-xl font-semibold">قائمة العقود</h2>
        </div>
        <ContractsTable
          data={contractsTableData || []}
          onViewContract={handleViewContract}
          onPrintContract={handlePrintContract}
          filters={{}}
          isLoading={isLoading}
        />
      </div>

      {/* نافذة تفاصيل العقد */}
      {showDetailsModal && selectedContract && (
        <ContractDetailsModal
          isOpen={showDetailsModal}
          contract={selectedContract}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
}