<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SupplierPurchase;
use App\Models\PurchaseItem;
use App\Http\Requests\Supplier\StoreSupplierPurchaseRequest;
use App\Http\Requests\Supplier\UpdateSupplierPurchaseRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class SupplierPurchaseController extends Controller
{
    /**
     * عرض قائمة المشتريات
     */
    public function index(Request $request): JsonResponse
    {
        $query = SupplierPurchase::with(['supplier', 'invoice', 'items']);

        // البحث
        if ($request->has('search') && $request->search) {
            $query->where(function($q) use ($request) {
                $q->where('purchase_number', 'like', '%' . $request->search . '%')
                  ->orWhere('notes', 'like', '%' . $request->search . '%')
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
            $query->where('purchase_date', '>=', $request->date_from);
        }

        if ($request->has('date_to') && $request->date_to) {
            $query->where('purchase_date', '<=', $request->date_to);
        }

        // الترتيب
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // الصفحات
        $perPage = $request->get('per_page', 15);
        $purchases = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $purchases
        ]);
    }

    /**
     * إنشاء مشترى جديد
     */
    public function store(StoreSupplierPurchaseRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $data = $request->validated();
            $items = $data['items'] ?? [];
            unset($data['items']);

            // إنشاء المشترى
            $purchase = SupplierPurchase::create($data);

            // إضافة العناصر إذا وجدت
            if (!empty($items)) {
                foreach ($items as $item) {
                    $totalPrice = $item['quantity'] * $item['unit_price'];
                    $purchase->items()->create([
                        'name' => $item['name'],
                        'description' => $item['description'] ?? null,
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['unit_price'],
                        'total_price' => $totalPrice,
                        'category' => $item['category'],
                        'unit' => $item['unit'],
                        'status' => 'معلق',
                    ]);
                }

                // إعادة حساب المبلغ الإجمالي
                $purchase->calculateTotalAmount();
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'تم إنشاء المشترى بنجاح',
                'data' => $purchase->load(['supplier', 'invoice', 'items'])
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إنشاء المشترى',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * عرض تفاصيل مشترى
     */
    public function show($id): JsonResponse
    {
        $purchase = SupplierPurchase::with(['supplier', 'invoice', 'items'])->find($id);

        if (!$purchase) {
            return response()->json([
                'success' => false,
                'message' => 'المشترى غير موجود'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $purchase
        ]);
    }

    /**
     * تحديث مشترى
     */
    public function update(UpdateSupplierPurchaseRequest $request, $id): JsonResponse
    {
        $purchase = SupplierPurchase::find($id);

        if (!$purchase) {
            return response()->json([
                'success' => false,
                'message' => 'المشترى غير موجود'
            ], 404);
        }

        try {
            $purchase->update($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث المشترى بنجاح',
                'data' => $purchase->load(['supplier', 'invoice', 'items'])
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث المشترى',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * حذف مشترى
     */
    public function destroy($id): JsonResponse
    {
        $purchase = SupplierPurchase::find($id);

        if (!$purchase) {
            return response()->json([
                'success' => false,
                'message' => 'المشترى غير موجود'
            ], 404);
        }

        try {
            $purchase->delete();

            return response()->json([
                'success' => true,
                'message' => 'تم حذف المشترى بنجاح'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف المشترى',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * إحصائيات المشتريات
     */
    public function stats(Request $request): JsonResponse
    {
        $supplierId = $request->get('supplier_id');
        $query = SupplierPurchase::query();

        if ($supplierId) {
            $query->where('supplier_id', $supplierId);
        }

        $stats = [
            'total' => $query->count(),
            'total_amount' => $query->sum('total_amount'),
            'pending' => $query->where('status', 'PENDING')->count(),
            'pending_amount' => $query->where('status', 'PENDING')->sum('total_amount'),
            'confirmed' => $query->where('status', 'CONFIRMED')->count(),
            'confirmed_amount' => $query->where('status', 'CONFIRMED')->sum('total_amount'),
            'delivered' => $query->where('status', 'DELIVERED')->count(),
            'delivered_amount' => $query->where('status', 'DELIVERED')->sum('total_amount'),
            'cancelled' => $query->where('status', 'CANCELLED')->count(),
            'total_items' => PurchaseItem::whereIn('purchase_id', $query->pluck('id'))->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * تأكيد المشترى
     */
    public function confirm($id): JsonResponse
    {
        $purchase = SupplierPurchase::find($id);

        if (!$purchase) {
            return response()->json([
                'success' => false,
                'message' => 'المشترى غير موجود'
            ], 404);
        }

        try {
            $purchase->confirm();

            return response()->json([
                'success' => true,
                'message' => 'تم تأكيد المشترى بنجاح',
                'data' => $purchase->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تأكيد المشترى',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * تحديد المشترى كمسلم
     */
    public function markAsDelivered(Request $request, $id): JsonResponse
    {
        $purchase = SupplierPurchase::find($id);

        if (!$purchase) {
            return response()->json([
                'success' => false,
                'message' => 'المشترى غير موجود'
            ], 404);
        }

        try {
            $purchase->markAsDelivered($request->get('delivery_date'));

            return response()->json([
                'success' => true,
                'message' => 'تم تحديد المشترى كمسلم بنجاح',
                'data' => $purchase->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث المشترى',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * إلغاء المشترى
     */
    public function cancel($id): JsonResponse
    {
        $purchase = SupplierPurchase::find($id);

        if (!$purchase) {
            return response()->json([
                'success' => false,
                'message' => 'المشترى غير موجود'
            ], 404);
        }

        try {
            $purchase->cancel();

            return response()->json([
                'success' => true,
                'message' => 'تم إلغاء المشترى بنجاح',
                'data' => $purchase->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إلغاء المشترى',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * إضافة عنصر للمشترى
     */
    public function addItem(Request $request, $id): JsonResponse
    {
        $purchase = SupplierPurchase::find($id);

        if (!$purchase) {
            return response()->json([
                'success' => false,
                'message' => 'المشترى غير موجود'
            ], 404);
        }

        try {
            $item = $purchase->addItem(
                $request->name,
                $request->description,
                $request->quantity,
                $request->unit_price,
                $request->category,
                $request->unit ?? 'قطعة'
            );

            return response()->json([
                'success' => true,
                'message' => 'تم إضافة العنصر بنجاح',
                'data' => $item
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إضافة العنصر',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * إزالة عنصر من المشترى
     */
    public function removeItem($purchaseId, $itemId): JsonResponse
    {
        $purchase = SupplierPurchase::find($purchaseId);

        if (!$purchase) {
            return response()->json([
                'success' => false,
                'message' => 'المشترى غير موجود'
            ], 404);
        }

        try {
            $deleted = $purchase->removeItem($itemId);

            if (!$deleted) {
                return response()->json([
                    'success' => false,
                    'message' => 'العنصر غير موجود'
                ], 404);
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
     * إنشاء رقم المشترى التلقائي
     */
    private function generatePurchaseNumber(): string
    {
        $lastPurchase = SupplierPurchase::orderBy('id', 'desc')->first();
        $nextNumber = $lastPurchase ? $lastPurchase->id + 1 : 1;
        
        return 'PUR-' . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);
    }
}

