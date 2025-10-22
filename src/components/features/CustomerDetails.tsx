/**
 * صفحة تفاصيل العميل
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { CustomerDetails as CustomerDetailsType } from '@/lib/types/customer';
import {
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star,
  AlertTriangle,
  FileText,
  DollarSign,
  TrendingUp,
  Download,
  Printer,
  Edit,
  ArrowLeft,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
} from 'lucide-react';

interface CustomerDetailsProps {
  customer: CustomerDetailsType;
  onEdit: () => void;
  onBack: () => void;
  onPrint: () => void;
  onExport: () => void;
}

export default function CustomerDetails({
  customer,
  onEdit,
  onBack,
  onPrint,
  onExport,
}: CustomerDetailsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'contracts' | 'payments' | 'notes'>('overview');

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'OMR',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'INACTIVE':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="h-4 w-4" />;
      case 'INACTIVE':
        return <XCircle className="h-4 w-4" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />;
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {customer.customerType === 'COMPANY' ? (
                <Building2 className="h-6 w-6" />
              ) : (
                <User className="h-6 w-6" />
              )}
              {customer.name}
            </h1>
            <p className="text-muted-foreground">
              رقم العميل: {customer.customerNumber}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onPrint}>
            <Printer className="h-4 w-4" />
            طباعة
          </Button>
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4" />
            تصدير
          </Button>
          <Button onClick={onEdit}>
            <Edit className="h-4 w-4" />
            تعديل
          </Button>
        </div>
      </div>

      {/* Status and Rating */}
      <div className="flex items-center gap-4">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(
            customer.status
          )}`}
        >
          {getStatusIcon(customer.status)}
          {customer.status === 'ACTIVE' ? 'نشط' : 'غير نشط'}
        </span>
        {customer.rating && (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{customer.rating}/5</span>
          </div>
        )}
        {customer.warnings && (
          <div className="flex items-center gap-1 text-red-600">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">تحذيرات</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'نظرة عامة', icon: Eye },
            { id: 'contracts', label: 'العقود', icon: FileText },
            { id: 'payments', label: 'المدفوعات', icon: DollarSign },
            { id: 'notes', label: 'الملاحظات', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  المعلومات الأساسية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">الاسم الكامل</label>
                    <p className="text-sm">{customer.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">نوع العميل</label>
                    <p className="text-sm">
                      {customer.customerType === 'COMPANY' ? 'شركة' : 'فرد'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">رقم الهوية/السجل</label>
                    <p className="text-sm font-mono">
                      {customer.idNumber || customer.commercialRecord || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">الجنسية</label>
                    <p className="text-sm">{customer.nationality || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">رقم الهاتف</label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <p className="text-sm">{customer.phone || '-'}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">البريد الإلكتروني</label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <p className="text-sm">{customer.email || '-'}</p>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">العنوان</label>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      <p className="text-sm">{customer.address || '-'}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">تاريخ التسجيل</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <p className="text-sm">{formatDate(customer.registrationDate)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guarantor Information */}
            {(customer.guarantorName || customer.guarantorPhone || customer.guarantorId) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    معلومات الضامن
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">اسم الضامن</label>
                      <p className="text-sm">{customer.guarantorName || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">هاتف الضامن</label>
                      <p className="text-sm">{customer.guarantorPhone || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">رقم هوية الضامن</label>
                      <p className="text-sm font-mono">{customer.guarantorId || '-'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notes and Warnings */}
            {(customer.notes || customer.warnings) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    الملاحظات والتحذيرات
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {customer.notes && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">ملاحظات عامة</label>
                      <p className="text-sm mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        {customer.notes}
                      </p>
                    </div>
                  )}
                  {customer.warnings && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        تحذيرات خاصة
                      </label>
                      <p className="text-sm mt-1 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
                        {customer.warnings}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Summary Cards */}
          <div className="space-y-6">
            {/* Contracts Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  ملخص العقود
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">إجمالي العقود</span>
                  <span className="font-medium">{customer.contractsSummary.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">عقود نشطة</span>
                  <span className="font-medium text-green-600">{customer.contractsSummary.active}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">عقود مكتملة</span>
                  <span className="font-medium text-blue-600">{customer.contractsSummary.completed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">عقود ملغاة</span>
                  <span className="font-medium text-red-600">{customer.contractsSummary.cancelled}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">إجمالي القيمة</span>
                    <span className="font-bold text-primary">
                      {formatCurrency(customer.contractsSummary.totalValue)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payments Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  ملخص المدفوعات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">إجمالي المدفوعات</span>
                  <span className="font-medium">{customer.paymentsSummary.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">مدفوعات مكتملة</span>
                  <span className="font-medium text-green-600">{customer.paymentsSummary.paid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">مدفوعات معلقة</span>
                  <span className="font-medium text-yellow-600">{customer.paymentsSummary.pending}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">مدفوعات متأخرة</span>
                  <span className="font-medium text-red-600">{customer.paymentsSummary.overdue}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">إجمالي المبلغ</span>
                    <span className="font-bold text-primary">
                      {formatCurrency(customer.paymentsSummary.totalAmount)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  النشاط الأخير
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {customer.recentActivity.slice(0, 5).map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        {activity.description && (
                          <p className="text-xs text-muted-foreground">{activity.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {formatDate(activity.createdAt)} - {activity.user.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'contracts' && (
        <Card>
          <CardHeader>
            <CardTitle>عقود العميل</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">سيتم عرض عقود العميل هنا</p>
          </CardContent>
        </Card>
      )}

      {activeTab === 'payments' && (
        <Card>
          <CardHeader>
            <CardTitle>مدفوعات العميل</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">سيتم عرض مدفوعات العميل هنا</p>
          </CardContent>
        </Card>
      )}

      {activeTab === 'notes' && (
        <Card>
          <CardHeader>
            <CardTitle>ملاحظات العميل</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">سيتم عرض ملاحظات العميل هنا</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
