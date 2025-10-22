/**
 * مكون جدول العقود المنتهية الصلاحية
 */

'use client';

import React, { useState } from 'react';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { ContractsTableData } from '@/lib/types/contracts';
import { formatNumber } from '@/lib/utils/formatNumbers';
import { formatDate } from '@/lib/utils/formatDate.util';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Download, 
  Search,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface ExpiredContractsTableProps {
  data: ContractsTableData[];
  onAddContract: () => void;
  onEditContract: (contract: ContractsTableData) => void;
  onDeleteContract: (contract: ContractsTableData) => void;
  onViewContract: (contract: ContractsTableData) => void;
  onExportContracts: () => void;
  isLoading?: boolean;
}

export function ExpiredContractsTable({
  data,
  onAddContract: _onAddContract,
  onEditContract,
  onDeleteContract,
  onViewContract,
  onExportContracts,
  isLoading = false,
}: ExpiredContractsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // تصفية البيانات
  const filteredData = data.filter((contract) => {
    const matchesSearch = 
      contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contractType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || contract.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // الحصول على لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'منتهي':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'معتمد':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'مسودة':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  // الحصول على أيقونة الحالة
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'منتهي':
        return <AlertTriangle className="h-4 w-4" />;
      case 'معتمد':
        return <CheckCircle className="h-4 w-4" />;
      case 'مسودة':
        return <Clock className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Card className="p-6">
      {/* شريط البحث والفلترة */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="البحث في العقود المنتهية..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
          >
            <option value="all">جميع الحالات</option>
            <option value="منتهي">منتهي</option>
            <option value="معتمد">معتمد</option>
            <option value="مسودة">مسودة</option>
          </select>
          
          <Button
            onClick={onExportContracts}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            تصدير
          </Button>
        </div>
      </div>

      {/* الجدول */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                رقم العقد
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                العميل
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                نوع العقد
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                تاريخ الانتهاء
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                القيمة الإجمالية
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                المدفوع
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                المستحق
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                الحالة
              </th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={9} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="mr-2">جاري التحميل...</span>
                  </div>
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-gray-500 dark:text-gray-400">
                  لا توجد عقود منتهية الصلاحية
                </td>
              </tr>
            ) : (
              filteredData.map((contract) => (
                <tr
                  key={contract.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {contract.contractNumber}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-900 dark:text-white">
                      {contract.customerName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {contract.customerId}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                      {contract.contractType}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-900 dark:text-white">
                      {formatDate(contract.endDate)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900 dark:text-white">
                      ريال {formatNumber(contract.totalValue)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-green-600 dark:text-green-400">
                      ريال {formatNumber(contract.paidAmount)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className={`font-medium ${contract.pendingAmount > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                      ريال {formatNumber(contract.pendingAmount)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                      {getStatusIcon(contract.status)}
                      {contract.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => onViewContract(contract)}
                        variant="outline"
                        size="sm"
                        className="p-2"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => onEditContract(contract)}
                        variant="outline"
                        size="sm"
                        className="p-2"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => onDeleteContract(contract)}
                        variant="outline"
                        size="sm"
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* معلومات إضافية */}
      {filteredData.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>
              عرض {filteredData.length} من أصل {data.length} عقد منتهي
            </span>
            <div className="flex items-center gap-4">
              <span>
                إجمالي القيمة: ريال {formatNumber(data.reduce((sum, contract) => sum + contract.totalValue, 0))}
              </span>
              <span>
                إجمالي المستحق: ريال {formatNumber(data.reduce((sum, contract) => sum + contract.pendingAmount, 0))}
              </span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
