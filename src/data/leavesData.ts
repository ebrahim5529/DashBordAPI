import { Leave, LeaveTableData, LeaveStats } from '@/lib/types/leaves';

export const mockLeaves: Leave[] = [
  {
    id: '1',
    employeeId: 'emp-001',
    employeeName: 'أحمد العتيبي',
    leaveType: 'ANNUAL',
    startDate: '2024-12-20',
    endDate: '2024-12-25',
    totalDays: 6,
    reason: 'إجازة عيد الميلاد',
    status: 'APPROVED',
    appliedDate: '2024-12-01',
    approvedBy: 'فاطمة السالم',
    approvedDate: '2024-12-02',
    remainingBalance: 14,
    department: 'تقنية المعلومات',
    position: 'مدير تقنية المعلومات',
    documents: [
      {
        id: 'doc-1',
        name: 'تقرير طبي.pdf',
        size: 1024000,
        type: 'application/pdf',
        url: '/uploads/medical-report.pdf',
        uploadedAt: '2024-12-01T10:30:00Z'
      }
    ]
  },
  {
    id: '2',
    employeeId: 'emp-002',
    employeeName: 'فاطمة السالم',
    leaveType: 'SICK',
    startDate: '2024-12-15',
    endDate: '2024-12-17',
    totalDays: 3,
    reason: 'مرض',
    status: 'APPROVED',
    appliedDate: '2024-12-14',
    approvedBy: 'محمد القحطاني',
    approvedDate: '2024-12-14',
    remainingBalance: 21,
    department: 'الموارد البشرية',
    position: 'مدير الموارد البشرية',
    documents: [
      {
        id: 'doc-2',
        name: 'شهادة طبية.pdf',
        size: 512000,
        type: 'application/pdf',
        url: '/uploads/medical-certificate.pdf',
        uploadedAt: '2024-12-14T08:15:00Z'
      },
      {
        id: 'doc-3',
        name: 'تحليل دم.jpg',
        size: 256000,
        type: 'image/jpeg',
        url: '/uploads/blood-test.jpg',
        uploadedAt: '2024-12-14T08:20:00Z'
      }
    ]
  },
  {
    id: '3',
    employeeId: 'emp-003',
    employeeName: 'محمد القحطاني',
    leaveType: 'EMERGENCY',
    startDate: '2024-12-18',
    endDate: '2024-12-18',
    totalDays: 1,
    reason: 'طوارئ عائلية',
    status: 'PENDING',
    appliedDate: '2024-12-18',
    remainingBalance: 19,
    department: 'المحاسبة والمالية',
    position: 'مدير المحاسبة'
  },
  {
    id: '4',
    employeeId: 'emp-004',
    employeeName: 'نورا الشمري',
    leaveType: 'MATERNITY',
    startDate: '2024-12-25',
    endDate: '2025-03-25',
    totalDays: 90,
    reason: 'إجازة أمومة',
    status: 'APPROVED',
    appliedDate: '2024-11-01',
    approvedBy: 'فاطمة السالم',
    approvedDate: '2024-11-02',
    remainingBalance: 0,
    department: 'المبيعات والتسويق',
    position: 'مدير المبيعات'
  },
  {
    id: '5',
    employeeId: 'emp-005',
    employeeName: 'خالد المطيري',
    leaveType: 'ANNUAL',
    startDate: '2024-12-30',
    endDate: '2025-01-05',
    totalDays: 7,
    reason: 'إجازة رأس السنة',
    status: 'PENDING',
    appliedDate: '2024-12-10',
    remainingBalance: 18,
    department: 'العمليات',
    position: 'مدير العمليات'
  },
  {
    id: '6',
    employeeId: 'emp-006',
    employeeName: 'سارة النعيمي',
    leaveType: 'STUDY',
    startDate: '2024-12-22',
    endDate: '2024-12-24',
    totalDays: 3,
    reason: 'امتحانات جامعية',
    status: 'REJECTED',
    appliedDate: '2024-12-15',
    rejectionReason: 'عدم توفر بديل مناسب',
    remainingBalance: 22,
    department: 'الجودة والامتثال',
    position: 'مدير الجودة'
  },
  {
    id: '7',
    employeeId: 'emp-007',
    employeeName: 'عبدالله الزهراني',
    leaveType: 'PATERNITY',
    startDate: '2024-12-28',
    endDate: '2025-01-11',
    totalDays: 15,
    reason: 'إجازة أبوة',
    status: 'APPROVED',
    appliedDate: '2024-12-20',
    approvedBy: 'فاطمة السالم',
    approvedDate: '2024-12-21',
    remainingBalance: 10,
    department: 'التطوير والابتكار',
    position: 'مدير التطوير'
  },
  {
    id: '8',
    employeeId: 'emp-008',
    employeeName: 'مريم العتيبي',
    leaveType: 'UNPAID',
    startDate: '2024-12-26',
    endDate: '2024-12-30',
    totalDays: 5,
    reason: 'ظروف شخصية',
    status: 'PENDING',
    appliedDate: '2024-12-20',
    remainingBalance: 20,
    department: 'العلاقات العامة',
    position: 'مدير العلاقات العامة'
  },
  {
    id: '9',
    employeeId: 'emp-009',
    employeeName: 'يوسف الغامدي',
    leaveType: 'SICK',
    startDate: '2024-12-16',
    endDate: '2024-12-19',
    totalDays: 4,
    reason: 'عملية جراحية',
    status: 'APPROVED',
    appliedDate: '2024-12-10',
    approvedBy: 'فاطمة السالم',
    approvedDate: '2024-12-11',
    remainingBalance: 16,
    department: 'تقنية المعلومات',
    position: 'مطور برمجيات'
  },
  {
    id: '10',
    employeeId: 'emp-010',
    employeeName: 'هند السعد',
    leaveType: 'ANNUAL',
    startDate: '2024-12-23',
    endDate: '2024-12-27',
    totalDays: 5,
    reason: 'رحلة عائلية',
    status: 'CANCELLED',
    appliedDate: '2024-12-05',
    remainingBalance: 20,
    department: 'المحاسبة والمالية',
    position: 'محاسب'
  }
];

export const mockLeaveTableData: LeaveTableData[] = mockLeaves;

export const mockLeaveStats: LeaveStats = {
  totalLeaves: mockLeaves.length,
  approvedLeaves: mockLeaves.filter(l => l.status === 'APPROVED').length,
  pendingLeaves: mockLeaves.filter(l => l.status === 'PENDING').length,
  rejectedLeaves: mockLeaves.filter(l => l.status === 'REJECTED').length,
  totalDays: mockLeaves.reduce((sum, leave) => sum + leave.totalDays, 0),
  averageDaysPerLeave: Math.round(mockLeaves.reduce((sum, leave) => sum + leave.totalDays, 0) / mockLeaves.length),
  mostCommonLeaveType: {
    type: 'ANNUAL',
    count: mockLeaves.filter(l => l.leaveType === 'ANNUAL').length
  },
  currentMonthLeaves: mockLeaves.filter(l => {
    const leaveDate = new Date(l.appliedDate);
    const currentDate = new Date();
    return leaveDate.getMonth() === currentDate.getMonth() && 
           leaveDate.getFullYear() === currentDate.getFullYear();
  }).length
};

// Helper functions
export const getLeaveTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    'ANNUAL': 'إجازة سنوية',
    'SICK': 'إجازة مرضية',
    'EMERGENCY': 'إجازة طارئة',
    'MATERNITY': 'إجازة أمومة',
    'PATERNITY': 'إجازة أبوة',
    'STUDY': 'إجازة دراسية',
    'UNPAID': 'إجازة بدون راتب'
  };
  return labels[type] || type;
};

export const getLeaveTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    'ANNUAL': 'bg-blue-100 text-blue-800',
    'SICK': 'bg-red-100 text-red-800',
    'EMERGENCY': 'bg-orange-100 text-orange-800',
    'MATERNITY': 'bg-pink-100 text-pink-800',
    'PATERNITY': 'bg-purple-100 text-purple-800',
    'STUDY': 'bg-green-100 text-green-800',
    'UNPAID': 'bg-gray-100 text-gray-800'
  };
  return colors[type] || 'bg-gray-100 text-gray-800';
};

export const getLeaveStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'PENDING': 'قيد الانتظار',
    'APPROVED': 'موافق عليها',
    'REJECTED': 'مرفوضة',
    'CANCELLED': 'ملغية'
  };
  return labels[status] || status;
};

export const getLeaveStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'APPROVED': 'bg-green-100 text-green-800',
    'REJECTED': 'bg-red-100 text-red-800',
    'CANCELLED': 'bg-gray-100 text-gray-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ar-SA');
};

export const formatNumber = (num: number) => {
  return num.toLocaleString('ar-SA');
};
