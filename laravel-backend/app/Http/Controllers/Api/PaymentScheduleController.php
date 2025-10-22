<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentSchedule;
use App\Models\Contract;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class PaymentScheduleController extends Controller
{
    /**
     * عرض قائمة جداول الدفع
     */
    public function index(Request $request): JsonResponse
    {
        $query = PaymentSchedule::with(['contract']);

        // البحث بالعقد
        if ($request->has('contract_id') && $request->contract_id) {
            $query->where('contract_id', $request->contract_id);
        }

        // الفلترة حسب الحالة
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // الفلترة حسب التاريخ
        if ($request->has('start_date') && $request->start_date) {
            $query->whereDate('due_date', '>=', $request->start_date);
        }

        if ($request->has('end_date') && $request->end_date) {
            $query->whereDate('due_date', '<=', $request->end_date);
        }

        // الفلترة حسب القسط
        if ($request->has('installment_number') && $request->installment_number) {
            $query->where('installment_number', $request->installment_number);
        }

        // الترتيب
        $sortBy = $request->get('sort_by', 'due_date');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        // الصفحات
        $perPage = $request->get('per_page', 15);
        $schedules = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $schedules
        ]);
    }

    /**
     * إنشاء جدول دفع جديد
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'contract_id' => 'required|exists:contracts,id',
            'installment_number' => 'required|integer|min:1',
            'amount' => 'required|numeric|min:0.01',
            'due_date' => 'required|date',
            'notes' => 'nullable|string',
        ], [
            'contract_id.required' => 'العقد مطلوب',
            'contract_id.exists' => 'العقد غير موجود',
            'installment_number.required' => 'رقم القسط مطلوب',
            'installment_number.min' => 'رقم القسط يجب أن يكون أكبر من صفر',
            'amount.required' => 'المبلغ مطلوب',
            'amount.min' => 'المبلغ يجب أن يكون أكبر من صفر',
            'due_date.required' => 'تاريخ الاستحقاق مطلوب',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // التحقق من عدم وجود قسط بنفس الرقم لنفس العقد
            $existingSchedule = PaymentSchedule::where('contract_id', $request->contract_id)
                                             ->where('installment_number', $request->installment_number)
                                             ->first();

            if ($existingSchedule) {
                return response()->json([
                    'success' => false,
                    'message' => 'يوجد قسط بنفس الرقم لهذا العقد'
                ], 422);
            }

            $schedule = PaymentSchedule::create([
                'contract_id' => $request->contract_id,
                'installment_number' => $request->installment_number,
                'amount' => $request->amount,
                'due_date' => $request->due_date,
                'paid_amount' => 0,
                'payment_date' => null,
                'status' => 'pending',
                'notes' => $request->notes,
            ]);

            $schedule->load(['contract']);

            return response()->json([
                'success' => true,
                'message' => 'تم إنشاء جدول الدفع بنجاح',
                'data' => $schedule
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إنشاء جدول الدفع',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * عرض تفاصيل جدول دفع
     */
    public function show($id): JsonResponse
    {
        $schedule = PaymentSchedule::with(['contract'])->find($id);

        if (!$schedule) {
            return response()->json([
                'success' => false,
                'message' => 'جدول الدفع غير موجود'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $schedule
        ]);
    }

    /**
     * تحديث جدول دفع
     */
    public function update(Request $request, $id): JsonResponse
    {
        $schedule = PaymentSchedule::find($id);

        if (!$schedule) {
            return response()->json([
                'success' => false,
                'message' => 'جدول الدفع غير موجود'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'installment_number' => 'nullable|integer|min:1',
            'amount' => 'nullable|numeric|min:0.01',
            'due_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'status' => 'nullable|in:pending,paid,overdue,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $schedule->update($request->only([
                'installment_number', 'amount', 'due_date', 'notes', 'status'
            ]));

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث جدول الدفع بنجاح',
                'data' => $schedule
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث جدول الدفع',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * حذف جدول دفع
     */
    public function destroy($id): JsonResponse
    {
        $schedule = PaymentSchedule::find($id);

        if (!$schedule) {
            return response()->json([
                'success' => false,
                'message' => 'جدول الدفع غير موجود'
            ], 404);
        }

        if ($schedule->status === 'paid') {
            return response()->json([
                'success' => false,
                'message' => 'لا يمكن حذف جدول دفع مدفوع'
            ], 422);
        }

        try {
            $schedule->delete();

            return response()->json([
                'success' => true,
                'message' => 'تم حذف جدول الدفع بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف جدول الدفع',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * جداول الدفع لعقد معين
     */
    public function byContract($contractId): JsonResponse
    {
        $contract = Contract::find($contractId);

        if (!$contract) {
            return response()->json([
                'success' => false,
                'message' => 'العقد غير موجود'
            ], 404);
        }

        $schedules = PaymentSchedule::where('contract_id', $contractId)
                                   ->orderBy('installment_number')
                                   ->get();

        return response()->json([
            'success' => true,
            'data' => $schedules
        ]);
    }

    /**
     * تأكيد دفع قسط
     */
    public function markPaid(Request $request, $id): JsonResponse
    {
        $schedule = PaymentSchedule::find($id);

        if (!$schedule) {
            return response()->json([
                'success' => false,
                'message' => 'جدول الدفع غير موجود'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'paid_amount' => 'nullable|numeric|min:0.01|max:' . $schedule->amount,
            'payment_date' => 'nullable|date',
        ], [
            'paid_amount.max' => 'المبلغ المدفوع لا يمكن أن يتجاوز المبلغ المستحق',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $paidAmount = $request->paid_amount ?? $schedule->amount;
            $paymentDate = $request->payment_date ?? now();

            $schedule->markAsPaid($paidAmount, $paymentDate);

            return response()->json([
                'success' => true,
                'message' => 'تم تأكيد دفع القسط بنجاح',
                'data' => $schedule
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تأكيد الدفع',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * إنشاء جداول دفع تلقائية للعقد
     */
    public function createForContract(Request $request, $contractId): JsonResponse
    {
        $contract = Contract::find($contractId);

        if (!$contract) {
            return response()->json([
                'success' => false,
                'message' => 'العقد غير موجود'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'installment_count' => 'required|integer|min:1|max:60',
            'start_date' => 'required|date',
            'frequency' => 'required|in:monthly,quarterly,semi_annually,annually',
            'first_payment_amount' => 'nullable|numeric|min:0.01',
        ], [
            'installment_count.required' => 'عدد الأقساط مطلوب',
            'installment_count.min' => 'عدد الأقساط يجب أن يكون أكبر من صفر',
            'installment_count.max' => 'عدد الأقساط لا يمكن أن يتجاوز 60',
            'start_date.required' => 'تاريخ أول دفعة مطلوب',
            'frequency.required' => 'تكرار الدفع مطلوب',
            'frequency.in' => 'تكرار الدفع غير صحيح',
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

            // حذف جداول الدفع الموجودة للعقد
            PaymentSchedule::where('contract_id', $contractId)->delete();

            $totalAmount = $contract->total_after_discount;
            $installmentCount = $request->installment_count;
            $firstPaymentAmount = $request->first_payment_amount;
            $remainingAmount = $totalAmount;
            $startDate = $request->start_date;

            // حساب مبلغ كل قسط
            if ($firstPaymentAmount) {
                $remainingAmount -= $firstPaymentAmount;
                $regularAmount = $remainingAmount / ($installmentCount - 1);
            } else {
                $regularAmount = $totalAmount / $installmentCount;
            }

            // حساب فترات الدفع
            $frequencyMonths = match($request->frequency) {
                'monthly' => 1,
                'quarterly' => 3,
                'semi_annually' => 6,
                'annually' => 12,
                default => 1
            };

            for ($i = 1; $i <= $installmentCount; $i++) {
                $amount = ($i === 1 && $firstPaymentAmount) ? $firstPaymentAmount : $regularAmount;
                $dueDate = $i === 1 ? $startDate : 
                          date('Y-m-d', strtotime($startDate . " +" . (($i - 1) * $frequencyMonths) . " months"));

                PaymentSchedule::create([
                    'contract_id' => $contractId,
                    'installment_number' => $i,
                    'amount' => round($amount, 2),
                    'due_date' => $dueDate,
                    'paid_amount' => 0,
                    'status' => 'pending',
                ]);
            }

            DB::commit();

            $schedules = PaymentSchedule::where('contract_id', $contractId)
                                       ->orderBy('installment_number')
                                       ->get();

            return response()->json([
                'success' => true,
                'message' => 'تم إنشاء جداول الدفع بنجاح',
                'data' => $schedules
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إنشاء جداول الدفع',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * تحديث حالة الأقساط المتأخرة
     */
    public function updateOverdueStatus(): JsonResponse
    {
        try {
            $overdueSchedules = PaymentSchedule::where('status', 'pending')
                                             ->where('due_date', '<', now())
                                             ->get();

            $updatedCount = 0;
            foreach ($overdueSchedules as $schedule) {
                $schedule->markAsOverdue();
                $updatedCount++;
            }

            return response()->json([
                'success' => true,
                'message' => "تم تحديث {$updatedCount} قسط متأخر",
                'data' => [
                    'updated_count' => $updatedCount
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث حالة الأقساط',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * إحصائيات جداول الدفع
     */
    public function stats(): JsonResponse
    {
        $stats = [
            'total_schedules' => PaymentSchedule::count(),
            'pending_schedules' => PaymentSchedule::pending()->count(),
            'paid_schedules' => PaymentSchedule::paid()->count(),
            'overdue_schedules' => PaymentSchedule::overdue()->count(),
            'total_amount' => PaymentSchedule::sum('amount'),
            'paid_amount' => PaymentSchedule::sum('paid_amount'),
            'remaining_amount' => PaymentSchedule::sum('amount') - PaymentSchedule::sum('paid_amount'),
            'due_soon' => PaymentSchedule::dueSoon()->count(),
            'overdue_amount' => PaymentSchedule::overdue()->sum('amount'),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
