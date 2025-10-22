'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FileText,
  Package,
  Users,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'contract' | 'payment' | 'inventory' | 'customer';
  title: string;
  description: string;
  time: string;
  status: 'completed' | 'pending' | 'warning';
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contract':
        return FileText;
      case 'payment':
        return CreditCard;
      case 'inventory':
        return Package;
      case 'customer':
        return Users;
      default:
        return Clock;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'warning':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'warning':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg font-semibold text-gray-900 dark:text-white'>
          النشاط الأخير
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {activities.map(activity => {
            const ActivityIcon = getActivityIcon(activity.type);
            const StatusIcon = getStatusIcon(activity.status);

            return (
              <div
                key={activity.id}
                className='flex items-start space-x-3 rtl:space-x-reverse p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
              >
                <div className='flex-shrink-0'>
                  <div className='w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center'>
                    <ActivityIcon className='h-5 w-5 text-primary' />
                  </div>
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center justify-between'>
                    <h4 className='text-sm font-medium text-gray-900 dark:text-white'>
                      {activity.title}
                    </h4>
                    <div className='flex items-center space-x-2 rtl:space-x-reverse'>
                      <StatusIcon
                        className={`h-4 w-4 ${getStatusColor(activity.status)}`}
                      />
                      <span className='text-xs text-gray-500 dark:text-gray-400'>
                        {activity.time}
                      </span>
                    </div>
                  </div>
                  <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                    {activity.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
