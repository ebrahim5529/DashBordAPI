/**
 * صفحة سجل الأنشطة
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shared/Card';
import { ComingSoon } from '@/components/shared/ComingSoon';

export default function ActivityLogPage() {
  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>سجل الأنشطة</CardTitle>
          <CardDescription>عرض سجل أنشطة النظام</CardDescription>
        </CardHeader>
        <CardContent>
          <ComingSoon
            title='سجل الأنشطة'
            description='سيتم إضافة نظام سجل الأنشطة قريباً'
          />
        </CardContent>
      </Card>
    </div>
  );
}