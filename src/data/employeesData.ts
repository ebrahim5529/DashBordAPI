/**
 * بيانات الموظفين الوهمية
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

// إحصائيات الموظفين
export const mockEmployeeStats: EmployeeStats = {
  totalEmployees: 245,
  activeEmployees: 198,
  inactiveEmployees: 47,
  newHiresThisMonth: 12,
  averageSalary: 1250,
  totalSalaryCost: 306250
};

// بيانات جدول الموظفين
export const mockEmployeeTableData: EmployeeTableData[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    name: 'أحمد محمد العلي',
    position: 'مدير المبيعات',
    department: 'المبيعات',
    email: 'ahmed.ali@company.com',
    phone: '+968 9123 4567',
    hireDate: '2022-01-15',
    status: 'active',
    salary: 1800,
    manager: 'سارة أحمد',
    location: 'مسقط'
  },
  {
    id: '2',
    employeeId: 'EMP002',
    name: 'فاطمة سالم الكندي',
    position: 'محاسبة',
    department: 'المالية',
    email: 'fatima.kindi@company.com',
    phone: '+968 9234 5678',
    hireDate: '2021-08-20',
    status: 'active',
    salary: 1200,
    manager: 'محمد عبدالله',
    location: 'مسقط'
  },
  {
    id: '3',
    employeeId: 'EMP003',
    name: 'خالد أحمد الشنفري',
    position: 'مطور برمجيات',
    department: 'التقنية',
    email: 'khalid.shanfari@company.com',
    phone: '+968 9345 6789',
    hireDate: '2023-03-10',
    status: 'active',
    salary: 1500,
    manager: 'علي محمد',
    location: 'صلالة'
  },
  {
    id: '4',
    employeeId: 'EMP004',
    name: 'مريم عبدالرحمن البلوشي',
    position: 'أخصائية موارد بشرية',
    department: 'الموارد البشرية',
    email: 'mariam.balushi@company.com',
    phone: '+968 9456 7890',
    hireDate: '2022-11-05',
    status: 'active',
    salary: 1100,
    manager: 'نورا السالمي',
    location: 'مسقط'
  },
  {
    id: '5',
    employeeId: 'EMP005',
    name: 'سعد محمد الغافري',
    position: 'مندوب مبيعات',
    department: 'المبيعات',
    email: 'saad.ghafri@company.com',
    phone: '+968 9567 8901',
    hireDate: '2023-01-20',
    status: 'active',
    salary: 900,
    manager: 'أحمد محمد العلي',
    location: 'نزوى'
  },
  {
    id: '6',
    employeeId: 'EMP006',
    name: 'عائشة سالم الحارثي',
    position: 'مساعد إداري',
    department: 'الإدارة',
    email: 'aisha.harthi@company.com',
    phone: '+968 9678 9012',
    hireDate: '2021-12-01',
    status: 'on_leave',
    salary: 800,
    manager: 'خالد أحمد',
    location: 'مسقط'
  },
  {
    id: '7',
    employeeId: 'EMP007',
    name: 'عبدالله محمد الراشدي',
    position: 'مهندس شبكات',
    department: 'التقنية',
    email: 'abdullah.rashdi@company.com',
    phone: '+968 9789 0123',
    hireDate: '2022-06-15',
    status: 'active',
    salary: 1600,
    manager: 'علي محمد',
    location: 'مسقط'
  },
  {
    id: '8',
    employeeId: 'EMP008',
    name: 'نورا أحمد السالمي',
    position: 'مديرة الموارد البشرية',
    department: 'الموارد البشرية',
    email: 'nora.salmi@company.com',
    phone: '+968 9890 1234',
    hireDate: '2020-09-10',
    status: 'active',
    salary: 2000,
    manager: 'سارة أحمد',
    location: 'مسقط'
  }
];

// تفاصيل الموظف
export const mockEmployeeDetails: EmployeeDetails = {
  id: '1',
  employeeId: 'EMP001',
  personalInfo: {
    name: 'أحمد محمد العلي',
    arabicName: 'أحمد محمد العلي',
    email: 'ahmed.ali@company.com',
    phone: '+968 9123 4567',
    mobile: '+968 9123 4567',
    address: 'شارع السلطان قابوس، حي الغبرة',
    city: 'مسقط',
    nationality: 'عماني',
    dateOfBirth: '1985-05-15',
    gender: 'male',
    maritalStatus: 'married',
    idNumber: '1234567890',
    passportNumber: 'A1234567'
  },
  workInfo: {
    position: 'مدير المبيعات',
    department: 'المبيعات',
    manager: 'سارة أحمد',
    location: 'مسقط',
    hireDate: '2022-01-15',
    contractType: 'full_time',
    workSchedule: '8:00 AM - 5:00 PM',
    status: 'active'
  },
  salaryInfo: {
    basicSalary: 1500,
    allowances: 300,
    totalSalary: 1800,
    currency: 'ر.ع',
    paymentMethod: 'bank_transfer',
    bankAccount: '1234567890123456'
  },
  documents: [
    {
      id: '1',
      name: 'الهوية الشخصية',
      type: 'identity',
      uploadDate: '2022-01-15',
      status: 'valid'
    },
    {
      id: '2',
      name: 'شهادة المؤهل',
      type: 'certificate',
      uploadDate: '2022-01-15',
      status: 'valid'
    },
    {
      id: '3',
      name: 'عقد العمل',
      type: 'contract',
      uploadDate: '2022-01-15',
      status: 'valid'
    }
  ]
};
