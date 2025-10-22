/**
 * مكون نموذج سجل الحضور
 */

import React, { useState } from 'react';
import { AttendanceData } from '@/lib/types/employee';
import { mockEmployeeTableData, EmployeeTableData } from '@/data/employeesData';
import { Button } from '@/components/ui/button';
import { X, Save, Clock, User, CheckCircle, Search } from 'lucide-react';

interface AttendanceFormProps {
  attendance?: AttendanceData | null;
  onSave: (attendance: AttendanceData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function AttendanceForm({ 
  attendance, 
  onSave, 
  onCancel, 
  isLoading = false 
}: AttendanceFormProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeTableData | null>(
    attendance ? mockEmployeeTableData.find(emp => emp.employeeId === attendance.employeeId) || null : null
  );
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [showEmployeeList, setShowEmployeeList] = useState(false);
  
  const [formData, setFormData] = useState({
    employeeId: attendance?.employeeId || '',
    employeeName: attendance?.employeeName || '',
    position: attendance?.position || '',
    department: attendance?.department || '',
    date: attendance?.date || '',
    checkIn: attendance?.checkIn || '',
    checkOut: attendance?.checkOut || '',
    totalHours: attendance?.totalHours || 0,
    overtime: attendance?.overtime || 0,
    status: attendance?.status || 'present',
    notes: attendance?.notes || ''
  });

  // تصفية الموظفين حسب البحث
  const filteredEmployees = mockEmployeeTableData.filter(employee =>
    employee.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
    employee.employeeId.toLowerCase().includes(employeeSearch.toLowerCase()) ||
    employee.position.toLowerCase().includes(employeeSearch.toLowerCase())
  );

  // اختيار موظف
  const handleSelectEmployee = (employee: EmployeeTableData) => {
    setSelectedEmployee(employee);
    setFormData(prev => ({
      ...prev,
      employeeId: employee.employeeId,
      employeeName: employee.name,
      position: employee.position,
      department: employee.department
    }));
    setEmployeeSearch(employee.name);
    setShowEmployeeList(false);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => {
      const updated = {
        ...prev,
        [field]: value
      };
      
      // حساب ساعات العمل تلقائياً
      if (field === 'checkIn' || field === 'checkOut') {
        if (updated.checkIn && updated.checkOut) {
          const checkInTime = new Date(`2000-01-01T${updated.checkIn}`);
          const checkOutTime = new Date(`2000-01-01T${updated.checkOut}`);
          const diffMs = checkOutTime.getTime() - checkInTime.getTime();
          const diffHours = diffMs / (1000 * 60 * 60);
          updated.totalHours = Math.max(0, diffHours);
          
          // حساب الساعات الإضافية (أكثر من 8 ساعات)
          updated.overtime = Math.max(0, diffHours - 8);
        }
      }
      
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const attendanceData: AttendanceData = {
      id: attendance?.id || Date.now().toString(),
      ...formData,
      totalHours: Number(formData.totalHours),
      overtime: Number(formData.overtime)
    };
    
    onSave(attendanceData);
  };

  // إغلاق قائمة الموظفين عند النقر خارجها
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.employee-search-container')) {
        setShowEmployeeList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* رأس النموذج */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#58d2c8]/10 rounded-lg">
              <Clock className="h-6 w-6 text-[#58d2c8]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {attendance ? 'تعديل سجل الحضور' : 'إضافة سجل حضور جديد'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {attendance ? 'تعديل معلومات سجل الحضور' : 'إضافة سجل حضور جديد للموظف'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* محتوى النموذج */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-6">
            {/* معلومات الموظف */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-[#58d2c8]" />
                <h3 className="text-lg font-medium text-gray-900">معلومات الموظف</h3>
              </div>
              
              <div className="space-y-4">
                {/* اختيار الموظف */}
                <div className="relative employee-search-container">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اختيار الموظف *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={employeeSearch}
                      onChange={(e) => {
                        setEmployeeSearch(e.target.value);
                        setShowEmployeeList(true);
                      }}
                      onFocus={() => setShowEmployeeList(true)}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
                      placeholder="ابحث عن الموظف بالاسم أو الرقم أو المنصب..."
                      required
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  
                  {/* قائمة الموظفين */}
                  {showEmployeeList && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredEmployees.length > 0 ? (
                        filteredEmployees.map((employee) => (
                          <div
                            key={employee.id}
                            onClick={() => handleSelectEmployee(employee)}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-gray-900">{employee.name}</p>
                                <p className="text-sm text-gray-600">{employee.position} - {employee.department}</p>
                              </div>
                              <span className="text-sm text-[#58d2c8] font-medium">{employee.employeeId}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-500 text-center">
                          لا توجد نتائج
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* معلومات الموظف المحدد */}
                {selectedEmployee && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        رقم الموظف
                      </label>
                      <input
                        type="text"
                        value={formData.employeeId}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                        readOnly
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        المنصب
                      </label>
                      <input
                        type="text"
                        value={formData.position}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                        readOnly
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        القسم
                      </label>
                      <input
                        type="text"
                        value={formData.department}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                        readOnly
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* تفاصيل الحضور */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#58d2c8]" />
                <h3 className="text-lg font-medium text-gray-900">تفاصيل الحضور</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    التاريخ *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وقت الدخول *
                  </label>
                  <input
                    type="time"
                    value={formData.checkIn}
                    onChange={(e) => handleInputChange('checkIn', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وقت الخروج
                  </label>
                  <input
                    type="time"
                    value={formData.checkOut}
                    onChange={(e) => handleInputChange('checkOut', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    إجمالي الساعات
                  </label>
                  <input
                    type="number"
                    value={formData.totalHours}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    readOnly
                    step="0.1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ساعات إضافية
                  </label>
                  <input
                    type="number"
                    value={formData.overtime}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    readOnly
                    step="0.1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الحالة *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
                    required
                  >
                    <option value="present">حاضر</option>
                    <option value="absent">غائب</option>
                    <option value="late">متأخر</option>
                    <option value="half_day">نصف يوم</option>
                    <option value="on_leave">في إجازة</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ملاحظات */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#58d2c8]" />
                <h3 className="text-lg font-medium text-gray-900">ملاحظات</h3>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ملاحظات إضافية
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent"
                  rows={3}
                  placeholder="اكتب أي ملاحظات إضافية..."
                />
              </div>
            </div>
          </div>
        </form>

        {/* أزرار الإجراءات */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-[#58d2c8] hover:bg-[#4AB8B3] gap-2"
          >
            <Save className="h-4 w-4" />
            {isLoading ? 'جاري الحفظ...' : 'حفظ'}
          </Button>
        </div>
      </div>
    </div>
  );
}
