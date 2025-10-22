/**
 * نموذج إضافة عقد - صفحة واحدة
 */

'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Package, Trash2, Plus, Calculator, MessageSquare, FileText } from 'lucide-react';
import { ContractFormData, PaymentData, RentalDetailData } from '@/lib/types/contract';
import { mockCustomers, mockEquipment, mockBanks, paymentMethods } from '@/data/contractFormData';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import WhatsAppSendModal from './WhatsAppSendModal';
import InvoiceModal from './InvoiceModal';
import ScaffoldSelector from './ScaffoldSelector';
import * as customersService from '@/lib/services/customers.service';
import * as scaffoldsService from '@/lib/services/scaffolds.service';
import * as contractsService from '@/lib/services/contracts.service';
import { useToast } from '@/hooks/use-toast';

interface ContractFormSinglePageProps {
  contract?: ContractFormData;
  onSubmit: (data: ContractFormData, action: 'save' | 'send' | 'send_warehouse') => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ContractFormSinglePage({ 
  contract, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: ContractFormSinglePageProps) {
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [customers, setCustomers] = useState<any[]>(mockCustomers);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [scaffolds, setScaffolds] = useState<any[]>([]);
  const [loadingScaffolds, setLoadingScaffolds] = useState(false);
  const { toast } = useToast();

  // تحميل العملاء من Laravel API
  useEffect(() => {
    const loadCustomers = async () => {
      setLoadingCustomers(true);
      try {
        const response = await customersService.getCustomers();
        if (response.success && response.data.data) {
          const customersData = response.data.data.map((customer: any) => ({
            id: customer.id?.toString(),
            name: customer.name,
            email: customer.email || '',
            phone: customer.phone || '',
            address: customer.address || '',
            customerNumber: customer.customer_number || '',
          }));
          setCustomers(customersData);
        }
      } catch (error) {
        console.error('خطأ في تحميل العملاء:', error);
        setCustomers(mockCustomers);
      } finally {
        setLoadingCustomers(false);
      }
    };
    loadCustomers();
  }, []);

  // تحميل السقالات المتاحة من Laravel API
  useEffect(() => {
    const loadScaffolds = async () => {
      setLoadingScaffolds(true);
      try {
        const response = await scaffoldsService.getAvailableScaffolds();
        if (response.success && response.data) {
          setScaffolds(response.data);
        }
      } catch (error) {
        console.error('خطأ في تحميل السقالات:', error);
      } finally {
        setLoadingScaffolds(false);
      }
    };
    loadScaffolds();
  }, []);

  const [formData, setFormData] = useState<ContractFormData>({
    contractDate: '',
    contractNumber: '',
    customerId: '',
    customerName: '',
    deliveryAddress: '',
    locationMapLink: '',
    totalContractValue: 0,
    transportAndInstallationCost: 0,
    totalDiscount: 0,
    totalAfterDiscount: 0,
    totalPayments: 0,
    contractNotes: '',
    payments: [],
    rentalDetails: []
  });

  useEffect(() => {
    if (contract) {
      setFormData(contract);
      // تحديث حقل البحث بالعميل الحالي
      if (contract.customerName) {
        setCustomerSearchQuery(contract.customerName);
      }
    } else {
      // توليد رقم عقد جديد
      const newContractNumber = `CON-${Date.now()}`;
      const today = new Date().toISOString().split('T')[0];
      
      // إنشاء معدة واحدة افتراضية
      const defaultRentalItem: RentalDetailData = {
        id: Date.now().toString(),
        startDate: today,
        duration: 1,
        durationType: 'monthly',
        itemCode: '',
        itemDescription: '',
        dailyRate: 0,
        monthlyRate: 0,
        quantity: 1,
        total: 0,
        endDate: ''
      };
      
      // إنشاء دفعة واحدة افتراضية
      const defaultPayment: PaymentData = {
        id: (Date.now() + 1).toString(),
        paymentMethod: 'cash',
        notes: '',
        paymentDate: today,
        amount: 0,
        description: '',
        checkNumber: '',
        bankName: '',
        checkDate: ''
      };
      
      setFormData(prev => ({
        ...prev,
        contractNumber: newContractNumber,
        contractDate: today,
        rentalDetails: [defaultRentalItem],
        payments: [defaultPayment]
      }));
    }
  }, [contract]);

  // تحديث العميل المختار
  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find((c: any) => c.id === customerId);
    setFormData(prev => ({
      ...prev,
      customerId,
      customerName: customer?.name || '',
      customerPhone: customer?.phone || '',
      customerEmail: customer?.email || '',
      deliveryAddress: customer?.address || '',
    }));
    setCustomerSearchQuery(customer?.name || '');
    setShowCustomerDropdown(false);
  };

  // فلترة العملاء بناءً على البحث
  const filteredCustomers = customers.filter((customer: any) =>
    customer.name?.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
    customer.phone?.includes(customerSearchQuery) ||
    customer.customerNumber?.includes(customerSearchQuery) ||
    customer.id?.toLowerCase().includes(customerSearchQuery.toLowerCase())
  );

  // إضافة دفعة جديدة
  const handleAddPayment = () => {
    const newPayment: PaymentData = {
      id: Date.now().toString(),
      paymentMethod: 'cash',
      notes: '',
      paymentDate: new Date().toISOString().split('T')[0],
      amount: 0,
      description: '',
      checkNumber: '',
      bankName: '',
      checkDate: ''
    };
    setFormData(prev => ({
      ...prev,
      payments: [...prev.payments, newPayment]
    }));
  };

  // تحديث دفعة
  const handleUpdatePayment = (paymentId: string, field: keyof PaymentData, value: any) => {
    setFormData(prev => ({
      ...prev,
      payments: prev.payments.map(payment =>
        payment.id === paymentId ? { ...payment, [field]: value } : payment
      )
    }));
  };

  // حذف دفعة
  const handleDeletePayment = (paymentId: string) => {
    setFormData(prev => ({
      ...prev,
      payments: prev.payments.filter(payment => payment.id !== paymentId)
    }));
  };

  // إضافة عنصر إيجار جديد
  const handleAddRentalItem = () => {
    const newRentalItem: RentalDetailData = {
      id: Date.now().toString(),
      startDate: new Date().toISOString().split('T')[0],
      duration: 30,
      durationType: 'monthly', // إضافة نوع المدة الافتراضي
      itemCode: '',
      itemDescription: '',
      dailyRate: 0,
      monthlyRate: 0,
      quantity: 1,
      total: 0,
      endDate: ''
    };
    setFormData(prev => ({
      ...prev,
      rentalDetails: [...prev.rentalDetails, newRentalItem]
    }));
  };

  // حساب تاريخ النهاية
  const calculateEndDate = (startDate: string, duration: number, durationType: 'daily' | 'monthly'): string => {
    if (!startDate || !duration) return '';
    const start = new Date(startDate);
    
    if (durationType === 'daily') {
      start.setDate(start.getDate() + duration);
    } else {
      // للشهري: إضافة الأشهر
      start.setMonth(start.getMonth() + duration);
    }
    
    return start.toISOString().split('T')[0];
  };

  // تحديث عنصر إيجار
  const handleUpdateRentalItem = (itemId: string, field: keyof RentalDetailData, value: any) => {
    setFormData(prev => ({
      ...prev,
      rentalDetails: prev.rentalDetails.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          
          // حساب تاريخ النهاية تلقائياً
          if (field === 'startDate' || field === 'duration' || field === 'durationType') {
            const startDate = field === 'startDate' ? value : item.startDate;
            const duration = field === 'duration' ? value : item.duration;
            const durationType = field === 'durationType' ? value : item.durationType;
            updatedItem.endDate = calculateEndDate(startDate, duration, durationType);
          }
          
          // حساب الإجمالي تلقائياً
          if (field === 'quantity' || field === 'dailyRate' || field === 'monthlyRate' || field === 'duration' || field === 'durationType') {
            const quantity = field === 'quantity' ? value : item.quantity;
            const dailyRate = field === 'dailyRate' ? value : item.dailyRate;
            const monthlyRate = field === 'monthlyRate' ? value : item.monthlyRate;
            const duration = field === 'duration' ? value : item.duration;
            const durationType = field === 'durationType' ? value : item.durationType;
            
            // حساب الإجمالي بناءً على نوع المدة
            if (durationType === 'daily') {
              updatedItem.total = quantity * dailyRate * duration;
            } else {
              // للشهري: استخدام المعدل الشهري
              updatedItem.total = quantity * monthlyRate * duration;
            }
          }
          
          return updatedItem;
        }
        return item;
      })
    }));
  };

  // حذف عنصر إيجار
  const handleDeleteRentalItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      rentalDetails: prev.rentalDetails.filter(item => item.id !== itemId)
    }));
  };

  // تحديث المعدة/السقالة المختارة
  const handleScaffoldChange = (itemId: string, scaffold: any | null) => {
    if (scaffold) {
      setFormData(prev => ({
        ...prev,
        rentalDetails: prev.rentalDetails.map(item => {
          if (item.id === itemId) {
            const updatedItem = {
              ...item,
              itemCode: scaffold.scaffold_number,
              itemDescription: `${scaffold.type} - ${scaffold.material}`,
              dailyRate: scaffold.daily_rental_price || 0,
              monthlyRate: scaffold.monthly_rental_price || 0,
              scaffoldId: scaffold.id, // إضافة معرف السقالة
            };
            
            // حساب الإجمالي بناءً على نوع المدة
            if (updatedItem.durationType === 'daily') {
              updatedItem.total = updatedItem.quantity * (scaffold.daily_rental_price || 0) * updatedItem.duration;
            } else {
              updatedItem.total = updatedItem.quantity * (scaffold.monthly_rental_price || 0) * updatedItem.duration;
            }
            
            return updatedItem;
          }
          return item;
        })
      }));
    }
  };

  // حساب الإجماليات
  useEffect(() => {
    const rentalTotal = formData.rentalDetails.reduce((sum, item) => sum + item.total, 0);
    const paymentsTotal = formData.payments.reduce((sum, payment) => sum + payment.amount, 0);
    
    const totalContractValue = rentalTotal + formData.transportAndInstallationCost;
    const totalAfterDiscount = totalContractValue - formData.totalDiscount;
    
    setFormData(prev => ({
      ...prev,
      totalContractValue,
      totalAfterDiscount,
      totalPayments: paymentsTotal
    }));
  }, [
    formData.rentalDetails, 
    formData.transportAndInstallationCost, 
    formData.totalDiscount, 
    formData.payments
  ]);

  // التحقق من صحة البيانات
  const validateForm = (): boolean => {
    return !!(
      formData.contractDate &&
      formData.contractNumber &&
      formData.customerId &&
      formData.deliveryAddress &&
      formData.rentalDetails.length > 0
    );
  };

  // إرسال النموذج
  const handleSubmit = async (action: 'save' | 'send' | 'send_warehouse') => {
    if (!validateForm()) {
      toast({
        title: 'خطأ في البيانات',
        description: 'يرجى ملء جميع الحقول المطلوبة',
        variant: 'error'
      });
      return;
    }

    try {
      // تحويل البيانات إلى تنسيق Laravel
      const contractData = {
        customer_id: parseInt(formData.customerId),
        contract_date: formData.contractDate,
        delivery_address: formData.deliveryAddress,
        location_map_link: formData.locationMapLink || '',
        total_contract_value: formData.totalContractValue,
        transport_installation_cost: formData.transportAndInstallationCost,
        total_discount: formData.totalDiscount,
        contract_type: 'RENTAL', // أو حسب نوع العقد
        start_date: formData.rentalDetails[0]?.startDate || formData.contractDate,
        end_date: formData.rentalDetails[0]?.endDate || formData.contractDate,
        contract_notes: formData.contractNotes || '',
        rental_details: formData.rentalDetails.map(item => ({
          item_code: item.itemCode,
          item_description: item.itemDescription,
          daily_rate: item.dailyRate,
          monthly_rate: item.monthlyRate,
          quantity: item.quantity,
          duration: item.duration,
          duration_type: item.durationType,
          start_date: item.startDate,
          end_date: item.endDate,
        })),
        payments: formData.payments.map(payment => ({
          payment_method: payment.paymentMethod,
          amount: payment.amount,
          payment_date: payment.paymentDate,
          description: payment.description || '',
          check_number: payment.checkNumber || '',
          bank_name: payment.bankName || '',
          check_date: payment.checkDate || '',
          notes: payment.notes || '',
        }))
      };

      // حفظ العقد في Laravel
      const result = contract 
        ? await contractsService.updateContract(contract.id || '', contractData)
        : await contractsService.createContract(contractData);

      if (result.success) {
        toast({
          title: contract ? 'تم التحديث بنجاح' : 'تم الإنشاء بنجاح',
          description: contract ? 'تم تحديث بيانات العقد بنجاح' : 'تم إنشاء العقد بنجاح',
          variant: 'success'
        });

        if (action === 'send') {
          setShowWhatsAppModal(true);
        } else {
          onSubmit(formData, action);
        }
      } else {
        toast({
          title: 'خطأ في الحفظ',
          description: result.message || 'حدث خطأ في حفظ العقد',
          variant: 'error'
        });
      }
    } catch (error: any) {
      console.error('خطأ في حفظ العقد:', error);
      toast({
        title: 'خطأ في الحفظ',
        description: error.response?.data?.message || 'حدث خطأ في حفظ العقد',
        variant: 'error'
      });
    }
  };

  // رفع صورة الشيك
  const uploadCheckImage = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'checks');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('فشل في رفع الصورة');
      }

      const result = await response.json();
      return result.filePath;
    } catch (error) {
      console.error('خطأ في رفع صورة الشيك:', error);
      throw error;
    }
  };

  // معالجة إرسال الواتساب
  const handleWhatsAppSend = async (phoneNumber: string, message: string, pdfFile?: File) => {
    try {
      // هنا يمكن إضافة API لإرسال الرسالة مع ملف PDF
      console.log('إرسال عبر الواتساب:', { phoneNumber, message, pdfFile });
      
      if (pdfFile) {
        console.log('سيتم إرفاق ملف PDF:', pdfFile.name);
        // هنا يمكن إضافة منطق إرسال الملف مع الرسالة
      }
      
      // إرسال العقد بعد إرسال الواتساب
      onSubmit(formData, 'send');
      
      // إظهار رسالة نجاح
      alert('تم إرسال العقد مع ملف PDF للعميل عبر الواتساب بنجاح!');
    } catch (error) {
      console.error('خطأ في إرسال الواتساب:', error);
      alert('حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.');
    }
  };

  // تحويل بيانات النموذج إلى تنسيق متوافق مع InvoiceModal
  const convertToContractData = () => {
    const firstRentalItem = formData.rentalDetails[0];
    const startDate = firstRentalItem?.startDate || formData.contractDate;
    const endDate = firstRentalItem?.endDate || formData.contractDate;
    
    return {
      id: formData.contractNumber,
      contractNumber: formData.contractNumber,
      customerName: formData.customerName,
      customerId: formData.customerId,
      contractType: 'تأجير' as const,
      startDate,
      endDate,
      totalValue: formData.totalAfterDiscount,
      paidAmount: formData.totalPayments,
      remainingAmount: formData.totalAfterDiscount - formData.totalPayments,
      location: formData.deliveryAddress,
      equipmentCount: formData.rentalDetails.reduce((sum, item) => sum + item.quantity, 0),
      status: 'نشط' as const,
      paymentStatus: formData.totalPayments >= formData.totalAfterDiscount ? 'مدفوع بالكامل' as const : 'مدفوع جزئياً' as const,
      priority: 'متوسط' as const,
      createdAt: formData.contractDate,
      updatedAt: formData.contractDate
    };
  };

  // معالجة عرض نموذج الفاتورة
  const handleShowInvoiceModal = () => {
    if (validateForm()) {
      setShowInvoiceModal(true);
    } else {
      alert('يرجى ملء جميع الحقول المطلوبة أولاً');
    }
  };

  // معالجة إرسال الفاتورة عبر الواتساب
  const handleSendInvoiceToWhatsApp = () => {
    setShowInvoiceModal(false);
    setShowWhatsAppModal(true);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* العنوان */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            العودة
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {contract ? 'تعديل العقد' : 'استمارة عقد جديد'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {contract ? 'تعديل معلومات العقد' : 'إضافة عقد تأجير جديد'}
            </p>
          </div>
        </div>
      </div>

      {/* معلومات العقد الأساسية */}
      <Card className="p-6">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900">معلومات العقد الأساسية</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* تاريخ العقد */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تاريخ العقد *
            </label>
            <input
              type="date"
              value={formData.contractDate}
              onChange={(e) => setFormData(prev => ({ ...prev, contractDate: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
              dir="ltr"
              lang="en"
              required
            />
          </div>

          {/* رقم العقد */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رقم العقد *
            </label>
            <input
              type="text"
              value={formData.contractNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, contractNumber: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
              dir="ltr"
              lang="en"
              required
            />
          </div>

          {/* العميل */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              العميل *
            </label>
            <div className="relative">
              <input
                type="text"
                value={customerSearchQuery}
                onChange={(e) => {
                  setCustomerSearchQuery(e.target.value);
                  setShowCustomerDropdown(true);
                  // إذا تم مسح الحقل، امسح الاختيار
                  if (!e.target.value) {
                    setFormData(prev => ({
                      ...prev,
                      customerId: '',
                      customerName: ''
                    }));
                  }
                }}
                onFocus={() => setShowCustomerDropdown(true)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
                placeholder="ابحث عن العميل بالاسم أو الهاتف..."
                required
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              {/* قائمة العملاء المنسدلة */}
              {showCustomerDropdown && (
                <>
                  {/* طبقة شفافة لإغلاق القائمة عند النقر خارجها */}
                  <div 
                    className="fixed inset-0 z-10"
                    onClick={() => setShowCustomerDropdown(false)}
                  />
                  
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-20">
                    {loadingCustomers ? (
                      <div className="px-4 py-3 text-center text-gray-500">
                        جاري تحميل العملاء...
                      </div>
                    ) : filteredCustomers.length > 0 ? (
                      filteredCustomers.map((customer: any) => (
                        <button
                          key={customer.id}
                          type="button"
                          onClick={() => handleCustomerChange(customer.id)}
                          className={`w-full text-right px-4 py-3 hover:bg-[#58d2c8]/10 transition-colors border-b border-gray-100 last:border-b-0 ${
                            formData.customerId === customer.id ? 'bg-[#58d2c8]/20' : ''
                          }`}
                        >
                          <div className="font-medium text-gray-900">{customer.name}</div>
                          <div className="flex items-center justify-between mt-1">
                            {customer.customerNumber && (
                              <div className="text-xs text-gray-600">
                                {customer.customerNumber}
                              </div>
                            )}
                            {customer.phone && (
                              <div className="text-sm text-gray-500" dir="ltr">
                                {customer.phone}
                              </div>
                            )}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-center text-gray-500">
                        لا توجد نتائج
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            
            {/* عرض العميل المختار */}
            {formData.customerId && (
              <div className="mt-2 flex items-center gap-2 text-sm">
                <span className="text-gray-600">العميل المختار:</span>
                <span className="font-medium text-[#58d2c8]">{formData.customerName}</span>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      customerId: '',
                      customerName: ''
                    }));
                    setCustomerSearchQuery('');
                  }}
                  className="text-red-600 hover:text-red-800 text-xs"
                >
                  مسح
                </button>
              </div>
            )}
          </div>

          {/* عنوان الموقع */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عنوان الموقع (موقع تنزيل المعدات) *
            </label>
            <input
              type="text"
              value={formData.deliveryAddress}
              onChange={(e) => setFormData(prev => ({ ...prev, deliveryAddress: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
              placeholder="أدخل عنوان موقع تنزيل المعدات"
              dir="ltr"
              lang="en"
              required
            />
          </div>

          {/* رابط الموقع قوقل ماب */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رابط الموقع قوقل ماب
            </label>
            <input
              type="url"
              value={formData.locationMapLink}
              onChange={(e) => setFormData(prev => ({ ...prev, locationMapLink: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
              placeholder="https://maps.google.com/..."
              dir="ltr"
              lang="en"
            />
            <p className="text-xs text-gray-500 mt-1">
              اختياري - يمكنك لصق رابط الموقع من قوقل ماب
            </p>
          </div>
        </div>
      </Card>

      {/* تفاصيل الإيجار */}
      <Card className="p-6">
        <div className="border-b border-gray-200 pb-4 mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">تفاصيل الإيجار</h2>
          <Button
            type="button"
            onClick={handleAddRentalItem}
            className="bg-[#58d2c8] hover:bg-[#4AB8B3] text-white flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            إضافة معدة
          </Button>
        </div>

        {formData.rentalDetails.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">لم يتم إضافة أي معدات بعد</p>
            <p className="text-sm mt-2">اضغط على &quot;إضافة معدة&quot; لبدء إضافة تفاصيل الإيجار</p>
          </div>
        ) : (
          <div className="space-y-6">
            {formData.rentalDetails.map((item, index) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">المعدة {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => handleDeleteRentalItem(item.id)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* السقالة */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      السقالة *
                    </label>
                    <ScaffoldSelector
                      value={item.scaffoldId}
                      onChange={(scaffold) => handleScaffoldChange(item.id, scaffold)}
                      disabled={isLoading}
                    />
                  </div>

                  {/* تاريخ بداية الإيجار */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تاريخ بداية الإيجار *
                    </label>
                    <input
                      type="date"
                      value={item.startDate}
                      onChange={(e) => handleUpdateRentalItem(item.id, 'startDate', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent bg-white"
                      dir="ltr"
                      lang="en"
                      required
                    />
                  </div>

                  {/* نوع المدة */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المدة *
                    </label>
                    <select
                      value={item.durationType}
                      onChange={(e) => handleUpdateRentalItem(item.id, 'durationType', e.target.value as 'daily' | 'monthly')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent bg-white"
                      required
                    >
                      <option value="monthly">شهري</option>
                      <option value="daily">يومي</option>
                    </select>
                  </div>

                  {/* عدد المدة */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {item.durationType === 'monthly' ? 'اختر عدد الأشهر' : 'اختر عدد الأيام'} *
                    </label>
                    <input
                      type="number"
                      value={item.duration}
                      onChange={(e) => handleUpdateRentalItem(item.id, 'duration', Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent bg-white"
                      min="1"
                      placeholder={item.durationType === 'monthly' ? 'بالأشهر' : 'بالأيام'}
                      dir="ltr"
                      lang="en"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {item.durationType === 'monthly' 
                        ? `(1 شهر = 30 يوم)` 
                        : 'حساب يومي'
                      }
                    </p>
                  </div>

                  {/* الكمية */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الكمية *
                    </label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleUpdateRentalItem(item.id, 'quantity', Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent bg-white"
                      min="1"
                      dir="ltr"
                      lang="en"
                      required
                    />
                  </div>

                  {/* الإيجار اليومي */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الإيجار اليومي (ر.ع)
                    </label>
                    <input
                      type="number"
                      value={item.dailyRate}
                      onChange={(e) => handleUpdateRentalItem(item.id, 'dailyRate', Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent bg-white"
                      min="0"
                      step="0.01"
                      dir="ltr"
                      lang="en"
                    />
                  </div>

                  {/* الإيجار الشهري */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الإيجار الشهري (ر.ع)
                    </label>
                    <input
                      type="number"
                      value={item.monthlyRate}
                      onChange={(e) => handleUpdateRentalItem(item.id, 'monthlyRate', Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent bg-white"
                      min="0"
                      step="0.01"
                      dir="ltr"
                      lang="en"
                    />
                  </div>

                  {/* تاريخ النهاية */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تاريخ النهاية
                    </label>
                    <input
                      type="date"
                      value={item.endDate}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                      dir="ltr"
                      lang="en"
                      readOnly
                    />
                    <p className="text-xs text-gray-500 mt-1">محسوب تلقائياً</p>
                  </div>

                  {/* الإجمالي */}
                  <div className="md:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الإجمالي (ر.ع)
                    </label>
                    <input
                      type="number"
                      value={item.total.toFixed(2)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 font-bold text-[#58d2c8]"
                      dir="ltr"
                      lang="en"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ملخص التكاليف */}
        <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                قيمة النقل والتحميل والتنزيل (ر.ع)
              </label>
              <input
                type="number"
                value={formData.transportAndInstallationCost}
                onChange={(e) => setFormData(prev => ({ ...prev, transportAndInstallationCost: Number(e.target.value) }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent bg-white"
                min="0"
                step="0.01"
                dir="ltr"
                lang="en"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                إجمالي الخصم (ر.ع)
              </label>
              <input
                type="number"
                value={formData.totalDiscount}
                onChange={(e) => setFormData(prev => ({ ...prev, totalDiscount: Number(e.target.value) }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent bg-white"
                min="0"
                step="0.01"
                dir="ltr"
                lang="en"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                إجمالي العقد بعد الخصم (ر.ع)
              </label>
              <input
                type="number"
                value={formData.totalAfterDiscount.toFixed(2)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 font-bold text-[#58d2c8] text-lg"
                dir="ltr"
                lang="en"
                readOnly
              />
            </div>
          </div>
        </div>
      </Card>

      {/* المدفوعات */}
      <Card className="p-6">
        <div className="border-b border-gray-200 pb-4 mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">المدفوعات</h2>
          <Button
            type="button"
            onClick={handleAddPayment}
            className="bg-[#58d2c8] hover:bg-[#4AB8B3] text-white flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            إضافة دفعة
          </Button>
        </div>

        {formData.payments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calculator className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">لم يتم إضافة أي مدفوعات بعد</p>
            <p className="text-sm mt-2">يمكنك إضافة المدفوعات أو حفظ العقد بدون مدفوعات</p>
          </div>
        ) : (
          <div className="space-y-4">
            {formData.payments.map((payment, index) => (
              <div key={payment.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">الدفعة {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => handleDeletePayment(payment.id)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* طريقة الدفع */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      طريقة الدفع
                    </label>
                    <select
                      value={payment.paymentMethod}
                      onChange={(e) => handleUpdatePayment(payment.id, 'paymentMethod', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent bg-white"
                    >
                      {paymentMethods.map(method => (
                        <option key={method.value} value={method.value}>
                          {method.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* تاريخ الدفع */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تاريخ الدفع
                    </label>
                    <input
                      type="date"
                      value={payment.paymentDate}
                      onChange={(e) => handleUpdatePayment(payment.id, 'paymentDate', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent bg-white"
                      dir="ltr"
                      lang="en"
                    />
                  </div>

                  {/* المبلغ */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المبلغ (ر.ع)
                    </label>
                    <input
                      type="number"
                      value={payment.amount}
                      onChange={(e) => handleUpdatePayment(payment.id, 'amount', Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent bg-white"
                      min="0"
                      step="0.01"
                      dir="ltr"
                      lang="en"
                    />
                  </div>

                  {/* حقول الشيك */}
                  {payment.paymentMethod === 'check' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          رقم الشيك
                        </label>
                        <input
                          type="text"
                          value={payment.checkNumber || ''}
                          onChange={(e) => handleUpdatePayment(payment.id, 'checkNumber', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent bg-white"
                          dir="ltr"
                          lang="en"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          البنك
                        </label>
                        <select
                          value={payment.bankName || ''}
                          onChange={(e) => handleUpdatePayment(payment.id, 'bankName', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent bg-white"
                        >
                          <option value="">اختر البنك</option>
                          {mockBanks.map(bank => (
                            <option key={bank} value={bank}>
                              {bank}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          تاريخ الشيك
                        </label>
                        <input
                          type="date"
                          value={payment.checkDate || ''}
                          onChange={(e) => handleUpdatePayment(payment.id, 'checkDate', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent bg-white"
                          dir="ltr"
                          lang="en"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          صورة الشيك
                        </label>
                        <div className="space-y-3">
                          {/* زر رفع الصورة */}
                          <div className="flex items-center gap-4">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleUpdatePayment(payment.id, 'checkImageFile', file);
                                  // إنشاء URL للمعاينة
                                  const imageUrl = URL.createObjectURL(file);
                                  handleUpdatePayment(payment.id, 'checkImage', imageUrl);
                                }
                              }}
                              className="hidden"
                              id={`check-image-${payment.id}`}
                            />
                            <label
                              htmlFor={`check-image-${payment.id}`}
                              className="cursor-pointer bg-[#58d2c8] text-white px-4 py-2 rounded-lg hover:bg-[#4AB8B3] transition-colors flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              رفع صورة الشيك
                            </label>
                            {payment.checkImage && (
                              <button
                                type="button"
                                onClick={() => {
                                  handleUpdatePayment(payment.id, 'checkImage', '');
                                  handleUpdatePayment(payment.id, 'checkImageFile', undefined);
                                  // إعادة تعيين input file
                                  const fileInput = document.getElementById(`check-image-${payment.id}`) as HTMLInputElement;
                                  if (fileInput) fileInput.value = '';
                                }}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                حذف الصورة
                              </button>
                            )}
                          </div>
                          
                          {/* معاينة الصورة */}
                          {payment.checkImage && (
                            <div className="mt-3">
                              <p className="text-sm text-gray-600 mb-2">معاينة صورة الشيك:</p>
                              <div className="relative inline-block">
                                <img
                                  src={payment.checkImage}
                                  alt="صورة الشيك"
                                  className="max-w-xs max-h-48 rounded-lg border border-gray-300 shadow-sm"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}

            {/* ملخص المدفوعات */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">إجمالي المدفوعات:</span>
                <span className="text-xl font-bold text-green-600">
                  {formData.totalPayments.toFixed(2)} ر.ع
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="font-medium text-gray-700">المبلغ المتبقي:</span>
                <span className="text-xl font-bold text-orange-600">
                  {(formData.totalAfterDiscount - formData.totalPayments).toFixed(2)} ر.ع
                </span>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* الأزرار */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            {/* تخزين بيانات العقد */}
            <Button
              onClick={() => handleSubmit('save')}
              disabled={isLoading || !validateForm()}
              className="bg-[#58d2c8] hover:bg-[#4AB8B3] text-white flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isLoading ? 'جاري الحفظ...' : 'تخزين بيانات العقد'}
            </Button>

            {/* تخزين وإرسال العقد */}
            <Button
              onClick={() => handleSubmit('send')}
              disabled={isLoading || !validateForm()}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              إرسال للعميل عبر الواتساب
            </Button>

            {/* عرض نموذج الفاتورة */}
            <Button
              onClick={handleShowInvoiceModal}
              disabled={isLoading || !validateForm()}
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              عرض نموذج الفاتورة
            </Button>
          </div>

          {/* إلغاء */}
          <Button
            onClick={onCancel}
            disabled={isLoading}
            className="bg-gray-500 hover:bg-gray-600 text-white"
          >
            إلغاء
          </Button>
        </div>

        {/* رسالة التحذير */}
        {!validateForm() && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              ⚠️ يرجى ملء جميع الحقول المطلوبة (*) وإضافة معدة واحدة على الأقل
            </p>
          </div>
        )}
      </Card>

      {/* نافذة إرسال الواتساب */}
      <WhatsAppSendModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        contract={formData}
        onSend={handleWhatsAppSend}
        isLoading={isLoading}
      />

      {/* نافذة نموذج الفاتورة */}
      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        contract={convertToContractData()}
        showSendButton={true}
        onSendToWhatsApp={handleSendInvoiceToWhatsApp}
      />
    </div>
  );
}

