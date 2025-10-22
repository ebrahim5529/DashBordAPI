/**
 * صفحة قائمة المطالبات (Claims / Collections)
 * تعرض 4 كروت إحصائيات وجدول المطالبات
 * مربوطة مع Laravel API
 */

import React, { useState, useEffect } from 'react';
import { ClaimsTable } from '@/components/features/ClaimsTable';
import { PaymentModal } from '@/components/features/PaymentModal';
import { ReceiptModal } from '@/components/features/ReceiptModal';
import { ClaimsDetailsModal } from '@/components/features/ClaimsDetailsModal';
import { CommentModal } from '@/components/features/CommentModal';
import { mockClaimsData } from '@/data/claimsData';
import { ClaimsTableData } from '@/lib/types/claims';
import { DollarSign, TrendingUp, AlertTriangle, Clock, FileText, Users } from 'lucide-react';
import * as customersService from '@/lib/services/customers.service';
import * as paymentsService from '@/lib/services/payments.service';
import { useToast } from '@/hooks/use-toast';

type ModalType = 'payment' | 'receipt' | 'details' | 'comment' | null;

export default function CustomerClaimsPage() {
  const { toast } = useToast();
  const [selectedClaim, setSelectedClaim] = useState<ClaimsTableData | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [claims, setClaims] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total_claims: 0,
    total_amount: 0,
    overdue_claims: 0,
    recent_claims: 0,
    collected_amount: 0
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

  // تحميل المطالبات عند تغيير العميل
  useEffect(() => {
    if (!isClient) return;
    if (selectedCustomerId !== 'all') {
      loadCustomerClaims(selectedCustomerId);
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

  const loadCustomerClaims = async (customerId: string) => {
    setIsLoading(true);
    try {
      const [claimsRes, statsRes] = await Promise.all([
        customersService.getCustomerClaims(customerId),
        customersService.getCustomerClaimsStats(customerId)
      ]);

      if (claimsRes.success) {
        setClaims(claimsRes.data);
      }
      if (statsRes.success) {
        setStats(statsRes.data);
      }
    } catch (error) {
      console.error('خطأ في تحميل المطالبات:', error);
      toast({
        title: 'خطأ في التحميل',
        description: 'حدث خطأ في تحميل المطالبات',
        variant: 'error'
      });
      setClaims([]);
    } finally {
      setIsLoading(false);
    }
  };

  // معالجة تسجيل دفعة جديدة
  const handleRecordPayment = (claim: ClaimsTableData) => {
    setSelectedClaim(claim);
    setActiveModal('payment');
  };

  // حفظ الدفعة
  const handleSavePaymentToAPI = async (paymentData: any) => {
    setIsLoading(true);
    try {
      const result = await paymentsService.createPayment(paymentData);
      if (result.success) {
        toast({
          title: 'تم التسجيل بنجاح',
          description: 'تم تسجيل الدفعة بنجاح',
          variant: 'success'
        });
        setActiveModal(null);
        // إعادة تحميل المطالبات
        if (selectedCustomerId !== 'all') {
          await loadCustomerClaims(selectedCustomerId);
        }
      } else {
        toast({
          title: 'خطأ في التسجيل',
          description: result.message || 'حدث خطأ في تسجيل الدفعة',
          variant: 'error'
        });
      }
    } catch (error: any) {
      console.error('خطأ في تسجيل الدفعة:', error);
      toast({
        title: 'خطأ في التسجيل',
        description: error.response?.data?.message || 'حدث خطأ في تسجيل الدفعة',
        variant: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // معالجة إصدار إيصال
  const handleGenerateReceipt = (claim: ClaimsTableData) => {
    setSelectedClaim(claim);
    setActiveModal('receipt');
  };

  // معالجة عرض تفاصيل المطالبة
  const handleViewDetails = (claim: ClaimsTableData) => {
    setSelectedClaim(claim);
    setActiveModal('details');
  };

  // معالجة إرسال تذكير
  const handleSendReminder = async (claim: ClaimsTableData) => {
    setIsLoading(true);
    try {
      console.log('إرسال تذكير للعميل:', claim.customerName);
      setTimeout(() => {
        setIsLoading(false);
        alert(`تم إرسال تذكير للعميل ${claim.customerName} بنجاح`);
      }, 1000);
    } catch (error) {
      console.error('خطأ في إرسال التذكير:', error);
      setIsLoading(false);
      alert('حدث خطأ في إرسال التذكير');
    }
  };

  // معالجة إضافة تعليق
  const handleAddComment = (claim: ClaimsTableData) => {
    setSelectedClaim(claim);
    setActiveModal('comment');
  };

  // معالجة حفظ التعليق
  const handleSaveComment = async (data: {
    comment: string;
    hashtags: string[];
    lastContactDate: Date;
    nextContactDate: Date;
    contactMethod: string;
  }) => {
    setIsLoading(true);
    try {
      console.log('إضافة تعليق للمطالبة:', {
        claimId: selectedClaim?.id,
        content: data.comment,
        hashtags: data.hashtags,
        lastContactDate: data.lastContactDate,
        nextContactDate: data.nextContactDate,
        contactMethod: data.contactMethod,
      });
      
      setTimeout(() => {
        setIsLoading(false);
        setActiveModal(null);
        setSelectedClaim(null);
        alert(`تم إضافة التعليق بنجاح${data.hashtags.length > 0 ? ` مع ${data.hashtags.length} هاشتاج` : ''}`);
      }, 1000);
    } catch (error) {
      console.error('خطأ في إضافة التعليق:', error);
      setIsLoading(false);
      alert('حدث خطأ في إضافة التعليق');
    }
  };

  // معالجة حفظ الدفعة
  const handleSavePayment = async (paymentData: any) => {
    setIsLoading(true);
    try {
      console.log('حفظ الدفعة:', paymentData);
      setTimeout(() => {
        setIsLoading(false);
        setActiveModal(null);
        setSelectedClaim(null);
        alert('تم تسجيل الدفعة بنجاح');
      }, 1000);
    } catch (error) {
      console.error('خطأ في حفظ الدفعة:', error);
      setIsLoading(false);
      alert('حدث خطأ في حفظ الدفعة');
    }
  };

  // معالجة إصدار الإيصال
  const handleGenerateReceiptData = async (receiptData: any) => {
    setIsLoading(true);
    try {
      console.log('إصدار الإيصال:', receiptData);
      setTimeout(() => {
        setIsLoading(false);
        setActiveModal(null);
        setSelectedClaim(null);
        alert('تم إصدار الإيصال بنجاح');
      }, 1000);
    } catch (error) {
      console.error('خطأ في إصدار الإيصال:', error);
      setIsLoading(false);
      alert('حدث خطأ في إصدار الإيصال');
    }
  };

  // معالجة إغلاق النوافذ المنبثقة
  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedClaim(null);
  };

  // تحويل البيانات إلى تنسيق ClaimsTableData
  const claimsTableData = claims.map((claim: any) => ({
    id: claim.payment_id?.toString() || '',
    customerName: claim.customer_name || '',
    contractNumber: claim.contract_number || '',
    dueDate: new Date(claim.due_date),
    dueAmount: parseFloat(claim.amount || 0),
    paidAmount: 0,
    remainingAmount: parseFloat(claim.amount || 0),
    status: 'معلقة' as any,
    priority: claim.days_overdue > 30 ? 'عالية' : 'عادية' as any,
    lastContactDate: claim.last_contact_date ? new Date(claim.last_contact_date) : undefined,
    nextFollowUpDate: claim.next_follow_up_date ? new Date(claim.next_follow_up_date) : undefined,
    contactMethod: 'هاتف' as any,
    notes: claim.notes || '',
    paymentHistory: []
  }));

  return (
    <div className='space-y-6 -mx-4 md:-mx-6'>
      <div className="flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            المطالبات
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
              <option value="all">اختر عميل...</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} ({customer.customer_number})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <p className='text-gray-600 dark:text-gray-400 mt-2 px-4 md:px-6'>
        إدارة مطالبات العملاء والمبالغ المستحقة
      </p>

      {/* إحصائيات المطالبات */}
      <div className="space-y-6 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          <h2 className="text-xl font-semibold">إحصائيات المطالبات</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* إجمالي المطالبات */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[120px]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm text-gray-600 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
                  إجمالي المطالبات
                </h3>
                <div className="text-2xl font-bold text-[#58d2c8] group-hover:text-[#4AB8B3] transition-colors duration-300 font-tajawal">
                  {isLoading ? '...' : stats.total_claims}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {new Intl.NumberFormat('ar-SA').format(stats.total_amount)} ر.ع إجمالي
                </p>
              </div>
              <div className="p-2 bg-[#58d2c8]/10 rounded-lg group-hover:bg-[#58d2c8]/20 transition-all duration-300">
                <DollarSign className="h-6 w-6 text-[#58d2c8] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </div>

          {/* حالة المطالبات */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[120px]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm text-gray-600 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
                  حالة المطالبات
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm">مدفوعة</span>
                    </div>
                    <span className="text-sm font-medium text-[#58d2c8]">{stats.recent_claims || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm">متأخرة</span>
                    </div>
                    <span className="text-sm font-medium text-[#58d2c8]">{stats.overdue_claims || 0}</span>
                  </div>
                </div>
              </div>
              <div className="p-2 bg-[#58d2c8]/10 rounded-lg group-hover:bg-[#58d2c8]/20 transition-all duration-300">
                <TrendingUp className="h-6 w-6 text-[#58d2c8] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </div>

          {/* المطالبات المتأخرة والتنبيهات */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[120px]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm text-gray-600 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
                  التنبيهات والتحذيرات
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm">متأخرة</span>
                    </div>
                    <span className="text-sm font-medium text-[#58d2c8]">23</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">تحتاج متابعة</span>
                    </div>
                    <span className="text-sm font-medium text-[#58d2c8]">12</span>
                  </div>
                </div>
              </div>
              <div className="p-2 bg-[#58d2c8]/10 rounded-lg group-hover:bg-[#58d2c8]/20 transition-all duration-300">
                <AlertTriangle className="h-6 w-6 text-[#58d2c8] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* جدول المطالبات */}
      <div className="space-y-4 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <h2 className="text-xl font-semibold">قائمة المطالبات</h2>
        </div>
        <div className="w-full">
            <ClaimsTable
            data={mockClaimsData || []}
            onRecordPayment={handleRecordPayment}
            onGenerateReceipt={handleGenerateReceipt}
            onViewDetails={handleViewDetails}
            onSendReminder={handleSendReminder}
            onAddComment={handleAddComment}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* نوافذ منبثقة */}
      {activeModal === 'payment' && selectedClaim && (
        <PaymentModal
          claim={selectedClaim}
          onSave={handleSavePayment}
          onCancel={handleCloseModal}
          isLoading={isLoading}
        />
      )}

      {activeModal === 'receipt' && selectedClaim && (
        <ReceiptModal
          claim={selectedClaim}
          onGenerate={handleGenerateReceiptData}
          onCancel={handleCloseModal}
          isLoading={isLoading}
        />
      )}

      {activeModal === 'details' && selectedClaim && (
        <ClaimsDetailsModal
          claim={selectedClaim}
          onClose={handleCloseModal}
        />
      )}

      {activeModal === 'comment' && selectedClaim && (
        <CommentModal
          claim={selectedClaim}
          onSave={handleSaveComment}
          onCancel={handleCloseModal}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}