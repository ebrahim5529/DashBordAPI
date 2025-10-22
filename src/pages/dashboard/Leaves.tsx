import React, { useState } from 'react';
import { Calendar, BarChart3, Plus, Search, User, Building2 } from 'lucide-react';
import { LeavesStats } from '@/components/features/LeavesStats';
import { LeavesTable } from '@/components/features/LeavesTable';
import LeaveForm from '@/components/features/LeaveForm';
import LeaveDetails from '@/components/features/LeaveDetails';
import { LeaveTableData } from '@/lib/types/leaves';
import { mockLeaveStats, mockLeaveTableData } from '@/data/leavesData';

type ViewMode = 'list' | 'form' | 'details';

export default function LeavesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedLeave, setSelectedLeave] = useState<LeaveTableData | null>(null);
  const [_isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedManager, setSelectedManager] = useState<string>('');

  // معالجة إضافة طلب إجازة جديد
  const handleAddLeave = () => {
    setSelectedLeave(null);
    setViewMode('form');
  };

  // معالجة تعديل طلب إجازة
  const handleEditLeave = (leave: LeaveTableData) => {
    setSelectedLeave(leave);
    setViewMode('form');
  };

  // معالجة حذف طلب إجازة
  const handleDeleteLeave = async (leave: LeaveTableData) => {
    if (window.confirm(`هل أنت متأكد من حذف طلب الإجازة للموظف "${leave.employeeName}"؟`)) {
      setIsLoading(true);
      try {
        // منطق الحذف
        setTimeout(() => {
          setIsLoading(false);
          alert('تم حذف طلب الإجازة بنجاح');
        }, 1000);
      } catch (error) {
        console.error('خطأ في الحذف:', error);
        setIsLoading(false);
        alert('حدث خطأ في الحذف');
      }
    }
  };

  // معالجة عرض تفاصيل طلب الإجازة
  const handleViewLeave = (leave: LeaveTableData) => {
    setSelectedLeave(leave);
    setViewMode('details');
  };

  // معالجة تصدير طلبات الإجازات
  const handleExportLeaves = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('تم تصدير بيانات طلبات الإجازات بنجاح');
    }, 1000);
  };

  // معالجة العودة للقائمة
  const handleBackToList = () => {
    setViewMode('list');
    setSelectedLeave(null);
  };

  // معالجة حفظ النموذج
  const handleSaveLeave = async (_formData: any) => {
    setIsLoading(true);
    try {
      // منطق الحفظ
      setTimeout(() => {
        setIsLoading(false);
        alert(selectedLeave ? 'تم تحديث طلب الإجازة بنجاح' : 'تم إضافة طلب الإجازة بنجاح');
        setViewMode('list');
        setSelectedLeave(null);
      }, 1000);
    } catch (error) {
      console.error('خطأ في الحفظ:', error);
      setIsLoading(false);
      alert('حدث خطأ في الحفظ');
    }
  };

  // عرض النموذج
  if (viewMode === 'form') {
    return (
      <div className="space-y-6">
        <LeaveForm
          leave={selectedLeave as any}
          onSave={handleSaveLeave}
          onCancel={handleBackToList}
          isLoading={_isLoading}
        />
      </div>
    );
  }

  // عرض التفاصيل
  if (viewMode === 'details' && selectedLeave) {
    return (
      <div className="space-y-6">
        <LeaveDetails
          leave={selectedLeave as any}
          onEdit={() => handleEditLeave(selectedLeave)}
          onDelete={() => handleDeleteLeave(selectedLeave)}
          onBack={handleBackToList}
          isLoading={_isLoading}
        />
      </div>
    );
  }

  // قائمة المديرين الوهمية
  const mockManagers = [
    { id: '1', name: 'أحمد محمد علي', department: 'المبيعات', position: 'مدير مبيعات' },
    { id: '2', name: 'فاطمة أحمد السعيد', department: 'التقنية', position: 'مدير تقني' },
    { id: '3', name: 'محمد سالم الكندي', department: 'المالية', position: 'مدير مالي' },
    { id: '4', name: 'عائشة عبدالله الحارثي', department: 'الموارد البشرية', position: 'مدير موارد بشرية' },
    { id: '5', name: 'خالد أحمد الشنفري', department: 'الإدارة', position: 'مدير إداري' },
  ];

  // العرض الافتراضي - قائمة طلبات الإجازات
  return (
    <div className="space-y-6">
      {/* عنوان الصفحة وأزرار الإجراءات */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <h1 className="text-xl font-semibold">الإجازات</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddLeave}
            className="flex items-center gap-2 bg-[#58d2c8] hover:bg-[#4bb8ad] text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            طلب إجازة جديد
          </button>
        </div>
      </div>

      {/* قسم البحث والتصفية */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* البحث عن الموظف */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              البحث عن الموظف
            </label>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث عن الموظف بالاسم أو رقم الموظف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* البحث عن المدير المسؤول */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              المدير المسؤول
            </label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedManager}
                onChange={(e) => setSelectedManager(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none"
              >
                <option value="">جميع المديرين</option>
                {mockManagers.map((manager) => (
                  <option key={manager.id} value={manager.id}>
                    {manager.name} - {manager.department}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* أزرار التصفية الإضافية */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {searchTerm && `البحث: "${searchTerm}"`}
              {selectedManager && ` | المدير: ${mockManagers.find(m => m.id === selectedManager)?.name}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedManager('');
              }}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              مسح الفلاتر
            </button>
          </div>
        </div>
      </div>

      {/* إحصائيات الإجازات */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          <h2 className="text-xl font-semibold">إحصائيات الإجازات</h2>
        </div>
        <LeavesStats stats={mockLeaveStats} />
      </div>

      {/* جدول طلبات الإجازات */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <h2 className="text-xl font-semibold">طلبات الإجازات</h2>
        </div>
        <LeavesTable
          data={mockLeaveTableData || []}
          onAddLeave={handleAddLeave}
          onEditLeave={handleEditLeave}
          onDeleteLeave={handleDeleteLeave}
          onViewLeave={handleViewLeave}
          onExportLeaves={handleExportLeaves}
        />
      </div>
    </div>
  );
}
