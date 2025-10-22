/**
 * مكون تفاصيل سجل الحضور
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Clock, 
  User, 
  Calendar, 
  MapPin, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  FileText,
  Download,
  Edit
} from 'lucide-react';

export interface AttendanceDetailsData {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  totalHours?: number;
  status: 'present' | 'late' | 'absent' | 'half_day';
  notes?: string;
  location?: string;
  overtimeHours?: number;
  breakDuration?: number;
  tasks?: string[];
  supervisor?: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
}

interface AttendanceDetailsProps {
  attendance: AttendanceDetailsData;
  onClose: () => void;
  onEdit?: (attendance: AttendanceDetailsData) => void;
  onExport?: (attendance: AttendanceDetailsData) => void;
}

const AttendanceDetails: React.FC<AttendanceDetailsProps> = ({
  attendance,
  onClose,
  onEdit,
  onExport,
}) => {
  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-800">حاضر</Badge>;
      case 'late':
        return <Badge className="bg-yellow-100 text-yellow-800">متأخر</Badge>;
      case 'absent':
        return <Badge className="bg-red-100 text-red-800">غائب</Badge>;
      case 'half_day':
        return <Badge className="bg-blue-100 text-blue-800">نصف يوم</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">غير محدد</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'late':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'absent':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'half_day':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getApprovalBadge = (status?: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">معتمد</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">مرفوض</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">في الانتظار</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              تفاصيل سجل الحضور
            </CardTitle>
            <div className="flex items-center gap-2">
              {onExport && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onExport(attendance)}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  تصدير
                </Button>
              )}
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(attendance)}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  تعديل
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
              >
                إغلاق
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              {getStatusIcon(attendance.status)}
              {getStatusBadge(attendance.status)}
            </div>
            {attendance.approvalStatus && getApprovalBadge(attendance.approvalStatus)}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* معلومات الموظف */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-4 w-4" />
                  معلومات الموظف
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-600">رقم الموظف</Label>
                  <span className="font-semibold">{attendance.employeeId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-600">الاسم</Label>
                  <span className="font-semibold">{attendance.employeeName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-600">القسم</Label>
                  <span className="font-medium">{attendance.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-600">المنصب</Label>
                  <span className="font-medium">{attendance.position}</span>
                </div>
                {attendance.supervisor && (
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-gray-600">المشرف</Label>
                    <span className="font-medium">{attendance.supervisor}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  تفاصيل الحضور
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-600">التاريخ</Label>
                  <span className="font-semibold">{formatDate(attendance.date)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-600">وقت الدخول</Label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span className="font-semibold">{formatTime(attendance.checkInTime)}</span>
                  </div>
                </div>
                {attendance.checkOutTime && (
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-gray-600">وقت الخروج</Label>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-red-500" />
                      <span className="font-semibold">{formatTime(attendance.checkOutTime)}</span>
                    </div>
                  </div>
                )}
                {attendance.totalHours && (
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-gray-600">إجمالي الساعات</Label>
                    <span className="font-semibold text-primary">{attendance.totalHours} ساعة</span>
                  </div>
                )}
                {attendance.overtimeHours && (
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-gray-600">ساعات إضافية</Label>
                    <span className="font-semibold text-orange-600">{attendance.overtimeHours} ساعة</span>
                  </div>
                )}
                {attendance.breakDuration && (
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-gray-600">مدة الاستراحة</Label>
                    <span className="font-semibold">{attendance.breakDuration} دقيقة</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* معلومات إضافية */}
          {(attendance.location || attendance.notes) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  معلومات إضافية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {attendance.location && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                    <div>
                      <Label className="text-sm text-gray-600">الموقع</Label>
                      <p className="font-medium">{attendance.location}</p>
                    </div>
                  </div>
                )}
                {attendance.notes && (
                  <div>
                    <Label className="text-sm text-gray-600">ملاحظات</Label>
                    <p className="mt-1 p-3 bg-gray-50 rounded-lg">{attendance.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* المهام المكلف بها */}
          {attendance.tasks && attendance.tasks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  المهام المكلف بها
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {attendance.tasks.map((task, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">{task}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ملخص الإحصائيات */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">ملخص اليوم</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {attendance.totalHours || 0}
                  </div>
                  <div className="text-sm text-gray-600">ساعات العمل</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {attendance.status === 'present' ? '100%' : 
                     attendance.status === 'late' ? '90%' : 
                     attendance.status === 'half_day' ? '50%' : '0%'}
                  </div>
                  <div className="text-sm text-gray-600">نسبة الحضور</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {attendance.overtimeHours || 0}
                  </div>
                  <div className="text-sm text-gray-600">ساعات إضافية</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceDetails;
