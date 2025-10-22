import { Department, DepartmentTableData, DepartmentStats } from '@/lib/types/departments';

export const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'تقنية المعلومات',
    code: 'IT',
    managerId: 'emp-001',
    managerName: 'أحمد العتيبي',
    employeeCount: 15,
    createdAt: '2024-01-15',
    description: 'قسم مختص بتطوير الأنظمة وإدارة البنية التحتية التقنية',
    status: 'ACTIVE',
    location: 'الطابق الثالث',
    budget: 500000
  },
  {
    id: '2',
    name: 'الموارد البشرية',
    code: 'HR',
    managerId: 'emp-002',
    managerName: 'فاطمة السالم',
    employeeCount: 8,
    createdAt: '2024-01-20',
    description: 'إدارة شؤون الموظفين والتوظيف والتطوير',
    status: 'ACTIVE',
    location: 'الطابق الثاني',
    budget: 200000
  },
  {
    id: '3',
    name: 'المحاسبة والمالية',
    code: 'FIN',
    managerId: 'emp-003',
    managerName: 'محمد القحطاني',
    employeeCount: 12,
    createdAt: '2024-02-01',
    description: 'إدارة الحسابات والموازنات والتحليل المالي',
    status: 'ACTIVE',
    location: 'الطابق الأول',
    budget: 300000
  },
  {
    id: '4',
    name: 'المبيعات والتسويق',
    code: 'SALES',
    managerId: 'emp-004',
    managerName: 'نورا الشمري',
    employeeCount: 20,
    createdAt: '2024-02-10',
    description: 'إدارة المبيعات والتسويق وخدمة العملاء',
    status: 'ACTIVE',
    location: 'الطابق الأرضي',
    budget: 800000
  },
  {
    id: '5',
    name: 'العمليات',
    code: 'OPS',
    managerId: 'emp-005',
    managerName: 'خالد المطيري',
    employeeCount: 25,
    createdAt: '2024-02-15',
    description: 'إدارة العمليات اليومية واللوجستيات',
    status: 'ACTIVE',
    location: 'المستودع',
    budget: 400000
  },
  {
    id: '6',
    name: 'الجودة والامتثال',
    code: 'QC',
    managerId: 'emp-006',
    managerName: 'سارة النعيمي',
    employeeCount: 6,
    createdAt: '2024-03-01',
    description: 'ضمان الجودة والامتثال للمعايير',
    status: 'ACTIVE',
    location: 'الطابق الثاني',
    budget: 150000
  },
  {
    id: '7',
    name: 'التطوير والابتكار',
    code: 'R&D',
    managerId: 'emp-007',
    managerName: 'عبدالله الزهراني',
    employeeCount: 10,
    createdAt: '2024-03-10',
    description: 'البحث والتطوير والابتكار',
    status: 'ACTIVE',
    location: 'الطابق الرابع',
    budget: 600000
  },
  {
    id: '8',
    name: 'العلاقات العامة',
    code: 'PR',
    managerId: 'emp-008',
    managerName: 'مريم العتيبي',
    employeeCount: 4,
    createdAt: '2024-03-20',
    description: 'إدارة العلاقات العامة والاتصال',
    status: 'INACTIVE',
    location: 'الطابق الأول',
    budget: 100000
  }
];

export const mockDepartmentTableData: DepartmentTableData[] = mockDepartments;

export const mockDepartmentStats: DepartmentStats = {
  totalDepartments: mockDepartments.length,
  activeDepartments: mockDepartments.filter(d => d.status === 'ACTIVE').length,
  inactiveDepartments: mockDepartments.filter(d => d.status === 'INACTIVE').length,
  largestDepartment: {
    name: 'العمليات',
    employeeCount: 25
  },
  newestDepartment: {
    name: 'العلاقات العامة',
    createdAt: '2024-03-20'
  },
  totalEmployees: mockDepartments.reduce((sum, dept) => sum + dept.employeeCount, 0),
  averageEmployeesPerDepartment: Math.round(mockDepartments.reduce((sum, dept) => sum + dept.employeeCount, 0) / mockDepartments.length)
};

// Helper functions
export const getDepartmentStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'ACTIVE': 'نشط',
    'INACTIVE': 'غير نشط',
    'SUSPENDED': 'معلق'
  };
  return labels[status] || status;
};

export const getDepartmentStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'ACTIVE': 'bg-green-100 text-green-800',
    'INACTIVE': 'bg-gray-100 text-gray-800',
    'SUSPENDED': 'bg-yellow-100 text-yellow-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ar-SA');
};

export const formatNumber = (num: number) => {
  return num.toLocaleString('ar-SA');
};
