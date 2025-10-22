/**
 * صفحة العقود الملغاة
 */

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shared/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  FileX, 
  Search, 
  Filter, 
  Eye, 
  Download, 
  RefreshCw,
  AlertTriangle,
  XCircle,
  User,
  Calendar,
  DollarSign,
  FileText,
  Trash2
} from 'lucide-react';

export default function CancelledContractsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  // بيانات العقود الملغاة
  const [cancelledContracts, setCancelledContracts] = useState([
    {
      id: 'CNT-2024-001',
      customerName: 'شركة التقنية المتقدمة',
      customerEmail: 'info@tech-advanced.com',
      contractType: 'تأجير معدات',
      value: 150000,
      currency: 'SAR',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      cancellationDate: '2024-01-15',
      cancellationReason: 'عدم توافق الشروط',
      cancelledBy: 'أحمد محمد',
      status: 'cancelled',
      documents: ['عقد-التأجير.pdf', 'شروط-الخدمة.pdf'],
      notes: 'تم إلغاء العقد بناءً على طلب العميل لعدم توافق الشروط المتفق عليها'
    },
    {
      id: 'CNT-2024-002',
      customerName: 'مؤسسة البناء الحديث',
      customerEmail: 'contracts@modern-build.com',
      contractType: 'بيع معدات',
      value: 850000,
      currency: 'SAR',
      startDate: '2024-01-10',
      endDate: '2024-06-10',
      cancellationDate: '2024-02-20',
      cancellationReason: 'مشاكل في التمويل',
      cancelledBy: 'فاطمة أحمد',
      status: 'cancelled',
      documents: ['عقد-البيع.pdf', 'ضمان-الجودة.pdf'],
      notes: 'تم إلغاء العقد بسبب عدم توفر التمويل المطلوب من قبل العميل'
    },
    {
      id: 'CNT-2024-003',
      customerName: 'شركة النقل السريع',
      customerEmail: 'logistics@fast-transport.com',
      contractType: 'صيانة دورية',
      value: 75000,
      currency: 'SAR',
      startDate: '2024-02-01',
      endDate: '2024-11-30',
      cancellationDate: '2024-03-10',
      cancellationReason: 'تغيير في المتطلبات',
      cancelledBy: 'محمد علي',
      status: 'cancelled',
      documents: ['عقد-الصيانة.pdf'],
      notes: 'تم إلغاء العقد بسبب تغيير العميل في متطلبات الصيانة'
    },
    {
      id: 'CNT-2024-004',
      customerName: 'مستشفى الأمل الجديد',
      customerEmail: 'admin@hope-hospital.com',
      contractType: 'تأجير معدات طبية',
      value: 200000,
      currency: 'SAR',
      startDate: '2024-01-15',
      endDate: '2024-12-15',
      cancellationDate: '2024-04-05',
      cancellationReason: 'عدم الرضا عن الخدمة',
      cancelledBy: 'سارة خالد',
      status: 'cancelled',
      documents: ['عقد-التأجير-الطبي.pdf', 'شهادة-السلامة.pdf'],
      notes: 'تم إلغاء العقد بسبب عدم رضا العميل عن جودة الخدمة المقدمة'
    },
    {
      id: 'CNT-2024-005',
      customerName: 'مدرسة المستقبل',
      customerEmail: 'info@future-school.com',
      contractType: 'بيع أثاث',
      value: 120000,
      currency: 'SAR',
      startDate: '2024-03-01',
      endDate: '2024-08-31',
      cancellationDate: '2024-05-15',
      cancellationReason: 'تأخير في التسليم',
      cancelledBy: 'خالد أحمد',
      status: 'cancelled',
      documents: ['عقد-البيع.pdf', 'كشف-الأسعار.pdf'],
      notes: 'تم إلغاء العقد بسبب التأخير في تسليم الأثاث في الموعد المحدد'
    }
  ]);

  const handleViewContract = (contract: any) => {
    setSelectedContract(contract);
    setShowDetails(true);
  };

  const handleRestoreContract = async (contractId: string) => {
    if (window.confirm('هل أنت متأكد من استعادة هذا العقد؟')) {
      setIsLoading(true);
      try {
        new Promise(resolve => setTimeout(resolve, 1000));
        setCancelledContracts(prev => prev.filter(contract => contract.id !== contractId));
        setIsLoading(false);
        alert('تم استعادة العقد بنجاح');
      } catch (error) {
        setIsLoading(false);
        alert('حدث خطأ في استعادة العقد');
      }
    }
  };

  const handleDeletePermanently = async (contractId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العقد نهائياً؟ لا يمكن التراجع عن هذا الإجراء.')) {
      setIsLoading(true);
      try {
        new Promise(resolve => setTimeout(resolve, 1000));
        setCancelledContracts(prev => prev.filter(contract => contract.id !== contractId));
        setIsLoading(false);
        alert('تم حذف العقد نهائياً');
      } catch (error) {
        setIsLoading(false);
        alert('حدث خطأ في حذف العقد');
      }
    }
  };

  const handleExportContracts = async () => {
    setIsLoading(true);
    try {
      new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
      alert('تم تصدير قائمة العقود الملغاة بنجاح');
    } catch (error) {
      setIsLoading(false);
      alert('حدث خطأ في تصدير البيانات');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const getCancellationReasonBadge = (reason: string) => {
    const reasons = {
      'عدم توافق الشروط': 'bg-red-100 text-red-800',
      'مشاكل في التمويل': 'bg-orange-100 text-orange-800',
      'تغيير في المتطلبات': 'bg-yellow-100 text-yellow-800',
      'عدم الرضا عن الخدمة': 'bg-purple-100 text-purple-800',
      'تأخير في التسليم': 'bg-blue-100 text-blue-800'
    };
    return reasons[reason as keyof typeof reasons] || 'bg-gray-100 text-gray-800';
  };

  const filteredContracts = cancelledContracts.filter(contract =>
    contract.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.contractType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.cancellationReason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCancelledValue = cancelledContracts.reduce((sum, contract) => sum + contract.value, 0);

  return (
    <div className="space-y-6">
      {/* عنوان الصفحة */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            العقود الملغاة
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            عرض وإدارة العقود الملغاة أو المرفوضة
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleExportContracts}
            disabled={isLoading}
          >
            <Download className="h-4 w-4 ml-2" />
            تصدير
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 ml-2" />
            تحديث
          </Button>
        </div>
      </div>

      {/* إحصائيات العقود الملغاة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <XCircle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">إجمالي العقود الملغاة</p>
                <p className="text-2xl font-bold">{cancelledContracts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">القيمة الإجمالية</p>
                <p className="text-2xl font-bold">{formatCurrency(totalCancelledValue, 'SAR')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">هذا الشهر</p>
                <p className="text-2xl font-bold">
                  {cancelledContracts.filter(c => 
                    new Date(c.cancellationDate).getMonth() === new Date().getMonth()
                  ).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">أسباب مختلفة</p>
                <p className="text-2xl font-bold">
                  {new Set(cancelledContracts.map(c => c.cancellationReason)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* شريط البحث والفلترة */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="البحث عن العقود الملغاة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 ml-2" />
              فلترة
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* قائمة العقود الملغاة */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileX className="h-5 w-5" />
            العقود الملغاة ({filteredContracts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredContracts.map((contract) => (
              <div key={contract.id} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{contract.id}</h3>
                      <Badge className={getCancellationReasonBadge(contract.cancellationReason)}>
                        {contract.cancellationReason}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">{contract.customerName}</p>
                          <p className="text-xs text-gray-500">{contract.customerEmail}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">{contract.contractType}</p>
                          <p className="text-xs text-gray-500">{formatCurrency(contract.value, contract.currency)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">تاريخ الإلغاء</p>
                          <p className="text-xs text-gray-500">{formatDate(contract.cancellationDate)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">ألغاه</p>
                          <p className="text-xs text-gray-500">{contract.cancelledBy}</p>
                        </div>
                      </div>
                    </div>

                    {contract.notes && (
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mb-3">
                        <p className="text-sm text-gray-700 dark:text-gray-300">{contract.notes}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {contract.documents.map((doc, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <FileText className="h-3 w-3 ml-1" />
                          {doc}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewContract(contract)}
                      disabled={isLoading}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestoreContract(contract.id)}
                      disabled={isLoading}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePermanently(contract.id)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* نافذة تفاصيل العقد */}
      {showDetails && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileX className="h-5 w-5" />
                تفاصيل العقد الملغي
              </CardTitle>
              <CardDescription>
                {selectedContract.id} - {selectedContract.customerName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* معلومات العقد الأساسية */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">رقم العقد</Label>
                    <p className="text-lg font-semibold">{selectedContract.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">نوع العقد</Label>
                    <p className="text-base">{selectedContract.contractType}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">القيمة</Label>
                    <p className="text-base font-semibold text-green-600">
                      {formatCurrency(selectedContract.value, selectedContract.currency)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">تاريخ البداية</Label>
                    <p className="text-base">{formatDate(selectedContract.startDate)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">تاريخ النهاية المخطط</Label>
                    <p className="text-base">{formatDate(selectedContract.endDate)}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">اسم العميل</Label>
                    <p className="text-base font-semibold">{selectedContract.customerName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">البريد الإلكتروني</Label>
                    <p className="text-base">{selectedContract.customerEmail}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">تاريخ الإلغاء</Label>
                    <p className="text-base font-semibold text-red-600">
                      {formatDate(selectedContract.cancellationDate)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">سبب الإلغاء</Label>
                    <Badge className={getCancellationReasonBadge(selectedContract.cancellationReason)}>
                      {selectedContract.cancellationReason}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">ألغاه</Label>
                    <p className="text-base">{selectedContract.cancelledBy}</p>
                  </div>
                </div>
              </div>

              {/* ملاحظات */}
              {selectedContract.notes && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">ملاحظات</Label>
                  <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {selectedContract.notes}
                    </p>
                  </div>
                </div>
              )}

              {/* المستندات */}
              <div>
                <Label className="text-sm font-medium text-gray-600">المستندات المرفقة</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedContract.documents.map((doc: any, index: number) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {doc}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* أزرار الإجراءات */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowDetails(false)}
                  disabled={isLoading}
                >
                  إغلاق
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleRestoreContract(selectedContract.id)}
                  disabled={isLoading}
                >
                  <RefreshCw className="h-4 w-4 ml-2" />
                  استعادة العقد
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeletePermanently(selectedContract.id)}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4 ml-2" />
                  حذف نهائي
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
