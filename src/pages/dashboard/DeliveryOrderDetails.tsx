import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Calendar, Package, User, MapPin } from 'lucide-react';

function DeliveryOrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#58d2c8] mx-auto mb-6"></div>
          <p className="text-xl text-gray-700 font-semibold mb-2">جاري تحميل تفاصيل الطلب...</p>
          <p className="text-sm text-gray-500">ID: {id}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="العودة"
              >
                <ArrowRight className="h-6 w-6 text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#58d2c8]/10 rounded-lg">
                  <Package className="h-7 w-7 text-[#58d2c8]" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">تفاصيل أمر التسليم</h1>
                  <p className="text-sm text-gray-600 mt-1">رقم الأمر: {id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-blue-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">معلومات العميل</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">اسم العميل</p>
                  <p className="text-lg font-semibold text-gray-900">شركة البناء الحديث</p>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-purple-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-bold text-gray-900">تاريخ التسليم</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">تاريخ التسليم المتوقع</p>
                  <p className="text-lg font-semibold text-gray-900">{new Date().toLocaleDateString('ar-SA')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-green-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-bold text-gray-900">موقع التسليم</h3>
            </div>
            <p className="text-lg text-gray-900">مسقط، سلطنة عمان</p>
          </div>

          <div className="bg-white border-2 border-yellow-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-6 w-6 text-yellow-600" />
              <h3 className="text-lg font-bold text-gray-900">المعدات المطلوبة</h3>
            </div>
            <p className="text-gray-600">قيد التحميل...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeliveryOrderDetails;

