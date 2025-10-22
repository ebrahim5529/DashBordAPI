/**
 * مكون التوقيع الإلكتروني للجهة المالكة
 * يسمح بإنشاء وتحديث التوقيع الإلكتروني مرة واحدة ليظهر في جميع العقود
 */

'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PenTool, Save, Upload, Trash2, CheckCircle, XCircle } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
// Removed next/image import - using regular img tag

interface CompanySignatureData {
  id?: string;
  companyName: string;
  signerName: string;
  signerTitle: string;
  signaturePath?: string;
  signatureData?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export function CompanySignature() {
  const signatureRef = useRef<SignatureCanvas>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<CompanySignatureData>({
    companyName: '',
    signerName: '',
    signerTitle: '',
  });
  
  const [existingSignature, setExistingSignature] = useState<CompanySignatureData | null>(null);
  const [signatureMode, setSignatureMode] = useState<'draw' | 'upload'>('draw');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // تحميل التوقيع الموجود
  useEffect(() => {
    fetchExistingSignature();
  }, []);

  const fetchExistingSignature = async () => {
    try {
      const response = await fetch('/api/company-signature');
      if (response.ok) {
        const data = await response.json();
        setExistingSignature(data);
        setFormData({
          companyName: data.companyName,
          signerName: data.signerName,
          signerTitle: data.signerTitle,
        });
      }
    } catch (error) {
      console.error('خطأ في تحميل التوقيع:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveUpload = () => {
    setUploadedFile(null);
    setUploadedPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveSignature = async () => {
    // التحقق من البيانات
    if (!formData.companyName || !formData.signerName || !formData.signerTitle) {
      setMessage({ type: 'error', text: 'الرجاء ملء جميع الحقول المطلوبة' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('companyName', formData.companyName);
      formDataToSend.append('signerName', formData.signerName);
      formDataToSend.append('signerTitle', formData.signerTitle);

      // حسب نوع التوقيع
      if (signatureMode === 'draw') {
        if (!signatureRef.current || signatureRef.current.isEmpty()) {
          setMessage({ type: 'error', text: 'الرجاء التوقيع أولاً' });
          setIsLoading(false);
          return;
        }
        
        // تحويل التوقيع المرسوم إلى blob
        const canvas = signatureRef.current.getCanvas();
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => resolve(blob!), 'image/png');
        });
        formDataToSend.append('signatureFile', blob, 'signature.png');
        
        // حفظ بيانات التوقيع كـ JSON
        const signatureData = signatureRef.current.toData();
        formDataToSend.append('signatureData', JSON.stringify(signatureData));
      } else if (signatureMode === 'upload' && uploadedFile) {
        formDataToSend.append('signatureFile', uploadedFile);
      } else {
        setMessage({ type: 'error', text: 'الرجاء رفع صورة التوقيع' });
        setIsLoading(false);
        return;
      }

      // تحديد ما إذا كان تحديث أو إنشاء جديد
      const isUpdate = existingSignature?.id;
      if (isUpdate) {
        formDataToSend.append('id', existingSignature.id!);
      }

      const method = isUpdate ? 'PUT' : 'POST';
      const response = await fetch('/api/company-signature', {
        method,
        body: formDataToSend,
      });

      if (response.ok) {
        const savedSignature = await response.json();
        setExistingSignature(savedSignature);
        setMessage({ 
          type: 'success', 
          text: isUpdate ? 'تم تحديث التوقيع بنجاح' : 'تم حفظ التوقيع بنجاح' 
        });
        
        // إعادة تعيين الحقول
        if (signatureRef.current) {
          signatureRef.current.clear();
        }
        handleRemoveUpload();
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.message || 'حدث خطأ في حفظ التوقيع' });
      }
    } catch (error) {
      console.error('خطأ في حفظ التوقيع:', error);
      setMessage({ type: 'error', text: 'حدث خطأ في حفظ التوقيع' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* رسالة النجاح أو الخطأ */}
      {message && (
        <Card className={`border-2 ${message.type === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20'}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <p className={message.type === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}>
                {message.text}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* معلومات الجهة والموقع */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right">
            <PenTool className="h-6 w-6 text-primary" />
            معلومات الجهة والموقع
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-right">
              اسم الجهة المالكة <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg text-right focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700"
              placeholder="شركة البعد العالي"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-right">
              اسم الموقع <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="signerName"
              value={formData.signerName}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg text-right focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700"
              placeholder="اسحاق"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-right">
              منصب الموقع <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="signerTitle"
              value={formData.signerTitle}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg text-right focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700"
              placeholder="المدير العام"
            />
          </div>
        </CardContent>
      </Card>

      {/* التوقيع */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">التوقيع الإلكتروني</CardTitle>
          <div className="flex gap-2 mt-4 justify-end">
            <Button
              variant={signatureMode === 'draw' ? 'default' : 'outline'}
              onClick={() => setSignatureMode('draw')}
              size="sm"
            >
              <PenTool className="h-4 w-4 ml-2" />
              رسم التوقيع
            </Button>
            <Button
              variant={signatureMode === 'upload' ? 'default' : 'outline'}
              onClick={() => setSignatureMode('upload')}
              size="sm"
            >
              <Upload className="h-4 w-4 ml-2" />
              رفع صورة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {signatureMode === 'draw' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900">
                <SignatureCanvas
                  ref={signatureRef}
                  canvasProps={{
                    className: 'w-full h-64',
                    style: { touchAction: 'none' }
                  }}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={handleClearSignature}
                  size="sm"
                >
                  <Trash2 className="h-4 w-4 ml-2" />
                  مسح التوقيع
                </Button>
              </div>
            </div>
          )}

          {signatureMode === 'upload' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                {uploadedPreview ? (
                  <div className="space-y-4">
                    <div className="relative w-full h-64 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center">
                      <img
                        src={uploadedPreview}
                        alt="معاينة التوقيع"
                        className="object-contain max-w-full max-h-full"
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleRemoveUpload}
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4 ml-2" />
                      إزالة الصورة
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      اضغط لرفع صورة التوقيع
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      اختر ملف
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* التوقيع الحالي */}
      {existingSignature && existingSignature.signaturePath && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="text-right">التوقيع المحفوظ حالياً</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-right">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">اسم الجهة</p>
                <p className="font-semibold">{existingSignature.companyName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">اسم الموقع</p>
                <p className="font-semibold">{existingSignature.signerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">المنصب</p>
                <p className="font-semibold">{existingSignature.signerTitle}</p>
              </div>
            </div>
            <div className="relative w-full h-48 bg-gray-50 dark:bg-gray-900 rounded-lg flex items-center justify-center border">
              <img
                src={existingSignature.signaturePath}
                alt="التوقيع الحالي"
                className="object-contain p-4 max-w-full max-h-full"
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              هذا التوقيع سيظهر تلقائياً في جميع العقود الجديدة
            </p>
          </CardContent>
        </Card>
      )}

      {/* زر الحفظ */}
      <div className="flex justify-end">
        <Button
          onClick={handleSaveSignature}
          disabled={isLoading}
          size="lg"
        >
          <Save className="h-5 w-5 ml-2" />
          {isLoading ? 'جاري الحفظ...' : existingSignature ? 'تحديث التوقيع' : 'حفظ التوقيع'}
        </Button>
      </div>
    </div>
  );
}

