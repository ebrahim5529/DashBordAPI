<?php

namespace App\Http\Requests\Supplier;

use Illuminate\Foundation\Http\FormRequest;

class StoreSupplierRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:suppliers,email',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'nationality' => 'required|string|max:100',
            'supplier_type' => 'required|in:INDIVIDUAL,COMPANY',
            'commercial_record' => 'nullable|string|max:100|required_if:supplier_type,COMPANY',
            'tax_number' => 'nullable|string|max:100|required_if:supplier_type,COMPANY',
            'registration_date' => 'required|date',
            'contact_person' => 'required|string|max:255',
            'contact_person_phone' => 'required|string|max:20',
            'contact_person_email' => 'required|email|max:255',
            'bank_name' => 'nullable|string|max:255',
            'bank_account' => 'nullable|string|max:100',
            'iban' => 'nullable|string|max:34',
            'swift_code' => 'nullable|string|max:11',
            'notes' => 'nullable|string',
            'rating' => 'nullable|integer|min:0|max:5',
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
            'name.required' => 'اسم المورد مطلوب',
            'name.max' => 'اسم المورد يجب ألا يتجاوز 255 حرف',
            'email.required' => 'البريد الإلكتروني مطلوب',
            'email.email' => 'البريد الإلكتروني غير صالح',
            'email.unique' => 'البريد الإلكتروني مستخدم من قبل',
            'phone.required' => 'رقم الهاتف مطلوب',
            'address.required' => 'العنوان مطلوب',
            'nationality.required' => 'الجنسية مطلوبة',
            'supplier_type.required' => 'نوع المورد مطلوب',
            'supplier_type.in' => 'نوع المورد يجب أن يكون فرد أو شركة',
            'commercial_record.required_if' => 'السجل التجاري مطلوب للشركات',
            'tax_number.required_if' => 'الرقم الضريبي مطلوب للشركات',
            'registration_date.required' => 'تاريخ التسجيل مطلوب',
            'registration_date.date' => 'تاريخ التسجيل غير صالح',
            'contact_person.required' => 'اسم الشخص المسؤول مطلوب',
            'contact_person_phone.required' => 'هاتف الشخص المسؤول مطلوب',
            'contact_person_email.required' => 'بريد الشخص المسؤول مطلوب',
            'contact_person_email.email' => 'بريد الشخص المسؤول غير صالح',
            'rating.integer' => 'التقييم يجب أن يكون رقم',
            'rating.min' => 'التقييم يجب أن يكون بين 0 و 5',
            'rating.max' => 'التقييم يجب أن يكون بين 0 و 5',
        ];
    }
}

