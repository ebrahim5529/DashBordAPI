/**
 * صفحة طرق الدفع
 * إدارة طرق الدفع المتاحة مع ربطها بنظام المدفوعات
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
  CreditCard,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Link,
  Eye,
} from 'lucide-react';

// بيانات وهمية لطرق الدفع مع ربطها بالمدفوعات
const paymentMethods = [
  {
    id: '1',
    name: 'التحويل البنكي',
    description: 'تحويل مباشر إلى الحساب البنكي',
    type: 'bank_transfer',
    status: 'active',
    usage: 45,
    icon: '🏦',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    settings: {
      accountNumber: 'SA1234567890123456789012',
      bankName: 'البنك الأهلي التجاري',
      fees: 0,
    },
    installmentCount: 12,
    totalAmount: 150000,
    lastUsed: '2025-01-15',
  },
  {
    id: '2',
    name: 'الدفع النقدي',
    description: 'دفع نقدي في المكتب',
    type: 'cash',
    status: 'active',
    usage: 30,
    icon: '💵',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    settings: {
      locations: ['المكتب الرئيسي', 'مكتب الشمال', 'مكتب الجنوب'],
      fees: 0,
    },
    installmentCount: 8,
    totalAmount: 80000,
    lastUsed: '2025-01-14',
  },
  {
    id: '3',
    name: 'البطاقة الائتمانية',
    description: 'دفع بالبطاقة الائتمانية',
    type: 'credit_card',
    status: 'active',
    usage: 20,
    icon: '💳',
    color:
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    settings: {
      provider: 'Visa/Mastercard',
      fees: 2.5,
      minAmount: 100,
    },
    installmentCount: 5,
    totalAmount: 25000,
    lastUsed: '2025-01-13',
  },
  {
    id: '4',
    name: 'الدفع الإلكتروني',
    description: 'دفع عبر التطبيقات الإلكترونية',
    type: 'digital_wallet',
    status: 'inactive',
    usage: 5,
    icon: '📱',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    settings: {
      providers: ['STC Pay', 'Apple Pay', 'Google Pay'],
      fees: 1.5,
    },
    installmentCount: 0,
    totalAmount: 0,
    lastUsed: null,
  },
];

// بيانات وهمية للأقساط المرتبطة بكل طريقة دفع
const installmentData = [
  {
    id: '001',
    customerName: 'شركة الندى',
    amount: 5000,
    dueDate: '2025-02-01',
    status: 'paid',
    paymentMethod: 'التحويل البنكي',
    paidDate: '2025-01-30',
  },
  {
    id: '002',
    customerName: 'أحمد علي',
    amount: 2000,
    dueDate: '2025-02-05',
    status: 'upcoming',
    paymentMethod: 'الدفع النقدي',
    paidDate: null,
  },
  {
    id: '003',
    customerName: 'فندق الوردة',
    amount: 10000,
    dueDate: '2025-01-28',
    status: 'paid',
    paymentMethod: 'البطاقة الائتمانية',
    paidDate: '2025-01-28',
  },
];

const paymentStats = [
  {
    title: 'إجمالي الطرق',
    value: '4',
    change: '+1',
    icon: CreditCard,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
  },
  {
    title: 'الطرق النشطة',
    value: '3',
    change: '0',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
  },
  {
    title: 'إجمالي المدفوعات',
    value: '25',
    change: '+5',
    icon: TrendingUp,
    color:
      'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300',
  },
  {
    title: 'إجمالي المبلغ',
    value: '255K',
    change: '+15%',
    icon: DollarSign,
    color:
      'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
  },
];

// بيانات وهمية لأنواع طرق الدفع
const paymentTypesData = [
  { id: '1', name: 'تحويل بنكي', type: 'bank_transfer', description: 'تحويل مباشر إلى الحساب البنكي', icon: '🏦' },
  { id: '2', name: 'دفع نقدي', type: 'cash', description: 'دفع نقدي في المكتب', icon: '💵' },
  { id: '3', name: 'بطاقة ائتمان', type: 'credit_card', description: 'دفع بالبطاقة الائتمانية', icon: '💳' },
  { id: '4', name: 'محفظة إلكترونية', type: 'digital_wallet', description: 'دفع عبر التطبيقات الإلكترونية', icon: '📱' },
  { id: '5', name: 'شيك', type: 'check', description: 'دفع بالشيك', icon: '📄' },
  { id: '6', name: 'خصم مباشر', type: 'direct_debit', description: 'خصم مباشر من الحساب', icon: '🏧' },
  { id: '7', name: 'تحويل سريع', type: 'instant_transfer', description: 'تحويل فوري', icon: '⚡' },
  { id: '8', name: 'دفع آجل', type: 'deferred_payment', description: 'دفع مؤجل', icon: '⏰' },
];

export default function PaymentMethodsPage() {
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'list' | 'details'>('list');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [typeSearchTerm, setTypeSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    typeId: '',
    status: 'active',
    icon: '',
    settings: {
      fees: '',
      minAmount: '',
      maxAmount: '',
      accountNumber: '',
      bankName: '',
      provider: '',
      locations: '',
      providers: ''
    }
  });

  // معالجة عرض تفاصيل طريقة الدفع
  const handleViewDetails = (method: any) => {
    setSelectedMethod(method);
    setViewMode('details');
  };

  // معالجة ربط طريقة الدفع بالمدفوعات
  const handleLinkToInstallments = (method: any) => {
    // يمكن إضافة منطق الربط هنا
    alert(`تم ربط طريقة الدفع "${method.name}" بنظام المدفوعات`);
  };

  // معالجة إضافة طريقة دفع جديدة
  const handleAddMethod = () => {
    setShowAddForm(true);
  };

  // معالجة حفظ طريقة الدفع الجديدة
  const handleSaveMethod = () => {
    if (!formData.name || !formData.description || !formData.type) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowAddForm(false);
      setFormData({
        name: '',
        description: '',
        type: '',
        typeId: '',
        status: 'active',
        icon: '',
        settings: {
          fees: '',
          minAmount: '',
          maxAmount: '',
          accountNumber: '',
          bankName: '',
          provider: '',
          locations: '',
          providers: ''
        }
      });
      alert('تم إضافة طريقة الدفع بنجاح');
    }, 1000);
  };

  // معالجة إلغاء النموذج
  const handleCancelForm = () => {
    setShowAddForm(false);
    setShowTypeDropdown(false);
    setTypeSearchTerm('');
    setFormData({
      name: '',
      description: '',
      type: '',
      typeId: '',
      status: 'active',
      icon: '',
      settings: {
        fees: '',
        minAmount: '',
        maxAmount: '',
        accountNumber: '',
        bankName: '',
        provider: '',
        locations: '',
        providers: ''
      }
    });
  };

  // تصفية أنواع طرق الدفع حسب البحث
  const filteredPaymentTypes = paymentTypesData.filter(paymentType =>
    paymentType.name.toLowerCase().includes(typeSearchTerm.toLowerCase()) ||
    paymentType.description.toLowerCase().includes(typeSearchTerm.toLowerCase())
  );

  // معالجة اختيار نوع طريقة الدفع
  const handleSelectPaymentType = (paymentType: any) => {
    setFormData({
      ...formData,
      type: paymentType.name,
      typeId: paymentType.id,
      icon: paymentType.icon
    });
    setShowTypeDropdown(false);
    setTypeSearchTerm('');
  };

  // إغلاق القائمة المنسدلة عند النقر خارجها
  const handleClickOutside = (event: any) => {
    if (!event.target.closest('.payment-type-dropdown')) {
      setShowTypeDropdown(false);
    }
  };

  // إضافة مستمع الحدث عند تحميل المكون
  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // معالجة تعديل طريقة الدفع
  const handleEditMethod = (method: any) => {
    alert(`تم فتح نموذج تعديل طريقة الدفع "${method.name}"`);
  };

  // معالجة حذف طريقة الدفع
  const handleDeleteMethod = (method: any) => {
    if (window.confirm(`هل أنت متأكد من حذف طريقة الدفع "${method.name}"؟`)) {
      alert('تم حذف طريقة الدفع بنجاح');
    }
  };

  // معالجة تفعيل/إلغاء تفعيل طريقة الدفع
  const handleToggleStatus = (method: any) => {
    const newStatus = method.status === 'active' ? 'inactive' : 'active';
    alert(`تم تغيير حالة طريقة الدفع "${method.name}" إلى ${newStatus === 'active' ? 'نشط' : 'غير نشط'}`);
  };

  // عرض تفاصيل طريقة الدفع
  if (viewMode === 'details' && selectedMethod) {
    const relatedInstallments = installmentData.filter(
      installment => installment.paymentMethod === selectedMethod.name
    );

    return (
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
              تفاصيل طريقة الدفع: {selectedMethod.name}
            </h1>
            <p className='text-gray-600 dark:text-gray-400 mt-1'>
              {selectedMethod.description}
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
          {/* تفاصيل طريقة الدفع */}
          <div className='lg:col-span-2'>
            <Card>
              <CardHeader>
                <CardTitle>تفاصيل طريقة الدفع</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='text-sm font-medium text-gray-500'>الاسم</label>
                    <p className='text-lg font-semibold'>{selectedMethod.name}</p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-500'>النوع</label>
                    <p className='text-lg font-semibold'>{selectedMethod.type}</p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-500'>الحالة</label>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      selectedMethod.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}>
                      {selectedMethod.status === 'active' ? 'نشط' : 'غير نشط'}
                    </span>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-500'>نسبة الاستخدام</label>
                    <p className='text-lg font-semibold'>{selectedMethod.usage}%</p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-500'>عدد المدفوعات</label>
                    <p className='text-lg font-semibold'>{selectedMethod.installmentCount}</p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-500'>إجمالي المبلغ</label>
                    <p className='text-lg font-semibold'>{selectedMethod.totalAmount.toLocaleString()} ريال</p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-500'>آخر استخدام</label>
                    <p className='text-lg font-semibold'>{selectedMethod.lastUsed || 'لم يتم الاستخدام'}</p>
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-500'>الرسوم</label>
                    <p className='text-lg font-semibold'>{selectedMethod.settings.fees}%</p>
                  </div>
                </div>

                {/* إعدادات إضافية */}
                {selectedMethod.settings.accountNumber && (
                  <div className='mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                    <h4 className='font-medium mb-2'>تفاصيل الحساب البنكي</h4>
                    <p className='text-sm text-gray-600'>رقم الحساب: {selectedMethod.settings.accountNumber}</p>
                    <p className='text-sm text-gray-600'>البنك: {selectedMethod.settings.bankName}</p>
                  </div>
                )}

                {selectedMethod.settings.locations && (
                  <div className='mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                    <h4 className='font-medium mb-2'>مواقع الدفع النقدي</h4>
                    <ul className='text-sm text-gray-600'>
                      {selectedMethod.settings.locations.map((location: string, index: number) => (
                        <li key={index}>• {location}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedMethod.settings.providers && (
                  <div className='mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'>
                    <h4 className='font-medium mb-2'>مزودو الدفع الإلكتروني</h4>
                    <ul className='text-sm text-gray-600'>
                      {selectedMethod.settings.providers.map((provider: string, index: number) => (
                        <li key={index}>• {provider}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* الإجراءات والمدفوعات المرتبطة */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>الإجراءات</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <Button 
                  className='w-full' 
                  onClick={() => handleLinkToInstallments(selectedMethod)}
                >
                  <Link className='h-4 w-4 mr-2' />
                  ربط بالمدفوعات
                </Button>
                
                <Button 
                  variant='outline' 
                  className='w-full'
                  onClick={() => handleEditMethod(selectedMethod)}
                >
                  <Edit className='h-4 w-4 mr-2' />
                  تعديل
                </Button>

                <Button 
                  variant='outline' 
                  className='w-full'
                  onClick={() => handleToggleStatus(selectedMethod)}
                >
                  {selectedMethod.status === 'active' ? (
                    <>
                      <AlertCircle className='h-4 w-4 mr-2' />
                      إلغاء التفعيل
                    </>
                  ) : (
                    <>
                      <CheckCircle className='h-4 w-4 mr-2' />
                      تفعيل
                    </>
                  )}
                </Button>

                <Button 
                  variant='outline' 
                  className='w-full text-red-600 hover:text-red-700'
                  onClick={() => handleDeleteMethod(selectedMethod)}
                >
                  <Trash2 className='h-4 w-4 mr-2' />
                  حذف
                </Button>
              </CardContent>
            </Card>

            {/* المدفوعات المرتبطة */}
            <Card className='mt-4'>
              <CardHeader>
                <CardTitle>المدفوعات المرتبطة</CardTitle>
                <CardDescription>
                  {relatedInstallments.length} قسط مرتبط بهذه الطريقة
                </CardDescription>
              </CardHeader>
              <CardContent>
                {relatedInstallments.length > 0 ? (
                  <div className='space-y-3'>
                    {relatedInstallments.map(installment => (
                      <div key={installment.id} className='p-3 border rounded-lg'>
                        <div className='flex justify-between items-start'>
                          <div>
                            <p className='font-medium'>{installment.customerName}</p>
                            <p className='text-sm text-gray-500'>قسط #{installment.id}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            installment.status === 'paid' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {installment.status === 'paid' ? 'مدفوع' : 'قادم'}
                          </span>
                        </div>
                        <div className='mt-2 flex justify-between text-sm text-gray-600'>
                          <span>{installment.amount.toLocaleString()} ريال</span>
                          <span>{installment.dueDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-sm text-gray-500 text-center py-4'>
                    لا توجد أقساط مرتبطة بهذه الطريقة
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // العرض الافتراضي - قائمة طرق الدفع
  return (
    <div className="space-y-6">
      {/* أزرار الوصول السريع */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          <h2 className="text-xl font-semibold">طرق الدفع</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddMethod}
            className="flex items-center gap-2 bg-[#58d2c8] hover:bg-[#4bb5ab] text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            إضافة طريقة جديدة
          </button>
        </div>
      </div>

      {/* نموذج إضافة طريقة دفع جديدة */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>إضافة طريقة دفع جديدة</CardTitle>
            <CardDescription>قم بملء البيانات التالية لإضافة طريقة دفع جديدة</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  اسم طريقة الدفع *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent dark:bg-gray-800 dark:text-white"
                  placeholder="مثال: التحويل البنكي"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الوصف *
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent dark:bg-gray-800 dark:text-white"
                  placeholder="مثال: تحويل مباشر إلى الحساب البنكي"
                />
              </div>
              <div className="relative payment-type-dropdown">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  نوع طريقة الدفع *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.type}
                    onChange={(e) => {
                      setFormData({...formData, type: e.target.value});
                      setTypeSearchTerm(e.target.value);
                      setShowTypeDropdown(true);
                    }}
                    onFocus={() => setShowTypeDropdown(true)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent dark:bg-gray-800 dark:text-white"
                    placeholder="ابحث عن نوع طريقة الدفع..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                
                {/* قائمة أنواع طرق الدفع المفلترة */}
                {showTypeDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredPaymentTypes.length > 0 ? (
                      filteredPaymentTypes.map((paymentType) => (
                        <div
                          key={paymentType.id}
                          onClick={() => handleSelectPaymentType(paymentType)}
                          className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {paymentType.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {paymentType.description}
                              </div>
                            </div>
                            <div className="text-lg">
                              {paymentType.icon}
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
                  الحالة
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent dark:bg-gray-800 dark:text-white"
                >
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الأيقونة
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent dark:bg-gray-800 dark:text-white"
                  placeholder="مثال: 🏦"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الرسوم (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.settings.fees}
                  onChange={(e) => setFormData({...formData, settings: {...formData.settings, fees: e.target.value}})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent dark:bg-gray-800 dark:text-white"
                  placeholder="مثال: 2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الحد الأدنى للدفع
                </label>
                <input
                  type="number"
                  value={formData.settings.minAmount}
                  onChange={(e) => setFormData({...formData, settings: {...formData.settings, minAmount: e.target.value}})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent dark:bg-gray-800 dark:text-white"
                  placeholder="مثال: 100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  الحد الأقصى للدفع
                </label>
                <input
                  type="number"
                  value={formData.settings.maxAmount}
                  onChange={(e) => setFormData({...formData, settings: {...formData.settings, maxAmount: e.target.value}})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent dark:bg-gray-800 dark:text-white"
                  placeholder="مثال: 100000"
                />
              </div>
            </div>
            
            {/* إعدادات إضافية حسب نوع طريقة الدفع */}
            {formData.type === 'bank_transfer' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    رقم الحساب البنكي
                  </label>
                  <input
                    type="text"
                    value={formData.settings.accountNumber}
                    onChange={(e) => setFormData({...formData, settings: {...formData.settings, accountNumber: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent dark:bg-gray-800 dark:text-white"
                    placeholder="مثال: SA1234567890123456789012"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    اسم البنك
                  </label>
                  <input
                    type="text"
                    value={formData.settings.bankName}
                    onChange={(e) => setFormData({...formData, settings: {...formData.settings, bankName: e.target.value}})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent dark:bg-gray-800 dark:text-white"
                    placeholder="مثال: البنك الأهلي التجاري"
                  />
                </div>
              </div>
            )}

            {formData.type === 'credit_card' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  مزود الخدمة
                </label>
                <input
                  type="text"
                  value={formData.settings.provider}
                  onChange={(e) => setFormData({...formData, settings: {...formData.settings, provider: e.target.value}})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent dark:bg-gray-800 dark:text-white"
                  placeholder="مثال: Visa/Mastercard"
                />
              </div>
            )}

            {formData.type === 'cash' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  مواقع الدفع النقدي
                </label>
                <input
                  type="text"
                  value={formData.settings.locations}
                  onChange={(e) => setFormData({...formData, settings: {...formData.settings, locations: e.target.value}})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent dark:bg-gray-800 dark:text-white"
                  placeholder="مثال: المكتب الرئيسي، مكتب الشمال، مكتب الجنوب"
                />
              </div>
            )}

            {formData.type === 'digital_wallet' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  مزودي الخدمة
                </label>
                <input
                  type="text"
                  value={formData.settings.providers}
                  onChange={(e) => setFormData({...formData, settings: {...formData.settings, providers: e.target.value}})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent dark:bg-gray-800 dark:text-white"
                  placeholder="مثال: STC Pay، Apple Pay، Google Pay"
                />
              </div>
            )}

            <div className="flex items-center gap-2 pt-4">
              <button
                onClick={handleSaveMethod}
                disabled={isLoading}
                className="flex items-center gap-2 bg-[#58d2c8] hover:bg-[#4bb5ab] text-white px-6 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                {isLoading ? 'جاري الحفظ...' : 'حفظ طريقة الدفع'}
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

      {/* إحصائيات طرق الدفع */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <h2 className="text-xl font-semibold">إحصائيات طرق الدفع</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {paymentStats.map((stat, index) => {
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

      {/* قائمة طرق الدفع */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          <h2 className="text-xl font-semibold">طرق الدفع</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>قائمة طرق الدفع</CardTitle>
            <CardDescription>جميع طرق الدفع المتاحة مع ربطها بنظام المدفوعات</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {paymentMethods.map(method => (
                <div
                  key={method.id}
                  className='flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
                >
                  <div className='flex items-center space-x-4 rtl:space-x-reverse'>
                    <div className={`p-2 rounded-lg ${method.color}`}>
                      <span className='text-2xl'>{method.icon}</span>
                    </div>
                    <div className='flex-1'>
                      <h3 className='font-semibold text-gray-900 dark:text-white'>
                        {method.name}
                      </h3>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        {method.description}
                      </p>
                      <div className='flex items-center space-x-6 rtl:space-x-reverse mt-2'>
                        <span className='text-xs text-gray-500'>
                          الاستخدام: {method.usage}%
                        </span>
                        <span className='text-xs text-gray-500'>
                          المدفوعات: {method.installmentCount}
                        </span>
                        <span className='text-xs text-gray-500'>
                          المبلغ: {method.totalAmount.toLocaleString()} ريال
                        </span>
                        {method.settings.fees > 0 && (
                          <span className='text-xs text-gray-500'>
                            الرسوم: {method.settings.fees}%
                          </span>
                        )}
                      </div>
                      {method.settings.accountNumber && (
                        <p className='text-xs text-gray-500 mt-1'>
                          الحساب: {method.settings.accountNumber}
                        </p>
                      )}
                      {method.settings.locations && (
                        <p className='text-xs text-gray-500 mt-1'>
                          المواقع: {method.settings.locations.join(', ')}
                        </p>
                      )}
                      {method.settings.providers && (
                        <p className='text-xs text-gray-500 mt-1'>
                          المزودون: {method.settings.providers.join(', ')}
                        </p>
                      )}
                      {method.lastUsed && (
                        <p className='text-xs text-gray-500 mt-1'>
                          آخر استخدام: {method.lastUsed}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className='flex items-center space-x-2 rtl:space-x-reverse'>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        method.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}
                    >
                      {method.status === 'active' ? 'نشط' : 'غير نشط'}
                    </span>
                    <button 
                      className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                      onClick={() => handleViewDetails(method)}
                    >
                      <Eye className='h-4 w-4' />
                    </button>
                    <button 
                      className="p-1 text-gray-500 hover:text-green-600 transition-colors"
                      onClick={() => handleLinkToInstallments(method)}
                    >
                      <Link className='h-4 w-4' />
                    </button>
                    <button 
                      className="p-1 text-gray-500 hover:text-green-600 transition-colors"
                      onClick={() => handleEditMethod(method)}
                    >
                      <Edit className='h-4 w-4' />
                    </button>
                    <button
                      className="p-1 text-gray-500 hover:text-yellow-600 transition-colors"
                      onClick={() => handleToggleStatus(method)}
                    >
                      {method.status === 'active' ? (
                        <AlertCircle className='h-4 w-4' />
                      ) : (
                        <CheckCircle className='h-4 w-4' />
                      )}
                    </button>
                    <button
                      className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                      onClick={() => handleDeleteMethod(method)}
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

