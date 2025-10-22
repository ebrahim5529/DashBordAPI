/**
 * بيانات سند الاستلام الوهمية
 * تستخدم في التطوير والاختبار
 */

import { DeliveryReceiptData } from '@/components/features/DeliveryReceiptDocument';

export const mockDeliveryReceiptData: DeliveryReceiptData[] = [
  {
    receiptNumber: 'DR-CTR-2024-010-941794',
    deliveryDate: '2024-01-15T10:30:00Z',
    customerName: 'شركة البناء الحديث',
    customerPhone: '+966501234567',
    deliveryAddress: 'الرياض، حي النرجس، شارع الملك فهد، مبنى رقم 123',
    driverName: 'أحمد محمد العتيبي',
    driverPhone: '+966501234568',
    items: [
      {
        id: '1',
        name: 'خلاطة خرسانة 10 متر مكعب',
        quantity: 2,
        condition: 'good',
        notes: 'تم الفحص والتأكد من سلامة الأجزاء'
      },
      {
        id: '2',
        name: 'رافعة برجية 50 طن',
        quantity: 1,
        condition: 'good',
        notes: 'تم التأكد من سلامة الكابلات والهيدروليك'
      },
      {
        id: '3',
        name: 'حفار هيدروليكي',
        quantity: 3,
        condition: 'good',
        notes: 'جميع الأجزاء سليمة'
      },
      {
        id: '4',
        name: 'لودر 950',
        quantity: 2,
        condition: 'damaged',
        notes: 'تلف بسيط في الإطارات الأمامية'
      },
      {
        id: '5',
        name: 'مولد كهربائي 100 كيلو وات',
        quantity: 1,
        condition: 'missing',
        notes: 'لم يتم العثور على كابل التوصيل'
      }
    ],
    totalItems: 9,
    status: 'completed',
    receiverName: 'محمد عبدالله السعد',
    receiverPhone: '+966501234569',
    receiverSignature: 'signature_data_receiver',
    delivererSignature: 'signature_data_deliverer',
    notes: 'تم التسليم بنجاح مع ملاحظة وجود تلف بسيط في إطارات اللودر ومفقود كابل المولد الكهربائي',
    relatedOrders: ['ORD-2024-001', 'CTR-2024-010']
  },
  {
    receiptNumber: 'DR-CTR-2024-011-941795',
    deliveryDate: '2024-01-16T14:20:00Z',
    customerName: 'مؤسسة الإنشاءات الكبرى',
    customerPhone: '+966501234570',
    deliveryAddress: 'جدة، حي الزهراء، شارع الأمير سلطان، برج الإنشاءات',
    driverName: 'محمد علي القحطاني',
    driverPhone: '+966501234571',
    items: [
      {
        id: '1',
        name: 'رافعة برجية 30 طن',
        quantity: 1,
        condition: 'good',
        notes: 'سليمة ومجهزة للعمل'
      },
      {
        id: '2',
        name: 'خلاطة خرسانة 6 متر مكعب',
        quantity: 3,
        condition: 'good',
        notes: 'جميع الخلاطات سليمة'
      },
      {
        id: '3',
        name: 'حفار صغير',
        quantity: 2,
        condition: 'good',
        notes: 'جاهز للعمل'
      }
    ],
    totalItems: 6,
    status: 'pending',
    receiverName: '',
    receiverPhone: '',
    receiverSignature: '',
    delivererSignature: '',
    notes: 'في انتظار استلام العميل',
    relatedOrders: ['ORD-2024-002', 'CTR-2024-011']
  },
  {
    receiptNumber: 'DR-CTR-2024-012-941796',
    deliveryDate: '2024-01-17T09:15:00Z',
    customerName: 'شركة المشاريع المتقدمة',
    customerPhone: '+966501234572',
    deliveryAddress: 'الدمام، حي الشاطئ، شارع الكورنيش، مجمع المشاريع',
    driverName: 'سعد أحمد الشمري',
    driverPhone: '+966501234573',
    items: [
      {
        id: '1',
        name: 'حفار هيدروليكي كبير',
        quantity: 1,
        condition: 'good',
        notes: 'سليم ومجهز بالكامل'
      },
      {
        id: '2',
        name: 'لودر 966',
        quantity: 2,
        condition: 'good',
        notes: 'جاهز للعمل'
      },
      {
        id: '3',
        name: 'مولد كهربائي 200 كيلو وات',
        quantity: 1,
        condition: 'good',
        notes: 'تم اختباره ويعمل بشكل ممتاز'
      },
      {
        id: '4',
        name: 'خلاطة خرسانة 12 متر مكعب',
        quantity: 2,
        condition: 'good',
        notes: 'سليمة ومجهزة'
      }
    ],
    totalItems: 6,
    status: 'completed',
    receiverName: 'خالد محمد الفهد',
    receiverPhone: '+966501234574',
    receiverSignature: 'signature_data_receiver_2',
    delivererSignature: 'signature_data_deliverer_2',
    notes: 'تم التسليم بنجاح، جميع المعدات سليمة وجاهزة للعمل',
    relatedOrders: ['ORD-2024-003', 'CTR-2024-012']
  }
];

export const getDeliveryReceiptByNumber = (receiptNumber: string): DeliveryReceiptData | undefined => {
  return mockDeliveryReceiptData.find(receipt => receipt.receiptNumber === receiptNumber);
};

export const getDeliveryReceiptsByCustomer = (customerName: string): DeliveryReceiptData[] => {
  return mockDeliveryReceiptData.filter(receipt => 
    receipt.customerName.toLowerCase().includes(customerName.toLowerCase())
  );
};

export const getDeliveryReceiptsByStatus = (status: string): DeliveryReceiptData[] => {
  return mockDeliveryReceiptData.filter(receipt => receipt.status === status);
};
