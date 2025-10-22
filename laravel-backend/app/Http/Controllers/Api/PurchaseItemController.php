<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PurchaseItem;
use App\Http\Requests\Supplier\StorePurchaseItemRequest;
use App\Http\Requests\Supplier\UpdatePurchaseItemRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PurchaseItemController extends Controller
{
    /**
     * عرض قائمة عناصر المشتريات
     */
    public function index(Request $request): JsonResponse
    {
        $query = PurchaseItem::with('purchase.supplier');

        // الفلترة حسب المشترى
        if ($request->has('purchase_id') && $request->purchase_id) {
            $query->where('purchase_id', $request->purchase_id);
        }

        // الفلترة حسب الحالة
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // الفلترة حسب الفئة
        if ($request->has('category') && $request->category) {
            $query->where('category', $request->category);
        }

        // البحث
        if ($request->has('search') && $request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        // الترتيب
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // الصفحات
        $perPage = $request->get('per_page', 15);
        $items = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $items
        ]);
    }

    /**
     * إنشاء عنصر جديد
     */
    public function store(StorePurchaseItemRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $data['total_price'] = $data['quantity'] * $data['unit_price'];

            $item = PurchaseItem::create($data);

            // إعادة حساب المبلغ الإجمالي للمشترى
            if ($item->purchase) {
                $item->purchase->calculateTotalAmount();
            }

            return response()->json([
                'success' => true,
                'message' => 'تم إنشاء العنصر بنجاح',
                'data' => $item->load('purchase')
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إنشاء العنصر',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * عرض تفاصيل عنصر
     */
    public function show($id): JsonResponse
    {
        $item = PurchaseItem::with('purchase.supplier')->find($id);

        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'العنصر غير موجود'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $item
        ]);
    }

    /**
     * تحديث عنصر
     */
    public function update(UpdatePurchaseItemRequest $request, $id): JsonResponse
    {
        $item = PurchaseItem::find($id);

        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'العنصر غير موجود'
            ], 404);
        }

        try {
            $data = $request->validated();
            
            // إعادة حساب السعر الإجمالي إذا تغيرت الكمية أو سعر الوحدة
            if (isset($data['quantity']) || isset($data['unit_price'])) {
                $quantity = $data['quantity'] ?? $item->quantity;
                $unitPrice = $data['unit_price'] ?? $item->unit_price;
                $data['total_price'] = $quantity * $unitPrice;
            }

            $item->update($data);

            // إعادة حساب المبلغ الإجمالي للمشترى
            if ($item->purchase) {
                $item->purchase->calculateTotalAmount();
            }

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث العنصر بنجاح',
                'data' => $item->load('purchase')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث العنصر',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * حذف عنصر
     */
    public function destroy($id): JsonResponse
    {
        $item = PurchaseItem::find($id);

        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'العنصر غير موجود'
            ], 404);
        }

        try {
            $purchase = $item->purchase;
            $item->delete();

            // إعادة حساب المبلغ الإجمالي للمشترى
            if ($purchase) {
                $purchase->calculateTotalAmount();
            }

            return response()->json([
                'success' => true,
                'message' => 'تم حذف العنصر بنجاح'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف العنصر',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * تحديد عنصر كمستلم
     */
    public function markAsReceived(Request $request, $id): JsonResponse
    {
        $item = PurchaseItem::find($id);

        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'العنصر غير موجود'
            ], 404);
        }

        try {
            $item->markAsReceived($request->get('received_date'));

            return response()->json([
                'success' => true,
                'message' => 'تم تحديد العنصر كمستلم بنجاح',
                'data' => $item->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث العنصر',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * تحديد عنصر كفي الطريق
     */
    public function markAsInTransit($id): JsonResponse
    {
        $item = PurchaseItem::find($id);

        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'العنصر غير موجود'
            ], 404);
        }

        try {
            $item->markAsInTransit();

            return response()->json([
                'success' => true,
                'message' => 'تم تحديد العنصر كفي الطريق بنجاح',
                'data' => $item->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث العنصر',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

