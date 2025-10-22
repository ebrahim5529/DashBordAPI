@echo off
echo 🧪 بدء اختبار إضافة العميل...
echo.

echo 📋 الخطوة 1: تشغيل الخادم
echo تأكد من تشغيل الخادم في terminal منفصل:
echo npm run dev
echo.

echo 📋 الخطوة 2: اختبار API
echo تشغيل اختبار API...
node test-api-direct.js
echo.

echo 📋 الخطوة 3: اختبار الواجهة
echo افتح test-frontend.html في المتصفح
echo.

echo 📋 الخطوة 4: اختبار التطبيق الكامل
echo اذهب إلى: http://localhost:3000/dashboard/customer-management
echo.

echo ✅ انتهى الاختبار!
pause
