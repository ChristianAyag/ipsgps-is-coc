<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

// Make login the landing page
Route::get('/', function () {
    return redirect()->route('login');
});


// Optional: If you want to keep a separate welcome page
Route::get('/welcome', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

// PUBLIC DASHBOARD - No authentication required
// Anyone can access by typing the URL
Route::middleware(['verified','auth'])->group(function () {
    Route::get('/user/dashboard', function () {
        return Inertia::render('User/User_Dashboard');
    })->name('user.dashboard');
    // Other authenticated routes here
});

Route::get('/send-test-email', function() {
    try {
        \Log::info('Starting test email');
        
        Mail::raw('This is a test email from Laravel', function ($message) {
            $message->to('test@example.com')
                    ->subject('Test Email ' . now());
        });
        
        \Log::info('Test email sent successfully');
        return 'Test email sent! Check Mailtrap and logs.';
    } catch (\Exception $e) {
        \Log::error('Test email failed: ' . $e->getMessage());
        return 'Error: ' . $e->getMessage();
    }
});

Route::get('/mailtrap-test', function() {
    try {
        Log::info('Starting Mailtrap test');
        
        // Test 1: Simple raw email
        Mail::raw('This is a raw test email', function($message) {
            $message->to('test@example.com')
                    ->subject('Raw Test ' . now());
        });
        Log::info('Raw email sent');
        
        // Test 2: Verification notification using a dummy user
        $user = App\Models\User::latest()->first();
        if ($user) {
            $user->sendEmailVerificationNotification();
            Log::info('Verification notification sent to: ' . $user->userEmail);
        }
        
        return 'Tests completed. Check logs and Mailtrap.';
    } catch (\Exception $e) {
        Log::error('Mailtrap test failed: ' . $e->getMessage());
        return 'Error: ' . $e->getMessage();
    }
});

// Admin Dashboard - Public access (no login required)
Route::get('/admin/dashboard', function () {
    return Inertia::render('Admin/Admin_Dashboard');
})->name('admin.dashboard');

// Profile routes - These still require authentication
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';