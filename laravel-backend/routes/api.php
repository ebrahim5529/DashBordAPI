<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\ContractController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\PaymentScheduleController;
use App\Http\Controllers\Api\LatePaymentController;
use App\Http\Controllers\Api\ScaffoldController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\SupplierController;
use App\Http\Controllers\Api\SupplierInvoiceController;
use App\Http\Controllers\Api\SupplierPurchaseController;
use App\Http\Controllers\Api\PurchaseItemController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\UploadController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Test Route
Route::get('/test', function () {
    return response()->json([
        'message' => 'Laravel API يعمل بنجاح!',
        'timestamp' => now(),
        'version' => '1.0.0',
        'status' => 'active',
        'endpoints' => [
            'auth' => '/api/auth/*',
            'customers' => '/api/customers',
            'contracts' => '/api/contracts',
            'payments' => '/api/payments',
            'scaffolds' => '/api/scaffolds'
        ]
    ]);
});

// Public Routes
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('reset-password', [AuthController::class, 'resetPassword']);
});

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth Routes
    Route::prefix('auth')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('refresh', [AuthController::class, 'refresh']);
        Route::get('me', [AuthController::class, 'me']);
    });

    // Customer Routes
    Route::get('customers/stats', [CustomerController::class, 'stats']); // يجب أن يكون قبل resource route
    Route::apiResource('customers', CustomerController::class);
    Route::prefix('customers')->group(function () {
        Route::post('{id}/notes', [CustomerController::class, 'addNote']);
        Route::post('{id}/comments', [CustomerController::class, 'addComment']);
        Route::post('{id}/upload-id-card', [CustomerController::class, 'uploadIdCard']);
        // عقود العميل
        Route::get('{id}/contracts', [CustomerController::class, 'getContracts']);
        Route::get('{id}/contracts/stats', [CustomerController::class, 'getContractsStats']);
        // مطالبات العميل
        Route::get('{id}/claims', [CustomerController::class, 'getClaims']);
        Route::get('{id}/claims/stats', [CustomerController::class, 'getClaimsStats']);
    });

    // Contract Routes
    Route::get('contracts/stats', [ContractController::class, 'stats']); // يجب أن يكون قبل resource
    Route::get('contracts/expired', [ContractController::class, 'expired']);
    Route::get('contracts/active', [ContractController::class, 'active']);
    Route::apiResource('contracts', ContractController::class);
    Route::prefix('contracts')->group(function () {
        Route::get('{id}/pdf', [ContractController::class, 'downloadPdf']);
        Route::post('{id}/signature', [ContractController::class, 'addSignature']);
        Route::post('{id}/send-whatsapp', [ContractController::class, 'sendWhatsApp']);
    });

    // Payment Routes
    Route::get('payments/stats', [PaymentController::class, 'stats']); // يجب أن يكون قبل resource
    Route::apiResource('payments', PaymentController::class);
    Route::post('payments/{id}/upload-check-image', [PaymentController::class, 'uploadCheckImage']);

    // Payment Schedule Routes
    Route::apiResource('payment-schedules', PaymentScheduleController::class);
    Route::prefix('payment-schedules')->group(function () {
        Route::get('contract/{id}', [PaymentScheduleController::class, 'byContract']);
        Route::post('{id}/mark-paid', [PaymentScheduleController::class, 'markPaid']);
    });

    // Late Payment Routes
    Route::apiResource('late-payments', LatePaymentController::class);
    Route::get('late-payments/stats', [LatePaymentController::class, 'stats']);

    // Scaffold Routes
    Route::get('scaffolds/stats', [ScaffoldController::class, 'stats']);
    Route::get('scaffolds/available', [ScaffoldController::class, 'available']);
    Route::apiResource('scaffolds', ScaffoldController::class);
    Route::post('scaffolds/{id}/maintenance', [ScaffoldController::class, 'addMaintenance']);

    // Employee Routes
    Route::get('employees/stats', [EmployeeController::class, 'stats']);
    Route::apiResource('employees', EmployeeController::class);
    Route::post('employees/{id}/documents', [EmployeeController::class, 'uploadDocument']);

    // Supplier Routes
    Route::get('suppliers/stats', [SupplierController::class, 'stats']);
    Route::apiResource('suppliers', SupplierController::class);
    Route::prefix('suppliers')->group(function () {
        Route::post('{id}/activate', [SupplierController::class, 'activate']);
        Route::post('{id}/deactivate', [SupplierController::class, 'deactivate']);
        Route::post('{id}/suspend', [SupplierController::class, 'suspend']);
        Route::post('{id}/update-rating', [SupplierController::class, 'updateRating']);
    });

    // Supplier Invoice Routes
    Route::get('supplier-invoices/stats', [SupplierInvoiceController::class, 'stats']);
    Route::apiResource('supplier-invoices', SupplierInvoiceController::class);
    Route::prefix('supplier-invoices')->group(function () {
        Route::post('{id}/mark-as-paid', [SupplierInvoiceController::class, 'markAsPaid']);
        Route::post('{id}/mark-as-overdue', [SupplierInvoiceController::class, 'markAsOverdue']);
        Route::post('{id}/cancel', [SupplierInvoiceController::class, 'cancel']);
    });

    // Supplier Purchase Routes
    Route::get('supplier-purchases/stats', [SupplierPurchaseController::class, 'stats']);
    Route::apiResource('supplier-purchases', SupplierPurchaseController::class);
    Route::prefix('supplier-purchases')->group(function () {
        Route::post('{id}/confirm', [SupplierPurchaseController::class, 'confirm']);
        Route::post('{id}/mark-as-delivered', [SupplierPurchaseController::class, 'markAsDelivered']);
        Route::post('{id}/cancel', [SupplierPurchaseController::class, 'cancel']);
        Route::post('{id}/items', [SupplierPurchaseController::class, 'addItem']);
        Route::delete('{purchaseId}/items/{itemId}', [SupplierPurchaseController::class, 'removeItem']);
    });

    // Purchase Item Routes
    Route::apiResource('purchase-items', PurchaseItemController::class);
    Route::prefix('purchase-items')->group(function () {
        Route::post('{id}/mark-as-received', [PurchaseItemController::class, 'markAsReceived']);
        Route::post('{id}/mark-as-in-transit', [PurchaseItemController::class, 'markAsInTransit']);
    });

    // Dashboard Routes
    Route::prefix('dashboard')->group(function () {
        Route::get('stats', [DashboardController::class, 'stats']);
        Route::get('charts', [DashboardController::class, 'charts']);
        Route::get('recent-activity', [DashboardController::class, 'recentActivity']);
    });

    // Report Routes
    Route::prefix('reports')->group(function () {
        Route::get('financial', [ReportController::class, 'financial']);
        Route::get('contracts', [ReportController::class, 'contracts']);
        Route::get('customers', [ReportController::class, 'customers']);
        Route::get('inventory', [ReportController::class, 'inventory']);
        Route::post('export/excel', [ReportController::class, 'exportExcel']);
        Route::post('export/pdf', [ReportController::class, 'exportPdf']);
    });

    // Upload Routes
    Route::prefix('upload')->group(function () {
        Route::post('image', [UploadController::class, 'uploadImage']);
        Route::post('document', [UploadController::class, 'uploadDocument']);
        Route::post('signature', [UploadController::class, 'uploadSignature']);
        Route::delete('{path}', [UploadController::class, 'deleteFile']);
    });

});
