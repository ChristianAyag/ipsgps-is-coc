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
Route::middleware(['auth','verified'])->group(function () {
    Route::get('/user/dashboard', function () {
        return Inertia::render('User/User_Dashboard');
    })->name('user.dashboard');
    // Other authenticated routes here
});
*/

// Admin Dashboard - Public access (no login required)
Route::get('/admin/dashboard', function () {
    return Inertia::render('Admin/Admin_Dashboard');
})->name('admin.dashboard');

// Add your other public pages here
Route::get('/user/coc-application', function () {
    return Inertia::render('User/COCApplication');
})->name('user.coc-application');

Route::get('/user/application-status', function () {
    return Inertia::render('User/ApplicationStatus');
})->name('user.application-status');

Route::get('/user/issued-coc', function () {
    return Inertia::render('User/IssuedCOC');
})->name('user.issued-coc');

Route::get('/user/ip-groups', function () {
    return Inertia::render('User/IPGroups');
})->name('user.ip-groups');

Route::get('/user/faqs', function () {
    return Inertia::render('User/FAQs');
})->name('user.faqs');

Route::get('/user/downloadable-forms', function () {
    return Inertia::render('User/DownloadableForms');
})->name('user.downloadable-forms');

Route::get('/user/ncip-admin-order', function () {
    return Inertia::render('User/NCIPAdminOrder');
})->name('user.ncip-admin-order');

// Profile routes - These still require authentication
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';