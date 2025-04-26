import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import axios from 'axios';

export default function RecommendEvent({ auth }) {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        gpa: 3.4,
        year: 2,
        cert_count: 3,
        project_score: 85,
        mentor_rating: 4.2,
        major: 1,
        joined_Pitching: 1,
        joined_Marketing: 0,
        joined_Finance: 0,
        joined_Leadership: 1,
        joined_Networking: 1,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            const result = await axios.post(route('ai-model.recommend-event'), formData);
            setResponse(result.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Event Recommendations</h2>}
        >
            <Head title="Event Recommendations" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="gpa" value="GPA" />
                                    <TextInput
                                        id="gpa"
                                        type="number"
                                        name="gpa"
                                        value={formData.gpa}
                                        onChange={handleChange}
                                        className="mt-1 block w-full"
                                        step="0.1"
                                        min="0"
                                        max="4"
                                    />
                                </div>

                                <div>
                                    <InputLabel htmlFor="year" value="Year" />
                                    <TextInput
                                        id="year"
                                        type="number"
                                        name="year"
                                        value={formData.year}
                                        onChange={handleChange}
                                        className="mt-1 block w-full"
                                        min="1"
                                        max="5"
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <h3 className="text-lg font-medium mb-2">Activities</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {[
                                        { id: 'joined_Pitching', label: 'Pitching' },
                                        { id: 'joined_Marketing', label: 'Marketing' },
                                        { id: 'joined_Finance', label: 'Finance' },
                                        { id: 'joined_Leadership', label: 'Leadership' },
                                        { id: 'joined_Networking', label: 'Networking' }
                                    ].map((activity) => (
                                        <div key={activity.id} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={activity.id}
                                                name={activity.id}
                                                checked={formData[activity.id] === 1}
                                                onChange={handleChange}
                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                            />
                                            <label htmlFor={activity.id} className="ml-2 text-sm text-gray-600">
                                                {activity.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <PrimaryButton type="submit" disabled={loading}>
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
                                <h3 className="text-lg font-medium mb-4">Recommended Events</h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <pre className="whitespace-pre-wrap">
                                        {JSON.stringify(response.data, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 