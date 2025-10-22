<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SupplierInvoice;
use App\Http\Requests\Supplier\StoreSupplierInvoiceRequest;
use App\Http\Requests\Supplier\UpdateSupplierInvoiceRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SupplierInvoiceController extends Controller
{
    /**
     * عرض قائمة فواتير الموردين
     */
    public function index(Request $request): JsonResponse
    {
        $query = SupplierInvoice::with('supplier');

        // البحث
        if ($request->has('search') && $request->search) {
            $query->where(function($q) use ($request) {
                $q->where('invoice_number', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%')
                  ->orWhereHas('supplier', function($sq) use ($request) {
                      $sq->where('name', 'like', '%' . $request->search . '%');
                  });
            });
        }

        // الفلترة حسب المورد
        if ($request->has('supplier_id') && $request->supplier_id) {
            $query->where('supplier_id', $request->supplier_id);
        }

        // الفلترة حسب الحالة
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // الفلترة حسب التاريخ
        if ($request->has('date_from') && $request->date_from) {
            $query->where('due_date', '>=', $request->date_from);
        }

        if ($request->has('date_to') && $request->date_to) {
            $query->where('due_date', '<=', $request->date_to);
        }

        // الترتيب
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // الصفحات
        $perPage = $request->get('per_page', 15);
        $invoices = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $invoices
        ]);
    }

    /**
     * إنشاء فاتورة جديدة
     */
    public function store(StoreSupplierInvoiceRequest $request): JsonResponse
    {
        try {
            $invoice = SupplierInvoice::create($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'تم إنشاء الفاتورة بنجاح',
                'data' => $invoice->load('supplier')
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إنشاء الفاتورة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * عرض تفاصيل فاتورة
     */
    public function show($id): JsonResponse
    {
        $invoice = SupplierInvoice::with(['supplier', 'purchases'])->find($id);

        if (!$invoice) {
            return response()->json([
                'success' => false,
                'message' => 'الفاتورة غير موجودة'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $invoice
        ]);
    }

    /**
     * تحديث فاتورة
     */
    public function update(UpdateSupplierInvoiceRequest $request, $id): JsonResponse
    {
        $invoice = SupplierInvoice::find($id);

        if (!$invoice) {
            return response()->json([
                'success' => false,
                'message' => 'الفاتورة غير موجودة'
            ], 404);
        }

        try {
            $invoice->update($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث الفاتورة بنجاح',
                'data' => $invoice->load('supplier')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث الفاتورة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * حذف فاتورة
     */
    public function destroy($id): JsonResponse
    {
        $invoice = SupplierInvoice::find($id);

        if (!$invoice) {
            return response()->json([
                'success' => false,
                'message' => 'الفاتورة غير موجودة'
            ], 404);
        }

        try {
            $invoice->delete();

            return response()->json([
                'success' => true,
                'message' => 'تم حذف الفاتورة بنجاح'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف الفاتورة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * إحصائيات الفواتير
     */
    public function stats(Request $request): JsonResponse
    {
        $supplierId = $request->get('supplier_id');
        $query = SupplierInvoice::query();

        if ($supplierId) {
            $query->where('supplier_id', $supplierId);
        }

        $stats = [
            'total' => $query->count(),
            'total_amount' => $query->sum('amount'),
            'pending' => $query->where('status', 'PENDING')->count(),
            'pending_amount' => $query->where('status', 'PENDING')->sum('amount'),
            'paid' => $query->where('status', 'PAID')->count(),
            'paid_amount' => $query->where('status', 'PAID')->sum('amount'),
            'partial' => $query->where('status', 'PARTIAL')->count(),
            'partial_amount' => $query->where('status', 'PARTIAL')->sum('amount'),
            'overdue' => $query->where('status', 'OVERDUE')->count(),
            'overdue_amount' => $query->where('status', 'OVERDUE')->sum('amount'),
            'cancelled' => $query->where('status', 'CANCELLED')->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * تحديد فاتورة كمدفوعة
     */
    public function markAsPaid(Request $request, $id): JsonResponse
    {
        $invoice = SupplierInvoice::find($id);

        if (!$invoice) {
            return response()->json([
                'success' => false,
                'message' => 'الفاتورة غير موجودة'
            ], 404);
        }

        try {
            $invoice->markAsPaid(
                $request->get('payment_date'),
                $request->get('payment_method')
            );

            return response()->json([
                'success' => true,
                'message' => 'تم تحديد الفاتورة كمدفوعة بنجاح',
                'data' => $invoice->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث الفاتورة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * تحديد فاتورة كمتأخرة
     */
    public function markAsOverdue($id): JsonResponse
    {
        $invoice = SupplierInvoice::find($id);

        if (!$invoice) {
            return response()->json([
                'success' => false,
                'message' => 'الفاتورة غير موجودة'
            ], 404);
        }

        try {
            $invoice->markAsOverdue();

            return response()->json([
                'success' => true,
                'message' => 'تم تحديد الفاتورة كمتأخرة بنجاح',
                'data' => $invoice->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث الفاتورة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * إلغاء فاتورة
     */
    public function cancel($id): JsonResponse
    {
        $invoice = SupplierInvoice::find($id);

        if (!$invoice) {
            return response()->json([
                'success' => false,
                'message' => 'الفاتورة غير موجودة'
            ], 404);
        }

        try {
            $invoice->cancel();

            return response()->json([
                'success' => true,
                'message' => 'تم إلغاء الفاتورة بنجاح',
                'data' => $invoice->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إلغاء الفاتورة',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

