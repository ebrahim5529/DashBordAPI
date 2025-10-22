/**
 * ثوابت خاصة بدولة عمان
 * تحتوي على جميع المعلومات المحلية المطلوبة للتطبيق
 */

// معلومات العملة
export const CURRENCY = {
  CODE: 'OMR',
  SYMBOL: 'ر.ع',
  NAME: 'ريال عماني',
  NAME_ENGLISH: 'Omani Rial',
  DECIMAL_PLACES: 3,
} as const;

// معلومات الدولة
export const COUNTRY = {
  NAME: 'سلطنة عمان',
  NAME_ENGLISH: 'Sultanate of Oman',
  CODE: 'OM',
  PHONE_CODE: '+968',
  TIMEZONE: 'Asia/Muscat',
  LOCALE: 'ar-OM',
} as const;

// المدن الرئيسية
export const CITIES = {
  MUSCAT: 'مسقط',
  SALALAH: 'صلالة',
  NIZWA: 'نزوى',
  SUR: 'صور',
  BURAIMI: 'البريمي',
  SOHAR: 'صحار',
  IBRAA: 'عبري',
  RUSTAQ: 'الرستاق',
  BAHLA: 'بهلا',
  BIDBID: 'بدبد',
} as const;

// المناطق الإدارية
export const GOVERNORATES = {
  MUSCAT: 'محافظة مسقط',
  DHOFAR: 'محافظة ظفار',
  NORTH_AL_BATINAH: 'محافظة شمال الباطنة',
  SOUTH_AL_BATINAH: 'محافظة جنوب الباطنة',
  AL_DHAHIRAH: 'محافظة الظاهرة',
  AL_DHAKHLIYAH: 'محافظة الداخلية',
  AL_SHARQIYAH_NORTH: 'محافظة شمال الشرقية',
  AL_SHARQIYAH_SOUTH: 'محافظة جنوب الشرقية',
  AL_WUSTA: 'محافظة الوسطى',
  MUSANDAM: 'محافظة مسندم',
  AL_BURAIMI: 'محافظة البريمي',
} as const;

// معلومات الاتصال
export const CONTACT_INFO = {
  PHONE_FORMAT: '+968 XXXX XXXX',
  MOBILE_FORMAT: '+968 9X XXX XXX',
  EMAIL_DOMAIN: '.om',
  POSTAL_CODE_FORMAT: 'XXX',
} as const;

// معلومات العمل
export const BUSINESS_INFO = {
  WORKING_DAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
  WEEKEND: ['الجمعة', 'السبت'],
  WORKING_HOURS: {
    START: '08:00',
    END: '17:00',
  },
  TIMEZONE_OFFSET: '+04:00',
} as const;

// معلومات الضرائب
export const TAX_INFO = {
  VAT_RATE: 5, // نسبة ضريبة القيمة المضافة
  VAT_NAME: 'ضريبة القيمة المضافة',
  TAX_NUMBER_FORMAT: 'OM-XXXX-XXXX-XXXX',
} as const;

// معلومات البنوك الرئيسية
export const BANKS = {
  CENTRAL_BANK: 'البنك المركزي العماني',
  BANK_MUSCAT: 'بنك مسقط',
  NATIONAL_BANK: 'البنك الوطني العماني',
  HSBC: 'بنك إتش إس بي سي',
  STANDARD_CHARTERED: 'بنك ستاندرد تشارترد',
  SOHAR_INTERNATIONAL: 'بنك صحار الدولي',
} as const;

// معلومات الشركات المحلية
export const LOCAL_COMPANIES = {
  CONSTRUCTION: [
    'شركة البناء الحديثة',
    'مؤسسة الإنشاءات المتقدمة',
    'شركة المقاولات الكبرى',
    'شركة الإنشاءات الشرقية',
    'مؤسسة البناء المتطور',
    'شركة المشاريع الكبرى',
    'شركة البناء الشمالية',
    'مؤسسة الإنشاءات الجنوبية',
  ],
  LOCATIONS: [
    'مسقط',
    'صلالة',
    'نزوى',
    'صور',
    'البريمي',
    'صحار',
    'عبري',
    'الرستاق',
  ],
} as const;

// معلومات العطل الرسمية
export const HOLIDAYS = {
  NATIONAL_DAY: '18 نوفمبر',
  SULTAN_BIRTHDAY: '18 نوفمبر',
  ISLAMIC_NEW_YEAR: 'متغير حسب التقويم الهجري',
  PROPHET_BIRTHDAY: 'متغير حسب التقويم الهجري',
  ASCENSION_DAY: 'متغير حسب التقويم الهجري',
  EID_AL_FITR: 'متغير حسب التقويم الهجري',
  EID_AL_ADHA: 'متغير حسب التقويم الهجري',
} as const;

// معلومات التطبيق المحلية
export const APP_LOCALIZATION = {
  COMPANY_NAME: 'أسهل - عمان',
  COMPANY_DESCRIPTION: 'نظام إدارة العقود والمخزون في سلطنة عمان',
  ADDRESS: 'مسقط، سلطنة عمان',
  SUPPORT_EMAIL: 'support@easier.om',
  SUPPORT_PHONE: '+968 2XXX XXXX',
} as const;
