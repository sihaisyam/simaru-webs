<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\UserController;
use Inertia\Inertia;

Route::get('home/{nama}', [HomeController::class, 'index']);

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/hello/{nama}', function(string $nama){
    return "ini halaman hello " . $nama . request()->lengkap;
});

// Route::post('/')
// Route::put('/')
// Route::patch('/')
// Route::delete('/')
// Route::resource()

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::resource('users', UserController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
