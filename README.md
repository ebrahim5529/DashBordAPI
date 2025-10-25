# نظام أسهل - لوحة تحكم إدارة السقالات
وثيقة متطلبات النظام (SRS - Software Requirements Specification)
نظام إدارة تأجير وبيع وشراء السقالات




نظام إدارة شامل لتأجير وبيع السقالات مبني باستخدام React 18 مع Vite و TypeScript و Laravel Backend.

## 🏗️ هيكل المشروع

### 📁 src/ (المجلد الرئيسي)
```
src/
├── App.tsx                 # المكون الرئيسي للتطبيق
├── main.tsx               # نقطة دخول التطبيق
├── routes.tsx             # تعريف المسارات
├── app/                   # الأنماط العامة
│   ├── globals.css        # الأنماط العامة
│   └── responsive.css     # الأنماط المتجاوبة
├── pages/                 # صفحات التطبيق
│   ├── Home.tsx           # الصفحة الرئيسية
│   ├── Login.tsx          # صفحة تسجيل الدخول
│   ├── ForgotPassword.tsx # صفحة نسيان كلمة المرور
│   ├── ContractSign.tsx   # صفحة توقيع العقود
│   ├── TestConnection.tsx # صفحة اختبار الاتصال
│   └── dashboard/         # صفحات لوحة التحكم
│       ├── index.ts       # تصدير صفحات لوحة التحكم
│       └── [58 ملف صفحة]  # صفحات إدارة النظام
└── layouts/               # تخطيطات الصفحات
    └── DashboardLayout.tsx # تخطيط لوحة التحكم
```

### 📁 src/components/ (المكونات)
```
components/
├── shared/                # مكونات مشتركة
│   ├── Button.tsx         # مكون الزر
│   ├── Card.tsx           # مكون البطاقة
│   ├── ComingSoon.tsx     # مكون قريباً
│   ├── ConfirmDialog.tsx  # مكون تأكيد الحوار
│   ├── EmptyState.tsx     # مكون الحالة الفارغة
│   ├── ErrorMessage.tsx   # مكون رسالة الخطأ
│   ├── LoadingSpinner.tsx # مكون مؤشر التحميل
│   ├── Pagination.tsx     # مكون الترقيم
│   └── Toast.tsx          # مكون الإشعارات
├── features/              # مكونات الميزات (121 ملف)
│   ├── [مكونات العقود]    # مكونات إدارة العقود
│   ├── [مكونات العملاء]   # مكونات إدارة العملاء
│   ├── [مكونات المدفوعات] # مكونات إدارة المدفوعات
│   ├── [مكونات التقارير]  # مكونات التقارير
│   └── [مكونات أخرى]      # مكونات إضافية
├── layout/                # مكونات التخطيط
│   ├── Header.tsx         # رأس الصفحة
│   ├── Navbar.tsx         # شريط التنقل
│   ├── Sidebar.tsx        # الشريط الجانبي
│   └── MenuItem.tsx       # عنصر القائمة
├── providers/             # مزودي الحالة
│   ├── index.tsx          # تصدير المزودين
│   ├── auth.provider.tsx  # مزود المصادقة
│   ├── store.provider.tsx # مزود الحالة
│   └── theme.provider.tsx # مزود الثيم
├── contracts/             # مكونات العقود
│   ├── ContractDetails.tsx # تفاصيل العقد
│   ├── ContractForm.tsx   # نموذج العقد
│   ├── ContractsStats.tsx # إحصائيات العقود
│   └── ContractsTable.tsx # جدول العقود
├── dashboard/             # مكونات لوحة التحكم
│   ├── DashboardRouter.tsx # موجه لوحة التحكم
│   ├── StatsCards.tsx     # بطاقات الإحصائيات
│   ├── Charts.tsx         # الرسوم البيانية
│   ├── RecentActivity.tsx # النشاط الأخير
│   ├── AdditionalCharts.tsx # رسوم بيانية إضافية
│   └── OfficeUsageCards.tsx # بطاقات استخدام المكتب
├── skeletons/             # مكونات التحميل
│   ├── CardSkeleton.tsx   # هيكل البطاقة
│   └── TableSkeleton.tsx  # هيكل الجدول
├── ui/                    # مكونات واجهة المستخدم
│   ├── button.tsx         # مكون الزر
│   ├── card.tsx           # مكون البطاقة
│   ├── input.tsx          # مكون الإدخال
│   ├── select.tsx         # مكون الاختيار
│   ├── textarea.tsx       # مكون النص الطويل
│   ├── label.tsx          # مكون التسمية
│   ├── switch.tsx         # مكون المفتاح
│   ├── badge.tsx          # مكون الشارة
│   ├── alert-dialog.tsx   # مكون حوار التنبيه
│   ├── confirm-dialog.tsx # مكون حوار التأكيد
│   ├── theme-toggle.tsx   # مكون تبديل الثيم
│   ├── toaster.tsx        # مكون الإشعارات
│   └── SafeDate.tsx       # مكون التاريخ الآمن
├── hoc/                   # مكونات عالية المستوى
│   └── ProtectedRoute.tsx # مكون الحماية
└── dev/                   # مكونات التطوير
    └── ResponsiveTest.tsx # اختبار الاستجابة
```

### 📁 src/lib/ (المكتبة والأدوات)
```
lib/
├── api.ts                 # إعدادات API العامة
├── utils.ts               # دوال مساعدة عامة
├── constants/             # ثوابت النظام
│   ├── api.constant.ts    # ثوابت API
│   └── oman.constant.ts   # ثوابت عمان
├── schemas/               # مخططات التحقق (Zod)
│   ├── index.ts           # تصدير المخططات
│   ├── user.schema.ts     # مخطط المستخدم
│   ├── contract.schema.ts # مخطط العقد
│   ├── contracts.schema.ts # مخطط العقود
│   ├── customer.schema.ts # مخطط العميل
│   ├── payment.schema.ts  # مخطط الدفع
│   ├── supplier.schema.ts # مخطط المورد
│   └── claims.schema.ts   # مخطط المطالبات
├── services/              # خدمات API
│   ├── index.ts           # تصدير الخدمات
│   ├── auth.service.ts    # خدمة المصادقة
│   ├── contracts.service.ts # خدمة العقود
│   ├── customers.service.ts # خدمة العملاء
│   ├── payments.service.ts # خدمة المدفوعات
│   ├── suppliers.service.ts # خدمة الموردين
│   ├── employees.service.ts # خدمة الموظفين
│   ├── dashboard.service.ts # خدمة لوحة التحكم
│   ├── scaffolds.service.ts # خدمة السقالات
│   ├── upload.service.ts  # خدمة الرفع
│   └── [خدمات أخرى]       # خدمات إضافية
├── types/                 # تعريف أنواع TypeScript
│   ├── index.ts           # تصدير الأنواع
│   ├── user.d.ts          # نوع المستخدم
│   ├── contract.ts        # نوع العقد
│   ├── contracts.ts       # نوع العقود
│   ├── customer.d.ts      # نوع العميل
│   ├── payment.d.ts       # نوع الدفع
│   ├── supplier.d.ts      # نوع المورد
│   ├── employee.d.ts      # نوع الموظف
│   ├── financial.ts       # نوع المالي
│   ├── inventory.ts       # نوع المخزون
│   ├── delivery.ts        # نوع التسليم
│   ├── departments.ts     # نوع الأقسام
│   ├── leaves.ts          # نوع الإجازات
│   ├── purchases.ts       # نوع المشتريات
│   ├── return.ts          # نوع الإرجاع
│   ├── claims.d.ts        # نوع المطالبات
│   └── supplier.ts        # نوع المورد
├── utils/                 # دوال مساعدة
│   ├── utils.ts           # دوال عامة
│   ├── formatDate.util.ts # تنسيق التاريخ
│   ├── dateFormatter.ts   # منسق التاريخ
│   ├── formatNumbers.ts   # تنسيق الأرقام
│   └── safeDateFormat.ts  # تنسيق التاريخ الآمن
├── hooks/                 # خطافات مخصصة
│   └── useNavigation.ts   # خطاف التنقل
└── seed/                  # بيانات البذور
    └── [ملفات البذور]     # ملفات البيانات التجريبية
```

### 📁 src/data/ (البيانات التجريبية)
```
data/
├── mockData.ts              # البيانات الوهمية العامة
├── contractsData.ts         # بيانات العقود
├── customersData.ts         # بيانات العملاء
├── employeesData.ts         # بيانات الموظفين
├── suppliersData.ts         # بيانات الموردين
├── paymentData.ts           # بيانات المدفوعات
├── financialData.ts         # البيانات المالية
├── inventoryData.ts         # بيانات المخزون
├── reportsData.ts           # بيانات التقارير
├── attendanceData.ts        # بيانات الحضور
├── leavesData.ts            # بيانات الإجازات
├── salariesData.ts          # بيانات الرواتب
├── incentivesData.ts        # بيانات الحوافز
├── departmentsData.ts       # بيانات الأقسام
├── userRolesData.ts         # بيانات أدوار المستخدمين
├── operationsData.ts        # بيانات العمليات
├── deliveriesData.ts        # بيانات التسليمات
├── returnsData.ts           # بيانات الإرجاعات
├── purchasesData.ts         # بيانات المشتريات
├── invoiceData.ts           # بيانات الفواتير
├── claimsData.ts            # بيانات المطالبات
├── latePaymentsData.ts      # بيانات المدفوعات المتأخرة
├── expiredContractsData.ts  # بيانات العقود المنتهية
├── contractFormData.ts      # بيانات نموذج العقد
├── deliveryReceiptData.ts   # بيانات إيصال التسليم
├── officeUsageData.ts       # بيانات استخدام المكتب
├── advancedContractsData.ts # بيانات العقود المتقدمة
└── contractsManagementData.ts # بيانات إدارة العقود
```

### 📁 laravel-backend/ (الخادم الخلفي)
```
laravel-backend/
├── app/                    # منطق التطبيق
│   ├── Http/Controllers/   # المتحكمات (16 ملف)
│   ├── Http/Requests/      # طلبات التحقق (8 ملفات)
│   ├── Models/             # النماذج (31 ملف)
│   └── Providers/          # مزودي الخدمة
├── database/               # قاعدة البيانات
│   ├── database.sqlite     # قاعدة البيانات
│   ├── migrations/         # ملفات الهجرة (36 ملف)
│   └── seeders/            # ملفات البذور (10 ملفات)
├── routes/                 # المسارات
│   ├── api.php             # مسارات API
│   ├── web.php             # مسارات الويب
│   └── console.php         # مسارات وحدة التحكم
├── config/                 # ملفات التكوين
├── storage/                # التخزين
├── tests/                  # الاختبارات
├── vendor/                 # المكتبات الخارجية
├── composer.json           # تبعيات PHP
├── artisan                 # أداة Laravel
└── .env                    # متغيرات البيئة
```

## 🚀 الميزات

### التقنيات المستخدمة
- **React 18**: مكتبة بناء واجهات المستخدم
- **Vite**: أداة البناء السريعة
- **TypeScript**: للـ Type Safety
- **Laravel Backend**: الخادم الخلفي
- **SQLite**: قاعدة بيانات خفيفة وسهلة الاستخدام

### إدارة الحالة
- **Zustand**: لإدارة الحالة العامة
- **React Hook Form**: لإدارة النماذج
- **Zod**: للتحقق من صحة البيانات

### التصميم والواجهة
- **Tailwind CSS**: للأنماط
- **Radix UI**: للمكونات الأساسية
- **Lucide React**: للأيقونات
- **Class Variance Authority**: لإدارة أنواع المكونات
- **Recharts**: للرسوم البيانية

### الميزات المتقدمة
- **PDF Generation**: توليد ملفات PDF للعقود والفواتير
- **Signature Canvas**: توقيع العقود رقمياً
- **File Upload**: رفع الملفات والصور
- **Responsive Design**: تصميم متجاوب لجميع الأجهزة
- **Arabic RTL Support**: دعم كامل للغة العربية
- **Dark/Light Theme**: دعم الوضع المظلم والفاتح

### إدارة البيانات
- **Mock Data**: بيانات تجريبية شاملة
- **API Services**: خدمات منظمة للـ API
- **Type Safety**: أنواع TypeScript قوية
- **Form Validation**: التحقق من صحة النماذج

## 📦 المكتبات المطلوبة

```bash
# المكتبات الأساسية
npm install react react-dom react-router-dom
npm install react-hook-form @hookform/resolvers zod
npm install @tanstack/react-table zustand

# مكتبات التصميم والواجهة
npm install tailwindcss @radix-ui/react-alert-dialog
npm install @radix-ui/react-label @radix-ui/react-select
npm install @radix-ui/react-slot @radix-ui/react-switch
npm install lucide-react class-variance-authority
npm install clsx tailwind-merge tailwindcss-animate

# مكتبات الرسوم البيانية والـ PDF
npm install recharts @react-pdf/renderer
npm install html2canvas html2pdf.js jspdf jspdf-autotable
npm install pdf-lib puppeteer

# مكتبات إضافية
npm install axios sonner react-signature-canvas
npm install react-to-print @fontsource/almarai @fontsource/inter

# مكتبات التطوير
npm install -D @types/react @types/react-dom @types/node
npm install -D typescript @vitejs/plugin-react vite
npm install -D eslint @typescript-eslint/eslint-plugin
npm install -D prettier autoprefixer postcss
```

## 🛠️ الاستخدام

### 1. إعداد المشروع
```bash
# تثبيت التبعيات
npm install

# تشغيل خادم التطوير
npm run dev

# بناء المشروع للإنتاج
npm run build

# معاينة الإنتاج
npm run preview
```

### 2. إعداد الخادم الخلفي (Laravel)
```bash
# الانتقال إلى مجلد Laravel
cd laravel-backend

# تثبيت تبعيات PHP
composer install

# نسخ ملف البيئة
cp .env.example .env

# إنشاء مفتاح التطبيق
php artisan key:generate

# تشغيل الهجرات
php artisan migrate

# ملء البيانات التجريبية
php artisan db:seed

# تشغيل الخادم
php artisan serve
```

### 3. استخدام المكونات
```tsx
// استخدام مكون مشترك
import { Button } from '@/components/shared/Button'
import { Card } from '@/components/shared/Card'

export function ExampleComponent() {
  return (
    <Card>
      <h2>عنوان المكون</h2>
      <Button onClick={() => console.log('تم النقر')}>
        انقر هنا
      </Button>
    </Card>
  )
}
```

### 4. النماذج مع React Hook Form و Zod
```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { customerSchema } from '@/lib/schemas/customer.schema'

export function CustomerForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(customerSchema)
  })

  const onSubmit = (data) => {
    console.log('بيانات العميل:', data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} placeholder="اسم العميل" />
      {errors.name && <span>{errors.name.message}</span>}
      <button type="submit">حفظ العميل</button>
    </form>
  )
}
```

### 5. إدارة الحالة مع Zustand
```tsx
import { useAppStore } from '@/components/providers/store.provider'

export function NavigationComponent() {
  const { sidebarOpen, setSidebarOpen } = useAppStore()
  
  return (
    <button onClick={() => setSidebarOpen(!sidebarOpen)}>
      {sidebarOpen ? 'إغلاق' : 'فتح'} الشريط الجانبي
    </button>
  )
}
```

### 6. استخدام خدمات API
```tsx
import { useEffect, useState } from 'react'
import { CustomerService } from '@/lib/services'

export function CustomersList() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await CustomerService.getAllCustomers()
        setCustomers(data)
      } catch (error) {
        console.error('خطأ في جلب العملاء:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  if (loading) return <div>جاري التحميل...</div>

  return (
    <div>
      {customers.map(customer => (
        <div key={customer.id}>{customer.name}</div>
      ))}
    </div>
  )
}
```

## 🎨 التخصيص

### الألوان والثيمات
- دعم الوضع المظلم/الفاتح
- ألوان قابلة للتخصيص
- تصميم متجاوب

### المكونات
- مكونات قابلة لإعادة الاستخدام
- أنواع متعددة لكل مكون
- دعم التخصيص الكامل

## 📱 الاستجابة
- تصميم متجاوب لجميع الأجهزة
- دعم الشاشات الصغيرة والكبيرة
- تجربة مستخدم محسنة

## 🔧 التطوير

### أوامر التطوير الأساسية
```bash
# تثبيت التبعيات
npm install

# تشغيل خادم التطوير
npm run dev

# بناء المشروع للإنتاج
npm run build

# معاينة الإنتاج
npm run preview

# فحص الأخطاء
npm run lint

# إصلاح الأخطاء تلقائياً
npm run lint:fix

# فحص التنسيق
npm run format:check

# تنسيق الكود
npm run format

# فحص الأنواع
npm run type-check
```

### أوامر Laravel Backend
```bash
# الانتقال إلى مجلد Laravel
cd laravel-backend

# تثبيت تبعيات PHP
composer install

# تشغيل الخادم
php artisan serve

# تشغيل الهجرات
php artisan migrate

# إعادة تشغيل الهجرات
php artisan migrate:fresh

# ملء البيانات التجريبية
php artisan db:seed

# إنشاء نموذج جديد
php artisan make:model ModelName -m

# إنشاء متحكم جديد
php artisan make:controller ControllerName

# إنشاء طلب تحقق جديد
php artisan make:request RequestName

# مسح الكاش
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

## 📝 الملاحظات

- جميع المكونات مكتوبة بـ TypeScript
- استخدام أفضل الممارسات في React و Vite
- خادم خلفي Laravel مع SQLite
- كود منظم وقابل للصيانة
- دعم كامل للغة العربية مع RTL
- تصميم احترافي وحديث
- بيانات تجريبية شاملة جاهزة للاختبار
- مكونات قابلة لإعادة الاستخدام
- إدارة حالة متقدمة مع Zustand
- تحقق من البيانات مع Zod
- توليد PDF للعقود والفواتير
- توقيع رقمي للعقود
- رسوم بيانية تفاعلية
- تصميم متجاوب لجميع الأجهزة

## 📚 الوثائق الإضافية

- [دليل إعداد Laravel Backend](./laravel-backend/README.md) - تعليمات مفصلة لإعداد الخادم الخلفي
- [دليل API](./EasyLoman_API_Collection.json) - مجموعة Postman للـ API
- [متغيرات البيئة](./laravel-backend/.env.example) - مثال على ملف البيئة

## 🤝 المساهمة

1. Fork المشروع
2. إنشاء فرع للميزة الجديدة
3. Commit التغييرات
4. Push للفرع
5. إنشاء Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT.
