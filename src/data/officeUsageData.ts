/**
 * بيانات وهمية لإحصائيات استخدام المكاتب
 * تحاكي البيانات الحقيقية من قاعدة البيانات
 */

// بيانات المكاتب الأساسية
export const officeUsageData = [
  {
    officeName: 'المكتب الرئيسي',
    totalUsers: 45,
    activeUsers: 38,
    monthlyRevenue: 125000,
    contractsCount: 23,
    equipmentCount: 156,
    utilizationRate: 84.4,
  },
  {
    officeName: 'مكتب الشمال',
    totalUsers: 32,
    activeUsers: 28,
    monthlyRevenue: 98000,
    contractsCount: 18,
    equipmentCount: 112,
    utilizationRate: 87.5,
  },
  {
    officeName: 'مكتب الجنوب',
    totalUsers: 28,
    activeUsers: 24,
    monthlyRevenue: 87000,
    contractsCount: 15,
    equipmentCount: 98,
    utilizationRate: 85.7,
  },
  {
    officeName: 'مكتب الشرق',
    totalUsers: 35,
    activeUsers: 31,
    monthlyRevenue: 110000,
    contractsCount: 20,
    equipmentCount: 134,
    utilizationRate: 88.6,
  },
];

// بيانات الاتجاهات الشهرية للمكاتب
export const monthlyTrendsData = [
  {
    month: 'يناير',
    office1: 115000,
    office2: 85000,
    office3: 75000,
    office4: 95000,
  },
  {
    month: 'فبراير',
    office1: 120000,
    office2: 90000,
    office3: 80000,
    office4: 100000,
  },
  {
    month: 'مارس',
    office1: 125000,
    office2: 95000,
    office3: 85000,
    office4: 105000,
  },
  {
    month: 'أبريل',
    office1: 130000,
    office2: 98000,
    office3: 87000,
    office4: 110000,
  },
  {
    month: 'مايو',
    office1: 125000,
    office2: 98000,
    office3: 87000,
    office4: 110000,
  },
  {
    month: 'يونيو',
    office1: 125000,
    office2: 98000,
    office3: 87000,
    office4: 110000,
  },
];

// بيانات النشاط الأسبوعي للمكاتب
export const weeklyActivityData = [
  {
    day: 'السبت',
    office1: 45,
    office2: 32,
    office3: 28,
    office4: 35,
  },
  {
    day: 'الأحد',
    office1: 52,
    office2: 38,
    office3: 31,
    office4: 42,
  },
  {
    day: 'الاثنين',
    office1: 48,
    office2: 35,
    office3: 29,
    office4: 38,
  },
  {
    day: 'الثلاثاء',
    office1: 55,
    office2: 41,
    office3: 33,
    office4: 45,
  },
  {
    day: 'الأربعاء',
    office1: 50,
    office2: 37,
    office3: 30,
    office4: 40,
  },
  {
    day: 'الخميس',
    office1: 47,
    office2: 34,
    office3: 28,
    office4: 37,
  },
  {
    day: 'الجمعة',
    office1: 38,
    office2: 28,
    office3: 24,
    office4: 30,
  },
];

// بيانات توزيع المعدات حسب المكاتب
export const equipmentDistributionData = [
  {
    office: 'المكتب الرئيسي',
    total: 156,
    rented: 98,
    available: 45,
    maintenance: 13,
  },
  {
    office: 'مكتب الشمال',
    total: 112,
    rented: 72,
    available: 32,
    maintenance: 8,
  },
  {
    office: 'مكتب الجنوب',
    total: 98,
    rented: 65,
    available: 28,
    maintenance: 5,
  },
  {
    office: 'مكتب الشرق',
    total: 134,
    rented: 89,
    available: 38,
    maintenance: 7,
  },
];

// بيانات إضافية للإحصائيات العامة
export const generalOfficeStats = {
  totalOffices: 4,
  totalUsers: 140,
  totalActiveUsers: 121,
  totalMonthlyRevenue: 420000,
  totalContracts: 76,
  totalEquipment: 500,
  averageUtilizationRate: 86.5,
};

// بيانات الأداء المقارن للمكاتب
export const officePerformanceData = [
  {
    office: 'المكتب الرئيسي',
    revenue: 125000,
    contracts: 23,
    users: 45,
    efficiency: 92,
  },
  {
    office: 'مكتب الشمال',
    revenue: 98000,
    contracts: 18,
    users: 32,
    efficiency: 88,
  },
  {
    office: 'مكتب الجنوب',
    revenue: 87000,
    contracts: 15,
    users: 28,
    efficiency: 85,
  },
  {
    office: 'مكتب الشرق',
    revenue: 110000,
    contracts: 20,
    users: 35,
    efficiency: 90,
  },
];

// بيانات الاستخدام اليومي للمكاتب (آخر 30 يوم)
export const dailyUsageData = Array.from({ length: 30 }, (_, index) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - index));

  return {
    date: date.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' }),
    office1: Math.floor(Math.random() * 20) + 35,
    office2: Math.floor(Math.random() * 15) + 25,
    office3: Math.floor(Math.random() * 12) + 20,
    office4: Math.floor(Math.random() * 18) + 28,
  };
});

const officeData = {
  officeUsageData,
  monthlyTrendsData,
  weeklyActivityData,
  equipmentDistributionData,
  generalOfficeStats,
  officePerformanceData,
  dailyUsageData,
};

export default officeData;
