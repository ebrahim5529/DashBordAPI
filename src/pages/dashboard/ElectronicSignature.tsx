/**
 * صفحة التوقيع الإلكتروني للجهة المالكة
 * يسمح بحفظ توقيع الجهة مرة واحدة لاستخدامه في جميع العقود
 */

import React from 'react';
import { CompanySignature } from '@/components/features/CompanySignature';
import { Card, CardContent } from '@/components/ui/card';
import { PenTool, Info } from 'lucide-react';

export default function ElectronicSignaturePage() {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* العنوان */}
      <div className="flex items-center gap-3 justify-end">
        <div className="text-right">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            التوقيع الإلكتروني
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            إدارة التوقيع الإلكتروني للجهة المالكة
          </p>
        </div>
        <PenTool className="h-8 w-8 text-primary" />
      </div>

      {/* معلومات توضيحية */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-right space-y-2">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                معلومات مهمة
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                <li>يمكنك حفظ توقيع الجهة المالكة مرة واحدة فقط</li>
                <li>سيظهر هذا التوقيع تلقائياً في جميع العقود الجديدة</li>
                <li>يمكنك تحديث التوقيع في أي وقت</li>
                <li>يمكنك إما رسم التوقيع أو رفع صورة له</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* مكون التوقيع */}
      <CompanySignature />
    </div>
  );
}

