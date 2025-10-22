/**
 * مكون توليد سند استلام البضاعة - محسن ومتكامل مع النظام الجديد
 */

'use client';

import React, { useState } from 'react';
import { FileText, Printer, X, ArrowRight } from 'lucide-react';
import { ContractManagementData } from '@/data/contractsManagementData';
import PrintStyles from './PrintStyles';
import { PDFDownloadButton } from './PDFGenerator';

interface DeliveryReceiptGeneratorProps {
  contract: ContractManagementData;
  employeeName: string;
  onClose: () => void;
  onBack?: () => void;
}

interface SignatoryInfo {
  name: string;
  idNumber: string;
  phone: string;
  signature?: string;
}

export default function DeliveryReceiptGenerator({ 
  contract, 
  employeeName, 
  onClose,
  onBack
}: DeliveryReceiptGeneratorProps) {
  
  // حالة معلومات المستلم والمسلم
  const [recipientInfo, _setRecipientInfo] = useState<SignatoryInfo>({
    name: '',
    idNumber: '',
    phone: ''
  });
  
  const [delivererInfo, _setDelivererInfo] = useState<SignatoryInfo>({
    name: employeeName || '',
    idNumber: '',
    phone: ''
  });
  
  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // الحصول على التاريخ الحالي
  const currentDate = new Date().toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // إنشاء رقم السند
  const receiptNumber = `DR-CTR-2024-010-${contract.contractNumber.split('-').pop() || '941794'}`;

  // محاكاة بيانات البضاعة (يمكن استبدالها ببيانات حقيقية من قاعدة البيانات)
  const equipmentItems = [
    {
      code: 'EQ-001',
      descriptionAr: 'سقالة معدنية متحركة',
      descriptionEn: 'Mobile Metal Scaffold',
      quantity: 10,
      notes: 'حالة جيدة'
    },
    {
      code: 'EQ-002', 
      descriptionAr: 'رافعة صغيرة',
      descriptionEn: 'Small Crane',
      quantity: 2,
      notes: 'تم فحصها'
    },
    {
      code: 'EQ-003',
      descriptionAr: 'مضخة مياه',
      descriptionEn: 'Water Pump',
      quantity: 5,
      notes: 'جديدة'
    }
  ];

  // طباعة السند
  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 100);
  };

  // تحميل السند كـ PDF (تم استبداله بـ PDFDownloadButton)
  const _handleDownload = () => {
    // تم استبدال هذه الوظيفة بـ PDFDownloadButton المحسن
  };

  // محتوى السند
  const getReceiptContent = () => {
    return `
      <div class="header">
        <h1 style="color: #58d2c8; margin: 0;">سند استلام بضاعة</h1>
        <p style="margin: 10px 0;">Receipt of Goods</p>
      </div>

      <div class="section">
        <h3>معلومات السند</h3>
        <table>
          <tr>
            <td><strong>رقم السند:</strong></td>
            <td>${receiptNumber}</td>
            <td><strong>تاريخ الاستلام:</strong></td>
            <td>${currentDate}</td>
          </tr>
        </table>
      </div>

      <div class="section">
        <h3>معلومات العميل</h3>
        <table>
          <tr>
            <td><strong>اسم العميل:</strong></td>
            <td>${contract.customerName}</td>
            <td><strong>رقم العميل:</strong></td>
            <td>${contract.customerId}</td>
          </tr>
          <tr>
            <td><strong>عنوان موقع التسليم:</strong></td>
            <td colspan="3">${contract.location}</td>
          </tr>
        </table>
      </div>

      <div class="section">
        <h3>تفاصيل أمر التوصيل</h3>
        <table>
          <tr>
            <td><strong>رقم أمر التوصيل:</strong></td>
            <td>${contract.contractNumber}</td>
            <td><strong>تاريخ التسليم/الاسترجاع المتوقع:</strong></td>
            <td>${formatDate(contract.endDate)}</td>
          </tr>
        </table>
      </div>

      <div class="section">
        <h3>تفاصيل البضاعة المستلمة</h3>
        <table>
          <thead>
            <tr>
              <th>كود الصنف</th>
              <th>وصف الصنف (عربي)</th>
              <th>وصف الصنف (إنجليزي)</th>
              <th>الكمية</th>
              <th>ملاحظات</th>
            </tr>
          </thead>
          <tbody>
            ${equipmentItems.map(item => `
              <tr>
                <td>${item.code}</td>
                <td>${item.descriptionAr}</td>
                <td>${item.descriptionEn}</td>
                <td>${item.quantity}</td>
                <td>${item.notes}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="section">
        <h3>حالة البضاعة المستلمة</h3>
        <table>
          <tr>
            <td><strong>الحالة العامة:</strong></td>
            <td>جيد</td>
          </tr>
          <tr>
            <td><strong>ملاحظات إضافية على الاستلام:</strong></td>
            <td>تم فحص جميع المعدات والتأكد من مطابقتها للمواصفات</td>
          </tr>
        </table>
      </div>

      <div class="signature-area">
        <h3>المستلم</h3>
        <table>
          <tr>
            <td><strong>اسم المستلم:</strong></td>
            <td>${employeeName}</td>
            <td><strong>التوقيع:</strong></td>
            <td>_________________________</td>
          </tr>
          <tr>
            <td><strong>رقم الهوية:</strong></td>
            <td>_________________________</td>
            <td><strong>التاريخ:</strong></td>
            <td>${currentDate}</td>
          </tr>
        </table>
      </div>

      <div class="section" style="margin-top: 30px; background-color: #f8f9fa;">
        <h3>ملاحظات هامة:</h3>
        <ul style="margin: 10px 0; padding-right: 20px;">
          <li>يجب فحص البضاعة جيدًا عند الاستلام والتأكد من مطابقتها لأمر التوصيل.</li>
          <li>في حال وجود أي تلف أو نقص، يرجى تسجيله في قسم "حالة البضاعة المستلمة" وإبلاغ الإدارة فورًا.</li>
          <li>هذا السند يعتبر وثيقة رسمية للاستلام ويجب الاحتفاظ بنسخة منه.</li>
        </ul>
      </div>
    `;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[70]">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10 no-print">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="العودة للصفحة السابقة"
              >
                <ArrowRight className="h-5 w-5 text-gray-500" />
              </button>
            )}
            <div className="p-2 bg-[#58d2c8]/10 rounded-lg">
              <FileText className="h-6 w-6 text-[#58d2c8]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">سند استلام بضاعة</h2>
              <p className="text-sm text-gray-600 mt-1">رقم السند: {receiptNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              طباعة
            </button>
            <PDFDownloadButton 
              data={{
                receiptNumber,
                deliveryDate: currentDate,
                customerName: contract.customerName,
                customerPhone: contract.customerId || '',
                deliveryAddress: contract.location,
                driverName: employeeName,
                driverPhone: '',
                items: equipmentItems.map((item, index) => ({
                  id: `item-${index}`,
                  name: item.descriptionAr,
                  quantity: item.quantity,
                  condition: 'good' as const,
                  notes: item.notes
                })),
                totalItems: equipmentItems.reduce((sum, item) => sum + item.quantity, 0),
                status: 'completed' as const,
                receiverName: recipientInfo.name,
                receiverPhone: recipientInfo.phone,
                receiverSignature: recipientInfo.signature || '',
                delivererSignature: delivererInfo.signature || '',
                notes: 'تم فحص جميع المعدات والتأكد من مطابقتها للمواصفات',
                relatedOrders: [contract.contractNumber]
              }}
            />
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 delivery-receipt-print" dangerouslySetInnerHTML={{ __html: getReceiptContent() }} />

        {/* Print Styles */}
        <PrintStyles />

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 no-print">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
