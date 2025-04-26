import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import axios from 'axios';
import { motion } from 'framer-motion';

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
            header={
                <motion.h2 className="text-3xl font-bold leading-tight text-rose-400"
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
                        className="bg-white/80 backdrop-blur-sm shadow-lg sm:rounded-2xl border border-rose-100 p-6" 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        transition={{ duration: 0.5 }}
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="gpa" value="GPA" className="text-rose-400 text-3xl" />
                                    <TextInput
                                        id="gpa"
                                        type="number"
                                        name="gpa"
                                        value={formData.gpa}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border-yellow-300 rounded-md shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-400 focus:ring-opacity-50"
                                        step="0.1"
                                        min="0"
                                        max="4"
                                    />
                                </div>

                                <div>
                                    <InputLabel htmlFor="year" value="Year" className="text-rose-400 text-3xl" />
                                    <TextInput
                                        id="year"
                                        type="number"
                                        name="year"
                                        value={formData.year}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border-yellow-300 rounded-md shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-400 focus:ring-opacity-50"
                                        min="1"
                                        max="5"
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <h3 className="text-2xl font-medium mb-2 text-rose-400">Activities</h3>
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
                                            <label htmlFor={activity.id} className="ml-2 text-sm text-rose-600 text-lg">
                                                {activity.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <PrimaryButton type="submit" disabled={loading} className="bg-yellow-400 text-white hover:bg-yellow-700 transition duration-300 text-lg">
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
                                <div className="bg-rose-50 rounded-lg p-4">
                                    <pre className="whitespace-pre-wrap">
                                        {JSON.stringify(response.data, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 