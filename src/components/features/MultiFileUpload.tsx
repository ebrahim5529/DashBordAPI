/**
 * مكون رفع الملفات المتعددة
 * يدعم رفع أكثر من ملف في نفس الوقت مع إمكانية السحب والإفلات
 */

'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/shared/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/Card';
import {
  Upload,
  File,
  CheckCircle,
  AlertCircle,
  Download,
  Trash2,
  Eye,
  FileText,
  Image,
  FileSpreadsheet,
  Archive,
  Music,
  Video,
} from 'lucide-react';

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'success' | 'error' | 'pending';
  progress?: number;
  error?: string;
  url?: string;
}

interface MultiFileUploadProps {
  onFilesUploaded?: (files: UploadedFile[]) => void;
  onFileRemoved?: (fileId: string) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  title?: string;
  description?: string;
  className?: string;
}

export function MultiFileUpload({
  onFilesUploaded,
  onFileRemoved,
  maxFiles = 10,
  maxFileSize = 10, // 10MB
  acceptedTypes = ['image/*', 'application/pdf', 'text/*', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  title = 'رفع الملفات',
  description = 'اسحب وأفلت الملفات هنا أو انقر للاختيار',
  className = '',
}: MultiFileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // دالة لتحديد أيقونة الملف حسب النوع
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-5 w-5 text-blue-500" />;
    if (type === 'application/pdf') return <FileText className="h-5 w-5 text-red-500" />;
    if (type.includes('spreadsheet') || type.includes('excel')) return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
    if (type.includes('zip') || type.includes('rar')) return <Archive className="h-5 w-5 text-purple-500" />;
    if (type.startsWith('audio/')) return <Music className="h-5 w-5 text-pink-500" />;
    if (type.startsWith('video/')) return <Video className="h-5 w-5 text-orange-500" />;
    return <FileText className="h-5 w-5 text-gray-500" />;
  };

  // دالة لتحويل حجم الملف إلى تنسيق مقروء
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // دالة للتحقق من صحة الملف
  const validateFile = (file: File): string | null => {
    // التحقق من حجم الملف
    if (file.size > maxFileSize * 1024 * 1024) {
      return `حجم الملف أكبر من ${maxFileSize}MB`;
    }

    // التحقق من نوع الملف
    const isAccepted = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });

    if (!isAccepted) {
      return 'نوع الملف غير مدعوم';
    }

    return null;
  };

  // دالة لإضافة الملفات
  const addFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    // التحقق من العدد الأقصى للملفات
    if (uploadedFiles.length + fileArray.length > maxFiles) {
      alert(`يمكن رفع ${maxFiles} ملف كحد أقصى`);
      return;
    }

    const newFiles: UploadedFile[] = [];

    fileArray.forEach(file => {
      const validationError = validateFile(file);
      
      const uploadedFile: UploadedFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        status: validationError ? 'error' : 'pending',
        error: validationError || undefined,
      };

      newFiles.push(uploadedFile);
    });

    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // رفع الملفات الصحيحة
    const validFiles = newFiles.filter(f => f.status === 'pending');
    if (validFiles.length > 0) {
      uploadFiles(validFiles);
    }
  }, [uploadedFiles.length, maxFiles, maxFileSize, acceptedTypes]);

  // دالة لمحاكاة رفع الملفات
  const uploadFiles = async (files: UploadedFile[]) => {
    setIsUploading(true);

    for (const file of files) {
      try {
        // تحديث حالة الملف إلى uploading
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === file.id 
              ? { ...f, status: 'uploading', progress: 0 }
              : f
          )
        );

        // محاكاة رفع الملف مع progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === file.id 
                ? { ...f, progress }
                : f
            )
          );
        }

        // تحديث حالة الملف إلى success
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === file.id 
              ? { 
                  ...f, 
                  status: 'success', 
                  progress: 100,
                  url: URL.createObjectURL(file.file)
                }
              : f
          )
        );

      } catch (error) {
        // تحديث حالة الملف إلى error
        console.error('خطأ في رفع الملف:', error);
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === file.id 
              ? { 
                  ...f, 
                  status: 'error', 
                  error: 'فشل في رفع الملف'
                }
              : f
          )
        );
      }
    }

    setIsUploading(false);
    
    // استدعاء callback
    if (onFilesUploaded) {
      const allFiles = uploadedFiles.filter(f => f.status === 'success');
      onFilesUploaded(allFiles);
    }
  };

  // دالة لإزالة ملف
  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    if (onFileRemoved) {
      onFileRemoved(fileId);
    }
  };

  // دالة لمعاينة الملف
  const previewFile = (file: UploadedFile) => {
    if (file.url) {
      window.open(file.url, '_blank');
    }
  };

  // دالة لتحميل الملف
  const downloadFile = (file: UploadedFile) => {
    if (file.url) {
      const a = document.createElement('a');
      a.href = file.url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // معالجات السحب والإفلات
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
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      addFiles(files);
    }
  };

  // معالج تغيير الملفات
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      addFiles(files);
    }
    // إعادة تعيين input
    e.target.value = '';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* منطقة السحب والإفلات */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
              isDragOver 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              {description}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              الحد الأقصى: {maxFiles} ملف، حجم كل ملف: {maxFileSize}MB
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('file-input')?.click()}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              اختيار الملفات
            </Button>
            <input
              id="file-input"
              type="file"
              multiple
              accept={acceptedTypes.join(',')}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* قائمة الملفات المرفوعة */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700 dark:text-gray-300">
                الملفات المرفوعة ({uploadedFiles.length})
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {getFileIcon(file.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFileSize(file.size)}
                        </p>
                        {file.status === 'uploading' && file.progress !== undefined && (
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                        )}
                        {file.error && (
                          <p className="text-xs text-red-500 mt-1">{file.error}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* حالة الملف */}
                      {file.status === 'success' && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {file.status === 'error' && (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                      {file.status === 'uploading' && (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
                      )}

                      {/* أزرار الإجراءات */}
                      {file.status === 'success' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => previewFile(file)}
                            title="معاينة"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadFile(file)}
                            title="تحميل"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        title="حذف"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default MultiFileUpload;
