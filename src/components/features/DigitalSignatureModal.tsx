/**
 * مكون التوقيع الإلكتروني
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, RotateCcw, Check } from 'lucide-react';

interface DigitalSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signature: string) => void;
  signerName?: string;
  title?: string;
}

export function DigitalSignatureModal({ 
  isOpen, 
  onClose, 
  onSave, 
  signerName = '',
  title = 'التوقيع الإلكتروني'
}: DigitalSignatureModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [signatureData, setSignatureData] = useState<string>('');

  // إعداد Canvas للتوقيع
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // إعداد Canvas
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // تطهير Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [isOpen]);

  // بدء الرسم
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  // الرسم
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  // إنهاء الرسم
  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const dataURL = canvas.toDataURL('image/png');
      setSignatureData(dataURL);
      setHasSignature(dataURL !== 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    }
  };

  // مسح التوقيع
  const clearSignature = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData('');
    setHasSignature(false);
  };

  // حفظ التوقيع
  const handleSave = () => {
    if (hasSignature && signatureData) {
      onSave(signatureData);
      onClose();
    }
  };

  // إغلاق المودال
  const handleClose = () => {
    clearSignature();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            {signerName && (
              <p className="text-sm text-gray-600 mt-1">الموقع: {signerName}</p>
            )}
          </div>
          <Button
            onClick={handleClose}
            variant="outline"
            size="sm"
            className="p-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* تعليمات التوقيع */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">تعليمات التوقيع:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• استخدم الماوس أو اللمس للرسم على المساحة أدناه</li>
              <li>• تأكد من وضوح التوقيع قبل الحفظ</li>
              <li>• يمكنك مسح التوقيع وإعادة المحاولة</li>
            </ul>
          </div>

          {/* مساحة التوقيع */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <canvas
                ref={canvasRef}
                className="w-full h-64 border border-gray-200 rounded cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>

            {/* أزرار التحكم */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  onClick={clearSignature}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  مسح التوقيع
                </Button>
                
                {hasSignature && (
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-medium">تم إنشاء التوقيع</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* معاينة التوقيع */}
          {hasSignature && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">معاينة التوقيع:</h4>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <img 
                  src={signatureData} 
                  alt="معاينة التوقيع" 
                  className="max-h-32 mx-auto"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end gap-3">
            <Button
              onClick={handleClose}
              variant="outline"
              className="px-6 py-2"
            >
              إلغاء
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasSignature}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700"
            >
              حفظ التوقيع
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
