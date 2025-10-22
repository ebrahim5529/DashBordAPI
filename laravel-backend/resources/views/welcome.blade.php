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
            <h2>🔌 API Endpoints المتاحة</h2>
            
            <h3 style="color: #6b7280; font-size: 1rem; margin: 15px 0 10px;">إدارة الموردين</h3>
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
                    <span class="api-path">/api/suppliers/{id}</span>
                </li>
                <li class="api-item">
                    <span class="api-method put">PUT</span>
                    <span class="api-path">/api/suppliers/{id}</span>
                </li>
                <li class="api-item">
                    <span class="api-method delete">DELETE</span>
                    <span class="api-path">/api/suppliers/{id}</span>
                </li>
            </ul>
            
            <h3 style="color: #6b7280; font-size: 1rem; margin: 15px 0 10px;">إدارة الفواتير</h3>
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
                    <span class="api-method">GET</span>
                    <span class="api-path">/api/supplier-invoices/{id}</span>
                </li>
            </ul>
            
            <h3 style="color: #6b7280; font-size: 1rem; margin: 15px 0 10px;">إدارة المشتريات</h3>
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
                    <span class="api-method">GET</span>
                    <span class="api-path">/api/supplier-purchases/{id}</span>
                </li>
            </ul>
        </div>
        
        <div class="footer">
            <p>🔥 <strong>Laravel Backend</strong> جاهز للاستخدام</p>
            <p>تم التطوير باستخدام Laravel Framework</p>
            <span class="version">Version {{ app()->version() }}</span>
        </div>
    </div>
</body>
</html>
