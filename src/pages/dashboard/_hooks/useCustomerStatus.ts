/**
 * Hook لإدارة حالة العملاء التلقائية
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Customer } from '@/lib/types/customer';
import { ContractsTableData } from '@/lib/types/contracts';
import { CustomerService } from '@/lib/services/customer.service';
import { CustomerStatusService } from '@/lib/services/customer-status.service';

interface UseCustomerStatusReturn {
  customers: Customer[];
  isLoading: boolean;
  error: string | null;
  stats: {
    total: number;
    active: number;
    inactive: number;
    needsUpdate: number;
  };
  updateCustomerStatus: (customerId: string) => Promise<void>;
  addContractToCustomer: (customerId: string, contract: ContractsTableData) => Promise<void>;
  updateContractForCustomer: (customerId: string, contract: ContractsTableData) => Promise<void>;
  removeContractFromCustomer: (customerId: string, contractId: string) => Promise<void>;
  updateAllCustomersStatus: () => Promise<void>;
  refreshCustomers: () => Promise<void>;
}

export function useCustomerStatus(): UseCustomerStatusReturn {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    needsUpdate: 0,
  });

  // تحديث الإحصائيات
  const updateStats = useCallback((customersList: Customer[]) => {
    const newStats = CustomerStatusService.getCustomerStatusStats(customersList);
    setStats(newStats);
  }, []);

  // تحديث حالة عميل واحد
  const updateCustomerStatus = useCallback(async (customerId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const customer = await CustomerService.getCustomerById(customerId);
      if (!customer) {
        throw new Error('العميل غير موجود');
      }

      const updatedCustomer = await CustomerService.updateCustomer(customerId, customer);
      
      setCustomers(prev => 
        prev.map(c => c.id === customerId ? updatedCustomer : c)
      );
      
      updateStats(customers.map(c => c.id === customerId ? updatedCustomer : c));
      
      console.log('تم تحديث حالة العميل:', {
        customerId,
        newStatus: updatedCustomer.status,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ غير معروف';
      setError(errorMessage);
      console.error('خطأ في تحديث حالة العميل:', err);
    } finally {
      setIsLoading(false);
    }
  }, [customers, updateStats]);

  // إضافة عقد للعميل
  const addContractToCustomer = useCallback(async (customerId: string, contract: ContractsTableData) => {
    try {
      setIsLoading(true);
      setError(null);

      const updatedCustomer = await CustomerService.addContractToCustomer(customerId, contract);
      
      setCustomers(prev => 
        prev.map(c => c.id === customerId ? updatedCustomer : c)
      );
      
      updateStats(customers.map(c => c.id === customerId ? updatedCustomer : c));
      
      console.log('تم إضافة عقد للعميل:', {
        customerId,
        contractId: contract.id,
        newStatus: updatedCustomer.status,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ غير معروف';
      setError(errorMessage);
      console.error('خطأ في إضافة العقد للعميل:', err);
    } finally {
      setIsLoading(false);
    }
  }, [customers, updateStats]);

  // تحديث عقد للعميل
  const updateContractForCustomer = useCallback(async (customerId: string, contract: ContractsTableData) => {
    try {
      setIsLoading(true);
      setError(null);

      const updatedCustomer = await CustomerService.updateContractForCustomer(customerId, contract);
      
      setCustomers(prev => 
        prev.map(c => c.id === customerId ? updatedCustomer : c)
      );
      
      updateStats(customers.map(c => c.id === customerId ? updatedCustomer : c));
      
      console.log('تم تحديث عقد العميل:', {
        customerId,
        contractId: contract.id,
        newStatus: updatedCustomer.status,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ غير معروف';
      setError(errorMessage);
      console.error('خطأ في تحديث عقد العميل:', err);
    } finally {
      setIsLoading(false);
    }
  }, [customers, updateStats]);

  // حذف عقد من العميل
  const removeContractFromCustomer = useCallback(async (customerId: string, contractId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const updatedCustomer = await CustomerService.removeContractFromCustomer(customerId, contractId);
      
      setCustomers(prev => 
        prev.map(c => c.id === customerId ? updatedCustomer : c)
      );
      
      updateStats(customers.map(c => c.id === customerId ? updatedCustomer : c));
      
      console.log('تم حذف عقد من العميل:', {
        customerId,
        contractId,
        newStatus: updatedCustomer.status,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ غير معروف';
      setError(errorMessage);
      console.error('خطأ في حذف عقد العميل:', err);
    } finally {
      setIsLoading(false);
    }
  }, [customers, updateStats]);

  // تحديث حالة جميع العملاء
  const updateAllCustomersStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await CustomerService.updateAllCustomersStatus();
      setCustomers(result.customers);
      updateStats(result.customers);
      
      console.log('تم تحديث حالة جميع العملاء:', {
        total: result.customers.length,
        updated: result.updated,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ غير معروف';
      setError(errorMessage);
      console.error('خطأ في تحديث حالة جميع العملاء:', err);
    } finally {
      setIsLoading(false);
    }
  }, [updateStats]);

  // تحديث قائمة العملاء
  const refreshCustomers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const allCustomers = await CustomerService.getAllCustomers();
      setCustomers(allCustomers);
      updateStats(allCustomers);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ غير معروف';
      setError(errorMessage);
      console.error('خطأ في تحديث قائمة العملاء:', err);
    } finally {
      setIsLoading(false);
    }
  }, [updateStats]);

  // تحديث تلقائي للحالة كل 5 دقائق
  useEffect(() => {
    const interval = setInterval(() => {
      if (customers.length > 0) {
        updateAllCustomersStatus();
      }
    }, 5 * 60 * 1000); // 5 دقائق

    return () => clearInterval(interval);
  }, [customers.length, updateAllCustomersStatus]);

  // تحميل العملاء عند بدء التشغيل
  useEffect(() => {
    refreshCustomers();
  }, [refreshCustomers]);

  return {
    customers,
    isLoading,
    error,
    stats,
    updateCustomerStatus,
    addContractToCustomer,
    updateContractForCustomer,
    removeContractFromCustomer,
    updateAllCustomersStatus,
    refreshCustomers,
  };
}
