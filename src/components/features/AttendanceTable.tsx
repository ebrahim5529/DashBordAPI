/**
 * مكون جدول الحضور والانصراف
 */

import React from 'react';
import { AttendanceData } from '@/lib/types/employee';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Download, 
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  UserMinus,
  Clock
} from 'lucide-react';

interface AttendanceTableProps {
  data: AttendanceData[];
  onAddAttendance: () => void;
  onEditAttendance: (attendance: AttendanceData) => void;
  onDeleteAttendance: (attendance: AttendanceData) => void;
  onViewAttendance: (attendance: AttendanceData) => void;
  onExportAttendance: () => void;
  isLoading?: boolean;
}

export function AttendanceTable({
  data,
  onAddAttendance,
  onEditAttendance,
  onDeleteAttendance,
  onViewAttendance,
  onExportAttendance,
  isLoading = false
}: AttendanceTableProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      present: { 
        label: 'حاضر', 
        className: 'bg-green-100 text-green-800',
        icon: CheckCircle
      },
      absent: { 
        label: 'غائب', 
        className: 'bg-red-100 text-red-800',
        icon: XCircle
      },
      late: { 
        label: 'متأخر', 
        className: 'bg-yellow-100 text-yellow-800',
        icon: AlertTriangle
      },
      half_day: { 
        label: 'نصف يوم', 
        className: 'bg-blue-100 text-blue-800',
        icon: Clock
      },
      on_leave: { 
        label: 'في إجازة', 
        className: 'bg-purple-100 text-purple-800',
        icon: UserMinus
      }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.absent;
    const Icon = config.icon;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.className}`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '-';
    return timeString;
  };

  const formatHours = (hours: number) => {
    if (hours === 0) return '-';
    return `${hours} ساعة`;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* شريط الأدوات */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">سجل الحضور والانصراف</h3>
            <span className="bg-[#58d2c8]/10 text-[#58d2c8] px-2 py-1 rounded-full text-sm font-medium">
              {data.length} سجل
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* شريط البحث */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="البحث في سجل الحضور..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent text-sm"
              />
            </div>
            
            {/* فلتر */}
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              فلتر
            </Button>
            
            {/* تصدير */}
            <Button variant="outline" size="sm" onClick={onExportAttendance} className="gap-2">
              <Download className="h-4 w-4" />
              تصدير
            </Button>
            
            {/* إضافة سجل حضور */}
            <Button onClick={onAddAttendance} className="gap-2 bg-[#58d2c8] hover:bg-[#4AB8B3]">
              <Plus className="h-4 w-4" />
              إضافة سجل
            </Button>
          </div>
        </div>
      </div>

      {/* الجدول */}
      <div className="rounded-md border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                الموظف
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                التاريخ
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                وقت الدخول
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                إجمالي الساعات
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                الحالة
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((attendance) => (
              <tr key={attendance.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 rounded-full bg-[#58d2c8]/10 flex items-center justify-center">
                        <span className="text-[#58d2c8] font-medium text-xs">
                          {attendance.employeeName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                    </div>
                    <div className="mr-3">
                      <div className="text-sm font-medium text-gray-900">{attendance.employeeName}</div>
                      <div className="text-xs text-gray-500">{attendance.position} - {attendance.department}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {formatDate(attendance.date)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {formatTime(attendance.checkIn)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {formatHours(attendance.totalHours)}
                </td>
                <td className="px-4 py-3">
                  {getStatusBadge(attendance.status)}
                </td>
                <td className="px-4 py-3 text-sm font-medium">
                  <div className="flex items-center gap-0.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewAttendance(attendance)}
                      className="h-6 w-6 p-0 hover:bg-blue-100"
                      title="عرض التفاصيل"
                    >
                      <Eye className="h-3 w-3 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditAttendance(attendance)}
                      className="h-6 w-6 p-0 hover:bg-green-100"
                      title="تعديل"
                    >
                      <Edit className="h-3 w-3 text-green-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteAttendance(attendance)}
                      className="h-6 w-6 p-0 hover:bg-red-100"
                      title="حذف"
                    >
                      <Trash2 className="h-3 w-3 text-red-600" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* تذييل الجدول */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            عرض {data.length} من {data.length} سجل
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              السابق
            </Button>
            <Button variant="outline" size="sm" disabled>
              التالي
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
