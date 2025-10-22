<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LatePayment;
use App\Models\Customer;
use App\Models\PaymentSchedule;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class LatePaymentController extends Controller
{
    /**
     * عرض قائمة المدفوعات المتأخرة
     */
    public function index(Request $request): JsonResponse
    {
        $query = LatePayment::with(['customer']);

        // البحث بالعميل
        if ($request->has('customer_id') && $request->customer_id) {
            $query->where('customer_id', $request->customer_id);
        }

        // البحث برقم العقد
        if ($request->has('contract_number') && $request->contract_number) {
            $query->where('contract_number', 'like', '%' . $request->contract_number . '%');
        }

        // الفلترة حسب الحالة
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // الفلترة حسب الأولوية
        if ($request->has('priority') && $request->priority) {
            $query->where('priority', $request->priority);
        }

        // الفلترة حسب التاريخ
        if ($request->has('start_date') && $request->start_date) {
            $query->whereDate('due_date', '>=', $request->start_date);
        }

        if ($request->has('end_date') && $request->end_date) {
            $query->whereDate('due_date', '<=', $request->end_date);
        }

        // الترتيب
        $sortBy = $request->get('sort_by', 'due_date');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        // الصفحات
        $perPage = $request->get('per_page', 15);
        $latePayments = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $latePayments
        ]);
    }

    /**
     * إنشاء مدفوعات متأخرة جديدة
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'customer_id' => 'required|exists:customers,id',
            'contract_number' => 'required|string',
            'amount' => 'required|numeric|min:0.01',
            'due_date' => 'required|date',
            'contact_person' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'priority' => 'nullable|in:low,medium,high,urgent',
            'notes' => 'nullable|string',
        ], [
            'customer_id.required' => 'العميل مطلوب',
            'customer_id.exists' => 'العميل غير موجود',
            'contract_number.required' => 'رقم العقد مطلوب',
            'amount.required' => 'المبلغ مطلوب',
            'amount.min' => 'المبلغ يجب أن يكون أكبر من صفر',
            'due_date.required' => 'تاريخ الاستحقاق مطلوب',
            'contact_person.required' => 'اسم الشخص المسؤول عن التواصل مطلوب',
            'phone.required' => 'رقم الهاتف مطلوب',
            'email.required' => 'البريد الإلكتروني مطلوب',
            'email.email' => 'البريد الإلكتروني غير صحيح',
            'priority.in' => 'الأولوية غير صحيحة',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // حساب عدد الأيام المتأخرة
            $daysLate = now()->diffInDays($request->due_date);

            $latePayment = LatePayment::create([
                'customer_id' => $request->customer_id,
                'contract_number' => $request->contract_number,
                'amount' => $request->amount,
                'due_date' => $request->due_date,
                'days_late' => $daysLate,
                'contact_person' => $request->contact_person,
                'phone' => $request->phone,
                'email' => $request->email,
                'status' => 'pending',
                'priority' => $request->priority ?? 'medium',
                'notes' => $request->notes,
            ]);

            $latePayment->load(['customer']);

            return response()->json([
                'success' => true,
                'message' => 'تم إنشاء المدفوعات المتأخرة بنجاح',
                'data' => $latePayment
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إنشاء المدفوعات المتأخرة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * عرض تفاصيل مدفوعات متأخرة
     */
    public function show($id): JsonResponse
    {
        $latePayment = LatePayment::with(['customer'])->find($id);

        if (!$latePayment) {
            return response()->json([
                'success' => false,
                'message' => 'المدفوعات المتأخرة غير موجودة'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $latePayment
        ]);
    }

    /**
     * تحديث مدفوعات متأخرة
     */
    public function update(Request $request, $id): JsonResponse
    {
        $latePayment = LatePayment::find($id);

        if (!$latePayment) {
            return response()->json([
                'success' => false,
                'message' => 'المدفوعات المتأخرة غير موجودة'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'contract_number' => 'nullable|string',
            'amount' => 'nullable|numeric|min:0.01',
            'due_date' => 'nullable|date',
            'contact_person' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'status' => 'nullable|in:pending,contacted,escalated,resolved,cancelled',
            'priority' => 'nullable|in:low,medium,high,urgent',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $latePayment->update($request->only([
                'contract_number', 'amount', 'due_date', 'contact_person',
                'phone', 'email', 'status', 'priority', 'notes'
            ]));

            // تحديث عدد الأيام المتأخرة إذا تم تغيير تاريخ الاستحقاق
            if ($request->has('due_date')) {
                $latePayment->updateDaysLate();
            }

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث المدفوعات المتأخرة بنجاح',
                'data' => $latePayment
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث المدفوعات المتأخرة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * حذف مدفوعات متأخرة
     */
    public function destroy($id): JsonResponse
    {
        $latePayment = LatePayment::find($id);

        if (!$latePayment) {
            return response()->json([
                'success' => false,
                'message' => 'المدفوعات المتأخرة غير موجودة'
            ], 404);
        }

        try {
            $latePayment->delete();

            return response()->json([
                'success' => true,
                'message' => 'تم حذف المدفوعات المتأخرة بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف المدفوعات المتأخرة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * تأكيد التواصل مع العميل
     */
    public function markAsContacted($id): JsonResponse
    {
        $latePayment = LatePayment::find($id);

        if (!$latePayment) {
            return response()->json([
                'success' => false,
                'message' => 'المدفوعات المتأخرة غير موجودة'
            ], 404);
        }

        try {
            $latePayment->markAsContacted();

            return response()->json([
                'success' => true,
                'message' => 'تم تأكيد التواصل مع العميل',
                'data' => $latePayment
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تأكيد التواصل',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * تصعيد المدفوعات المتأخرة
     */
    public function escalate($id): JsonResponse
    {
        $latePayment = LatePayment::find($id);

        if (!$latePayment) {
            return response()->json([
                'success' => false,
                'message' => 'المدفوعات المتأخرة غير موجودة'
            ], 404);
        }

        try {
            $latePayment->escalate();

            return response()->json([
                'success' => true,
                'message' => 'تم تصعيد المدفوعات المتأخرة',
                'data' => $latePayment
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تصعيد المدفوعات المتأخرة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * حل المدفوعات المتأخرة
     */
    public function resolve($id): JsonResponse
    {
        $latePayment = LatePayment::find($id);

        if (!$latePayment) {
            return response()->json([
                'success' => false,
                'message' => 'المدفوعات المتأخرة غير موجودة'
            ], 404);
        }

        try {
            $latePayment->resolve();

            return response()->json([
                'success' => true,
                'message' => 'تم حل المدفوعات المتأخرة',
                'data' => $latePayment
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حل المدفوعات المتأخرة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * إلغاء المدفوعات المتأخرة
     */
    public function cancel($id): JsonResponse
    {
        $latePayment = LatePayment::find($id);

        if (!$latePayment) {
            return response()->json([
                'success' => false,
                'message' => 'المدفوعات المتأخرة غير موجودة'
            ], 404);
        }

        try {
            $latePayment->cancel();

            return response()->json([
                'success' => true,
                'message' => 'تم إلغاء المدفوعات المتأخرة',
                'data' => $latePayment
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إلغاء المدفوعات المتأخرة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * إنشاء مدفوعات متأخرة تلقائياً من جداول الدفع
     */
    public function createFromPaymentSchedules(): JsonResponse
    {
        try {
            $overdueSchedules = PaymentSchedule::where('status', 'overdue')
                                             ->orWhere(function($query) {
                                                 $query->where('status', 'pending')
                                                       ->where('due_date', '<', now());
                                             })
                                             ->with(['contract.customer'])
                                             ->get();

            $createdCount = 0;

            foreach ($overdueSchedules as $schedule) {
                // التحقق من عدم وجود مدفوعات متأخرة لهذا العقد
                $existingLatePayment = LatePayment::where('customer_id', $schedule->contract->customer_id)
                                                 ->where('contract_number', $schedule->contract->contract_number)
                                                 ->where('status', '!=', 'resolved')
                                                 ->where('status', '!=', 'cancelled')
                                                 ->first();

                if (!$existingLatePayment) {
                    $daysLate = now()->diffInDays($schedule->due_date);
                    $priority = $daysLate > 90 ? 'urgent' : ($daysLate > 30 ? 'high' : 'medium');

                    LatePayment::create([
                        'customer_id' => $schedule->contract->customer_id,
                        'contract_number' => $schedule->contract->contract_number,
                        'amount' => $schedule->remaining_amount,
                        'due_date' => $schedule->due_date,
                        'days_late' => $daysLate,
                        'contact_person' => $schedule->contract->customer->name,
                        'phone' => $schedule->contract->customer->phone,
                        'email' => $schedule->contract->customer->email,
                        'status' => 'pending',
                        'priority' => $priority,
                        'notes' => 'تم إنشاؤها تلقائياً من جدول الدفع',
                    ]);

                    $createdCount++;
                }
            }

            return response()->json([
                'success' => true,
                'message' => "تم إنشاء {$createdCount} مدفوعات متأخرة جديدة",
                'data' => [
                    'created_count' => $createdCount
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إنشاء المدفوعات المتأخرة',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * إحصائيات المدفوعات المتأخرة
     */
    public function stats(): JsonResponse
    {
        $stats = [
            'total' => LatePayment::count(),
            'pending' => LatePayment::pending()->count(),
            'contacted' => LatePayment::contacted()->count(),
            'escalated' => LatePayment::escalated()->count(),
            'resolved' => LatePayment::resolved()->count(),
            'cancelled' => LatePayment::cancelled()->count(),
            'high_priority' => LatePayment::highPriority()->count(),
            'urgent_priority' => LatePayment::urgentPriority()->count(),
            'total_amount' => LatePayment::sum('amount'),
            'overdue_30_days' => LatePayment::overdue(30)->count(),
            'overdue_90_days' => LatePayment::overdue(90)->count(),
            'resolved_this_month' => LatePayment::resolved()
                                               ->whereMonth('updated_at', now()->month)
                                               ->whereYear('updated_at', now()->year)
                                               ->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * تحديث عدد الأيام المتأخرة لجميع المدفوعات المتأخرة
     */
    public function updateDaysLate(): JsonResponse
    {
        try {
            $latePayments = LatePayment::where('status', '!=', 'resolved')
                                     ->where('status', '!=', 'cancelled')
                                     ->get();

            $updatedCount = 0;
            foreach ($latePayments as $latePayment) {
                $latePayment->updateDaysLate();
                $updatedCount++;
            }

            return response()->json([
                'success' => true,
                'message' => "تم تحديث {$updatedCount} مدفوعات متأخرة",
                'data' => [
                    'updated_count' => $updatedCount
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث عدد الأيام المتأخرة',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
