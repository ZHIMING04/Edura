import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import axios from 'axios';
import { motion } from 'framer-motion';

// Configure axios defaults
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;

// Get CSRF token from meta tag if available, otherwise from cookie
const getCSRFToken = () => {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag) return metaTag.getAttribute('content');
    
    // Try to get from cookie
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    if (match) return decodeURIComponent(match[1]);
    
    return null;
};

export default function RecommendEvent({ auth }) {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [events, setEvents] = useState([]);
    const [formData, setFormData] = useState({
        gpa: 3.4,
        year: 2,
        cert_count: 3,
        project_score: 85,
        mentor_rating: 4.2,
        major: 1,
        joined_Pitching: 0,
        joined_Marketing: 0,
        joined_Finance: 0,
        joined_Leadership: 0,
        joined_Networking: 0,
    });

    // Fetch events when recommended activity changes
    useEffect(() => {
        const fetchEvents = async () => {
            if (response?.ai_prediction?.recommended_event_type) {
                try {
                    const result = await axios.get(`/api/events/category/${response.ai_prediction.recommended_event_type}`);
                    if (result.data.success) {
                        setEvents(result.data.events || []);
                    } else {
                        console.error('Failed to fetch events:', result.data);
                    }
                } catch (err) {
                    console.error('Failed to fetch events:', err);
                }
            }
        };

        fetchEvents();
    }, [response?.ai_prediction?.recommended_event_type]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const activityName = name.replace('joined_', '');
            setFormData(prev => ({
                ...prev,
                [`joined_${activityName}`]: e.target.checked ? 1 : 0
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'number' ? parseFloat(value) : value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setEvents([]); // Clear previous events
        
        try {
            const result = await axios.post(route('api.ai-model.recommend-event'), formData);
            if (result.data.success) {
                setResponse(result.data.data);
                setError(null);
            } else {
                setError(result.data.message || 'Failed to get recommendations');
            }
        } catch (err) {
            console.error('API Error:', err);
            setError('Failed to connect to the API');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <motion.h2 
                    className="text-3xl font-bold leading-tight text-rose-400 font-sans"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Event Recommendations
                </motion.h2>
            }
        >
            <Head title="Event Recommendations" />
            <div className="py-12 min-h-screen bg-gradient-to-br from-rose-50 to-yellow-50">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <motion.div 
                        className="bg-white/80 backdrop-blur-sm shadow-lg sm:rounded-2xl border border-rose-100 p-6 font-sans"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-rose-400">Student Information</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="gpa" value="GPA" className="text-rose-400" />
                                    <TextInput
                                        id="gpa"
                                        type="number"
                                        name="gpa"
                                        value={formData.gpa}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border-yellow-300"
                                        step="0.1"
                                        min="0"
                                        max="4"
                                    />
                                </div>

                                <div>
                                    <InputLabel htmlFor="year" value="Year" className="text-rose-400" />
                                    <TextInput
                                        id="year"
                                        type="number"
                                        name="year"
                                        value={formData.year}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border-yellow-300"
                                        min="1"
                                        max="5"
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <h3 className="text-xl font-semibold mb-2 text-rose-400">Activities</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {['Pitching', 'Marketing', 'Finance', 'Leadership', 'Networking'].map((activity) => (
                                        <div key={activity} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={`joined_${activity}`}
                                                name={`joined_${activity}`}
                                                checked={formData[`joined_${activity}`] === 1}
                                                onChange={handleChange}
                                                className="rounded border-rose-300 text-rose-600 shadow-sm focus:ring-rose-500"
                                            />
                                            <label htmlFor={`joined_${activity}`} className="ml-2 text-rose-600">
                                                {activity}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <PrimaryButton 
                                    type="submit" 
                                    disabled={loading}
                                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-200"
                                >
                                    {loading ? 'Getting Recommendations...' : 'Get Event Recommendations'}
                                </PrimaryButton>
                            </div>
                        </form>

                        {error && (
                            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md">
                                {error}
                            </div>
                        )}

                        {response && (
                            <div className="mt-6">
                                <h3 className="text-xl font-semibold mb-4 text-rose-400">Recommended Events</h3>
                                <div className="bg-white/50 rounded-lg p-6 shadow-sm border border-rose-100">
                                    <div className="mb-4">
                                        <p className="text-lg text-rose-600">
                                            Success Probability: {response.ai_prediction.new_success_probability}%
                                        </p>
                                        <p className="text-lg text-rose-600">
                                            Improvement: {response.ai_prediction.improvement_percentage}%
                                        </p>
                                        <p className="text-lg font-semibold text-rose-600">
                                            Recommended Activity: {response.ai_prediction.recommended_event_type}
                                        </p>
                                    </div>

                                    {events.length > 0 ? (
                                        <div className="space-y-4">
                                            <h4 className="text-lg font-semibold text-rose-500">Available {response.ai_prediction.recommended_event_type} Events:</h4>
                                            {events.map((event) => (
                                                <div key={event.event_id} className="bg-white p-4 rounded-lg shadow-sm border border-rose-100">
                                                    <h5 className="text-lg font-semibold text-rose-600">{event.title}</h5>
                                                    <p className="text-gray-600">{event.description}</p>
                                                    <div className="mt-2 text-sm text-gray-500">
                                                        <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                                                        <p>Time: {event.time}</p>
                                                        <p>Location: {event.location}</p>
                                                        <p>Category: {event.category}</p>
                                                        <div className="mt-3">
                                                            {!event.is_external ? (
                                                                <a
                                                                    href={route('events.show', event.event_id)}
                                                                    className="inline-flex items-center px-4 py-2 bg-rose-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-rose-600 active:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                                                >
                                                                    View Details
                                                                </a>
                                                            ) : (
                                                                <a
                                                                    href={event.registration_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center px-4 py-2 bg-rose-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-rose-600 active:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                                                >
                                                                    Register External Event
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500">No {response.ai_prediction.recommended_event_type} events available at the moment.</p>
                                            <p className="text-sm text-gray-400 mt-2">Please check back later for new events.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 