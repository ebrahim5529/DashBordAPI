/**
 * مكون البحث المتقدم عن الموظفين
 * يوفر واجهة بحث تفاعلية مع dropdown list
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X, User, Phone, Building2 } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  phone: string;
  employeeId: string;
}

interface EmployeeSearchDropdownProps {
  employees: Employee[];
  selectedEmployee: Employee | null;
  onSelectEmployee: (employee: Employee | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  error?: string;
}

export default function EmployeeSearchDropdown({
  employees,
  selectedEmployee,
  onSelectEmployee,
  placeholder = 'ابحث عن الموظف...',
  disabled = false,
  className = '',
  required = false,
  error = ''
}: EmployeeSearchDropdownProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // تصفية الموظفين حسب البحث
  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.phone.includes(searchTerm) ||
    employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // إغلاق الـ dropdown عند النقر خارجه
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // معالجة اختيار الموظف
  const handleSelectEmployee = (employee: Employee) => {
    onSelectEmployee(employee);
    setSearchTerm(employee.name);
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
  };

  // معالجة مسح الاختيار
  const handleClearSelection = () => {
    onSelectEmployee(null);
    setSearchTerm('');
    inputRef.current?.focus();
  };

  // معالجة تغيير البحث
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setIsDropdownOpen(true);
    setHighlightedIndex(-1);
    
    // إذا تم مسح النص، امسح الاختيار
    if (!value.trim()) {
      onSelectEmployee(null);
    }
  };

  // معالجة الضغط على المفاتيح
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isDropdownOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsDropdownOpen(true);
        return;
      }
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredEmployees.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredEmployees.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredEmployees.length) {
          handleSelectEmployee(filteredEmployees[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // تحديث البحث عند تغيير الموظف المحدد
  useEffect(() => {
    if (selectedEmployee) {
      setSearchTerm(selectedEmployee.name);
    } else {
      setSearchTerm('');
    }
  }, [selectedEmployee]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* حقل البحث */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={() => setIsDropdownOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-3 py-2 pr-20 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent transition-colors ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
          required={required}
        />
        
        {/* أيقونة البحث */}
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        
        {/* أزرار التحكم */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {selectedEmployee && !disabled && (
            <button
              type="button"
              onClick={handleClearSelection}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              title="مسح الاختيار"
            >
              <X className="h-3 w-3 text-gray-500" />
            </button>
          )}
          
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            disabled={disabled}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors disabled:cursor-not-allowed"
            title={isDropdownOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
          >
            <ChevronDown 
              className={`h-3 w-3 text-gray-500 transition-transform ${
                isDropdownOpen ? 'rotate-180' : ''
              }`} 
            />
          </button>
        </div>
      </div>

      {/* رسالة الخطأ */}
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}

      {/* قائمة الموظفين */}
      {isDropdownOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee, index) => (
              <div
                key={employee.id}
                onClick={() => handleSelectEmployee(employee)}
                className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors ${
                  index === highlightedIndex 
                    ? 'bg-[#58d2c8]/10' 
                    : 'hover:bg-gray-50'
                } ${
                  selectedEmployee?.id === employee.id 
                    ? 'bg-[#58d2c8]/5 border-l-4 border-l-[#58d2c8]' 
                    : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4 text-[#58d2c8]" />
                      <p className="font-medium text-gray-900">{employee.name}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        <span>{employee.position}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        <span>{employee.department}</span>
                      </div>
                    </div>
                    
                    {employee.phone && (
                      <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                        <Phone className="h-3 w-3" />
                        <span>{employee.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <span className="text-sm text-[#58d2c8] font-medium">
                      {employee.employeeId}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-gray-500">
              <User className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>لا توجد نتائج</p>
              <p className="text-sm">جرب البحث بكلمات مختلفة</p>
            </div>
          )}
        </div>
      )}

      {/* عرض الموظف المحدد */}
      {selectedEmployee && (
        <div className="mt-3 p-4 bg-[#58d2c8]/5 border border-[#58d2c8]/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-[#58d2c8]" />
            <span className="text-sm font-medium text-[#58d2c8]">الموظف المحدد</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div>
              <span className="text-gray-600">الاسم:</span>
              <p className="font-medium text-gray-900">{selectedEmployee.name}</p>
            </div>
            
            <div>
              <span className="text-gray-600">المنصب:</span>
              <p className="font-medium text-gray-900">{selectedEmployee.position}</p>
            </div>
            
            <div>
              <span className="text-gray-600">القسم:</span>
              <p className="font-medium text-gray-900">{selectedEmployee.department}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
