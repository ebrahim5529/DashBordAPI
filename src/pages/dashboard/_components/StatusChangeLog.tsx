/**
 * مكون سجل تغييرات حالة العملاء
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  History,
  Search,
  Download,
  User,
  Clock,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Calendar,
  UserCheck,
  UserX
} from 'lucide-react';

export interface StatusChangeLogEntry {
  id: string;
  customerId: string;
  customerName: string;
  previousStatus: 'active' | 'inactive' | 'pending' | 'suspended';
  newStatus: 'active' | 'inactive' | 'pending' | 'suspended';
  changeReason: 'contract_added' | 'contract_ended' | 'manual_update' | 'system_update' | 'payment_issue' | 'other';
  changedBy: string;
  changedAt: string;
  notes?: string;
  contractId?: string;
  contractNumber?: string;
}

interface StatusChangeLogProps {
  logs?: StatusChangeLogEntry[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onExport?: () => void;
}

// بيانات تجريبية
const mockLogs: StatusChangeLogEntry[] = [
  {
    id: '1',
    customerId: 'CUST-001',
    customerName: 'أحمد محمد علي',
    previousStatus: 'inactive',
    newStatus: 'active',
    changeReason: 'contract_added',
    changedBy: 'نظام تلقائي',
    changedAt: '2024-01-15T10:30:00Z',
    notes: 'تم إضافة عقد جديد',
    contractId: 'CONT-001',
    contractNumber: 'CON-2024-001'
  },
  {
    id: '2',
    customerId: 'CUST-002',
    customerName: 'فاطمة أحمد السعيد',
    previousStatus: 'active',
    newStatus: 'inactive',
    changeReason: 'contract_ended',
    changedBy: 'نظام تلقائي',
    changedAt: '2024-01-14T15:45:00Z',
    notes: 'انتهت مدة جميع العقود',
    contractId: 'CONT-002',
    contractNumber: 'CON-2023-045'
  },
  {
    id: '3',
    customerId: 'CUST-003',
    customerName: 'محمد خالد الحربي',
    previousStatus: 'active',
    newStatus: 'suspended',
    changeReason: 'payment_issue',
    changedBy: 'سارة عبدالله',
    changedAt: '2024-01-13T09:15:00Z',
    notes: 'تأخر في السداد لأكثر من 30 يوم'
  },
  {
    id: '4',
    customerId: 'CUST-004',
    customerName: 'سارة عبدالله النجار',
    previousStatus: 'suspended',
    newStatus: 'active',
    changeReason: 'manual_update',
    changedBy: 'أحمد المطيري',
    changedAt: '2024-01-12T14:20:00Z',
    notes: 'تم تسوية المدفوعات المتأخرة'
  },
  {
    id: '5',
    customerId: 'CUST-005',
    customerName: 'خالد أحمد المطيري',
    previousStatus: 'pending',
    newStatus: 'active',
    changeReason: 'contract_added',
    changedBy: 'نظام تلقائي',
    changedAt: '2024-01-11T11:00:00Z',
    notes: 'تم تفعيل العميل بعد إضافة العقد',
    contractId: 'CONT-003',
    contractNumber: 'CON-2024-002'
  }
];

const StatusChangeLog: React.FC<StatusChangeLogProps> = ({
  logs = mockLogs,
  isLoading = false,
  onRefresh,
  onExport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [reasonFilter, setReasonFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">نشط</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">غير نشط</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">في الانتظار</Badge>;
      case 'suspended':
        return <Badge className="bg-orange-100 text-orange-800">معلق</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <UserCheck className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <UserX className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'suspended':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getReasonLabel = (reason: string) => {
    switch (reason) {
      case 'contract_added':
        return 'إضافة عقد';
      case 'contract_ended':
        return 'انتهاء عقد';
      case 'manual_update':
        return 'تحديث يدوي';
      case 'system_update':
        return 'تحديث تلقائي';
      case 'payment_issue':
        return 'مشكلة في الدفع';
      case 'other':
        return 'أخرى';
      default:
        return reason;
    }
  };

  const getReasonIcon = (reason: string) => {
    switch (reason) {
      case 'contract_added':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'contract_ended':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'manual_update':
        return <User className="h-4 w-4 text-blue-500" />;
      case 'system_update':
        return <RefreshCw className="h-4 w-4 text-purple-500" />;
      case 'payment_issue':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  // فلترة السجلات
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.changedBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         log.newStatus === statusFilter ||
                         log.previousStatus === statusFilter;
    
    const matchesReason = reasonFilter === 'all' || log.changeReason === reasonFilter;
    
    const matchesDate = dateFilter === 'all' || (() => {
      const logDate = new Date(log.changedAt);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (dateFilter) {
        case 'today':
          return daysDiff === 0;
        case 'week':
          return daysDiff <= 7;
        case 'month':
          return daysDiff <= 30;
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesStatus && matchesReason && matchesDate;
  });

  return (
    <div className="space-y-6">
      {/* أزرار التحكم */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5" />
          <h2 className="text-xl font-semibold">سجل تغييرات الحالة</h2>
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              تحديث
            </Button>
          )}
          {onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              تصدير
            </Button>
          )}
        </div>
      </div>

      {/* فلاتر البحث */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">البحث</label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="اسم العميل أو رقم العميل..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">الحالة</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="inactive">غير نشط</SelectItem>
                  <SelectItem value="pending">في الانتظار</SelectItem>
                  <SelectItem value="suspended">معلق</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">سبب التغيير</label>
              <Select value={reasonFilter} onValueChange={setReasonFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأسباب</SelectItem>
                  <SelectItem value="contract_added">إضافة عقد</SelectItem>
                  <SelectItem value="contract_ended">انتهاء عقد</SelectItem>
                  <SelectItem value="manual_update">تحديث يدوي</SelectItem>
                  <SelectItem value="system_update">تحديث تلقائي</SelectItem>
                  <SelectItem value="payment_issue">مشكلة في الدفع</SelectItem>
                  <SelectItem value="other">أخرى</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">الفترة الزمنية</label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الفترات</SelectItem>
                  <SelectItem value="today">اليوم</SelectItem>
                  <SelectItem value="week">آخر أسبوع</SelectItem>
                  <SelectItem value="month">آخر شهر</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* قائمة السجلات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            سجل التغييرات ({filteredLogs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-primary" />
              <span className="mr-2">جاري تحميل السجلات...</span>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>لا توجد سجلات تغيير متاحة</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLogs.map((log) => (
                <div key={log.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(log.previousStatus)}
                          {getStatusBadge(log.previousStatus)}
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                        <div className="flex items-center gap-2">
                          {getStatusIcon(log.newStatus)}
                          {getStatusBadge(log.newStatus)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-sm font-medium text-gray-600">العميل</p>
                          <p className="font-semibold">{log.customerName}</p>
                          <p className="text-xs text-gray-500">{log.customerId}</p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-600">سبب التغيير</p>
                          <div className="flex items-center gap-2">
                            {getReasonIcon(log.changeReason)}
                            <span className="text-sm">{getReasonLabel(log.changeReason)}</span>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-600">تم التغيير بواسطة</p>
                          <p className="text-sm">{log.changedBy}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {formatDate(log.changedAt)}
                          </div>
                        </div>
                      </div>

                      {log.notes && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-600">ملاحظات</p>
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{log.notes}</p>
                        </div>
                      )}

                      {log.contractNumber && (
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <span className="font-medium">العقد:</span>
                          <span>{log.contractNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">تفعيلات اليوم</p>
                <p className="text-lg font-bold text-green-600">
                  {filteredLogs.filter(log => 
                    log.newStatus === 'active' && 
                    new Date(log.changedAt).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">تعطيلات اليوم</p>
                <p className="text-lg font-bold text-red-600">
                  {filteredLogs.filter(log => 
                    log.newStatus === 'inactive' && 
                    new Date(log.changedAt).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">تحديثات يدوية</p>
                <p className="text-lg font-bold text-blue-600">
                  {filteredLogs.filter(log => log.changeReason === 'manual_update').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">تحديثات تلقائية</p>
                <p className="text-lg font-bold text-purple-600">
                  {filteredLogs.filter(log => log.changeReason === 'system_update').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { StatusChangeLog };
