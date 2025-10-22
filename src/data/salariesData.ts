/**
 * بيانات الرواتب الوهمية
 */

import { SalaryData } from '@/lib/types/employee';

export interface SalaryStats {
  totalSalaries: number;
  totalAmount: number;
  paidSalaries: number;
  pendingSalaries: number;
  overdueSalaries: number;
  averageSalary: number;
}

// إحصائيات الرواتب
export const mockSalaryStats: SalaryStats = {
  totalSalaries: 245,
  totalAmount: 306250,
  paidSalaries: 198,
  pendingSalaries: 35,
  overdueSalaries: 12,
  averageSalary: 1250
};

// بيانات جدول الرواتب
export const mockSalaryTableData: SalaryData[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    employeeName: 'أحمد محمد العلي',
    position: 'مدير المبيعات',
    department: 'المبيعات',
    basicSalary: 1500,
    allowances: 300,
    deductions: 0,
    totalSalary: 1800,
    paymentDate: '2024-01-31',
    status: 'paid',
    paymentMethod: 'bank_transfer'
  },
  {
    id: '2',
    employeeId: 'EMP002',
    employeeName: 'فاطمة سالم الكندي',
    position: 'محاسبة',
    department: 'المالية',
    basicSalary: 1000,
    allowances: 200,
    deductions: 0,
    totalSalary: 1200,
    paymentDate: '2024-01-31',
    status: 'paid',
    paymentMethod: 'bank_transfer'
  },
  {
    id: '3',
    employeeId: 'EMP003',
    employeeName: 'خالد أحمد الشنفري',
    position: 'مطور برمجيات',
    department: 'التقنية',
    basicSalary: 1300,
    allowances: 200,
    deductions: 0,
    totalSalary: 1500,
    paymentDate: '2024-01-31',
    status: 'paid',
    paymentMethod: 'bank_transfer'
  },
  {
    id: '4',
    employeeId: 'EMP004',
    employeeName: 'مريم عبدالرحمن البلوشي',
    position: 'أخصائية موارد بشرية',
    department: 'الموارد البشرية',
    basicSalary: 900,
    allowances: 200,
    deductions: 0,
    totalSalary: 1100,
    paymentDate: '2024-01-31',
    status: 'pending',
    paymentMethod: 'bank_transfer'
  },
  {
    id: '5',
    employeeId: 'EMP005',
    employeeName: 'سعد محمد الغافري',
    position: 'مندوب مبيعات',
    department: 'المبيعات',
    basicSalary: 700,
    allowances: 200,
    deductions: 0,
    totalSalary: 900,
    paymentDate: '2024-01-31',
    status: 'pending',
    paymentMethod: 'bank_transfer'
  },
  {
    id: '6',
    employeeId: 'EMP006',
    employeeName: 'عائشة سالم الحارثي',
    position: 'مساعد إداري',
    department: 'الإدارة',
    basicSalary: 600,
    allowances: 200,
    deductions: 0,
    totalSalary: 800,
    paymentDate: '2024-01-31',
    status: 'overdue',
    paymentMethod: 'cash'
  },
  {
    id: '7',
    employeeId: 'EMP007',
    employeeName: 'عبدالله محمد الراشدي',
    position: 'مهندس شبكات',
    department: 'التقنية',
    basicSalary: 1400,
    allowances: 200,
    deductions: 0,
    totalSalary: 1600,
    paymentDate: '2024-01-31',
    status: 'paid',
    paymentMethod: 'bank_transfer'
  },
  {
    id: '8',
    employeeId: 'EMP008',
    employeeName: 'نورا أحمد السالمي',
    position: 'مديرة الموارد البشرية',
    department: 'الموارد البشرية',
    basicSalary: 1800,
    allowances: 200,
    deductions: 0,
    totalSalary: 2000,
    paymentDate: '2024-01-31',
    status: 'paid',
    paymentMethod: 'bank_transfer'
  }
];
