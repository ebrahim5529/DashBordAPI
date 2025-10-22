/**
 * بيانات العمليات واللوجستيات
 */

// أنواع البيانات
export interface DeliveryOrderData {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  equipmentType: string;
  equipmentQuantity: number;
  orderType: 'توصيل' | 'استرجاع';
  scheduledDate: string;
  actualDate?: string;
  status: 'معلق' | 'قيد التنفيذ' | 'مكتمل' | 'متأخر' | 'ملغي';
  priority: 'عادية' | 'عالية' | 'عاجلة';
  driverName?: string;
  driverPhone?: string;
  vehicleNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingTrackingData {
  id: string;
  trackingNumber: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  equipmentType: string;
  equipmentQuantity: number;
  status: 'قيد التوصيل' | 'تم التسليم' | 'متأخر' | 'آمن';
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  currentLocation: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  estimatedArrival: string;
  actualArrival?: string;
  environmentalConditions: {
    temperature: number;
    humidity: number;
    security: 'آمن' | 'تحذير' | 'خطر';
  };
  timeline: Array<{
    timestamp: string;
    event: string;
    location: string;
    notes?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryReceiptData {
  id: string;
  receiptNumber: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  equipmentType: string;
  equipmentQuantity: number;
  deliveryDate: string;
  recipientName: string;
  recipientIdNumber: string;
  recipientIdCopy: string; // رابط الصورة
  electronicSignature: string; // رابط التوقيع الإلكتروني
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  status: 'مكتمل' | 'معلق' | 'يحتاج مراجعة';
  photos: string[]; // روابط الصور
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReturnInspectionData {
  id: string;
  inspectionNumber: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  equipmentType: string;
  equipmentQuantity: number;
  returnDate: string;
  inspectorName: string;
  equipmentCondition: 'ممتاز' | 'جيد' | 'مقبول' | 'تالف';
  damages: Array<{
    type: string;
    description: string;
    severity: 'طفيف' | 'متوسط' | 'شديد';
    photos: string[];
  }>;
  overallStatus: 'مقبول' | 'مرفوض' | 'يحتاج إصلاح';
  repairCost?: number;
  photos: string[];
  inspectionReport: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// الإحصائيات
export const deliveryOrdersStats = {
  pendingOrders: 24,
  inProgressOrders: 18,
  completedOrders: 156,
  delayedOrders: 7,
  deliveryOrders: 15,
  returnOrders: 9,
  highPriorityOrders: 5,
  averageDeliveryTime: 45.5,
};

export const shippingTrackingStats = {
  inDeliveryShipments: 18,
  deliveredShipments: 156,
  delayedShipments: 7,
  secureShipments: 167,
  averageDeliveryTime: 42.3,
  onTimeDeliveryRate: 89.5,
};

export const deliveryReceiptStats = {
  completedReceipts: 156,
  pendingReceipts: 12,
  reviewNeededReceipts: 3,
  totalReceipts: 171,
  averageProcessingTime: 15.2,
  digitalSignatureRate: 95.8,
};

export const returnInspectionStats = {
  acceptedReturns: 89,
  rejectedReturns: 12,
  repairNeededReturns: 8,
  totalInspections: 109,
  averageInspectionTime: 25.5,
  damageRate: 18.3,
};

// البيانات التجريبية
export const mockDeliveryOrdersData: DeliveryOrderData[] = [
  {
    id: '1',
    orderNumber: 'DO-2024-001',
    customerName: 'أحمد محمد الشامسي',
    customerPhone: '+968 9123 4567',
    customerAddress: 'مسقط، الخوير، شارع السلطان قابوس',
    equipmentType: 'سقالات معدنية',
    equipmentQuantity: 50,
    orderType: 'توصيل',
    scheduledDate: '2024-01-15',
    status: 'قيد التنفيذ',
    priority: 'عالية',
    driverName: 'سالم أحمد',
    driverPhone: '+968 9876 5432',
    vehicleNumber: 'OM-123-456',
    notes: 'توصيل صباحي قبل الساعة 10',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-14T10:30:00Z',
  },
  {
    id: '2',
    orderNumber: 'DO-2024-002',
    customerName: 'فاطمة علي البلوشي',
    customerPhone: '+968 9234 5678',
    customerAddress: 'صلالة، الدهاريز، المنطقة التجارية',
    equipmentType: 'رافعات شوكية',
    equipmentQuantity: 3,
    orderType: 'استرجاع',
    scheduledDate: '2024-01-16',
    status: 'معلق',
    priority: 'عادية',
    notes: 'استرجاع بعد انتهاء المشروع',
    createdAt: '2024-01-12T14:20:00Z',
    updatedAt: '2024-01-12T14:20:00Z',
  },
  {
    id: '3',
    orderNumber: 'DO-2024-003',
    customerName: 'محمد سالم الهنائي',
    customerPhone: '+968 9345 6789',
    customerAddress: 'نزوى، المنطقة الصناعية',
    equipmentType: 'خلاطات خرسانة',
    equipmentQuantity: 2,
    orderType: 'توصيل',
    scheduledDate: '2024-01-14',
    actualDate: '2024-01-14',
    status: 'مكتمل',
    priority: 'عادية',
    driverName: 'خالد محمد',
    driverPhone: '+968 9765 4321',
    vehicleNumber: 'OM-789-012',
    createdAt: '2024-01-08T11:15:00Z',
    updatedAt: '2024-01-14T16:45:00Z',
  },
];

export const mockShippingTrackingData: ShippingTrackingData[] = [
  {
    id: '1',
    trackingNumber: 'ST-2024-001',
    orderNumber: 'DO-2024-001',
    customerName: 'أحمد محمد الشامسي',
    customerPhone: '+968 9123 4567',
    equipmentType: 'سقالات معدنية',
    equipmentQuantity: 50,
    status: 'قيد التوصيل',
    driverName: 'سالم أحمد',
    driverPhone: '+968 9876 5432',
    vehicleNumber: 'OM-123-456',
    currentLocation: {
      address: 'طريق السلطان قابوس، بالقرب من مجمع الأفنيوز',
      coordinates: {
        lat: 23.5859,
        lng: 58.4059,
      },
    },
    estimatedArrival: '2024-01-15T10:30:00Z',
    environmentalConditions: {
      temperature: 28,
      humidity: 65,
      security: 'آمن',
    },
    timeline: [
      {
        timestamp: '2024-01-15T08:00:00Z',
        event: 'بدء الرحلة',
        location: 'المستودع الرئيسي',
        notes: 'تحميل المعدات مكتمل',
      },
      {
        timestamp: '2024-01-15T09:15:00Z',
        event: 'نقطة تفتيش',
        location: 'محطة وقود الخوير',
        notes: 'توقف لتعبئة الوقود',
      },
      {
        timestamp: '2024-01-15T09:45:00Z',
        event: 'في الطريق',
        location: 'طريق السلطان قابوس',
      },
    ],
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T09:45:00Z',
  },
  {
    id: '2',
    trackingNumber: 'ST-2024-002',
    orderNumber: 'DO-2024-003',
    customerName: 'محمد سالم الهنائي',
    customerPhone: '+968 9345 6789',
    equipmentType: 'خلاطات خرسانة',
    equipmentQuantity: 2,
    status: 'تم التسليم',
    driverName: 'خالد محمد',
    driverPhone: '+968 9765 4321',
    vehicleNumber: 'OM-789-012',
    currentLocation: {
      address: 'نزوى، المنطقة الصناعية',
      coordinates: {
        lat: 22.9333,
        lng: 57.5333,
      },
    },
    estimatedArrival: '2024-01-14T14:00:00Z',
    actualArrival: '2024-01-14T13:45:00Z',
    environmentalConditions: {
      temperature: 32,
      humidity: 45,
      security: 'آمن',
    },
    timeline: [
      {
        timestamp: '2024-01-14T10:00:00Z',
        event: 'بدء الرحلة',
        location: 'المستودع الرئيسي',
      },
      {
        timestamp: '2024-01-14T12:30:00Z',
        event: 'وصول للموقع',
        location: 'نزوى، المنطقة الصناعية',
      },
      {
        timestamp: '2024-01-14T13:45:00Z',
        event: 'تم التسليم',
        location: 'نزوى، المنطقة الصناعية',
        notes: 'تسليم مكتمل بنجاح',
      },
    ],
    createdAt: '2024-01-14T10:00:00Z',
    updatedAt: '2024-01-14T13:45:00Z',
  },
];

export const mockDeliveryReceiptData: DeliveryReceiptData[] = [
  {
    id: '1',
    receiptNumber: 'DR-2024-001',
    orderNumber: 'DO-2024-003',
    customerName: 'محمد سالم الهنائي',
    customerPhone: '+968 9345 6789',
    customerAddress: 'نزوى، المنطقة الصناعية',
    equipmentType: 'خلاطات خرسانة',
    equipmentQuantity: 2,
    deliveryDate: '2024-01-14',
    recipientName: 'محمد سالم الهنائي',
    recipientIdNumber: '12345678',
    recipientIdCopy: '/images/id-copies/12345678.jpg',
    electronicSignature: '/signatures/signature-001.png',
    driverName: 'خالد محمد',
    driverPhone: '+968 9765 4321',
    vehicleNumber: 'OM-789-012',
    status: 'مكتمل',
    photos: [
      '/images/delivery/equipment-001.jpg',
      '/images/delivery/site-001.jpg',
    ],
    notes: 'تسليم مكتمل بنجاح، المعدات في حالة ممتازة',
    createdAt: '2024-01-14T13:45:00Z',
    updatedAt: '2024-01-14T13:45:00Z',
  },
  {
    id: '2',
    receiptNumber: 'DR-2024-002',
    orderNumber: 'DO-2024-004',
    customerName: 'عائشة أحمد الزدجالي',
    customerPhone: '+968 9456 7890',
    customerAddress: 'صحار، المنطقة الحرة',
    equipmentType: 'رافعات شوكية',
    equipmentQuantity: 1,
    deliveryDate: '2024-01-15',
    recipientName: 'عائشة أحمد الزدجالي',
    recipientIdNumber: '87654321',
    recipientIdCopy: '/images/id-copies/87654321.jpg',
    electronicSignature: '/signatures/signature-002.png',
    driverName: 'يوسف علي',
    driverPhone: '+968 9654 3210',
    vehicleNumber: 'OM-456-789',
    status: 'معلق',
    photos: [
      '/images/delivery/equipment-002.jpg',
    ],
    notes: 'في انتظار التوقيع الإلكتروني',
    createdAt: '2024-01-15T11:30:00Z',
    updatedAt: '2024-01-15T11:30:00Z',
  },
];

export const mockReturnInspectionData: ReturnInspectionData[] = [
  {
    id: '1',
    inspectionNumber: 'RI-2024-001',
    orderNumber: 'DO-2023-089',
    customerName: 'سعيد محمد البلوشي',
    customerPhone: '+968 9567 8901',
    equipmentType: 'سقالات معدنية',
    equipmentQuantity: 30,
    returnDate: '2024-01-12',
    inspectorName: 'أحمد سالم الهنائي',
    equipmentCondition: 'جيد',
    damages: [
      {
        type: 'خدوش سطحية',
        description: 'خدوش طفيفة على بعض القطع',
        severity: 'طفيف',
        photos: ['/images/damages/scratch-001.jpg'],
      },
    ],
    overallStatus: 'مقبول',
    photos: [
      '/images/inspection/equipment-return-001.jpg',
      '/images/inspection/equipment-return-002.jpg',
    ],
    inspectionReport: 'المعدات في حالة جيدة عموماً مع وجود خدوش طفيفة لا تؤثر على الاستخدام',
    notes: 'تم قبول الإرجاع، المعدات جاهزة للاستخدام مرة أخرى',
    createdAt: '2024-01-12T14:20:00Z',
    updatedAt: '2024-01-12T16:45:00Z',
  },
  {
    id: '2',
    inspectionNumber: 'RI-2024-002',
    orderNumber: 'DO-2023-095',
    customerName: 'مريم خالد الشامسي',
    customerPhone: '+968 9678 9012',
    equipmentType: 'خلاطات خرسانة',
    equipmentQuantity: 1,
    returnDate: '2024-01-13',
    inspectorName: 'محمد علي الزدجالي',
    equipmentCondition: 'تالف',
    damages: [
      {
        type: 'تلف في المحرك',
        description: 'المحرك لا يعمل بشكل صحيح',
        severity: 'شديد',
        photos: ['/images/damages/engine-damage-001.jpg'],
      },
      {
        type: 'كسر في الخلاط',
        description: 'كسر في ريش الخلاط',
        severity: 'متوسط',
        photos: ['/images/damages/mixer-damage-001.jpg'],
      },
    ],
    overallStatus: 'يحتاج إصلاح',
    repairCost: 850,
    photos: [
      '/images/inspection/damaged-equipment-001.jpg',
      '/images/inspection/damaged-equipment-002.jpg',
    ],
    inspectionReport: 'المعدة تحتاج إصلاح شامل للمحرك وتغيير ريش الخلاط',
    notes: 'سيتم خصم تكلفة الإصلاح من الضمان',
    createdAt: '2024-01-13T10:15:00Z',
    updatedAt: '2024-01-13T15:30:00Z',
  },
];
