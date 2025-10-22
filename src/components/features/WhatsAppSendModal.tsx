/**
 * مكون إرسال العقد عبر الواتساب
 */

'use client';

import React, { useState, useRef } from 'react';
import { X, Send, MessageSquare, Phone, FileText, Check, Download, Eye, Copy } from 'lucide-react';
import { ContractFormData } from '@/lib/types/contract';
import InvoiceModal from './InvoiceModal';

interface WhatsAppSendModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: ContractFormData;
  onSend: (phoneNumber: string, message: string, pdfFile?: File) => Promise<void>;
  isLoading?: boolean;
}

export default function WhatsAppSendModal({
  isOpen,
  onClose,
  contract,
  onSend,
  isLoading = false
}: WhatsAppSendModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [isValidPhone, setIsValidPhone] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [generatedPdfFile, setGeneratedPdfFile] = useState<File | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // التحقق من صحة رقم الهاتف
  const validatePhoneNumber = (phone: string) => {
    // إزالة المسافات والرموز
    const cleanPhone = phone.replace(/[\s\-()]/g, '');
    // التحقق من أن الرقم يبدأ بـ 968 (عمان) أو رقم محلي
    const omanPattern = /^(968|0)?[0-9]{8}$/;
    return omanPattern.test(cleanPhone);
  };

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    setIsValidPhone(validatePhoneNumber(value));
  };

  const formatPhoneNumber = (phone: string) => {
    const cleanPhone = phone.replace(/[\s\-()]/g, '');
    if (cleanPhone.startsWith('968')) {
      return `+${cleanPhone}`;
    } else if (cleanPhone.startsWith('0')) {
      return `+968${cleanPhone.substring(1)}`;
    } else {
      return `+968${cleanPhone}`;
    }
  };

  // تحويل بيانات النموذج إلى تنسيق متوافق مع InvoiceModal
  const convertToContractData = () => {
    const firstRentalItem = contract.rentalDetails[0];
    const startDate = firstRentalItem?.startDate || contract.contractDate;
    const endDate = firstRentalItem?.endDate || contract.contractDate;
    
    return {
      id: contract.contractNumber,
      contractNumber: contract.contractNumber,
      customerName: contract.customerName,
      customerId: contract.customerId,
      contractType: 'تأجير' as const,
      startDate,
      endDate,
      totalValue: contract.totalAfterDiscount,
      paidAmount: contract.totalPayments,
      remainingAmount: contract.totalAfterDiscount - contract.totalPayments,
      location: contract.deliveryAddress,
      equipmentCount: contract.rentalDetails.reduce((sum, item) => sum + item.quantity, 0),
      status: 'نشط' as const,
      paymentStatus: contract.totalPayments >= contract.totalAfterDiscount ? 'مدفوع بالكامل' as const : 'مدفوع جزئياً' as const,
      priority: 'متوسط' as const,
      createdAt: contract.contractDate,
      updatedAt: contract.contractDate
    };
  };

  // توليد PDF من نموذج الفاتورة
  const generateContractPDF = async () => {
    setIsGeneratingPdf(true);
    try {
      if (!invoiceRef.current) {
        throw new Error('لا يمكن العثور على عنصر العقد');
      }

      // استيراد html2pdf ديناميكياً
      const html2pdf = (await import('html2pdf.js')).default;

      // إعدادات html2pdf
      const opt = {
        margin: [0.2, 0.2, 0.2, 0.2] as [number, number, number, number],
        filename: `عقد_إيجار_معدات_بناء_${contract.contractNumber}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.95 },
        html2canvas: { 
          scale: 1.5,
          useCORS: true,
          letterRendering: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: invoiceRef.current.offsetWidth,
          height: invoiceRef.current.scrollHeight,
          scrollX: 0,
          scrollY: 0,
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight,
          dpi: 300,
          foreignObjectRendering: true
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'portrait' as const,
          compress: false,
          precision: 2
        },
        pagebreak: { 
          mode: ['avoid-all', 'css', 'legacy'],
          before: '.page-break-before',
          after: '.page-break-after',
          avoid: '.avoid-break'
        }
      };
      
      const pdfBlob = await html2pdf().set(opt).from(invoiceRef.current).output('blob');
      
      // تحويل Blob إلى File
      const pdfFile = new File([pdfBlob], `عقد_إيجار_معدات_بناء_${contract.contractNumber}.pdf`, {
        type: 'application/pdf'
      });
      
      setGeneratedPdfFile(pdfFile);
      
      // إظهار رسالة نجاح
      alert('تم إنشاء ملف PDF بنجاح!');
      
    } catch (error) {
      console.error('خطأ في إنشاء PDF:', error);
      alert('حدث خطأ في إنشاء ملف PDF. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const generateWhatsAppMessage = () => {
    const contractUrl = `${window.location.origin}/contract/sign/${contract.contractNumber}`;
    
    const defaultMessage = `السلام عليكم ورحمة الله وبركاته

أهلاً وسهلاً بكم في شركة البعد العالي للتجارة

تم إعداد عقد إيجار معدات بناء برقم: *${contract.contractNumber}*

تفاصيل العقد:
• العميل: ${contract.customerName}
• القيمة الإجمالية: ${contract.totalAfterDiscount.toLocaleString()} ر.ع
• تاريخ العقد: ${contract.contractDate}
• نوع العقد: تأجير معدات بناء

يرجى مراجعة العقد والتوقيع عليه من خلال الرابط التالي:
${contractUrl}

بعد التوقيع سيتم إرسال نسخة موقعة إليكم

شكراً لثقتكم بنا
شركة البعد العالي للتجارة`;

    return defaultMessage;
  };

  const handleSend = async () => {
    if (!isValidPhone) return;
    
    const formattedPhone = formatPhoneNumber(phoneNumber);
    const message = customMessage || generateWhatsAppMessage();
    
    try {
      await onSend(formattedPhone, message, generatedPdfFile || undefined);
      onClose();
    } catch (error) {
      console.error('خطأ في الإرسال:', error);
    }
  };

  const openWhatsAppDirect = () => {
    if (!isValidPhone) return;
    
    const formattedPhone = formatPhoneNumber(phoneNumber);
    const message = customMessage || generateWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  const copyMessageToClipboard = async () => {
    try {
      const message = customMessage || generateWhatsAppMessage();
      await navigator.clipboard.writeText(message);
      setIsCopied(true);
      
      // إعادة تعيين حالة النسخ بعد ثانيتين
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error('خطأ في نسخ الرسالة:', error);
      alert('حدث خطأ في نسخ الرسالة. يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">إرسال العقد عبر الواتساب</h2>
              <p className="text-sm text-gray-600">إرسال العقد للعميل للتوقيع</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* معلومات العقد */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">معلومات العقد</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">رقم العقد:</span>
                <span className="font-medium text-gray-900 mr-2">{contract.contractNumber}</span>
              </div>
              <div>
                <span className="text-gray-600">اسم العميل:</span>
                <span className="font-medium text-gray-900 mr-2">{contract.customerName}</span>
              </div>
              <div>
                <span className="text-gray-600">القيمة الإجمالية:</span>
                <span className="font-medium text-gray-900 mr-2">{contract.totalAfterDiscount.toLocaleString()} ر.ع</span>
              </div>
              <div>
                <span className="text-gray-600">تاريخ العقد:</span>
                <span className="font-medium text-gray-900 mr-2">{contract.contractDate}</span>
              </div>
            </div>
          </div>

          {/* رقم الهاتف */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Phone className="h-4 w-4" />
              رقم الهاتف
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="96812345678 أو 12345678"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent ${
                  phoneNumber && !isValidPhone 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300'
                }`}
              />
              {phoneNumber && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  {isValidPhone ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                </div>
              )}
            </div>
            {phoneNumber && !isValidPhone && (
              <p className="text-sm text-red-600">
                يرجى إدخال رقم هاتف صحيح (8 أرقام أو 968 + 8 أرقام)
              </p>
            )}
            <p className="text-xs text-gray-500">
              يمكن إدخال الرقم بدون رمز البلد أو مع +968
            </p>
          </div>

          {/* الرسالة المخصصة */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <MessageSquare className="h-4 w-4" />
              الرسالة المخصصة (اختياري)
            </label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="اكتب رسالة مخصصة أو اتركها فارغة لاستخدام الرسالة الافتراضية"
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58d2c8] focus:border-transparent resize-none"
            />
          </div>

          {/* أزرار معاينة العقد وتوليد PDF */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-3">معاينة وتوليد العقد:</h4>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowInvoiceModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Eye className="h-4 w-4" />
                معاينة نموذج العقد
              </button>
              <button
                onClick={generateContractPDF}
                disabled={isGeneratingPdf}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                {isGeneratingPdf ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {isGeneratingPdf ? 'جاري التوليد...' : 'توليد PDF'}
              </button>
            </div>
            {generatedPdfFile && (
              <div className="mt-3 p-3 bg-green-100 border border-green-300 rounded-lg">
                <div className="flex items-center gap-2 text-green-800">
                  <Check className="h-4 w-4" />
                  <span className="font-medium">تم إنشاء ملف PDF بنجاح:</span>
                </div>
                <p className="text-sm text-green-700 mt-1">{generatedPdfFile.name}</p>
                <p className="text-xs text-green-600 mt-1">
                  سيتم إرفاق هذا الملف مع الرسالة عند الإرسال
                </p>
              </div>
            )}
          </div>

          {/* معاينة الرسالة */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">معاينة الرسالة:</h4>
            <div className="bg-white rounded border p-3 text-sm text-gray-700 whitespace-pre-wrap max-h-40 overflow-y-auto">
              {customMessage || generateWhatsAppMessage()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            إلغاء
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={copyMessageToClipboard}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                isCopied 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              {isCopied ? (
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
            <button
              onClick={openWhatsAppDirect}
              disabled={!isValidPhone}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              فتح الواتساب
            </button>
            <button
              onClick={handleSend}
              disabled={!isValidPhone || isLoading}
              className="flex items-center gap-2 px-6 py-2 bg-[#58d2c8] hover:bg-[#4AB8B3] disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
              {isLoading ? 'جاري الإرسال...' : 'إرسال عبر النظام'}
            </button>
          </div>
        </div>
      </div>

      {/* نافذة معاينة العقد */}
      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        contract={convertToContractData()}
      />

      {/* نسخة مخفية للـ PDF */}
      <div 
        ref={invoiceRef} 
        className="hidden"
        style={{ 
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          width: '210mm',
          minHeight: '297mm',
          backgroundColor: 'white',
          color: 'black',
          padding: '20px',
          fontFamily: 'Arial, sans-serif',
          direction: 'rtl'
        }}
      >
        {/* محتوى العقد للـ PDF - نفس محتوى InvoiceModal */}
        <div className="contract-print-content">
          {/* Header */}
          <div className="flex items-start justify-between mb-8 pb-4 border-b-2 border-black">
            <div className="text-right">
              <h2 className="text-2xl font-bold text-black mb-1">الـبعد الـعالي للتجـارة</h2>
              <p className="text-sm font-semibold text-black mb-3">HIGHER DIMENSION TRD</p>
              <div className="space-y-1 text-sm text-black">
                <p>سلطنة عمان | ص.ب: 215 | الرمز البريدي: 619 | نقال: 93099914</p>
                <p>Sultanate of Oman | P.O. Box: 215 | P.C: 619 | GSM: 93099914</p>
              </div>
            </div>
            <div className="text-left">
              <div className="bg-white border-2 border-black rounded-lg px-6 py-4">
                <p className="text-sm text-black mb-1">NO:</p>
                <p className="text-3xl font-bold text-black">{contract.contractNumber}</p>
              </div>
            </div>
          </div>

          {/* Contract Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">عقد إيجار معدات بناء</h1>
            <div className="w-full h-1 bg-black mb-4"></div>
          </div>

          {/* Contract Date */}
          <div className="mb-6 text-base leading-relaxed text-black">
            <p>
              إنه في يوم: <span className="font-semibold">{new Date(contract.contractDate).toLocaleDateString('ar-SA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span> الموافق{' '}
              <span className="font-semibold border-b border-black px-2">{new Date(contract.contractDate).getDate()}</span> /{' '}
              <span className="font-semibold border-b border-black px-2">{new Date(contract.contractDate).getMonth() + 1}</span> /{' '}
              <span className="font-semibold border-b border-black px-2">{new Date(contract.contractDate).getFullYear()}</span> م، تم الإتفاق بين كل من:
            </p>
          </div>

          {/* Parties */}
          <div className="mb-6 space-y-3">
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
            </div>
          </div>

          {/* Equipment Table */}
          <div className="mb-6">
            <p className="text-lg font-bold mb-4 text-black">
              أولاً: بموجب هذا العقد التزم المالك (الطرف الأول) بتأجير عدد من المعدات للمستأجر (الطرف الثاني) والمبينة أوصافها فيما يلي:
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-2 border-black">
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
                  {contract.rentalDetails.map((item, index) => (
                    <tr key={item.id} className="border-2 border-black">
                      <td className="border-2 border-black p-3 text-center font-semibold text-black">{index + 1}</td>
                      <td className="border-2 border-black p-3 text-center text-black">{item.itemDescription}</td>
                      <td className="border-2 border-black p-3 text-center font-semibold text-black">{item.quantity}</td>
                      <td className="border-2 border-black p-3 text-center text-black">{item.startDate}</td>
                      <td className="border-2 border-black p-3 text-center text-black">{item.endDate}</td>
                      <td className="border-2 border-black p-3 text-center font-semibold text-black">{item.duration} {item.durationType === 'monthly' ? 'شهر' : 'يوم'}</td>
                      <td className="border-2 border-black p-3 text-center font-bold text-black">{item.total.toFixed(2)} ر.ع</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total */}
          <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">إجمالي العقد بعد الخصم</p>
                <p className="text-2xl font-bold text-[#58d2c8]">{contract.totalAfterDiscount.toFixed(2)} ر.ع</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">المبلغ المدفوع</p>
                <p className="text-2xl font-bold text-green-600">{contract.totalPayments.toFixed(2)} ر.ع</p>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t-2 border-black">
            <div className="text-center">
              <div className="border-b-2 border-black w-48 mx-auto mb-2 h-16"></div>
              <p className="font-bold text-lg text-black">توقيع الطرف الأول (المؤجر)</p>
              <p className="text-sm text-black mt-2">شركة البعد العالي للتجارة</p>
            </div>
            <div className="text-center">
              <div className="border-b-2 border-black w-48 mx-auto mb-2 h-16"></div>
              <p className="font-bold text-lg text-black">توقيع الطرف الثاني (المستأجر)</p>
              <p className="text-sm text-black mt-2">{contract.customerName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
