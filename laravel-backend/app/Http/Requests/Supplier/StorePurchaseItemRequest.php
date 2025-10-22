<?php

namespace App\Http\Requests\Supplier;

use Illuminate\Foundation\Http\FormRequest;

class StorePurchaseItemRequest extends FormRequest
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
            'purchase_id' => 'required|exists:supplier_purchases,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'quantity' => 'required|integer|min:1',
            'unit_price' => 'required|numeric|min:0',
            'category' => 'required|string|max:100',
            'unit' => 'required|string|max:50',
            'received_date' => 'nullable|date',
            'status' => 'nullable|in:مستلم,في الطريق,معلق',
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
            'purchase_id.required' => 'المشترى مطلوب',
            'purchase_id.exists' => 'المشترى غير موجود',
            'name.required' => 'اسم العنصر مطلوب',
            'name.max' => 'اسم العنصر يجب ألا يتجاوز 255 حرف',
            'quantity.required' => 'الكمية مطلوبة',
            'quantity.integer' => 'الكمية يجب أن تكون رقم صحيح',
            'quantity.min' => 'الكمية يجب أن تكون على الأقل 1',
            'unit_price.required' => 'سعر الوحدة مطلوب',
            'unit_price.numeric' => 'سعر الوحدة يجب أن يكون رقم',
            'unit_price.min' => 'سعر الوحدة يجب أن يكون أكبر من أو يساوي صفر',
            'category.required' => 'الفئة مطلوبة',
            'unit.required' => 'الوحدة مطلوبة',
            'received_date.date' => 'تاريخ الاستلام غير صالح',
            'status.in' => 'حالة العنصر غير صالحة',
        ];
    }
}

