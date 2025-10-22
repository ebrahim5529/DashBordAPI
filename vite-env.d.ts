/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // أضف متغيرات البيئة الأخرى هنا
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

