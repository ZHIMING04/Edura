<?php

namespace App\Services;

use App\Models\Report;
use App\Models\User;
use App\Models\Event;
use App\Models\DepartmentStaff;

class ReportService
{
    public function generateReport($startDate, $endDate)
    {
        return [
            'data' => [
                'overview' => [
                    'total_students' => User::where('role', 'student')->count(),
                    'total_lecturers' => User::where('role', 'lecturer')->count(),
                ],
                'student_metrics' => [
                    'by_level' => $this->getStudentsByLevel(),
                    'active_in_events' => $this->getActiveStudentsCount($startDate, $endDate),
                    'certificates_earned' => $this->getCertificatesCount($startDate, $endDate),
                    'team_participations' => $this->getTeamParticipationsCount($startDate, $endDate),
                    'monthly_participation' => $this->getMonthlyParticipation($startDate, $endDate),
                ],
            ]
        ];
    }

    private function getStudentsByFaculty()
    {
        return User::whereIs('student')
            ->join('students', 'users.id', '=', 'students.user_id')
            ->groupBy('faculty')
            ->selectRaw('faculty, count(*) as count')
            ->pluck('count', 'faculty')
            ->toArray();
    }

    private function getStudentsByUniversity()
    {
        return User::whereIs('student')
            ->join('students', 'users.id', '=', 'students.user_id')
            ->groupBy('university')
            ->selectRaw('university, count(*) as count')
            ->pluck('count', 'university')
            ->toArray();
    }

    private function getStudentsByLevel()
    {
        return User::whereIs('student')
            ->join('students', 'users.id', '=', 'students.user_id')
            ->groupBy('level')
            ->selectRaw('level, count(*) as count')
            ->pluck('count', 'level')
            ->toArray();
    }

    private function getMonthlyParticipation($startDate, $endDate)
    {
        // Example implementation - adjust based on your database structure
        return Event::whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('MONTH(created_at) as month, COUNT(*) as count')
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('count', 'month')
            ->toArray();
    }
} 