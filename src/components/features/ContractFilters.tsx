/**
 * مكون فلاتر العقود
 */

'use client';

import React, { useState } from 'react';
import { ContractFilters as ContractFiltersType } from '@/lib/types/contracts';
import { Button } from '@/components/shared/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import {
  Search,
  Filter,
  X,
  Calendar,
  DollarSign,
  User,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Pause,
} from 'lucide-react';

interface ContractFiltersProps {
  filters: ContractFiltersType;
  onApply: (filters: ContractFiltersType) => void;
  onClear: () => void;
}

export function ContractFilters({ filters, onApply, onClear }: ContractFiltersProps) {
  const [localFilters, setLocalFilters] = useState<ContractFiltersType>(filters);

  // معالجة تغيير القيم
  const handleInputChange = (field: keyof ContractFiltersType, value: any) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  // معالجة تطبيق الفلاتر
  const handleApply = () => {
    onApply(localFilters);
  };

  // معالجة مسح الفلاتر
  const handleClear = () => {
    setLocalFilters({});
    onClear();
  };

  // أنواع العقود
  const contractTypes = [
    { value: 'تأجير', label: 'تأجير', icon: FileText },
    { value: 'شراء', label: 'شراء', icon: DollarSign },
    { value: 'صيانة', label: 'صيانة', icon: CheckCircle },
    { value: 'خدمة', label: 'خدمة', icon: User },
    { value: 'تقسيط', label: 'تقسيط', icon: Clock },
  ];

  // حالات العقود
  const contractStatuses = [
    { value: 'نشط', label: 'نشط', icon: CheckCircle, color: 'text-green-600' },
    { value: 'منتهي', label: 'منتهي', icon: XCircle, color: 'text-red-600' },
    { value: 'ملغى', label: 'ملغى', icon: XCircle, color: 'text-gray-600' },
    { value: 'مسودة', label: 'مسودة', icon: Pause, color: 'text-yellow-600' },
    { value: 'معتمد', label: 'معتمد', icon: CheckCircle, color: 'text-blue-600' },
    { value: 'متأخر', label: 'متأخر', icon: XCircle, color: 'text-red-600' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            فلاتر البحث
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            مسح الكل
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* البحث النصي */}
        <div>
          <label className="block text-sm font-medium mb-2">البحث</label>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={localFilters.search || ''}
              onChange={(e) => handleInputChange('search', e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="البحث برقم العقد أو اسم العميل..."
            />
          </div>
        </div>

        {/* نوع العقد */}
        <div>
          <label className="block text-sm font-medium mb-2">نوع العقد</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {contractTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleInputChange('contractType', 
                    localFilters.contractType === type.value ? undefined : type.value
                  )}
                  className={`p-3 border rounded-lg flex items-center gap-2 transition-colors ${
                    localFilters.contractType === type.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* حالة العقد */}
        <div>
          <label className="block text-sm font-medium mb-2">حالة العقد</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {contractStatuses.map((status) => {
              const Icon = status.icon;
              return (
                <button
                  key={status.value}
                  type="button"
                  onClick={() => handleInputChange('status', 
                    localFilters.status === status.value ? undefined : status.value
                  )}
                  className={`p-3 border rounded-lg flex items-center gap-2 transition-colors ${
                    localFilters.status === status.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${status.color}`} />
                  <span className="text-sm">{status.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* نطاق القيمة */}
        <div>
          <label className="block text-sm font-medium mb-2">نطاق القيمة</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">القيمة الأدنى</label>
              <div className="relative">
                <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="number"
                  value={localFilters.minValue || ''}
                  onChange={(e) => handleInputChange('minValue', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">القيمة الأقصى</label>
              <div className="relative">
                <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="number"
                  value={localFilters.maxValue || ''}
                  onChange={(e) => handleInputChange('maxValue', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="999999"
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* نطاق تاريخ البداية */}
        <div>
          <label className="block text-sm font-medium mb-2">نطاق تاريخ البداية</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">من تاريخ</label>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  value={localFilters.startDateFrom ? localFilters.startDateFrom.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleInputChange('startDateFrom', e.target.value ? new Date(e.target.value) : undefined)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">إلى تاريخ</label>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  value={localFilters.startDateTo ? localFilters.startDateTo.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleInputChange('startDateTo', e.target.value ? new Date(e.target.value) : undefined)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* نطاق تاريخ الانتهاء */}
        <div>
          <label className="block text-sm font-medium mb-2">نطاق تاريخ الانتهاء</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">من تاريخ</label>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  value={localFilters.endDateFrom ? localFilters.endDateFrom.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleInputChange('endDateFrom', e.target.value ? new Date(e.target.value) : undefined)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">إلى تاريخ</label>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  value={localFilters.endDateTo ? localFilters.endDateTo.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleInputChange('endDateTo', e.target.value ? new Date(e.target.value) : undefined)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* خيارات إضافية */}
        <div>
          <label className="block text-sm font-medium mb-2">خيارات إضافية</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={localFilters.hasOverdue || false}
                onChange={(e) => handleInputChange('hasOverdue', e.target.checked || undefined)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">عرض العقود المتأخرة فقط</span>
            </label>
          </div>
        </div>

        {/* أزرار الإجراءات */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleClear}
          >
            مسح الكل
          </Button>
          <Button
            onClick={handleApply}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            تطبيق الفلاتر
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
