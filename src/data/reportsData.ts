// بيانات التقارير المالية والتشغيلية

export const financialReportsData = {
  summary: {
    totalRevenue: 138500, // بالريال العماني
    totalExpenses: 85000,
    netProfit: 53500,
    profitMargin: 38.6,
    monthlyGrowth: 12.5,
    quarterlyGrowth: 8.3,
  },
  revenueBreakdown: [
    { category: 'تأجير السقالات', amount: 85000, percentage: 61.4 },
    { category: 'بيع المعدات', amount: 35000, percentage: 25.3 },
    { category: 'خدمات الصيانة', amount: 18500, percentage: 13.3 },
  ],
  expensesBreakdown: [
    { category: 'رواتب الموظفين', amount: 35000, percentage: 41.2 },
    { category: 'صيانة المعدات', amount: 18000, percentage: 21.2 },
    { category: 'إيجار المستودعات', amount: 12000, percentage: 14.1 },
    { category: 'الوقود والنقل', amount: 8000, percentage: 9.4 },
    { category: 'التأمين', amount: 5000, percentage: 5.9 },
    { category: 'أخرى', amount: 7000, percentage: 8.2 },
  ],
  monthlyTrends: [
    { month: 'يناير', revenue: 11500, expenses: 7000, profit: 4500 },
    { month: 'فبراير', revenue: 12800, expenses: 7200, profit: 5600 },
    { month: 'مارس', revenue: 13200, expenses: 7500, profit: 5700 },
    { month: 'أبريل', revenue: 14500, expenses: 7800, profit: 6700 },
    { month: 'مايو', revenue: 15200, expenses: 8000, profit: 7200 },
    { month: 'يونيو', revenue: 16800, expenses: 8500, profit: 8300 },
    { month: 'يوليو', revenue: 14200, expenses: 8200, profit: 6000 },
    { month: 'أغسطس', revenue: 13800, expenses: 8000, profit: 5800 },
    { month: 'سبتمبر', revenue: 12500, expenses: 7800, profit: 4700 },
    { month: 'أكتوبر', revenue: 11800, expenses: 7500, profit: 4300 },
    { month: 'نوفمبر', revenue: 11200, expenses: 7200, profit: 4000 },
    { month: 'ديسمبر', revenue: 15000, expenses: 8000, profit: 7000 },
  ],
  topCustomers: [
    { name: 'شركة البناء الحديثة', revenue: 18500, contracts: 8, percentage: 13.4 },
    { name: 'مؤسسة الإنشاءات المتقدمة', revenue: 16200, contracts: 6, percentage: 11.7 },
    { name: 'شركة المقاولات الكبرى', revenue: 14800, contracts: 7, percentage: 10.7 },
    { name: 'شركة الإنشاءات الشرقية', revenue: 13500, contracts: 5, percentage: 9.7 },
    { name: 'مؤسسة البناء المتطور', revenue: 12200, contracts: 4, percentage: 8.8 },
  ],
};

export const operationsReportsData = {
  inventory: {
    totalItems: 450,
    availableItems: 320,
    rentedItems: 95,
    maintenanceItems: 35,
    utilizationRate: 71.1,
  },
  equipmentStatus: [
    { name: 'سقالات معدنية', total: 200, available: 140, rented: 50, maintenance: 10 },
    { name: 'سقالات خشبية', total: 150, available: 110, rented: 30, maintenance: 10 },
    { name: 'سقالات متحركة', total: 50, available: 35, rented: 10, maintenance: 5 },
    { name: 'أبراج الإنارة', total: 30, available: 20, rented: 5, maintenance: 5 },
    { name: 'منصات العمل', total: 20, available: 15, rented: 0, maintenance: 5 },
  ],
  deliveryOperations: [
    { date: '2024-01-15', deliveries: 12, returns: 8, pending: 4 },
    { date: '2024-01-16', deliveries: 15, returns: 10, pending: 5 },
    { date: '2024-01-17', deliveries: 18, returns: 12, pending: 6 },
    { date: '2024-01-18', deliveries: 14, returns: 9, pending: 5 },
    { date: '2024-01-19', deliveries: 16, returns: 11, pending: 5 },
    { date: '2024-01-20', deliveries: 20, returns: 15, pending: 5 },
    { date: '2024-01-21', deliveries: 13, returns: 8, pending: 5 },
  ],
  maintenanceSchedule: [
    { equipment: 'سقالات معدنية - مجموعة A', lastMaintenance: '2024-01-10', nextMaintenance: '2024-02-10', status: 'مجدولة' },
    { equipment: 'سقالات خشبية - مجموعة B', lastMaintenance: '2024-01-05', nextMaintenance: '2024-02-05', status: 'مكتملة' },
    { equipment: 'سقالات متحركة - مجموعة C', lastMaintenance: '2024-01-15', nextMaintenance: '2024-02-15', status: 'قيد التنفيذ' },
    { equipment: 'أبراج الإنارة - مجموعة D', lastMaintenance: '2024-01-12', nextMaintenance: '2024-02-12', status: 'مجدولة' },
  ],
  warehouseLocations: [
    { location: 'المستودع الرئيسي - مسقط', items: 250, utilization: 85.2 },
    { location: 'المستودع الفرعي - صلالة', items: 120, utilization: 78.5 },
    { location: 'المستودع الشمالي - نزوى', items: 80, utilization: 65.3 },
  ],
};

export const customerReportsData = {
  summary: {
    totalCustomers: 89,
    activeCustomers: 67,
    newCustomers: 12,
    churnRate: 5.2,
    averageContractValue: 1556,
    customerSatisfaction: 4.2,
  },
  customerSegments: [
    { segment: 'شركات البناء الكبرى', count: 25, revenue: 65000, percentage: 46.9 },
    { segment: 'المقاولين المتوسطين', count: 35, revenue: 42000, percentage: 30.3 },
    { segment: 'المؤسسات الحكومية', count: 15, revenue: 20000, percentage: 14.4 },
    { segment: 'الأفراد والمشاريع الصغيرة', count: 14, revenue: 11500, percentage: 8.3 },
  ],
  customerActivity: [
    { month: 'يناير', newCustomers: 8, activeCustomers: 65, churnedCustomers: 2 },
    { month: 'فبراير', newCustomers: 10, activeCustomers: 67, churnedCustomers: 1 },
    { month: 'مارس', newCustomers: 12, activeCustomers: 69, churnedCustomers: 3 },
    { month: 'أبريل', newCustomers: 15, activeCustomers: 72, churnedCustomers: 2 },
    { month: 'مايو', newCustomers: 18, activeCustomers: 75, churnedCustomers: 4 },
    { month: 'يونيو', newCustomers: 14, activeCustomers: 73, churnedCustomers: 3 },
    { month: 'يوليو', newCustomers: 11, activeCustomers: 71, churnedCustomers: 2 },
    { month: 'أغسطس', newCustomers: 9, activeCustomers: 69, churnedCustomers: 3 },
    { month: 'سبتمبر', newCustomers: 7, activeCustomers: 67, churnedCustomers: 2 },
    { month: 'أكتوبر', newCustomers: 6, activeCustomers: 66, churnedCustomers: 1 },
    { month: 'نوفمبر', newCustomers: 5, activeCustomers: 65, churnedCustomers: 2 },
    { month: 'ديسمبر', newCustomers: 8, activeCustomers: 67, churnedCustomers: 1 },
  ],
  topPerformingCustomers: [
    { name: 'شركة البناء الحديثة', contracts: 12, totalValue: 18500, lastActivity: '2024-01-15', rating: 4.8 },
    { name: 'مؤسسة الإنشاءات المتقدمة', contracts: 10, totalValue: 16200, lastActivity: '2024-01-14', rating: 4.6 },
    { name: 'شركة المقاولات الكبرى', contracts: 15, totalValue: 14800, lastActivity: '2024-01-13', rating: 4.5 },
    { name: 'شركة الإنشاءات الشرقية', contracts: 8, totalValue: 13500, lastActivity: '2024-01-12', rating: 4.4 },
    { name: 'مؤسسة البناء المتطور', contracts: 6, totalValue: 12200, lastActivity: '2024-01-11', rating: 4.3 },
  ],
  customerSatisfaction: [
    { category: 'جودة المعدات', rating: 4.5, responses: 45 },
    { category: 'سرعة التوصيل', rating: 4.2, responses: 42 },
    { category: 'خدمة العملاء', rating: 4.3, responses: 38 },
    { category: 'الأسعار', rating: 4.0, responses: 40 },
    { category: 'الصيانة', rating: 4.1, responses: 35 },
  ],
};

export const dashboardInteractiveData = {
  realTimeStats: {
    activeContracts: 67,
    pendingDeliveries: 12,
    maintenanceAlerts: 3,
    revenueToday: 2500,
    newCustomersToday: 2,
  },
  recentActivities: [
    { time: '10:30', activity: 'تسليم سقالات لشركة البناء الحديثة', type: 'delivery', status: 'completed' },
    { time: '09:45', activity: 'استلام دفعة من مؤسسة الإنشاءات المتقدمة', type: 'payment', status: 'completed' },
    { time: '09:15', activity: 'تسجيل عميل جديد: شركة المشاريع الكبرى', type: 'customer', status: 'completed' },
    { time: '08:30', activity: 'تنبيه صيانة: سقالات متحركة - مجموعة C', type: 'maintenance', status: 'pending' },
    { time: '08:00', activity: 'بدء تسليم منصات عمل لمشروع صحار', type: 'delivery', status: 'in-progress' },
  ],
  alerts: [
    { type: 'warning', message: '3 عقود تنتهي خلال أسبوع', priority: 'high' },
    { type: 'info', message: '5 وحدات سقالات تحتاج صيانة', priority: 'medium' },
    { type: 'success', message: 'تم استلام دفعة متأخرة', priority: 'low' },
  ],
  quickActions: [
    { title: 'عقد جديد', description: 'إنشاء عقد تأجير جديد', icon: 'FileText', color: 'blue' },
    { title: 'تسليم معدات', description: 'تسجيل تسليم معدات', icon: 'Truck', color: 'green' },
    { title: 'استلام دفعة', description: 'تسجيل استلام دفعة', icon: 'DollarSign', color: 'yellow' },
    { title: 'صيانة', description: 'تسجيل عمل صيانة', icon: 'Wrench', color: 'orange' },
  ],
};
