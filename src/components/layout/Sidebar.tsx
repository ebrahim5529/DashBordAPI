import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { MenuItem } from './MenuItem';
// import { useNavigation } from '@/lib/hooks/useNavigation'; // Commented out for linter fix
import {
  LayoutDashboard,
  FileText,
  Package,
  Users,
  CreditCard,
  BarChart3,
  Menu,
  X,
  LogOut,
  UserCheck,
  ClipboardList,
  Truck,
  DollarSign,
  UserCog,
  Activity,
  ShoppingCart,
  Receipt,
  Clock,
  TrendingUp,
  Shield,
  History,
  Key,
  Calendar,
  Calculator,
  AlertCircle,
  Settings,
  BarChart,
  PenTool,
  Building2,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MenuItemType {
  id: string;
  label: string;
  icon: any;
  href?: string;
  children?: MenuItemType[];
}

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({
  onClose,
}: SidebarProps) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  
  // حساب activeSection من pathname مباشرة
  const activeSection = useMemo(() => {
    const pathname = location.pathname;
    
    // المسارات الديناميكية
    if (pathname.startsWith('/dashboard/contract-details/')) return 'contract-management';
    if (pathname.startsWith('/dashboard/delivery-order-details/')) return 'delivery-orders';
    
    // المسارات العادية
    if (pathname === '/dashboard' || pathname === '/dashboard/') return 'main-dashboard';
    
    // استخراج section من pathname
    const parts = pathname.split('/');
    return parts[2] || 'main-dashboard';
  }, [location.pathname]);
  // const { getCurrentSection } = useNavigation(); // سيتم استخدامه لاحقاً

  // تحسين: دالة محسنة لإدارة القوائم المفتوحة
  const toggleMenu = useCallback((menuId: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  }, []);

  // تحسين: دالة محسنة للتنقل السريع (سيتم استخدامها في MenuItem)
  // const handleSectionChange = useCallback((sectionId: string) => {
  //   onSectionChange(sectionId);
  //   if (onClose && window.innerWidth < 768) {
  //     onClose();
  //   }
  // }, [onSectionChange, onClose]);

  // تحسين: دالة محسنة لإدارة الشريط الجانبي
  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  // تحسين: Auto-close sidebar مع debounce
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
      if (window.innerWidth >= 768 && onClose) {
        // Don't auto-close on desktop
        return;
      }
      }, 150); // debounce
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [onClose]);

  // تحسين: استخدام useMemo لتحسين الأداء
  const menuItems: MenuItemType[] = useMemo(() => [
    {
      id: 'main-dashboard',
      label: 'الرئيسية',
      icon: LayoutDashboard,
      href: '/dashboard',
    },
    {
      id: 'dashboard',
      label: 'لوحة التحكم والتقارير',
      icon: BarChart3,
      children: [
        {
          id: 'dashboard-interactive',
          label: 'لوحة التحكم التفاعلية',
          icon: Activity,
        },
        {
          id: 'financial-reports',
          label: 'التقارير المالية',
          icon: TrendingUp,
        },
        {
          id: 'operations-reports',
          label: 'تقارير التشغيل والمخزون',
          icon: Package,
        },
        { id: 'customer-reports', label: 'تقارير العملاء', icon: Users },
      ],
    },
    {
      id: 'customers',
      label: 'إدارة العملاء',
      icon: Users,
      children: [
        {
          id: 'customer-management',
          label: 'إدارة بيانات العملاء',
          icon: UserCheck,
        },
        {
          id: 'customer-contracts',
          label: 'سجل العقود الخاصة بالعملاء',
          icon: FileText,
        },
        {
          id: 'customer-claims',
          label: 'إدارة المطالبات',
          icon: ClipboardList,
        },
      ],
    },
    {
      id: 'suppliers',
      label: 'إدارة الموردين',
      icon: Truck,
      children: [
        {
          id: 'supplier-management',
          label: 'إدارة بيانات الموردين',
          icon: UserCheck,
        },
        {
          id: 'supplier-invoices',
          label: 'فواتير الموردين',
          icon: Receipt,
        },
        {
          id: 'supplier-purchases',
          label: 'مشتريات الموردين',
          icon: ShoppingCart,
        },
      ],
    },
    {
      id: 'inventory',
      label: 'إدارة المخزون',
      icon: Package,
      children: [
        { id: 'inventory-status', label: 'حالة المخزون', icon: Package },
        {
          id: 'purchase-equipment',
          label: 'شراء معدات جديدة',
          icon: ShoppingCart,
        },
        { id: 'purchases-list', label: 'إدارة المشتريات', icon: Receipt },
      ],
    },
    {
      id: 'contracts',
      label: 'إدارة العقود والاتفاقيات',
      icon: FileText,
      children: [
        {
          id: 'contract-management',
          label: 'إدارة العقود والاتفاقيات',
          icon: FileText,
        },
        { id: 'active-contracts', label: 'عقود نشطة', icon: Activity },
        { id: 'expired-contracts', label: 'عقود منتهية', icon: Clock },
        { id: 'cancelled-contracts', label: 'عقود ملغاة', icon: X },
      ],
    },
    {
      id: 'operations',
      label: 'إدارة التشغيل والنقليات',
      icon: Truck,
      children: [
        { id: 'delivery-orders', label: 'إدارة طلبات التوصيل', icon: Truck },
        { id: 'delivery-orders-details', label: 'تفاصيل أوامر التوصيل', icon: Eye },
        { id: 'shipping-tracking', label: 'تتبع الشحن', icon: Activity },
        { id: 'delivery-receipt', label: 'إيصال التسليم', icon: Receipt },
        {
          id: 'return-inspection',
          label: 'فحص الاسترجاع',
          icon: ClipboardList,
        },
      ],
    },
    {
      id: 'financial',
      label: 'إدارة المالية',
      icon: DollarSign,
      children: [
        {
          id: 'payment-management',
          label: 'إدارة المعاملات المالية',
          icon: CreditCard,
        },
        {
          id: 'purchase-management',
          label: 'إدارة عمليات الشراء',
          icon: ShoppingCart,
        },
        { id: 'invoices', label: 'الفواتير', icon: Receipt },
        {
          id: 'financial-reports',
          label: 'التقارير المالية',
          icon: TrendingUp,
        },
      ],
    },
    {
      id: 'employees',
      label: 'إدارة الموظفين',
      icon: UserCog,
      children: [
        {
          id: 'employee-management',
          label: 'إدارة بيانات الموظفين',
          icon: UserCheck,
        },
        { id: 'salaries', label: 'الرواتب', icon: DollarSign },
        { id: 'incentives', label: 'الحوافز', icon: TrendingUp },
        { id: 'attendance', label: 'الحضور والانصراف', icon: Clock },
        { id: 'departments', label: 'الأقسام', icon: Building2 },
        { id: 'leaves', label: 'الإجازات', icon: Calendar },
      ],
    },
    
    {
      id: 'permissions-management',
      label: 'إدارة الصلاحيات',
      icon: Key,
      children: [
        { id: 'user-roles', label: 'أدوار المستخدمين', icon: UserCog },
        { id: 'permission-groups', label: 'مجموعات الصلاحيات', icon: Shield },
        { id: 'access-control', label: 'التحكم في الوصول', icon: Key },
        { id: 'security-settings', label: 'إعدادات الأمان', icon: Settings },
        { id: 'audit-trail', label: 'سجل التدقيق', icon: History },
        {
          id: 'login-monitoring',
          label: 'مراقبة تسجيل الدخول',
          icon: Activity,
        },
      ],
    },
    {
      id: 'installments-management',
      label: 'إدارة المدفوعات',
      icon: Calculator,
      children: [
        { id: 'installment-plans', label: 'إدارة المدفوعات ', icon: Calendar },
        { id: 'payment-schedules', label: 'جداول الدفع', icon: Clock },
        { id: 'installment-tracking', label: 'تتبع المدفوعات', icon: TrendingUp },
        { id: 'late-payments', label: 'المدفوعات المتأخرة', icon: AlertCircle },
        { id: 'payment-methods', label: 'طرق الدفع', icon: CreditCard },
        { id: 'installment-reports', label: 'تقارير المدفوعات', icon: BarChart },
      ],
    },
    {
      id: 'settings',
      label: 'الإعدادات',
      icon: Settings,
      children: [
        { 
          id: 'electronic-signature', 
          label: 'التوقيع الإلكتروني', 
          icon: PenTool,
          href: '/dashboard/electronic-signature',
        },
      ],
    },
  ], []); // تحسين: استخدام useMemo

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300'
        onClick={onClose}
      />

      <div
        className={cn(
          'bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 transition-all duration-500 ease-in-out flex flex-col h-full',
          isCollapsed ? 'w-14 sm:w-16' : 'w-72 sm:w-80 md:w-64 lg:w-72 xl:w-80',
          'lg:relative lg:translate-x-0 lg:shadow-none',
          'fixed inset-y-0 right-0 z-50 shadow-2xl'
        )}
      >
        {/* Header */}
        <div className='p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700'>
          <div className='flex items-center justify-between'>
            {!isCollapsed && (
              <div className='flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse'>
                <div className='w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center'>
                  <span className='text-white font-bold text-sm'>أ</span>
                </div>
                <div>
                  <h2 className='font-bold text-base sm:text-lg text-gray-900 dark:text-white'>
                    أسهل
                  </h2>
                  <p className='text-xs text-gray-500 dark:text-gray-400 hidden sm:block'>
                    إدارة السقالات
                  </p>
                </div>
              </div>
            )}
            <div className='flex items-center space-x-1 sm:space-x-2 rtl:space-x-reverse'>
              {/* Close button for mobile */}
              <Button
                variant='ghost'
                size='sm'
                onClick={onClose}
                className='p-1.5 sm:p-2 md:hidden h-7 w-7 sm:h-8 sm:w-8'
              >
                <X className='h-4 w-4 sm:h-5 sm:w-5' />
              </Button>

              {/* Collapse button for desktop - محسن */}
              <Button
                variant='ghost'
                size='sm'
                onClick={handleToggleCollapse}
                className='p-1.5 sm:p-2 hidden md:block h-7 w-7 sm:h-8 sm:w-8'
              >
                {isCollapsed ? (
                  <Menu className='h-4 w-4 sm:h-5 sm:w-5' />
                ) : (
                  <X className='h-4 w-4 sm:h-5 sm:w-5' />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation المحسن */}
        <nav className='flex-1 p-3 sm:p-4 space-y-1 overflow-y-auto'>
          {menuItems.map(item => (
            <MenuItem
              key={item.id}
              id={item.id}
              label={item.label}
              icon={item.icon}
              href={item.href}
              isExpanded={expandedMenus.includes(item.id)}
              onToggle={toggleMenu}
              isActive={activeSection === item.id}
              isCollapsed={isCollapsed}
              level={0}
              onClose={onClose}
            >
              {item.children}
            </MenuItem>
          ))}
        </nav>

        {/* Footer */}
        <div className='p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 space-y-2 sm:space-y-3'>
          {/* Theme Toggle */}
          <div className='flex justify-center'>
            <div className='scale-90 sm:scale-100'>
              <ThemeToggle />
            </div>
          </div>
          
          {/* Logout Button */}
          <Button
            variant='ghost'
            onClick={() => {
              // Close sidebar on mobile after logout action
              if (onClose && window.innerWidth < 768) {
                onClose();
              }
              // مسح بيانات المستخدم من التخزين المحلي
              if (typeof window !== 'undefined') {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
              }
              // إعادة التوجيه إلى صفحة تسجيل الدخول
              window.location.href = '/login';
            }}
            className='w-full justify-start space-x-2 sm:space-x-3 rtl:space-x-reverse text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800 h-9 sm:h-10 transition-all duration-200 hover:border-red-300 dark:hover:border-red-700'
          >
            <LogOut className='h-4 w-4 sm:h-5 sm:w-5' />
            {!isCollapsed && <span className='text-sm sm:text-base'>تسجيل الخروج</span>}
          </Button>
        </div>
      </div>
    </>
  );
}
