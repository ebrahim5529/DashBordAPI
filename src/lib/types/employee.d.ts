/**
 * أنواع البيانات للموظفين
 */

export interface EmployeeStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  newHiresThisMonth: number;
  averageSalary: number;
  totalSalaryCost: number;
}

export interface EmployeeTableData {
  id: string;
  employeeId: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  hireDate: string;
  status: 'active' | 'inactive' | 'on_leave';
  salary: number;
  manager: string;
  location: string;
}

export interface EmployeeDetails {
  id: string;
  employeeId: string;
  personalInfo: {
    name: string;
    arabicName: string;
    email: string;
    phone: string;
    mobile: string;
    address: string;
    city: string;
    nationality: string;
    dateOfBirth: string;
    gender: 'male' | 'female';
    maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
    idNumber: string;
    passportNumber: string;
  };
  workInfo: {
    position: string;
    department: string;
    manager: string;
    location: string;
    hireDate: string;
    contractType: 'full_time' | 'part_time' | 'contract' | 'intern';
    workSchedule: string;
    status: 'active' | 'inactive' | 'on_leave';
  };
  salaryInfo: {
    basicSalary: number;
    allowances: number;
    totalSalary: number;
    currency: string;
    paymentMethod: 'bank_transfer' | 'cash' | 'check';
    bankAccount: string;
  };
  documents: {
    id: string;
    name: string;
    type: string;
    uploadDate: string;
    status: 'valid' | 'expired' | 'pending';
  }[];
}

export interface SalaryData {
  id: string;
  employeeId: string;
  employeeName: string;
  position: string;
  department: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  totalSalary: number;
  paymentDate: string;
  status: 'paid' | 'pending' | 'overdue';
  paymentMethod: 'bank_transfer' | 'cash' | 'check';
}

export interface IncentiveData {
  id: string;
  employeeId: string;
  employeeName: string;
  position: string;
  department: string;
  incentiveType: 'performance' | 'bonus' | 'overtime' | 'commission' | 'other';
  amount: number;
  reason: string;
  date: string;
  status: 'approved' | 'pending' | 'rejected';
  approvedBy: string;
}

export interface AttendanceData {
  id: string;
  employeeId: string;
  employeeName: string;
  position: string;
  department: string;
  date: string;
  checkIn: string;
  checkOut: string;
  totalHours: number;
  overtime: number;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave';
  notes: string;
}
