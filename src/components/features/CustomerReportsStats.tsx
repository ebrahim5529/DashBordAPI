'use client';

import { Users, UserPlus, UserMinus, Star, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface CustomerReportsStatsProps {
  data: {
    summary: {
      totalCustomers: number;
      activeCustomers: number;
      newCustomers: number;
      churnRate: number;
      averageContractValue: number;
      customerSatisfaction: number;
    };
  };
}

export function CustomerReportsStats({ data }: CustomerReportsStatsProps) {
  const { summary } = data;

  const statsCards = [
    {
      title: 'إجمالي العملاء',
      value: summary.totalCustomers,
      icon: Users,
      change: '+12.5%',
      changeType: 'positive' as const,
      description: 'إجمالي العملاء المسجلين',
    },
    {
      title: 'العملاء النشطون',
      value: summary.activeCustomers,
      icon: UserPlus,
      change: '+8.3%',
      changeType: 'positive' as const,
      description: 'العملاء النشطون حالياً',
    },
    {
      title: 'عملاء جدد',
      value: summary.newCustomers,
      icon: TrendingUp,
      change: '+15.2%',
      changeType: 'positive' as const,
      description: 'عملاء جدد هذا الشهر',
    },
    {
      title: 'متوسط قيمة العقد',
      value: `${summary.averageContractValue.toLocaleString()} ريال`,
      icon: DollarSign,
      change: '+5.7%',
      changeType: 'positive' as const,
      description: 'متوسط قيمة العقد',
    },
    {
      title: 'معدل الرضا',
      value: `${summary.customerSatisfaction}/5`,
      icon: Star,
      change: '+0.3',
      changeType: 'positive' as const,
      description: 'معدل رضا العملاء',
    },
    {
      title: 'معدل التسرب',
      value: `${summary.churnRate}%`,
      icon: UserMinus,
      change: '-0.8%',
      changeType: 'negative' as const,
      description: 'معدل تسرب العملاء',
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
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
