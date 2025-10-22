/**
 * أدوات تنسيق التواريخ لتجنب مشاكل التهيئة (Hydration)
 */

/**
 * تنسيق التاريخ بشكل متسق بين الخادم والعميل
 * @param date - التاريخ المراد تنسيقه
 * @param options - خيارات التنسيق
 * @returns التاريخ المنسق
 */
export function formatDateSafe(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }
): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // التأكد من صحة التاريخ
    if (isNaN(dateObj.getTime())) {
      return 'تاريخ غير صحيح';
    }

    // استخدام تنسيق ثابت لتجنب اختلافات التهيئة
    return dateObj.toLocaleDateString('ar-SA', {
      ...options,
      // إضافة هذه الخيارات لضمان التنسيق المتسق
      numberingSystem: 'arab',
    });
  } catch (error) {
    console.error('خطأ في تنسيق التاريخ:', error);
    return 'تاريخ غير صحيح';
  }
}

/**
 * تنسيق التاريخ مع الوقت
 * @param date - التاريخ المراد تنسيقه
 * @returns التاريخ والوقت المنسق
 */
export function formatDateTimeSafe(date: Date | string): string {
  return formatDateSafe(date, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * تنسيق التاريخ فقط
 * @param date - التاريخ المراد تنسيقه
 * @returns التاريخ المنسق
 */
export function formatDateOnlySafe(date: Date | string): string {
  return formatDateSafe(date, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

/**
 * تنسيق التاريخ مع اليوم
 * @param date - التاريخ المراد تنسيقه
 * @returns التاريخ مع اليوم المنسق
 */
export function formatDateWithDaySafe(date: Date | string): string {
  return formatDateSafe(date, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
}

/**
 * حساب الفرق بين التاريخين بالأيام
 * @param date1 - التاريخ الأول
 * @param date2 - التاريخ الثاني
 * @returns عدد الأيام
 */
export function getDaysDifference(date1: Date | string, date2: Date | string): number {
  try {
    const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
    const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
    
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      return 0;
    }
    
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch (error) {
    console.error('خطأ في حساب الفرق بين التواريخ:', error);
    return 0;
  }
}

/**
 * التحقق من صحة التاريخ
 * @param date - التاريخ المراد التحقق منه
 * @returns true إذا كان التاريخ صحيحاً
 */
export function isValidDate(date: Date | string): boolean {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return !isNaN(dateObj.getTime());
  } catch {
    return false;
  }
}

/**
 * تحويل التاريخ إلى تنسيق ISO بدون مشاكل التهيئة
 * @param date - التاريخ المراد تحويله
 * @returns التاريخ بتنسيق ISO
 */
export function toISOSafe(date: Date | string): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    
    return dateObj.toISOString();
  } catch (error) {
    console.error('خطأ في تحويل التاريخ إلى ISO:', error);
    return '';
  }
}
