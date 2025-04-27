import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
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
        joined_Pitching: 0,
        joined_Marketing: 0,
        joined_Finance: 0,
        joined_Leadership: 0,
        joined_Networking: 0,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let newValue;

        if (type === 'checkbox') {
            newValue = checked ? 1 : 0;
        } else if (type === 'number') {
            newValue = parseFloat(value);
        } else if (name === 'major') {
            newValue = parseInt(value);
        } else {
            newValue = value;
        }

        setData(name, newValue);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const csrfToken = getCSRFToken();
            if (!csrfToken) {
                throw new Error('CSRF token not found');
            }

            // Convert all numeric strings to numbers
            const processedData = {
                ...data,
                gpa: parseFloat(data.gpa),
                year: parseInt(data.year),
                cert_count: parseInt(data.cert_count),
                project_score: parseInt(data.project_score),
                mentor_rating: parseFloat(data.mentor_rating),
                major: parseInt(data.major),
            };

            const response = await axios.post(route('api.ai-model.predict'), processedData, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                }
            });
            
            if (response.data.success) {
                setResult(response.data.data);
            } else {
                setError('Failed to get prediction: ' + response.data.message);
            }
        } catch (err) {
            console.error('API Error:', err);
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
            header={
                <motion.h2 
                className="text-3xl font-bold leading-tight text-rose-400"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                Student Success Prediction
            </motion.h2>
            }
        >
            <Head title="Student Success Prediction" />

            <div className="py-12 min-h-screen bg-gradient-to-br from-rose-50 to-yellow-50">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <motion.div 
                        className="bg-white/80 backdrop-blur-sm shadow-lg sm:rounded-2xl border border-rose-100" 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        transition={{ duration: 0.5 }}
                    >
                        <div className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="gpa" value="GPA (0-4)" className="text-rose-400 text-2xl" />
                                        <TextInput
                                            id="gpa"
                                            type="number"
                                            name="gpa"
                                            value={data.gpa}
                                            className="mt-1 block w-full border-yellow-300 rounded-md shadow-sm focus:border-yellow-400 focus:ring focus:ring-yellow-500 focus:ring-opacity-50"
                                            onChange={handleChange}
                                            step="0.1"
                                            min="0"
                                            max="4"
                                        />
                                        <InputError message={errors.gpa} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="year" value="Year (1-5)" className="text-rose-400 text-2xl" />
                                        <TextInput
                                            id="year"
                                            type="number"
                                            name="year"
                                            value={data.year}
                                            className="mt-1 block w-full border-yellow-300 rounded-md shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-500 focus:ring-opacity-50"
                                            onChange={handleChange}
                                            min="1"
                                            max="5"
                                        />
                                        <InputError message={errors.year} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="cert_count" value="Certificate Count" className="text-rose-400 text-2xl" />
                                        <TextInput
                                            id="cert_count"
                                            type="number"
                                            name="cert_count"
                                            value={data.cert_count}
                                            className="mt-1 block w-full border-yellow-300 rounded-md shadow-sm focus:border-yellow-400 focus:ring focus:ring-yellow-400 focus:ring-opacity-50"
                                            onChange={handleChange}
                                            min="0"
                                        />
                                        <InputError message={errors.cert_count} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="project_score" value="Project Score (0-100)" className="text-rose-400 text-2xl" />
                                        <TextInput
                                            id="project_score"
                                            type="number"
                                            name="project_score"
                                            value={data.project_score}
                                            className="mt-1 block w-full border-yellow-300 rounded-md shadow-sm focus:border-yellow-500 focus:ring focus:ring-yellow-400 focus:ring-opacity-50"
                                            onChange={handleChange}
                                            min="0"
                                            max="100"
                                        />
                                        <InputError message={errors.project_score} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="mentor_rating" value="Mentor Rating (0-5)" className="text-rose-400 text-2xl" />
                                        <TextInput
                                            id="mentor_rating"
                                            type="number"
                                            name="mentor_rating"
                                            value={data.mentor_rating}
                                            className="mt-1 block w-full border-yellow-300 rounded-md shadow-sm focus:border-yellow-400 focus:ring focus:ring-yellow-400 focus:ring-opacity-50"
                                            onChange={handleChange}
                                            step="0.1"
                                            min="0"
                                            max="5"
                                        />
                                        <InputError message={errors.mentor_rating} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="major" value="Major" className="text-rose-400 text-2xl" />
                                        <select
                                            id="major"
                                            name="major"
                                            value={data.major}
                                            className="mt-1 block w-full border-yellow-300 rounded-md shadow-sm focus:border-rose-400 focus:ring focus:ring-rose-400 focus:ring-opacity-50"
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
                                    <h3 className="text-2xl font-medium text-rose-400">Activities Joined</h3>
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
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-rose-300 rounded"
                                                />
                                                <label htmlFor={activity.id} className="ml-2 block text-sm text-rose-900">
                                                    {activity.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <PrimaryButton 
                                        disabled={loading} 
                                        className="bg-rose-400 text-white hover:bg-rose-700 transition duration-300 text-2xl"
                                    >
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
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="mt-8"
                                >
                                    <h3 className="text-2xl font-semibold text-rose-500 mb-8">
                                        Prediction Analysis
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Success Card */}
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
                                            <div className="relative h-full bg-white rounded-2xl p-6 shadow-xl border border-green-100 hover:border-green-200 transition duration-200">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">SUCCESS</span>
                                                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <div className="mt-4">
                                                    <div className="text-5xl font-bold text-green-500">{formatPercentage(result["2"])}</div>
                                                    <div className="mt-2 text-sm text-gray-600">Probability of Success</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* At Risk Card */}
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
                                            <div className="relative h-full bg-white rounded-2xl p-6 shadow-xl border border-yellow-100 hover:border-yellow-200 transition duration-200">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">AT RISK</span>
                                                    <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                </div>
                                                <div className="mt-4">
                                                    <div className="text-5xl font-bold text-amber-500">{formatPercentage(result["0"])}</div>
                                                    <div className="mt-2 text-sm text-gray-600">Needs Support</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dropout Risk Card */}
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-red-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
                                            <div className="relative h-full bg-white rounded-2xl p-6 shadow-xl border border-rose-100 hover:border-rose-200 transition duration-200">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-semibold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">DROPOUT RISK</span>
                                                    <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <div className="mt-4">
                                                    <div className="text-5xl font-bold text-rose-500">{formatPercentage(result["1"])}</div>
                                                    <div className="mt-2 text-sm text-gray-600">Critical Attention Required</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-rose-400 via-rose-500 to-rose-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-200"></div>
                                            <div className="relative bg-white rounded-2xl p-6 shadow-xl border border-rose-100 hover:border-rose-200 transition duration-200">
                                                <div className="flex items-start space-x-4">
                                                    {parseFloat(result["2"]) > parseFloat(result["1"]) && parseFloat(result["2"]) > parseFloat(result["0"]) && (
                                                        <>
                                                            <div className="flex-shrink-0 bg-green-50 rounded-full p-3">
                                                                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-xl font-semibold text-gray-800">Excellent Progress</h4>
                                                                <p className="mt-2 text-gray-600 leading-relaxed">
                                                                    The student demonstrates exceptional potential with a {formatPercentage(result["2"])} likelihood of academic success. 
                                                                    Current performance indicators suggest strong academic engagement and effective learning strategies.
                                                                </p>
                                                            </div>
                                                        </>
                                                    )}
                                                    {parseFloat(result["1"]) > parseFloat(result["2"]) && parseFloat(result["1"]) > parseFloat(result["0"]) && (
                                                        <>
                                                            <div className="flex-shrink-0 bg-rose-50 rounded-full p-3">
                                                                <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                                </svg>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-xl font-semibold text-gray-800">Immediate Action Required</h4>
                                                                <p className="mt-2 text-gray-600 leading-relaxed">
                                                                    Our analysis indicates a {formatPercentage(result["1"])} risk of academic discontinuation. 
                                                                    Immediate academic support and guidance counseling is recommended to address underlying challenges.
                                                                </p>
                                                            </div>
                                                        </>
                                                    )}
                                                    {parseFloat(result["0"]) > parseFloat(result["1"]) && parseFloat(result["0"]) > parseFloat(result["2"]) && (
                                                        <>
                                                            <div className="flex-shrink-0 bg-amber-50 rounded-full p-3">
                                                                <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-xl font-semibold text-gray-800">Additional Support Recommended</h4>
                                                                <p className="mt-2 text-gray-600 leading-relaxed">
                                                                    The student shows a {formatPercentage(result["0"])} likelihood of facing academic challenges. 
                                                                    We recommend proactive engagement with academic support services and regular progress monitoring.
                                                                </p>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 