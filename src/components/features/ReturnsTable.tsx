/**
 * مكون جدول المرتجعات
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ReturnTableData } from '@/lib/types/return';
import { formatDate } from '@/lib/utils/formatDate.util';
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Download,
  RotateCcw,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface ReturnsTableProps {
  data: ReturnTableData[];
  onAddReturn: () => void;
  onEditReturn: (returnItem: ReturnTableData) => void;
  onDeleteReturn: (returnItem: ReturnTableData) => void;
  onViewReturn: (returnItem: ReturnTableData) => void;
  onExportReturns: () => void;
  isLoading?: boolean;
}

export function ReturnsTable({
  data,
  onAddReturn,
  onEditReturn,
  onDeleteReturn,
  onViewReturn,
  onExportReturns,
  isLoading = false,
}: ReturnsTableProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      case 'processed':
        return <RotateCcw className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'processed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'معلق';
      case 'approved':
        return 'موافق عليه';
      case 'rejected':
        return 'مرفوض';
      case 'processed':
        return 'معالج';
      default:
        return 'غير محدد';
    }
  };


  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            قائمة المرتجعات
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExportReturns}
              disabled={isLoading}
            >
              <Download className="h-4 w-4 ml-2" />
              تصدير
            </Button>
            <Button
              onClick={onAddReturn}
              disabled={isLoading}
              size="sm"
            >
              <Plus className="h-4 w-4 ml-2" />
              إضافة مرتجع
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  اسم الصنف
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  العميل
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  تاريخ الإرجاع
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  الكمية
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  السبب
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  الحالة
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  القيمة
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {item.itemName}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {item.customerName}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {formatDate(item.returnDate, 'SHORT')}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {item.quantity}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {item.reason}
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={`${getStatusColor(item.status)} flex items-center gap-1 w-fit`}>
                      {getStatusIcon(item.status)}
                      {getStatusText(item.status)}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    ${item.value.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewReturn(item)}
                        disabled={isLoading}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditReturn(item)}
                        disabled={isLoading}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteReturn(item)}
                        disabled={isLoading}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {data.length === 0 && (
          <div className="text-center py-8">
            <RotateCcw className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              لا توجد مرتجعات مسجلة
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
