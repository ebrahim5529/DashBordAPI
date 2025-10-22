<?php

namespace App\Http\Requests\Supplier;

use Illuminate\Foundation\Http\FormRequest;

class StoreSupplierInvoiceRequest extends FormRequest
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
            'invoice_number' => 'required|string|max:100|unique:supplier_invoices,invoice_number',
            'amount' => 'required|numeric|min:0',
            'due_date' => 'required|date',
            'payment_date' => 'nullable|date',
            'payment_method' => 'nullable|in:CASH,BANK_TRANSFER,CHECK,CREDIT_CARD',
            'description' => 'nullable|string',
            'status' => 'nullable|in:PENDING,PAID,PARTIAL,OVERDUE,CANCELLED',
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
            'invoice_number.required' => 'رقم الفاتورة مطلوب',
            'invoice_number.unique' => 'رقم الفاتورة مستخدم من قبل',
            'amount.required' => 'المبلغ مطلوب',
            'amount.numeric' => 'المبلغ يجب أن يكون رقم',
            'amount.min' => 'المبلغ يجب أن يكون أكبر من أو يساوي صفر',
            'due_date.required' => 'تاريخ الاستحقاق مطلوب',
            'due_date.date' => 'تاريخ الاستحقاق غير صالح',
            'payment_date.date' => 'تاريخ الدفع غير صالح',
            'payment_method.in' => 'طريقة الدفع غير صالحة',
            'status.in' => 'حالة الفاتورة غير صالحة',
        ];
    }
}

