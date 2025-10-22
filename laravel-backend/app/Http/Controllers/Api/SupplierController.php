<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use App\Http\Requests\Supplier\StoreSupplierRequest;
use App\Http\Requests\Supplier\UpdateSupplierRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SupplierController extends Controller
{
    /**
     * عرض قائمة الموردين
     */
    public function index(Request $request): JsonResponse
    {
        $query = Supplier::query();

        // البحث
        if ($request->has('search') && $request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('supplier_number', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        // الفلترة حسب النوع
        if ($request->has('supplier_type') && $request->supplier_type) {
            $query->where('supplier_type', $request->supplier_type);
        }

        // الفلترة حسب الحالة
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // الترتيب
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // الصفحات
        $perPage = $request->get('per_page', 15);
        $suppliers = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $suppliers
        ]);
    }

    /**
     * إنشاء مورد جديد
     */
    public function store(StoreSupplierRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $data['supplier_number'] = $this->generateSupplierNumber();
            $data['status'] = 'ACTIVE';

            $supplier = Supplier::create($data);

            return response()->json([
                'success' => true,
                'message' => 'تم إنشاء المورد بنجاح',
                'data' => $supplier
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إنشاء المورد',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * عرض تفاصيل مورد
     */
    public function show($id): JsonResponse
    {
        $supplier = Supplier::with(['purchases', 'invoices'])->find($id);

        if (!$supplier) {
            return response()->json([
                'success' => false,
                'message' => 'المورد غير موجود'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $supplier
        ]);
    }

    /**
     * تحديث مورد
     */
    public function update(UpdateSupplierRequest $request, $id): JsonResponse
    {
        $supplier = Supplier::find($id);

        if (!$supplier) {
            return response()->json([
                'success' => false,
                'message' => 'المورد غير موجود'
            ], 404);
        }

        try {
            $supplier->update($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث المورد بنجاح',
                'data' => $supplier
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث المورد',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * حذف مورد
     */
    public function destroy($id): JsonResponse
    {
        $supplier = Supplier::find($id);

        if (!$supplier) {
            return response()->json([
                'success' => false,
                'message' => 'المورد غير موجود'
            ], 404);
        }

        try {
            $supplier->delete();

            return response()->json([
                'success' => true,
                'message' => 'تم حذف المورد بنجاح'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف المورد',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * إحصائيات الموردين
     */
    public function stats(): JsonResponse
    {
        $stats = [
            'total' => Supplier::count(),
            'active' => Supplier::active()->count(),
            'inactive' => Supplier::inactive()->count(),
            'suspended' => Supplier::suspended()->count(),
            'individual' => Supplier::individual()->count(),
            'company' => Supplier::company()->count(),
            'average_rating' => Supplier::avg('rating'),
            'total_invoices' => Supplier::withCount('invoices')->get()->sum('invoices_count'),
            'total_purchases' => Supplier::withCount('purchases')->get()->sum('purchases_count'),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * تفعيل مورد
     */
    public function activate($id): JsonResponse
    {
        $supplier = Supplier::find($id);

        if (!$supplier) {
            return response()->json([
                'success' => false,
                'message' => 'المورد غير موجود'
            ], 404);
        }

        try {
            $supplier->activate();

            return response()->json([
                'success' => true,
                'message' => 'تم تفعيل المورد بنجاح',
                'data' => $supplier->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تفعيل المورد',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * إلغاء تفعيل مورد
     */
    public function deactivate($id): JsonResponse
    {
        $supplier = Supplier::find($id);

        if (!$supplier) {
            return response()->json([
                'success' => false,
                'message' => 'المورد غير موجود'
            ], 404);
        }

        try {
            $supplier->deactivate();

            return response()->json([
                'success' => true,
                'message' => 'تم إلغاء تفعيل المورد بنجاح',
                'data' => $supplier->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إلغاء تفعيل المورد',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * تعليق مورد
     */
    public function suspend($id): JsonResponse
    {
        $supplier = Supplier::find($id);

        if (!$supplier) {
            return response()->json([
                'success' => false,
                'message' => 'المورد غير موجود'
            ], 404);
        }

        try {
            $supplier->suspend();

            return response()->json([
                'success' => true,
                'message' => 'تم تعليق المورد بنجاح',
                'data' => $supplier->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تعليق المورد',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * تحديث تقييم المورد
     */
    public function updateRating(Request $request, $id): JsonResponse
    {
        $supplier = Supplier::find($id);

        if (!$supplier) {
            return response()->json([
                'success' => false,
                'message' => 'المورد غير موجود'
            ], 404);
        }

        $request->validate([
            'rating' => 'required|integer|min:0|max:5'
        ], [
            'rating.required' => 'التقييم مطلوب',
            'rating.integer' => 'التقييم يجب أن يكون رقم',
            'rating.min' => 'التقييم يجب أن يكون بين 0 و 5',
            'rating.max' => 'التقييم يجب أن يكون بين 0 و 5',
        ]);

        try {
            $supplier->updateRating($request->rating);

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث تقييم المورد بنجاح',
                'data' => $supplier->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث تقييم المورد',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * إنشاء رقم المورد التلقائي
     */
    private function generateSupplierNumber(): string
    {
        $lastSupplier = Supplier::orderBy('id', 'desc')->first();
        $nextNumber = $lastSupplier ? $lastSupplier->id + 1 : 1;
        
        return 'SUP-' . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);
    }
}

