<?php

namespace App\Http\Controllers;

use Dompdf\Dompdf;
use Illuminate\Support\Facades\Storage;
use App\Models\Certificate;
use App\Models\Event;
use App\Models\CertificateTemplate;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CertificateController extends Controller
{
    public function studentCertificates(Request $request)
    {
        $certificates = Certificate::with(['template', 'event'])
            ->where('student_id', $request->user()->student->student_id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($certificates);
    }

    public function generateCertificates(Event $event, CertificateTemplate $template, array $selectedUserIds = [], array $selectedTeamIds = [], array $awardLevels = [])
    {
        try {
            // Handle participation certificates
            if ($template->is_participant_template) {
                    // For individual events, generate for all enrolled users
                    $users = $event->enrolledUsers;
            } 
            // Handle winner certificates
            else {
                    // For individual events, only generate for selected users
                    $users = User::whereIn('id', $selectedUserIds)->get();
            }


            // Keep track of processed student IDs to avoid duplicates
            $processedStudentIds = [];

            foreach ($users as $user) {
                // Check if user has a student record and hasn't been processed yet
                if ($user->student && !in_array($user->student->student_id, $processedStudentIds)) {
                    // Add to processed list
                    $processedStudentIds[] = $user->student->student_id;
                    
                    // Generate unique certificate number
                    $certificateNumber = $this->generateCertificateNumber($event, $user);

                    $awardLevel = null;
                    
                    // For individual winner certificates, get award level from input
                    $awardLevel = $awardLevels[$user->id] ?? null;
                        
                    
                    // Create certificate record
                    Certificate::create([
                        'certificate_id' => Str::uuid(),
                        'event_id' => $event->event_id,
                        'student_id' => $user->student->student_id,
                        'template_id' => $template->id,
                        'certificate_number' => $certificateNumber,
                        'status' => 'issued',
                        'issue_date' => now(),
                        'award_level' => $awardLevel,
                        'certificate_data' => [
                            'student_name' => $user->name,
                            'event_name' => $event->title,
                            'body_text' => $template->body_text,
                            'is_winner' => !$template->is_participant_template,
                            'award_level' => $awardLevel,
                        ],
                    ]);
                }
            }

            return true;
        } catch (\Exception $e) {
            throw $e;
        }
    }

    private function generateCertificateNumber(Event $event, User $user): string
    {
        $prefix = $event->event_id;
        $timestamp = now()->format('YmdHis');
        $random = Str::random(4);
        return strtoupper("CERT-{$prefix}-{$timestamp}-{$random}");
    }

    public function download(Certificate $certificate)
    {
        // Ensure the user can only download their own certificates
        if ($certificate->student_id !== auth()->user()->student->student_id) {
            abort(403);
        }

        try {
            // Generate and return the certificate PDF
            $pdf = $this->generateCertificatePDF($certificate);
            
            return response()->download(
                $pdf,
                "certificate_{$certificate->certificate_number}.pdf",
                ['Content-Type' => 'application/pdf']
            )->deleteFileAfterSend(true); // This will clean up the temporary file
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to generate certificate. Please try again.');
        }
    }

    public function generateCertificatePDF(Certificate $certificate)
    {
        // Initialize Dompdf with the right configuration
        $dompdf = new \Dompdf\Dompdf();
        $options = new \Dompdf\Options();
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isPhpEnabled', true);
        $options->set('isRemoteEnabled', true);
        $dompdf->setOptions($options);
        
        // Get the student's name through the relationships
        $student = $certificate->student;
        $user = $student->user;
        $userName = $user->name ?? 'Student Name';
        
        // Get template and layout settings
        $template = $certificate->template;
        $layoutSettings = $template->layout_settings;
        
        // Convert image paths to data URIs - this is more reliable for DOMPDF
        $backgroundImageData = "data:image/png;base64," . base64_encode(file_get_contents(public_path('images/Certificate.png')));
        
        // Check if signature image exists and convert to data URI
        $signatureImageData = null;
        if ($template->signature_image && file_exists(public_path($template->signature_image))) {
            $signatureImageData = "data:image/png;base64," . base64_encode(file_get_contents(public_path($template->signature_image)));
        }
        
        // Generate HTML for the certificate
        $html = view('certificates.pdf', [
            'certificate' => $certificate,
            'template' => $template,
            'event' => $certificate->event,
            'studentName' => $userName,
            'certificateNumber' => $certificate->certificate_number,
            'issueDate' => $certificate->issue_date->format('d/m/Y'),
            'layoutSettings' => $layoutSettings,
            'backgroundImageData' => $backgroundImageData,
            'signatureImageData' => $signatureImageData,
        ])->render();

        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'landscape');
        $dompdf->render();

        // Save to temporary file
        $tmpPath = storage_path('app/temp/' . Str::uuid() . '.pdf');
        if (!file_exists(storage_path('app/temp'))) {
            mkdir(storage_path('app/temp'), 0755, true);
        }
        file_put_contents($tmpPath, $dompdf->output());

        return $tmpPath;
    }
} 
