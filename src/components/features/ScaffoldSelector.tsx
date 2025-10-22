/**
 * مكون اختيار السقالة
 * يعرض قائمة السقالات المتاحة مع التفاصيل
 */

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import * as scaffoldsService from '@/lib/services/scaffolds.service';

interface Scaffold {
  id: string;
  scaffold_number: string;
  type: string;
  material: string;
  daily_rental_price: number;
  monthly_rental_price: number;
  available_quantity: number;
  size?: any;
}

interface ScaffoldSelectorProps {
  value?: string;
  onChange: (scaffold: Scaffold | null) => void;
  disabled?: boolean;
}

export default function ScaffoldSelector({ value, onChange, disabled = false }: ScaffoldSelectorProps) {
  const [scaffolds, setScaffolds] = useState<Scaffold[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // تحميل السقالات المتاحة
  useEffect(() => {
    loadScaffolds();
  }, []);

  const loadScaffolds = async () => {
    setLoading(true);
    try {
      const response = await scaffoldsService.getAvailableScaffolds();
      if (response.success && response.data) {
        setScaffolds(response.data);
      }
    } catch (error) {
      console.error('خطأ في تحميل السقالات:', error);
    } finally {
      setLoading(false);
    }
  };

  // تحويل أنواع السقالات إلى عربي
  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      STANDARD: 'عادية',
      HEAVY_DUTY: 'للأحمال الثقيلة',
      LIGHT_DUTY: 'للأحمال الخفيفة',
      MOBILE: 'متحركة',
      FIXED: 'مثبتة',
      TOWER: 'برجية',
      CANTILEVER: 'كابولية',
      SUSPENDED: 'معلقة',
    };
    return types[type] || type;
  };

  // تحويل المواد إلى عربي
  const getMaterialLabel = (material: string) => {
    const materials: Record<string, string> = {
      STEEL: 'حديد',
      ALUMINUM: 'ألومنيوم',
      WOOD: 'خشب',
      COMPOSITE: 'مركب',
    };
    return materials[material] || material;
  };

  // فلترة السقالات بناءً على البحث
  const filteredScaffolds = scaffolds.filter((scaffold) =>
    scaffold.scaffold_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getTypeLabel(scaffold.type).includes(searchQuery) ||
    getMaterialLabel(scaffold.material).includes(searchQuery)
  );

  // السقالة المختارة
  const selectedScaffold = scaffolds.find((s) => s.id === value);

  const handleSelect = (scaffold: Scaffold) => {
    onChange(scaffold);
    setShowDropdown(false);
    setSearchQuery('');
  };

  const handleClear = () => {
    onChange(null);
    setSearchQuery('');
  };

  return (
    <div className="relative">
      {/* حقل الإدخال */}
      <div className="relative">
        <input
          type="text"
          value={selectedScaffold ? `${selectedScaffold.scaffold_number} - ${getTypeLabel(selectedScaffold.type)}` : searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder="ابحث عن سقالة..."
          disabled={disabled}
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        {selectedScaffold && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        )}
      </div>

      {/* القائمة المنسدلة */}
      {showDropdown && !disabled && (
        <>
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto z-20">
            {loading ? (
              <div className="px-4 py-3 text-center text-gray-500">
                جاري تحميل السقالات...
              </div>
            ) : filteredScaffolds.length > 0 ? (
              filteredScaffolds.map((scaffold) => (
                <button
                  key={scaffold.id}
                  type="button"
                  onClick={() => handleSelect(scaffold)}
                  className={`w-full text-right px-4 py-3 hover:bg-[#58d2c8]/10 transition-colors border-b border-gray-100 last:border-b-0 ${
                    value === scaffold.id ? 'bg-[#58d2c8]/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {scaffold.scaffold_number}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {getTypeLabel(scaffold.type)} - {getMaterialLabel(scaffold.material)}
                      </div>
                    </div>
                    <div className="text-left mr-4">
                      <div className="text-xs text-gray-500">متاح: {scaffold.available_quantity}</div>
                      <div className="text-sm font-medium text-[#58d2c8]">
                        {scaffold.monthly_rental_price} ر.ع/شهر
                      </div>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-center text-gray-500">
                لا توجد سقالات متاحة
              </div>
            )}
          </div>
        </>
      )}

      {/* عرض تفاصيل السقالة المختارة */}
      {selectedScaffold && (
        <div className="mt-2 p-3 bg-[#58d2c8]/5 rounded-lg border border-[#58d2c8]/20">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">النوع:</span>
              <span className="font-medium mr-2">{getTypeLabel(selectedScaffold.type)}</span>
            </div>
            <div>
              <span className="text-gray-600">المادة:</span>
              <span className="font-medium mr-2">{getMaterialLabel(selectedScaffold.material)}</span>
            </div>
            <div>
              <span className="text-gray-600">السعر اليومي:</span>
              <span className="font-medium mr-2">{selectedScaffold.daily_rental_price} ر.ع</span>
            </div>
            <div>
              <span className="text-gray-600">السعر الشهري:</span>
              <span className="font-medium mr-2">{selectedScaffold.monthly_rental_price} ر.ع</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-600">الكمية المتاحة:</span>
              <span className="font-medium mr-2 text-green-600">{selectedScaffold.available_quantity}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

