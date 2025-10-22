/**
 * دوال تنسيق الأرقام الموحدة
 * لحل مشكلة Hydration Error
 */

/**
 * تنسيق الأرقام مع فواصل الآلاف
 * @param num - الرقم المراد تنسيقه
 * @returns الرقم المنسق
 */
export function formatNumber(num: number): string {
  // استخدام تنسيق ثابت لتجنب مشاكل Hydration
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * تنسيق العملة
 * @param amount - المبلغ
 * @param currency - العملة (افتراضي: ريال)
 * @returns المبلغ المنسق
 */
export function formatCurrency(amount: number, currency: string = 'ر.ع'): string {
  return `${formatNumber(amount)} ${currency}`;
}

/**
 * تنسيق التاريخ
 * @param date - التاريخ
 * @returns التاريخ المنسق
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(dateObj);
}

/**
 * تنسيق التاريخ والوقت
 * @param date - التاريخ
 * @returns التاريخ والوقت المنسق
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
}

