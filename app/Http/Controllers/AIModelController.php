<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class AIModelController extends Controller
{
    /**
     * Show the prediction form.
     */
    public function index()
    {
        return Inertia::render('AIModel/Index');
    }

    /**
     * Show the event recommendation form.
     */
    public function showRecommendEvent()
    {
        return Inertia::render('AIModel/RecommendEvent');
    }

    /**
     * Send prediction request to the API.
     */
    public function predict(Request $request)
    {
        $validated = $request->validate([
            'gpa' => 'required|numeric|between:0,4',
            'year' => 'required|integer|between:1,5',
            'cert_count' => 'required|integer|min:0',
            'project_score' => 'required|numeric|between:0,100',
            'mentor_rating' => 'required|numeric|between:0,5',
            'major' => 'required|integer|min:0',
            'joined_Pitching' => 'required|boolean',
            'joined_Marketing' => 'required|boolean',
            'joined_Finance' => 'required|boolean',
            'joined_Leadership' => 'required|boolean',
            'joined_Networking' => 'required|boolean',
        ]);

        try {
            // Replace with your actual API endpoint
            $response = Http::post('http://localhost:5000/predict', $validated);
            
            if ($response->successful()) {
                return response()->json([
                    'success' => true,
                    'data' => $response->json(),
                ]);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'API request failed: ' . $response->status(),
                'details' => $response->json() ?? 'No details available',
            ], 500);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to connect to the API',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get event recommendations from the AI model.
     */
    public function recommendEvent(Request $request)
    {
        $validated = $request->validate([
            'gpa' => 'required|numeric|between:0,4',
            'year' => 'required|integer|between:1,5',
            'cert_count' => 'required|integer|min:0',
            'project_score' => 'required|numeric|between:0,100',
            'mentor_rating' => 'required|numeric|between:0,5',
            'major' => 'required|integer|min:0',
            'joined_Pitching' => 'required|boolean',
            'joined_Marketing' => 'required|boolean',
            'joined_Finance' => 'required|boolean',
            'joined_Leadership' => 'required|boolean',
            'joined_Networking' => 'required|boolean',
        ]);

        try {
            // Call the recommend_event endpoint with the same data format
            $response = Http::post('http://localhost:5000/recommend_event', $validated);
            
            if ($response->successful()) {
                $aiResponse = $response->json();
                
                // Get matching events from database based on AI recommendation
                $recommendedCategory = $aiResponse['recommended_event'];
                $matchingEvents = \App\Models\Event::where('category', $recommendedCategory)
                    ->where('status', 'Upcoming')
                    ->where(function($query) {
                        $query->where('is_external', false)
                            ->whereRaw('enrolled_count < max_participants')
                            ->orWhere('is_external', true);
                    })
                    ->select('event_id', 'title', 'date', 'time', 'location', 'description', 'max_participants', 'enrolled_count', 'is_external', 'registration_url')
                    ->orderBy('date')
                    ->take(3)
                    ->get();

                return response()->json([
                    'success' => true,
                    'data' => [
                        'ai_prediction' => [
                            'improvement_percentage' => $aiResponse['improvement_percentage'],
                            'new_success_probability' => $aiResponse['new_success_probability'],
                            'recommended_event_type' => $recommendedCategory,
                            'status' => $aiResponse['status']
                        ],
                        'matching_events' => $matchingEvents->map(function($event) {
                            return [
                                'event_id' => $event->event_id,
                                'title' => $event->title,
                                'date' => $event->date,
                                'time' => $event->time,
                                'location' => $event->location,
                                'description' => $event->description,
                                'availability' => $event->is_external ? 'External Event' : 
                                    ($event->max_participants - $event->enrolled_count) . ' spots remaining',
                                'is_external' => $event->is_external,
                                'registration_url' => $event->registration_url,
                            ];
                        })
                    ]
                ]);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'API request failed: ' . $response->status(),
                'details' => $response->json() ?? 'No details available',
            ], 500);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to connect to the API',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
} 