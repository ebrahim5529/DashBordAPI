/**
 * صفحة الحضور والانصراف
 */

import React, { useState } from 'react';
import { AttendanceStats } from '@/components/features/AttendanceStats';
import { AttendanceTable } from '@/components/features/AttendanceTable';
import AttendanceForm from '@/components/features/AttendanceForm';
import AttendanceDetails from '@/components/features/AttendanceDetails';
import { mockAttendanceStats, mockAttendanceTableData } from '@/data/attendanceData';
import { AttendanceData } from '@/lib/types/employee';
import { AttendanceDetailsData } from '@/components/features/AttendanceDetails';
import { Clock, TrendingUp } from 'lucide-react';

type ViewMode = 'list' | 'form' | 'details';

export default function AttendancePage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedAttendance, setSelectedAttendance] = useState<AttendanceData | null>(null);
  const [selectedAttendanceDetails, setSelectedAttendanceDetails] = useState<AttendanceDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // معالجة إضافة سجل حضور جديد
  const handleAddAttendance = () => {
    setSelectedAttendance(null);
    setViewMode('form');
  };

  // معالجة تعديل سجل حضور
  const handleEditAttendance = (attendance: AttendanceData) => {
    setSelectedAttendance(attendance);
    setViewMode('form');
  };

  // معالجة حذف سجل حضور
  const handleDeleteAttendance = async (attendance: AttendanceData) => {
    if (window.confirm(`هل أنت متأكد من حذف سجل الحضور "${attendance.employeeName}"؟`)) {
      setIsLoading(true);
      try {
        // هنا سيتم استدعاء API لحذف سجل الحضور
        console.log('حذف سجل الحضور:', attendance.id);
        setTimeout(() => {
          setIsLoading(false);
          alert('تم حذف سجل الحضور بنجاح');
        }, 1000);
      } catch (error) {
        console.error('خطأ في حذف سجل الحضور:', error);
        setIsLoading(false);
        alert('حدث خطأ في حذف سجل الحضور');
      }
    }
  };

  // معالجة عرض تفاصيل سجل الحضور
  const handleViewAttendance = (attendance: AttendanceData) => {
    // تحويل البيانات إلى تنسيق AttendanceDetailsData
    const attendanceDetails: AttendanceDetailsData = {
      id: attendance.id,
      employeeId: attendance.employeeId,
      employeeName: attendance.employeeName,
      department: attendance.department,
      position: attendance.position,
      date: attendance.date,
      checkInTime: attendance.checkIn,
      checkOutTime: attendance.checkOut,
      totalHours: attendance.totalHours,
      status: attendance.status as 'present' | 'late' | 'absent' | 'half_day',
      notes: attendance.notes,
      location: '',
      overtimeHours: attendance.overtime,
      breakDuration: 0,
      tasks: [],
      supervisor: '',
      approvalStatus: undefined,
    };
    setSelectedAttendanceDetails(attendanceDetails);
    setViewMode('details');
  };

  // معالجة إغلاق تفاصيل الحضور
  const handleCloseDetails = () => {
    setSelectedAttendanceDetails(null);
    setViewMode('list');
  };

  // معالجة تعديل تفاصيل الحضور
  const handleEditAttendanceDetails = (attendance: AttendanceDetailsData) => {
    // تحويل البيانات إلى تنسيق AttendanceData
    const attendanceData: AttendanceData = {
      id: attendance.id,
      employeeId: attendance.employeeId,
      employeeName: attendance.employeeName,
      department: attendance.department,
      position: attendance.position,
      date: attendance.date,
      checkIn: attendance.checkInTime,
      checkOut: attendance.checkOutTime || '',
      totalHours: attendance.totalHours || 0,
      overtime: attendance.overtimeHours || 0,
      status: attendance.status,
      notes: attendance.notes || '',
    };
    setSelectedAttendance(attendanceData);
    setViewMode('form');
  };

  // معالجة تصدير تفاصيل الحضور
  const handleExportAttendanceDetails = (attendance: AttendanceDetailsData) => {
    console.log('تصدير تفاصيل الحضور:', attendance.id);
    alert('تم تصدير تفاصيل الحضور بنجاح');
  };

  // معالجة حفظ سجل الحضور
  const handleSaveAttendance = async (attendance: AttendanceData) => {
    setIsLoading(true);
    try {
      // هنا سيتم استدعاء API لحفظ سجل الحضور
      console.log('حفظ سجل الحضور:', attendance);
      setTimeout(() => {
        setIsLoading(false);
        setViewMode('list');
        alert('تم حفظ سجل الحضور بنجاح');
      }, 1000);
    } catch (error) {
      console.error('خطأ في حفظ سجل الحضور:', error);
      setIsLoading(false);
      alert('حدث خطأ في حفظ سجل الحضور');
    }
  };

  // معالجة إغلاق النموذج
  const handleCloseForm = () => {
    setViewMode('list');
    setSelectedAttendance(null);
  };

  // معالجة تصدير سجل الحضور
  const handleExportAttendance = () => {
    console.log('تصدير سجل الحضور');
    alert('تم تصدير سجل الحضور بنجاح');
  };

  // عرض نموذج سجل الحضور
  if (viewMode === 'form') {
    return (
      <AttendanceForm
        attendance={selectedAttendance}
        onSave={handleSaveAttendance}
        onCancel={handleCloseForm}
        isLoading={isLoading}
      />
    );
  }

  // عرض تفاصيل الحضور
  if (viewMode === 'details' && selectedAttendanceDetails) {
    return (
      <AttendanceDetails
        attendance={selectedAttendanceDetails}
        onClose={handleCloseDetails}
        onEdit={handleEditAttendanceDetails}
        onExport={handleExportAttendanceDetails}
      />
    );
  }

  return (
    <div className='space-y-6'>
      {/* إحصائيات الحضور */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <h2 className="text-xl font-semibold">إحصائيات الحضور</h2>
        </div>
        <AttendanceStats stats={mockAttendanceStats} />
      </div>

      {/* جدول/قائمة الحضور */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <h2 className="text-xl font-semibold">الحضور والانصراف</h2>
        </div>
        <AttendanceTable
          data={mockAttendanceTableData || []}
          onAddAttendance={handleAddAttendance}
          onEditAttendance={handleEditAttendance}
          onDeleteAttendance={handleDeleteAttendance}
          onViewAttendance={handleViewAttendance}
          onExportAttendance={handleExportAttendance}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}