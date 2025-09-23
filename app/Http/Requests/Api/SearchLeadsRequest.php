<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class SearchLeadsRequest extends FormRequest
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
            'phone' => [
                'required',
                'string',
                'min:3',
                'max:20',
                'regex:/^[0-9+\-\s()]+$/', // Allow numbers, +, -, spaces, parentheses
            ],
            'limit' => [
                'sometimes',
                'integer',
                'min:1',
                'max:100',
            ],
            'offset' => [
                'sometimes',
                'integer',
                'min:0',
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
            'phone.required' => 'Phone number parameter is required',
            'phone.min' => 'Phone number must be at least 3 characters',
            'phone.max' => 'Phone number must not exceed 20 characters',
            'phone.regex' => 'Phone number format is invalid',
            'limit.integer' => 'Limit must be a valid integer',
            'limit.min' => 'Limit must be at least 1',
            'limit.max' => 'Limit must not exceed 100',
            'offset.integer' => 'Offset must be a valid integer',
            'offset.min' => 'Offset must be 0 or greater',
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
            ], 422)
        );
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Clean up phone number input
        if ($this->has('phone')) {
            $phone = $this->input('phone');
            // Remove common prefixes for search compatibility
            $phone = ltrim($phone, '+');
            $phone = ltrim($phone, '62'); // Remove Indonesia country code prefix
            $phone = ltrim($phone, '0'); // Remove leading zero
            
            $this->merge([
                'phone' => $phone,
            ]);
        }

        // Set default values
        $this->merge([
            'limit' => $this->input('limit', 20),
            'offset' => $this->input('offset', 0),
        ]);
    }
}