/**
 * مكون رفع المستندات المتعددة
 */

'use client';

import React, { useState, useRef } from 'react';
import { Upload, File, Eye, Download, Trash2 } from 'lucide-react';

export interface DocumentFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  file?: File;
  uploadedAt?: string;
}

interface DocumentUploadProps {
  documents: DocumentFile[];
  onDocumentsChange: (documents: DocumentFile[]) => void;
  maxFiles?: number;
  maxSizePerFile?: number; // in MB
  acceptedTypes?: string[];
  disabled?: boolean;
  className?: string;
}

export default function DocumentUpload({
  documents,
  onDocumentsChange,
  maxFiles = 5,
  maxSizePerFile = 10,
  acceptedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'],
  disabled = false,
  className = ''
}: DocumentUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // تنسيق حجم الملف
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 بايت';
    const k = 1024;
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // الحصول على أيقونة نوع الملف
  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('image')) return '🖼️';
    if (type.includes('excel') || type.includes('spreadsheet')) return '📊';
    return '📎';
  };

  // التحقق من صحة الملف
  const validateFile = (file: File): string | null => {
    // التحقق من الحجم
    if (file.size > maxSizePerFile * 1024 * 1024) {
      return `حجم الملف يجب أن يكون أقل من ${maxSizePerFile} ميجابايت`;
    }

    // التحقق من النوع
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      return `نوع الملف غير مدعوم. الأنواع المدعومة: ${acceptedTypes.join(', ')}`;
    }

    return null;
  };

  // معالجة رفع الملفات
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const newDocuments: DocumentFile[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // التحقق من العدد الأقصى
        if (documents.length + newDocuments.length >= maxFiles) {
          alert(`يمكن رفع ${maxFiles} ملفات كحد أقصى`);
          break;
        }

        // التحقق من صحة الملف
        const validationError = validateFile(file);
        if (validationError) {
          alert(`خطأ في الملف "${file.name}": ${validationError}`);
          continue;
        }

        // إنشاء معرف فريد للملف
        const fileId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // محاكاة رفع الملف (في التطبيق الحقيقي، سترفع الملف إلى الخادم)
        const document: DocumentFile = {
          id: fileId,
          name: file.name,
          size: file.size,
          type: file.type,
          file: file,
          uploadedAt: new Date().toISOString(),
          // في التطبيق الحقيقي، ستحصل على URL من الخادم
          url: URL.createObjectURL(file)
        };

        newDocuments.push(document);
      }

      // إضافة الملفات الجديدة
      onDocumentsChange([...documents, ...newDocuments]);
      
    } catch (error) {
      console.error('خطأ في رفع الملفات:', error);
      alert('حدث خطأ في رفع الملفات');
    } finally {
      setUploading(false);
    }
  };

  // معالجة السحب والإفلات
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  // معالجة النقر على منطقة الرفع
  const handleClick = () => {
    if (disabled || uploading) return;
    fileInputRef.current?.click();
  };

  // حذف مستند
  const handleDeleteDocument = (documentId: string) => {
    const updatedDocuments = documents.filter(doc => doc.id !== documentId);
    onDocumentsChange(updatedDocuments);
  };

  // معاينة مستند
  const handlePreviewDocument = (document: DocumentFile) => {
    if (document.url) {
      window.open(document.url, '_blank');
    }
  };

  // تحميل مستند
  const handleDownloadDocument = (doc: DocumentFile) => {
    if (doc.url && doc.file) {
      const link = document.createElement('a');
      link.href = doc.url;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* منطقة رفع الملفات */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragOver 
            ? 'border-[#58d2c8] bg-[#58d2c8]/5' 
            : 'border-gray-300 hover:border-[#58d2c8] hover:bg-gray-50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${uploading ? 'opacity-75' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={(e) => handleFileUpload(e.target.files)}
          className="hidden"
          disabled={disabled || uploading}
        />

        <div className="space-y-3">
          <div className="flex justify-center">
            {uploading ? (
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#58d2c8]"></div>
            ) : (
              <Upload className="h-12 w-12 text-gray-400" />
            )}
          </div>

          <div>
            <p className="text-lg font-medium text-gray-700">
              {uploading ? 'جاري رفع الملفات...' : 'اسحب الملفات هنا أو اضغط للاختيار'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              يمكن رفع حتى {maxFiles} ملفات، حجم كل ملف حتى {maxSizePerFile} ميجابايت
            </p>
            <p className="text-xs text-gray-400 mt-1">
              الأنواع المدعومة: {acceptedTypes.join(', ')}
            </p>
          </div>
        </div>
      </div>

      {/* قائمة الملفات المرفوعة */}
      {documents.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">
            الملفات المرفوعة ({documents.length})
          </h4>
          
          <div className="space-y-2">
            {documents.map((document) => (
              <div
                key={document.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-2xl">{getFileIcon(document.type)}</span>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {document.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(document.size)}
                      {document.uploadedAt && (
                        <span className="mr-2">
                          • {new Date(document.uploadedAt).toLocaleDateString('ar-SA')}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {document.url && (
                    <>
                      <button
                        onClick={() => handlePreviewDocument(document)}
                        className="p-1 text-gray-400 hover:text-[#58d2c8] transition-colors"
                        title="معاينة"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDownloadDocument(document)}
                        className="p-1 text-gray-400 hover:text-[#58d2c8] transition-colors"
                        title="تحميل"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={() => handleDeleteDocument(document.id)}
                    disabled={disabled}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                    title="حذف"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
