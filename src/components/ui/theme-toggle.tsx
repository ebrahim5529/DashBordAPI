import { useTheme } from '@/components/providers/theme.provider';
import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="p-1.5 sm:p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center">
        <Monitor className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
      </button>
    );
  }

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />;
      case 'dark':
        return <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />;
      default:
        return <Monitor className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />;
    }
  };

  const getTooltip = () => {
    switch (theme) {
      case 'light':
        return 'الوضع الفاتح';
      case 'dark':
        return 'الوضع الداكن';
      default:
        return 'وضع النظام';
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-1.5 sm:p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center"
      title={getTooltip()}
      aria-label={getTooltip()}
    >
      {getIcon()}
    </button>
  );
}
