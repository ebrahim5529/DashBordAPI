/**
 * مكون أنماط الطباعة المخصصة لسند الاستلام
 */

'use client';

import React from 'react';

export default function PrintStyles() {
  return (
    <style dangerouslySetInnerHTML={{
      __html: `
      @media print {
        /* إخفاء العناصر غير المرغوب فيها أثناء الطباعة */
        .no-print {
          display: none !important;
        }
        
        /* إخفاء شريط التنقل والأزرار */
        nav, .sidebar, .navbar, .header,
        button:not(.print-button),
        .print-hide {
          display: none !important;
        }
        
        /* تحسين تخطيط الصفحة للطباعة */
        body {
          margin: 0;
          padding: 0;
          font-family: 'Tajawal', 'Arial', sans-serif;
          direction: rtl;
          background: white !important;
          color: black !important;
        }
        
        /* تحسين حجم الصفحة */
        @page {
          size: A4;
          margin: 0.5cm;
          direction: rtl;
        }
        
        /* تحسين عرض سند الاستلام للطباعة */
        .delivery-receipt-print {
          width: 100% !important;
          max-width: none !important;
          margin: 0 !important;
          padding: 10px !important;
          box-shadow: none !important;
          border: 1px solid #000 !important;
          background: white !important;
          font-size: 12px !important;
          line-height: 1.3 !important;
        }
        
        /* تحسين الخطوط للطباعة */
        .delivery-receipt-print * {
          color: black !important;
          background: transparent !important;
        }
        
        /* تحسين رأس السند */
        .receipt-header {
          border-bottom: 2px solid #000 !important;
          padding-bottom: 8px !important;
          margin-bottom: 10px !important;
        }
        
        .receipt-header h1 {
          font-size: 18px !important;
          font-weight: bold !important;
          margin: 0 !important;
        }
        
        .receipt-header .receipt-number {
          font-size: 14px !important;
          font-weight: bold !important;
          color: #000 !important;
        }
        
        /* تحسين الجداول للطباعة */
        .receipt-table {
          width: 100% !important;
          border-collapse: collapse !important;
          margin: 8px 0 !important;
        }
        
        .receipt-table th,
        .receipt-table td {
          border: 1px solid #000 !important;
          padding: 4px !important;
          text-align: right !important;
          font-size: 10px !important;
        }
        
        .receipt-table th {
          background-color: #f3f4f6 !important;
          font-weight: bold !important;
        }
        
        /* تحسين أقسام التوقيع */
        .signature-section {
          border: 1px solid #000 !important;
          padding: 5px !important;
          margin: 8px 0 !important;
          min-height: 60px !important;
        }
        
        .signature-section h3 {
          font-size: 11px !important;
          font-weight: bold !important;
          margin: 0 0 5px 0 !important;
          border-bottom: 1px solid #ccc !important;
          padding-bottom: 3px !important;
        }
        
        /* تحسين التذييل */
        .receipt-footer {
          margin-top: 10px !important;
          padding-top: 8px !important;
          border-top: 1px solid #000 !important;
          text-align: center !important;
          font-size: 9px !important;
          color: #666 !important;
        }
        
        /* إخفاء أيقونات Lucide أثناء الطباعة */
        .lucide {
          display: none !important;
        }
        
        /* منع تقسيم المحتوى عبر صفحات متعددة */
        .delivery-receipt-print {
          page-break-inside: avoid !important;
        }
        
        /* تحسين المسافات للطباعة في صفحة واحدة */
        .space-y-6 > * + * {
          margin-top: 8px !important;
        }
        
        .space-y-4 > * + * {
          margin-top: 6px !important;
        }
        
        .space-y-8 > * + * {
          margin-top: 10px !important;
        }
        
        /* تقليل المسافات في الأقسام */
        .p-6 {
          padding: 8px !important;
        }
        
        .mb-8 {
          margin-bottom: 10px !important;
        }
        
        .mt-8 {
          margin-top: 10px !important;
        }
        
        .mb-4 {
          margin-bottom: 6px !important;
        }
        
        .mt-4 {
          margin-top: 6px !important;
        }
        
        /* تحسين الألوان للطباعة */
        .text-blue-600, .text-green-600, .text-red-600, .text-yellow-600 {
          color: black !important;
        }
        
        .bg-blue-50, .bg-green-50, .bg-red-50, .bg-yellow-50 {
          background-color: #f9fafb !important;
        }
        
        /* تحسين الخطوط والعناوين */
        h1, h2, h3, h4, h5, h6 {
          font-size: 12px !important;
          margin: 4px 0 !important;
          line-height: 1.2 !important;
        }
        
        h1 {
          font-size: 16px !important;
        }
        
        h2 {
          font-size: 14px !important;
        }
        
        h3 {
          font-size: 12px !important;
        }
        
        /* تحسين النصوص */
        p, span, div {
          font-size: 10px !important;
          line-height: 1.2 !important;
          margin: 2px 0 !important;
        }
        
        /* تحسين الجداول */
        table {
          font-size: 9px !important;
        }
        
        /* تحسين الشبكة */
        .grid {
          gap: 4px !important;
        }
        
        .grid-cols-2 {
          gap: 4px !important;
        }
        
        .grid-cols-3 {
          gap: 4px !important;
        }
      }
    `
    }} />
  );
}
