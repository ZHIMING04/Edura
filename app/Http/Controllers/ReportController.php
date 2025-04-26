<?php

namespace App\Http\Controllers;

use App\Services\ReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Report;
use App\Models\University;
use Illuminate\Routing\Controller as BaseController;
use App\Models\User;
use App\Models\Event;
use App\Models\Certificate;
use Illuminate\Support\Facades\DB;
use App\Models\Student;
use Illuminate\Support\Facades\Log;

class ReportController extends BaseController
{
    protected $reportService;

    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    public function index()
    {
        try {
            $user = auth()->user();
            $role = $user->role;

            \Log::info('Report accessed', ['role' => $role, 'user_id' => $user->id]);

            // Get report data based on role
            $report = match($role) {
                'admin' => $this->getAdminReport(),
                'university' => $this->getUniversityDashboardReport(),
                'lecturer' => $this->getUniversityDashboardReport(), // For now, lecturers see university report
                'student' => $this->getUniversityDashboardReport(), // For now, students see university report
                default => $this->getUniversityDashboardReport() // Default to university report
            };

            // Map components based on role
            $component = match($role) {
                'admin' => 'Reports/Admin/Index',
                'university' => 'Reports/University/Index',
                'lecturer' => 'Reports/University/Index',
                'student' => 'Reports/University/Index',
                default => 'Reports/University/Index'
            };

            \Log::info('Rendering report component', [
                'component' => $component, 
                'role' => $role,
                'user_id' => $user->id
            ]);

            return Inertia::render($component, [
                'report' => $report
            ]);

        } catch (\Exception $e) {
            \Log::error('Error in report:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->with('error', 'Failed to load report: ' . $e->getMessage());
        }
    }

    private function getAdminReport()
    {
        try {
            // Basic metrics
            $metrics = [
                'total_users' => DB::table('users')->count(),
                'total_students' => DB::table('students')->count(),
                'total_universities' => DB::table('universities')->count(),
                'total_events' => DB::table('events')->count()
            ];

            // Get event participation data
            $eventParticipation = DB::table('events')
                ->select(
                    DB::raw('MONTH(created_at) as month_number'),
                    DB::raw('DATE_FORMAT(created_at, "%M") as month'),
                    DB::raw('COUNT(DISTINCT event_id) as count')
                )
                ->whereYear('created_at', now()->year)
                ->groupBy('month_number', 'month')
                ->orderBy('month_number')
                ->get();

            // Get university student distribution
            $universityDistribution = DB::table('students')
                ->select('university', DB::raw('count(*) as count'))
                ->whereNotNull('university')
                ->groupBy('university')
                ->get()
                ->map(function($item) {
                    return [
                        'label' => $item->university,
                        'value' => $item->count,
                        'color' => $this->getRandomColor()
                    ];
                });

            return [
                'data' => [
                    'name' => 'System Overview',
                    'generatedDate' => now()->format('F d, Y'),
                    'metrics' => $metrics,
                    'department_metrics' => [
                        'event_participation' => $eventParticipation,
                        'university_distribution' => $universityDistribution
                    ]
                ]
            ];

        } catch (\Exception $e) {
            \Log::error('Error generating admin report:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    private function getUniversityDashboardReport()
    {
        try {
            $user = auth()->user();
            if (!$user || !$user->university) {
                \Log::error('No university found for user');
                throw new \Exception('University data not found');
            }

            $universityName = $user->university->name;
            \Log::info('Getting university report for:', ['university' => $universityName]);

            // Simple direct queries using your existing structure
            $metrics = [
                'totalStudents' => DB::table('students')
                    ->where('university', $universityName)
                    ->count(),

                'activeStudents' => DB::table('students')
                    ->join('users', 'students.user_id', '=', 'users.id')
                    ->join('enrollments', 'users.id', '=', 'enrollments.user_id')
                    ->where('students.university', $universityName)
                    ->distinct('students.student_id')
                    ->count('students.student_id'),

                'totalEvents' => DB::table('events')
                    ->join('enrollments', 'events.event_id', '=', 'enrollments.event_id')
                    ->join('users', 'enrollments.user_id', '=', 'users.id')
                    ->join('students', 'users.id', '=', 'students.user_id')
                    ->where('students.university', $universityName)
                    ->distinct('events.event_id')
                    ->count('events.event_id'),

                'certificatesAwarded' => DB::table('certificates')
                    ->join('students', 'certificates.student_id', '=', 'students.student_id')
                    ->where('students.university', $universityName)
                    ->count()
            ];

            // Faculty distribution
            $facultyDistribution = DB::table('students')
                ->where('university', $universityName)
                ->whereNotNull('faculty')
                ->select('faculty', DB::raw('count(*) as count'))
                ->groupBy('faculty')
                ->get()
                ->map(function($item) {
                    return [
                        'label' => $item->faculty,
                        'value' => $item->count,
                        'color' => $this->getRandomColor()
                    ];
                });

            // Monthly events data
            $monthlyEvents = DB::table('events')
                ->join('enrollments', 'events.event_id', '=', 'enrollments.event_id')
                ->join('users', 'enrollments.user_id', '=', 'users.id')
                ->join('students', 'users.id', '=', 'students.user_id')
                ->where('students.university', $universityName)
                ->whereYear('events.created_at', now()->year)
                ->select(
                    DB::raw('MONTH(events.created_at) as month_number'),
                    DB::raw('MONTHNAME(events.created_at) as month'),
                    DB::raw('COUNT(DISTINCT events.event_id) as count')
                )
                ->groupBy('month_number', 'month')
                ->orderBy('month_number')
                ->get();

            // Log the data for debugging
            \Log::info('University report data prepared', [
                'university' => $universityName,
                'metrics' => $metrics,
                'faculty_count' => $facultyDistribution->count(),
                'monthly_events' => $monthlyEvents->count()
            ]);

            return [
                'data' => [
                    'name' => $universityName,
                    'generatedDate' => now()->format('F d, Y'),
                    'metrics' => $metrics,
                    'university_metrics' => [
                        'faculty_distribution' => $facultyDistribution,
                        'monthly_events' => $monthlyEvents
                    ]
                ]
            ];

        } catch (\Exception $e) {
            \Log::error('Error in university report:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    private function getRandomColor()
    {
        $colors = [
            '#4c1d95', '#5b21b6', '#6d28d9', 
            '#7c3aed', '#8b5cf6', '#a78bfa',
            '#c4b5fd', '#ddd6fe', '#ede9fe'
        ];
        static $index = 0;
        return $colors[$index++ % count($colors)];
    }

    public function getUniversityReport($universityId)
    {
        $this->authorize('view-university-reports');
        
        $report = $this->reportService->generateReport(null, $universityId);

        return Inertia::render('Reports/University', [
            'report' => $report,
            'university' => University::find($universityId)
        ]);
    }

    public function getSystemReport()
    {
        $this->authorize('view-all-reports');
        
        $report = $this->reportService->generateReport();

        return Inertia::render('Reports/System', [
            'report' => $report
        ]);
    }

    

    public function universityReport()
    {
        try {
            \Log::info('University report accessed');
            $report = $this->getUniversityDashboardReport();
            return Inertia::render('Reports/University/Index', ['report' => $report]);
        } catch (\Exception $e) {
            \Log::error('Error in university report:', ['error' => $e->getMessage()]);
            return back()->with('error', 'Failed to load report');
        }
    }

    public function adminReport()
    {
        try {
            \Log::info('Admin report accessed');
            return Inertia::render('Reports/Admin/Index', [
                'report' => $this->getAdminDashboardReport()
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in admin report:', ['error' => $e->getMessage()]);
            return back()->with('error', 'Failed to load report');
        }
    }
} 