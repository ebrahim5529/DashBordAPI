import React, { useMemo, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// import { useNavigation } from '@/lib/hooks/useNavigation'; // Commented out for linter fix

interface DashboardRouterProps {
  activeSection: string;
}

/**
 * مكون DashboardRouter المحسن - يربط بين الـ Sidebar والصفحات
 * يتعامل مع التنقل بين صفحات Dashboard المختلفة بأفضل أداء
 */
export function DashboardRouter({ activeSection }: DashboardRouterProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const lastActiveSection = useRef<string>(activeSection);
  // const { navigateTo, prefetchRoute } = useNavigation(); // سيتم استخدامه لاحقاً

  // ربط معرفات الـ Sidebar بالمسارات الفعلية
  const routeMap: Record<string, string> = useMemo(() => ({
    // الرئيسية
    'main-dashboard': '/dashboard',
    
    // لوحة التحكم والتقارير
    'dashboard-interactive': '/dashboard/dashboard-interactive',
    'financial-reports': '/dashboard/financial-reports',
    'operations-reports': '/dashboard/operations-reports',
    'customer-reports': '/dashboard/customer-reports',

    // قائمة العملاء
    'customer-management': '/dashboard/customer-management',
    'customer-contracts': '/dashboard/customer-contracts',
    'customer-claims': '/dashboard/customer-claims',

    // قائمة الموردين
    'supplier-management': '/dashboard/supplier-management',
    'supplier-invoices': '/dashboard/supplier-invoices',
    'supplier-purchases': '/dashboard/supplier-purchases',

    // إدارة المخزون
    'inventory-status': '/dashboard/inventory-status',
    'purchase-equipment': '/dashboard/purchase-equipment',
    'purchases-list': '/dashboard/purchases-list',

    // قائمة العقود
    'contract-management': '/dashboard/contract-management',
    'active-contracts': '/dashboard/active-contracts',
    'expired-contracts': '/dashboard/expired-contracts',
    'cancelled-contracts': '/dashboard/cancelled-contracts',

    // التوقيع الإلكتروني
    'electronic-signature': '/dashboard/electronic-signature',

    // قائمة التشغيل والنقليات
    'delivery-orders': '/dashboard/delivery-orders',
    'delivery-orders-details': '/dashboard/delivery-orders-details',
    'shipping-tracking': '/dashboard/shipping-tracking',
    'delivery-receipt': '/dashboard/delivery-receipt',
    'return-inspection': '/dashboard/return-inspection',

    // قائمة المالية
    'payment-management': '/dashboard/payment-management',
    'purchase-management': '/dashboard/purchase-management',
    invoices: '/dashboard/invoices',

    // قائمة الموظفين
    'employee-management': '/dashboard/employee-management',
    salaries: '/dashboard/salaries',
    incentives: '/dashboard/incentives',
    attendance: '/dashboard/attendance',
    departments: '/dashboard/departments',
    leaves: '/dashboard/leaves',

    // إدارة الصلاحيات
    'user-roles': '/dashboard/user-roles',
    'permission-groups': '/dashboard/permission-groups',
    'access-control': '/dashboard/access-control',
    'security-settings': '/dashboard/security-settings',
    'audit-trail': '/dashboard/audit-trail',
    'login-monitoring': '/dashboard/login-monitoring',

    // إدارة المدفوعات
    'installment-plans': '/dashboard/installment-plans',
    'payment-schedules': '/dashboard/payment-schedules',
    'installment-tracking': '/dashboard/installment-tracking',
    'late-payments': '/dashboard/late-payments',
    'payment-methods': '/dashboard/payment-methods',
    'installment-reports': '/dashboard/installment-reports',

  }), []);

  // دالة محسنة للتنقل السريع
  const navigateToRoute = useCallback((route: string) => {
    // React Router doesn't have prefetch
    // التنقل السريع بدون إعادة تحميل
    navigate(route);
  }, [navigate]);

  // تبسيط التنقل - السماح بالتنقل المباشر
  React.useEffect(() => {
    // تجنب التنقل إذا لم يتغير activeSection
    if (lastActiveSection.current === activeSection) {
      return;
    }
    
    const route = routeMap[activeSection];
    lastActiveSection.current = activeSection;
    
    // التنقل المباشر إذا كان المسار مختلف
    if (route && route !== pathname) {
      navigateToRoute(route);
    }
  }, [activeSection, pathname, routeMap, navigateToRoute]);

  return null;
}

export default DashboardRouter;
