<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\CustomerNote;
use App\Models\CustomerComment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class CustomerController extends Controller
{
    /**
     * عرض قائمة العملاء
     */
    public function index(Request $request): JsonResponse
    {
        $query = Customer::query();

        // البحث بالاسم
        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // البحث بالرقم
        if ($request->has('customer_number') && $request->customer_number) {
            $query->where('customer_number', 'like', '%' . $request->customer_number . '%');
        }

        // الفلترة حسب النوع
        if ($request->has('customer_type') && $request->customer_type) {
            $query->where('customer_type', $request->customer_type);
        }

        // الفلترة حسب الحالة
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // الفلترة حسب الجنسية
        if ($request->has('nationality') && $request->nationality) {
            $query->where('nationality', $request->nationality);
        }

        // الترتيب
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // الصفحات
        $perPage = $request->get('per_page', 15);
        $customers = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $customers
        ]);
    }

    /**
     * إنشاء عميل جديد
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'phones' => 'nullable|array',
            'address' => 'nullable|string',
            'nationality' => 'nullable|string|max:100',
            'customer_type' => 'required|in:INDIVIDUAL,COMPANY',
            'id_number' => 'nullable|string|max:50',
            'commercial_record' => 'nullable|string|max:50',
            'guarantor_name' => 'nullable|string|max:255',
            'guarantor_phone' => 'nullable|string|max:20',
            'guarantor_id' => 'nullable|string|max:50',
            'guarantor_data' => 'nullable|array',
            'notes' => 'nullable|string',
            'warnings' => 'nullable|string',
            'rating' => 'nullable|integer|min:0|max:5',
        ], [
            'name.required' => 'الاسم مطلوب',
            'email.email' => 'البريد الإلكتروني غير صحيح',
            'customer_type.required' => 'نوع العميل مطلوب',
            'customer_type.in' => 'نوع العميل غير صحيح',
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

            // إنشاء رقم العميل التلقائي
            $customerNumber = $this->generateCustomerNumber();

            $customer = Customer::create([
                'customer_number' => $customerNumber,
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'phones' => $request->phones,
                'address' => $request->address,
                'nationality' => $request->nationality,
                'customer_type' => $request->customer_type,
                'id_number' => $request->id_number,
                'commercial_record' => $request->commercial_record,
                'status' => 'ACTIVE',
                'registration_date' => now(),
                'guarantor_name' => $request->guarantor_name,
                'guarantor_phone' => $request->guarantor_phone,
                'guarantor_id' => $request->guarantor_id,
                'guarantor_data' => $request->guarantor_data,
                'notes' => $request->notes,
                'warnings' => $request->warnings,
                'rating' => $request->rating ?? 0,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'تم إنشاء العميل بنجاح',
                'data' => $customer
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إنشاء العميل',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * عرض تفاصيل عميل
     */
    public function show($id): JsonResponse
    {
        $customer = Customer::with(['contracts', 'payments', 'notes', 'comments', 'deliveries', 'claims'])
                           ->find($id);

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'العميل غير موجود'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $customer
        ]);
    }

    /**
     * تحديث عميل
     */
    public function update(Request $request, $id): JsonResponse
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'العميل غير موجود'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'phones' => 'nullable|array',
            'address' => 'nullable|string',
            'nationality' => 'nullable|string|max:100',
            'customer_type' => 'required|in:INDIVIDUAL,COMPANY',
            'id_number' => 'nullable|string|max:50',
            'commercial_record' => 'nullable|string|max:50',
            'status' => 'nullable|in:ACTIVE,INACTIVE,SUSPENDED',
            'guarantor_name' => 'nullable|string|max:255',
            'guarantor_phone' => 'nullable|string|max:20',
            'guarantor_id' => 'nullable|string|max:50',
            'guarantor_data' => 'nullable|array',
            'notes' => 'nullable|string',
            'warnings' => 'nullable|string',
            'rating' => 'nullable|integer|min:0|max:5',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $customer->update($request->only([
                'name', 'email', 'phone', 'phones', 'address', 'nationality',
                'customer_type', 'id_number', 'commercial_record', 'status',
                'guarantor_name', 'guarantor_phone', 'guarantor_id', 'guarantor_data',
                'notes', 'warnings', 'rating'
            ]));

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث العميل بنجاح',
                'data' => $customer
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث العميل',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * حذف عميل
     */
    public function destroy($id): JsonResponse
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'العميل غير موجود'
            ], 404);
        }

        // التحقق من وجود عقود مرتبطة
        if ($customer->contracts()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'لا يمكن حذف العميل لوجود عقود مرتبطة به'
            ], 422);
        }

        try {
            $customer->delete();

            return response()->json([
                'success' => true,
                'message' => 'تم حذف العميل بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف العميل',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * إحصائيات العملاء
     */
    public function stats(): JsonResponse
    {
        $stats = [
            'total' => Customer::count(),
            'active' => Customer::active()->count(),
            'inactive' => Customer::inactive()->count(),
            'suspended' => Customer::suspended()->count(),
            'individual' => Customer::individual()->count(),
            'company' => Customer::company()->count(),
            'new_this_month' => Customer::whereMonth('registration_date', now()->month)
                                    ->whereYear('registration_date', now()->year)
                                    ->count(),
            'top_nationalities' => Customer::select('nationality', DB::raw('count(*) as count'))
                                        ->groupBy('nationality')
                                        ->orderBy('count', 'desc')
                                        ->limit(5)
                                        ->get(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * إضافة ملاحظة للعميل
     */
    public function addNote(Request $request, $id): JsonResponse
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'العميل غير موجود'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'content' => 'required|string',
            'priority' => 'nullable|in:LOW,NORMAL,HIGH,URGENT',
        ], [
            'content.required' => 'محتوى الملاحظة مطلوب',
            'priority.in' => 'أولوية الملاحظة غير صحيحة',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $validator->errors()
            ], 422);
        }

        $note = $customer->notes()->create([
            'content' => $request->content,
            'priority' => $request->priority ?? 'NORMAL',
            'created_by' => auth()->id(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'تم إضافة الملاحظة بنجاح',
            'data' => $note
        ], 201);
    }

    /**
     * إضافة تعليق للعميل
     */
    public function addComment(Request $request, $id): JsonResponse
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'العميل غير موجود'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'content' => 'required|string',
            'hashtags' => 'nullable|array',
        ], [
            'content.required' => 'محتوى التعليق مطلوب',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $validator->errors()
            ], 422);
        }

        $comment = $customer->comments()->create([
            'content' => $request->content,
            'hashtags' => $request->hashtags ?? [],
            'created_by' => auth()->id(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'تم إضافة التعليق بنجاح',
            'data' => $comment
        ], 201);
    }

    /**
     * رفع صورة البطاقة الشخصية
     */
    public function uploadIdCard(Request $request, $id): JsonResponse
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'العميل غير موجود'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'id_card' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'type' => 'required|in:customer,guarantor',
        ], [
            'id_card.required' => 'صورة البطاقة مطلوبة',
            'id_card.image' => 'الملف يجب أن يكون صورة',
            'id_card.mimes' => 'نوع الصورة غير مدعوم',
            'id_card.max' => 'حجم الصورة يجب أن يكون أقل من 2 ميجابايت',
            'type.required' => 'نوع البطاقة مطلوب',
            'type.in' => 'نوع البطاقة غير صحيح',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $file = $request->file('id_card');
            $fileName = 'id_card_' . $id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('customers/id_cards', $fileName, 'public');

            if ($request->type === 'customer') {
                $customer->update(['id_card_copy' => $path]);
            } else {
                $customer->update(['guarantor_id_card_copy' => $path]);
            }

            return response()->json([
                'success' => true,
                'message' => 'تم رفع صورة البطاقة بنجاح',
                'data' => [
                    'path' => $path,
                    'url' => Storage::url($path)
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء رفع الصورة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * جلب عقود عميل معين
     */
    public function getContracts($id): JsonResponse
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'العميل غير موجود'
            ], 404);
        }

        $contracts = $customer->contracts()
            ->with(['rentalDetails', 'payments'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $contracts,
            'message' => 'تم جلب عقود العميل بنجاح'
        ]);
    }

    /**
     * إحصائيات عقود عميل معين
     */
    public function getContractsStats($id): JsonResponse
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'العميل غير موجود'
            ], 404);
        }

        $contracts = $customer->contracts();
        
        $stats = [
            'total_contracts' => $contracts->count(),
            'active_contracts' => $contracts->where('status', 'ACTIVE')->count(),
            'expired_contracts' => $contracts->where('status', 'EXPIRED')->count(),
            'cancelled_contracts' => $contracts->where('status', 'CANCELLED')->count(),
            'total_value' => $contracts->sum('total_after_discount'),
            'total_paid' => $contracts->sum('paid_amount'),
            'total_remaining' => $contracts->sum('remaining_amount'),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
            'message' => 'تم جلب إحصائيات العقود بنجاح'
        ]);
    }

    /**
     * جلب مطالبات عميل معين (المدفوعات المتأخرة)
     */
    public function getClaims($id): JsonResponse
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'العميل غير موجود'
            ], 404);
        }

        // جلب العقود مع جداول المدفوعات المتأخرة
        $claims = DB::table('contracts')
            ->join('payment_schedules', 'contracts.id', '=', 'payment_schedules.contract_id')
            ->where('contracts.customer_id', $id)
            ->where('payment_schedules.status', 'PENDING')
            ->where('payment_schedules.due_date', '<', now())
            ->select([
                'payment_schedules.id as payment_id',
                'payment_schedules.amount',
                'payment_schedules.due_date',
                'payment_schedules.status',
                'payment_schedules.notes',
                'contracts.id as contract_id',
                'contracts.contract_number',
                'contracts.customer_name',
                'contracts.total_after_discount as contract_value',
                DB::raw('CAST((julianday("now") - julianday(payment_schedules.due_date)) AS INTEGER) as days_overdue')
            ])
            ->orderBy('payment_schedules.due_date', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $claims,
            'message' => 'تم جلب المطالبات بنجاح'
        ]);
    }

    /**
     * إحصائيات مطالبات عميل معين
     */
    public function getClaimsStats($id): JsonResponse
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'العميل غير موجود'
            ], 404);
        }

        // إحصائيات المدفوعات المتأخرة من payment_schedules
        $allSchedules = DB::table('contracts')
            ->join('payment_schedules', 'contracts.id', '=', 'payment_schedules.contract_id')
            ->where('contracts.customer_id', $id);

        $overdueSchedules = (clone $allSchedules)
            ->where('payment_schedules.status', 'PENDING')
            ->where('payment_schedules.due_date', '<', now());

        $paidSchedules = (clone $allSchedules)
            ->where('payment_schedules.status', 'PAID');

        $stats = [
            'total_claims' => $overdueSchedules->count(),
            'total_amount' => $overdueSchedules->sum('payment_schedules.amount') ?: 0,
            'overdue_claims' => (clone $overdueSchedules)->where('payment_schedules.due_date', '<', now()->subDays(30))->count(),
            'recent_claims' => (clone $overdueSchedules)->where('payment_schedules.due_date', '>=', now()->subDays(30))->count(),
            'collected_amount' => $paidSchedules->sum('payment_schedules.amount') ?: 0,
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
            'message' => 'تم جلب إحصائيات المطالبات بنجاح'
        ]);
    }

    /**
     * إنشاء رقم العميل التلقائي
     */
    private function generateCustomerNumber(): string
    {
        $lastCustomer = Customer::orderBy('id', 'desc')->first();
        $nextNumber = $lastCustomer ? $lastCustomer->id + 1 : 1;
        
        return 'CUST-' . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);
    }
}
