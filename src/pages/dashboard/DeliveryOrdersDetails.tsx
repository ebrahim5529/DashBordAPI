/**
 * صفحة تفاصيل أوامر التوصيل
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Truck, 
  User, 
  Package, 
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  ExternalLink
} from 'lucide-react';

// واجهة بيانات أمر التوصيل
interface DeliveryOrderData {
  orderNumber: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'delivery' | 'pickup' | 'return';
  createdDate: string;
  scheduledDate: string;
  deliveryDate?: string;
  customer: {
    name: string;
    id: string;
    phone: string;
    address: string;
    contractNumber?: string;
  };
  driver: {
    name: string;
    phone: string;
    vehicle: string;
  };
  equipment: Array<{
    code: string;
    description: string;
    quantity: number;
    condition: 'good' | 'damaged' | 'missing';
    notes?: string;
  }>;
  notes?: string;
}

// بيانات وهمية لأوامر التوصيل
const mockDeliveryOrders: DeliveryOrderData[] = [
  {
    orderNumber: 'DO-2024-001',
    status: 'completed',
    priority: 'high',
    type: 'delivery',
    createdDate: '2024-01-15',
    scheduledDate: '2024-01-16',
    deliveryDate: '2024-01-16',
    customer: {
      name: 'شركة التقنية المتقدمة',
      id: 'CUST-001',
      phone: '+966501234567',
      address: 'الرياض، حي النرجس، شارع الملك فهد',
      contractNumber: 'CTR-2024-001'
    },
    driver: {
      name: 'أحمد محمد السعد',
      phone: '+966501234568',
      vehicle: 'مركبة نقل رقم 1234'
    },
    equipment: [
      {
        code: 'EQ-001',
        description: 'خادم Dell PowerEdge',
        quantity: 2,
        condition: 'good',
        notes: 'تم الفحص والتأكد من سلامة المعدات'
      },
      {
        code: 'EQ-002',
        description: 'جهاز UPS',
        quantity: 1,
        condition: 'good'
      }
    ],
    notes: 'تم التسليم بنجاح في الموعد المحدد'
  },
  {
    orderNumber: 'DO-2024-002',
    status: 'in-progress',
    priority: 'medium',
    type: 'delivery',
    createdDate: '2024-01-16',
    scheduledDate: '2024-01-17',
    customer: {
      name: 'مؤسسة الخليج التجارية',
      id: 'CUST-002',
      phone: '+966501234569',
      address: 'جدة، حي الروضة، شارع التحلية',
      contractNumber: 'CTR-2024-002'
    },
    driver: {
      name: 'محمد عبدالله القحطاني',
      phone: '+966501234570',
      vehicle: 'مركبة نقل رقم 5678'
    },
    equipment: [
      {
        code: 'EQ-003',
        description: 'طابعة HP LaserJet',
        quantity: 3,
        condition: 'good'
      },
      {
        code: 'EQ-004',
        description: 'جهاز فاكس',
        quantity: 1,
        condition: 'damaged',
        notes: 'يحتاج إصلاح قبل التسليم'
      }
    ],
    notes: 'في الطريق للتسليم'
  },
  {
    orderNumber: 'DO-2024-003',
    status: 'pending',
    priority: 'urgent',
    type: 'pickup',
    createdDate: '2024-01-17',
    scheduledDate: '2024-01-18',
    customer: {
      name: 'شركة النخيل للإلكترونيات',
      id: 'CUST-003',
      phone: '+966501234571',
      address: 'الدمام، حي الفيصلية، شارع الأمير محمد بن فهد',
      contractNumber: 'CTR-2024-003'
    },
    driver: {
      name: 'عبدالرحمن سعد المطيري',
      phone: '+966501234572',
      vehicle: 'مركبة نقل رقم 9012'
    },
    equipment: [
      {
        code: 'EQ-005',
        description: 'شاشات LCD 24 بوصة',
        quantity: 5,
        condition: 'good'
      }
    ],
    notes: 'استلام معدات للإصلاح'
  }
];

export default function DeliveryOrdersDetailsPage() {
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrderData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // قراءة رقم الأمر المحدد من localStorage
  React.useEffect(() => {
    const savedOrderNumber = localStorage.getItem('selectedOrderNumber');
    if (savedOrderNumber) {
      const order = mockDeliveryOrders.find(o => o.orderNumber === savedOrderNumber);
      if (order) {
        setSelectedOrder(order);
        // مسح رقم الأمر من localStorage بعد استخدامه
        localStorage.removeItem('selectedOrderNumber');
      }
    }
  }, []);

  // فلترة البيانات
  const filteredOrders = mockDeliveryOrders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // الحصول على أيقونة الحالة
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'in-progress':
        return <Truck className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // الحصول على لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // الحصول على نص الحالة
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'في انتظار';
      case 'in-progress':
        return 'قيد التنفيذ';
      case 'completed':
        return 'مكتمل';
      case 'cancelled':
        return 'ملغي';
      default:
        return 'غير محدد';
    }
  };

  // الحصول على لون الأولوية
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // الحصول على نص الأولوية
  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'منخفضة';
      case 'medium':
        return 'متوسطة';
      case 'high':
        return 'عالية';
      case 'urgent':
        return 'عاجلة';
      default:
        return 'غير محدد';
    }
  };

  // الحصول على نص نوع الأمر
  const getTypeText = (type: string) => {
    switch (type) {
      case 'delivery':
        return 'توصيل';
      case 'pickup':
        return 'استلام';
      case 'return':
        return 'إرجاع';
      default:
        return 'غير محدد';
    }
  };

  // الحصول على نص حالة المعدة
  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'good':
        return 'جيد';
      case 'damaged':
        return 'تالف';
      case 'missing':
        return 'مفقود';
      default:
        return 'غير محدد';
    }
  };

  // الحصول على لون حالة المعدة
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'good':
        return 'bg-green-100 text-green-800';
      case 'damaged':
        return 'bg-red-100 text-red-800';
      case 'missing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // معالجة عرض تفاصيل الأمر
  const handleViewOrderDetails = (order: DeliveryOrderData) => {
    setSelectedOrder(order);
  };

  // معالجة العودة للقائمة
  const handleBackToList = () => {
    setSelectedOrder(null);
  };

  // إذا تم اختيار أمر معين، عرض التفاصيل
  if (selectedOrder) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleBackToList}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              العودة للقائمة
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                أمر التوصيل
              </h1>
              <p className="text-gray-600 mt-1">
                رقم الأمر: {selectedOrder.orderNumber}
              </p>
            </div>
          </div>
        </div>

        {/* تفاصيل الأمر */}
        <div className="space-y-6">
          {/* معلومات أساسية */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">معلومات الأمر</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">رقم الأمر:</p>
                  <p className="font-medium text-gray-900">{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">الحالة:</p>
                  <Badge className={`${getStatusColor(selectedOrder.status)} flex items-center gap-1 w-fit`}>
                    {getStatusIcon(selectedOrder.status)}
                    {getStatusText(selectedOrder.status)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">الأولوية:</p>
                  <Badge className={`${getPriorityColor(selectedOrder.priority)} w-fit`}>
                    {getPriorityText(selectedOrder.priority)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">النوع:</p>
                  <p className="font-medium text-gray-900">{getTypeText(selectedOrder.type)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">تاريخ الإنشاء:</p>
                  <p className="font-medium text-gray-900">{selectedOrder.createdDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">التاريخ المجدول:</p>
                  <p className="font-medium text-gray-900">{selectedOrder.scheduledDate}</p>
                </div>
                {selectedOrder.deliveryDate && (
                  <div>
                    <p className="text-sm text-gray-500">تاريخ التسليم:</p>
                    <p className="font-medium text-gray-900">{selectedOrder.deliveryDate}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* معلومات العميل */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">معلومات العميل</h2>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">اسم العميل:</p>
                  <p className="font-medium text-gray-900">{selectedOrder.customer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">رقم العميل:</p>
                  <p className="font-medium text-gray-900">{selectedOrder.customer.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">رقم الهاتف:</p>
                  <p className="font-medium text-gray-900">{selectedOrder.customer.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">العنوان:</p>
                  <p className="font-medium text-gray-900">{selectedOrder.customer.address}</p>
                </div>
                {selectedOrder.customer.contractNumber && (
                  <div>
                    <p className="text-sm text-gray-500">رقم العقد:</p>
                    <p className="font-medium text-gray-900">{selectedOrder.customer.contractNumber}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* معلومات السائق */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900">معلومات السائق</h2>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">اسم السائق:</p>
                  <p className="font-medium text-gray-900">{selectedOrder.driver.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">رقم الهاتف:</p>
                  <p className="font-medium text-gray-900">{selectedOrder.driver.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">المركبة:</p>
                  <p className="font-medium text-gray-900">{selectedOrder.driver.vehicle}</p>
                </div>
              </div>
            </Card>

            {/* المعدات */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-orange-600" />
                <h2 className="text-lg font-semibold text-gray-900">المعدات</h2>
              </div>
              
              <div className="space-y-4">
                {selectedOrder.equipment.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">كود المعدة:</p>
                        <p className="font-medium text-gray-900">{item.code}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">الوصف:</p>
                        <p className="font-medium text-gray-900">{item.description}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">الكمية:</p>
                        <p className="font-medium text-gray-900">{item.quantity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">الحالة:</p>
                        <Badge className={`${getConditionColor(item.condition)} w-fit`}>
                          {getConditionText(item.condition)}
                        </Badge>
                      </div>
                      {item.notes && (
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-500">ملاحظات:</p>
                          <p className="font-medium text-gray-900">{item.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* ملاحظات */}
            {selectedOrder.notes && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">ملاحظات</h2>
                </div>
                <p className="text-gray-900">{selectedOrder.notes}</p>
              </Card>
            )}
          </div>

        </div>
      </div>
    );
  }

  // عرض قائمة الأوامر
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">أوامر التوصيل</h1>
          <p className="text-gray-600 mt-1">عرض وإدارة تفاصيل أوامر التوصيل</p>
        </div>
      </div>

      {/* فلاتر البحث */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="البحث برقم الأمر أو اسم العميل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="md:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">جميع الحالات</option>
              <option value="pending">في انتظار</option>
              <option value="in-progress">قيد التنفيذ</option>
              <option value="completed">مكتمل</option>
              <option value="cancelled">ملغي</option>
            </select>
          </div>
        </div>
      </Card>

      {/* قائمة الأوامر */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map((order) => (
          <Card key={order.orderNumber} className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleViewOrderDetails(order)}>
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
                <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                  {getStatusIcon(order.status)}
                  {getStatusText(order.status)}
                </Badge>
              </div>

              {/* معلومات العميل */}
              <div>
                <p className="text-sm text-gray-500">العميل:</p>
                <p className="font-medium text-gray-900">{order.customer.name}</p>
              </div>

              {/* السائق */}
              <div>
                <p className="text-sm text-gray-500">السائق:</p>
                <p className="font-medium text-gray-900">{order.driver.name}</p>
              </div>

              {/* المعدات */}
              <div>
                <p className="text-sm text-gray-500">المعدات:</p>
                <p className="font-medium text-gray-900">
                  {order.equipment.reduce((sum, item) => sum + item.quantity, 0)} قطعة
                </p>
              </div>

              {/* التواريخ */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">التاريخ المجدول:</span>
                  <span className="font-medium">{order.scheduledDate}</span>
                </div>
                {order.deliveryDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">تاريخ التسليم:</span>
                    <span className="font-medium text-green-600">{order.deliveryDate}</span>
                  </div>
                )}
              </div>

              {/* الأولوية */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">الأولوية:</span>
                <Badge className={getPriorityColor(order.priority)}>
                  {getPriorityText(order.priority)}
                </Badge>
              </div>

              {/* زر عرض التفاصيل */}
              <Button className="w-full" variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                عرض التفاصيل
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* رسالة عدم وجود نتائج */}
      {filteredOrders.length === 0 && (
        <Card className="p-12 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد أوامر توصيل</h3>
          <p className="text-gray-600">
            {searchTerm || filterStatus !== 'all' 
              ? 'لا توجد أوامر تطابق معايير البحث المحددة'
              : 'لم يتم العثور على أي أوامر توصيل في النظام'
            }
          </p>
        </Card>
      )}
    </div>
  );
}
