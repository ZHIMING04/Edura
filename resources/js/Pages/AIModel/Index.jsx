import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import axios from 'axios';

const majors = [
    { value: 0, label: 'Engineering' },
    { value: 1, label: 'Business' },
    { value: 2, label: 'Computer Science' },
    { value: 3, label: 'Biology' },
    { value: 4, label: 'Arts' },
];

export default function Index({ auth }) {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const { data, setData, errors, reset } = useForm({
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
        const value = e.target.type === 'checkbox' 
            ? (e.target.checked ? 1 : 0) 
            : e.target.value;
            
        setData(e.target.name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await axios.post(route('ai-model.predict'), data);
            
            if (response.data.success) {
                setResult(response.data.data);
            } else {
                setError('Failed to get prediction: ' + response.data.message);
            }
        } catch (err) {
            setError(
                'Error: ' + 
                (err.response?.data?.message || err.message || 'Unknown error')
            );
        } finally {
            setLoading(false);
        }
    };

    const formatPercentage = (value) => {
        return (parseFloat(value) * 100).toFixed(2) + '%';
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Student Success Prediction</h2>}
        >
            <Head title="Student Success Prediction" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="gpa" value="GPA (0-4)" />
                                        <TextInput
                                            id="gpa"
                                            type="number"
                                            name="gpa"
                                            value={data.gpa}
                                            className="mt-1 block w-full"
                                            onChange={handleChange}
                                            step="0.1"
                                            min="0"
                                            max="4"
                                        />
                                        <InputError message={errors.gpa} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="year" value="Year (1-5)" />
                                        <TextInput
                                            id="year"
                                            type="number"
                                            name="year"
                                            value={data.year}
                                            className="mt-1 block w-full"
                                            onChange={handleChange}
                                            min="1"
                                            max="5"
                                        />
                                        <InputError message={errors.year} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="cert_count" value="Certificate Count" />
                                        <TextInput
                                            id="cert_count"
                                            type="number"
                                            name="cert_count"
                                            value={data.cert_count}
                                            className="mt-1 block w-full"
                                            onChange={handleChange}
                                            min="0"
                                        />
                                        <InputError message={errors.cert_count} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="project_score" value="Project Score (0-100)" />
                                        <TextInput
                                            id="project_score"
                                            type="number"
                                            name="project_score"
                                            value={data.project_score}
                                            className="mt-1 block w-full"
                                            onChange={handleChange}
                                            min="0"
                                            max="100"
                                        />
                                        <InputError message={errors.project_score} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="mentor_rating" value="Mentor Rating (0-5)" />
                                        <TextInput
                                            id="mentor_rating"
                                            type="number"
                                            name="mentor_rating"
                                            value={data.mentor_rating}
                                            className="mt-1 block w-full"
                                            onChange={handleChange}
                                            step="0.1"
                                            min="0"
                                            max="5"
                                        />
                                        <InputError message={errors.mentor_rating} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="major" value="Major" />
                                        <select
                                            id="major"
                                            name="major"
                                            value={data.major}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                                            onChange={handleChange}
                                        >
                                            {majors.map((major) => (
                                                <option key={major.value} value={major.value}>
                                                    {major.label} ({major.value})
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.major} className="mt-2" />
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-lg font-medium">Activities Joined</h3>
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {[
                                            { id: 'joined_Pitching', label: 'Pitching' },
                                            { id: 'joined_Marketing', label: 'Marketing' },
                                            { id: 'joined_Finance', label: 'Finance' },
                                            { id: 'joined_Leadership', label: 'Leadership' },
                                            { id: 'joined_Networking', label: 'Networking' },
                                        ].map((activity) => (
                                            <div key={activity.id} className="flex items-center">
                                                <input
                                                    id={activity.id}
                                                    name={activity.id}
                                                    type="checkbox"
                                                    checked={data[activity.id] === 1}
                                                    onChange={handleChange}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor={activity.id} className="ml-2 block text-sm text-gray-900">
                                                    {activity.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <PrimaryButton disabled={loading}>
                                        {loading ? 'Processing...' : 'Get Prediction'}
                                    </PrimaryButton>
                                </div>
                            </form>

                            {error && (
                                <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                    {error}
                                </div>
                            )}

                            {result && (
                                <div className="mt-6">
                                    <h3 className="text-lg font-medium mb-4">Prediction Results</h3>
                                    <div className="bg-green-50 p-4 border border-green-200 rounded-lg">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="bg-white p-4 rounded-lg shadow">
                                                <div className="text-sm text-gray-500">At Risk</div>
                                                <div className="text-2xl font-bold text-yellow-500">{formatPercentage(result["0"])}</div>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg shadow">
                                                <div className="text-sm text-gray-500">Dropout</div>
                                                <div className="text-2xl font-bold text-red-500">{formatPercentage(result["1"])}</div>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg shadow">
                                                <div className="text-sm text-gray-500">Success</div>
                                                <div className="text-2xl font-bold text-green-500">{formatPercentage(result["2"])}</div>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4 bg-blue-50 p-3 rounded">
                                            <div className="text-sm text-blue-800">
                                                <p className="font-medium">Highest Probability:</p>
                                                <p className="mt-1">
                                                    {parseFloat(result["2"]) > parseFloat(result["1"]) && parseFloat(result["2"]) > parseFloat(result["0"]) && (
                                                        <span className="text-green-600 font-medium">
                                                            Student is likely to succeed ({formatPercentage(result["2"])})
                                                        </span>
                                                    )}
                                                    {parseFloat(result["1"]) > parseFloat(result["2"]) && parseFloat(result["1"]) > parseFloat(result["0"]) && (
                                                        <span className="text-red-600 font-medium">
                                                            Student is at risk of dropping out ({formatPercentage(result["1"])})
                                                        </span>
                                                    )}
                                                    {parseFloat(result["0"]) > parseFloat(result["1"]) && parseFloat(result["0"]) > parseFloat(result["2"]) && (
                                                        <span className="text-yellow-600 font-medium">
                                                            Student is at risk and needs support ({formatPercentage(result["0"])})
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 