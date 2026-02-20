<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class LoginRequest extends FormRequest
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
            'userID' => ['required', 'string'],
            'userPassword' => ['required', 'string'],
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate(): void
    {
        // Log the start of authentication
        Log::info('=== LOGIN ATTEMPT START ===', [
            'timestamp' => now()->toDateTimeString(),
            'ip' => $this->ip(),
            'user_agent' => $this->userAgent()
        ]);

        $this->ensureIsNotRateLimited();

        Log::info('Login form data received:', [
            'userID' => $this->userID,
            'password_length' => strlen($this->userPassword),
            'remember' => $this->boolean('remember')
        ]);

        // Find the user
        $user = User::where('userID', $this->userID)->first();
        
        if (!$user) {
            Log::warning('User not found with userID:', ['userID' => $this->userID]);
            RateLimiter::hit($this->throttleKey());
            throw ValidationException::withMessages([
                'userID' => trans('auth.failed'),
            ]);
        }

        Log::info('User found in database:', [
            'userID' => $user->userID,
            'name' => $user->firstName . ' ' . $user->surName,
            'is_active' => $user->is_active,
            'email' => $user->userEmail ?? 'no email'
        ]);

        // Check if user is active
        if (!$user->is_active) {
            Log::warning('Inactive user attempted login:', ['userID' => $this->userID]);
            RateLimiter::hit($this->throttleKey());
            throw ValidationException::withMessages([
                'userID' => 'Your account is deactivated. Please contact administrator.',
            ]);
        }

        // MANUALLY VERIFY THE PASSWORD USING HASH::CHECK
        Log::info('Attempting manual password verification...', [
            'userID' => $this->userID,
            'input_password_length' => strlen($this->userPassword),
            'stored_hash_length' => strlen($user->userPassword),
            'stored_hash_prefix' => substr($user->userPassword, 0, 10) . '...'
        ]);

        if (!Hash::check($this->userPassword, $user->userPassword)) {
            Log::warning('Manual password verification FAILED', [
                'userID' => $this->userID,
                'input_password' => $this->userPassword,
                'stored_hash' => $user->userPassword,
            ]);
            
            RateLimiter::hit($this->throttleKey());
            throw ValidationException::withMessages([
                'userID' => trans('auth.failed'),
            ]);
        }

        Log::info('Manual password verification SUCCESSFUL', [
            'userID' => $this->userID
        ]);

        // If manual verification works, log the user in manually
        Auth::login($user, $this->boolean('remember'));

        // Update last login timestamp (optional)
        $user->update(['last_login' => now()]);

        Log::info('=== LOGIN SUCCESSFUL (Manual) ===', [
            'userID' => $this->userID,
            'timestamp' => now()->toDateTimeString(),
            'remember' => $this->boolean('remember')
        ]);

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        $attempts = RateLimiter::attempts($this->throttleKey());
        $availableIn = RateLimiter::availableIn($this->throttleKey());
        
        Log::info('Rate limit check:', [
            'throttle_key' => $this->throttleKey(),
            'attempts' => $attempts,
            'max_attempts' => 5,
            'available_in' => $availableIn . ' seconds'
        ]);

        if (!RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            Log::info('Rate limit check passed');
            return;
        }

        Log::warning('Rate limit exceeded', [
            'throttle_key' => $this->throttleKey(),
            'attempts' => $attempts
        ]);

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'userID' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        $key = Str::transliterate(Str::lower($this->string('userID')).'|'.$this->ip());
        
        Log::debug('Generated throttle key:', ['key' => $key]);
        
        return $key;
    }
}