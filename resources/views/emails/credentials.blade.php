@component('mail::message')
# Email Verified Successfully

## Your Account Credentials

**User ID:** `{{ $userId }}`

You can now log in to your account.

@component('mail::button', ['url' => route('login')])
Log In Now
@endcomponent

If you did not verify this email, please ignore this message.

Thanks,
{{ config('app.name') }}
@endcomponent
