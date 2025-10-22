export type DepartmentStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface Department {
  id: string;
  name: string;
  code: string;
  managerId: string;
  managerName: string;
  employeeCount: number;
  createdAt: string;
  description?: string;
  status: DepartmentStatus;
  location?: string;
  budget?: number;
}

export interface DepartmentTableData extends Department {
  // Extends Department interface to include all fields
}

export interface DepartmentStats {
  totalDepartments: number;
  activeDepartments: number;
  inactiveDepartments: number;
  largestDepartment: {
    name: string;
    employeeCount: number;
  };
  newestDepartment: {
    name: string;
    createdAt: string;
  };
  totalEmployees: number;
  averageEmployeesPerDepartment: number;
}

export interface DepartmentFormData {
  name: string;
  code: string;
  managerId: string;
  description?: string;
  location?: string;
  budget?: number;
}

export interface DepartmentFormErrors {
  name?: string;
  code?: string;
  managerId?: string;
  description?: string;
  location?: string;
  budget?: string;
}

// Lookup arrays for dropdowns
export const DEPARTMENT_STATUS_LABELS: Record<DepartmentStatus, string> = {
  ACTIVE: 'نشط',
  INACTIVE: 'غير نشط',
  SUSPENDED: 'معلق'
};

export const DEPARTMENT_STATUS_COLORS: Record<DepartmentStatus, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-gray-100 text-gray-800',
  SUSPENDED: 'bg-yellow-100 text-yellow-800'
};
