/**
 * أنواع البيانات الخاصة بالعملاء
 */

// نوع العميل
export type CustomerType = 'INDIVIDUAL' | 'COMPANY';

// حالة العميل
export type CustomerStatus = 'ACTIVE' | 'INACTIVE';

// نوع الملاحظة
export type NoteType = 'GENERAL' | 'WARNING' | 'RATING' | 'COMMENT';

// أولوية الملاحظة
export type NotePriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

// بيانات العميل الأساسية
export interface Customer {
  id: string;
  customerNumber: string;
  name: string;
  email?: string;
  phone?: string;
  phones?: PhoneNumber[]; // أرقام هواتف متعددة
  address?: string;
  nationality?: string;
  customerType: CustomerType;
  idNumber?: string;
  commercialRecord?: string;
  status: CustomerStatus;
  registrationDate: Date;
  guarantorName?: string;
  guarantorPhone?: string;
  guarantorId?: string;
  guarantorData?: GuarantorData; // بيانات الضامن الكاملة
  notes?: string;
  warnings?: string;
  rating?: number;
  attachments?: string; // JSON string for file paths
  idCardCopy?: string; // نسخة البطاقة الشخصية
  guarantorIdCardCopy?: string; // نسخة بطاقة الضامن
  createdAt: Date;
  updatedAt: Date;
  
  // العلاقات
  contracts?: Contract[];
  payments?: Payment[];
  customerNotes?: CustomerNote[];
  comments?: CustomerComment[]; // تعليقات مع الهاشتاجات
}

// رقم الهاتف
export interface PhoneNumber {
  id: string;
  number: string;
  isPrimary: boolean;
  type: 'MOBILE' | 'LANDLINE' | 'WHATSAPP';
  label?: string; // مثل: هاتف العمل، هاتف المنزل
}

// بيانات الضامن الكاملة
export interface GuarantorData {
  name: string;
  phone: string;
  idNumber: string;
  nationality: string;
  address: string;
  relationship: string; // صلة القرابة
  workPlace?: string;
  workPhone?: string;
  idCardCopy?: string; // نسخة البطاقة الشخصية
}

// تعليق العميل مع الهاشتاجات
export interface CustomerComment {
  id: string;
  content: string;
  hashtags: string[]; // الهاشتاجات المستخرجة
  createdAt: Date;
  userId: string;
  user?: User;
  customerId: string;
  customer?: Customer;
}

// ملاحظة العميل
export interface CustomerNote {
  id: string;
  title: string;
  content: string;
  noteType: NoteType;
  priority: NotePriority;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // العلاقات
  customerId: string;
  customer?: Customer;
  userId: string;
  user?: User;
}

// بيانات العميل للعرض في الجدول
export interface CustomerTableData {
  id: string;
  customerNumber: string;
  name: string;
  nationality?: string;
  customerType: CustomerType;
  idNumber?: string;
  phone?: string;
  email?: string;
  status: CustomerStatus;
  registrationDate: Date;
  contractsCount: number;
  totalPayments: number;
  pendingAmount: number;
  rating?: number;
  hasWarnings: boolean;
  claimsCount?: number; // عدد المطالبات
  lastContactDate?: Date; // آخر تاريخ تواصل
  nextContactDate?: Date; // الموعد القادم للتواصل
  idCardCopyPath?: string; // مسار نسخة البطاقة الشخصية للعميل
  guarantorIdCardCopyPath?: string; // مسار نسخة بطاقة الضامن
  commercialRecordCopyPath?: string; // مسار نسخة السجل التجاري
}

// إحصائيات العملاء
export interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  individualCustomers: number;
  companyCustomers: number;
  totalContracts: number;
  totalPayments: number;
  totalPendingAmount: number;
  customersWithWarnings: number;
  averageRating: number;
  nationalityDistribution: { [key: string]: number };
  monthlyRegistrations: { [key: string]: number };
}

// نموذج إضافة/تعديل العميل
export interface CustomerFormData {
  name: string;
  email?: string;
  phone?: string;
  phones?: PhoneNumber[]; // أرقام هواتف متعددة
  address?: string;
  nationality?: string;
  customerType: CustomerType;
  idNumber?: string;
  commercialRecord?: string;
  status: CustomerStatus;
  guarantorName?: string;
  guarantorPhone?: string;
  guarantorId?: string;
  guarantorData?: GuarantorData; // بيانات الضامن الكاملة
  notes?: string;
  warnings?: string;
  rating?: number;
  idCardCopy?: File; // نسخة البطاقة الشخصية
  guarantorIdCardCopy?: File; // نسخة بطاقة الضامن
}

// معاملات البحث والفلترة
export interface CustomerFilters {
  search?: string;
  status?: CustomerStatus;
  customerType?: CustomerType;
  nationality?: string;
  hasWarnings?: boolean;
  minRating?: number;
  dateFrom?: Date;
  dateTo?: Date;
}

// معاملات التصدير
export interface CustomerExportOptions {
  format: 'EXCEL' | 'PDF' | 'CSV';
  includeContracts?: boolean;
  includePayments?: boolean;
  includeNotes?: boolean;
  filters?: CustomerFilters;
}

// بيانات العميل التفصيلية
export interface CustomerDetails extends Customer {
  contractsSummary: {
    total: number;
    active: number;
    completed: number;
    cancelled: number;
    totalValue: number;
  };
  paymentsSummary: {
    total: number;
    paid: number;
    pending: number;
    overdue: number;
    totalAmount: number;
  };
  recentActivity: Activity[];
  attachments: Attachment[];
}

// المرفقات
export interface Attachment {
  id: string;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
  uploadedBy: string;
}

// النشاط
export interface Activity {
  id: string;
  action: string;
  description?: string;
  entityType: string;
  entityId: string;
  createdAt: Date;
  user: CustomerUser;
}

// المستخدم
export interface CustomerUser {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// العقد
export interface Contract {
  id: string;
  contractNumber: string;
  title: string;
  description?: string;
  amount: number;
  startDate: Date;
  endDate: Date;
  status: string;
  paymentType: string;
  installmentCount?: number;
  createdAt: Date;
  updatedAt: Date;
  customerId: string;
  customer?: Customer;
  userId: string;
  user?: User;
  payments?: Payment[];
  installments?: Installment[];
}

// الدفع
export interface Payment {
  id: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: string;
  status: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  contractId: string;
  contract?: Contract;
  customerId: string;
  customer?: Customer;
  userId: string;
  user?: User;
}

// القسط
export interface Installment {
  id: string;
  installmentNumber: number;
  amount: number;
  dueDate: Date;
  status: string;
  paidDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  contractId: string;
  contract?: Contract;
}
