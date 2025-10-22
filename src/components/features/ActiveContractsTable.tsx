/**
 * مكون جدول العقود النشطة
 */

'use client';

import React, { useState, useMemo } from 'react';
import { ActiveContractData } from '@/data/contractsManagementData';
import { Search, Eye, Printer, Edit, TrendingUp, DollarSign, User, MapPin, Package, Clock } from 'lucide-react';

interface ActiveContractsTableProps {
  data: ActiveContractData[];
  onViewContract?: (contract: ActiveContractData) => void;
  onEditContract?: (contract: ActiveContractData) => void;
  onPrintContract?: (contract: ActiveContractData) => void;
  isLoading?: boolean;
}

export function ActiveContractsTable({
  data,
  onViewContract,
  onEditContract,
  onPrintContract,
  isLoading = false
}: ActiveContractsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('الكل');
  const [typeFilter, setTypeFilter] = useState<string>('الكل');
  const [priorityFilter, setPriorityFilter] = useState<string>('الكل');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // تصفية وترتيب البيانات
  const filteredData = useMemo(() => {
    const filtered = data.filter(contract => {
      const matchesSearch = 
        contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'الكل' || contract.status === statusFilter;
      const matchesType = typeFilter === 'الكل' || contract.contractType === typeFilter;
      const matchesPriority = priorityFilter === 'الكل' || contract.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesType && matchesPriority;
    });

    // ترتيب البيانات
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof ActiveContractData];
      let bValue: any = b[sortBy as keyof ActiveContractData];

      if (sortBy === 'totalValue') {
        aValue = a.totalValue;
        bValue = b.totalValue;
      } else if (sortBy === 'endDate') {
        aValue = new Date(a.endDate).getTime();
        bValue = new Date(b.endDate).getTime();
      } else if (sortBy === 'equipmentCount') {
        aValue = a.equipmentCount;
        bValue = b.equipmentCount;
      } else if (sortBy === 'status') {
        aValue = a.status;
        bValue = b.status;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [data, searchTerm, statusFilter, typeFilter, priorityFilter, sortBy, sortOrder]);

  // معالجة تغيير الترتيب
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  // الحصول على لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'نشط': return 'bg-green-100 text-green-800';
      case 'معتمد': return 'bg-blue-100 text-blue-800';
      case 'قيد التنفيذ': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // الحصول على لون الأولوية
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'عالي': return 'bg-red-100 text-red-800';
      case 'متوسط': return 'bg-yellow-100 text-yellow-800';
      case 'منخفض': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // الحصول على لون نوع العقد
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'تأجير': return 'bg-blue-100 text-blue-800';
      case 'شراء': return 'bg-green-100 text-green-800';
      case 'صيانة': return 'bg-orange-100 text-orange-800';
      case 'تركيب': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  // تنسيق المبلغ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'OMR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* شريط البحث والتصفية */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* البحث */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="البحث في رقم العقد، اسم العميل، أو الموقع..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
              />
            </div>
          </div>

          {/* تصفية الحالة */}
          <div className="lg:w-40">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
            >
              <option value="الكل">جميع الحالات</option>
              <option value="نشط">نشط</option>
              <option value="معتمد">معتمد</option>
              <option value="قيد التنفيذ">قيد التنفيذ</option>
            </select>
          </div>

          {/* تصفية النوع */}
          <div className="lg:w-40">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
            >
              <option value="الكل">جميع الأنواع</option>
              <option value="تأجير">تأجير</option>
              <option value="شراء">شراء</option>
              <option value="صيانة">صيانة</option>
              <option value="تركيب">تركيب</option>
            </select>
          </div>

          {/* تصفية الأولوية */}
          <div className="lg:w-40">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
            >
              <option value="الكل">جميع الأولويات</option>
              <option value="عالي">عالي</option>
              <option value="متوسط">متوسط</option>
              <option value="منخفض">منخفض</option>
            </select>
          </div>
        </div>

        {/* معلومات النتائج */}
        <div className="mt-4 text-sm text-gray-600">
          عرض {filteredData.length} من أصل {data.length} عقد نشط
        </div>
      </div>

      {/* الجدول */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('contractNumber')}
              >
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  رقم العقد
                  {sortBy === 'contractNumber' && (
                    <span className="text-[#58d2c8]">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('customerName')}
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  العميل
                  {sortBy === 'customerName' && (
                    <span className="text-[#58d2c8]">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                النوع/الحالة
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('totalValue')}
              >
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  القيمة/المدفوع
                  {sortBy === 'totalValue' && (
                    <span className="text-[#58d2c8]">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('progress')}
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  التقدم
                  {sortBy === 'progress' && (
                    <span className="text-[#58d2c8]">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('daysRemaining')}
              >
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  الأيام المتبقية
                  {sortBy === 'daysRemaining' && (
                    <span className="text-[#58d2c8]">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  الموقع
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((contract) => (
              <tr key={contract.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {contract.contractNumber}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(contract.priority)}`}>
                      {contract.priority}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {contract.customerName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {contract.customerId}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(contract.contractType)}`}>
                      {contract.contractType}
                    </span>
                    <br />
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                      {contract.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(contract.totalValue)}
                  </div>
                  <div className="text-sm text-green-600">
                    حالة الدفع: {contract.paymentStatus}
                  </div>
                  <div className="text-sm text-blue-600">
                    الأولوية: {contract.priority}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#58d2c8] h-2 rounded-full transition-all duration-300"
                        style={{ width: '75%' }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      75%
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {contract.equipmentCount} قطعة
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatDate(contract.endDate)}
                  </div>
                  <div className="text-xs text-gray-500">
                    حتى {formatDate(contract.endDate)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {contract.location}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewContract?.(contract)}
                      className="text-[#58d2c8] hover:text-[#4AB8B3] transition-colors"
                      title="عرض التفاصيل"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEditContract?.(contract)}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                      title="تعديل"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onPrintContract?.(contract)}
                      className="text-green-600 hover:text-green-700 transition-colors"
                      title="طباعة"
                    >
                      <Printer className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* رسالة عدم وجود نتائج */}
      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد عقود نشطة</h3>
          <p className="mt-1 text-sm text-gray-500">
            لم يتم العثور على عقود نشطة تطابق معايير البحث المحددة.
          </p>
        </div>
      )}
    </div>
  );
}
