/**
 * خدمة رفع الملفات
 * تحتوي على جميع دوال التعامل مع رفع الملفات
 */

import api from '../api';

/**
 * رفع صورة
 */
export const uploadImage = async (file: File, folder?: string) => {
  const formData = new FormData();
  formData.append('image', file);
  if (folder) {
    formData.append('folder', folder);
  }

  const response = await api.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * رفع مستند
 */
export const uploadDocument = async (file: File, folder?: string) => {
  const formData = new FormData();
  formData.append('document', file);
  if (folder) {
    formData.append('folder', folder);
  }

  const response = await api.post('/upload/document', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * رفع توقيع
 */
export const uploadSignature = async (signatureData: string, filename?: string) => {
  const response = await api.post('/upload/signature', {
    signature: signatureData,
    filename: filename || `signature_${Date.now()}.png`,
  });
  return response.data;
};

/**
 * حذف ملف
 */
export const deleteFile = async (path: string) => {
  const response = await api.delete(`/upload/${encodeURIComponent(path)}`);
  return response.data;
};

