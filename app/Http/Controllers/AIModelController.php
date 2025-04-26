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
} 