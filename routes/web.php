<?php
use App\Http\Controllers\AIModelController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EnrollmentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

//Dashboard Routes
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Profile routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Common profile routes
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Role-specific profile updates
    Route::patch('/profile/student/update', [ProfileController::class, 'updateStudent'])
        ->name('profile.student.update');
    
    Route::patch('/profile/lecturer/update', [ProfileController::class, 'updateLecturer'])
        ->name('profile.lecturer.update');
    
    Route::patch('/profile/university/update', [ProfileController::class, 'updateUniversity'])
        ->name('profile.university.update');

    Route::patch('/profile/update', [ProfileController::class, 'update'])->name('profile.update');
});

//Event Routes
Route::middleware(['auth'])->group(function () {
    // Event management
    Route::get('/events/create', [EventController::class, 'create'])->name('events.create');
    Route::post('/events', [EventController::class, 'store'])->name('events.store');
    Route::get('/events', [EventController::class, 'index'])->name('events.index');
    Route::get('/my-events', [EventController::class, 'myEvents'])->name('events.my-events');
    Route::get('/events/{event}/edit', [EventController::class, 'edit'])->name('events.edit');
    Route::put('/events/{event}', [EventController::class, 'update'])->name('events.update');
    
    // Event enrollment
    Route::post('/events/{event}/enroll', [EnrollmentController::class, 'store'])->name('events.enroll');
    Route::delete('/events/{event}/unenroll', [EnrollmentController::class, 'destroy'])->name('events.unenroll');
    Route::get('/events/{event}/enrolled-users', [EventController::class, 'getEnrolledUsers'])
        ->name('events.enrolled-users');
});

//Certificate Routes
Route::middleware(['auth'])->group(function () {
    Route::get('/student/certificates', [CertificateController::class, 'studentCertificates'])
        ->name('student.certificates');
    Route::get('/certificates/{certificate}/download', [CertificateController::class, 'download'])
        ->name('certificates.download');
});

// Certificate Template Routes
Route::middleware(['auth'])->group(function () {
    Route::get('/events/{event}/certificates/create', [CertificateTemplateController::class, 'create'])
        ->name('certificates.create');
    Route::post('/events/{event}/certificates', [CertificateTemplateController::class, 'store'])
        ->name('certificates.store');
    Route::get('/events/{event}/certificates/{template}/preview', [CertificateTemplateController::class, 'preview'])
        ->name('certificates.preview');
});

// AI Model Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/ai-model', [AIModelController::class, 'index'])->name('ai-model.index');
    Route::get('/ai-model/recommend-event', [AIModelController::class, 'showRecommendEvent'])
        ->name('ai-model.recommend-event.show');
});

require _DIR_.'/auth.php';
