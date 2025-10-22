<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Contract;
use App\Models\Payment;
use App\Models\Scaffold;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * إحصائيات Dashboard الرئيسية
     */
    public function stats(): JsonResponse
    {
        $stats = [
            // إحصائيات العملاء
            'customers' => [
                'total' => Customer::count(),
                'active' => Customer::where('status', 'ACTIVE')->count(),
                'new_this_month' => Customer::whereMonth('registration_date', now()->month)->count(),
            ],
            
            // إحصائيات العقود
            'contracts' => [
                'total' => Contract::count(),
                'active' => Contract::where('status', 'ACTIVE')->count(),
                'expired' => Contract::where('status', 'EXPIRED')->count(),
                'cancelled' => Contract::where('status', 'CANCELLED')->count(),
            ],
            
            // إحصائيات المدفوعات
            'payments' => [
                'total' => Payment::count(),
                'total_amount' => Payment::sum('amount'),
                'this_month' => Payment::whereMonth('payment_date', now()->month)->sum('amount'),
                'pending' => Payment::where('status', 'PENDING')->count(),
            ],
            
            // إحصائيات السقالات
            'scaffolds' => [
                'total' => Scaffold::count(),
                'available' => Scaffold::where('status', 'AVAILABLE')->count(),
                'rented' => Scaffold::where('status', 'RENTED')->count(),
                'maintenance' => Scaffold::where('status', 'MAINTENANCE')->count(),
            ],
            
            // إحصائيات الموظفين
            'employees' => [
                'total' => Employee::count(),
                'active' => Employee::where('status', 'ACTIVE')->count(),
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * بيانات الرسوم البيانية
     */
    public function charts(): JsonResponse
    {
        // إيرادات آخر 6 أشهر
        $revenueData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $revenueData[] = [
                'month' => $month->format('Y-m'),
                'month_name' => $month->locale('ar')->monthName,
                'revenue' => Payment::whereYear('payment_date', $month->year)
                                   ->whereMonth('payment_date', $month->month)
                                   ->sum('amount'),
            ];
        }

        // عقود جديدة آخر 6 أشهر
        $contractsData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $contractsData[] = [
                'month' => $month->format('Y-m'),
                'month_name' => $month->locale('ar')->monthName,
                'count' => Contract::whereYear('start_date', $month->year)
                                  ->whereMonth('start_date', $month->month)
                                  ->count(),
            ];
        }

        // حالة المدفوعات
        $paymentsStatus = [
            'paid' => Payment::where('status', 'PAID')->count(),
            'pending' => Payment::where('status', 'PENDING')->count(),
            'late' => Payment::where('status', 'LATE')->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'revenue' => $revenueData,
                'contracts' => $contractsData,
                'payments_status' => $paymentsStatus,
            ]
        ]);
    }

    /**
     * النشاطات الأخيرة
     */
    public function recentActivity(): JsonResponse
    {
        $activities = [];

        // آخر العملاء
        $recentCustomers = Customer::latest()->take(5)->get(['id', 'name', 'created_at']);
        foreach ($recentCustomers as $customer) {
            $activities[] = [
                'type' => 'customer',
                'action' => 'تم إضافة عميل جديد',
                'description' => $customer->name,
                'timestamp' => $customer->created_at,
            ];
        }

        // آخر العقود
        $recentContracts = Contract::latest()->take(5)->with('customer')->get();
        foreach ($recentContracts as $contract) {
            $activities[] = [
                'type' => 'contract',
                'action' => 'تم إنشاء عقد جديد',
                'description' => $contract->contract_number . ' - ' . $contract->customer->name,
                'timestamp' => $contract->created_at,
            ];
        }

        // آخر المدفوعات
        $recentPayments = Payment::latest()->take(5)->with('customer')->get();
        foreach ($recentPayments as $payment) {
            $activities[] = [
                'type' => 'payment',
                'action' => 'تم استلام دفعة',
                'description' => number_format($payment->amount, 2) . ' ر.ع',
                'timestamp' => $payment->created_at,
            ];
        }

        // ترتيب حسب الوقت
        usort($activities, function($a, $b) {
            return $b['timestamp'] <=> $a['timestamp'];
        });

        return response()->json([
            'success' => true,
            'data' => array_slice($activities, 0, 15)
        ]);
    }
}

