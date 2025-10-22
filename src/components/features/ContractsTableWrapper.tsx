'use client';

import React from 'react';
import { AdvancedContractsTable } from './AdvancedContractsTable';
import { AdvancedContract } from '@/lib/types/contracts';

interface ContractsTableWrapperProps {
  data: AdvancedContract[];
  filters?: any;
  isLoading?: boolean;
}

export function ContractsTableWrapper({
  data,
  filters = {},
  isLoading = false,
}: ContractsTableWrapperProps) {
  const handleViewContract = (contract: AdvancedContract) => {
    console.log('عرض العقد:', contract.contractNumber);
    // هنا يمكن إضافة منطق عرض العقد
  };

  const handleEditContract = (contract: AdvancedContract) => {
    console.log('تعديل العقد:', contract.contractNumber);
    // هنا يمكن إضافة منطق تعديل العقد
  };

  const handlePrintContract = (contract: AdvancedContract) => {
    console.log('طباعة العقد:', contract.contractNumber);
    // هنا يمكن إضافة منطق طباعة العقد
  };

  return (
    <AdvancedContractsTable
      data={data}
      onViewContract={handleViewContract}
      onEditContract={handleEditContract}
      onPrintContract={handlePrintContract}
      filters={filters}
      isLoading={isLoading}
    />
  );
}
