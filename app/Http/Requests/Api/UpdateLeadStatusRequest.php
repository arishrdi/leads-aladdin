<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\Rule;

class UpdateLeadStatusRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'status' => [
                'required',
                'string',
                Rule::in([
                    'WARM',
                    'HOT', 
                    'CUSTOMER',
                    'COLD',
                    'EXIT',
                    'CROSS_SELLING'
                ]),
            ],
            'notes' => [
                'sometimes',
                'string',
                'max:1000',
            ],
        ];
    }

    /**
     * Get custom error messages for validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'status.required' => 'Status is required',
            'status.in' => 'Status must be one of: WARM, HOT, CUSTOMER, COLD, EXIT, CROSS_SELLING',
            'notes.string' => 'Notes must be a valid string',
            'notes.max' => 'Notes must not exceed 1000 characters',
        ];
    }

    /**
     * Handle a failed validation attempt.
     *
     * @param  \Illuminate\Contracts\Validation\Validator  $validator
     * @return void
     *
     * @throws \Illuminate\Http\Exceptions\HttpResponseException
     */
    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
                'valid_statuses' => [
                    'WARM' => 'Calon customer yang menghubungi untuk pertama kali',
                    'HOT' => 'Sudah minta desain (smarttechno) / survey lokasi (Aladdin Karpet)',
                    'CUSTOMER' => 'Memutuskan untuk membeli',
                    'COLD' => 'Customer tidak ada kejelasan setelah follow up 3 kali/ tidak ada nomer yg bisa dihubungi',
                    'EXIT' => 'Memutuskan untuk tidak membeli',
                    'CROSS_SELLING' => 'Testimoni dan penawaran produk lain',
                ]
            ], 422)
        );
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Normalize status to uppercase
        if ($this->has('status')) {
            $this->merge([
                'status' => strtoupper($this->input('status')),
            ]);
        }

        // Trim notes if provided
        if ($this->has('notes')) {
            $this->merge([
                'notes' => trim($this->input('notes')),
            ]);
        }
    }
}