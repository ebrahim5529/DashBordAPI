/**
 * أنواع البيانات الخاصة بإدارة المخزون
 */

// أنواع السقالات
export type ScaffoldType = 'FIXED' | 'MOBILE' | 'TOWER' | 'CANTILEVER' | 'SUSPENDED';
export type ScaffoldMaterial = 'STEEL' | 'ALUMINUM' | 'WOOD' | 'COMPOSITE';
export type ScaffoldCondition = 'NEW' | 'USED' | 'REFURBISHED';
export type ScaffoldStatus = 'AVAILABLE' | 'RENTED' | 'SOLD' | 'MAINTENANCE' | 'RESERVED';

// معلومات السقالة الأساسية
export interface Scaffold {
  id: string;
  scaffoldNumber: string;
  type: ScaffoldType;
  size: {
    height: number; // بالمتر
    width: number; // بالمتر
    length: number; // بالمتر
  };
  material: ScaffoldMaterial;
  condition: ScaffoldCondition;
  status: ScaffoldStatus;
  quantity: number;
  availableQuantity: number;
  location: string;
  warehouseLocation: string;
  sellingPrice: number;
  dailyRentalPrice: number;
  monthlyRentalPrice: number;
  entryDate: Date;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  images?: string[];
  attachments?: string[];
  notes?: string;
  supplier?: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// بيانات السقالة للجدول
export interface ScaffoldTableData {
  id: string;
  scaffoldNumber: string;
  type: ScaffoldType;
  size: string; // "3x2x1 متر"
  material: ScaffoldMaterial;
  condition: ScaffoldCondition;
  status: ScaffoldStatus;
  quantity: number;
  availableQuantity: number;
  location: string;
  sellingPrice: number;
  dailyRentalPrice: number;
  monthlyRentalPrice: number;
  entryDate: Date;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  hasImages: boolean;
  hasAttachments: boolean;
  notes?: string;
  supplierName?: string;
  createdAt: Date;
  updatedAt: Date;
}

// إحصائيات المخزون
export interface InventoryStats {
  totalScaffolds: number;
  availableScaffolds: number;
  rentedScaffolds: number;
  soldScaffolds: number;
  maintenanceScaffolds: number;
  reservedScaffolds: number;
  totalValue: number;
  availableValue: number;
  rentedValue: number;
  soldValue: number;
  maintenanceValue: number;
  lowStockItems: number;
  maintenanceDueItems: number;
  typeDistribution: {
    [key in ScaffoldType]: number;
  };
  materialDistribution: {
    [key in ScaffoldMaterial]: number;
  };
  conditionDistribution: {
    [key in ScaffoldCondition]: number;
  };
  statusDistribution: {
    [key in ScaffoldStatus]: number;
  };
  monthlyAdditions: {
    [key: string]: number; // "2023-01": 5
  };
  monthlyRentals: {
    [key: string]: number;
  };
  monthlySales: {
    [key: string]: number;
  };
}

// فلاتر المخزون
export interface InventoryFilters {
  type?: ScaffoldType;
  material?: ScaffoldMaterial;
  condition?: ScaffoldCondition;
  status?: ScaffoldStatus;
  location?: string;
  warehouseLocation?: string;
  minPrice?: number;
  maxPrice?: number;
  minQuantity?: number;
  maxQuantity?: number;
  dateFrom?: Date;
  dateTo?: Date;
  supplierId?: string;
  lowStock?: boolean;
  maintenanceDue?: boolean;
}

// معلومات شراء المعدات
export interface EquipmentPurchase {
  id: string;
  purchaseNumber: string;
  supplier: {
    id: string;
    name: string;
    contactPerson: string;
    phone: string;
    email: string;
  };
  items: {
    scaffoldId: string;
    scaffoldNumber: string;
    type: ScaffoldType;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  totalAmount: number;
  purchaseDate: Date;
  deliveryDate?: Date;
  status: 'PENDING' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PARTIAL' | 'PAID';
  paidAmount: number;
  remainingAmount: number;
  invoiceNumber?: string;
  notes?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// بيانات شراء المعدات للجدول
export interface EquipmentPurchaseTableData {
  id: string;
  purchaseNumber: string;
  supplierName: string;
  totalAmount: number;
  itemCount: number;
  totalQuantity: number;
  purchaseDate: Date;
  deliveryDate?: Date;
  status: 'PENDING' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PARTIAL' | 'PAID';
  paidAmount: number;
  remainingAmount: number;
  invoiceNumber?: string;
  hasAttachments: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// إحصائيات المشتريات
export interface PurchaseStats {
  totalPurchases: number;
  pendingPurchases: number;
  confirmedPurchases: number;
  deliveredPurchases: number;
  cancelledPurchases: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  totalItems: number;
  totalQuantity: number;
  averagePurchaseValue: number;
  monthlyPurchases: {
    [key: string]: number;
  };
  monthlyAmounts: {
    [key: string]: number;
  };
  supplierDistribution: {
    [supplierId: string]: {
      name: string;
      count: number;
      amount: number;
    };
  };
}

// فلاتر المشتريات
export interface PurchaseFilters {
  status?: 'PENDING' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus?: 'PENDING' | 'PARTIAL' | 'PAID';
  supplierId?: string;
  minAmount?: number;
  maxAmount?: number;
  dateFrom?: Date;
  dateTo?: Date;
  hasInvoice?: boolean;
}

// معلومات أصناف المخازن
export interface WarehouseItem {
  id: string;
  itemNumber: string;
  name: string;
  type: ScaffoldType;
  material: ScaffoldMaterial;
  condition: ScaffoldCondition;
  specifications: {
    height: number;
    width: number;
    length: number;
    weight: number;
    capacity: number;
  };
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  location: string;
  warehouseLocation: string;
  costPrice: number;
  sellingPrice: number;
  rentalPrice: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  supplier: {
    id: string;
    name: string;
  };
  lastRestocked: Date;
  nextRestockDate?: Date;
  images?: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// بيانات أصناف المخازن للجدول
export interface WarehouseItemTableData {
  id: string;
  itemNumber: string;
  name: string;
  type: ScaffoldType;
  material: ScaffoldMaterial;
  condition: ScaffoldCondition;
  specifications: string; // "3x2x1 متر - 100 كجم"
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  location: string;
  warehouseLocation: string;
  costPrice: number;
  sellingPrice: number;
  dailyRentalPrice: number;
  supplierName: string;
  lastRestocked: Date;
  nextRestockDate?: Date;
  hasImages: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// إحصائيات أصناف المخازن
export interface WarehouseStats {
  totalItems: number;
  inStockItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalValue: number;
  averageStockValue: number;
  typeDistribution: {
    [key in ScaffoldType]: number;
  };
  materialDistribution: {
    [key in ScaffoldMaterial]: number;
  };
  conditionDistribution: {
    [key in ScaffoldCondition]: number;
  };
  locationDistribution: {
    [location: string]: number;
  };
  monthlyRestocks: {
    [key: string]: number;
  };
  monthlyValues: {
    [key: string]: number;
  };
}

// فلاتر أصناف المخازن
export interface WarehouseFilters {
  type?: ScaffoldType;
  material?: ScaffoldMaterial;
  condition?: ScaffoldCondition;
  stockStatus?: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  location?: string;
  warehouseLocation?: string;
  minPrice?: number;
  maxPrice?: number;
  minStock?: number;
  maxStock?: number;
  supplierId?: string;
  needsRestock?: boolean;
}

// أنواع الحالة للنماذج
export type FormMode = 'create' | 'edit' | 'view';

// أنواع الإجراءات
export type InventoryAction = 'add' | 'edit' | 'delete' | 'view' | 'maintenance' | 'transfer' | 'reserve';

// أنواع التقارير
export type InventoryReportType = 'stock' | 'movement' | 'value' | 'maintenance' | 'purchase' | 'sales';

// إعدادات المخزون
export interface InventorySettings {
  lowStockThreshold: number;
  maintenanceReminderDays: number;
  autoUpdateStock: boolean;
  requireApprovalForPurchase: boolean;
  defaultWarehouseLocation: string;
  currency: string;
  unitOfMeasurement: 'METERS' | 'FEET';
  weightUnit: 'KG' | 'LBS';
}
