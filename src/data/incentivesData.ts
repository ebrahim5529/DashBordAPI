/**
 * بيانات الحوافز الوهمية
 */

import { IncentiveData } from '@/lib/types/employee';

export interface IncentiveStats {
  totalIncentives: number;
  totalAmount: number;
  approvedIncentives: number;
  pendingIncentives: number;
  rejectedIncentives: number;
  averageIncentive: number;
}

// إحصائيات الحوافز
export const mockIncentiveStats: IncentiveStats = {
  totalIncentives: 45,
  totalAmount: 12500,
  approvedIncentives: 32,
  pendingIncentives: 8,
  rejectedIncentives: 5,
  averageIncentive: 278
};

// بيانات جدول الحوافز
export const mockIncentiveTableData: IncentiveData[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    employeeName: 'أحمد محمد العلي',
    position: 'مدير المبيعات',
    department: 'المبيعات',
    incentiveType: 'performance',
    amount: 500,
    reason: 'تحقيق أهداف المبيعات الشهرية',
    date: '2024-01-15',
    status: 'approved',
    approvedBy: 'سارة أحمد'
  },
  {
    id: '2',
    employeeId: 'EMP002',
    employeeName: 'فاطمة سالم الكندي',
    position: 'محاسبة',
    department: 'المالية',
    incentiveType: 'bonus',
    amount: 300,
    reason: 'مكافأة نهاية العام',
    date: '2024-01-10',
    status: 'approved',
    approvedBy: 'محمد عبدالله'
  },
  {
    id: '3',
    employeeId: 'EMP003',
    employeeName: 'خالد أحمد الشنفري',
    position: 'مطور برمجيات',
    department: 'التقنية',
    incentiveType: 'overtime',
    amount: 200,
    reason: 'ساعات إضافية لإنجاز المشروع',
    date: '2024-01-20',
    status: 'pending',
    approvedBy: 'علي محمد'
  },
  {
    id: '4',
    employeeId: 'EMP004',
    employeeName: 'مريم عبدالرحمن البلوشي',
    position: 'أخصائية موارد بشرية',
    department: 'الموارد البشرية',
    incentiveType: 'performance',
    amount: 250,
    reason: 'أداء متميز في إدارة الموارد البشرية',
    date: '2024-01-18',
    status: 'approved',
    approvedBy: 'نورا السالمي'
  },
  {
    id: '5',
    employeeId: 'EMP005',
    employeeName: 'سعد محمد الغافري',
    position: 'مندوب مبيعات',
    department: 'المبيعات',
    incentiveType: 'commission',
    amount: 400,
    reason: 'عمولة مبيعات إضافية',
    date: '2024-01-12',
    status: 'approved',
    approvedBy: 'أحمد محمد العلي'
  },
  {
    id: '6',
    employeeId: 'EMP006',
    employeeName: 'عائشة سالم الحارثي',
    position: 'مساعد إداري',
    department: 'الإدارة',
    incentiveType: 'bonus',
    amount: 150,
    reason: 'مكافأة على العمل الإضافي',
    date: '2024-01-08',
    status: 'rejected',
    approvedBy: 'خالد أحمد'
  },
  {
    id: '7',
    employeeId: 'EMP007',
    employeeName: 'عبدالله محمد الراشدي',
    position: 'مهندس شبكات',
    department: 'التقنية',
    incentiveType: 'performance',
    amount: 350,
    reason: 'تحسين أداء الشبكة',
    date: '2024-01-22',
    status: 'pending',
    approvedBy: 'علي محمد'
  },
  {
    id: '8',
    employeeId: 'EMP008',
    employeeName: 'نورا أحمد السالمي',
    position: 'مديرة الموارد البشرية',
    department: 'الموارد البشرية',
    incentiveType: 'bonus',
    amount: 600,
    reason: 'مكافأة قيادية',
    date: '2024-01-05',
    status: 'approved',
    approvedBy: 'سارة أحمد'
  }
];
