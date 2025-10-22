'use client';

import { Package, Truck, Wrench, Building2, Activity, TrendingUp, TrendingDown } from 'lucide-react';

interface OperationsReportsStatsProps {
  data: {
    inventory: {
      totalItems: number;
      availableItems: number;
      rentedItems: number;
      maintenanceItems: number;
      utilizationRate: number;
    };
  };
}

export function OperationsReportsStats({ data }: OperationsReportsStatsProps) {
  const { inventory } = data;

  const statsCards = [
    {
      title: 'إجمالي المعدات',
      value: inventory.totalItems,
      icon: Package,
      change: '+5.2%',
      changeType: 'positive' as const,
      description: 'إجمالي وحدات المعدات',
    },
    {
      title: 'المعدات المتاحة',
      value: inventory.availableItems,
      icon: Building2,
      change: '+3.1%',
      changeType: 'positive' as const,
      description: 'المعدات المتاحة للتأجير',
    },
    {
      title: 'المعدات المؤجرة',
      value: inventory.rentedItems,
      icon: Truck,
      change: '+8.7%',
      changeType: 'positive' as const,
      description: 'المعدات قيد الاستخدام',
    },
    {
      title: 'معدل الاستخدام',
      value: `${inventory.utilizationRate}%`,
      icon: Activity,
      change: '+2.3%',
      changeType: 'positive' as const,
      description: 'نسبة استخدام المعدات',
    },
    {
      title: 'المعدات تحت الصيانة',
      value: inventory.maintenanceItems,
      icon: Wrench,
      change: '-1.2%',
      changeType: 'negative' as const,
      description: 'المعدات قيد الصيانة',
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
                  <div className="flex items-center space-x-2 rtl:space-x-reverse mt-2">
                    {card.changeType === 'positive' ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                    <span className={`text-xs ${card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                      {card.change}
                    </span>
                    <span className="text-xs text-gray-500">
                      من الشهر الماضي
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
