/**
 * مكون تفاصيل إيصال التسليم
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DeliveryTableData } from '@/lib/types/delivery';
import { formatDate } from '@/lib/utils/formatDate.util';
import { 
  Edit, 
  X, 
  PackageCheck,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  Hash,
  MapPin,
  Truck
} from 'lucide-react';

interface DeliveryDetailsProps {
  delivery: DeliveryTableData;
  onClose: () => void;
  onEdit: () => void;
}

export default function DeliveryDetails({ delivery, onClose, onEdit }: DeliveryDetailsProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'معلق';
      case 'completed':
        return 'مكتمل';
      case 'cancelled':
        return 'ملغي';
      default:
        return 'غير محدد';
    }
  };

  return (
    <div className="space-y-6">
      {/* عنوان الصفحة */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            تفاصيل إيصال التسليم
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            عرض تفاصيل إيصال التسليم رقم {delivery.receiptNumber}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4 ml-2" />
            تعديل
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
          >
            <X className="h-4 w-4 ml-2" />
            إغلاق
          </Button>
        </div>
      </div>

      {/* معلومات أساسية */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PackageCheck className="h-5 w-5" />
            المعلومات الأساسية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Hash className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">رقم الإيصال</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {delivery.receiptNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">العميل</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {delivery.customerName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">تاريخ التسليم</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDate(delivery.deliveryDate, 'SHORT')}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Hash className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">عدد الأصناف</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {delivery.itemsCount}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">السائق</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {delivery.driverName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <PackageCheck className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">القيمة</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    ${delivery.value.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* عنوان التسليم */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            عنوان التسليم
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-900 dark:text-white">
            {delivery.deliveryAddress}
          </p>
        </CardContent>
      </Card>

      {/* حالة التسليم */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PackageCheck className="h-5 w-5" />
            حالة التسليم
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge className={`${getStatusColor(delivery.status)} flex items-center gap-2 w-fit`}>
            {getStatusIcon(delivery.status)}
            {getStatusText(delivery.status)}
          </Badge>
        </CardContent>
      </Card>

      {/* إجراءات إضافية */}
      <Card>
        <CardHeader>
          <CardTitle>الإجراءات المتاحة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              onClick={onEdit}
              variant="outline"
            >
              <Edit className="h-4 w-4 ml-2" />
              تعديل الإيصال
            </Button>
            <Button
              variant="outline"
              onClick={() => window.print()}
            >
              <PackageCheck className="h-4 w-4 ml-2" />
              طباعة الإيصال
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
