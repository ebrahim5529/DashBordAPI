/**
 * صفحة توقيع العقد من الرابط
 * تم تحويلها من Next.js إلى React Router
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, Check, AlertCircle, User, Calendar, DollarSign } from 'lucide-react';
import DigitalSignature from '@/components/features/DigitalSignature';
import InvoiceModal from '@/components/features/InvoiceModal';

interface RentalDetail {
  id: string;
  equipmentType: string;
  quantity: number;
  dailyRate: number;
  totalDays: number;
  totalAmount: number;
  startDate: string;
  endDate: string;
  description?: string;
}

interface ContractData {
  contractNumber: string;
  customerName: string;
  customerId: string;
  contractDate: string;
  startDate: string;
  endDate: string;
  totalValue: number;
  contractType: string;
  deliveryAddress: string;
  locationMapLink?: string;
  transportAndInstallationCost: number;
  totalDiscount: number;
  totalAfterDiscount: number;
  rentalDetails: RentalDetail[];
  contractNotes?: string;
  status: 'pending' | 'signed' | 'completed';
  signatureData?: string;
  signedAt?: string;
}

export default function ContractSign() {
  const { contractNumber } = useParams<{ contractNumber: string }>();
  
  const [contract, setContract] = useState<ContractData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigning, setIsSigning] = useState(false);
  const [customerSignature, setCustomerSignature] = useState<string>('');
  const [_showSignature, setShowSignature] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [isSavingSignature, setIsSavingSignature] = useState(false);
  const [error, setError] = useState<string>('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [companySignature, setCompanySignature] = useState<string | null>(null);
  const [_companySignatureInfo, setCompanySignatureInfo] = useState<any>(null);

  // تحميل توقيع الشركة
  useEffect(() => {
    const loadCompanySignature = async () => {
      try {
        const response = await fetch('/api/company-signature');
        if (response.ok) {
          const data = await response.json();
          console.log('توقيع الشركة المحمل:', data);
          if (data.signaturePath) {
            setCompanySignature(data.signaturePath);
            setCompanySignatureInfo(data);
          }
        }
      } catch (error) {
        console.error('خطأ في تحميل توقيع الشركة:', error);
      }
    };
    
    loadCompanySignature();
  }, []);

  // تحميل بيانات العقد
  useEffect(() => {
    const loadContract = async () => {
      try {
        setIsLoading(true);
        // هنا سيتم استدعاء API لتحميل بيانات العقد
        // مؤقتاً، سنستخدم بيانات وهمية
        const mockContract: ContractData = {
          contractNumber: contractNumber || '',
          customerName: 'شركة البناء الحديث',
          customerId: 'CUST-001',
          contractDate: new Date().toISOString().split('T')[0],
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          totalValue: 15000,
          contractType: 'تأجير',
          deliveryAddress: 'مسقط، سلطنة عمان',
          locationMapLink: 'https://maps.google.com/?q=مسقط',
          transportAndInstallationCost: 500,
          totalDiscount: 1000,
          totalAfterDiscount: 14500,
          rentalDetails: [
            {
              id: '1',
              equipmentType: 'سقالات معدنية',
              quantity: 20,
              dailyRate: 50,
              totalDays: 30,
              totalAmount: 30000,
              startDate: new Date().toISOString().split('T')[0],
              endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              description: 'سقالات معدنية عالية الجودة للمشروع'
            }
          ],
          contractNotes: 'عقد تأجير معدات بناء لمشروع سكني',
          status: 'pending'
        };
        
        setContract(mockContract);
      } catch (error) {
        console.error('خطأ في تحميل العقد:', error);
        setError('حدث خطأ في تحميل بيانات العقد');
      } finally {
        setIsLoading(false);
      }
    };

    if (contractNumber) {
      loadContract();
    }
  }, [contractNumber]);

  // معالجة التوقيع
  const handleSignature = async (signatureData: string) => {
    setCustomerSignature(signatureData);
    setIsSavingSignature(true);
  };

  // حفظ التوقيع
  const handleSaveSignature = async () => {
    if (!customerSignature || !contract) {
      alert('يرجى التوقيع أولاً');
      return;
    }

    setIsSigning(true);
    setError('');

    try {
      const response = await fetch('/api/contracts/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractNumber,
          signatureData: customerSignature,
          customerName: contract?.customerName || 'غير محدد'
        }),
      });

      if (!response.ok) {
        throw new Error('فشل في حفظ التوقيع');
      }

      setIsSigned(true);
      setShowSignature(false);
      setIsSavingSignature(false);
      alert('✓ تم التوقيع على العقد بنجاح!');
    } catch (error) {
      console.error('خطأ في التوقيع:', error);
      alert(`حدث خطأ في التوقيع: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    } finally {
      setIsSigning(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#58d2c8] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات العقد...</p>
        </div>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">خطأ في تحميل العقد</h1>
          <p className="text-gray-600">{error || 'العقد غير موجود'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#58d2c8]/10 rounded-lg">
                <FileText className="h-6 w-6 text-[#58d2c8]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">توقيع العقد</h1>
                <p className="text-gray-600">رقم العقد: {contract.contractNumber}</p>
              </div>
            </div>
            
            {isSigned && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                <Check className="h-5 w-5" />
                <span className="font-medium">تم التوقيع</span>
              </div>
            )}
          </div>
        </div>

        {/* معلومات العقد */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            تفاصيل العقد
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">اسم العميل</p>
                  <p className="font-medium text-gray-900">{contract.customerName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">تاريخ العقد</p>
                  <p className="font-medium text-gray-900">{contract.contractDate}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">القيمة الإجمالية</p>
                  <p className="font-medium text-gray-900">{contract.totalValue.toLocaleString()} ر.ع</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">نوع العقد</p>
                  <p className="font-medium text-gray-900">{contract.contractType}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* منطقة التوقيع */}
        {!isSigned ? (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">التوقيع على العقد</h2>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-[#58d2c8] rounded-lg p-4 bg-gray-50">
                <DigitalSignature
                  onSignatureComplete={handleSignature}
                  onSignatureClear={() => {
                    setCustomerSignature('');
                    setIsSavingSignature(false);
                  }}
                  width={400}
                  height={200}
                  strokeColor="#000000"
                  strokeWidth={2}
                  placeholder="اضغط هنا للتوقيع"
                />
              </div>
              
              {isSavingSignature && (
                <button
                  onClick={handleSaveSignature}
                  disabled={isSigning}
                  className="w-full px-6 py-3 bg-[#58d2c8] hover:bg-[#4AB8B3] disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  {isSigning ? 'جاري حفظ التوقيع...' : 'حفظ التوقيع'}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="p-3 bg-green-100 rounded-full inline-block mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">تم التوقيع بنجاح!</h2>
            <p className="text-gray-600 mb-6">
              شكراً لتوقيعك على العقد
            </p>
            <button
              onClick={() => setShowInvoiceModal(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              عرض الفاتورة
            </button>
          </div>
        )}
      </div>

      {/* نافذة الفاتورة */}
      {showInvoiceModal && contract && (
        <InvoiceModal
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
          existingCustomerSignature={customerSignature}
          existingCompanySignature={companySignature || undefined}
          contract={{
            id: contract.contractNumber,
            contractNumber: contract.contractNumber,
            customerName: contract.customerName,
            customerId: contract.customerId,
            contractType: contract.contractType as 'تأجير' | 'شراء' | 'صيانة' | 'تركيب',
            status: 'معتمد',
            totalValue: contract.totalValue,
            paidAmount: 0,
            remainingAmount: contract.totalValue,
            startDate: contract.startDate,
            endDate: contract.endDate,
            createdAt: contract.contractDate,
            updatedAt: contract.contractDate,
            paymentStatus: 'غير مدفوع',
            equipmentCount: contract.rentalDetails.reduce((sum, item) => sum + item.quantity, 0),
            location: contract.deliveryAddress,
            priority: 'عالي'
          }}
        />
      )}
    </div>
  );
}

