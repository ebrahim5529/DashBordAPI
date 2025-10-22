/**
 * صفحة إدارة المدفوعات
 * إدارة شاملة للأقساط والمدفوعات مع المدخلات والجداول والتحليلات
 */

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import {
  Plus,
  Edit,
  Trash2,
  Clock,
  Search,
  Filter,
  Eye,
  CheckCircle,
  AlertCircle,
  FileText,
  TrendingUp,
  MessageSquare,
  Pause,
  Play,
} from 'lucide-react';

// بيانات وهمية للأقساط
const installmentData = [
  {
    id: '001',
    contractNumber: 'CON-2024-001',
    customerName: 'شركة الندى',
    totalAmount: 60000,
    installmentAmount: 5000,
    dueDate: '2025-11-01',
    status: 'paid',
    paidDate: '2025-10-30',
    remainingBalance: 0,
    paymentMethod: 'تحويل بنكي',
    employee: 'أحمد محمد',
    notes: 'دفع مبكر',
  },
  {
    id: '002',
    contractNumber: 'CON-2024-001',
    customerName: 'شركة الندى',
    totalAmount: 60000,
    installmentAmount: 5000,
    dueDate: '2025-12-01',
    status: 'overdue',
    paidDate: null,
    remainingBalance: 5000,
    paymentMethod: null,
    employee: 'أحمد محمد',
    notes: 'متأخر 3 أيام',
  },
  {
    id: '003',
    contractNumber: 'CON-2024-002',
    customerName: 'أحمد علي',
    totalAmount: 24000,
    installmentAmount: 2000,
    dueDate: '2025-11-05',
    status: 'upcoming',
    paidDate: null,
    remainingBalance: 2000,
    paymentMethod: null,
    employee: 'سارة أحمد',
    notes: 'قسط قادم',
  },
  {
    id: '004',
    contractNumber: 'CON-2024-003',
    customerName: 'فندق الوردة',
    totalAmount: 120000,
    installmentAmount: 10000,
    dueDate: '2025-10-28',
    status: 'paid',
    paidDate: '2025-10-28',
    remainingBalance: 0,
    paymentMethod: 'بطاقة ائتمانية',
    employee: 'محمد السعيد',
    notes: 'دفع في الموعد',
  },
];

// بيانات وهمية للعملاء والعقود
const customersData = [
  { id: '1', name: 'شركة الندى', contractNumber: 'CON-2024-001' },
  { id: '2', name: 'أحمد علي', contractNumber: 'CON-2024-002' },
  { id: '3', name: 'فندق الوردة', contractNumber: 'CON-2024-003' },
  { id: '4', name: 'مؤسسة البناء الحديث', contractNumber: 'CON-2024-004' },
];

// بيانات وهمية لطرق الدفع
const paymentMethodsData = [
  { id: '1', name: 'تحويل بنكي', status: 'active' },
  { id: '2', name: 'بطاقة ائتمانية', status: 'active' },
  { id: '3', name: 'نقدي', status: 'active' },
  { id: '4', name: 'خصم تلقائي', status: 'inactive' },
];

// بيانات وهمية للموظفين
const employeesData = [
  { id: '1', name: 'أحمد محمد علي', position: 'مدير المبيعات', department: 'المبيعات', phone: '+966501234567' },
  { id: '2', name: 'سارة أحمد السعيد', position: 'محاسب', department: 'المحاسبة', phone: '+966501234568' },
  { id: '3', name: 'محمد السعيد', position: 'مشرف التحصيل', department: 'التحصيل', phone: '+966501234569' },
  { id: '4', name: 'فاطمة عبدالله', position: 'مساعد إداري', department: 'الإدارة', phone: '+966501234570' },
  { id: '5', name: 'عبدالرحمن محمد', position: 'محلل مالي', department: 'المالية', phone: '+966501234571' },
  { id: '6', name: 'نورا أحمد', position: 'مستشار عملاء', department: 'خدمة العملاء', phone: '+966501234572' },
];

export default function InstallmentPlansPage() {
  const [viewMode, setViewMode] = useState<'list' | 'form' | 'details'>('list');
  const [selectedInstallment, setSelectedInstallment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // حالات القوائم المنسدلة
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showContractDropdown, setShowContractDropdown] = useState(false);
  const [showPaymentMethodDropdown, setShowPaymentMethodDropdown] = useState(false);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  
  // مصطلحات البحث
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [contractSearchTerm, setContractSearchTerm] = useState('');
  const [paymentMethodSearchTerm, setPaymentMethodSearchTerm] = useState('');
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');

  // تصفية البيانات حسب البحث
  const filteredCustomers = customersData.filter(customer =>
    customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase())
  );
  
  const filteredContracts = customersData.filter(customer =>
    customer.contractNumber.toLowerCase().includes(contractSearchTerm.toLowerCase()) ||
    customer.name.toLowerCase().includes(contractSearchTerm.toLowerCase())
  );
  
  const filteredPaymentMethods = paymentMethodsData.filter(method =>
    method.name.toLowerCase().includes(paymentMethodSearchTerm.toLowerCase())
  );
  
  const filteredEmployees = employeesData.filter(employee =>
    employee.name.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(employeeSearchTerm.toLowerCase())
  );

  // معالجة إضافة قسط جديد
  const handleAddInstallment = () => {
    setSelectedInstallment(null);
    setViewMode('form');
  };

  // معالجة اختيار العميل
  const handleSelectCustomer = (_customer: any) => {
    setShowCustomerDropdown(false);
    setCustomerSearchTerm('');
  };

  // معالجة اختيار العقد
  const handleSelectContract = (_contract: any) => {
    setShowContractDropdown(false);
    setContractSearchTerm('');
  };

  // معالجة اختيار طريقة الدفع
  const handleSelectPaymentMethod = (_method: any) => {
    setShowPaymentMethodDropdown(false);
    setPaymentMethodSearchTerm('');
  };

  // معالجة اختيار الموظف
  const handleSelectEmployee = (_employee: any) => {
    setShowEmployeeDropdown(false);
    setEmployeeSearchTerm('');
  };

  // إغلاق القوائم المنسدلة عند النقر خارجها
  const handleClickOutside = (event: any) => {
    if (!event.target.closest('.customer-dropdown')) {
      setShowCustomerDropdown(false);
    }
    if (!event.target.closest('.contract-dropdown')) {
      setShowContractDropdown(false);
    }
    if (!event.target.closest('.payment-method-dropdown')) {
      setShowPaymentMethodDropdown(false);
    }
    if (!event.target.closest('.employee-dropdown')) {
      setShowEmployeeDropdown(false);
    }
  };

  // إضافة مستمع الحدث عند تحميل المكون
  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // معالجة تعديل قسط
  const handleEditInstallment = (installment: any) => {
    setSelectedInstallment(installment);
    setViewMode('form');
  };

  // معالجة حذف قسط
  const handleDeleteInstallment = async (installment: any) => {
    if (window.confirm(`هل أنت متأكد من حذف القسط رقم "${installment.id}"؟`)) {
      setIsLoading(true);
      try {
        // منطق الحذف
        setTimeout(() => {
          setIsLoading(false);
          alert('تم الحذف بنجاح');
        }, 1000);
      } catch (error) {
        console.error('خطأ في الحذف:', error);
        setIsLoading(false);
        alert('حدث خطأ في الحذف');
      }
    }
  };

  // معالجة تأكيد الدفع
  const handleMarkAsPaid = async (_installment: any) => {
    setIsLoading(true);
    try {
      // منطق تأكيد الدفع
      setTimeout(() => {
        setIsLoading(false);
        alert('تم تأكيد الدفع بنجاح');
      }, 1000);
    } catch (error) {
      console.error('خطأ في تأكيد الدفع:', error);
      setIsLoading(false);
      alert('حدث خطأ في تأكيد الدفع');
    }
  };

  // معالجة إرسال تذكير
  const handleSendReminder = async (_installment: any) => {
    setIsLoading(true);
    try {
      // منطق إرسال التذكير
      setTimeout(() => {
        setIsLoading(false);
        alert('تم إرسال التذكير بنجاح');
      }, 1000);
    } catch (error) {
      console.error('خطأ في إرسال التذكير:', error);
      setIsLoading(false);
      alert('حدث خطأ في إرسال التذكير');
    }
  };

  // معالجة تجميد/إلغاء تجميد القسط
  const handleToggleFreeze = async (_installment: any) => {
    setIsLoading(true);
    try {
      // منطق التجميد/إلغاء التجميد
      setTimeout(() => {
        setIsLoading(false);
        alert('تم تغيير حالة القسط بنجاح');
      }, 1000);
    } catch (error) {
      console.error('خطأ في تغيير الحالة:', error);
      setIsLoading(false);
      alert('حدث خطأ في تغيير الحالة');
    }
  };

  // معالجة عرض التفاصيل
  const handleViewDetails = (installment: any) => {
    setSelectedInstallment(installment);
    setViewMode('details');
  };

  // معالجة تصدير البيانات
  const _handleExportData = () => {
    // منطق التصدير
    alert('تم تصدير البيانات بنجاح');
  };

  // فلترة البيانات
  const filteredData = installmentData.filter(item => {
    const matchesSearch = item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.contractNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // حساب الإحصائيات
  const stats = {
    total: installmentData.length,
    paid: installmentData.filter(item => item.status === 'paid').length,
    overdue: installmentData.filter(item => item.status === 'overdue').length,
    upcoming: installmentData.filter(item => item.status === 'upcoming').length,
    totalAmount: installmentData.reduce((sum, item) => sum + item.totalAmount, 0),
    paidAmount: installmentData.filter(item => item.status === 'paid').reduce((sum, item) => sum + item.installmentAmount, 0),
    remainingAmount: installmentData.reduce((sum, item) => sum + item.remainingBalance, 0),
  };

  // عرض نموذج إضافة/تعديل القسط
  if (viewMode === 'form') {
    return (
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
              {selectedInstallment ? 'تعديل القسط' : 'إضافة قسط جديد'}
            </h1>
            <p className='text-gray-600 dark:text-gray-400 mt-1'>
              {selectedInstallment ? 'تعديل بيانات القسط' : 'إضافة قسط جديد للنظام'}
            </p>
          </div>
          <Button 
            variant='outline' 
            onClick={() => setViewMode('list')}
          >
            العودة للقائمة
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>بيانات القسط</CardTitle>
            <CardDescription>أدخل بيانات القسط المطلوبة</CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* رقم العقد */}
              <div className="relative contract-dropdown">
                <label className='block text-sm font-medium mb-2'>رقم العقد</label>
                <div className="relative">
                  <input
                    type="text"
                    value={contractSearchTerm}
                    onChange={(e) => {
                      setContractSearchTerm(e.target.value);
                      setShowContractDropdown(true);
                    }}
                    onFocus={() => setShowContractDropdown(true)}
                    className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500'
                    placeholder="ابحث عن العقد..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowContractDropdown(!showContractDropdown)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                
                {/* قائمة العقود المفلترة */}
                {showContractDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredContracts.length > 0 ? (
                      filteredContracts.map((contract) => (
                        <div
                          key={contract.id}
                          onClick={() => handleSelectContract(contract)}
                          className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {contract.contractNumber}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {contract.name}
                              </div>
                            </div>
                            <div className="text-xs text-gray-400">
                              📄
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                        لا توجد نتائج
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* اسم العميل */}
              <div className="relative customer-dropdown">
                <label className='block text-sm font-medium mb-2'>اسم العميل/الشركة</label>
                <div className="relative">
                  <input
                    type="text"
                    value={customerSearchTerm}
                    onChange={(e) => {
                      setCustomerSearchTerm(e.target.value);
                      setShowCustomerDropdown(true);
                    }}
                    onFocus={() => setShowCustomerDropdown(true)}
                    className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500'
                    placeholder="ابحث عن العميل..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowCustomerDropdown(!showCustomerDropdown)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                
                {/* قائمة العملاء المفلترة */}
                {showCustomerDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map((customer) => (
                        <div
                          key={customer.id}
                          onClick={() => handleSelectCustomer(customer)}
                          className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {customer.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {customer.contractNumber}
                              </div>
                            </div>
                            <div className="text-xs text-gray-400">
                              👤
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                        لا توجد نتائج
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* المبلغ الإجمالي */}
              <div>
                <label className='block text-sm font-medium mb-2'>المبلغ الإجمالي</label>
                <input 
                  type='number' 
                  className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500'
                  placeholder='أدخل المبلغ الإجمالي'
                />
              </div>

              {/* عدد المدفوعات */}
              <div>
                <label className='block text-sm font-medium mb-2'>عدد المدفوعات</label>
                <input 
                  type='number' 
                  className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500'
                  placeholder='عدد المدفوعات'
                />
              </div>

              {/* قيمة كل قسط */}
              <div>
                <label className='block text-sm font-medium mb-2'>قيمة كل قسط</label>
                <input 
                  type='number' 
                  className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500'
                  placeholder='قيمة القسط'
                />
              </div>

              {/* تاريخ البداية */}
              <div>
                <label className='block text-sm font-medium mb-2'>تاريخ البداية</label>
                <input 
                  type='date' 
                  className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500'
                />
              </div>

              {/* الفاصل الزمني */}
              <div>
                <label className='block text-sm font-medium mb-2'>الفاصل الزمني</label>
                <select className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500'>
                  <option value='monthly'>شهري</option>
                  <option value='weekly'>أسبوعي</option>
                  <option value='bi-weekly'>نصف شهري</option>
                </select>
              </div>

              {/* حالة القسط */}
              <div>
                <label className='block text-sm font-medium mb-2'>حالة القسط</label>
                <select className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500'>
                  <option value='active'>نشط</option>
                  <option value='completed'>مكتمل</option>
                  <option value='overdue'>متأخر</option>
                  <option value='cancelled'>ملغى</option>
                </select>
              </div>

              {/* طريقة الدفع */}
              <div className="relative payment-method-dropdown">
                <label className='block text-sm font-medium mb-2'>طريقة الدفع</label>
                <div className="relative">
                  <input
                    type="text"
                    value={paymentMethodSearchTerm}
                    onChange={(e) => {
                      setPaymentMethodSearchTerm(e.target.value);
                      setShowPaymentMethodDropdown(true);
                    }}
                    onFocus={() => setShowPaymentMethodDropdown(true)}
                    className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500'
                    placeholder="ابحث عن طريقة الدفع..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowPaymentMethodDropdown(!showPaymentMethodDropdown)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                
                {/* قائمة طرق الدفع المفلترة */}
                {showPaymentMethodDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredPaymentMethods.length > 0 ? (
                      filteredPaymentMethods.map((method) => (
                        <div
                          key={method.id}
                          onClick={() => handleSelectPaymentMethod(method)}
                          className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {method.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {method.status === 'active' ? 'نشط' : 'غير نشط'}
                              </div>
                            </div>
                            <div className="text-xs text-gray-400">
                              💳
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                        لا توجد نتائج
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* الموظف المسؤول */}
              <div className="relative employee-dropdown">
                <label className='block text-sm font-medium mb-2'>الموظف المسؤول</label>
                <div className="relative">
                  <input
                    type="text"
                    value={employeeSearchTerm}
                    onChange={(e) => {
                      setEmployeeSearchTerm(e.target.value);
                      setShowEmployeeDropdown(true);
                    }}
                    onFocus={() => setShowEmployeeDropdown(true)}
                    className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500'
                    placeholder="ابحث عن الموظف..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmployeeDropdown(!showEmployeeDropdown)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                
                {/* قائمة الموظفين المفلترة */}
                {showEmployeeDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredEmployees.length > 0 ? (
                      filteredEmployees.map((employee) => (
                        <div
                          key={employee.id}
                          onClick={() => handleSelectEmployee(employee)}
                          className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {employee.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {employee.position} • {employee.department}
                              </div>
                            </div>
                            <div className="text-xs text-gray-400">
                              👨‍💼
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                        لا توجد نتائج
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ملاحظات إدارية */}
            <div>
              <label className='block text-sm font-medium mb-2'>ملاحظات إدارية</label>
              <textarea 
                className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500'
                rows={3}
                placeholder='أي تفاصيل إضافية (مثل خصم أو تمديد)'
              />
            </div>

            {/* أزرار الحفظ */}
            <div className='flex justify-end space-x-3 rtl:space-x-reverse'>
              <Button variant='outline' onClick={() => setViewMode('list')}>
                إلغاء
              </Button>
              <Button onClick={() => {
                alert('تم حفظ القسط بنجاح');
                setViewMode('list');
              }}>
                {selectedInstallment ? 'تحديث' : 'حفظ'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // عرض تفاصيل القسط
  if (viewMode === 'details' && selectedInstallment) {
    return (
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
              تفاصيل القسط #{selectedInstallment.id}
            </h1>
            <p className='text-gray-600 dark:text-gray-400 mt-1'>
              {selectedInstallment.customerName} - {selectedInstallment.contractNumber}
            </p>
          </div>
          <Button 
            variant='outline' 
            onClick={() => setViewMode('list')}
          >
            العودة للقائمة
          </Button>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* تفاصيل القسط */}
          <div className='lg:col-span-2'>
            <Card>
              <CardHeader>
                <CardTitle>تفاصيل القسط</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='text-sm font-medium text-gray-500'>رقم القسط</label>
                    <p className='text-lg font-semibold'>{selectedInstallment.id}</p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-500'>رقم العقد</label>
                    <p className='text-lg font-semibold'>{selectedInstallment.contractNumber}</p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-500'>العميل</label>
                    <p className='text-lg font-semibold'>{selectedInstallment.customerName}</p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-500'>المبلغ الإجمالي</label>
                    <p className='text-lg font-semibold'>{selectedInstallment.totalAmount.toLocaleString()} ريال</p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-500'>قيمة القسط</label>
                    <p className='text-lg font-semibold'>{selectedInstallment.installmentAmount.toLocaleString()} ريال</p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-500'>تاريخ الاستحقاق</label>
                    <p className='text-lg font-semibold'>{selectedInstallment.dueDate}</p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-500'>الحالة</label>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      selectedInstallment.status === 'paid' ? 'bg-green-100 text-green-800' :
                      selectedInstallment.status === 'overdue' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedInstallment.status === 'paid' ? 'مدفوع' :
                       selectedInstallment.status === 'overdue' ? 'متأخر' : 'قادم'}
                    </span>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-500'>الرصيد المتبقي</label>
                    <p className='text-lg font-semibold'>{selectedInstallment.remainingBalance.toLocaleString()} ريال</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* الإجراءات والملاحظات */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>الإجراءات</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                {selectedInstallment.status !== 'paid' && (
                  <Button 
                    className='w-full' 
                    onClick={() => handleMarkAsPaid(selectedInstallment)}
                    disabled={isLoading}
                  >
                    <CheckCircle className='h-4 w-4 mr-2' />
                    تأكيد الدفع
                  </Button>
                )}
                
                <Button 
                  variant='outline' 
                  className='w-full'
                  onClick={() => handleSendReminder(selectedInstallment)}
                  disabled={isLoading}
                >
                  <MessageSquare className='h-4 w-4 mr-2' />
                  إرسال تذكير
                </Button>

                <Button 
                  variant='outline' 
                  className='w-full'
                  onClick={() => handleToggleFreeze(selectedInstallment)}
                  disabled={isLoading}
                >
                  {selectedInstallment.status === 'frozen' ? (
                    <>
                      <Play className='h-4 w-4 mr-2' />
                      إلغاء التجميد
                    </>
                  ) : (
                    <>
                      <Pause className='h-4 w-4 mr-2' />
                      تجميد القسط
                    </>
                  )}
                </Button>

                <Button 
                  variant='outline' 
                  className='w-full'
                  onClick={() => handleEditInstallment(selectedInstallment)}
                >
                  <Edit className='h-4 w-4 mr-2' />
                  تعديل
                </Button>
              </CardContent>
            </Card>

            <Card className='mt-4'>
              <CardHeader>
                <CardTitle>الملاحظات</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-gray-600'>{selectedInstallment.notes}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // العرض الافتراضي - قائمة المدفوعات
  return (
    <div className="space-y-6">
      {/* أزرار الوصول السريع */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <h2 className="text-xl font-semibold">الأقساط</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddInstallment}
            className="flex items-center gap-2 bg-[#913D95] hover:bg-[#7A2F7D] text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            إضافة قسط جديد
          </button>
        </div>
      </div>

      {/* إحصائيات المدفوعات */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <h2 className="text-xl font-semibold">إحصائيات المدفوعات</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-[#913D95]/5 hover:border-[#913D95]/30 hover:shadow-lg hover:shadow-[#913D95]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm text-gray-600 group-hover:text-[#913D95] transition-colors duration-300 font-almarai mb-2">
                  إجمالي المدفوعات
                </h3>
                <div className="text-2xl font-bold text-[#913D95] group-hover:text-[#7A2F7D] transition-colors duration-300 font-tajawal">
                  {stats.total}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  إجمالي المدفوعات الحالية
                </p>
              </div>
              <div className="p-2 bg-[#913D95]/10 rounded-lg group-hover:bg-[#913D95]/20 transition-all duration-300">
                <FileText className="h-5 w-5 text-[#913D95] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-[#913D95]/5 hover:border-[#913D95]/30 hover:shadow-lg hover:shadow-[#913D95]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm text-gray-600 group-hover:text-[#913D95] transition-colors duration-300 font-almarai mb-2">
                  المدفوعات المتأخرة
                </h3>
                <div className="text-2xl font-bold text-[#913D95] group-hover:text-[#7A2F7D] transition-colors duration-300 font-tajawal">
                  {stats.overdue}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  تحتاج متابعة فورية
                </p>
              </div>
              <div className="p-2 bg-[#913D95]/10 rounded-lg group-hover:bg-[#913D95]/20 transition-all duration-300">
                <AlertCircle className="h-5 w-5 text-[#913D95] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-[#913D95]/5 hover:border-[#913D95]/30 hover:shadow-lg hover:shadow-[#913D95]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm text-gray-600 group-hover:text-[#913D95] transition-colors duration-300 font-almarai mb-2">
                  المدفوعات القادمة
                </h3>
                <div className="text-2xl font-bold text-[#913D95] group-hover:text-[#7A2F7D] transition-colors duration-300 font-tajawal">
                  {stats.upcoming}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  خلال 7 أيام
                </p>
              </div>
              <div className="p-2 bg-[#913D95]/10 rounded-lg group-hover:bg-[#913D95]/20 transition-all duration-300">
                <Clock className="h-5 w-5 text-[#913D95] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-[#913D95]/5 hover:border-[#913D95]/30 hover:shadow-lg hover:shadow-[#913D95]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm text-gray-600 group-hover:text-[#913D95] transition-colors duration-300 font-almarai mb-2">
                  نسبة السداد
                </h3>
                <div className="text-2xl font-bold text-[#913D95] group-hover:text-[#7A2F7D] transition-colors duration-300 font-tajawal">
                  {Math.round((stats.paidAmount / stats.totalAmount) * 100)}%
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  الشهرية
                </p>
              </div>
              <div className="p-2 bg-[#913D95]/10 rounded-lg group-hover:bg-[#913D95]/20 transition-all duration-300">
                <TrendingUp className="h-5 w-5 text-[#913D95] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* جدول المدفوعات */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <h2 className="text-xl font-semibold">قائمة المدفوعات</h2>
        </div>
        
        {/* شريط البحث والفلترة */}
        <Card>
          <CardContent className='pt-6'>
            <div className='flex items-center space-x-4 rtl:space-x-reverse'>
              <div className='flex-1 relative'>
                <Search className='absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                <input
                  type='text'
                  placeholder='البحث في المدفوعات...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white'
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white'
              >
                <option value='all'>جميع الحالات</option>
                <option value='paid'>مدفوع</option>
                <option value='overdue'>متأخر</option>
                <option value='upcoming'>قادم</option>
              </select>
              <button className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                <Filter className='h-4 w-4' />
                فلترة متقدمة
              </button>
            </div>
          </CardContent>
        </Card>

        {/* جدول المدفوعات */}
        <Card>
          <CardHeader>
            <CardTitle>جدول المدفوعات</CardTitle>
            <CardDescription>جميع المدفوعات المرتبطة بالعملاء والعقود</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b'>
                    <th className='text-right py-3 px-4 font-medium'>رقم القسط</th>
                    <th className='text-right py-3 px-4 font-medium'>العميل</th>
                    <th className='text-right py-3 px-4 font-medium'>المبلغ</th>
                    <th className='text-right py-3 px-4 font-medium'>تاريخ الاستحقاق</th>
                    <th className='text-right py-3 px-4 font-medium'>الحالة</th>
                    <th className='text-right py-3 px-4 font-medium'>تاريخ الدفع</th>
                    <th className='text-right py-3 px-4 font-medium'>الرصيد المتبقي</th>
                    <th className='text-right py-3 px-4 font-medium'>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map(installment => (
                    <tr key={installment.id} className='border-b hover:bg-gray-50 dark:hover:bg-gray-800'>
                      <td className='py-3 px-4 font-medium'>{installment.id}</td>
                      <td className='py-3 px-4'>
                        <div>
                          <div className='font-medium'>{installment.customerName}</div>
                          <div className='text-sm text-gray-500'>{installment.contractNumber}</div>
                        </div>
                      </td>
                      <td className='py-3 px-4'>{installment.installmentAmount.toLocaleString()} ريال</td>
                      <td className='py-3 px-4'>{installment.dueDate}</td>
                      <td className='py-3 px-4'>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          installment.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          installment.status === 'overdue' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {installment.status === 'paid' ? 'مدفوع' :
                           installment.status === 'overdue' ? 'متأخر' : 'قادم'}
                        </span>
                      </td>
                      <td className='py-3 px-4'>{installment.paidDate || '—'}</td>
                      <td className='py-3 px-4'>{installment.remainingBalance.toLocaleString()} ريال</td>
                      <td className='py-3 px-4'>
                        <div className='flex items-center space-x-2 rtl:space-x-reverse'>
                          <button 
                            className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                            onClick={() => handleViewDetails(installment)}
                          >
                            <Eye className='h-4 w-4' />
                          </button>
                          <button 
                            className="p-1 text-gray-500 hover:text-green-600 transition-colors"
                            onClick={() => handleEditInstallment(installment)}
                          >
                            <Edit className='h-4 w-4' />
                          </button>
                          {installment.status !== 'paid' && (
                            <button 
                              className="p-1 text-gray-500 hover:text-green-600 transition-colors"
                              onClick={() => handleMarkAsPaid(installment)}
                              disabled={isLoading}
                            >
                              <CheckCircle className='h-4 w-4' />
                            </button>
                          )}
                          <button 
                            className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                            onClick={() => handleSendReminder(installment)}
                            disabled={isLoading}
                          >
                            <MessageSquare className='h-4 w-4' />
                          </button>
                          <button 
                            className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                            onClick={() => handleDeleteInstallment(installment)}
                          >
                            <Trash2 className='h-4 w-4' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

