<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
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
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');

// User Dashboard - Public access (no login required)
Route::get('/user/dashboard', function () {
    return Inertia::render('User/User_Dashboard');
})->name('user.dashboard');

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