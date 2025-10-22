<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Contract;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PaymentController extends Controller
{
    /**
     * عرض قائمة المدفوعات
     */
    public function index(Request $request): JsonResponse
    {
        $query = Payment::with(['contract', 'customer', 'createdBy']);

        // البحث برقم العقد
        if ($request->has('contract_id') && $request->contract_id) {
            $query->where('contract_id', $request->contract_id);
        }

        // البحث بالعميل
        if ($request->has('customer_id') && $request->customer_id) {
            $query->where('customer_id', $request->customer_id);
        }

        // البحث برقم الإيصال
        if ($request->has('receipt_number') && $request->receipt_number) {
            $query->where('receipt_number', 'like', '%' . $request->receipt_number . '%');
        }

        // الفلترة حسب طريقة الدفع
        if ($request->has('payment_method') && $request->payment_method) {
            $query->where('payment_method', $request->payment_method);
        }

        // الفلترة حسب الحالة
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // الفلترة حسب التاريخ
        if ($request->has('start_date') && $request->start_date) {
            $query->whereDate('payment_date', '>=', $request->start_date);
        }

        if ($request->has('end_date') && $request->end_date) {
            $query->whereDate('payment_date', '<=', $request->end_date);
        }

        // الترتيب
        $sortBy = $request->get('sort_by', 'payment_date');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // الصفحات
        $perPage = $request->get('per_page', 15);
        $payments = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $payments
        ]);
    }

    /**
     * إنشاء دفعة جديدة
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'contract_id' => 'required|exists:contracts,id',
            'customer_id' => 'required|exists:customers,id',
            'payment_method' => 'required|in:cash,check,credit_card,bank_transfer',
            'amount' => 'required|numeric|min:0.01',
            'payment_date' => 'required|date',
            'description' => 'nullable|string',
            'notes' => 'nullable|string',
            'check_number' => 'required_if:payment_method,check|nullable|string',
            'bank_name' => 'required_if:payment_method,check|nullable|string',
            'check_date' => 'required_if:payment_method,check|nullable|date',
            'receipt_number' => 'nullable|string|unique:payments',
        ], [
            'contract_id.required' => 'العقد مطلوب',
            'contract_id.exists' => 'العقد غير موجود',
            'customer_id.required' => 'العميل مطلوب',
            'customer_id.exists' => 'العميل غير موجود',
            'payment_method.required' => 'طريقة الدفع مطلوبة',
            'payment_method.in' => 'طريقة الدفع غير صحيحة',
            'amount.required' => 'المبلغ مطلوب',
            'amount.min' => 'المبلغ يجب أن يكون أكبر من صفر',
            'payment_date.required' => 'تاريخ الدفع مطلوب',
            'check_number.required_if' => 'رقم الشيك مطلوب عند الدفع بالشيك',
            'bank_name.required_if' => 'اسم البنك مطلوب عند الدفع بالشيك',
            'check_date.required_if' => 'تاريخ الشيك مطلوب عند الدفع بالشيك',
            'receipt_number.unique' => 'رقم الإيصال مستخدم بالفعل',
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

            $contract = Contract::find($request->contract_id);
            
            // التحقق من أن المبلغ لا يتجاوز المبلغ المتبقي
            $remainingAmount = $contract->remaining_amount;
            if ($request->amount > $remainingAmount) {
                return response()->json([
                    'success' => false,
                    'message' => 'المبلغ يتجاوز المبلغ المتبقي في العقد'
                ], 422);
            }

            // إنشاء رقم الإيصال التلقائي إذا لم يتم توفيره
            $receiptNumber = $request->receipt_number ?? $this->generateReceiptNumber();

            $payment = Payment::create([
                'contract_id' => $request->contract_id,
                'customer_id' => $request->customer_id,
                'payment_method' => $request->payment_method,
                'amount' => $request->amount,
                'payment_date' => $request->payment_date,
                'description' => $request->description,
                'notes' => $request->notes,
                'check_number' => $request->check_number,
                'bank_name' => $request->bank_name,
                'check_date' => $request->check_date,
                'receipt_number' => $receiptNumber,
                'status' => 'pending',
                'created_by' => auth()->id(),
            ]);

            // تحديث إجمالي المدفوعات في العقد
            $contract->updatePaymentTotal();

            DB::commit();

            $payment->load(['contract', 'customer', 'createdBy']);

            return response()->json([
                'success' => true,
                'message' => 'تم إنشاء الدفعة بنجاح',
                'data' => $payment
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إنشاء الدفعة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * عرض تفاصيل دفعة
     */
    public function show($id): JsonResponse
    {
        $payment = Payment::with(['contract', 'customer', 'createdBy'])->find($id);

        if (!$payment) {
            return response()->json([
                'success' => false,
                'message' => 'الدفعة غير موجودة'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $payment
        ]);
    }

    /**
     * تحديث دفعة
     */
    public function update(Request $request, $id): JsonResponse
    {
        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json([
                'success' => false,
                'message' => 'الدفعة غير موجودة'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'payment_method' => 'nullable|in:cash,check,credit_card,bank_transfer',
            'amount' => 'nullable|numeric|min:0.01',
            'payment_date' => 'nullable|date',
            'description' => 'nullable|string',
            'notes' => 'nullable|string',
            'status' => 'nullable|in:pending,completed,cancelled',
            'check_number' => 'nullable|string',
            'bank_name' => 'nullable|string',
            'check_date' => 'nullable|date',
            'receipt_number' => 'nullable|string|unique:payments,receipt_number,' . $id,
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $oldAmount = $payment->amount;
            $payment->update($request->only([
                'payment_method', 'amount', 'payment_date', 'description',
                'notes', 'status', 'check_number', 'bank_name',
                'check_date', 'receipt_number'
            ]));

            // إذا تم تغيير المبلغ، تحديث العقد
            if ($request->has('amount') && $request->amount != $oldAmount) {
                $payment->contract->updatePaymentTotal();
            }

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث الدفعة بنجاح',
                'data' => $payment
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث الدفعة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * حذف دفعة
     */
    public function destroy($id): JsonResponse
    {
        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json([
                'success' => false,
                'message' => 'الدفعة غير موجودة'
            ], 404);
        }

        try {
            $contract = $payment->contract;
            $payment->delete();
            
            // تحديث إجمالي المدفوعات في العقد
            $contract->updatePaymentTotal();

            return response()->json([
                'success' => true,
                'message' => 'تم حذف الدفعة بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف الدفعة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * إحصائيات المدفوعات
     */
    public function stats(): JsonResponse
    {
        $stats = [
            'total_payments' => Payment::count(),
            'total_amount' => Payment::sum('amount'),
            'completed_payments' => Payment::completed()->count(),
            'pending_payments' => Payment::pending()->count(),
            'cancelled_payments' => Payment::cancelled()->count(),
            'cash_payments' => Payment::byPaymentMethod('cash')->count(),
            'check_payments' => Payment::byPaymentMethod('check')->count(),
            'bank_transfer_payments' => Payment::byPaymentMethod('bank_transfer')->count(),
            'credit_card_payments' => Payment::byPaymentMethod('credit_card')->count(),
            'payments_this_month' => Payment::whereMonth('payment_date', now()->month)
                                           ->whereYear('payment_date', now()->year)
                                           ->count(),
            'amount_this_month' => Payment::whereMonth('payment_date', now()->month)
                                         ->whereYear('payment_date', now()->year)
                                         ->sum('amount'),
            'daily_payments' => Payment::whereDate('payment_date', now())
                                      ->sum('amount'),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * رفع صورة الشيك
     */
    public function uploadCheckImage(Request $request, $id): JsonResponse
    {
        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json([
                'success' => false,
                'message' => 'الدفعة غير موجودة'
            ], 404);
        }

        if ($payment->payment_method !== 'check') {
            return response()->json([
                'success' => false,
                'message' => 'هذه الدفعة ليست بالشيك'
            ], 422);
        }

        $validator = Validator::make($request->all(), [
            'check_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ], [
            'check_image.required' => 'صورة الشيك مطلوبة',
            'check_image.image' => 'الملف يجب أن يكون صورة',
            'check_image.mimes' => 'نوع الصورة غير مدعوم',
            'check_image.max' => 'حجم الصورة يجب أن يكون أقل من 2 ميجابايت',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $file = $request->file('check_image');
            $fileName = 'check_' . $id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('payments/checks', $fileName, 'public');

            $payment->update(['check_image' => $path]);

            return response()->json([
                'success' => true,
                'message' => 'تم رفع صورة الشيك بنجاح',
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
     * تأكيد الدفعة
     */
    public function confirm($id): JsonResponse
    {
        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json([
                'success' => false,
                'message' => 'الدفعة غير موجودة'
            ], 404);
        }

        if ($payment->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'الدفعة ليست في حالة انتظار'
            ], 422);
        }

        try {
            $payment->markAsCompleted();
            $payment->contract->updatePaymentTotal();

            return response()->json([
                'success' => true,
                'message' => 'تم تأكيد الدفعة بنجاح',
                'data' => $payment
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تأكيد الدفعة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * إلغاء الدفعة
     */
    public function cancel($id): JsonResponse
    {
        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json([
                'success' => false,
                'message' => 'الدفعة غير موجودة'
            ], 404);
        }

        if ($payment->status === 'cancelled') {
            return response()->json([
                'success' => false,
                'message' => 'الدفعة ملغية بالفعل'
            ], 422);
        }

        try {
            $payment->cancel();
            $payment->contract->updatePaymentTotal();

            return response()->json([
                'success' => true,
                'message' => 'تم إلغاء الدفعة بنجاح',
                'data' => $payment
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إلغاء الدفعة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * إنشاء رقم الإيصال التلقائي
     */
    private function generateReceiptNumber(): string
    {
        $lastPayment = Payment::orderBy('id', 'desc')->first();
        $nextNumber = $lastPayment ? $lastPayment->id + 1 : 1;
        
        return 'RCP-' . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);
    }
}
