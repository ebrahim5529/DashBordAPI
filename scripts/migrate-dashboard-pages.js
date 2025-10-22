/**
 * Script لنقل وتحويل صفحات Dashboard من Next.js إلى React
 * يقوم بإزالة 'use client', async functions, و metadata exports
 */

const fs = require('fs');
const path = require('path');

// قائمة الصفحات المطلوب نقلها
const dashboardPages = [
  'access-control',
  'active-contracts',
  'activity-log',
  'attendance',
  'audit-trail',
  'cancelled-contracts',
  'contract-management',
  'customer-claims',
  'customer-contracts',
  'customer-management',
  'customer-reports',
  'dashboard-interactive',
  'delivery-order-details',
  'delivery-orders',
  'delivery-orders-details',
  'delivery-receipt',
  'departments',
  'electronic-signature',
  'employee-management',
  'expired-contracts',
  'financial-reports',
  'incentives',
  'installment-plans',
  'installment-reports',
  'installment-tracking',
  'inventory-status',
  'invoices',
  'late-payments',
  'leaves',
  'login-monitoring',
  'main-dashboard',
  'operations-reports',
  'payment-management',
  'payment-methods',
  'payment-schedules',
  'permission-groups',
  'permissions',
  'profile',
  'purchase-equipment',
  'purchase-management',
  'purchases-list',
  'return-inspection',
  'salaries',
  'security',
  'security-settings',
  'settings',
  'shipping-tracking',
  'supplier-invoices',
  'supplier-management',
  'supplier-purchases',
  'user-roles',
];

// التحويل من kebab-case إلى PascalCase
function toPascalCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

// إنشاء المجلد إذا لم يكن موجوداً
const pagesDir = path.join(__dirname, '../src/pages/dashboard');
if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
}

// معالجة كل صفحة
dashboardPages.forEach(pageName => {
  const sourcePath = path.join(__dirname, `../src/app/dashboard/${pageName}/page.tsx`);
  const componentName = toPascalCase(pageName);
  const targetPath = path.join(pagesDir, `${componentName}.tsx`);

  try {
    // قراءة الملف الأصلي
    let content = fs.readFileSync(sourcePath, 'utf8');

    // إزالة 'use client'
    content = content.replace(/'use client';?\n\n?/g, '');
    content = content.replace(/"use client";?\n\n?/g, '');

    // إزالة async من export default
    content = content.replace(/export default async function/g, 'export default function');

    // إزالة await من getDashboardData() أو أي function calls
    content = content.replace(/const (\w+) = await get\w+\(\);?/g, 'const $1 = get$1();');
    content = content.replace(/await new Promise/g, 'new Promise');

    // إزالة export const metadata
    content = content.replace(/export const metadata = \{[\s\S]*?\};?\n\n?/g, '');

    // كتابة الملف الجديد
    fs.writeFileSync(targetPath, content);
    console.log(`✅ تم تحويل: ${pageName} -> ${componentName}.tsx`);
  } catch (error) {
    console.error(`❌ خطأ في تحويل ${pageName}:`, error.message);
  }
});

console.log('\n✨ تم الانتهاء من نقل صفحات Dashboard!');

