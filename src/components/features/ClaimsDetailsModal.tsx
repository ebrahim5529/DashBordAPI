/**
 * نافذة تفاصيل المطالبة
 */

'use client';

import React, { useState } from 'react';
import { ClaimsTableData } from '@/lib/types/claims';
import { Button } from '@/components/shared/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import {
  X,
  User,
  Phone,
  FileText,
  DollarSign,
  MessageSquare,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Bell,
  Download,
  Printer,
} from 'lucide-react';

interface ClaimsDetailsModalProps {
  claim: ClaimsTableData;
  onClose: () => void;
}

export function ClaimsDetailsModal({ claim, onClose }: ClaimsDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'contracts' | 'payments' | 'reminders' | 'notes'>('overview');

  // بيانات وهمية للعقود
  const contracts = [
    {
      id: '1',
      contractNumber: 'CNT-2024-001',
      contractType: 'إيجار',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      totalValue: 2000,
      paidAmount: 1000,
      pendingAmount: 1000,
      status: 'نشط',
    },
    {
      id: '2',
      contractNumber: 'CNT-2024-002',
      contractType: 'شراء',
      startDate: new Date('2023-11-01'),
      endDate: new Date('2024-10-31'),
      totalValue: 3000,
      paidAmount: 1500,
      pendingAmount: 1500,
      status: 'نشط',
    },
  ];

  // بيانات وهمية للدفعات
  const payments = [
    {
      id: '1',
      amount: 500,
      paymentType: 'تحويل بنكي',
      paymentDate: new Date('2024-01-15'),
      reference: 'TRF001234',
      receiptNumber: 'RCP001',
    },
    {
      id: '2',
      amount: 1000,
      paymentType: 'نقداً',
      paymentDate: new Date('2023-12-10'),
      reference: 'CASH001',
      receiptNumber: 'RCP002',
    },
  ];

  // بيانات وهمية للتذكيرات
  const reminders = [
    {
      id: '1',
      reminderType: 'SMS',
      message: 'تذكير: لديك مبلغ مستحق للدفع',
      sentDate: new Date('2024-01-05'),
      status: 'تم الإرسال',
    },
    {
      id: '2',
      reminderType: 'EMAIL',
      message: 'تذكير عاجل: لديك مبلغ كبير مستحق للدفع',
      sentDate: new Date('2024-01-10'),
      status: 'تم الإرسال',
    },
  ];

  // بيانات وهمية للملاحظات
  const notes = [
    {
      id: '1',
      content: 'عميل ممتاز، دفع منتظم',
      createdAt: new Date('2024-01-01'),
      createdBy: 'المدير',
    },
    {
      id: '2',
      content: 'تأخير في الدفع، يحتاج متابعة',
      createdAt: new Date('2024-01-10'),
      createdBy: 'محاسب',
    },
  ];

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: User },
    { id: 'contracts', label: 'العقود', icon: FileText },
    { id: 'payments', label: 'الدفعات', icon: DollarSign },
    { id: 'reminders', label: 'التذكيرات', icon: Bell },
    { id: 'notes', label: 'الملاحظات', icon: MessageSquare },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'PARTIAL':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'PAID':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'OVERDUE':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const statusMap = {
      PENDING: 'معلق',
      PARTIAL: 'جزئي',
      PAID: 'مدفوع',
      OVERDUE: 'متأخر',
      CANCELLED: 'ملغي',
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getPriorityColor = (priority: string) => {
    const colorMap = {
      LOW: 'bg-gray-100 text-gray-800',
      NORMAL: 'bg-blue-100 text-blue-800',
      HIGH: 'bg-orange-100 text-orange-800',
      URGENT: 'bg-red-100 text-red-800',
    };
    return colorMap[priority as keyof typeof colorMap] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityLabel = (priority: string) => {
    const labelMap = {
      LOW: 'منخفضة',
      NORMAL: 'عادية',
      HIGH: 'عالية',
      URGENT: 'عاجلة',
    };
    return labelMap[priority as keyof typeof labelMap] || priority;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            تفاصيل المطالبة - {claim.customerName}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* تبويبات التنقل */}
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* محتوى التبويبات */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* معلومات العميل */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">معلومات العميل</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-muted-foreground">الاسم:</span>
                        <span className="font-medium">{claim.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-muted-foreground">الهاتف:</span>
                        <span className="font-medium">{claim.customerPhone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-purple-600" />
                        <span className="text-sm text-muted-foreground">إجمالي العقود:</span>
                        <span className="font-medium">{claim.totalContracts}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">حالة المطالبة</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(claim.status)}
                        <span className="text-sm text-muted-foreground">الحالة:</span>
                        <span className="font-medium">{getStatusLabel(claim.status)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">الأولوية:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(claim.priority)}`}>
                          {getPriorityLabel(claim.priority)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-muted-foreground">تاريخ الإنشاء:</span>
                        <span className="font-medium">{claim.createdAt.toLocaleDateString('ar-SA')}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* المبالغ المالية */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">المبالغ المالية</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">إجمالي المدفوعات</p>
                        <p className="text-xl font-bold text-green-600">
                          {claim.totalPayments.toLocaleString()} ر.ع
                        </p>
                      </div>
                      <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <DollarSign className="h-8 w-8 text-red-600 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">المبلغ المتبقي</p>
                        <p className="text-xl font-bold text-red-600">
                          {claim.pendingAmount.toLocaleString()} ر.ع
                        </p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">إجمالي العقود</p>
                        <p className="text-xl font-bold text-blue-600">
                          {claim.totalContracts}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* التعليقات */}
                {claim.comments && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        التعليقات
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{claim.comments}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'contracts' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">العقود المرتبطة</h3>
                <div className="space-y-3">
                  {contracts.map((contract) => (
                    <Card key={contract.id}>
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">رقم العقد</p>
                            <p className="font-medium">{contract.contractNumber}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">نوع العقد</p>
                            <p className="font-medium">{contract.contractType}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">القيمة الإجمالية</p>
                            <p className="font-medium">{contract.totalValue.toLocaleString()} ر.ع</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">المتبقي</p>
                            <p className="font-medium text-red-600">{contract.pendingAmount.toLocaleString()} ر.ع</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">سجل الدفعات</h3>
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <Card key={payment.id}>
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">المبلغ</p>
                            <p className="font-medium text-green-600">{payment.amount.toLocaleString()} ر.ع</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">نوع الدفع</p>
                            <p className="font-medium">{payment.paymentType}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">التاريخ</p>
                            <p className="font-medium">{payment.paymentDate.toLocaleDateString('ar-SA')}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">المرجع</p>
                            <p className="font-medium">{payment.reference}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reminders' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">سجل التذكيرات</h3>
                <div className="space-y-3">
                  {reminders.map((reminder) => (
                    <Card key={reminder.id}>
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">نوع التذكير</p>
                            <p className="font-medium">{reminder.reminderType}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">تاريخ الإرسال</p>
                            <p className="font-medium">{reminder.sentDate.toLocaleDateString('ar-SA')}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">الحالة</p>
                            <p className="font-medium text-green-600">{reminder.status}</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-sm text-muted-foreground">الرسالة</p>
                          <p className="text-sm">{reminder.message}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">الملاحظات</h3>
                <div className="space-y-3">
                  {notes.map((note) => (
                    <Card key={note.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm text-muted-foreground">بواسطة: {note.createdBy}</p>
                          <p className="text-sm text-muted-foreground">{note.createdAt.toLocaleDateString('ar-SA')}</p>
                        </div>
                        <p className="text-sm">{note.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex justify-end gap-3 p-6 border-t">
            <Button
              variant="outline"
              onClick={onClose}
            >
              إغلاق
            </Button>
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              طباعة
            </Button>
            <Button
              variant="outline"
              onClick={() => console.log('تصدير التفاصيل')}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              تصدير
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
