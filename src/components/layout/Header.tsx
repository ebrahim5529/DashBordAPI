import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/components/providers/theme.provider';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, User, Moon, Sun, Menu, X, Plus, ChevronDown, FileText, Users, Settings, LogOut, UserCircle, Shield, Monitor, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export function Header({
  onToggleSidebar,
  isSidebarOpen,
}: HeaderProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Ensure component is mounted before showing theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  // Get theme icon
  const getThemeIcon = () => {
    if (!mounted) return <Monitor className="h-5 w-5" />;
    
    switch (theme) {
      case 'light':
        return <Sun className="h-5 w-5 text-yellow-500" />;
      case 'dark':
        return <Moon className="h-5 w-5 text-blue-400" />;
      default:
        return <Monitor className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get theme tooltip
  const getThemeTooltip = () => {
    if (!mounted) return 'الوضع المظلم';
    
    switch (theme) {
      case 'light':
        return 'الوضع الفاتح';
      case 'dark':
        return 'الوضع الداكن';
      default:
        return 'وضع النظام';
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className='bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4 sticky top-0 z-30'>
      <div className='flex items-center justify-between'>
        {/* Left side - Menu toggle and search */}
        <div className='flex items-center space-x-2 sm:space-x-3 lg:space-x-4 rtl:space-x-reverse'>
          <Button
            variant='ghost'
            size='sm'
            onClick={onToggleSidebar}
            className='p-2'
          >
            {isSidebarOpen ? (
              <X className='h-5 w-5' />
            ) : (
              <Menu className='h-5 w-5' />
            )}
          </Button>

          <div className='relative hidden sm:block flex-1 max-w-md lg:max-w-lg xl:max-w-xl'>
            <Search className='absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
            <input
              type='text'
              placeholder='البحث في النظام...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200'
            />
          </div>
        </div>

        {/* Right side - Add button, Notifications, theme toggle, and user menu */}
        <div className='flex items-center space-x-2 sm:space-x-4 rtl:space-x-reverse'>
          {/* Add New Dropdown */}
          <div className='relative' ref={dropdownRef}>
            <Button
              variant='default'
              size='sm'
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className='flex items-center space-x-1 rtl:space-x-reverse bg-primary hover:bg-primary/90 text-white'
            >
              <Plus className='h-4 w-4' />
              <span className='hidden sm:inline'>إضافة جديد</span>
              <ChevronDown className='h-4 w-4' />
            </Button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className='absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50'>
                <div className='py-1'>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      // Navigate to new contract page with form mode
                      navigate('/dashboard/contract-management?mode=form');
                    }}
                    className='flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rtl:text-right'
                  >
                    <FileText className='h-4 w-4 ml-4 rtl:ml-0 rtl:mr-4' />
                    <span className='mr-2 rtl:mr-0 rtl:ml-2'>عقد جديد</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      // Navigate to inventory status page with form mode
                      navigate('/dashboard/inventory-status?mode=form');
                    }}
                    className='flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rtl:text-right'
                  >
                    <Wrench className='h-4 w-4 ml-4 rtl:ml-0 rtl:mr-4' />
                    <span className='mr-2 rtl:mr-0 rtl:ml-2'>إضافة معدة</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      // Navigate to new customer page with form mode
                      navigate('/dashboard/customer-management?mode=form');
                    }}
                    className='flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rtl:text-right'
                  >
                    <Users className='h-4 w-4 ml-4 rtl:ml-0 rtl:mr-4' />
                    <span className='mr-2 rtl:mr-0 rtl:ml-2'>عميل جديد</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <Button variant='ghost' size='sm' className='relative p-2'>
            <Bell className='h-5 w-5' />
            <span className='absolute -top-1 -left-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white'>
              3
            </span>
          </Button>

          {/* Dark mode toggle */}
          <Button
            variant='ghost'
            size='sm'
            onClick={toggleTheme}
            className='p-2'
            title={getThemeTooltip()}
            aria-label={getThemeTooltip()}
          >
            {getThemeIcon()}
          </Button>

          {/* User menu */}
          <div className='relative' ref={userMenuRef}>
            <div className='flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse'>
              <div className='text-right hidden sm:block'>
                <div className='text-sm font-medium text-gray-900 dark:text-white'>
                  إسحاق الأغبري
                </div>
                <div className='text-xs text-gray-500 dark:text-gray-400'>
                  مدير النظام
                </div>
              </div>
              <Button 
                variant='ghost' 
                size='sm' 
                className='p-2'
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <User className='h-5 w-5' />
              </Button>
            </div>

            {/* User Menu Dropdown */}
            {isUserMenuOpen && (
              <div className='absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50'>
                <div className='py-2'>
                  {/* User Info */}
                  <div className='px-4 py-3 border-b border-gray-200 dark:border-gray-700'>
                    <div className='flex items-center space-x-3 rtl:space-x-reverse'>
                      <div className='w-10 h-10 bg-primary rounded-full flex items-center justify-center'>
                        <UserCircle className='h-6 w-6 text-white' />
                      </div>
                      <div>
                        <div className='text-sm font-medium text-gray-900 dark:text-white'>
                          إسحاق الأغبري
                        </div>
                        <div className='text-xs text-gray-500 dark:text-gray-400'>
                          isaac@example.com
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      // Navigate to profile page
                      navigate('/dashboard/profile');
                    }}
                    className='flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rtl:text-right'
                  >
                    <UserCircle className='h-4 w-4 ml-4 rtl:ml-0 rtl:mr-4' />
                    <span className='mr-2 rtl:mr-0 rtl:ml-2'>الملف الشخصي</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      // Navigate to settings page
                      navigate('/dashboard/settings');
                    }}
                    className='flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rtl:text-right'
                  >
                    <Settings className='h-4 w-4 ml-4 rtl:ml-0 rtl:mr-4' />
                    <span className='mr-2 rtl:mr-0 rtl:ml-2'>إعدادات الحساب</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      // Navigate to security page
                      navigate('/dashboard/security');
                    }}
                    className='flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rtl:text-right'
                  >
                    <Shield className='h-4 w-4 ml-4 rtl:ml-0 rtl:mr-4' />
                    <span className='mr-2 rtl:mr-0 rtl:ml-2'>الأمان والخصوصية</span>
                  </button>

                  <div className='border-t border-gray-200 dark:border-gray-700 my-1'></div>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      // Handle logout
                      if (window.confirm('هل أنت متأكد من تسجيل الخروج؟')) {
                        // Add logout logic here
                        navigate('/login');
                      }
                    }}
                    className='flex items-center w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rtl:text-right'
                  >
                    <LogOut className='h-4 w-4 ml-4 rtl:ml-0 rtl:mr-4' />
                    <span className='mr-2 rtl:mr-0 rtl:ml-2'>تسجيل الخروج</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
