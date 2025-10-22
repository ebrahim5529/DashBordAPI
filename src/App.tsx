import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Providers } from '@/components/providers';
import { ThemeProvider } from '@/components/providers/theme.provider';
import { Toaster } from '@/components/ui/toaster';
import { ToastProvider } from '@/components/shared/Toast';
import AppRoutes from './routes';

/**
 * المكون الرئيسي للتطبيق
 */
function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ToastProvider>
          <Providers>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
              <AppRoutes />
            </div>
            <Toaster />
          </Providers>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

