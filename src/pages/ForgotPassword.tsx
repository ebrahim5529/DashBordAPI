import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Send } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // محاكاة إرسال طلب استرجاع كلمة المرور
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // التحقق من صحة البريد الإلكتروني
      if (!email || !email.includes('@')) {
        throw new Error('يرجى إدخال بريد إلكتروني صحيح');
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء إرسال الطلب');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // يمكن إضافة منطق إعادة الإرسال هنا
    } catch (err) {
      console.error('Resend email error:', err);
      setError('فشل في إعادة إرسال البريد الإلكتروني');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        {/* العودة لصفحة تسجيل الدخول */}
        <div className="mb-6">
          <Link 
            to="/login" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة لتسجيل الدخول
          </Link>
        </div>

        {/* بطاقة استرجاع كلمة المرور */}
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              استرجاع كلمة المرور
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {isSubmitted 
                ? 'تم إرسال رابط إعادة تعيين كلمة المرور'
                : 'أدخل بريدك الإلكتروني لإرسال رابط إعادة تعيين كلمة المرور'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* رسالة الخطأ */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                    </div>
                  </div>
                )}

                {/* حقل البريد الإلكتروني */}
                <div className="space-y-2">
                  <label 
                    htmlFor="email" 
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="أدخل بريدك الإلكتروني"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* زر إرسال الطلب */}
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 ml-2" />
                      إرسال رابط الاسترجاع
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-4 text-center">
                {/* رسالة النجاح */}
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-800 dark:text-green-200">
                      تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني
                    </p>
                  </div>
                </div>

                {/* تعليمات إضافية */}
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <p>يرجى التحقق من صندوق الوارد الخاص بك واتباع التعليمات لإعادة تعيين كلمة المرور.</p>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">ملاحظة:</p>
                    <ul className="text-xs space-y-1 text-right">
                      <li>• قد يستغرق وصول البريد الإلكتروني بضع دقائق</li>
                      <li>• تحقق من مجلد الرسائل غير المرغوب فيها</li>
                      <li>• رابط إعادة التعيين صالح لمدة 24 ساعة</li>
                    </ul>
                  </div>
                </div>

                {/* أزرار العمل */}
                <div className="space-y-3">
                  <Button 
                    onClick={handleResendEmail}
                    variant="outline"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin ml-2" />
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 ml-2" />
                        إعادة إرسال البريد الإلكتروني
                      </>
                    )}
                  </Button>
                  
                  <Link to="/login">
                    <Button variant="ghost" className="w-full">
                      العودة لتسجيل الدخول
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* معلومات الشركة */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2024 أسهل عمان - نظام إدارة السقالات
          </p>
        </div>
      </div>
    </div>
  );
}

