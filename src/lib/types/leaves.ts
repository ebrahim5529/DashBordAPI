export type LeaveType = 'ANNUAL' | 'SICK' | 'EMERGENCY' | 'MATERNITY' | 'PATERNITY' | 'STUDY' | 'UNPAID';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

// نوع المستند المرفق
export interface LeaveDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface Leave {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
  remainingBalance: number;
  department: string;
  position: string;
  documents?: LeaveDocument[]; // المستندات المرفقة
}

export interface LeaveTableData extends Leave {
  // Extends Leave interface to include all fields
}

export interface LeaveStats {
  totalLeaves: number;
  approvedLeaves: number;
  pendingLeaves: number;
  rejectedLeaves: number;
  totalDays: number;
  averageDaysPerLeave: number;
  mostCommonLeaveType: {
    type: LeaveType;
    count: number;
  };
  currentMonthLeaves: number;
}

export interface LeaveFormData {
  employeeId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  documents?: LeaveDocument[];
}

export interface LeaveFormErrors {
  employeeId?: string;
  leaveType?: string;
  startDate?: string;
  endDate?: string;
  reason?: string;
}

// Lookup arrays for dropdowns
export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  ANNUAL: 'إجازة سنوية',
  SICK: 'إجازة مرضية',
  EMERGENCY: 'إجازة طارئة',
  MATERNITY: 'إجازة أمومة',
  PATERNITY: 'إجازة أبوة',
  STUDY: 'إجازة دراسية',
  UNPAID: 'إجازة بدون راتب'
};

export const LEAVE_TYPE_COLORS: Record<LeaveType, string> = {
  ANNUAL: 'bg-blue-100 text-blue-800',
  SICK: 'bg-red-100 text-red-800',
  EMERGENCY: 'bg-orange-100 text-orange-800',
  MATERNITY: 'bg-pink-100 text-pink-800',
  PATERNITY: 'bg-purple-100 text-purple-800',
  STUDY: 'bg-green-100 text-green-800',
  UNPAID: 'bg-gray-100 text-gray-800'
};

export const LEAVE_STATUS_LABELS: Record<LeaveStatus, string> = {
  PENDING: 'قيد الانتظار',
  APPROVED: 'موافق عليها',
  REJECTED: 'مرفوضة',
  CANCELLED: 'ملغية'
};

export const LEAVE_STATUS_COLORS: Record<LeaveStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-800'
};
