/**
 * خدمة إدارة حالة العملاء التلقائية
 */

import { Customer, CustomerStatus, Contract } from '@/lib/types/customer';
import { ContractStatus } from '@/lib/types/contracts';

export class CustomerStatusService {
  /**
   * تحديث حالة العميل بناءً على عقوده
   */
  static updateCustomerStatus(customer: Customer): CustomerStatus {
    if (!customer.contracts || customer.contracts.length === 0) {
      return 'INACTIVE';
    }

    // البحث عن عقد نشط
    const hasActiveContract = customer.contracts.some(contract => 
      this.isContractActive(contract)
    );

    return hasActiveContract ? 'ACTIVE' : 'INACTIVE';
  }

  /**
   * التحقق من أن العقد نشط
   */
  private static isContractActive(contract: Contract): boolean {
    // التحقق من حالة العقد
    const activeStatuses: ContractStatus[] = ['نشط', 'معتمد'];
    
    if (!activeStatuses.includes(contract.status as ContractStatus)) {
      return false;
    }

    // التحقق من تاريخ انتهاء العقد
    if (contract.endDate) {
      const now = new Date();
      const endDate = new Date(contract.endDate);
      
      // إذا انتهى العقد، فهو غير نشط
      if (endDate < now) {
        return false;
      }
    }

    return true;
  }

  /**
   * تحديث حالة جميع العملاء بناءً على عقودهم
   */
  static async updateAllCustomersStatus(customers: Customer[]): Promise<Customer[]> {
    return customers.map(customer => ({
      ...customer,
      status: this.updateCustomerStatus(customer),
      updatedAt: new Date(),
    }));
  }

  /**
   * الحصول على العملاء الذين يحتاجون تحديث حالة
   */
  static getCustomersNeedingStatusUpdate(customers: Customer[]): Customer[] {
    return customers.filter(customer => {
      const calculatedStatus = this.updateCustomerStatus(customer);
      return calculatedStatus !== customer.status;
    });
  }

  /**
   * تحديث حالة العميل عند إضافة عقد جديد
   */
  static updateCustomerStatusOnContractAdd(
    customer: Customer, 
    newContract: Contract
  ): Customer {
    const updatedContracts = [...(customer.contracts || []), newContract];
    
    return {
      ...customer,
      contracts: updatedContracts,
      status: this.updateCustomerStatus({
        ...customer,
        contracts: updatedContracts,
      }),
      updatedAt: new Date(),
    };
  }

  /**
   * تحديث حالة العميل عند تعديل عقد
   */
  static updateCustomerStatusOnContractUpdate(
    customer: Customer,
    updatedContract: Contract
  ): Customer {
    const updatedContracts = customer.contracts?.map(contract =>
      contract.id === updatedContract.id ? updatedContract : contract
    ) || [];

    return {
      ...customer,
      contracts: updatedContracts,
      status: this.updateCustomerStatus({
        ...customer,
        contracts: updatedContracts,
      }),
      updatedAt: new Date(),
    };
  }

  /**
   * تحديث حالة العميل عند حذف عقد
   */
  static updateCustomerStatusOnContractDelete(
    customer: Customer,
    deletedContractId: string
  ): Customer {
    const updatedContracts = customer.contracts?.filter(
      contract => contract.id !== deletedContractId
    ) || [];

    return {
      ...customer,
      contracts: updatedContracts,
      status: this.updateCustomerStatus({
        ...customer,
        contracts: updatedContracts,
      }),
      updatedAt: new Date(),
    };
  }

  /**
   * الحصول على إحصائيات حالة العملاء
   */
  static getCustomerStatusStats(customers: Customer[]): {
    total: number;
    active: number;
    inactive: number;
    needsUpdate: number;
  } {
    const total = customers.length;
    const active = customers.filter(c => c.status === 'ACTIVE').length;
    const inactive = customers.filter(c => c.status === 'INACTIVE').length;
    const needsUpdate = this.getCustomersNeedingStatusUpdate(customers).length;

    return {
      total,
      active,
      inactive,
      needsUpdate,
    };
  }

  /**
   * تسجيل تغيير حالة العميل
   */
  static logStatusChange(
    customer: Customer,
    oldStatus: CustomerStatus,
    newStatus: CustomerStatus,
    reason: string
  ): void {
    console.log(`تغيير حالة العميل ${customer.name}:`, {
      customerId: customer.id,
      oldStatus,
      newStatus,
      reason,
      timestamp: new Date().toISOString(),
    });
  }
}
