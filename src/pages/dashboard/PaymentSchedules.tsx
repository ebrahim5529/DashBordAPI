/**
 * صفحة جداول الدفع
 * إدارة جداول الدفع والمدفوعات
 */

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shared/Card';
import {
  Clock,
  Plus,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Eye,
} from 'lucide-react';

// بيانات وهمية للعملاء والشركات
const customersData = [
  { id: '1', name: 'شركة البناء الحديثة', type: 'company', phone: '+966501234567', email: 'info@modernbuilding.com' },
  { id: '2', name: 'مؤسسة الإنشاءات المتقدمة', type: 'company', phone: '+966501234568', email: 'info@advancedconstruction.com' },
  { id: '3', name: 'شركة المقاولات الكبرى', type: 'company', phone: '+966501234569', email: 'info@majorcontractors.com' },
  { id: '4', name: 'شركة الإنشاءات الشرقية', type: 'company', phone: '+966501234570', email: 'info@easternconstruction.com' },
  { id: '5', name: 'فندق الوردة', type: 'company', phone: '+966501234571', email: 'info@rosehotel.com' },
  { id: '6', name: 'أحمد محمد علي', type: 'individual', phone: '+966501234572', email: 'ahmed.ali@email.com' },
  { id: '7', name: 'سارة عبدالله', type: 'individual', phone: '+966501234573', email: 'sara.abdullah@email.com' },
  { id: '8', name: 'مؤسسة النهضة التجارية', type: 'company', phone: '+966501234574', email: 'info@nahdatrading.com' },
  { id: '9', name: 'شركة التقنية المتطورة', type: 'company', phone: '+966501234575', email: 'info@advancedtech.com' },
  { id: '10', name: 'محمد سالم', type: 'individual', phone: '+966501234576', email: 'mohammed.salem@email.com' },
];

// بيانات وهمية لطرق الدفع
const paymentMethodsData = [
  { id: '1', name: 'التحويل البنكي', type: 'bank_transfer', description: 'تحويل مباشر إلى الحساب البنكي', icon: '🏦' },
  { id: '2', name: 'الدفع النقدي', type: 'cash', description: 'دفع نقدي في المكتب', icon: '💵' },
  { id: '3', name: 'البطاقة الائتمانية', type: 'credit_card', description: 'دفع بالبطاقة الائتمانية', icon: '💳' },
  { id: '4', name: 'الدفع الإلكتروني', type: 'digital_wallet', description: 'دفع عبر التطبيقات الإلكترونية', icon: '📱' },
  { id: '5', name: 'الشيك', type: 'check', description: 'دفع بالشيك', icon: '📄' },
  { id: '6', name: 'الخصم المباشر', type: 'direct_debit', description: 'خصم مباشر من الحساب', icon: '🏧' },
  { id: '7', name: 'التحويل السريع', type: 'instant_transfer', description: 'تحويل فوري', icon: '⚡' },
  { id: '8', name: 'الدفع الآجل', type: 'deferred_payment', description: 'دفع مؤجل', icon: '⏰' },
];

// بيانات وهمية لجداول الدفع
const paymentSchedules = [
  {
    id: '1',
    customerName: 'شركة البناء الحديثة',
    contractNumber: 'CON-2024-001',
    totalAmount: 150000,
    paidAmount: 75000,
    remainingAmount: 75000,
    installmentCount: 12,
    paidInstallments: 6,
    nextPaymentDate: '2024-02-15',
    status: 'active',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
  {
    id: '2',
    customerName: 'مؤسسة الإنشاءات المتقدمة',
    contractNumber: 'CON-2024-002',
    totalAmount: 200000,
    paidAmount: 100000,
    remainingAmount: 100000,
    installmentCount: 24,
    paidInstallments: 12,
    nextPaymentDate: '2024-02-20',
    status: 'active',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  {
    id: '3',
    customerName: 'شركة المقاولات الكبرى',
    contractNumber: 'CON-2024-003',
    totalAmount: 120000,
    paidAmount: 120000,
    remainingAmount: 0,
    installmentCount: 12,
    paidInstallments: 12,
    nextPaymentDate: 'مكتمل',
    status: 'completed',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  {
    id: '4',
    customerName: 'شركة الإنشاءات الشرقية',
    contractNumber: 'CON-2024-004',
    totalAmount: 180000,
    paidAmount: 60000,
    remainingAmount: 120000,
    installmentCount: 18,
    paidInstallments: 6,
    nextPaymentDate: '2024-02-10',
    status: 'overdue',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  },
];

const scheduleStats = [
  {
    title: 'إجمالي الجداول',
    value: '24',
    change: '+3',
    icon: Calendar,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
  },
  {
    title: 'الجداول النشطة',
    value: '18',
    change: '+2',
    icon: Clock,
    color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
  },
  {
    title: 'المدفوعات المتأخرة',
    value: '3',
    change: '-1',
    icon: AlertCircle,
    color: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
  },
  {
    title: 'المكتملة',
    value: '6',
    change: '+1',
    icon: CheckCircle,
    color:
      'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
  },
];

export default function PaymentSchedulesPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showPaymentMethodDropdown, setShowPaymentMethodDropdown] = useState(false);
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [paymentMethodSearchTerm, setPaymentMethodSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    customerName: '',
    customerId: '',
    contractNumber: '',
    totalAmount: '',
    installmentCount: '',
    installmentAmount: '',
    startDate: '',
    interval: 'monthly',
    paymentMethod: '',
    paymentMethodId: '',
    notes: ''
  });

  // معالجة إضافة جدول جديد
  const handleAddSchedule = () => {
    setShowAddForm(true);
  };

  // معالجة حفظ الجدول الجديد
  const handleSaveSchedule = () => {
    if (!formData.name || !formData.customerName || !formData.totalAmount) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowAddForm(false);
      setFormData({
        name: '',
        customerName: '',
        customerId: '',
        contractNumber: '',
        totalAmount: '',
        installmentCount: '',
        installmentAmount: '',
        startDate: '',
        interval: 'monthly',
        paymentMethod: '',
        paymentMethodId: '',
        notes: ''
      });
      alert('تم إضافة جدول الدفع بنجاح');
    }, 1000);
  };

  // معالجة إلغاء النموذج
  const handleCancelForm = () => {
    setShowAddForm(false);
    setShowCustomerDropdown(false);
    setShowPaymentMethodDropdown(false);
    setCustomerSearchTerm('');
    setPaymentMethodSearchTerm('');
    setFormData({
      name: '',
      customerName: '',
      customerId: '',
      contractNumber: '',
      totalAmount: '',
      installmentCount: '',
      installmentAmount: '',
      startDate: '',
      interval: 'monthly',
      paymentMethod: '',
      paymentMethodId: '',
      notes: ''
    });
  };

  // معالجة اختيار العميل
  const handleSelectCustomer = (customer: any) => {
    setFormData({
      ...formData,
      customerName: customer.name,
      customerId: customer.id
    });
    setShowCustomerDropdown(false);
    setCustomerSearchTerm('');
  };

  // تصفية العملاء حسب البحث
  const filteredCustomers = customersData.filter(customer =>
    customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase())
  );

  // تصفية طرق الدفع حسب البحث
  const filteredPaymentMethods = paymentMethodsData.filter(method =>
    method.name.toLowerCase().includes(paymentMethodSearchTerm.toLowerCase()) ||
    method.description.toLowerCase().includes(paymentMethodSearchTerm.toLowerCase())
  );

  // معالجة اختيار طريقة الدفع
  const handleSelectPaymentMethod = (method: any) => {
    setFormData({
      ...formData,
      paymentMethod: method.name,
      paymentMethodId: method.id
    });
    setShowPaymentMethodDropdown(false);
    setPaymentMethodSearchTerm('');
  };

  // إغلاق القائمة المنسدلة عند النقر خارجها
  const handleClickOutside = (event: any) => {
    if (!event.target.closest('.customer-dropdown')) {
      setShowCustomerDropdown(false);
    }
    if (!event.target.closest('.payment-method-dropdown')) {
      setShowPaymentMethodDropdown(false);
    }
  };

  // إضافة مستمع الحدث عند تحميل المكون
  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // معالجة تعديل الجدول
  const handleEditSchedule = (schedule: any) => {
    alert(`تم فتح نموذج تعديل جدول الدفع "${schedule.customerName}"`);
  };

  // معالجة حذف الجدول
  const handleDeleteSchedule = async (schedule: any) => {
    if (window.confirm(`هل أنت متأكد من حذف جدول الدفع "${schedule.customerName}"؟`)) {
      setIsLoading(true);
      try {
        setTimeout(() => {
          setIsLoading(false);
          alert('تم حذف جدول الدفع بنجاح');
        }, 1000);
      } catch (error) {
        console.error('خطأ في حذف جدول الدفع:', error);
        setIsLoading(false);
        alert('حدث خطأ في حذف جدول الدفع');
      }
    }
  };

  // معالجة عرض تفاصيل الجدول
  const handleViewSchedule = (schedule: any) => {
    alert(`عرض تفاصيل جدول الدفع "${schedule.customerName}"`);
  };

  return (
    <div className="space-y-6">
      {/* أزرار الوصول السريع */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <h2 className="text-xl font-semibold">جداول الدفع</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddSchedule}
            className="flex items-center gap-2 bg-[#58d2c8] hover:bg-[#4bb5ab] text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            إضافة جدول جديد
          </button>
        </div>
      </div>

      {/* نموذج إضافة جدول جديد */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>إضافة جدول دفع جديد</CardTitle>
            <CardDescription>قم بملء البيانات التالية لإضافة جدول دفع جديد</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  اسم الجدول *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent dark:bg-gray-800 dark:text-white"
                  placeholder="مثال: جدول دفع شركة البناء الحديثة"
                />
              </div>
              <div className="relative customer-dropdown">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  اسم العميل / الشركة *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => {
                      setFormData({...formData, customerName: e.target.value});
                      setCustomerSearchTerm(e.target.value);
                      setShowCustomerDropdown(true);
                    }}
                    onFocus={() => setShowCustomerDropdown(true)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent dark:bg-gray-800 dark:text-white"
                    placeholder="ابحث عن العميل أو الشركة..."
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
                                {customer.type === 'company' ? 'شركة' : 'فرد'} • {customer.phone}
                              </div>
                            </div>
                            <div className="text-xs text-gray-400">
                              {customer.type === 'company' ? '🏢' : '👤'}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  رقم العقد
                </label>
                <input
                  type="text"
                  value={formData.contractNumber}
                  onChange={(e) => setFormData({...formData, contractNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent dark:bg-gray-800 dark:text-white"
                  placeholder="مثال: CON-2024-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  المبلغ الإجمالي *
                </label>
                <input
                  type="number"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({...formData, totalAmount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent dark:bg-gray-800 dark:text-white"
                  placeholder="مثال: 150000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  عدد المدفوعات
                </label>
                <input
                  type="number"
                  value={formData.installmentCount}
                  onChange={(e) => setFormData({...formData, installmentCount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent dark:bg-gray-800 dark:text-white"
                  placeholder="مثال: 12"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  قيمة كل قسط
                </label>
                <input
                  type="number"
                  value={formData.installmentAmount}
                  onChange={(e) => setFormData({...formData, installmentAmount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent dark:bg-gray-800 dark:text-white"
                  placeholder="مثال: 12500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  تاريخ البداية
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الفاصل الزمني
                </label>
                <select
                  value={formData.interval}
                  onChange={(e) => setFormData({...formData, interval: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent dark:bg-gray-800 dark:text-white"
                >
                  <option value="monthly">شهري</option>
                  <option value="weekly">أسبوعي</option>
                  <option value="bi-weekly">نصف شهري</option>
                </select>
              </div>
              <div className="relative payment-method-dropdown">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  طريقة الدفع
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.paymentMethod}
                    onChange={(e) => {
                      setFormData({...formData, paymentMethod: e.target.value});
                      setPaymentMethodSearchTerm(e.target.value);
                      setShowPaymentMethodDropdown(true);
                    }}
                    onFocus={() => setShowPaymentMethodDropdown(true)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent dark:bg-gray-800 dark:text-white"
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
                                {method.description}
                              </div>
                            </div>
                            <div className="text-lg">
                              {method.icon}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ملاحظات إدارية
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="أي ملاحظات إضافية حول جدول الدفع..."
              />
            </div>
            <div className="flex items-center gap-2 pt-4">
              <button
                onClick={handleSaveSchedule}
                disabled={isLoading}
                className="flex items-center gap-2 bg-[#58d2c8] hover:bg-[#4bb5ab] text-white px-6 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                {isLoading ? 'جاري الحفظ...' : 'حفظ الجدول'}
              </button>
              <button
                onClick={handleCancelForm}
                className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                إلغاء
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* إحصائيات جداول الدفع */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <h2 className="text-xl font-semibold">إحصائيات جداول الدفع</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {scheduleStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-[#913D95]/5 hover:border-[#913D95]/30 hover:shadow-lg hover:shadow-[#913D95]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[100px]">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm text-gray-600 group-hover:text-[#913D95] transition-colors duration-300 font-almarai mb-2">
                      {stat.title}
                    </h3>
                    <div className="text-2xl font-bold text-[#913D95] group-hover:text-[#7A2F7D] transition-colors duration-300 font-tajawal">
                      {stat.value}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {stat.change} من الشهر الماضي
                    </p>
                  </div>
                  <div className="p-2 bg-[#913D95]/10 rounded-lg group-hover:bg-[#913D95]/20 transition-all duration-300">
                    <Icon className="h-5 w-5 text-[#913D95] group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* قائمة جداول الدفع */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <h2 className="text-xl font-semibold">جداول الدفع</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>قائمة جداول الدفع</CardTitle>
            <CardDescription>جميع جداول الدفع والمدفوعات المخططة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {paymentSchedules.map(schedule => (
                <div
                  key={schedule.id}
                  className='flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
                >
                  <div className='flex items-center space-x-4 rtl:space-x-reverse'>
                    <div className={`p-2 rounded-lg ${schedule.color}`}>
                      <Calendar className='h-5 w-5' />
                    </div>
                    <div className='flex-1'>
                      <h3 className='font-semibold text-gray-900 dark:text-white'>
                        {schedule.customerName}
                      </h3>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        {schedule.contractNumber}
                      </p>
                      <div className='flex items-center space-x-6 rtl:space-x-reverse mt-2'>
                        <div className='flex items-center space-x-1 rtl:space-x-reverse'>
                          <DollarSign className='h-4 w-4 text-gray-400' />
                          <span className='text-xs text-gray-500'>
                            {schedule.totalAmount.toLocaleString()} ريال
                          </span>
                        </div>
                        <div className='flex items-center space-x-1 rtl:space-x-reverse'>
                          <Clock className='h-4 w-4 text-gray-400' />
                          <span className='text-xs text-gray-500'>
                            {schedule.paidInstallments}/
                            {schedule.installmentCount} أقساط
                          </span>
                        </div>
                        <div className='flex items-center space-x-1 rtl:space-x-reverse'>
                          <Calendar className='h-4 w-4 text-gray-400' />
                          <span className='text-xs text-gray-500'>
                            القادم: {schedule.nextPaymentDate}
                          </span>
                        </div>
                      </div>
                      <div className='mt-2'>
                        <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                          <div
                            className='bg-blue-500 h-2 rounded-full'
                            style={{
                              width: `${(schedule.paidAmount / schedule.totalAmount) * 100}%`,
                            }}
                          />
                        </div>
                        <div className='flex justify-between text-xs text-gray-500 mt-1'>
                          <span>
                            مدفوع: {schedule.paidAmount.toLocaleString()} ريال
                          </span>
                          <span>
                            متبقي: {schedule.remainingAmount.toLocaleString()}{' '}
                            ريال
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2 rtl:space-x-reverse'>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        schedule.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : schedule.status === 'completed'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {schedule.status === 'active'
                        ? 'نشط'
                        : schedule.status === 'completed'
                          ? 'مكتمل'
                          : 'متأخر'}
                    </span>
                    <button 
                      className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                      onClick={() => handleViewSchedule(schedule)}
                    >
                      <Eye className='h-4 w-4' />
                    </button>
                    <button 
                      className="p-1 text-gray-500 hover:text-green-600 transition-colors"
                      onClick={() => handleEditSchedule(schedule)}
                    >
                      <Edit className='h-4 w-4' />
                    </button>
                    <button
                      className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                      onClick={() => handleDeleteSchedule(schedule)}
                      disabled={isLoading}
                    >
                      <Trash2 className='h-4 w-4' />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

