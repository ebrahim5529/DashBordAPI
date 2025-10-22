<?php

namespace App\Http\Requests\Supplier;

use Illuminate\Foundation\Http\FormRequest;

class StoreSupplierPurchaseRequest extends FormRequest
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
        return [
            'supplier_id' => 'required|exists:suppliers,id',
            'purchase_number' => 'required|string|max:100|unique:supplier_purchases,purchase_number',
            'purchase_date' => 'required|date',
            'delivery_date' => 'nullable|date|after_or_equal:purchase_date',
            'total_amount' => 'required|numeric|min:0',
            'invoice_id' => 'nullable|exists:supplier_invoices,id',
            'notes' => 'nullable|string',
            'status' => 'nullable|in:PENDING,CONFIRMED,DELIVERED,CANCELLED',
            'items' => 'nullable|array',
            'items.*.name' => 'required|string|max:255',
            'items.*.description' => 'nullable|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.category' => 'required|string|max:100',
            'items.*.unit' => 'required|string|max:50',
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
            'delivery_date.after_or_equal' => 'تاريخ التسليم يجب أن يكون بعد أو مساوي لتاريخ الشراء',
            'total_amount.required' => 'المبلغ الإجمالي مطلوب',
            'total_amount.numeric' => 'المبلغ الإجمالي يجب أن يكون رقم',
            'total_amount.min' => 'المبلغ الإجمالي يجب أن يكون أكبر من أو يساوي صفر',
            'invoice_id.exists' => 'الفاتورة غير موجودة',
            'status.in' => 'حالة المشترى غير صالحة',
            'items.array' => 'عناصر المشترى يجب أن تكون مصفوفة',
            'items.*.name.required' => 'اسم العنصر مطلوب',
            'items.*.quantity.required' => 'الكمية مطلوبة',
            'items.*.quantity.integer' => 'الكمية يجب أن تكون رقم صحيح',
            'items.*.quantity.min' => 'الكمية يجب أن تكون على الأقل 1',
            'items.*.unit_price.required' => 'سعر الوحدة مطلوب',
            'items.*.unit_price.numeric' => 'سعر الوحدة يجب أن يكون رقم',
            'items.*.unit_price.min' => 'سعر الوحدة يجب أن يكون أكبر من أو يساوي صفر',
            'items.*.category.required' => 'الفئة مطلوبة',
            'items.*.unit.required' => 'الوحدة مطلوبة',
        ];
    }
}

