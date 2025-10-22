/**
 * بيانات الحضور والانصراف الوهمية
 */

import { AttendanceData } from '@/lib/types/employee';

export interface AttendanceStats {
  totalAttendance: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  halfDays: number;
  onLeaveDays: number;
  averageHours: number;
}

// إحصائيات الحضور
export const mockAttendanceStats: AttendanceStats = {
  totalAttendance: 245,
  presentDays: 198,
  absentDays: 12,
  lateDays: 25,
  halfDays: 8,
  onLeaveDays: 2,
  averageHours: 8.2
};

// بيانات جدول الحضور
export const mockAttendanceTableData: AttendanceData[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    employeeName: 'أحمد محمد العلي',
    position: 'مدير المبيعات',
    department: 'المبيعات',
    date: '2024-01-15',
    checkIn: '08:00',
    checkOut: '17:00',
    totalHours: 9,
    overtime: 1,
    status: 'present',
    notes: ''
  },
  {
    id: '2',
    employeeId: 'EMP002',
    employeeName: 'فاطمة سالم الكندي',
    position: 'محاسبة',
    department: 'المالية',
    date: '2024-01-15',
    checkIn: '08:15',
    checkOut: '16:45',
    totalHours: 8.5,
    overtime: 0.5,
    status: 'late',
    notes: 'تأخر 15 دقيقة'
  },
  {
    id: '3',
    employeeId: 'EMP003',
    employeeName: 'خالد أحمد الشنفري',
    position: 'مطور برمجيات',
    department: 'التقنية',
    date: '2024-01-15',
    checkIn: '09:00',
    checkOut: '18:00',
    totalHours: 9,
    overtime: 1,
    status: 'late',
    notes: 'تأخر ساعة'
  },
  {
    id: '4',
    employeeId: 'EMP004',
    employeeName: 'مريم عبدالرحمن البلوشي',
    position: 'أخصائية موارد بشرية',
    department: 'الموارد البشرية',
    date: '2024-01-15',
    checkIn: '08:00',
    checkOut: '12:00',
    totalHours: 4,
    overtime: 0,
    status: 'half_day',
    notes: 'نصف يوم - موعد طبي'
  },
  {
    id: '5',
    employeeId: 'EMP005',
    employeeName: 'سعد محمد الغافري',
    position: 'مندوب مبيعات',
    department: 'المبيعات',
    date: '2024-01-15',
    checkIn: '08:00',
    checkOut: '17:00',
    totalHours: 9,
    overtime: 1,
    status: 'present',
    notes: ''
  },
  {
    id: '6',
    employeeId: 'EMP006',
    employeeName: 'عائشة سالم الحارثي',
    position: 'مساعد إداري',
    department: 'الإدارة',
    date: '2024-01-15',
    checkIn: '',
    checkOut: '',
    totalHours: 0,
    overtime: 0,
    status: 'on_leave',
    notes: 'إجازة مرضية'
  },
  {
    id: '7',
    employeeId: 'EMP007',
    employeeName: 'عبدالله محمد الراشدي',
    position: 'مهندس شبكات',
    department: 'التقنية',
    date: '2024-01-15',
    checkIn: '08:00',
    checkOut: '17:30',
    totalHours: 9.5,
    overtime: 1.5,
    status: 'present',
    notes: ''
  },
  {
    id: '8',
    employeeId: 'EMP008',
    employeeName: 'نورا أحمد السالمي',
    position: 'مديرة الموارد البشرية',
    department: 'الموارد البشرية',
    date: '2024-01-15',
    checkIn: '',
    checkOut: '',
    totalHours: 0,
    overtime: 0,
    status: 'absent',
    notes: 'غياب بدون عذر'
  }
];
