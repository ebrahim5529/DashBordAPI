/**
 * مكون تفاصيل العقد المنتهي الصلاحية
 */

'use client';

import React from 'react';
import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { ContractsTableData } from '@/lib/types/contracts';
import { formatNumber } from '@/lib/utils/formatNumbers';
import { formatDate } from '@/lib/utils/formatDate.util';
import { 
  ArrowRight, 
  Edit, 
  Trash2, 
  Download, 
  Printer,
  FileText,
  DollarSign,
  User,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface ExpiredContractDetailsProps {
  contract: ContractsTableData;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
  onPrint: () => void;
  onExport: () => void;
}

export function ExpiredContractDetails({
  contract,
  onEdit,
  onDelete,
  onBack,
  onPrint,
  onExport,
}: ExpiredContractDetailsProps) {
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

  // حساب المدة المنقضية منذ انتهاء العقد
  const getDaysExpired = () => {
    const now = new Date();
    const endDate = new Date(contract.endDate);
    const diffTime = now.getTime() - endDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysExpired = getDaysExpired();

  return (
    <div className="space-y-6">
      {/* شريط العنوان والإجراءات */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            onClick={onBack}
            variant="outline"
            className="p-2"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              تفاصيل العقد المنتهي
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {contract.contractNumber}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={onPrint}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            طباعة
          </Button>
          <Button
            onClick={onExport}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            تصدير
          </Button>
          <Button
            onClick={onEdit}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            تعديل
          </Button>
          <Button
            onClick={onDelete}
            variant="outline"
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4" />
            حذف
          </Button>
        </div>
      </div>

      {/* معلومات العقد الأساسية */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">معلومات العقد الأساسية</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              رقم العقد
            </label>
            <p className="text-gray-900 dark:text-white font-medium">
              {contract.contractNumber}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              نوع العقد
            </label>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
              {contract.contractType}
            </span>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              الحالة
            </label>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
              {getStatusIcon(contract.status)}
              {contract.status}
            </span>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              تاريخ البداية
            </label>
            <p className="text-gray-900 dark:text-white">
              {formatDate(contract.startDate)}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              تاريخ الانتهاء
            </label>
            <p className="text-gray-900 dark:text-white">
              {formatDate(contract.endDate)}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              المدة المنقضية
            </label>
            <p className="text-red-600 dark:text-red-400 font-medium">
              {daysExpired} يوم
            </p>
          </div>
        </div>
      </Card>

      {/* معلومات العميل */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">معلومات العميل</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              اسم العميل
            </label>
            <p className="text-gray-900 dark:text-white font-medium">
              {contract.customerName}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              رقم العميل
            </label>
            <p className="text-gray-900 dark:text-white">
              {contract.customerId}
            </p>
          </div>
        </div>
      </Card>

      {/* المعلومات المالية */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">المعلومات المالية</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ريال {formatNumber(contract.totalValue)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              القيمة الإجمالية
            </div>
          </div>
          
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              ريال {formatNumber(contract.paidAmount)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              المبلغ المدفوع
            </div>
          </div>
          
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              ريال {formatNumber(contract.pendingAmount)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              المبلغ المستحق
            </div>
          </div>
        </div>
        
        {/* شريط التقدم */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              نسبة الإنجاز
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {contract.totalValue > 0 ? Math.round((contract.paidAmount / contract.totalValue) * 100) : 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width: `${contract.totalValue > 0 ? (contract.paidAmount / contract.totalValue) * 100 : 0}%`
              }}
            ></div>
          </div>
        </div>
      </Card>

      {/* المرفقات */}
      {contract.attachments && contract.attachments.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">المرفقات</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contract.attachments.map((attachment, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <FileText className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {attachment}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="p-1"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* الملاحظات */}
      {contract.notes && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">ملاحظات</h2>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {contract.notes}
            </p>
          </div>
        </Card>
      )}

      {/* تحذير انتهاء الصلاحية */}
      <Card className="p-6 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <h2 className="text-xl font-semibold text-red-800 dark:text-red-400">
            تحذير انتهاء الصلاحية
          </h2>
        </div>
        
        <div className="space-y-2">
          <p className="text-red-700 dark:text-red-300">
            هذا العقد منتهي الصلاحية منذ {daysExpired} يوم
          </p>
          {contract.pendingAmount > 0 && (
            <p className="text-red-700 dark:text-red-300">
              يوجد مبلغ مستحق: ريال {formatNumber(contract.pendingAmount)}
            </p>
          )}
          <p className="text-red-700 dark:text-red-300">
            يرجى مراجعة المبالغ المستحقة واتخاذ الإجراءات اللازمة
          </p>
        </div>
      </Card>
    </div>
  );
}
