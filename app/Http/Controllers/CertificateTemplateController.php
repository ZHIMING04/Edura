<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\CertificateTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class CertificateTemplateController extends Controller
{
    public function create(Request $request, Event $event)
    {
        // Get selected users from the query parameters for winner certificates
        $selectedUserIds = $request->query('users', []);
        // Get award levels from query parameters
        $awardLevels = $request->query('awardLevels', []);
        
        // Fix for the JSON string issue
        if (is_string($selectedUserIds) && !is_numeric($selectedUserIds) && !empty($selectedUserIds)) {
            // If it's a JSON string, decode it
            $selectedUserIds = json_decode($selectedUserIds, true);
            
            // If decoding failed or result is not an array, make it an empty array
            if (!is_array($selectedUserIds)) {
                $selectedUserIds = [];
            }
        }
        
        // Parse award levels
        if (is_string($awardLevels) && !empty($awardLevels)) {
            $awardLevels = json_decode($awardLevels, true);
            if (!is_array($awardLevels)) {
                $awardLevels = [];
            }
        }
        
        // Now use the properly formatted arrays with whereIn
        $selectedUsers = collect([]);
        $selectedTeams = collect([]);

        // For individual events or if user IDs are provided
        if (!$event->is_team_event && !empty($selectedUserIds)) {
            $selectedUsers = $event->enrolledUsers()
                ->whereIn('users.id', $selectedUserIds)
                ->get()
                ->map(function ($user) use ($awardLevels) {
                    // Add award level to user data
                    $user->award_level = $awardLevels[$user->id] ?? null;
                    return $user;
                });
        }
        
        // Check if this is a participation certificate request
        $isParticipationCertificate = $request->has('participationCertificate');
        
        return Inertia::render('Certificates/TemplateBuilder', [
            'event' => $event,
            'selectedUsers' => $selectedUsers,
            'awardLevels' => $awardLevels,
            'isParticipationCertificate' => $isParticipationCertificate,
        ]);
    }

    public function store(Request $request, Event $event)
    {
        // Determine validation rules based on event type and certificate type
        $validationRules = [
            'title' => 'required|string|max:255',
            'body_text' => 'nullable|string',
            'signature_image' => 'nullable|image|max:2048',
            'is_participant_template' => 'required|boolean',
            'layout_settings' => 'required|array',
        ];
        
        // Add conditional validation for selected users or teams
        if (!$request->boolean('is_participant_template')) {
            // For individual events, require selected_users
            $validationRules['selected_users'] = 'required|array';
            $validationRules['award_levels'] = 'nullable|array';
        }

        $validated = $request->validate($validationRules);

        // Use the direct public path instead of storage path
        $backgroundImagePath = 'images/Certificate.png';

        // Handle signature image upload
        if ($request->hasFile('signature_image')) {
            $signatureImage = $request->file('signature_image');
            $signatureFileName = 'signature_' . time() . '.' . $signatureImage->getClientOriginalExtension();
            $signatureImage->move(public_path('images/certificate'), $signatureFileName);
            $validated['signature_image'] = 'images/certificate/' . $signatureFileName;
        }

        try {
            // Create certificate template
            $template = $event->certificateTemplates()->create([
                'title' => $validated['title'],
                'body_text' => $validated['body_text'],
                'background_image' => $backgroundImagePath,
                'signature_image' => $validated['signature_image'] ?? null,
                'is_participant_template' => $validated['is_participant_template'],
                'layout_settings' => $validated['layout_settings'],
            ]);

            // If it's a team event for winner certificates, pass teams instead of users
            $selectedUserIds = [];
            $awardLevels = [];
            
            // Process award levels
            if ($request->has('award_levels')) {
                $awardLevelsInput = $request->input('award_levels');
                
                // Handle JSON string or array format
                if (is_string($awardLevelsInput)) {
                    try {
                        $awardLevels = json_decode($awardLevelsInput, true);
                        if (!is_array($awardLevels)) {
                            $awardLevels = [];
                        }
                    } catch (\Exception $e) {
                        $awardLevels = [];
                    }
                } else if (is_array($awardLevelsInput)) {
                    $awardLevels = $awardLevelsInput;
                }

            }
            
            if (!$validated['is_participant_template']) {
                if (isset($validated['selected_users'])) {
                    $selectedUserIds = $validated['selected_users'];
                }
            }

            // Generate certificates
            app(CertificateController::class)->generateCertificates(
                $event, 
                $template, 
                $selectedUserIds,
                $awardLevels
            );

            // Create detailed success message
            $certificateType = $validated['is_participant_template'] ? 'participation' : 'winner';
            $recipientCount = $validated['is_participant_template'] 
                ? $event->enrollments()->count() 
                :count($selectedUserIds);
            
            $successMessage = "Successfully created {$certificateType} certificates for {$recipientCount} {$recipientType}!";

            return redirect()->route('events.my-events')
                ->with('success', $successMessage);
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to create certificates. Please try again.');
        }
    }

    public function preview(Event $event, CertificateTemplate $template)
    {
        return Inertia::render('Certificates/Preview', [
            'event' => $event,
            'template' => $template,
            'backgroundUrl' => asset($template->background_image),
            'signatureUrl' => asset($template->signature_image),
        ]);
    }
} 