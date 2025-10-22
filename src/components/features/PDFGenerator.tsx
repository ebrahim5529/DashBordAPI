/**
 * مكون توليد PDF لسند الاستلام
 */

'use client';

import React from 'react';
import { DeliveryReceiptData } from './DeliveryReceiptDocument';

// دالة لتوليد PDF لسند الاستلام
export const generateDeliveryReceiptPDF = async (data: DeliveryReceiptData) => {
  try {
    // تحميل مكتبة jsPDF ديناميكياً
    const { default: jsPDF } = await import('jspdf');
    
    // إنشاء مستند PDF جديد
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // إعداد الخط العربي (إذا كان متوفراً)
    try {
      // يمكن إضافة خط عربي مخصص هنا
      doc.setFont('helvetica');
    } catch {
      console.log('لم يتم العثور على خط عربي، سيتم استخدام الخط الافتراضي');
    }
    
    // إعداد المتغيرات
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;
    
    // دالة لكتابة النص مع دعم النص العربي
    const addText = (text: string, x: number, y: number, fontSize: number = 12, fontWeight: string = 'normal', align: string = 'right') => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', fontWeight);
      
      // معالجة النص العربي
      const arabicText = text || '';
      
      if (align === 'center') {
        doc.text(arabicText, x, y, { align: 'center' });
      } else if (align === 'right') {
        doc.text(arabicText, x, y, { align: 'right' });
      } else {
        doc.text(arabicText, x, y);
      }
    };
    
    // دالة لرسم خط
    const drawLine = (x1: number, y1: number, x2: number, y2: number) => {
      doc.line(x1, y1, x2, y2);
    };
    
    // دالة لرسم مستطيل
    const drawRect = (x: number, y: number, width: number, height: number) => {
      doc.rect(x, y, width, height);
    };
    
    // رأس السند
    addText('سند استلام بضاعة', pageWidth / 2, yPosition, 20, 'bold', 'center');
    yPosition += 10;
    
    addText('Receipt of Goods', pageWidth / 2, yPosition, 14, 'normal', 'center');
    yPosition += 15;
    
    // خط فاصل
    drawLine(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 10;
    
    // رقم السند
    addText('رقم السند:', pageWidth - 40, yPosition, 12, 'bold');
    addText(data.receiptNumber, pageWidth - 20, yPosition, 12, 'normal', 'right');
    yPosition += 10;
    
    // تاريخ التسليم
    const deliveryDate = new Date(data.deliveryDate).toLocaleDateString('ar-SA');
    addText('تاريخ التسليم:', pageWidth - 40, yPosition, 12, 'bold');
    addText(deliveryDate, pageWidth - 20, yPosition, 12, 'normal', 'right');
    yPosition += 15;
    
    // معلومات العميل
    addText('معلومات العميل', 20, yPosition, 14, 'bold');
    yPosition += 8;
    
    drawRect(20, yPosition, pageWidth - 40, 25);
    yPosition += 8;
    
    addText('اسم العميل:', 25, yPosition, 10, 'bold');
    addText(data.customerName, pageWidth - 25, yPosition, 10, 'normal', 'right');
    yPosition += 6;
    
    addText('رقم الهاتف:', 25, yPosition, 10, 'bold');
    addText(data.customerPhone, pageWidth - 25, yPosition, 10, 'normal', 'right');
    yPosition += 6;
    
    addText('عنوان التسليم:', 25, yPosition, 10, 'bold');
    addText(data.deliveryAddress, pageWidth - 25, yPosition, 10, 'normal', 'right');
    yPosition += 15;
    
    // معلومات التسليم
    addText('معلومات التسليم', 20, yPosition, 14, 'bold');
    yPosition += 8;
    
    drawRect(20, yPosition, pageWidth - 40, 25);
    yPosition += 8;
    
    addText('اسم السائق:', 25, yPosition, 10, 'bold');
    addText(data.driverName, pageWidth - 25, yPosition, 10, 'normal', 'right');
    yPosition += 6;
    
    addText('رقم هاتف السائق:', 25, yPosition, 10, 'bold');
    addText(data.driverPhone, pageWidth - 25, yPosition, 10, 'normal', 'right');
    yPosition += 15;
    
    // قائمة الأصناف
    addText('قائمة الأصناف المستلمة', 20, yPosition, 14, 'bold');
    yPosition += 8;
    
    // رأس الجدول
    drawRect(20, yPosition, pageWidth - 40, 10);
    addText('#', 25, yPosition + 6, 9, 'bold', 'center');
    addText('اسم الصنف', pageWidth / 2, yPosition + 6, 9, 'bold', 'center');
    addText('الكمية', pageWidth - 60, yPosition + 6, 9, 'bold', 'center');
    addText('الحالة', pageWidth - 25, yPosition + 6, 9, 'bold', 'center');
    yPosition += 10;
    
    // صفوف الأصناف
    data.items?.forEach((item, index) => {
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = 20;
      }
      
      drawRect(20, yPosition, pageWidth - 40, 8);
      addText((index + 1).toString(), 25, yPosition + 5, 8, 'normal', 'center');
      addText(item.name, pageWidth / 2, yPosition + 5, 8, 'normal', 'center');
      addText(item.quantity.toString(), pageWidth - 60, yPosition + 5, 8, 'normal', 'center');
      
      const conditionText = item.condition === 'good' ? 'جيد' : 
                           item.condition === 'damaged' ? 'تالف' : 'مفقود';
      addText(conditionText, pageWidth - 25, yPosition + 5, 8, 'normal', 'center');
      yPosition += 8;
      
      // ملاحظات الصنف إذا كانت موجودة
      if (item.notes) {
        drawRect(20, yPosition, pageWidth - 40, 6);
        addText(`ملاحظات: ${item.notes}`, 25, yPosition + 4, 7, 'normal');
        yPosition += 6;
      }
    });
    
    yPosition += 10;
    
    // المجموع
    addText(`المجموع الكلي للأصناف: ${data.totalItems}`, pageWidth - 20, yPosition, 10, 'bold', 'right');
    yPosition += 15;
    
    // التوقيعات
    const signatureY = Math.max(yPosition, pageHeight - 80);
    
    // توقيع المستلم
    drawRect(20, signatureY, (pageWidth - 50) / 2, 30);
    addText('توقيع المستلم', 20 + (pageWidth - 50) / 4, signatureY + 5, 10, 'bold', 'center');
    if (data.receiverName) {
      addText(`الاسم: ${data.receiverName}`, 25, signatureY + 15, 9, 'normal');
    }
    if (data.receiverPhone) {
      addText(`الهاتف: ${data.receiverPhone}`, 25, signatureY + 22, 9, 'normal');
    }
    
    // توقيع المسلم
    const delivererX = 20 + (pageWidth - 50) / 2 + 10;
    drawRect(delivererX, signatureY, (pageWidth - 50) / 2, 30);
    addText('توقيع المسلم', delivererX + (pageWidth - 50) / 4, signatureY + 5, 10, 'bold', 'center');
    addText(`الاسم: ${data.driverName}`, delivererX + 5, signatureY + 15, 9, 'normal');
    addText(`الهاتف: ${data.driverPhone}`, delivererX + 5, signatureY + 22, 9, 'normal');
    
    // ملاحظات إضافية
    if (data.notes) {
      yPosition = signatureY + 40;
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      
      addText('ملاحظات إضافية:', 20, yPosition, 12, 'bold');
      yPosition += 8;
      
      // تقسيم النص إذا كان طويلاً
      const maxWidth = pageWidth - 40;
      const textLines = doc.splitTextToSize(data.notes, maxWidth);
      
      textLines.forEach((line: string) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
        }
        addText(line, 20, yPosition, 10, 'normal');
        yPosition += 5;
      });
    }
    
    // تذييل السند
    const footerY = pageHeight - 15;
    addText(`تم إنشاء هذا السند تلقائياً بتاريخ ${new Date().toLocaleDateString('ar-SA')}`, pageWidth / 2, footerY, 8, 'normal', 'center');
    
    // حفظ الملف
    const fileName = `delivery-receipt-${data.receiptNumber.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
    doc.save(fileName);
    
    return true;
  } catch (error) {
    console.error('خطأ في توليد PDF:', error);
    throw new Error('فشل في توليد ملف PDF');
  }
};

// دالة لتحميل مكتبة jsPDF
export const loadJSPDF = async () => {
  try {
    const { default: jsPDF } = await import('jspdf');
    return jsPDF;
  } catch (error) {
    console.error('فشل في تحميل مكتبة jsPDF:', error);
    throw new Error('مكتبة توليد PDF غير متوفرة');
  }
};

// مكون لزر تحميل PDF
interface PDFDownloadButtonProps {
  data: DeliveryReceiptData;
  onDownload?: () => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
}

export const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({
  data,
  onDownload,
  onError,
  disabled = false,
  className = ''
}) => {
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleDownload = async () => {
    if (isGenerating || disabled) return;
    
    setIsGenerating(true);
    try {
      await generateDeliveryReceiptPDF(data);
      onDownload?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';
      onError?.(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={disabled || isGenerating}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isGenerating ? (
        <>
          <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          جاري التوليد...
        </>
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          تحميل PDF
        </>
      )}
    </button>
  );
};
