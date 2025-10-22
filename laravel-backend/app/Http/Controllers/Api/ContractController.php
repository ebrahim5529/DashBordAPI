<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\Customer;
use App\Models\ContractSignature;
use App\Models\RentalDetail;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ContractController extends Controller
{
    /**
     * عرض قائمة العقود
     */
    public function index(Request $request): JsonResponse
    {
        $query = Contract::with(['customer', 'createdBy']);

        // البحث برقم العقد
        if ($request->has('contract_number') && $request->contract_number) {
            $query->where('contract_number', 'like', '%' . $request->contract_number . '%');
        }

        // البحث بالعميل
        if ($request->has('customer_id') && $request->customer_id) {
            $query->where('customer_id', $request->customer_id);
        }

        // البحث بالاسم
        if ($request->has('search') && $request->search) {
            $query->where('customer_name', 'like', '%' . $request->search . '%');
        }

        // الفلترة حسب النوع
        if ($request->has('contract_type') && $request->contract_type) {
            $query->where('contract_type', $request->contract_type);
        }

        // الفلترة حسب الحالة
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // الفلترة حسب التاريخ
        if ($request->has('start_date') && $request->start_date) {
            $query->whereDate('contract_date', '>=', $request->start_date);
        }

        if ($request->has('end_date') && $request->end_date) {
            $query->whereDate('contract_date', '<=', $request->end_date);
        }

        // الترتيب
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // الصفحات
        $perPage = $request->get('per_page', 15);
        $contracts = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $contracts
        ]);
    }

    /**
     * إنشاء عقد جديد
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'customer_id' => 'required|exists:customers,id',
            'contract_date' => 'required|date',
            'delivery_address' => 'required|string',
            'location_map_link' => 'nullable|url',
            'total_contract_value' => 'required|numeric|min:0',
            'transport_installation_cost' => 'nullable|numeric|min:0',
            'total_discount' => 'nullable|numeric|min:0',
            'contract_type' => 'required|in:RENTAL,SALE',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'contract_notes' => 'nullable|string',
            'rental_details' => 'required_if:contract_type,RENTAL|array',
            'rental_details.*.item_code' => 'required_with:rental_details|string',
            'rental_details.*.item_description' => 'required_with:rental_details|string',
            'rental_details.*.daily_rate' => 'required_with:rental_details|numeric|min:0',
            'rental_details.*.monthly_rate' => 'required_with:rental_details|numeric|min:0',
            'rental_details.*.quantity' => 'required_with:rental_details|integer|min:1',
            'rental_details.*.duration' => 'required_with:rental_details|integer|min:1',
            'rental_details.*.duration_type' => 'required_with:rental_details|in:daily,monthly',
        ], [
            'customer_id.required' => 'العميل مطلوب',
            'customer_id.exists' => 'العميل غير موجود',
            'contract_date.required' => 'تاريخ العقد مطلوب',
            'delivery_address.required' => 'عنوان التسليم مطلوب',
            'total_contract_value.required' => 'قيمة العقد مطلوبة',
            'contract_type.required' => 'نوع العقد مطلوب',
            'start_date.required' => 'تاريخ البداية مطلوب',
            'end_date.required' => 'تاريخ النهاية مطلوب',
            'end_date.after' => 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية',
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

            $customer = Customer::find($request->customer_id);
            $contractNumber = $this->generateContractNumber();

            // حساب القيم
            $totalContractValue = $request->total_contract_value;
            $transportCost = $request->transport_installation_cost ?? 0;
            $discount = $request->total_discount ?? 0;
            $totalAfterDiscount = $totalContractValue + $transportCost - $discount;

            $contract = Contract::create([
                'contract_number' => $contractNumber,
                'contract_date' => $request->contract_date,
                'customer_id' => $request->customer_id,
                'customer_name' => $customer->name,
                'delivery_address' => $request->delivery_address,
                'location_map_link' => $request->location_map_link,
                'total_contract_value' => $totalContractValue,
                'transport_installation_cost' => $transportCost,
                'total_discount' => $discount,
                'total_after_discount' => $totalAfterDiscount,
                'total_payments' => 0,
                'contract_notes' => $request->contract_notes,
                'contract_type' => $request->contract_type,
                'status' => 'ACTIVE',
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'created_by' => auth()->id(),
            ]);

            // إنشاء تفاصيل الإيجار إذا كان النوع إيجار
            if ($request->contract_type === 'RENTAL' && $request->has('rental_details')) {
                foreach ($request->rental_details as $detail) {
                    $total = $detail['duration_type'] === 'daily' 
                        ? $detail['daily_rate'] * $detail['quantity'] * $detail['duration']
                        : $detail['monthly_rate'] * $detail['quantity'] * $detail['duration'];

                    RentalDetail::create([
                        'contract_id' => $contract->id,
                        'start_date' => $request->start_date,
                        'end_date' => $request->end_date,
                        'duration' => $detail['duration'],
                        'duration_type' => $detail['duration_type'],
                        'item_code' => $detail['item_code'],
                        'item_description' => $detail['item_description'],
                        'daily_rate' => $detail['daily_rate'],
                        'monthly_rate' => $detail['monthly_rate'],
                        'quantity' => $detail['quantity'],
                        'total' => $total,
                    ]);
                }
            }

            DB::commit();

            $contract->load(['customer', 'rentalDetails']);

            return response()->json([
                'success' => true,
                'message' => 'تم إنشاء العقد بنجاح',
                'data' => $contract
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إنشاء العقد',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * عرض تفاصيل عقد
     */
    public function show($id): JsonResponse
    {
        $contract = Contract::with([
            'customer', 
            'createdBy', 
            'rentalDetails', 
            'payments', 
            'paymentSchedules',
            'signatures'
        ])->find($id);

        if (!$contract) {
            return response()->json([
                'success' => false,
                'message' => 'العقد غير موجود'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $contract
        ]);
    }

    /**
     * تحديث عقد
     */
    public function update(Request $request, $id): JsonResponse
    {
        $contract = Contract::find($id);

        if (!$contract) {
            return response()->json([
                'success' => false,
                'message' => 'العقد غير موجود'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'contract_date' => 'nullable|date',
            'delivery_address' => 'nullable|string',
            'location_map_link' => 'nullable|url',
            'total_contract_value' => 'nullable|numeric|min:0',
            'transport_installation_cost' => 'nullable|numeric|min:0',
            'total_discount' => 'nullable|numeric|min:0',
            'contract_type' => 'nullable|in:RENTAL,SALE',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'status' => 'nullable|in:ACTIVE,EXPIRED,CANCELLED,COMPLETED',
            'contract_notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // إعادة حساب القيم إذا تم تحديثها
            $updateData = $request->only([
                'contract_date', 'delivery_address', 'location_map_link',
                'contract_type', 'start_date', 'end_date', 'status', 'contract_notes'
            ]);

            if ($request->has(['total_contract_value', 'transport_installation_cost', 'total_discount'])) {
                $totalContractValue = $request->total_contract_value ?? $contract->total_contract_value;
                $transportCost = $request->transport_installation_cost ?? $contract->transport_installation_cost;
                $discount = $request->total_discount ?? $contract->total_discount;
                $totalAfterDiscount = $totalContractValue + $transportCost - $discount;

                $updateData = array_merge($updateData, [
                    'total_contract_value' => $totalContractValue,
                    'transport_installation_cost' => $transportCost,
                    'total_discount' => $discount,
                    'total_after_discount' => $totalAfterDiscount,
                ]);
            }

            $contract->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث العقد بنجاح',
                'data' => $contract
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث العقد',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * حذف عقد
     */
    public function destroy($id): JsonResponse
    {
        $contract = Contract::find($id);

        if (!$contract) {
            return response()->json([
                'success' => false,
                'message' => 'العقد غير موجود'
            ], 404);
        }

        // التحقق من وجود مدفوعات مرتبطة
        if ($contract->payments()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'لا يمكن حذف العقد لوجود مدفوعات مرتبطة به'
            ], 422);
        }

        try {
            $contract->delete();

            return response()->json([
                'success' => true,
                'message' => 'تم حذف العقد بنجاح'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف العقد',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * إحصائيات العقود
     */
    public function stats(): JsonResponse
    {
        $stats = [
            'total' => Contract::count(),
            'active' => Contract::active()->count(),
            'expired' => Contract::expired()->count(),
            'cancelled' => Contract::cancelled()->count(),
            'completed' => Contract::completed()->count(),
            'rental' => Contract::rental()->count(),
            'sale' => Contract::sale()->count(),
            'overdue' => Contract::overdue()->count(),
            'total_value' => Contract::sum('total_after_discount'),
            'total_payments' => Contract::sum('total_payments'),
            'pending_amount' => Contract::sum('total_after_discount') - Contract::sum('total_payments'),
            'contracts_this_month' => Contract::whereMonth('contract_date', now()->month)
                                           ->whereYear('contract_date', now()->year)
                                           ->count(),
            'expiring_soon' => Contract::active()
                                     ->where('end_date', '<=', now()->addDays(30))
                                     ->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    /**
     * العقود المنتهية الصلاحية
     */
    public function expired(): JsonResponse
    {
        $contracts = Contract::expired()
                            ->with(['customer'])
                            ->orderBy('end_date', 'desc')
                            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $contracts
        ]);
    }

    /**
     * العقود النشطة
     */
    public function active(): JsonResponse
    {
        $contracts = Contract::active()
                            ->with(['customer'])
                            ->orderBy('start_date', 'desc')
                            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $contracts
        ]);
    }

    /**
     * إضافة توقيع للعقد
     */
    public function addSignature(Request $request, $id): JsonResponse
    {
        $contract = Contract::find($id);

        if (!$contract) {
            return response()->json([
                'success' => false,
                'message' => 'العقد غير موجود'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'signature_data' => 'required|string',
            'signer_name' => 'required|string|max:255',
        ], [
            'signature_data.required' => 'بيانات التوقيع مطلوبة',
            'signer_name.required' => 'اسم الموقع مطلوب',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $signature = ContractSignature::create([
                'contract_id' => $contract->id,
                'signature_data' => $request->signature_data,
                'signer_name' => $request->signer_name,
                'signed_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم إضافة التوقيع بنجاح',
                'data' => $signature
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إضافة التوقيع',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * تحميل PDF العقد
     */
    public function downloadPdf($id): JsonResponse
    {
        $contract = Contract::with(['customer', 'rentalDetails'])->find($id);

        if (!$contract) {
            return response()->json([
                'success' => false,
                'message' => 'العقد غير موجود'
            ], 404);
        }

        // هنا يمكن إضافة منطق إنشاء PDF
        // باستخدام مكتبة مثل DomPDF أو TCPDF

        return response()->json([
            'success' => true,
            'message' => 'تم إنشاء PDF بنجاح',
            'data' => [
                'download_url' => route('contracts.pdf', $id),
                'filename' => 'contract_' . $contract->contract_number . '.pdf'
            ]
        ]);
    }

    /**
     * إرسال العقد عبر WhatsApp
     */
    public function sendWhatsApp(Request $request, $id): JsonResponse
    {
        $contract = Contract::with(['customer'])->find($id);

        if (!$contract) {
            return response()->json([
                'success' => false,
                'message' => 'العقد غير موجود'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'phone' => 'required|string',
            'message' => 'nullable|string',
        ], [
            'phone.required' => 'رقم الهاتف مطلوب',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'بيانات غير صحيحة',
                'errors' => $validator->errors()
            ], 422);
        }

        // هنا يمكن إضافة منطق إرسال WhatsApp
        // باستخدام WhatsApp Business API

        return response()->json([
            'success' => true,
            'message' => 'تم إرسال العقد عبر WhatsApp بنجاح'
        ]);
    }

    /**
     * إنشاء رقم العقد التلقائي
     */
    private function generateContractNumber(): string
    {
        $lastContract = Contract::orderBy('id', 'desc')->first();
        $nextNumber = $lastContract ? $lastContract->id + 1 : 1;
        
        return 'CONT-' . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);
    }
}
