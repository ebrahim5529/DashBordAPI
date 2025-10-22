/**
 * أنواع البيانات المتعلقة بالموردين
 */

export type SupplierType = 'INDIVIDUAL' | 'COMPANY';
export type SupplierStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type InvoiceStatus = 'PENDING' | 'PAID' | 'PARTIAL' | 'OVERDUE' | 'CANCELLED';
export type PurchaseStatus = 'PENDING' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED';
export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'CHECK' | 'CREDIT_CARD';

export interface Supplier {
  id: string;
  supplierNumber: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  nationality: string;
  supplierType: SupplierType;
  commercialRecord: string;
  taxNumber: string;
  status: SupplierStatus;
  registrationDate: Date;
  contactPerson: string;
  contactPersonPhone: string;
  contactPersonEmail: string;
  bankName: string;
  bankAccount: string;
  iban: string;
  swiftCode: string;
  notes: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupplierTableData {
  id: string;
  supplierNumber: string;
  name: string;
  email: string;
  phone: string;
  nationality: string;
  supplierType: SupplierType;
  idNumber: string;
  status: SupplierStatus;
  registrationDate: Date;
  rating: number;
  hasWarnings: boolean;
  invoicesCount: number;
  totalInvoices: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  purchasesCount: number;
  totalPurchases: number;
}

export interface SupplierStats {
  totalSuppliers: number;
  activeSuppliers: number;
  inactiveSuppliers: number;
  suspendedSuppliers: number;
  individualSuppliers: number;
  companySuppliers: number;
  totalInvoices: number;
  totalInvoiceAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  totalPurchases: number;
  totalPurchaseAmount: number;
  suppliersWithWarnings: number;
  averageRating: number;
  nationalityDistribution: Record<string, number>;
  monthlyRegistrations: Record<string, number>;
}

export interface SupplierInvoice {
  id: string;
  invoiceNumber: string;
  supplierId: string;
  supplier: Supplier;
  amount: number;
  status: InvoiceStatus;
  dueDate: Date;
  paymentDate?: Date;
  paymentMethod?: PaymentMethod;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupplierPurchase {
  id: string;
  purchaseNumber: string;
  supplierId: string;
  supplier: Supplier;
  purchaseDate: Date;
  deliveryDate?: Date;
  status: PurchaseStatus;
  totalAmount: number;
  items: PurchaseItem[];
  invoice?: SupplierInvoice;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
}

export interface SupplierDetails extends Supplier {
  warnings: string;
  invoicesSummary: {
    total: number;
    pending: number;
    paid: number;
    overdue: number;
    totalAmount: number;
  };
  purchasesSummary: {
    total: number;
    pending: number;
    confirmed: number;
    delivered: number;
    totalAmount: number;
  };
  recentActivity: ActivityLog[];
  attachments: string[];
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  entityType: string;
  entityId: string;
  createdAt: Date;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface ApiPaginatedResponse<T> {
  success: boolean;
  data: PaginatedResponse<T>;
}

// Request Params Types
export interface SupplierQueryParams {
  search?: string;
  supplier_type?: SupplierType;
  status?: SupplierStatus;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface InvoiceQueryParams {
  search?: string;
  supplier_id?: string | number;
  status?: InvoiceStatus;
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface PurchaseQueryParams {
  search?: string;
  supplier_id?: string | number;
  status?: PurchaseStatus;
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}
