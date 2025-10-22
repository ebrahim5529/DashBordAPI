/**
 * صفحة تفاصيل العقد الكاملة
 * تم تحويلها من Next.js إلى React Router
 * مربوطة مع Laravel API
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Calendar, DollarSign, MapPin, Package, User, FileText, AlertTriangle, Send } from 'lucide-react';
import { ContractManagementData } from '@/data/contractsManagementData';
import DeliveryReceiptGenerator from '@/components/features/DeliveryReceiptGenerator';
import * as contractsService from '@/lib/services/contracts.service';
import { useToast } from '@/hooks/use-toast';

export default function ContractDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const contractId = id;
  const { toast } = useToast();
  
  const [contract, setContract] = useState<any | null>(null);
  const [showDeliveryReceipt, setShowDeliveryReceipt] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadContractDetails = async () => {
      if (!contractId) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setNotFound(false);
      
      try {
        console.log('🔍 جلب تفاصيل العقد من Laravel API:', contractId);
        const response = await contractsService.getContract(contractId);
        
        if (response.success && response.data) {
          const contractData = response.data;
          console.log('✅ تم جلب العقد:', contractData);
          
          // تحويل البيانات من Laravel format
          const formattedContract = {
            id: contractData.id?.toString(),
            contractNumber: contractData.contract_number || '',
            customerName: contractData.customer?.name || contractData.customer_name || '',
            customerId: contractData.customer?.customer_number || contractData.customer_id?.toString() || '',
            contractType: contractData.contract_type === 'RENTAL' ? 'إيجار' : 
                         contractData.contract_type === 'SALE' ? 'بيع' : 
                         contractData.contract_type || 'إيجار',
            totalValue: parseFloat(contractData.total_after_discount || contractData.total_contract_value || 0),
            status: contractData.status === 'ACTIVE' ? 'نشط' :
                   contractData.status === 'EXPIRED' ? 'منتهي' :
                   contractData.status === 'CANCELLED' ? 'ملغي' :
                   contractData.status === 'PENDING' ? 'معلق' : 'نشط',
            startDate: contractData.start_date || contractData.contract_date,
            endDate: contractData.end_date || contractData.start_date,
            remainingAmount: parseFloat(contractData.remaining_amount || 0),
            paidAmount: parseFloat(contractData.paid_amount || 0),
            createdAt: contractData.created_at,
            updatedAt: contractData.updated_at,
            location: contractData.delivery_address || 'غير محدد',
            equipmentCount: contractData.rental_details?.length || 0,
            rentalDetails: contractData.rental_details || [],
            payments: contractData.payments || [],
            customer: contractData.customer,
          };
          
          setContract(formattedContract);
        } else {
          console.error('❌ لم يتم العثور على العقد');
          setNotFound(true);
          toast({
            title: 'خطأ',
            description: 'لم يتم العثور على العقد المطلوب',
            variant: 'error'
          });
        }
      } catch (error: any) {
        console.error('❌ خطأ في جلب العقد:', error);
        setNotFound(true);
        toast({
          title: 'خطأ في التحميل',
          description: error.response?.data?.message || 'حدث خطأ في جلب تفاصيل العقد',
          variant: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadContractDetails();
  }, [contractId]);

  // شاشة التحميل
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#58d2c8] mx-auto mb-6"></div>
          <p className="text-xl text-gray-700 font-semibold mb-2">جاري تحميل تفاصيل العقد...</p>
          <p className="text-sm text-gray-500">ID: {contractId}</p>
        </div>
      </div>
    );
  }

  // رسالة عدم العثور على العقد
  if (notFound || !contract) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">العقد غير موجود</h2>
            <p className="text-gray-600 mb-6">
              لم نتمكن من العثور على العقد بالرقم المعرف: <span className="font-mono font-semibold">{contractId}</span>
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate(-1)}
                className="w-full px-6 py-3 bg-[#58d2c8] hover:bg-[#4AB8B3] text-white font-medium rounded-lg transition-colors"
              >
                العودة
              </button>
              <button
                onClick={() => navigate('/dashboard/contract-management')}
                className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
              >
                العودة لصفحة العقود
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // تنسيق المبلغ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'OMR',
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    }).format(amount);
  };

  // حساب مدة العقد
  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const duration = calculateDuration(contract.startDate, contract.endDate);

  // الحصول على لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'نشط': return 'bg-green-100 text-green-800 border-green-300';
      case 'منتهي': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'ملغي': return 'bg-red-100 text-red-800 border-red-300';
      case 'معلق': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'معتمد': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header - مبسط بدون sticky */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="العودة"
              >
                <ArrowRight className="h-6 w-6 text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#58d2c8]/10 rounded-lg">
                  <FileText className="h-7 w-7 text-[#58d2c8]" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">تفاصيل العقد</h1>
                  <p className="text-sm text-gray-600 mt-1">{contract.contractNumber}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDeliveryReceipt(true)}
                className="px-6 py-3 bg-[#58d2c8] hover:bg-[#4AB8B3] text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                إرسال سند استلام
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Contract Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Info */}
            <div className="bg-white border-2 border-blue-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">معلومات العميل</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">اسم العميل</p>
                  <p className="text-lg font-semibold text-gray-900">{contract.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">رقم العميل</p>
                  <p className="text-lg font-semibold text-gray-900">{contract.customerId}</p>
                </div>
              </div>
            </div>

            {/* Contract Info */}
            <div className="bg-white border-2 border-purple-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-bold text-gray-900">معلومات العقد</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">رقم العقد</p>
                  <p className="text-lg font-semibold text-gray-900">{contract.contractNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">نوع العقد</p>
                  <p className="text-lg font-semibold text-gray-900">{contract.contractType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">الحالة</p>
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border-2 ${getStatusColor(contract.status)}`}>
                    {contract.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-white border-2 border-green-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-bold text-gray-900">التواريخ والمدة</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600">تاريخ البدء</p>
                <p className="text-lg font-semibold text-gray-900">{formatDate(contract.startDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">تاريخ الانتهاء</p>
                <p className="text-lg font-semibold text-gray-900">{formatDate(contract.endDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">مدة العقد</p>
                <p className="text-lg font-semibold text-gray-900">{duration} يوم</p>
              </div>
            </div>
          </div>

          {/* Financial Info */}
          <div className="bg-white border-2 border-yellow-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-6 w-6 text-yellow-600" />
              <h3 className="text-lg font-bold text-gray-900">المعلومات المالية</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600">إجمالي العقد</p>
                <p className="text-2xl font-bold text-[#58d2c8]">{formatCurrency(contract.totalValue)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">المبلغ المدفوع</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(contract.paidAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">المبلغ المتبقي</p>
                <p className={`text-2xl font-bold ${contract.remainingAmount > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                  {formatCurrency(contract.remainingAmount)}
                </p>
              </div>
            </div>
          </div>

          {/* Location & Equipment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-6 w-6 text-gray-600" />
                <h3 className="text-lg font-bold text-gray-900">الموقع</h3>
              </div>
              <p className="text-lg text-gray-900">{contract.location}</p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-6 w-6 text-gray-600" />
                <h3 className="text-lg font-bold text-gray-900">المعدات</h3>
              </div>
              <p className="text-gray-900">
                <span className="text-3xl font-semibold text-[#58d2c8]">{contract.equipmentCount}</span>{' '}
                <span className="text-lg text-gray-600">قطعة</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Receipt Generator */}
      {showDeliveryReceipt && (
        <DeliveryReceiptGenerator
          contract={contract}
          employeeName="موظف الاستلام"
          onClose={() => setShowDeliveryReceipt(false)}
        />
      )}
    </div>
  );
}

