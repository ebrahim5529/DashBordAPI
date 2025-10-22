/**
 * مكون جدول طلبات الشراء
 */

'use client';

import React, { useState } from 'react';
import { PurchaseRequestTableData } from '@/lib/types/financial';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface PurchaseRequestsTableProps {
  data: PurchaseRequestTableData[];
  onAddPurchaseRequest: () => void;
  onEditPurchaseRequest: (request: PurchaseRequestTableData) => void;
  onDeletePurchaseRequest: (request: PurchaseRequestTableData) => void;
  onViewPurchaseRequest: (request: PurchaseRequestTableData) => void;
  onApprovePurchaseRequest: (request: PurchaseRequestTableData) => void;
  onExportPurchaseRequests: () => void;
}

export function PurchaseRequestsTable({
  data,
  onAddPurchaseRequest,
  onEditPurchaseRequest,
  onDeletePurchaseRequest,
  onViewPurchaseRequest,
  onApprovePurchaseRequest,
  onExportPurchaseRequests,
}: PurchaseRequestsTableProps) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    department: '',
    type: '',
    supplier: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // تقليل العدد لتجنب scroll bar

  // تطبيق الفلاتر
  const filteredData = data.filter((item) => {
    // فلترة النص العام
    if (globalFilter && !item.requestNumber.toLowerCase().includes(globalFilter.toLowerCase()) &&
        !item.supplierName.toLowerCase().includes(globalFilter.toLowerCase())) {
      return false;
    }
    
    // فلترة الحالة
    if (filters.status && item.status !== filters.status) return false;
    
    // فلترة القسم
    if (filters.department && item.department !== filters.department) return false;
    
    // فلترة النوع
    if (filters.type && item.type !== filters.type) return false;
    
    // فلترة المورد
    if (filters.supplier && item.supplierName !== filters.supplier) return false;
    
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const getTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      MATERIALS: 'مواد',
      EQUIPMENT: 'معدات',
      SERVICES: 'خدمات',
    };
    return typeLabels[type] || type;
  };

  const getStatusLabel = (status: string) => {
    const statusLabels: Record<string, string> = {
      NEW: 'جديد',
      UNDER_REVIEW: 'قيد المراجعة',
      APPROVED: 'معتمد',
      REJECTED: 'مرفوض',
      COMPLETED: 'مكتمل',
    };
    return statusLabels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      NEW: 'bg-blue-100 text-blue-800',
      UNDER_REVIEW: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      COMPLETED: 'bg-purple-100 text-purple-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    const typeColors: Record<string, string> = {
      MATERIALS: 'bg-green-100 text-green-800',
      EQUIPMENT: 'bg-blue-100 text-blue-800',
      SERVICES: 'bg-purple-100 text-purple-800',
    };
    return typeColors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      {/* شريط البحث والفلترة */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="البحث في طلبات الشراء..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            فلاتر
            {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <Button
            onClick={onAddPurchaseRequest}
            className="flex items-center gap-2 bg-[#58d2c8] hover:bg-[#4bb8ad]"
          >
            <Plus className="h-4 w-4" />
            طلب شراء جديد
          </Button>
          <Button
            variant="outline"
            onClick={onExportPurchaseRequests}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            تصدير
          </Button>
        </div>

        {/* الفلاتر المتقدمة */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="">جميع الحالات</option>
              <option value="NEW">جديد</option>
              <option value="UNDER_REVIEW">قيد المراجعة</option>
              <option value="APPROVED">معتمد</option>
              <option value="REJECTED">مرفوض</option>
              <option value="COMPLETED">مكتمل</option>
            </select>

            <select
              value={filters.department}
              onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="">جميع الأقسام</option>
              <option value="الصيانة">الصيانة</option>
              <option value="المشاريع">المشاريع</option>
              <option value="التقنية">التقنية</option>
              <option value="المحاسبة">المحاسبة</option>
            </select>

            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="">جميع الأنواع</option>
              <option value="MATERIALS">مواد</option>
              <option value="EQUIPMENT">معدات</option>
              <option value="SERVICES">خدمات</option>
            </select>

            <select
              value={filters.supplier}
              onChange={(e) => setFilters(prev => ({ ...prev, supplier: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="">جميع الموردين</option>
              <option value="شركة الرواد للتوريد">شركة الرواد للتوريد</option>
              <option value="شركة البناء الحديث">شركة البناء الحديث</option>
              <option value="شركة الخدمات التقنية">شركة الخدمات التقنية</option>
            </select>
          </div>
        )}
      </div>

      {/* الجدول */}
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                رقم الطلب
              </th>
              <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                التاريخ
              </th>
              <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                المورد
              </th>
              <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                القسم
              </th>
              <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                النوع
              </th>
              <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                الكمية
              </th>
              <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                التكلفة التقديرية
              </th>
              <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                الحالة
              </th>
              <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((row) => (
                <tr
                  key={row.requestNumber}
                  className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-2 py-3 text-sm">
                    <div className="font-medium text-[#58d2c8]">
                      {row.requestNumber}
                    </div>
                  </td>
                  <td className="px-2 py-3 text-sm">
                    <div className="text-gray-600">
                      {row.date.toLocaleDateString('ar-SA')}
                    </div>
                  </td>
                  <td className="px-2 py-3 text-sm">
                    <div className="max-w-[150px] truncate">
                      {row.supplierName}
                    </div>
                  </td>
                  <td className="px-2 py-3 text-sm">
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                      {row.department}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(row.type)}`}>
                      {getTypeLabel(row.type)}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-sm">
                    <div className="text-center font-medium">
                      {row.quantity}
                    </div>
                  </td>
                  <td className="px-2 py-3 text-sm">
                    <div className="font-medium text-[#58d2c8]">
                      {row.estimatedCost.toLocaleString()} ريال
                    </div>
                  </td>
                  <td className="px-2 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(row.status)}`}>
                      {getStatusLabel(row.status)}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-sm">
                    <div className="flex items-center gap-0.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewPurchaseRequest(row)}
                        className="h-6 w-6 p-0 hover:bg-blue-100"
                        title="عرض التفاصيل"
                      >
                        <Eye className="h-3 w-3 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditPurchaseRequest(row)}
                        className="h-6 w-6 p-0 hover:bg-green-100"
                        title="تعديل"
                      >
                        <Edit className="h-3 w-3 text-green-600" />
                      </Button>
                      {(row.status === 'NEW' || row.status === 'UNDER_REVIEW') && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onApprovePurchaseRequest(row)}
                            className="h-6 w-6 p-0 hover:bg-green-100"
                            title="اعتماد"
                          >
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeletePurchaseRequest(row)}
                        className="h-6 w-6 p-0 hover:bg-red-100"
                        title="حذف"
                      >
                        <Trash2 className="h-3 w-3 text-red-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="h-24 text-center text-gray-500">
                  لا توجد طلبات شراء
                </td>
              </tr>
            )}
          </tbody>
          </table>
        </div>
      </div>

      {/* التحكم في الصفحات */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          عرض {startIndex + 1} إلى{' '}
          {Math.min(endIndex, filteredData.length)}{' '}
          من {filteredData.length} طلب شراء
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1"
          >
            <ChevronRight className="h-4 w-4" />
            السابق
          </Button>
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-700">صفحة</span>
            <span className="font-medium">
              {currentPage} من {totalPages}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1"
          >
            التالي
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
