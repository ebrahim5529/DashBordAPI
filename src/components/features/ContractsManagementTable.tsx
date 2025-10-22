/**
 * مكون جدول إدارة العقود
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContractManagementData } from '@/data/contractsManagementData';
import { Search, Eye, Printer, Edit, Trash2, FileText, Calendar, DollarSign, User, MapPin, Package, Receipt, GitBranch, CheckCircle, X } from 'lucide-react';
import { safeFormatDate } from '@/lib/utils/safeDateFormat';

interface ContractsManagementTableProps {
  data: ContractManagementData[];
  onViewContract?: (contract: ContractManagementData) => void; // kept for compatibility
  onEditContract?: (contract: ContractManagementData) => void;
  onDeleteContract?: (contract: ContractManagementData) => void;
  onPrintContract?: (contract: ContractManagementData) => void;
  onGenerateInvoice?: (contract: ContractManagementData) => void;
  isLoading?: boolean;
}

export function ContractsManagementTable({
  data,
  onViewContract: _onViewContract,
  onEditContract,
  onDeleteContract,
  onPrintContract,
  onGenerateInvoice,
  isLoading = false
}: ContractsManagementTableProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('الكل');
  const [typeFilter, setTypeFilter] = useState<string>('الكل');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showStagesModal, setShowStagesModal] = useState(false);
  const [selectedContractForStages, setSelectedContractForStages] = useState<ContractManagementData | null>(null);

  // تصفية وترتيب البيانات
  const filteredData = useMemo(() => {
    const filtered = data.filter(contract => {
      const matchesSearch = 
        contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'الكل' || contract.status === statusFilter;
      const matchesType = typeFilter === 'الكل' || contract.contractType === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });

    // ترتيب البيانات
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof ContractManagementData];
      let bValue: any = b[sortBy as keyof ContractManagementData];

      if (sortBy === 'totalValue') {
        aValue = a.totalValue;
        bValue = b.totalValue;
      } else if (sortBy === 'createdAt') {
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
      } else if (sortBy === 'endDate') {
        aValue = new Date(a.endDate).getTime();
        bValue = new Date(b.endDate).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [data, searchTerm, statusFilter, typeFilter, sortBy, sortOrder]);

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
      case 'منتهي': return 'bg-gray-100 text-gray-800';
      case 'ملغي': return 'bg-red-100 text-red-800';
      case 'معلق': return 'bg-yellow-100 text-yellow-800';
      case 'معتمد': return 'bg-blue-100 text-blue-800';
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

  // تنسيق التاريخ - استخدام الدالة الآمنة لتجنب مشكلة Hydration
  const formatDate = (dateString: string) => {
    return safeFormatDate(dateString);
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
          <div className="lg:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
            >
              <option value="الكل">جميع الحالات</option>
              <option value="نشط">نشط</option>
              <option value="منتهي">منتهي</option>
              <option value="ملغي">ملغي</option>
              <option value="معلق">معلق</option>
              <option value="معتمد">معتمد</option>
            </select>
          </div>

          {/* تصفية النوع */}
          <div className="lg:w-48">
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
        </div>

        {/* معلومات النتائج */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            عرض {filteredData.length} من أصل {data.length} عقد
          </div>
          <div className="text-sm text-blue-600 flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span>اضغط على أي صف لعرض التفاصيل الكاملة</span>
          </div>
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
                  <FileText className="h-4 w-4" />
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
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  النوع
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الحالة
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('totalValue')}
              >
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  القيمة
                  {sortBy === 'totalValue' && (
                    <span className="text-[#58d2c8]">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('endDate')}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  تاريخ الانتهاء
                  {sortBy === 'endDate' && (
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
              <tr 
                key={contract.id} 
                className="hover:bg-blue-50 hover:shadow-md cursor-pointer transition-all duration-200 hover:scale-[1.005]"
                onClick={(e) => {
                  // تجاهل النقر إذا كان على زر أو رابط
                  const target = e.target as HTMLElement;
                  if (target.closest('button') || target.closest('a')) {
                    console.log('تم تجاهل النقر - على زر أو رابط');
                    return;
                  }
                  // التوجيه إلى صفحة التفاصيل
                  const url = `/dashboard/contract-details/${contract.id}`;
                  console.log('التوجيه إلى:', url);
                  console.log('معرف العقد:', contract.id);
                  navigate(url);
                }}
                title="اضغط لعرض التفاصيل الكاملة"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {contract.contractNumber}
                  </div>
                  <div className="text-sm text-gray-500">
                    {contract.priority === 'عالي' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        عالي
                      </span>
                    )}
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
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(contract.contractType)}`}>
                    {contract.contractType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                    {contract.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(contract.totalValue)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {contract.equipmentCount} قطعة
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(contract.endDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {contract.location}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex flex-col gap-2">
                    {/* أزرار الأيقونات */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedContractForStages(contract);
                          setShowStagesModal(true);
                        }}
                        className="text-purple-600 hover:text-purple-700 transition-colors"
                        title="عرض المراحل"
                      >
                        <GitBranch className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/dashboard/contract-details/${contract.id}`)}
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
                      <button
                        onClick={() => onDeleteContract?.(contract)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {/* زر إصدار فاتورة */}
                    <button
                      onClick={() => onGenerateInvoice?.(contract)}
                      className="flex items-center justify-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-lg transition-colors whitespace-nowrap"
                    >
                      <Receipt className="h-3.5 w-3.5" />
                      إصدار فاتورة
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
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد عقود</h3>
          <p className="mt-1 text-sm text-gray-500">
            لم يتم العثور على عقود تطابق معايير البحث المحددة.
          </p>
        </div>
      )}

      {/* نافذة عرض المراحل */}
      {showStagesModal && selectedContractForStages && (
        <ContractStagesModal
          contract={selectedContractForStages}
          onClose={() => {
            setShowStagesModal(false);
            setSelectedContractForStages(null);
          }}
        />
      )}
    </div>
  );
}

// مكون نافذة عرض المراحل
interface ContractStagesModalProps {
  contract: ContractManagementData;
  onClose: () => void;
}

function ContractStagesModal({ contract, onClose }: ContractStagesModalProps) {
  // تحديد المراحل والحالة الحالية
  const stages = [
    {
      id: 1,
      name: 'توقيع العقد',
      status: 'completed', // completed, active, pending
      icon: CheckCircle,
    },
    {
      id: 2,
      name: 'التسليم',
      status: contract.status === 'نشط' ? 'completed' : 'pending',
      icon: CheckCircle,
    },
    {
      id: 3,
      name: contract.status === 'نشط' ? 'نشط' : 'غير نشط',
      status: contract.status === 'نشط' ? 'active' : 'pending',
      icon: CheckCircle,
    },
    {
      id: 4,
      name: 'انتهاء العقد',
      status: contract.status === 'منتهي' ? 'completed' : 'pending',
      icon: CheckCircle,
    },
  ];

  const getStageColor = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          bg: 'bg-gradient-to-r from-green-400 to-green-500',
          border: 'border-green-500',
          text: 'text-green-600',
          shadow: 'shadow-lg shadow-green-200',
        };
      case 'active':
        return {
          bg: 'bg-gradient-to-r from-blue-400 to-blue-500',
          border: 'border-blue-500',
          text: 'text-blue-600',
          shadow: 'shadow-lg shadow-blue-200',
        };
      default:
        return {
          bg: 'bg-gray-100',
          border: 'border-gray-300',
          text: 'text-gray-500',
          shadow: '',
        };
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <GitBranch className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">مراحل العقد</h2>
              <p className="text-sm text-gray-600 mt-1">{contract.contractNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* معلومات العقد */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">العميل:</span>
                <span className="font-medium text-gray-900 mr-2">{contract.customerName}</span>
              </div>
              <div>
                <span className="text-gray-600">الحالة:</span>
                <span className={`font-medium mr-2 ${
                  contract.status === 'نشط' ? 'text-green-600' : 
                  contract.status === 'منتهي' ? 'text-gray-600' : 
                  'text-yellow-600'
                }`}>
                  {contract.status}
                </span>
              </div>
            </div>
          </div>

          {/* المراحل */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-1 min-w-full justify-center">
              {stages.map((stage, index) => {
                const colors = getStageColor(stage.status);
                return (
                  <div key={stage.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      {/* الدائرة */}
                      <div
                        className={`relative w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${colors.bg} ${colors.border} ${colors.shadow}`}
                      >
                        {stage.status === 'completed' ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : stage.status === 'active' ? (
                          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                        ) : (
                          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        )}
                      </div>
                      
                      {/* النص */}
                      <span
                        className={`text-xs mt-2 text-center font-medium transition-colors duration-200 max-w-[80px] leading-tight ${colors.text}`}
                      >
                        {stage.name}
                      </span>
                    </div>

                    {/* الخط الفاصل */}
                    {index < stages.length - 1 && (
                      <div
                        className={`h-1 w-12 mx-2 rounded-full transition-all duration-500 ${
                          stages[index + 1].status === 'completed' || stages[index + 1].status === 'active'
                            ? 'bg-green-400'
                            : 'bg-gray-200'
                        }`}
                      ></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* معلومات إضافية */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">ملاحظات:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• تم توقيع العقد بتاريخ: {contract.startDate}</li>
              <li>• تاريخ الانتهاء المتوقع: {contract.endDate}</li>
              <li>• الحالة الحالية: {contract.status}</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
