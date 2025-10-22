/**
 * Hook محسن للتنقل السريع
 * يوفر أداءً أفضل وتنقل أسرع عبر جميع صفحات النظام
 */

import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback, useRef, useMemo, useTransition } from 'react';

interface NavigationHook {
  navigateTo: (route: string) => void;
  prefetchRoute: (route: string) => void;
  isActiveRoute: (route: string) => boolean;
  getCurrentSection: () => string;
}

export function useNavigation(): NavigationHook {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const lastRoute = useRef<string>(pathname);
  const [, startTransition] = useTransition();

  // خريطة المسارات المحسنة
  const routeMap = useMemo(() => ({
    // الرئيسية
    'main-dashboard': '/dashboard',
    
    // لوحة التحكم والتقارير
    'dashboard-interactive': '/dashboard/dashboard-interactive',
    'dashboard-financial-reports': '/dashboard/financial-reports',
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
    'shipping-tracking': '/dashboard/shipping-tracking',
    'delivery-receipt': '/dashboard/delivery-receipt',
    'return-inspection': '/dashboard/return-inspection',

    // قائمة المالية
    'payment-management': '/dashboard/payment-management',
    'purchase-management': '/dashboard/purchase-management',
    'invoices': '/dashboard/invoices',
    'financial-reports': '/dashboard/financial-reports',

    // قائمة الموظفين
    'employee-management': '/dashboard/employee-management',
    'salaries': '/dashboard/salaries',
    'incentives': '/dashboard/incentives',
    'attendance': '/dashboard/attendance',
    'departments': '/dashboard/departments',
    'leaves': '/dashboard/leaves',

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

  // خريطة عكسية للبحث السريع
  const pathToSectionMap = useMemo(() => {
    const map: Record<string, string> = {};
    Object.entries(routeMap).forEach(([section, path]) => {
      map[path] = section;
    });
    return map;
  }, [routeMap]);

  // دالة التنقل السريع مع View Transitions
  const navigateTo = useCallback((route: string) => {
    if (lastRoute.current === route) return;
    
    // استخدام View Transitions API إذا كان متاحاً
    if ('startViewTransition' in document && (document as any).startViewTransition) {
      (document as any).startViewTransition(() => {
        startTransition(() => {
          navigate(route);
          lastRoute.current = route;
        });
      });
    } else {
      // fallback للمتصفحات القديمة
      startTransition(() => {
        navigate(route);
        lastRoute.current = route;
      });
    }
  }, [navigate, startTransition]);

  // دالة prefetch (لا تفعل شيئاً في React Router)
  const prefetchRoute = useCallback((_route: string) => {
    // React Router doesn't have prefetch
    // This is a no-op for compatibility
  }, []);

  // دالة التحقق من المسار النشط
  const isActiveRoute = useCallback((route: string) => {
    return pathname === route;
  }, [pathname]);

  // دالة الحصول على القسم الحالي
  const getCurrentSection = useCallback(() => {
    // التحقق من المسارات الديناميكية أولاً
    if (pathname.startsWith('/dashboard/contract-details/')) {
      return 'contract-management';
    }
    
    // البحث في الخريطة العكسية
    return pathToSectionMap[pathname] || 'main-dashboard';
  }, [pathname, pathToSectionMap]);

  return {
    navigateTo,
    prefetchRoute,
    isActiveRoute,
    getCurrentSection,
  };
}

export default useNavigation;
