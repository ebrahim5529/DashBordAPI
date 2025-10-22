'use client';

import { Activity, Truck, Wrench, DollarSign, UserPlus } from 'lucide-react';

interface InteractiveDashboardStatsProps {
  data: {
    realTimeStats: {
      activeContracts: number;
      pendingDeliveries: number;
      maintenanceAlerts: number;
      revenueToday: number;
      newCustomersToday: number;
    };
  };
}

export function InteractiveDashboardStats({ data }: InteractiveDashboardStatsProps) {
  const { realTimeStats } = data;

  const statsCards = [
    {
      title: 'العقود النشطة',
      value: realTimeStats.activeContracts,
      icon: Activity,
      status: 'active' as const,
      description: 'عقود نشطة حالياً',
    },
    {
      title: 'طلبات التوصيل المعلقة',
      value: realTimeStats.pendingDeliveries,
      icon: Truck,
      status: 'pending' as const,
      description: 'طلبات في انتظار التوصيل',
    },
    {
      title: 'تنبيهات الصيانة',
      value: realTimeStats.maintenanceAlerts,
      icon: Wrench,
      status: 'alert' as const,
      description: 'تنبيهات تحتاج متابعة',
    },
    {
      title: 'الإيرادات اليوم',
      value: `${realTimeStats.revenueToday.toLocaleString()} ريال`,
      icon: DollarSign,
      status: 'revenue' as const,
      description: 'إيرادات اليوم',
    },
    {
      title: 'عملاء جدد اليوم',
      value: realTimeStats.newCustomersToday,
      icon: UserPlus,
      status: 'new' as const,
      description: 'عملاء جدد اليوم',
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:bg-[#58d2c8]/5 hover:border-[#58d2c8]/30 hover:shadow-lg hover:shadow-[#58d2c8]/20 hover:scale-105 transition-all duration-300 cursor-pointer group min-h-[120px]">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-sm text-gray-600 group-hover:text-[#58d2c8] transition-colors duration-300 font-almarai mb-2">
                    {card.title}
                  </h3>
                  <div className="text-2xl font-bold text-[#58d2c8] group-hover:text-[#4AB8B3] transition-colors duration-300 font-tajawal">
                    {card.value}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {card.description}
                  </p>
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      card.status === 'active' ? 'bg-green-100 text-green-800' :
                      card.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                      card.status === 'alert' ? 'bg-red-100 text-red-800' :
                      card.status === 'revenue' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {card.status === 'active' ? 'نشط' :
                       card.status === 'pending' ? 'معلق' :
                       card.status === 'alert' ? 'تنبيه' :
                       card.status === 'revenue' ? 'إيرادات' :
                       'جديد'}
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-[#58d2c8]/10 rounded-lg group-hover:bg-[#58d2c8]/20 transition-all duration-300">
                  <Icon className="h-6 w-6 text-[#58d2c8] group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
