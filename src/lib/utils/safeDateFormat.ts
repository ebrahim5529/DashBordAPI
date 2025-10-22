/**
 * دالة تنسيق التاريخ الآمنة لتجنب مشاكل hydration
 */

/**
 * تنسيق التاريخ بطريقة آمنة للخادم والعميل
 */
export function safeFormatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'تاريخ غير صحيح';
  }

  // استخدام نفس التنسيق على الخادم والعميل لتجنب مشاكل hydration
  try {
    return dateObj.toLocaleDateString('en-GB', {
      timeZone: 'Asia/Muscat',
      ...options
    });
  } catch {
    // في حالة الخطأ، استخدم تنسيق بسيط
    return dateObj.toISOString().split('T')[0];
  }
}

/**
 * تنسيق الوقت بطريقة آمنة للخادم والعميل
 */
export function safeFormatTime(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'وقت غير صحيح';
  }

  // استخدام نفس التنسيق على الخادم والعميل
  try {
    return dateObj.toLocaleTimeString('en-GB', {
      timeZone: 'Asia/Muscat',
      ...options
    });
  } catch {
    // في حالة الخطأ، استخدم تنسيق بسيط
    return dateObj.toTimeString().split(' ')[0];
  }
}

/**
 * تنسيق التاريخ والوقت بطريقة آمنة للخادم والعميل
 */
export function safeFormatDateTime(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'تاريخ غير صحيح';
  }

  // استخدام نفس التنسيق على الخادم والعميل
  try {
    return dateObj.toLocaleString('en-GB', {
      timeZone: 'Asia/Muscat',
      ...options
    });
  } catch {
    // في حالة الخطأ، استخدم تنسيق بسيط
    return dateObj.toLocaleString();
  }
}
