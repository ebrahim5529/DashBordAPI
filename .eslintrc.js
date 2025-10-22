/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },

  extends: ['next/core-web-vitals', 'eslint:recommended'],

  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },

  plugins: ['@typescript-eslint'],

  rules: {
    // TypeScript Rules
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-explicit-any': 'off', // تم تعطيله للسماح بـ any في بعض الحالات
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'warn',

    // JavaScript Rules
    'no-console': 'off', // تم تعطيله لأننا نستخدم شرط البيئة
    'no-debugger': 'error',
    'no-unused-vars': 'off', // نستخدم TypeScript version
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error',
    'no-mixed-spaces-and-tabs': 'error',
  },

  overrides: [
    // ملفات التكوين
    {
      files: ['*.config.js', '*.config.ts', '*.config.mjs'],
      env: {
        node: true,
      },
      rules: {
        'no-console': 'off',
      },
    },

    // ملفات الاختبار
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
      env: {
        jest: true,
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'no-console': 'off',
      },
    },

    // ملفات Prisma
    {
      files: ['prisma/**/*.ts'],
      rules: {
        'no-console': 'off',
      },
    },

    // ملفات البيانات الوهمية
    {
      files: ['src/data/**/*.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'no-console': 'off',
      },
    },
  ],

  ignorePatterns: [
    'node_modules/',
    '.next/',
    'out/',
    'build/',
    'dist/',
    '*.min.js',
    'coverage/',
    '.env*',
    'public/',
    '*.d.ts',
  ],
};
