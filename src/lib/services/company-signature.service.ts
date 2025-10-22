/**
 * خدمة التوقيع الإلكتروني للجهة المالكة
 * توفر دوال مساعدة للتعامل مع التوقيع في العقود
 */

export interface CompanySignatureData {
  id: string;
  companyName: string;
  signerName: string;
  signerTitle: string;
  signaturePath: string;
  signatureData?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * الحصول على التوقيع النشط للجهة المالكة
 */
export async function getActiveCompanySignature(): Promise<CompanySignatureData | null> {
  try {
    const response = await fetch('/api/company-signature');
    if (response.ok) {
      const signature = await response.json();
      return signature;
    }
    return null;
  } catch (error) {
    console.error('خطأ في الحصول على التوقيع:', error);
    return null;
  }
}

/**
 * التحقق من وجود توقيع نشط
 */
export async function hasActiveSignature(): Promise<boolean> {
  const signature = await getActiveCompanySignature();
  return signature !== null;
}

/**
 * الحصول على معلومات التوقيع لاستخدامها في العقد
 */
export async function getSignatureForContract() {
  const signature = await getActiveCompanySignature();
  
  if (!signature) {
    return null;
  }

  return {
    companyName: signature.companyName,
    signerName: signature.signerName,
    signerTitle: signature.signerTitle,
    signatureImage: signature.signaturePath,
  };
}

