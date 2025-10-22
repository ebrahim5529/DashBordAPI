# اختبار إضافة العميل
Write-Host "🧪 بدء اختبار إضافة العميل..." -ForegroundColor Green
Write-Host ""

Write-Host "📋 الخطوة 1: تشغيل الخادم" -ForegroundColor Yellow
Write-Host "تأكد من تشغيل الخادم في terminal منفصل:" -ForegroundColor White
Write-Host "npm run dev" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 الخطوة 2: اختبار API" -ForegroundColor Yellow
Write-Host "تشغيل اختبار API..." -ForegroundColor White
try {
    node test-api-direct.js
    Write-Host "✅ تم تشغيل اختبار API بنجاح" -ForegroundColor Green
} catch {
    Write-Host "❌ خطأ في تشغيل اختبار API: $_" -ForegroundColor Red
}
Write-Host ""

Write-Host "📋 الخطوة 3: اختبار الواجهة" -ForegroundColor Yellow
Write-Host "افتح test-frontend.html في المتصفح" -ForegroundColor White
Write-Host ""

Write-Host "📋 الخطوة 4: اختبار التطبيق الكامل" -ForegroundColor Yellow
Write-Host "اذهب إلى: http://localhost:3000/dashboard/customer-management" -ForegroundColor White
Write-Host ""

Write-Host "✅ انتهى الاختبار!" -ForegroundColor Green
Read-Host "اضغط Enter للخروج"
