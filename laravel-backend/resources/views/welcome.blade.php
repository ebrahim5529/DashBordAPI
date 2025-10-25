<!DOCTYPE html>
<html lang="ar" dir="rtl">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'Laravel') }} - Backend API</title>

        <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap" rel="stylesheet">

            <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Almarai', 'Tajawal', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            direction: rtl;
        }
        
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 800px;
            width: 100%;
            padding: 40px;
            animation: slideIn 0.5s ease-out;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            background: #10b981;
            color: white;
            padding: 10px 20px;
            border-radius: 50px;
            font-weight: bold;
            margin-bottom: 20px;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0.8;
            }
        }
        
        .status-dot {
            width: 12px;
            height: 12px;
            background: white;
            border-radius: 50%;
            animation: blink 1s infinite;
        }
        
        @keyframes blink {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0.3;
            }
        }
        
        h1 {
            color: #1f2937;
            font-size: 2.5rem;
            margin-bottom: 10px;
            font-weight: 800;
        }
        
        .subtitle {
            color: #6b7280;
            font-size: 1.1rem;
            margin-bottom: 30px;
        }
        
        .info-section {
            background: #f3f4f6;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
        }
        
        .info-section h2 {
            color: #374151;
            font-size: 1.3rem;
            margin-bottom: 15px;
            font-weight: 700;
        }
        
        .api-list {
            list-style: none;
        }
        
        .api-item {
            background: white;
            padding: 12px 15px;
            margin: 8px 0;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: transform 0.2s, box-shadow 0.2s;
            cursor: pointer;
        }
        
        .api-item:hover {
            transform: translateX(-5px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .api-method {
            background: #3b82f6;
            color: white;
            padding: 4px 10px;
            border-radius: 5px;
            font-size: 0.85rem;
            font-weight: bold;
            min-width: 50px;
            text-align: center;
        }
        
        .api-method.post {
            background: #10b981;
        }
        
        .api-method.put {
            background: #f59e0b;
        }
        
        .api-method.delete {
            background: #ef4444;
        }
        
        .api-path {
            color: #4b5563;
            font-family: 'Courier New', monospace;
            font-size: 0.95rem;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        
        .stat-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .stat-label {
            font-size: 0.9rem;
            opacity: 0.9;
        }
        
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            color: #6b7280;
        }
        
        .version {
            display: inline-block;
            background: #e5e7eb;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.9rem;
            margin-top: 10px;
        }

        @media (max-width: 768px) {
            .container {
                padding: 25px;
            }
            
            h1 {
                font-size: 1.8rem;
            }
            
            .stats {
                grid-template-columns: 1fr;
            }
        }
            </style>
    </head>
<body>
    <div class="container">
        <div class="status-badge">
            <span class="status-dot"></span>
            Backend يعمل بنجاح
        </div>
        
        <h1>🚀 Laravel Backend API</h1>
        <p class="subtitle">نظام إدارة السقالات - واجهة برمجية متكاملة</p>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number">✓</div>
                <div class="stat-label">API جاهز</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">{{ app()->version() }}</div>
                <div class="stat-label">Laravel</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">REST</div>
                <div class="stat-label">API Type</div>
            </div>
        </div>
        
        <div class="info-section">
            <h2>📍 معلومات الاتصال</h2>
            <ul class="api-list">
                <li class="api-item">
                    <strong>Base URL:</strong>
                    <span class="api-path">{{ url('/api') }}</span>
                        </li>
                <li class="api-item">
                    <strong>Environment:</strong>
                    <span class="api-path">{{ app()->environment() }}</span>
                        </li>
                <li class="api-item">
                    <strong>Database:</strong>
                    <span class="api-path">{{ config('database.default') }}</span>
                        </li>
                    </ul>
                </div>
        
        <div class="info-section">
            <h2>🔌 جميع API Endpoints المتاحة</h2>
            
            <!-- Authentication -->
            <h3 style="color: #6b7280; font-size: 1rem; margin: 15px 0 10px;">🔐 المصادقة (Authentication)</h3>
            <ul class="api-list">
                <li class="api-item">
                    <span class="api-method post">POST</span>
                    <span class="api-path">/api/auth/register</span>
                </li>
                <li class="api-item">
                    <span class="api-method post">POST</span>
                    <span class="api-path">/api/auth/login</span>
                </li>
                <li class="api-item">
                    <span class="api-method post">POST</span>
                    <span class="api-path">/api/auth/logout</span>
                </li>
                <li class="api-item">
                    <span class="api-method">GET</span>
                    <span class="api-path">/api/auth/me</span>
                </li>
            </ul>
            
            <!-- Customers -->
            <h3 style="color: #6b7280; font-size: 1rem; margin: 15px 0 10px;">👥 إدارة العملاء</h3>
            <ul class="api-list">
                <li class="api-item">
                    <span class="api-method">GET</span>
                    <span class="api-path">/api/customers</span>
                </li>
                <li class="api-item">
                    <span class="api-method post">POST</span>
                    <span class="api-path">/api/customers</span>
                </li>
                <li class="api-item">
                    <span class="api-method">GET</span>
                    <span class="api-path">/api/customers/{id}</span>
                </li>
                <li class="api-item">
                    <span class="api-method">GET</span>
                    <span class="api-path">/api/customers/stats</span>
                </li>
                <li class="api-item">
                    <span class="api-method">GET</span>
                    <span class="api-path">/api/customers/{id}/contracts</span>
                </li>
            </ul>
            
            <!-- Contracts -->
            <h3 style="color: #6b7280; font-size: 1rem; margin: 15px 0 10px;">📋 إدارة العقود</h3>
            <ul class="api-list">
                <li class="api-item">
                    <span class="api-method">GET</span>
                    <span class="api-path">/api/contracts</span>
                </li>
                <li class="api-item">
                    <span class="api-method post">POST</span>
                    <span class="api-path">/api/contracts</span>
                </li>
                <li class="api-item">
                    <span class="api-method">GET</span>
                    <span class="api-path">/api/contracts/active</span>
                </li>
                <li class="api-item">
                    <span class="api-method">GET</span>
                    <span class="api-path">/api/contracts/expired</span>
                </li>
                <li class="api-item">
                    <span class="api-method">GET</span>
                    <span class="api-path">/api/contracts/{id}/pdf</span>
                </li>
            </ul>
            
            <!-- Payments -->
            <h3 style="color: #6b7280; font-size: 1rem; margin: 15px 0 10px;">💰 إدارة المدفوعات</h3>
            <ul class="api-list">
                <li class="api-item">
                    <span class="api-method">GET</span>
                    <span class="api-path">/api/payments</span>
                </li>
                <li class="api-item">
                    <span class="api-method post">POST</span>
                    <span class="api-path">/api/payments</span>
                </li>
                <li class="api-item">
                    <span class="api-method">GET</span>
                    <span class="api-path">/api/payments/stats</span>
                </li>
                <li class="api-item">
                    <span class="api-method">GET</span>
                    <span class="api-path">/api/payment-schedules</span>
                </li>
                <li class="api-item">
                    <span class="api-method">GET</span>
                    <span class="api-path">/api/late-payments</span>
                </li>
            </ul>
            
            <!-- Suppliers -->
            <h3 style="color: #6b7280; font-size: 1rem; margin: 15px 0 10px;">🏢 إدارة الموردين</h3>
            <ul class="api-list">
                <li class="api-item">
                    <span class="api-method">GET</span>
                    <span class="api-path">/api/suppliers</span>
                </li>
                <li class="api-item">
                    <span class="api-method post">POST</span>
                    <span class="api-path">/api/suppliers</span>
                </li>
                <li class="api-item">
                    <span class="api-method">GET</span>
                    <span class="api-path">/api/suppliers/stats</span>
                </li>
                <li class="api-item">
                    <span class="api-method post">POST</span>
                    <span class="api-path">/api/suppliers/{id}/activate</span>
                </li>
                <li class="api-item">
                    <span class="api-method post">POST</span>
                    <span class="api-path">/api/suppliers/{id}/update-rating</span>
                </li>
            </ul>
            
            <!-- Supplier Invoices -->
            <h3 style="color: #6b7280; font-size: 1rem; margin: 15px 0 10px;">🧾 فواتير الموردين</h3>
            <ul class="api-list">
                <li class="api-item">
                    <span class="api-method">GET</span>
                    <span class="api-path">/api/supplier-invoices</span>
                </li>
                <li class="api-item">
                    <span class="api-method post">POST</span>
                    <span class="api-path">/api/supplier-invoices</span>
                </li>
                <li class="api-item">
                    <span class="api-method post">POST</span>
                    <span class="api-path">/api/supplier-invoices/{id}/mark-as-paid</span>
                </li>
                <li class="api-item">
                    <span class="api-method post">POST</span>
                    <span class="api-path">/api/supplier-invoices/{id}/cancel</span>
                </li>
            </ul>
            
            <!-- Supplier Purchases -->
            <h3 style="color: #6b7280; font-size: 1rem; margin: 15px 0 10px;">🛒 مشتريات الموردين</h3>
            <ul class="api-list">
                <li class="api-item">
                    <span class="api-method">GET</span>
                    <span class="api-path">/api/supplier-purchases</span>
                </li>
                <li class="api-item">
                    <span class="api-method post">POST</span>
                    <span class="api-path">/api/supplier-purchases</span>
                </li>
                <li class="api-item">
                    <span class="api-method post">POST</span>
                    <span class="api-path">/api/supplier-purchases/{id}/confirm</span>
                </li>
                <li class="api-item">
                    <span class="api-method post">POST</span>
                    <span class="api-path">/api/supplier-purchases/{id}/mark-as-delivered</span>
                </li>
            </ul>
            
            <!-- Scaffolds -->
            <h3 style="color: #6b7280; font-size: 1rem; margin: 15px 0 10px;">🏗️ إدارة السقالات</h3>
            <ul class="api-list">
                <li class="api-item">
                    <span class="api-method">GET</span>
                    <span class="api-path">/api/scaffolds</span>
                </li>
                <li class="api-item">
                    <span class="api-method">GET</span>
                    <span class="api-path">/api/scaffolds/available</span>
                </li>
                <li class="api-item">
                    <span class="api-method post">POST</span>
                    <span class="api-path">/api/scaffolds</span>
                </li>
                <li class="api-item">
                    <span class="api-method">GET</span>
                    <span class="api-path">/api/scaffolds/stats</span>
                </li>
            </ul>
            
            <!-- Employees -->
            <h3 style="color: #6b7280; font-size: 1rem; margin: 15px 0 10px;">👨‍💼 إدارة الموظفين</h3>
            <ul class="api-list">
                <li class="api-item">
                    <span class="api-method">GET</span>
                    <span class="api-path">/api/employees</span>
                </li>
                <li class="api-item">
                    <span class="api-method post">POST</span>
                    <span class="api-path">/api/employees</span>
                </li>
                <li class="api-item">
                    <span class="api-method">GET</span>
                    <span class="api-path">/api/employees/stats</span>
                </li>
            </ul>
            
            <!-- Dashboard -->
            <h3 style="color: #6b7280; font-size: 1rem; margin: 15px 0 10px;">📊 لوحة التحكم</h3>
            <ul class="api-list">
                <li class="api-item">
                    <span class="api-method">GET</span>
                    <span class="api-path">/api/dashboard/stats</span>
                </li>
                <li class="api-item">
                    <span class="api-method">GET</span>
                    <span class="api-path">/api/dashboard/charts</span>
                </li>
                <li class="api-item">
                    <span class="api-method">GET</span>
                    <span class="api-path">/api/dashboard/recent-activity</span>
                </li>
            </ul>
            
            <!-- Reports -->
            <h3 style="color: #6b7280; font-size: 1rem; margin: 15px 0 10px;">📈 التقارير</h3>
            <ul class="api-list">
                <li class="api-item">
                    <span class="api-method">GET</span>
                    <span class="api-path">/api/reports/financial</span>
                </li>
                <li class="api-item">
                    <span class="api-method">GET</span>
                    <span class="api-path">/api/reports/contracts</span>
                </li>
                <li class="api-item">
                    <span class="api-method">GET</span>
                    <span class="api-path">/api/reports/customers</span>
                </li>
                <li class="api-item">
                    <span class="api-method post">POST</span>
                    <span class="api-path">/api/reports/export/excel</span>
                </li>
            </ul>
            
            <!-- Upload -->
            <h3 style="color: #6b7280; font-size: 1rem; margin: 15px 0 10px;">📤 رفع الملفات</h3>
            <ul class="api-list">
                <li class="api-item">
                    <span class="api-method post">POST</span>
                    <span class="api-path">/api/upload/image</span>
                </li>
                <li class="api-item">
                    <span class="api-method post">POST</span>
                    <span class="api-path">/api/upload/document</span>
                </li>
                <li class="api-item">
                    <span class="api-method post">POST</span>
                    <span class="api-path">/api/upload/signature</span>
                </li>
            </ul>
        </div>

        <div class="info-section">
            <h2>🔗 كيفية الاستخدام بين Frontend و Backend</h2>
            
            <div style="background: #e0f2fe; border-left: 4px solid #0288d1; padding: 15px; margin: 15px 0; border-radius: 8px;">
                <h3 style="color: #01579b; margin-bottom: 10px;">📱 Frontend (React + Vite)</h3>
                <p style="color: #0277bd; margin-bottom: 10px;"><strong>URL:</strong> http://localhost:3007</p>
                <p style="color: #0277bd; margin-bottom: 10px;"><strong>التقنيات:</strong> React 18, TypeScript, Tailwind CSS, Axios</p>
                <p style="color: #0277bd;"><strong>الميزات:</strong> إدارة الموردين، الفواتير، المشتريات، Toast Notifications</p>
            </div>
            
            <div style="background: #f3e5f5; border-left: 4px solid #7b1fa2; padding: 15px; margin: 15px 0; border-radius: 8px;">
                <h3 style="color: #4a148c; margin-bottom: 10px;">⚙️ Backend (Laravel API)</h3>
                <p style="color: #6a1b9a; margin-bottom: 10px;"><strong>URL:</strong> http://127.0.0.1:8000</p>
                <p style="color: #6a1b9a; margin-bottom: 10px;"><strong>API Base:</strong> http://127.0.0.1:8000/api</p>
                <p style="color: #6a1b9a; margin-bottom: 10px;"><strong>التقنيات:</strong> Laravel 10, SQLite, Eloquent ORM, RESTful API</p>
                <p style="color: #6a1b9a;"><strong>الميزات:</strong> 50+ API Endpoint، Form Validation، Database Relations</p>
            </div>
            
            <div style="background: #e8f5e8; border-left: 4px solid #388e3c; padding: 15px; margin: 15px 0; border-radius: 8px;">
                <h3 style="color: #1b5e20; margin-bottom: 10px;">🔄 مثال على التواصل</h3>
                <div style="background: #f5f5f5; padding: 10px; border-radius: 5px; font-family: 'Courier New', monospace; font-size: 0.9rem;">
                    <div style="color: #2e7d32;"><strong>Frontend (React):</strong></div>
                    <div style="color: #1976d2;">const response = await getSuppliers({ page: 1 });</div>
                    <br>
                    <div style="color: #2e7d32;"><strong>Backend (Laravel):</strong></div>
                    <div style="color: #1976d2;">GET /api/suppliers?page=1</div>
                    <br>
                    <div style="color: #2e7d32;"><strong>Response:</strong></div>
                    <div style="color: #1976d2;">{"data": [...], "pagination": {...}}</div>
                </div>
            </div>
            
            <div style="background: #fff3e0; border-left: 4px solid #f57c00; padding: 15px; margin: 15px 0; border-radius: 8px;">
                <h3 style="color: #e65100; margin-bottom: 10px;">🛠️ أوامر التشغيل</h3>
                <div style="background: #f5f5f5; padding: 10px; border-radius: 5px; font-family: 'Courier New', monospace; font-size: 0.9rem;">
                    <div style="color: #d84315;"><strong>Backend:</strong></div>
                    <div style="color: #1976d2;">cd laravel-backend</div>
                    <div style="color: #1976d2;">php artisan serve --host=127.0.0.1 --port=8000</div>
                    <br>
                    <div style="color: #d84315;"><strong>Frontend:</strong></div>
                    <div style="color: #1976d2;">npm run dev</div>
                </div>
            </div>
        </div>

        <div class="footer">
            <p>🔥 <strong>Laravel Backend</strong> جاهز للاستخدام</p>
            <p>تم التطوير باستخدام Laravel Framework</p>
            <span class="version">Version {{ app()->version() }}</span>
        </div>
    </div>
    </body>
</html>
