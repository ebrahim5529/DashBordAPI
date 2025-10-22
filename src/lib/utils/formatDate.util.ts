/**
 * دوال تنسيق التاريخ والوقت
 * يحتوي على جميع الدوال المتعلقة بتنسيق التواريخ
 */

import { safeFormatDate, safeFormatTime, safeFormatDateTime } from './safeDateFormat';

// خيارات التنسيق
export const DATE_FORMATS = {
  SHORT: 'dd/MM/yyyy',
  LONG: 'dd MMMM yyyy',
  TIME: 'HH:mm',
  DATETIME: 'dd/MM/yyyy HH:mm',
  ISO: 'yyyy-MM-dd',
  DISPLAY: 'EEEE, dd MMMM yyyy',
} as const;

/**
 * تنسيق التاريخ إلى نص مقروء
 * @param date - التاريخ المراد تنسيقه
 * @param format - نوع التنسيق المطلوب
 * @returns التاريخ المنسق
 */

export function formatDate(
  date: string | Date,
  format: keyof typeof DATE_FORMATS = 'SHORT'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return 'تاريخ غير صحيح';
  }

  switch (format) {
    case 'SHORT':
      return safeFormatDate(date, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

    case 'LONG':
      return safeFormatDate(date, {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

    case 'TIME':
      return safeFormatTime(date, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

    case 'DATETIME':
      return safeFormatDateTime(date, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

    case 'ISO':
      return dateObj.toISOString().split('T')[0];

    case 'DISPLAY':
      return safeFormatDate(date, {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

    default:
      return safeFormatDate(date, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
  }
}

/**
 * حساب الوقت المنقضي منذ تاريخ معين
 * @param date - التاريخ المراد حساب الوقت المنقضي منه
 * @returns نص يوضح الوقت المنقضي
 */
export function getTimeAgo(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - dateObj.getTime()) / 1000
    );

    if (diffInSeconds < 60) {
      return 'منذ لحظات';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `منذ ${diffInMinutes} دقيقة`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `منذ ${diffInHours} ساعة`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `منذ ${diffInDays} يوم`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `منذ ${diffInMonths} شهر`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return `منذ ${diffInYears} سنة`;
  } catch (error) {
      if (import.meta.env.DEV) {
      console.error('خطأ في حساب الوقت المنقضي:', error);
    }
    return 'وقت غير محدد';
  }
}

/**
 * التحقق من صحة التاريخ
 * @param date - التاريخ المراد التحقق منه
 * @returns true إذا كان التاريخ صحيح
 */
export function isValidDate(date: string | Date): boolean {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return !isNaN(dateObj.getTime());
  } catch {
    return false;
  }
}

/**
 * إضافة أيام إلى تاريخ معين
 * @param date - التاريخ الأساسي
 * @param days - عدد الأيام المراد إضافتها
 * @returns التاريخ الجديد
 */
export function addDays(date: string | Date, days: number): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  dateObj.setDate(dateObj.getDate() + days);
  return dateObj;
}

/**
 * إضافة أشهر إلى تاريخ معين
 * @param date - التاريخ الأساسي
 * @param months - عدد الأشهر المراد إضافتها
 * @returns التاريخ الجديد
 */
export function addMonths(date: string | Date, months: number): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  dateObj.setMonth(dateObj.getMonth() + months);
  return dateObj;
}

/**
 * مقارنة تاريخين
 * @param date1 - التاريخ الأول
 * @param date2 - التاريخ الثاني
 * @returns -1 إذا كان date1 قبل date2، 0 إذا كانا متساويين، 1 إذا كان date1 بعد date2
 */
export function compareDates(
  date1: string | Date,
  date2: string | Date
): number {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;

  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

/**
 * الحصول على بداية ونهاية الشهر
 * @param date - التاريخ المرجعي
 * @returns كائن يحتوي على بداية ونهاية الشهر
 */
export function getMonthRange(date: string | Date): { start: Date; end: Date } {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);

  const start = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
  const end = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0);

  return { start, end };
}
