/**
 * خدمة العملاء مع إدارة الحالة التلقائية
 */

import { Customer, Contract } from '@/lib/types/customer';
import { ContractsTableData } from '@/lib/types/contracts';
import { CustomerStatusService } from './customer-status.service';
// import { mockCustomersWithStatus, mockCustomersNeedingUpdate } from '@/data/customerStatusData'; // تم حذف الملف

export class CustomerService {
  /**
   * إنشاء عميل جديد
   */
  static async createCustomer(customerData: Partial<Customer>): Promise<Customer> {
    try {
      // إنشاء العميل مع حالة افتراضية
      const newCustomer: Customer = {
        id: this.generateId(),
        customerNumber: this.generateCustomerNumber(),
        name: customerData.name || '',
        email: customerData.email,
        phone: customerData.phone,
        phones: customerData.phones,
        address: customerData.address,
        nationality: customerData.nationality,
        customerType: customerData.customerType || 'INDIVIDUAL',
        idNumber: customerData.idNumber,
        commercialRecord: customerData.commercialRecord,
        status: 'INACTIVE', // حالة افتراضية
        registrationDate: new Date(),
        guarantorName: customerData.guarantorName,
        guarantorPhone: customerData.guarantorPhone,
        guarantorId: customerData.guarantorId,
        guarantorData: customerData.guarantorData,
        notes: customerData.notes,
        warnings: customerData.warnings,
        rating: customerData.rating,
        attachments: customerData.attachments,
        idCardCopy: customerData.idCardCopy,
        guarantorIdCardCopy: customerData.guarantorIdCardCopy,
        createdAt: new Date(),
        updatedAt: new Date(),
        contracts: customerData.contracts || [],
        payments: customerData.payments || [],
        customerNotes: customerData.customerNotes || [],
        comments: customerData.comments || [],
      };

      // تحديث الحالة بناءً على العقود
      newCustomer.status = CustomerStatusService.updateCustomerStatus(newCustomer);

      console.log('تم إنشاء عميل جديد:', {
        id: newCustomer.id,
        name: newCustomer.name,
        status: newCustomer.status,
      });

      return newCustomer;
    } catch (error) {
      console.error('خطأ في إنشاء العميل:', error);
      throw new Error('فشل في إنشاء العميل');
    }
  }

  /**
   * تحديث عميل
   */
  static async updateCustomer(
    customerId: string, 
    updateData: Partial<Customer>
  ): Promise<Customer> {
    try {
      // في التطبيق الحقيقي، سيتم جلب العميل من قاعدة البيانات
      const existingCustomer = await this.getCustomerById(customerId);
      if (!existingCustomer) {
        throw new Error('العميل غير موجود');
      }

      const updatedCustomer: Customer = {
        ...existingCustomer,
        ...updateData,
        updatedAt: new Date(),
      };

      // تحديث الحالة بناءً على العقود
      updatedCustomer.status = CustomerStatusService.updateCustomerStatus(updatedCustomer);

      console.log('تم تحديث العميل:', {
        id: updatedCustomer.id,
        name: updatedCustomer.name,
        status: updatedCustomer.status,
      });

      return updatedCustomer;
    } catch (error) {
      console.error('خطأ في تحديث العميل:', error);
      throw new Error('فشل في تحديث العميل');
    }
  }

  /**
   * إضافة عقد للعميل
   */
  static async addContractToCustomer(
    customerId: string, 
    contract: ContractsTableData
  ): Promise<Customer> {
    try {
      const customer = await this.getCustomerById(customerId);
      if (!customer) {
        throw new Error('العميل غير موجود');
      }

      const oldStatus = customer.status;
      
      // تحويل ContractsTableData إلى Contract
      const contractData: Contract = {
        id: contract.id,
        contractNumber: contract.contractNumber,
        title: `${contract.contractType} - ${contract.customerName}`,
        description: contract.notes,
        amount: contract.totalValue,
        startDate: contract.startDate,
        endDate: contract.endDate,
        status: contract.status,
        paymentType: 'تقسيط', // افتراضي
        customerId: contract.customerId,
        userId: 'system', // افتراضي
        createdAt: contract.createdAt,
        updatedAt: contract.updatedAt,
      };
      
      const updatedCustomer = CustomerStatusService.updateCustomerStatusOnContractAdd(
        customer, 
        contractData
      );

      // تسجيل تغيير الحالة
      if (oldStatus !== updatedCustomer.status) {
        CustomerStatusService.logStatusChange(
          updatedCustomer,
          oldStatus,
          updatedCustomer.status,
          `إضافة عقد جديد: ${contract.contractNumber}`
        );
      }

      console.log('تم إضافة عقد للعميل:', {
        customerId,
        contractId: contract.id,
        newStatus: updatedCustomer.status,
      });

      return updatedCustomer;
    } catch (error) {
      console.error('خطأ في إضافة العقد للعميل:', error);
      throw new Error('فشل في إضافة العقد للعميل');
    }
  }

  /**
   * تحديث عقد للعميل
   */
  static async updateContractForCustomer(
    customerId: string, 
    contract: ContractsTableData
  ): Promise<Customer> {
    try {
      const customer = await this.getCustomerById(customerId);
      if (!customer) {
        throw new Error('العميل غير موجود');
      }

      const oldStatus = customer.status;
      
      // تحويل ContractsTableData إلى Contract
      const contractData: Contract = {
        id: contract.id,
        contractNumber: contract.contractNumber,
        title: `${contract.contractType} - ${contract.customerName}`,
        description: contract.notes,
        amount: contract.totalValue,
        startDate: contract.startDate,
        endDate: contract.endDate,
        status: contract.status,
        paymentType: 'تقسيط', // افتراضي
        customerId: contract.customerId,
        userId: 'system', // افتراضي
        createdAt: contract.createdAt,
        updatedAt: contract.updatedAt,
      };
      
      const updatedCustomer = CustomerStatusService.updateCustomerStatusOnContractUpdate(
        customer, 
        contractData
      );

      // تسجيل تغيير الحالة
      if (oldStatus !== updatedCustomer.status) {
        CustomerStatusService.logStatusChange(
          updatedCustomer,
          oldStatus,
          updatedCustomer.status,
          `تحديث العقد: ${contract.contractNumber}`
        );
      }

      console.log('تم تحديث عقد العميل:', {
        customerId,
        contractId: contract.id,
        newStatus: updatedCustomer.status,
      });

      return updatedCustomer;
    } catch (error) {
      console.error('خطأ في تحديث عقد العميل:', error);
      throw new Error('فشل في تحديث عقد العميل');
    }
  }

  /**
   * حذف عقد من العميل
   */
  static async removeContractFromCustomer(
    customerId: string, 
    contractId: string
  ): Promise<Customer> {
    try {
      const customer = await this.getCustomerById(customerId);
      if (!customer) {
        throw new Error('العميل غير موجود');
      }

      const oldStatus = customer.status;
      const updatedCustomer = CustomerStatusService.updateCustomerStatusOnContractDelete(
        customer, 
        contractId
      );

      // تسجيل تغيير الحالة
      if (oldStatus !== updatedCustomer.status) {
        CustomerStatusService.logStatusChange(
          updatedCustomer,
          oldStatus,
          updatedCustomer.status,
          `حذف العقد: ${contractId}`
        );
      }

      console.log('تم حذف عقد من العميل:', {
        customerId,
        contractId,
        newStatus: updatedCustomer.status,
      });

      return updatedCustomer;
    } catch (error) {
      console.error('خطأ في حذف عقد العميل:', error);
      throw new Error('فشل في حذف عقد العميل');
    }
  }

  /**
   * تحديث حالة جميع العملاء
   */
  static async updateAllCustomersStatus(): Promise<{
    updated: number;
    customers: Customer[];
  }> {
    try {
      const allCustomers = await this.getAllCustomers();
      const customersNeedingUpdate = CustomerStatusService.getCustomersNeedingStatusUpdate(allCustomers);
      
      const updatedCustomers = await CustomerStatusService.updateAllCustomersStatus(allCustomers);

      console.log('تم تحديث حالة العملاء:', {
        total: allCustomers.length,
        updated: customersNeedingUpdate.length,
      });

      return {
        updated: customersNeedingUpdate.length,
        customers: updatedCustomers,
      };
    } catch (error) {
      console.error('خطأ في تحديث حالة العملاء:', error);
      throw new Error('فشل في تحديث حالة العملاء');
    }
  }

  /**
   * الحصول على عميل بالمعرف
   */
  static async getCustomerById(id: string): Promise<Customer | null> {
    try {
      // البحث في البيانات التجريبية - تم حذف البيانات التجريبية
      // يمكن إضافة منطق البحث من قاعدة البيانات هنا
      console.log('البحث عن العميل:', id);

      return null;
    } catch (error) {
      console.error('خطأ في جلب العميل:', error);
      return null;
    }
  }

  /**
   * الحصول على جميع العملاء
   */
  static async getAllCustomers(): Promise<Customer[]> {
    try {
      // دمج العملاء العاديين والعملاء الذين يحتاجون تحديث - تم حذف البيانات التجريبية
      // يمكن إضافة منطق جلب العملاء من قاعدة البيانات هنا
      console.log('جلب جميع العملاء');
      return [];
    } catch (error) {
      console.error('خطأ في جلب العملاء:', error);
      return [];
    }
  }

  /**
   * الحصول على إحصائيات العملاء
   */
  static async getCustomerStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    needsUpdate: number;
  }> {
    try {
      const customers = await this.getAllCustomers();
      return CustomerStatusService.getCustomerStatusStats(customers);
    } catch (error) {
      console.error('خطأ في جلب إحصائيات العملاء:', error);
      return {
        total: 0,
        active: 0,
        inactive: 0,
        needsUpdate: 0,
      };
    }
  }

  /**
   * توليد معرف فريد
   */
  private static generateId(): string {
    return `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * توليد رقم عميل فريد
   */
  private static generateCustomerNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    return `CUST-${timestamp}`;
  }
}
