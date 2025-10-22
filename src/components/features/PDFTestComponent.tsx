/**
 * مكون اختبار PDF والطباعة
 */

'use client';

import React, { useRef } from 'react';
import { Printer, Download } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

interface PDFTestComponentProps {
  contractNumber?: string;
  customerName?: string;
}

export default function PDFTestComponent({ 
  contractNumber = 'TEST-001',
  customerName = 'شركة تجريبية'
}: PDFTestComponentProps) {
  const printRef = useRef<HTMLDivElement>(null);

  // طباعة العقد
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `اختبار_طباعة_${contractNumber}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 0.5in;
        orientation: portrait;
      }
      
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
          print-color-adjust: exact;
        }
        
        .no-print {
          display: none !important;
        }
        
        * {
          color: black !important;
          background: white !important;
          font-family: 'Arial', 'Helvetica', sans-serif !important;
        }
        
        .test-content {
          font-size: 12px !important;
          line-height: 1.4 !important;
          direction: rtl;
          text-align: right;
        }
      }
    `
  });

  // تحميل PDF
  const handleDownload = async () => {
    if (!printRef.current) {
      console.error('لا يوجد محتوى للتحويل');
      return;
    }

    try {
      // استيراد html2pdf ديناميكياً
      const html2pdf = (await import('html2pdf.js')).default;

      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5] as [number, number, number, number],
        filename: `اختبار_PDF_${contractNumber}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'portrait' as const,
          compress: true
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      await html2pdf().set(opt).from(printRef.current).save();
      
      // رسالة نجاح
      const message = document.createElement('div');
      message.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-[100]';
      message.textContent = '✓ تم إنشاء ملف PDF بنجاح!';
      document.body.appendChild(message);
      
      setTimeout(() => {
        if (document.body.contains(message)) {
          document.body.removeChild(message);
        }
      }, 3000);

    } catch (error) {
      console.error('خطأ في إنشاء PDF:', error);
      
      const errorMessage = document.createElement('div');
      errorMessage.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-[100]';
      errorMessage.textContent = '❌ خطأ في إنشاء PDF';
      document.body.appendChild(errorMessage);
      
      setTimeout(() => {
        if (document.body.contains(errorMessage)) {
          document.body.removeChild(errorMessage);
        }
      }, 3000);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">اختبار PDF والطباعة</h2>
      
      {/* أزرار التحكم */}
      <div className="flex gap-4 mb-6 justify-center">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          <Printer className="h-4 w-4" />
          اختبار الطباعة
        </button>
        
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Download className="h-4 w-4" />
          اختبار PDF
        </button>
      </div>

      {/* محتوى الاختبار المعروض */}
      <div className="mb-6 p-4 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">المحتوى المعروض:</h3>
        <p className="text-sm text-gray-600">
          هذا المحتوى مرئي في الشاشة ويحتوي على عناصر تفاعلية
        </p>
      </div>

      {/* محتوى الاختبار للطباعة - مخفي */}
      <div 
        ref={printRef} 
        className="hidden test-content" 
        dir="rtl" 
        style={{ 
          fontFamily: 'Arial, sans-serif',
          backgroundColor: 'white',
          color: 'black',
          padding: '20px'
        }}
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">اختبار ترميز الأحرف العربية</h1>
          <p className="text-lg">اختبار PDF والطباعة</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">معلومات العقد:</h2>
          <table className="w-full border border-black">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-2 text-right">البيان</th>
                <th className="border border-black p-2 text-right">القيمة</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-2">رقم العقد</td>
                <td className="border border-black p-2">{contractNumber}</td>
              </tr>
              <tr>
                <td className="border border-black p-2">اسم العميل</td>
                <td className="border border-black p-2">{customerName}</td>
              </tr>
              <tr>
                <td className="border border-black p-2">تاريخ الإصدار</td>
                <td className="border border-black p-2">{new Date().toLocaleDateString('ar-SA')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">اختبار الأحرف العربية:</h2>
          <div className="space-y-2">
            <p>• اختبار الحروف العادية: أ ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي</p>
            <p>• اختبار الحروف المميزة: ة ء ى</p>
            <p>• اختبار الأرقام: ١ ٢ ٣ ٤ ٥ ٦ ٧ ٨ ٩ ٠</p>
            <p>• اختبار النص الطويل: هذا نص طويل لاختبار كيفية عرض النصوص العربية في ملفات PDF والطباعة</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">اختبار التوقيعات:</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="border-2 border-dashed border-gray-400 h-20 mb-2 flex items-center justify-center">
                <span className="text-gray-500">توقيع الشركة</span>
              </div>
              <p className="text-sm">شركة البعد العالي للتجارة</p>
            </div>
            <div className="text-center">
              <div className="border-2 border-dashed border-gray-400 h-20 mb-2 flex items-center justify-center">
                <span className="text-gray-500">توقيع العميل</span>
              </div>
              <p className="text-sm">{customerName}</p>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-600 mt-8">
          <p>تم إنشاء هذا المستند في: {new Date().toLocaleString('ar-SA')}</p>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>هذا مكون اختبار لـ PDF والطباعة - المحتوى المطبع مخفي عن العرض العادي</p>
      </div>
    </div>
  );
}
