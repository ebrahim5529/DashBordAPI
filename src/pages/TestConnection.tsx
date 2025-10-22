import { useState, useEffect } from 'react';
import { testConnection } from '@/lib/api';

export default function TestConnection() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'error' | null>(null);
  const [connectionData, setConnectionData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testLaravelConnection = async () => {
    setConnectionStatus('testing');
    setError(null);
    
    try {
      const data = await testConnection();
      setConnectionData(data);
      setConnectionStatus('success');
    } catch (err: any) {
      setError(err.message || 'فشل الاتصال');
      setConnectionStatus('error');
    }
  };

  useEffect(() => {
    testLaravelConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          اختبار الاتصال بين React و Laravel
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">حالة الاتصال</h2>
          
          {connectionStatus === 'testing' && (
            <div className="flex items-center space-x-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>جاري اختبار الاتصال...</span>
            </div>
          )}

          {connectionStatus === 'success' && (
            <div className="text-green-600">
              <div className="flex items-center space-x-2 mb-4">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">الاتصال ناجح!</span>
              </div>
              
              {connectionData && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">بيانات الاستجابة:</h3>
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(connectionData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {connectionStatus === 'error' && (
            <div className="text-red-600">
              <div className="flex items-center space-x-2 mb-4">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">فشل الاتصال</span>
              </div>
              
              {error && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm">{error}</p>
                </div>
              )}
            </div>
          )}

          <button
            onClick={testLaravelConnection}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            إعادة اختبار الاتصال
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">معلومات الاتصال</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">React Frontend (Vite)</h3>
              <p className="text-sm text-gray-600">المنفذ: 3000</p>
              <p className="text-sm text-gray-600">الرابط: http://localhost:3000</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Laravel Backend</h3>
              <p className="text-sm text-gray-600">المنفذ: 8000</p>
              <p className="text-sm text-gray-600">الرابط: http://localhost:8000/api</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">API Endpoints المتاحة</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">المصادقة</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>POST /api/auth/login</li>
                <li>POST /api/auth/register</li>
                <li>POST /api/auth/logout</li>
                <li>GET /api/auth/me</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">البيانات</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>GET /api/customers</li>
                <li>GET /api/contracts</li>
                <li>GET /api/payments</li>
                <li>GET /api/scaffolds</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

