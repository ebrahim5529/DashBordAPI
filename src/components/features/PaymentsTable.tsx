/**
 * جدول المدفوعات
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { PaymentTableData } from '@/data/paymentData';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Download,
  Receipt,
  Calendar,
  DollarSign,
  CreditCard
} from 'lucide-react';

interface PaymentsTableProps {
  data: PaymentTableData[];
  onAddPayment: () => void;
  onEditPayment: (payment: PaymentTableData) => void;
  onDeletePayment: (payment: PaymentTableData) => void;
  onViewPayment: (payment: PaymentTableData) => void;
  onExportPayments: () => void;
}

export function PaymentsTable({
  data,
  onAddPayment,
  onEditPayment,
  onDeletePayment,
  onViewPayment,
  onExportPayments,
}: PaymentsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتمل';
      case 'pending':
        return 'معلق';
      case 'overdue':
        return 'متأخر';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>قائمة المدفوعات</CardTitle>
            <CardDescription>جميع المدفوعات المسجلة في النظام</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={onExportPayments}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              تصدير
            </Button>
            <Button
              onClick={onAddPayment}
              className="flex items-center gap-2 bg-[#58d2c8] hover:bg-[#4bb8ad]"
            >
              <Plus className="h-4 w-4" />
              إضافة دفعة
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                  <Receipt className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {payment.customerName}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {payment.contractNumber} - {payment.receiptNumber}
                  </p>
                  <div className="flex items-center space-x-6 rtl:space-x-reverse mt-2">
                    <div className="flex items-center space-x-1 rtl:space-x-reverse">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {payment.amount.toLocaleString()} ريال
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 rtl:space-x-reverse">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {payment.paymentDate}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 rtl:space-x-reverse">
                      <CreditCard className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {payment.paymentMethod}
                      </span>
                    </div>
                  </div>
                  {payment.notes && (
                    <p className="text-xs text-gray-500 mt-1">
                      {payment.notes}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${getStatusColor(payment.status)}`}
                >
                  {getStatusText(payment.status)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewPayment(payment)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditPayment(payment)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => onDeletePayment(payment)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
