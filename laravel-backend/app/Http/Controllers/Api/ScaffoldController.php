<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Scaffold;
use App\Models\Supplier;
use App\Models\ScaffoldMaintenance;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ScaffoldController extends Controller
{
    /**
     * الحصول على السقالات المتاحة فقط
     */
    public function available(Request $request): JsonResponse
    {
        $scaffolds = Scaffold::where('status', 'AVAILABLE')
            ->where('available_quantity', '>', 0)
            ->with(['supplier'])
            ->orderBy('scaffold_number')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $scaffolds,
            'message' => 'تم جلب السقالات المتاحة بنجاح'
        ]);
    }

    /**
     * عرض قائمة السقالات
     */
    public function index(Request $request): JsonResponse
    {
        $query = Scaffold::with(['supplier']);

        // البحث برقم السقالة
        if ($request->has('scaffold_number') && $request->scaffold_number) {
            $query->where('scaffold_number', 'like', '%' . $request->scaffold_number . '%');
        }

        // الفلترة حسب النوع
        if ($request->has('type') && $request->type) {
            $query->where('type', $request->type);
        }

        // الفلترة حسب المادة
        if ($request->has('material') && $request->material) {
            $query->where('material', $request->material);
        }

        // الفلترة حسب الحالة
        if ($request->has('condition') && $request->condition) {
            $query->where('condition', $request->condition);
        }

        // الفلترة حسب الحالة
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // الفلترة حسب المورد
        if ($request->has('supplier_id') && $request->supplier_id) {
            $query->where('supplier_id', $request->supplier_id);
        }

        // البحث في الموقع
        if ($request->has('location') && $request->location) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }

        // الترتيب
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // الصفحات
        $perPage = $request->get('per_page', 15);
        $scaffolds = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $scaffolds
        ]);
    }

    /**
     * إنشاء سقالة جديدة
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|in:STANDARD,HEAVY_DUTY,LIGHT_DUTY,MOBILE',
            'size' => 'required|array',
            'size.height' => 'required|numeric|min:0',
            'size.width' => 'required|numeric|min:0',
            'size.length' => 'required|numeric|min:0',
            'material' => 'required|in:STEEL,ALUMINUM,WOOD,COMPOSITE',
            'condition' => 'required|in:NEW,USED,GOOD,FAIR,POOR',
            'quantity' => 'required|integer|min:1',
            'available_quantity' => 'required|integer|min:0',
            'location' => 'required|string|max:255',
            'warehouse_location' => 'required|string|max:255',
            'selling_price' => 'nullable|numeric|min:0',
            'daily_rental_price' => 'nullable|numeric|min:0',
            'monthly_rental_price' => 'nullable|numeric|min:0',
            'entry_date' => 'required|date',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'notes' => 'nullable|string',
            'images' => 'nullable|array',
            'attachments' => 'nullable|array',
        ], [
            'type.required' => 'نوع السقالة مطلوب',
            'type.in' => 'نوع السقالة غير صحيح',
            'size.required' => 'أبعاد السقالة مطلوبة',
            'size.height.required' => 'ارتفاع السقالة مطلوب',
            'size.width.required' => 'عرض السقالة مطلوب',
            'size.length.required' => 'طول السقالة مطلوب',
            'material.required' => 'مادة السقالة مطلوبة',
            'material.in' => 'مادة السقالة غير صحيحة',
            'condition.required' => 'حالة السقالة مطلوبة',
            'condition.in' => 'حالة السقالة غير صحيحة',
            'quantity.required' => 'الكمية مطلوبة',
            'quantity.min' => 'الكمية يجب أن تكون أكبر من صفر',
            'available_quantity.required' => 'الكمية المتاحة مطلوبة',
            'available_quantity.min' => 'الكمية المتاحة يجب أن تكون أكبر من أو تساوي صفر',
            'location.required' => 'الموقع مطلوب',
            'warehouse_location.required' => 'موقع المستودع مطلوب',
            'entry_date.required' => 'تاريخ الدخول مطلوب',
            'supplier_id.exists' => 'المورد غير موجود',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $scaffoldNumber = $this->generateScaffoldNumber();

            $scaffold = Scaffold::create([
                'scaffold_number' => $scaffoldNumber,
                'type' => $request->type,
                'size' => $request->size,
                'material' => $request->material,
                'condition' => $request->condition,
                'status' => $request->available_quantity > 0 ? 'AVAILABLE' : 'RENTED',
                'quantity' => $request->quantity,
                'available_quantity' => $request->available_quantity,
                'location' => $request->location,
                'warehouse_location' => $request->warehouse_location,
                'selling_price' => $request->selling_price ?? 0,
                'daily_rental_price' => $request->daily_rental_price ?? 0,
                'monthly_rental_price' => $request->monthly_rental_price ?? 0,
                'entry_date' => $request->entry_date,
                'supplier_id' => $request->supplier_id,
                'notes' => $request->notes,
                'images' => $request->images ?? [],
                'attachments' => $request->attachments ?? [],
            ]);

            DB::commit();

            $scaffold->load(['supplier']);

            return response()->json([
                'success' => true,
                'message' => 'تم إنشاء السقالة بنجاح',
                'data' => $scaffold
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إنشاء السقالة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * عرض تفاصيل سقالة
     */
    public function show($id): JsonResponse
    {
        $scaffold = Scaffold::with(['supplier', 'maintenanceRecords'])->find($id);

        if (!$scaffold) {
            return response()->json([
                'success' => false,
                'message' => 'السقالة غير موجودة'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $scaffold
        ]);
    }

    /**
     * تحديث سقالة
     */
    public function update(Request $request, $id): JsonResponse
    {
        $scaffold = Scaffold::find($id);

        if (!$scaffold) {
            return response()->json([
                'success' => false,
                'message' => 'السقالة غير موجودة'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'type' => 'nullable|in:STANDARD,HEAVY_DUTY,LIGHT_DUTY,MOBILE',
            'size' => 'nullable|array',
            'size.height' => 'required_with:size|numeric|min:0',
            'size.width' => 'required_with:size|numeric|min:0',
            'size.length' => 'required_with:size|numeric|min:0',
            'material' => 'nullable|in:STEEL,ALUMINUM,WOOD,COMPOSITE',
            'condition' => 'nullable|in:NEW,USED,GOOD,FAIR,POOR',
            'quantity' => 'nullable|integer|min:1',
            'available_quantity' => 'nullable|integer|min:0',
            'location' => 'nullable|string|max:255',
            'warehouse_location' => 'nullable|string|max:255',
            'selling_price' => 'nullable|numeric|min:0',
            'daily_rental_price' => 'nullable|numeric|min:0',
            'monthly_rental_price' => 'nullable|numeric|min:0',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'notes' => 'nullable|string',
            'images' => 'nullable|array',
            'attachments' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $updateData = $request->only([
                'type', 'size', 'material', 'condition', 'quantity', 'available_quantity',
                'location', 'warehouse_location', 'selling_price', 'daily_rental_price',
                'monthly_rental_price', 'supplier_id', 'notes', 'images', 'attachments'
            ]);

            // تحديث الحالة بناءً على الكمية المتاحة
            if ($request->has('available_quantity')) {
                $updateData['status'] = $request->available_quantity > 0 ? 'AVAILABLE' : 'RENTED';
            }

            $scaffold->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث السقالة بنجاح',
                'data' => $scaffold
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث السقالة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * حذف سقالة
     */
    public function destroy($id): JsonResponse
    {
        $scaffold = Scaffold::find($id);

        if (!$scaffold) {
            return response()->json([
                'success' => false,
                'message' => 'السقالة غير موجودة'
            ], 404);
        }

        if ($scaffold->status === 'RENTED') {
            return response()->json([
                'success' => false,
                'message' => 'لا يمكن حذف سقالة مستأجرة'
            ], 422);
        }

        try {
            $scaffold->delete();

            return response()->json([
                'success' => true,
                'message' => 'تم حذف السقالة بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف السقالة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * إضافة صيانة للسقالة
     */
    public function addMaintenance(Request $request, $id): JsonResponse
    {
        $scaffold = Scaffold::find($id);

        if (!$scaffold) {
            return response()->json([
                'success' => false,
                'message' => 'السقالة غير موجودة'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'maintenance_date' => 'required|date',
            'description' => 'required|string',
            'cost' => 'nullable|numeric|min:0',
            'technician_name' => 'required|string|max:255',
            'next_maintenance_date' => 'nullable|date|after:maintenance_date',
        ], [
            'maintenance_date.required' => 'تاريخ الصيانة مطلوب',
            'description.required' => 'وصف الصيانة مطلوب',
            'technician_name.required' => 'اسم الفني مطلوب',
            'next_maintenance_date.after' => 'تاريخ الصيانة القادمة يجب أن يكون بعد تاريخ الصيانة الحالية',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $maintenance = ScaffoldMaintenance::create([
                'scaffold_id' => $scaffold->id,
                'maintenance_date' => $request->maintenance_date,
                'description' => $request->description,
                'cost' => $request->cost ?? 0,
                'technician_name' => $request->technician_name,
                'status' => 'scheduled',
                'next_maintenance_date' => $request->next_maintenance_date,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم إضافة الصيانة بنجاح',
                'data' => $maintenance
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إضافة الصيانة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * استئجار سقالة
     */
    public function rent(Request $request, $id): JsonResponse
    {
        $scaffold = Scaffold::find($id);

        if (!$scaffold) {
            return response()->json([
                'success' => false,
                'message' => 'السقالة غير موجودة'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1|max:' . $scaffold->available_quantity,
        ], [
            'quantity.required' => 'الكمية مطلوبة',
            'quantity.min' => 'الكمية يجب أن تكون أكبر من صفر',
            'quantity.max' => 'الكمية المطلوبة غير متاحة',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $scaffold->markAsRented($request->quantity);

            return response()->json([
                'success' => true,
                'message' => 'تم استئجار السقالة بنجاح',
                'data' => $scaffold
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء استئجار السقالة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * إرجاع سقالة
     */
    public function return(Request $request, $id): JsonResponse
    {
        $scaffold = Scaffold::find($id);

        if (!$scaffold) {
            return response()->json([
                'success' => false,
                'message' => 'السقالة غير موجودة'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1',
        ], [
            'quantity.required' => 'الكمية مطلوبة',
            'quantity.min' => 'الكمية يجب أن تكون أكبر من صفر',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $scaffold->markAsReturned($request->quantity);

            return response()->json([
                'success' => true,
                'message' => 'تم إرجاع السقالة بنجاح',
                'data' => $scaffold
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إرجاع السقالة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * بيع سقالة
     */
    public function sell(Request $request, $id): JsonResponse
    {
        $scaffold = Scaffold::find($id);

        if (!$scaffold) {
            return response()->json([
                'success' => false,
                'message' => 'السقالة غير موجودة'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1|max:' . $scaffold->available_quantity,
        ], [
            'quantity.required' => 'الكمية مطلوبة',
            'quantity.min' => 'الكمية يجب أن تكون أكبر من صفر',
            'quantity.max' => 'الكمية المطلوبة غير متاحة',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $scaffold->markAsSold($request->quantity);

            return response()->json([
                'success' => true,
                'message' => 'تم بيع السقالة بنجاح',
                'data' => $scaffold
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء بيع السقالة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * إحصائيات السقالات
     */
    public function stats(): JsonResponse
    {
        $stats = [
            'total' => Scaffold::count(),
            'available' => Scaffold::available()->count(),
            'rented' => Scaffold::rented()->count(),
            'sold' => Scaffold::sold()->count(),
            'maintenance' => Scaffold::maintenance()->count(),
            'reserved' => Scaffold::reserved()->count(),
            'total_quantity' => Scaffold::sum('quantity'),
            'available_quantity' => Scaffold::sum('available_quantity'),
            'rented_quantity' => Scaffold::sum('quantity') - Scaffold::sum('available_quantity'),
            'needs_maintenance' => Scaffold::needsMaintenance()->count(),
            'by_type' => Scaffold::select('type', DB::raw('count(*) as count'))
                                ->groupBy('type')
                                ->get(),
            'by_material' => Scaffold::select('material', DB::raw('count(*) as count'))
                                   ->groupBy('material')
                                   ->get(),
            'by_condition' => Scaffold::select('condition', DB::raw('count(*) as count'))
                                    ->groupBy('condition')
                                    ->get(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * إنشاء رقم السقالة التلقائي
     */
    private function generateScaffoldNumber(): string
    {
        $lastScaffold = Scaffold::orderBy('id', 'desc')->first();
        $nextNumber = $lastScaffold ? $lastScaffold->id + 1 : 1;
        
        return 'SCF-' . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);
    }
}
