<?php

namespace App\Http\Requests\Supplier;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSupplierPurchaseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $purchaseId = $this->route('supplier_purchase');
        
        return [
            'supplier_id' => 'sometimes|required|exists:suppliers,id',
            'purchase_number' => 'sometimes|required|string|max:100|unique:supplier_purchases,purchase_number,' . $purchaseId,
            'purchase_date' => 'sometimes|required|date',
            'delivery_date' => 'nullable|date',
            'total_amount' => 'sometimes|required|numeric|min:0',
            'invoice_id' => 'nullable|exists:supplier_invoices,id',
            'notes' => 'nullable|string',
            'status' => 'sometimes|in:PENDING,CONFIRMED,DELIVERED,CANCELLED',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'supplier_id.required' => 'المورد مطلوب',
            'supplier_id.exists' => 'المورد غير موجود',
            'purchase_number.required' => 'رقم المشترى مطلوب',
            'purchase_number.unique' => 'رقم المشترى مستخدم من قبل',
            'purchase_date.required' => 'تاريخ الشراء مطلوب',
            'purchase_date.date' => 'تاريخ الشراء غير صالح',
            'delivery_date.date' => 'تاريخ التسليم غير صالح',
            'total_amount.required' => 'المبلغ الإجمالي مطلوب',
            'total_amount.numeric' => 'المبلغ الإجمالي يجب أن يكون رقم',
            'total_amount.min' => 'المبلغ الإجمالي يجب أن يكون أكبر من أو يساوي صفر',
            'invoice_id.exists' => 'الفاتورة غير موجودة',
            'status.in' => 'حالة المشترى غير صالحة',
        ];
    }
}

