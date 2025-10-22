<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Contract;
use App\Models\Payment;
use App\Models\Scaffold;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    /**
     * تقرير مالي
     */
    public function financial(Request $request): JsonResponse
    {
        $startDate = $request->input('start_date', now()->startOfMonth());
        $endDate = $request->input('end_date', now()->endOfMonth());

        $data = [
            'total_revenue' => Payment::whereBetween('payment_date', [$startDate, $endDate])
                                    ->sum('amount'),
            'total_contracts' => Contract::whereBetween('start_date', [$startDate, $endDate])
                                        ->sum('total_after_discount'),
            'payments_count' => Payment::whereBetween('payment_date', [$startDate, $endDate])
                                      ->count(),
            'by_method' => Payment::whereBetween('payment_date', [$startDate, $endDate])
                                 ->select('payment_method', DB::raw('SUM(amount) as total'))
                                 ->groupBy('payment_method')
                                 ->get(),
        ];

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    /**
     * تقرير العقود
     */
    public function contracts(Request $request): JsonResponse
    {
        $startDate = $request->input('start_date', now()->startOfMonth());
        $endDate = $request->input('end_date', now()->endOfMonth());

        $data = [
            'total' => Contract::whereBetween('start_date', [$startDate, $endDate])->count(),
            'by_status' => Contract::whereBetween('start_date', [$startDate, $endDate])
                                  ->select('status', DB::raw('count(*) as count'))
                                  ->groupBy('status')
                                  ->get(),
            'total_value' => Contract::whereBetween('start_date', [$startDate, $endDate])
                                    ->sum('total_after_discount'),
        ];

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    /**
     * تقرير العملاء
     */
    public function customers(Request $request): JsonResponse
    {
        $data = [
            'total' => Customer::count(),
            'by_type' => Customer::select('customer_type', DB::raw('count(*) as count'))
                               ->groupBy('customer_type')
                               ->get(),
            'by_nationality' => Customer::select('nationality', DB::raw('count(*) as count'))
                                      ->groupBy('nationality')
                                      ->orderBy('count', 'desc')
                                      ->limit(10)
                                      ->get(),
        ];

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    /**
     * تقرير المخزون
     */
    public function inventory(Request $request): JsonResponse
    {
        $data = [
            'total_scaffolds' => Scaffold::count(),
            'by_status' => Scaffold::select('status', DB::raw('count(*) as count'))
                                  ->groupBy('status')
                                  ->get(),
            'by_type' => Scaffold::select('scaffold_type', DB::raw('count(*) as count'))
                                ->groupBy('scaffold_type')
                                ->get(),
        ];

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    /**
     * تصدير Excel (placeholder)
     */
    public function exportExcel(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'سيتم تطوير هذه الميزة قريباً'
        ]);
    }

    /**
     * تصدير PDF (placeholder)
     */
    public function exportPdf(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'سيتم تطوير هذه الميزة قريباً'
        ]);
    }
}

