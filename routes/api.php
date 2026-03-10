<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\NewCOCController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [RegisteredUserController::class, 'store'])->name('api.register');

// NewCOC test routes
Route::post('/coc', [NewCOCController::class, 'store'])->name('coc.store');
Route::get('/coc/{id}', [NewCOCController::class, 'show'])->name('coc.show');
Route::get('/coc', [NewCOCController::class, 'index'])->name('coc.index');
Route::put('/coc/{id}', [NewCOCController::class, 'update'])->name('coc.update');
Route::delete('/coc/{id}', [NewCOCController::class, 'destroy'])->name('coc.destroy');
Route::get('/coc/user/{userID}', [NewCOCController::class, 'userRecords'])->name('coc.userRecords');
Route::post('/coc/{id}/review', [NewCOCController::class, 'review'])->name('coc.review');
Route::post('/coc/{id}/approve', [NewCOCController::class, 'approve'])->name('coc.approve');
Route::post('/coc/{id}/release', [NewCOCController::class, 'release'])->name('coc.release');
