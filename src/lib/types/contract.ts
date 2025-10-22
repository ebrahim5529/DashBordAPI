/**
 * أنواع البيانات للعقود
 */

export interface ContractFormData {
  // معلومات العقد الأساسية
  id?: string; // معرف العقد عند التعديل
  contractDate: string;
  contractNumber: string;
  customerId: string;
  customerName: string;
  deliveryAddress: string;
  locationMapLink: string;
  totalContractValue: number;
  transportAndInstallationCost: number;
  totalDiscount: number;
  totalAfterDiscount: number;
  totalPayments: number;
  contractNotes: string;

  // المدفوعات
  payments: PaymentData[];

  // تفاصيل الإيجار
  rentalDetails: RentalDetailData[];
}

export interface PaymentData {
  id: string;
  paymentMethod: 'cash' | 'check' | 'credit_card';
  notes: string;
  paymentDate: string;
  amount: number;
  description: string;
  checkNumber?: string;
  bankName?: string;
  checkDate?: string;
  checkImage?: string; // مسار صورة الشيك
  checkImageFile?: File; // ملف صورة الشيك
}

export interface RentalDetailData {
  id: string;
  startDate: string;
  duration: number; // بالأيام أو الأشهر حسب النوع
  durationType: 'daily' | 'monthly'; // نوع المدة
  itemCode: string;
  itemDescription: string;
  dailyRate: number;
  monthlyRate: number;
  quantity: number;
  total: number;
  endDate: string;
  scaffoldId?: string; // معرف السقالة من Laravel
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address: string;
}

export interface EquipmentItem {
  id: string;
  code: string;
  description: string;
  dailyRate: number;
  monthlyRate: number;
  available: boolean;
}

export interface ContractManagementData {
  id: string;
  contractNumber: string;
  customerName: string;
  contractType: string;
  totalValue: number;
  status: 'active' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  remainingAmount: number;
  paidAmount: number;
  createdAt: string;
  updatedAt: string;
}
