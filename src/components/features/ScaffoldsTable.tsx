/**
 * مكون جدول السقالات
 */

'use client';

import React, { useState } from 'react';
import { ScaffoldTableData } from '@/lib/types/inventory';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface ScaffoldsTableProps {
  data: ScaffoldTableData[];
  onAddScaffold: () => void;
  onEditScaffold: (scaffold: ScaffoldTableData) => void;
  onDeleteScaffold: (scaffold: ScaffoldTableData) => void;
  onViewScaffold: (scaffold: ScaffoldTableData) => void;
  onExportScaffolds: () => void;
}

export function ScaffoldsTable({
  data,
  onAddScaffold,
  onEditScaffold,
  onDeleteScaffold,
  onViewScaffold,
  onExportScaffolds,
}: ScaffoldsTableProps) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    material: '',
    condition: '',
    status: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // تطبيق الفلاتر
  const filteredData = data.filter((item) => {
    // فلترة النص العام
    if (globalFilter && !item.scaffoldNumber.toLowerCase().includes(globalFilter.toLowerCase())) {
      return false;
    }
    
    // فلترة النوع
    if (filters.type && item.type !== filters.type) return false;
    
    // فلترة المادة
    if (filters.material && item.material !== filters.material) return false;
    
    // فلترة الحالة
    if (filters.condition && item.condition !== filters.condition) return false;
    
    // فلترة حالة المخزون
    if (filters.status && item.status !== filters.status) return false;
    
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const getTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      FIXED: 'مثبتة',
      MOBILE: 'متحركة',
      TOWER: 'برجية',
      CANTILEVER: 'كابولية',
      SUSPENDED: 'معلقة',
    };
    return typeLabels[type] || type;
  };

  const getMaterialLabel = (material: string) => {
    const materialLabels: Record<string, string> = {
      STEEL: 'حديد',
      ALUMINUM: 'ألومنيوم',
      WOOD: 'خشب',
      COMPOSITE: 'مركب',
    };
    return materialLabels[material] || material;
  };

  const getConditionLabel = (condition: string) => {
    const conditionLabels: Record<string, string> = {
      NEW: 'جديد',
      USED: 'مستعمل',
      REFURBISHED: 'معاد تأهيله',
    };
    return conditionLabels[condition] || condition;
  };

  const getStatusLabel = (status: string) => {
    const statusLabels: Record<string, string> = {
      AVAILABLE: 'متوفرة',
      RENTED: 'مستأجرة',
      SOLD: 'مباعة',
      MAINTENANCE: 'صيانة',
      RESERVED: 'محجوزة',
    };
    return statusLabels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      AVAILABLE: 'bg-green-100 text-green-800',
      RENTED: 'bg-blue-100 text-blue-800',
      SOLD: 'bg-purple-100 text-purple-800',
      MAINTENANCE: 'bg-orange-100 text-orange-800',
      RESERVED: 'bg-gray-100 text-gray-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
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
              placeholder="البحث في السقالات..."
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
            onClick={onAddScaffold}
            className="flex items-center gap-2 bg-[#913D95] hover:bg-[#7A2F7D]"
          >
            <Plus className="h-4 w-4" />
            إضافة معدة
          </Button>
          <Button
            variant="outline"
            onClick={onExportScaffolds}
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
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="">جميع الأنواع</option>
              <option value="FIXED">مثبتة</option>
              <option value="MOBILE">متحركة</option>
              <option value="TOWER">برجية</option>
              <option value="CANTILEVER">كابولية</option>
              <option value="SUSPENDED">معلقة</option>
            </select>

            <select
              value={filters.material}
              onChange={(e) => setFilters(prev => ({ ...prev, material: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="">جميع المواد</option>
              <option value="STEEL">حديد</option>
              <option value="ALUMINUM">ألومنيوم</option>
              <option value="WOOD">خشب</option>
              <option value="COMPOSITE">مركب</option>
            </select>

            <select
              value={filters.condition}
              onChange={(e) => setFilters(prev => ({ ...prev, condition: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="">جميع الحالات</option>
              <option value="NEW">جديد</option>
              <option value="USED">مستعمل</option>
              <option value="REFURBISHED">معاد تأهيله</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="">جميع حالات المخزون</option>
              <option value="AVAILABLE">متوفرة</option>
              <option value="RENTED">مستأجرة</option>
              <option value="SOLD">مباعة</option>
              <option value="MAINTENANCE">صيانة</option>
              <option value="RESERVED">محجوزة</option>
            </select>
          </div>
        )}
      </div>

      {/* الجدول */}
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                رقم المعدة
              </th>
              <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                النوع
              </th>
              <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                المادة
              </th>
              <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                الحالة
              </th>
              <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                حالة المخزون
              </th>
              <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                الكمية
              </th>
              <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                سعر البيع
              </th>
              <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                سعر الإيجار
              </th>
              <th className="px-2 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                تاريخ الإدخال
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
                  key={row.scaffoldNumber}
                  className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-2 py-3 text-sm">
                    <div className="font-medium text-[#913D95]">
                      {row.scaffoldNumber}
                    </div>
                  </td>
                  <td className="px-2 py-3 text-sm">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {getTypeLabel(row.type)}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-sm">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {getMaterialLabel(row.material)}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-sm">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                      {getConditionLabel(row.condition)}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(row.status)}`}>
                      {getStatusLabel(row.status)}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-sm">
                    <div className="text-center">
                      <div className="text-xs font-medium">{row.quantity}</div>
                      <div className="text-xs text-gray-500">
                        متوفر: {row.availableQuantity}
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-3 text-sm">
                    <div className="text-xs font-medium text-[#913D95]">
                      {row.sellingPrice.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-2 py-3 text-sm">
                    <div className="text-xs">
                      <div className="font-medium">{row.dailyRentalPrice}/يوم</div>
                      <div className="text-xs text-gray-500">
                        {row.monthlyRentalPrice}/شهر
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-3 text-sm">
                    <div className="text-sm text-gray-600">
                      {row.entryDate.toLocaleDateString('ar-SA')}
                    </div>
                  </td>
                  <td className="px-2 py-3 text-sm">
                    <div className="flex items-center gap-0.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewScaffold(row)}
                        className="h-6 w-6 p-0 hover:bg-blue-100"
                        title="عرض التفاصيل"
                      >
                        <Eye className="h-3 w-3 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditScaffold(row)}
                        className="h-6 w-6 p-0 hover:bg-green-100"
                        title="تعديل"
                      >
                        <Edit className="h-3 w-3 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteScaffold(row)}
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
                  لا توجد سقالات
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
          من {filteredData.length} معدة
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