/**
 * بيانات وهمية لنموذج العقد
 */

import { Customer, EquipmentItem } from '@/lib/types/contract';

// قائمة العملاء
export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'شركة البناء الحديث',
    email: 'info@modernbuilding.com',
    phone: '+968 1234 5678',
    address: 'مسقط، سلطنة عمان'
  },
  {
    id: '2',
    name: 'مؤسسة المشاريع الكبرى',
    email: 'projects@majorprojects.com',
    phone: '+968 2345 6789',
    address: 'صلالة، سلطنة عمان'
  },
  {
    id: '3',
    name: 'شركة الإنشاءات المتقدمة',
    email: 'construction@advanced.com',
    phone: '+968 3456 7890',
    address: 'نزوى، سلطنة عمان'
  },
  {
    id: '4',
    name: 'مؤسسة التطوير العقاري',
    email: 'development@realestate.com',
    phone: '+968 4567 8901',
    address: 'صور، سلطنة عمان'
  },
  {
    id: '5',
    name: 'شركة المقاولات العامة',
    email: 'contracting@general.com',
    phone: '+968 5678 9012',
    address: 'البريمي، سلطنة عمان'
  }
];

// قائمة المعدات
export const mockEquipment: EquipmentItem[] = [
  {
    id: '1',
    code: 'EXC-001',
    description: 'حفار هيدروليكي 20 طن',
    dailyRate: 150,
    monthlyRate: 3500,
    available: true
  },
  {
    id: '2',
    code: 'CRN-002',
    description: 'رافعة برجية 50 طن',
    dailyRate: 200,
    monthlyRate: 5000,
    available: true
  },
  {
    id: '3',
    code: 'BLD-003',
    description: 'خلاطة خرسانة 1 متر مكعب',
    dailyRate: 80,
    monthlyRate: 2000,
    available: true
  },
  {
    id: '4',
    code: 'TRK-004',
    description: 'شاحنة نقل خرسانة 8 متر مكعب',
    dailyRate: 120,
    monthlyRate: 3000,
    available: true
  },
  {
    id: '5',
    code: 'GEN-005',
    description: 'مولد كهرباء 100 كيلو وات',
    dailyRate: 60,
    monthlyRate: 1500,
    available: true
  },
  {
    id: '6',
    code: 'COM-006',
    description: 'كمبريسر هواء 200 لتر',
    dailyRate: 40,
    monthlyRate: 1000,
    available: true
  },
  {
    id: '7',
    code: 'WEL-007',
    description: 'ماكينة لحام كهربائية',
    dailyRate: 30,
    monthlyRate: 750,
    available: true
  },
  {
    id: '8',
    code: 'LFT-008',
    description: 'رافعة شوكية 3 طن',
    dailyRate: 100,
    monthlyRate: 2500,
    available: true
  }
];

// قائمة البنوك
export const mockBanks = [
  'بنك مسقط',
  'البنك الوطني العماني',
  'بنك عمان العربي',
  'بنك الإمارات دبي الوطني',
  'بنك HSBC عمان',
  'بنك ستاندرد تشارترد',
  'بنك المشرق',
  'بنك أبوظبي الإسلامي'
];

// قائمة طرق الدفع
export const paymentMethods = [
  { value: 'cash', label: 'نقداً' },
  { value: 'check', label: 'شيكات' },
  { value: 'credit_card', label: 'بطاقة ائتمان' }
];

// قائمة أنواع العقود
export const contractTypes = [
  'تأجير',
  'شراء',
  'صيانة',
  'تركيب'
];
