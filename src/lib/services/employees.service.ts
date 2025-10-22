/**
 * خدمة إدارة الموظفين
 * تحتوي على جميع دوال التعامل مع API الموظفين
 */

import api from '../api';

/**
 * الحصول على قائمة الموظفين
 */
export const getEmployees = async (params?: {
  search?: string;
  department_id?: string;
  status?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}) => {
  const response = await api.get('/employees', { params });
  return response.data;
};

/**
 * الحصول على تفاصيل موظف محدد
 */
export const getEmployee = async (id: string | number) => {
  const response = await api.get(`/employees/${id}`);
  return response.data;
};

/**
 * إنشاء موظف جديد
 */
export const createEmployee = async (employeeData: any) => {
  const response = await api.post('/employees', employeeData);
  return response.data;
};

/**
 * تحديث بيانات موظف
 */
export const updateEmployee = async (id: string | number, employeeData: any) => {
  const response = await api.put(`/employees/${id}`, employeeData);
  return response.data;
};

/**
 * حذف موظف
 */
export const deleteEmployee = async (id: string | number) => {
  const response = await api.delete(`/employees/${id}`);
  return response.data;
};

/**
 * الحصول على إحصائيات الموظفين
 */
export const getEmployeeStats = async () => {
  const response = await api.get('/employees/stats');
  return response.data;
};

/**
 * رفع مستند للموظف
 */
export const uploadEmployeeDocument = async (employeeId: string | number, file: File, documentType: string) => {
  const formData = new FormData();
  formData.append('document', file);
  formData.append('document_type', documentType);

  const response = await api.post(`/employees/${employeeId}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * تحويل بيانات Laravel إلى نوع EmployeeTableData
 */
export const transformEmployeeToTableData = (employee: any) => {
  return {
    id: employee.id?.toString() || '',
    employeeNumber: employee.employee_number || employee.employee_id || '',
    name: employee.arabic_name || employee.name || '',
    email: employee.email || '',
    phone: employee.phone || '',
    departmentName: employee.department?.name || '',
    departmentId: employee.department_id?.toString() || '',
    position: employee.position || '',
    salary: employee.total_salary || employee.basic_salary || 0,
    hireDate: employee.hire_date,
    status: employee.status || 'active',
  };
};

