/**
 * مكون عقد إيجار معدات البناء
 */

'use client';

import React, { useRef, useState, useEffect } from 'react';
import { X, Printer, Download, Check, MessageSquare, Copy } from 'lucide-react';
import { ContractManagementData } from '@/data/contractsManagementData';
import { useReactToPrint } from 'react-to-print';
import DigitalSignature from './DigitalSignature';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: ContractManagementData | null;
  existingCustomerSignature?: string;
  existingCompanySignature?: string;
  showSendButton?: boolean;
  onSendToWhatsApp?: () => void;
}

export default function InvoiceModal({ 
  isOpen, 
  onClose, 
  contract, 
  existingCustomerSignature, 
  existingCompanySignature,
  showSendButton = false,
  onSendToWhatsApp
}: InvoiceModalProps) {
  const contractRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);
  
  // حالات التوقيع الإلكتروني
  const [showSignature, setShowSignature] = useState(false);
  const [customerSignature, setCustomerSignature] = useState<string>(existingCustomerSignature || '');
  const [companySignature, setCompanySignature] = useState<string>(existingCompanySignature || '');
  const [tempCustomerSignature, setTempCustomerSignature] = useState<string>('');
  const [tempCompanySignature, setTempCompanySignature] = useState<string>('');
  const [isSignatureComplete, setIsSignatureComplete] = useState(false);
  const [isMessageCopied, setIsMessageCopied] = useState(false);

  // تحديث التوقيعات عند تغيير القيم
  useEffect(() => {
    if (existingCustomerSignature) {
      setCustomerSignature(existingCustomerSignature);
    }
    if (existingCompanySignature) {
      setCompanySignature(existingCompanySignature);
    }
  }, [existingCustomerSignature, existingCompanySignature]);

  // حالة التاريخ
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    setToday(new Date());
  }, []);

  // طباعة العقد باستخدام react-to-print
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `عقد_إيجار_معدات_بناء_${contract?.contractNumber}`,
    pageStyle: `
        @page {
          size: A4;
          margin: 10mm 15mm;
          orientation: portrait;
        }
      
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
          print-color-adjust: exact;
        }
        
        /* إخفاء جميع العناصر عدا المحتوى المطبع */
        body * {
          visibility: hidden;
        }
        
        .contract-print-content,
        .contract-print-content * {
          visibility: visible;
        }
        
        .contract-print-content {
          position: static !important;
          left: auto !important;
          top: auto !important;
          width: 100% !important;
          height: 277mm !important;
          max-height: 277mm !important;
          font-size: 8pt !important;
          line-height: 1.15 !important;
          direction: rtl;
          text-align: justify !important;
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
          color: black !important;
          overflow: hidden !important;
          page-break-after: avoid !important;
          page-break-inside: avoid !important;
          font-family: 'Simplified Arabic', 'Traditional Arabic', 'Sakkal Majalla', Arial, sans-serif !important;
        }
        
        .no-print {
          display: none !important;
        }
        
        /* إخفاء معلومات التوقيع الإضافية في الطباعة */
        .contract-print-content > div:has(.flex.items-center.gap-2) {
          display: none !important;
        }
        
        * {
          color: black !important;
          background: white !important;
          font-family: 'Simplified Arabic', 'Traditional Arabic', 'Sakkal Majalla', Arial, sans-serif !important;
        }
        
        .contract-header {
          margin-bottom: 0.8mm !important;
          page-break-inside: avoid !important;
          padding-bottom: 0.8mm !important;
          border-bottom: 1.5px solid black !important;
        }
        
        .contract-header h2 {
          font-size: 12pt !important;
          font-weight: bold !important;
          margin-bottom: 0.2mm !important;
        }
        
        .contract-header p {
          font-size: 8pt !important;
          margin-bottom: 0.1mm !important;
        }
        
        .contract-title {
          margin-bottom: 0.8mm !important;
          page-break-inside: avoid !important;
          text-align: center !important;
        }
        
        .contract-title h1 {
          font-size: 16pt !important;
          font-weight: bold !important;
          margin-bottom: 0.3mm !important;
        }
        
        .contract-title .w-full {
          display: none !important;
        }
        
        .contract-date {
          font-size: 10pt !important;
          text-align: right !important;
          margin-bottom: 0.6mm !important;
          line-height: 1.15 !important;
        }
        
        .contract-table {
          font-size: 9pt !important;
          margin-bottom: 0.8mm !important;
          page-break-inside: avoid !important;
          width: 100% !important;
          border-collapse: collapse !important;
          table-layout: fixed !important;
        }
          
        .contract-table th {
          padding: 0.8mm !important;
          border: 1px solid black !important;
          text-align: center !important;
          font-weight: bold !important;
          font-size: 9pt !important;
          line-height: 1.05 !important;
          background: white !important;
        }
        
        .contract-table td {
          padding: 0.8mm !important;
          border: 1px solid black !important;
          text-align: center !important;
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
          font-size: 9pt !important;
          line-height: 1.05 !important;
        }
        
        .contract-sections {
          margin-bottom: 0.6mm !important;
          padding: 0.6mm 1.5mm !important;
          page-break-inside: avoid !important;
          text-align: justify !important;
        }
        
        .contract-sections.border-r-4 {
          border-right-width: 2px !important;
        }
        
        .contract-sections p {
          font-size: 10pt !important;
          line-height: 1.15 !important;
          margin-bottom: 0.2mm !important;
          text-align: justify !important;
        }
        
        .contract-sections .text-lg,
        .contract-sections .font-bold {
          font-size: 11pt !important;
          font-weight: bold !important;
        }
        
        .contract-sections .text-base {
          font-size: 10pt !important;
        }
        
        .contract-sections ul,
        .contract-sections .space-y-3 {
          margin-top: 0.2mm !important;
        }
        
        .contract-sections ul p,
        .contract-sections .space-y-3 p {
          font-size: 9pt !important;
          line-height: 1.08 !important;
          margin-bottom: 0.1mm !important;
          text-align: justify !important;
        }
        
        .contract-sections .space-y-3 > * + * {
          margin-top: 0.1mm !important;
        }
          
        .signatures {
          margin-top: 1mm !important;
          page-break-inside: avoid !important;
          padding-top: 1mm !important;
          border-top: 1.5px solid black !important;
        }
        
        .signatures p {
          font-size: 10pt !important;
          margin-bottom: 0.2mm !important;
          text-align: center !important;
        }
        
        .signatures .font-bold {
          font-weight: bold !important;
          font-size: 11pt !important;
        }
        
        .signature-box {
          border: 1px solid black !important;
          height: 8mm !important;
          margin-bottom: 0.5mm !important;
        }
        
        .signatures img {
          height: 8mm !important;
          max-height: 8mm !important;
        }
        
        .signatures .mb-8 {
          margin-bottom: 1mm !important;
        }
        
        .signatures .grid {
          gap: 2mm !important;
        }
        
        .contract-footer {
          display: none !important;
        }
      }
    `
  });

  // التحقق من وجود البيانات قبل العرض
  if (!isOpen || !contract) return null;

  // معالجة التوقيع الإلكتروني
  const handleCustomerSignature = (signatureData: string) => {
    setTempCustomerSignature(signatureData);
  };

  const handleCompanySignature = (signatureData: string) => {
    setTempCompanySignature(signatureData);
  };

  const handleClearCustomerSignature = () => {
    setCustomerSignature('');
    setTempCustomerSignature('');
  };

  const handleClearCompanySignature = () => {
    setCompanySignature('');
    setTempCompanySignature('');
  };

  const handleCompleteSignature = () => {
    if (tempCustomerSignature) {
      setCustomerSignature(tempCustomerSignature);
    }
    if (tempCompanySignature) {
      setCompanySignature(tempCompanySignature);
    }
    setIsSignatureComplete(true);
    setShowSignature(false);
  };

  // توليد رسالة الواتساب
  const generateWhatsAppMessage = () => {
    if (!contract) return '';
    
    const contractUrl = `${window.location.origin}/contract/sign/${contract.contractNumber}`;
    
    const defaultMessage = `السلام عليكم ورحمة الله وبركاته

أهلاً وسهلاً بكم في شركة البعد العالي للتجارة

تم إعداد عقد إيجار معدات بناء برقم: *${contract.contractNumber}*

تفاصيل العقد:
• العميل: ${contract.customerName}
• القيمة الإجمالية: ${contract.totalValue.toLocaleString()} ر.ع
• تاريخ العقد: ${contract.startDate}
• نوع العقد: ${contract.contractType}

يرجى مراجعة العقد والتوقيع عليه من خلال الرابط التالي:
${contractUrl}

بعد التوقيع سيتم إرسال نسخة موقعة إليكم

شكراً لثقتكم بنا
شركة البعد العالي للتجارة`;

    return defaultMessage;
  };

  // نسخ الرسالة إلى الحافظة
  const copyWhatsAppMessageToClipboard = async () => {
    try {
      const message = generateWhatsAppMessage();
      await navigator.clipboard.writeText(message);
      setIsMessageCopied(true);
      
      // إعادة تعيين حالة النسخ بعد ثانيتين
      setTimeout(() => {
        setIsMessageCopied(false);
      }, 2000);
    } catch (error) {
      console.error('خطأ في نسخ الرسالة:', error);
      alert('حدث خطأ في نسخ الرسالة. يرجى المحاولة مرة أخرى.');
    }
  };

  // تحميل العقد كـ PDF باستخدام html2pdf
  const handleDownload = async () => {
    if (!contract || !printRef.current) {
      console.error('لا يوجد عقد أو محتوى للعرض');
      return;
    }

    let loadingDiv: HTMLDivElement | null = null;

    try {
      // إظهار رسالة تحميل
      loadingDiv = document.createElement('div');
      loadingDiv.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-[100] flex items-center gap-2';
      loadingDiv.innerHTML = '<div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div><span>جاري إنشاء ملف PDF...</span>';
      document.body.appendChild(loadingDiv);

      // إنشاء PDF من HTML
      const element = printRef.current;
      
      if (!element) {
        throw new Error('لا يمكن العثور على العنصر للتحويل');
      }

      // استيراد html2pdf ديناميكياً
      const html2pdf = (await import('html2pdf.js')).default;

      // إعدادات html2pdf محسنة
      const opt = {
        margin: [0.2, 0.2, 0.2, 0.2] as [number, number, number, number], // هوامش أقل
        filename: `عقد_إيجار_معدات_بناء_${contract.contractNumber}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.95 },
        html2canvas: { 
          scale: 1.5, // تقليل الحجم للحصول على محتوى أكثر
          useCORS: true,
          letterRendering: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: element.offsetWidth, // عرض العنصر الفعلي
          height: element.scrollHeight, // ارتفاع المحتوى الكامل
          scrollX: 0,
          scrollY: 0,
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight,
          dpi: 300, // DPI عالي للجودة
          foreignObjectRendering: true
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'portrait' as const,
          compress: false, // عدم الضغط للحفاظ على الجودة
          precision: 2
        },
        pagebreak: { 
          mode: ['avoid-all', 'css', 'legacy'],
          before: '.page-break-before',
          after: '.page-break-after',
          avoid: '.avoid-break'
        }
      };
      
      // إزالة الإخفاء مؤقتاً لـ PDF
      element.style.position = 'static';
      element.style.left = 'auto';
      element.style.top = 'auto';
      element.style.width = '210mm';
      element.style.minHeight = '297mm';
      element.style.backgroundColor = 'white';
      element.style.color = 'black';
      
      const pdfBlob = await html2pdf().set(opt).from(element).output('blob');
      
      // إعادة الإخفاء بعد إنشاء PDF
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      element.style.top = '-9999px';
      
      // فتح PDF في نافذة جديدة بأبعاد محسنة
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      
      // حساب الأبعاد المناسبة للنافذة
      const windowWidth = Math.min(screenWidth * 0.9, 1200); // 90% من عرض الشاشة أو 1200 بكسل
      const windowHeight = Math.min(screenHeight * 0.9, 800); // 90% من ارتفاع الشاشة أو 800 بكسل
      
      const newWindow = window.open(
        pdfUrl, 
        '_blank', 
        `width=${windowWidth},height=${windowHeight},scrollbars=yes,resizable=yes,menubar=yes,toolbar=yes,location=yes,status=yes`
      );
      
        if (!newWindow) {
          // إذا لم تفتح النافذة (مثل منع النوافذ المنبثقة)، فتح في نفس النافذة
          window.location.href = pdfUrl;
        }
      
      // تنظيف URL بعد فتح الملف
      setTimeout(() => {
        try {
          URL.revokeObjectURL(pdfUrl);
        } catch (urlError) {
          console.error('خطأ في تنظيف URL:', urlError);
        }
      }, 2000);

      // إزالة رسالة التحميل
      if (loadingDiv && document.body.contains(loadingDiv)) {
        document.body.removeChild(loadingDiv);
      }

      // إظهار رسالة نجاح
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-[100]';
      successDiv.textContent = '✓ تم إنشاء وفتح ملف PDF في المتصفح بنجاح!';
      document.body.appendChild(successDiv);

      setTimeout(() => {
        if (document.body.contains(successDiv)) {
          document.body.removeChild(successDiv);
        }
      }, 3000);

    } catch (error) {
      console.error('خطأ في إنشاء PDF:', error);
      
      // إزالة رسالة التحميل في حالة الخطأ
      if (loadingDiv && document.body.contains(loadingDiv)) {
        document.body.removeChild(loadingDiv);
      }
      
      // إظهار رسالة خطأ مفصلة
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-[100] max-w-md';
      
      let errorMessage = 'خطأ في إنشاء PDF.';
      if (error instanceof Error) {
        errorMessage += ` التفاصيل: ${error.message}`;
      }
      
      errorDiv.innerHTML = `
        <div class="flex items-center gap-2">
          <span>❌</span>
          <span>${errorMessage}</span>
        </div>
        <div class="text-xs mt-1 opacity-90">
          تأكد من اتصال الإنترنت أو جرب مرة أخرى
        </div>
      `;
      
      document.body.appendChild(errorDiv);

      setTimeout(() => {
        if (document.body.contains(errorDiv)) {
          document.body.removeChild(errorDiv);
        }
      }, 5000);
    }
  };

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // تنسيق التاريخ بالكامل
  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // تنسيق المبلغ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    }).format(amount);
  };

  // حساب مدة العقد
  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const duration = contract ? calculateDuration(contract.startDate, contract.endDate) : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto my-4">
        {/* Header - لا يظهر في الطباعة */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between no-print z-10">
          <h2 className="text-xl font-bold text-gray-900">عقد إيجار معدات بناء</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                // إظهار رسالة تحضير
                const message = document.createElement('div');
                message.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-[100]';
                message.textContent = 'جاري تحضير العقد للطباعة...';
                document.body.appendChild(message);
                
                setTimeout(() => {
                  if (document.body.contains(message)) {
                    document.body.removeChild(message);
                  }
                  handlePrint();
                }, 500);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm no-print"
              title="طباعة العقد على ورقة A4"
            >
              <Printer className="h-4 w-4" />
              طباعة
            </button>
            <button
              onClick={handleDownload}
              className="hidden flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
              title="فتح PDF في نافذة جديدة في المتصفح"
            >
              <Download className="h-4 w-4" />
              فتح PDF
            </button>
            <button
              onClick={copyWhatsAppMessageToClipboard}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm ${
                isMessageCopied 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
              title="نسخ رسالة الواتساب"
            >
              {isMessageCopied ? (
                <>
                  <Check className="h-4 w-4" />
                  تم النسخ
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  نسخ الرسالة
                </>
              )}
            </button>
            {showSendButton && onSendToWhatsApp && (
              <button
                onClick={onSendToWhatsApp}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                title="إرسال الفاتورة عبر الواتساب"
              >
                <MessageSquare className="h-4 w-4" />
                إرسال عبر الواتساب
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Contract Content - للعرض */}
        <div ref={contractRef} className="p-8 sm:p-12 bg-white contract-content" dir="rtl" style={{ fontFamily: 'Arial, sans-serif' }}>
          {/* Header */}
          <div className="flex items-start justify-between mb-8 pb-4 border-b-2 border-black contract-header">
            {/* Company Info - Right Side */}
            <div className="text-right">
              <h2 className="text-2xl font-bold text-black mb-1">الـبعد الـعالي للتجـارة</h2>
              <p className="text-sm font-semibold text-black mb-3" style={{ letterSpacing: '0.5px' }}>
                HIGHER DIMENSION TRD
              </p>
              <div className="space-y-1 text-sm text-black">
                <p>سلطنة عمان | ص.ب: 215 | الرمز البريدي: 619 | نقال: 93099914</p>
                <p style={{ direction: 'ltr', textAlign: 'right' }}>
                  Sultanate of Oman | P.O. Box: 215 | P.C: 619 | GSM: 93099914
                </p>
              </div>
            </div>

            {/* Contract Number - Left Side */}
            <div className="text-left">
              <div className="bg-white border-2 border-black rounded-lg px-6 py-4">
                <p className="text-sm text-black mb-1">NO:</p>
                <p className="text-3xl font-bold text-black">{contract.contractNumber}</p>
              </div>
            </div>
          </div>

          {/* Contract Title */}
          <div className="text-center mb-8 contract-title">
            <h1 className="text-3xl font-bold text-black mb-2">عقد إيجار معدات بناء</h1>
            <div className="w-full h-1 bg-black mb-4"></div>
          </div>

          {/* Contract Date */}
          <div className="mb-6 text-base leading-relaxed text-black contract-date">
            <p>
            إنه في يوم: <span className="font-semibold">{today ? formatFullDate(today.toISOString()) : ''}</span> الموافق{' '}
            <span className="font-semibold border-b border-black px-2">{today?.getDate() || ''}</span> /{' '}
            <span className="font-semibold border-b border-black px-2">{today ? today.getMonth() + 1 : ''}</span> /{' '}
            <span className="font-semibold border-b border-black px-2">{today?.getFullYear() || ''}</span> م، تم الإتفاق بين كل من:
            </p>
          </div>

          {/* Parties */}
          <div className="mb-6 space-y-3 contract-sections">
            <div className="bg-white p-4 rounded-lg border-r-4 border-black">
              <p className="text-lg font-bold mb-2 text-black">الطرف الأول (المالك):</p>
              <p className="text-base text-black">
                شركة البعد العالي للتجارة، س.ت: <span className="font-semibold">1208502</span>، ومقرها ولاية السيب،{' '}
                هاتف: <span className="font-semibold">٩٣٠٩٩٩١٤</span>.
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg border-r-4 border-black">
              <p className="text-lg font-bold mb-2 text-black">الطرف الثاني (المستأجر):</p>
              <p className="text-base mb-2 text-black">
                شركة / مؤسسة: <span className="font-semibold">{contract.customerName}</span>
              </p>
              <p className="text-base mb-2 text-black">
                س.ت: <span className="font-semibold">{contract.customerId}</span>
              </p>
              <div className="space-y-1 mt-2">
                <p className="text-base text-black">
                  ويمثلها في هذا العقد: <span className="inline-block border-b border-black w-64 mx-1"></span>{' '}
                  بصفته: <span className="inline-block border-b border-black w-32 mx-1"></span>
                </p>
                <p className="text-base text-black">
                  <span className="inline-block border-b border-black w-64 mx-14"></span>{' '}
                  بصفته: <span className="inline-block border-b border-black w-32 mx-1"></span>
                </p>
              </div>
            </div>
          </div>

          {/* Introduction */}
          <div className="mb-6 p-4 bg-white border-r-4 border-black rounded contract-sections">
            <p className="text-lg font-bold mb-2 text-black">مقدمة:</p>
            <p className="text-base leading-relaxed text-justify text-black">
              الطرف الأول منشأة تمتلك عدد من المعدات، وقد أبدى الطرف الثاني رغبته في استئجار عدد منها بغرض الانتفاع بها لفترة زمنية محددة، وقد اتفق الطرفان على ما يلي:
            </p>
          </div>

          {/* First: Equipment Table */}
          <div className="mb-6">
            <p className="text-lg font-bold mb-4 text-black">
              أولاً: بموجب هذا العقد التزم المالك (الطرف الأول) بتأجير عدد من المعدات للمستأجر (الطرف الثاني) والمبينة أوصافها فيما يلي:
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-2 border-black contract-table">
                <thead>
                  <tr className="bg-white border-2 border-black">
                    <th className="border-2 border-black p-3 text-center font-bold text-black">م</th>
                    <th className="border-2 border-black p-3 text-center font-bold text-black">النوع</th>
                    <th className="border-2 border-black p-3 text-center font-bold text-black">العدد</th>
                    <th className="border-2 border-black p-3 text-center font-bold text-black">تاريخ الإيجار</th>
                    <th className="border-2 border-black p-3 text-center font-bold text-black">تاريخ الإرجاع</th>
                    <th className="border-2 border-black p-3 text-center font-bold text-black">المدة</th>
                    <th className="border-2 border-black p-3 text-center font-bold text-black">قيمة الإيجار</th>
                  </tr>
                </thead>
                <tbody>
                  {/* صف واحد فقط بالبيانات */}
                  <tr className="border-2 border-black">
                    <td className="border-2 border-black p-3 text-center font-semibold text-black">1</td>
                    <td className="border-2 border-black p-3 text-center text-black">{contract.contractType}</td>
                    <td className="border-2 border-black p-3 text-center font-semibold text-black">{contract.equipmentCount}</td>
                    <td className="border-2 border-black p-3 text-center text-black">{formatDate(contract.startDate)}</td>
                    <td className="border-2 border-black p-3 text-center text-black">{formatDate(contract.endDate)}</td>
                    <td className="border-2 border-black p-3 text-center font-semibold text-black">{duration} يوم</td>
                    <td className="border-2 border-black p-3 text-center font-bold text-black">{formatCurrency(contract.totalValue)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Second: Place of Agreement */}
          <div className="mb-4 p-4 bg-white rounded border-r-4 border-black contract-sections">
            <p className="text-lg mb-2 text-black">
              <span className="font-bold">ثانياً: مكان الاتفاق:</span>
            </p>
            <p className="text-base mr-4 text-black">{contract.location || 'ولاية السيب'}</p>
          </div>

          {/* Third: Contract Duration */}
          <div className="mb-4 p-4 bg-white rounded border-r-4 border-black contract-sections">
            <p className="text-lg mb-2 text-black">
              <span className="font-bold">ثالثاً: مدة العقد:</span>
            </p>
            <p className="text-base leading-relaxed mr-4 text-justify text-black">
              مدة هذا العقد تبدأ من تاريخ إستلام المستأجر للمعدات الموضحة في العقد، وتتجدد تلقائياً لفترة مماثلة بعد انقضاء مدة العقد الأصلية في حالة عدم إرجاع المعدات وعدم الإخطار، وفي هذه الحالة يحق للطرف الأول تحديد سعر إيجار جديد بعد انتهاء هذا العقد.
            </p>
          </div>

          {/* Fourth: Tenant Obligations */}
          <div className="mb-4 p-4 bg-white rounded border-r-4 border-black contract-sections">
            <p className="text-lg mb-3 text-black">
              <span className="font-bold">رابعاً: التزامات المستأجر:</span>
            </p>
            <div className="space-y-3 mr-4 text-base leading-relaxed">
              <p className="text-justify text-black">
                • يلتزم المستأجر بتمكين المؤجر أو من يمثله بمعاينة المعدات المؤجرة وتفقدها وصيانتها في أى وقت أو سحبها ونقلها في حال تخلف المستأجر عن سداد قيمة الإيجار مقدماً أو الإخلال بشروط العقد دون أن يتحمل أي مسئولية نتيجة الضرر الناتج عن سحب المعدات أو فكها من الموقع ويعد هذا الشرط بمثابة الإخطار المسبق للمستأجر.
              </p>
              <p className="text-justify text-black">
                • يقر المستأجر بأنه قد عاين المعدات المؤجرة معاينة نافية للجهالة وقبلها بحالتها الراهنة، وأنها صالحة للإستعمال.
              </p>
              <p className="text-justify text-black">
                • إذا تسبب المستأجر في فقد المعدة أو تلفها كلياً أو جزئياً بفعله أو بفعل الغير يلتزم بتعويض المالك بقيمتها حسب الشراء.
              </p>
              <p className="text-justify text-black">
                • جميع العقود المبرمة حول الكميات المستأجرة يتم إعادة إحتساب قيمة إيجارية أخرى في حالة إرجاع جزء منها بعقد جديد ولا ينطبق سعر الإيجار على أي إتفاق آخر خارج عن هذا العقد، ويحدد الطرف الأول (المؤجر) القيمة الإيجارية الجديدة.
              </p>
              <p className="text-justify text-black">
                • يحق للمالك تحديد قيمة إيجارية جديدة حسب رؤيته بعد إنتهاء هذا العقد أو التجديد التلقائي ويعد هذا الشرط بمثابة الإخطار المسبق للمستأجر.
              </p>
              <p className="text-justify text-black">
                • يقر الطرف الثاني (المستأجر) بتخويل أى شخص يعمل لديه باستلام المعدات وتسليمها.
              </p>
              <p className="text-justify text-black">
                • لا يعتد بأى إدعاء حول إرجاع المعدات ما لم يقدم المستأجر ما يفيد ذلك كتابياً موقعاً من طرف المؤجر.
              </p>
            </div>
          </div>

          {/* Fifth: Dispute Resolution */}
          <div className="mb-8 p-4 bg-white rounded border-r-4 border-black contract-sections">
            <p className="text-lg mb-3 text-black">
              <span className="font-bold">خامساً: الفصل في النزاع:</span>
            </p>
            <p className="text-base leading-relaxed mr-4 text-justify text-black">
              أي نزاع قد ينشأ عن تنفيذ هذا العقد أو تفسير نصوصه إن لم يتم حسمه بالتراضي يتم الفصل فيه لدى الجهات القضائية والمحاكم المختصة بولاية السيب وفي حالة وجود بند غير واضح يفسر لصالح المؤجر ويستمر إحتساب القيمة الإيجارية لحين إرجاع المعدات.
            </p>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t-2 border-black signatures">
            {/* توقيع الشركة */}
            <div className="text-center">
              <div className="mb-8">
                {showSignature && !companySignature && !tempCompanySignature ? (
                  <div className="border-2 border-dashed border-black rounded-lg p-4 bg-white">
                    <p className="text-sm text-black mb-3">توقيع الشركة</p>
                    <DigitalSignature
                      onSignatureComplete={handleCompanySignature}
                      onSignatureClear={handleClearCompanySignature}
                      width={300}
                      height={120}
                      strokeColor="#000000"
                      strokeWidth={3}
                      placeholder="توقيع الشركة"
                    />
                  </div>
                ) : (companySignature || tempCompanySignature) ? (
                  <div className="border-2 border-black rounded-lg p-2 bg-white">
                    <img 
                      src={companySignature || tempCompanySignature} 
                      alt="توقيع الشركة" 
                      className="w-full h-24 object-contain"
                    />
                    {showSignature && (
                      <button
                        onClick={handleClearCompanySignature}
                        className="mt-2 text-xs text-black hover:text-gray-600"
                      >
                        مسح التوقيع
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="border-b-2 border-black w-48 mx-auto mb-2 h-16 signature-box"></div>
                )}
              </div>
              <p className="font-bold text-lg text-black">توقيع الطرف الأول (المؤجر)</p>
              <p className="text-sm text-black mt-2">شركة البعد العالي للتجارة</p>
            </div>

            {/* توقيع العميل */}
            <div className="text-center">
              <div className="mb-8">
                {showSignature && !customerSignature && !tempCustomerSignature ? (
                  <div className="border-2 border-dashed border-black rounded-lg p-4 bg-white">
                    <p className="text-sm text-black mb-3">توقيع العميل</p>
                    <DigitalSignature
                      onSignatureComplete={handleCustomerSignature}
                      onSignatureClear={handleClearCustomerSignature}
                      width={300}
                      height={120}
                      strokeColor="#000000"
                      strokeWidth={3}
                      placeholder="توقيع العميل"
                    />
                  </div>
                ) : (customerSignature || tempCustomerSignature) ? (
                  <div className="border-2 border-black rounded-lg p-2 bg-white">
                    <img 
                      src={customerSignature || tempCustomerSignature} 
                      alt="توقيع العميل" 
                      className="w-full h-24 object-contain"
                    />
                    {showSignature && (
                      <button
                        onClick={handleClearCustomerSignature}
                        className="mt-2 text-xs text-black hover:text-gray-600"
                      >
                        مسح التوقيع
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="border-b-2 border-black w-48 mx-auto mb-2 h-16 signature-box"></div>
                )}
              </div>
              <p className="font-bold text-lg text-black">توقيع الطرف الثاني (المستأجر)</p>
              <p className="text-sm text-black mt-2">{contract.customerName}</p>
            </div>
          </div>

          {/* زر إكمال التوقيع */}
          {showSignature && (tempCustomerSignature || tempCompanySignature) && (
            <div className="mt-6 text-center">
              <button
                onClick={handleCompleteSignature}
                className="px-8 py-3 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors flex items-center gap-2 mx-auto"
              >
                <Check className="h-5 w-5" />
                إكمال التوقيع
              </button>
              <p className="text-sm text-black mt-2">
                اضغط لإكمال التوقيع وتأكيد العقد
              </p>
            </div>
          )}

          {/* معلومات إضافية للتوقيع الإلكتروني */}
          {(companySignature || customerSignature || isSignatureComplete) && (
            <div className="mt-6 p-4 bg-white border-r-4 border-black rounded">
              <div className="flex items-center gap-2 mb-2">
                <Check className="h-5 w-5 text-black" />
                <p className="font-bold text-black">التوقيع الإلكتروني</p>
              </div>
              <p className="text-sm text-black">
                تم التوقيع إلكترونياً في: {today ? today.toLocaleString('ar-SA') : ''}
              </p>
              <p className="text-xs text-black mt-1">
                هذا التوقيع له نفس القوة القانونية للتوقيع اليدوي
              </p>
            </div>
          )}

          {/* Contract Info Footer */}
          <div className="mt-8 pt-6 border-t border-black text-center text-sm text-black contract-footer">
            <p className="mb-1">رقم العقد: <span className="font-semibold">{contract.contractNumber}</span></p>
            <p>تاريخ الإصدار: <span className="font-semibold">{today ? formatFullDate(today.toISOString()) : ''}</span></p>
          </div>
        </div>
      </div>

      {/* نسخة منفصلة للطباعة - مخفية عن العرض العادي */}
      <div 
        ref={printRef} 
        className="contract-print-content" 
        dir="rtl" 
        style={{ 
          fontFamily: 'Arial, sans-serif',
          backgroundColor: 'white',
          color: 'black',
          padding: '20px',
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          width: '210mm',
          minHeight: '297mm'
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-8 pb-4 border-b-2 border-black contract-header">
          {/* Company Info - Right Side */}
          <div className="text-right">
            <h2 className="text-2xl font-bold text-black mb-1">الـبعد الـعالي للتجـارة</h2>
            <p className="text-sm font-semibold text-black mb-3" style={{ letterSpacing: '0.5px' }}>
              HIGHER DIMENSION TRD
            </p>
            <div className="space-y-1 text-sm text-black">
              <p>سلطنة عمان | ص.ب: 215 | الرمز البريدي: 619 | نقال: 93099914</p>
              <p style={{ direction: 'ltr', textAlign: 'right' }}>
                Sultanate of Oman | P.O. Box: 215 | P.C: 619 | GSM: 93099914
              </p>
            </div>
          </div>

          {/* Contract Number - Left Side */}
          <div className="text-left">
            <div className="bg-white border-2 border-black rounded-lg px-6 py-4">
              <p className="text-sm text-black mb-1">NO:</p>
              <p className="text-3xl font-bold text-black">{contract?.contractNumber}</p>
            </div>
          </div>
        </div>

        {/* Contract Title */}
        <div className="text-center mb-8 contract-title">
          <h1 className="text-3xl font-bold text-black mb-2">عقد إيجار معدات بناء</h1>
          <div className="w-full h-1 bg-black mb-4"></div>
        </div>

        {/* Contract Date */}
        <div className="mb-6 text-base leading-relaxed text-black contract-date">
          <p>
            إنه في يوم: <span className="font-semibold">{today ? formatFullDate(today.toISOString()) : ''}</span> الموافق{' '}
            <span className="font-semibold border-b border-black px-2">{today?.getDate() || ''}</span> /{' '}
            <span className="font-semibold border-b border-black px-2">{today ? today.getMonth() + 1 : ''}</span> /{' '}
            <span className="font-semibold border-b border-black px-2">{today?.getFullYear() || ''}</span> م، تم الإتفاق بين كل من:
          </p>
        </div>

        {/* Parties */}
        <div className="mb-6 space-y-3 contract-sections">
          <div className="bg-white p-4 rounded-lg border-r-4 border-black">
            <p className="text-lg font-bold mb-2 text-black">الطرف الأول (المالك):</p>
            <p className="text-base text-black">
              شركة البعد العالي للتجارة، س.ت: <span className="font-semibold">1208502</span>، ومقرها ولاية السيب،{' '}
              هاتف: <span className="font-semibold">٩٣٠٩٩٩١٤</span>.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border-r-4 border-black">
            <p className="text-lg font-bold mb-2 text-black">الطرف الثاني (المستأجر):</p>
            <p className="text-base mb-2 text-black">
              شركة / مؤسسة: <span className="font-semibold">{contract?.customerName}</span>
            </p>
            <p className="text-base mb-2 text-black">
              س.ت: <span className="font-semibold">{contract?.customerId}</span>
            </p>
            <div className="space-y-1 mt-2">
              <p className="text-base text-black">
                ويمثلها في هذا العقد: <span className="inline-block border-b border-black w-64 mx-1"></span>{' '}
                بصفته: <span className="inline-block border-b border-black w-32 mx-1"></span>
              </p>
              <p className="text-base text-black">
                <span className="inline-block border-b border-black w-64 mx-14"></span>{' '}
                بصفته: <span className="inline-block border-b border-black w-32 mx-1"></span>
              </p>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="mb-6 p-4 bg-white border-r-4 border-black rounded contract-sections">
          <p className="text-lg font-bold mb-2 text-black">مقدمة:</p>
          <p className="text-base leading-relaxed text-justify text-black">
            الطرف الأول منشأة تمتلك عدد من المعدات، وقد أبدى الطرف الثاني رغبته في استئجار عدد منها بغرض الانتفاع بها لفترة زمنية محددة، وقد اتفق الطرفان على ما يلي:
          </p>
        </div>

        {/* First: Equipment Table */}
        <div className="mb-6">
          <p className="text-lg font-bold mb-4 text-black">
            أولاً: بموجب هذا العقد التزم المالك (الطرف الأول) بتأجير عدد من المعدات للمستأجر (الطرف الثاني) والمبينة أوصافها فيما يلي:
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full border-2 border-black contract-table">
              <thead>
                <tr className="bg-white border-2 border-black">
                  <th className="border-2 border-black p-3 text-center font-bold text-black">م</th>
                  <th className="border-2 border-black p-3 text-center font-bold text-black">النوع</th>
                  <th className="border-2 border-black p-3 text-center font-bold text-black">العدد</th>
                  <th className="border-2 border-black p-3 text-center font-bold text-black">تاريخ الإيجار</th>
                  <th className="border-2 border-black p-3 text-center font-bold text-black">تاريخ الإرجاع</th>
                  <th className="border-2 border-black p-3 text-center font-bold text-black">المدة</th>
                  <th className="border-2 border-black p-3 text-center font-bold text-black">قيمة الإيجار</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-2 border-black">
                  <td className="border-2 border-black p-3 text-center font-semibold text-black">1</td>
                  <td className="border-2 border-black p-3 text-center text-black">{contract?.contractType}</td>
                  <td className="border-2 border-black p-3 text-center font-semibold text-black">{contract?.equipmentCount}</td>
                  <td className="border-2 border-black p-3 text-center text-black">{formatDate(contract?.startDate || '')}</td>
                  <td className="border-2 border-black p-3 text-center text-black">{formatDate(contract?.endDate || '')}</td>
                  <td className="border-2 border-black p-3 text-center font-semibold text-black">{duration} يوم</td>
                  <td className="border-2 border-black p-3 text-center font-bold text-black">{formatCurrency(contract?.totalValue || 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Second: Place of Agreement */}
        <div className="mb-4 p-4 bg-white rounded border-r-4 border-black contract-sections">
          <p className="text-lg mb-2 text-black">
            <span className="font-bold">ثانياً: مكان الاتفاق:</span>
          </p>
          <p className="text-base mr-4 text-black">{contract?.location || 'ولاية السيب'}</p>
        </div>

        {/* Third: Contract Duration */}
        <div className="mb-4 p-4 bg-white rounded border-r-4 border-black contract-sections">
          <p className="text-lg mb-2 text-black">
            <span className="font-bold">ثالثاً: مدة العقد:</span>
          </p>
          <p className="text-base leading-relaxed mr-4 text-justify text-black">
            مدة هذا العقد تبدأ من تاريخ إستلام المستأجر للمعدات الموضحة في العقد، وتتجدد تلقائياً لفترة مماثلة بعد انقضاء مدة العقد الأصلية في حالة عدم إرجاع المعدات وعدم الإخطار، وفي هذه الحالة يحق للطرف الأول تحديد سعر إيجار جديد بعد انتهاء هذا العقد.
          </p>
        </div>

        {/* Fourth: Tenant Obligations */}
        <div className="mb-4 p-4 bg-white rounded border-r-4 border-black contract-sections">
          <p className="text-lg mb-3 text-black">
            <span className="font-bold">رابعاً: التزامات المستأجر:</span>
          </p>
          <div className="space-y-3 mr-4 text-base leading-relaxed">
            <p className="text-justify text-black">
              • يلتزم المستأجر بتمكين المؤجر أو من يمثله بمعاينة المعدات المؤجرة وتفقدها وصيانتها في أى وقت أو سحبها ونقلها في حال تخلف المستأجر عن سداد قيمة الإيجار مقدماً أو الإخلال بشروط العقد دون أن يتحمل أي مسئولية نتيجة الضرر الناتج عن سحب المعدات أو فكها من الموقع ويعد هذا الشرط بمثابة الإخطار المسبق للمستأجر.
            </p>
            <p className="text-justify text-black">
              • يقر المستأجر بأنه قد عاين المعدات المؤجرة معاينة نافية للجهالة وقبلها بحالتها الراهنة، وأنها صالحة للإستعمال.
            </p>
            <p className="text-justify text-black">
              • إذا تسبب المستأجر في فقد المعدة أو تلفها كلياً أو جزئياً بفعله أو بفعل الغير يلتزم بتعويض المالك بقيمتها حسب الشراء.
            </p>
            <p className="text-justify text-black">
              • جميع العقود المبرمة حول الكميات المستأجرة يتم إعادة إحتساب قيمة إيجارية أخرى في حالة إرجاع جزء منها بعقد جديد ولا ينطبق سعر الإيجار على أي إتفاق آخر خارج عن هذا العقد، ويحدد الطرف الأول (المؤجر) القيمة الإيجارية الجديدة.
            </p>
            <p className="text-justify text-black">
              • يحق للمالك تحديد قيمة إيجارية جديدة حسب رؤيته بعد إنتهاء هذا العقد أو التجديد التلقائي ويعد هذا الشرط بمثابة الإخطار المسبق للمستأجر.
            </p>
            <p className="text-justify text-black">
              • يقر الطرف الثاني (المستأجر) بتخويل أى شخص يعمل لديه باستلام المعدات وتسليمها.
            </p>
            <p className="text-justify text-black">
              • لا يعتد بأى إدعاء حول إرجاع المعدات ما لم يقدم المستأجر ما يفيد ذلك كتابياً موقعاً من طرف المؤجر.
            </p>
          </div>
        </div>

        {/* Fifth: Dispute Resolution */}
        <div className="mb-8 p-4 bg-white rounded border-r-4 border-black contract-sections">
          <p className="text-lg mb-3 text-black">
            <span className="font-bold">خامساً: الفصل في النزاع:</span>
          </p>
          <p className="text-base leading-relaxed mr-4 text-justify text-black">
            أي نزاع قد ينشأ عن تنفيذ هذا العقد أو تفسير نصوصه إن لم يتم حسمه بالتراضي يتم الفصل فيه لدى الجهات القضائية والمحاكم المختصة بولاية السيب وفي حالة وجود بند غير واضح يفسر لصالح المؤجر ويستمر إحتساب القيمة الإيجارية لحين إرجاع المعدات.
          </p>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t-2 border-black signatures">
          {/* توقيع الشركة */}
          <div className="text-center">
            <div className="mb-8">
              {(companySignature || tempCompanySignature) ? (
                <div className="border-2 border-black rounded-lg p-2 bg-white">
                  <img 
                    src={companySignature || tempCompanySignature} 
                    alt="توقيع الشركة" 
                    className="w-full h-24 object-contain"
                  />
                </div>
              ) : (
                <div className="border-b-2 border-black w-48 mx-auto mb-2 h-16 signature-box"></div>
              )}
            </div>
            <p className="font-bold text-lg text-black">توقيع الطرف الأول (المؤجر)</p>
            <p className="text-sm text-black mt-2">شركة البعد العالي للتجارة</p>
          </div>

          {/* توقيع العميل */}
          <div className="text-center">
            <div className="mb-8">
              {(customerSignature || tempCustomerSignature) ? (
                <div className="border-2 border-black rounded-lg p-2 bg-white">
                  <img 
                    src={customerSignature || tempCustomerSignature} 
                    alt="توقيع العميل" 
                    className="w-full h-24 object-contain"
                  />
                </div>
              ) : (
                <div className="border-b-2 border-black w-48 mx-auto mb-2 h-16 signature-box"></div>
              )}
            </div>
            <p className="font-bold text-lg text-black">توقيع الطرف الثاني (المستأجر)</p>
            <p className="text-sm text-black mt-2">{contract?.customerName}</p>
          </div>
        </div>

        {/* Contract Info Footer */}
        <div className="mt-8 pt-6 border-t border-black text-center text-sm text-black contract-footer">
          <p className="mb-1">رقم العقد: <span className="font-semibold">{contract?.contractNumber}</span></p>
          <p>تاريخ الإصدار: <span className="font-semibold">{today ? formatFullDate(today.toISOString()) : ''}</span></p>
        </div>
      </div>
    </div>
  );
}

