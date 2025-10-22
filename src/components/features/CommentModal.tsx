/**
 * نافذة منبثقة لإضافة تعليق مع بيانات آخر تواصل والموعد القادم
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { ClaimsTableData } from '@/lib/types/claims';
import {
  X,
  MessageSquare,
  Calendar,
  Clock,
  Hash,
  Save,
  User,
  Phone,
} from 'lucide-react';

interface CommentModalProps {
  claim: ClaimsTableData;
  onSave: (data: {
    comment: string;
    hashtags: string[];
    lastContactDate: Date;
    nextContactDate: Date;
    contactMethod: string;
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CommentModal({ claim, onSave, onCancel, isLoading = false }: CommentModalProps) {
  const [comment, setComment] = useState('');
  const [lastContactDate, setLastContactDate] = useState(
    claim.lastContactDate ? new Date(claim.lastContactDate).toISOString().split('T')[0] : ''
  );
  const [nextContactDate, setNextContactDate] = useState(
    claim.nextContactDate ? new Date(claim.nextContactDate).toISOString().split('T')[0] : ''
  );
  const [contactMethod, setContactMethod] = useState('PHONE');

  // استخراج الهاشتاجات من التعليق
  const extractHashtags = (text: string): string[] => {
    const hashtags = text.match(/#[\w\u0600-\u06FF]+/g) || [];
    return hashtags.map(tag => tag.substring(1)); // إزالة #
  };

  // معالجة حفظ التعليق
  const handleSave = () => {
    if (!comment.trim()) {
      alert('يرجى إدخال التعليق');
      return;
    }

    const hashtags = extractHashtags(comment);
    const lastContact = lastContactDate ? new Date(lastContactDate) : new Date();
    const nextContact = nextContactDate ? new Date(nextContactDate) : new Date();

    onSave({
      comment,
      hashtags,
      lastContactDate: lastContact,
      nextContactDate: nextContact,
      contactMethod,
    });
  };

  // اقتراحات الهاشتاجات
  const suggestedHashtags = [
    '#ممتاز', '#مشكلة', '#متابعة', '#دفع', '#تأخير', '#اتصال', '#زيارة', '#مستعجل'
  ];

  // إضافة هاشتاج مقترح
  const addHashtag = (hashtag: string) => {
    setComment(prev => prev + (prev ? ' ' : '') + hashtag);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            إضافة تعليق - {claim.customerName}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* معلومات العميل */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">معلومات العميل</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                <span className="text-sm">{claim.customerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-green-600" />
                <span className="text-sm">{claim.customerPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">المبلغ المتبقي:</span>
                <span className="text-sm text-red-600 font-bold">
                  {claim.pendingAmount.toLocaleString()} ر.ع
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">الأولوية:</span>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  claim.priority === 'URGENT' ? 'bg-red-100 text-red-800' :
                  claim.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                  claim.priority === 'NORMAL' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {claim.priority === 'URGENT' ? 'عاجلة' :
                   claim.priority === 'HIGH' ? 'عالية' :
                   claim.priority === 'NORMAL' ? 'عادية' : 'منخفضة'}
                </span>
              </div>
            </div>
          </div>

          {/* تواريخ التواصل */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                آخر تاريخ تواصل
              </label>
              <input
                type="date"
                value={lastContactDate}
                onChange={(e) => setLastContactDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                <Clock className="h-4 w-4 inline mr-1" />
                الموعد القادم للتواصل
              </label>
              <input
                type="date"
                value={nextContactDate}
                onChange={(e) => setNextContactDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                <Phone className="h-4 w-4 inline mr-1" />
                طريقة التواصل
              </label>
              <select
                value={contactMethod}
                onChange={(e) => setContactMethod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="PHONE">هاتف</option>
                <option value="SMS">رسالة نصية</option>
                <option value="EMAIL">بريد إلكتروني</option>
                <option value="VISIT">زيارة</option>
                <option value="WHATSAPP">واتساب</option>
              </select>
            </div>
          </div>

          {/* التعليق */}
          <div>
            <label className="block text-sm font-medium mb-2">
              التعليق <span className="text-red-500">*</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="أدخل التعليق... يمكن استخدام الهاشتاجات مثل #ممتاز #مشكلة #متابعة"
            />
            <p className="text-xs text-gray-500 mt-1">
              يمكن استخدام الهاشتاجات لتصنيف التعليق (مثل: #ممتاز #مشكلة #متابعة)
            </p>
          </div>

          {/* اقتراحات الهاشتاجات */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <Hash className="h-4 w-4 inline mr-1" />
              اقتراحات الهاشتاجات
            </label>
            <div className="flex flex-wrap gap-2">
              {suggestedHashtags.map((hashtag) => (
                <button
                  key={hashtag}
                  type="button"
                  onClick={() => addHashtag(hashtag)}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
                >
                  {hashtag}
                </button>
              ))}
            </div>
          </div>

          {/* معاينة الهاشتاجات */}
          {extractHashtags(comment).length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <h4 className="text-sm font-medium text-green-800 mb-2">الهاشتاجات المستخرجة:</h4>
              <div className="flex flex-wrap gap-1">
                {extractHashtags(comment).map((hashtag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                  >
                    #{hashtag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* أزرار الإجراءات */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              إلغاء
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isLoading || !comment.trim()}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isLoading ? 'جاري الحفظ...' : 'حفظ التعليق'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}