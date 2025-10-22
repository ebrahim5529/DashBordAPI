'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
import { Monitor, Tablet, Smartphone, Eye } from 'lucide-react';

interface ResponsiveTestProps {
  isVisible?: boolean;
}

export function ResponsiveTest({ isVisible = false }: ResponsiveTestProps) {
  const [screenSize, setScreenSize] = useState('');
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setViewport({ width, height });

      if (width < 640) {
        setScreenSize('Mobile');
      } else if (width < 1024) {
        setScreenSize('Tablet');
      } else {
        setScreenSize('Desktop');
      }
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);

    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  if (!isVisible) return null;

  return (
    <div className='fixed bottom-4 left-4 z-50'>
      <Card className='w-64 bg-white dark:bg-gray-900 shadow-lg border'>
        <CardHeader className='pb-2'>
          <CardTitle className='text-sm flex items-center gap-2'>
            <Eye className='h-4 w-4' />
            Responsive Test
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          <div className='text-xs'>
            <div className='flex items-center gap-2 mb-1'>
              {screenSize === 'Mobile' && <Smartphone className='h-3 w-3' />}
              {screenSize === 'Tablet' && <Tablet className='h-3 w-3' />}
              {screenSize === 'Desktop' && <Monitor className='h-3 w-3' />}
              <span className='font-medium'>{screenSize}</span>
            </div>
            <div className='text-gray-500'>
              {viewport.width} × {viewport.height}
            </div>
          </div>

          <div className='text-xs space-y-1'>
            <div className='flex justify-between'>
              <span>Breakpoint:</span>
              <span className='font-mono'>
                {viewport.width < 640
                  ? 'sm'
                  : viewport.width < 768
                    ? 'md'
                    : viewport.width < 1024
                      ? 'lg'
                      : viewport.width < 1280
                        ? 'xl'
                        : '2xl'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span>Grid:</span>
              <span className='font-mono'>
                {viewport.width < 640
                  ? '1 col'
                  : viewport.width < 1024
                    ? '2 cols'
                    : '3+ cols'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for responsive utilities
export function useResponsive() {
  const [breakpoint, setBreakpoint] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setBreakpoint('sm');
        setIsMobile(true);
        setIsTablet(false);
        setIsDesktop(false);
      } else if (width < 768) {
        setBreakpoint('md');
        setIsMobile(false);
        setIsTablet(true);
        setIsDesktop(false);
      } else if (width < 1024) {
        setBreakpoint('lg');
        setIsMobile(false);
        setIsTablet(true);
        setIsDesktop(false);
      } else if (width < 1280) {
        setBreakpoint('xl');
        setIsMobile(false);
        setIsTablet(false);
        setIsDesktop(true);
      } else {
        setBreakpoint('2xl');
        setIsMobile(false);
        setIsTablet(false);
        setIsDesktop(true);
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);

    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return {
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  };
}
