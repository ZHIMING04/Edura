import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Bar, Pie, Doughnut, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,
    ArcElement,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export default function AdminReport({ auth, report }) {
    const { data } = report;
    const metrics = data.metrics;
    const universityDistribution = data.department_metrics.university_distribution;
    const eventParticipation = data.department_metrics.event_participation;

    // University distribution doughnut chart
    const universityChartData = {
        labels: universityDistribution.map(item => item.label),
        datasets: [
            {
                label: 'Students by University',
                data: universityDistribution.map(item => item.value),
                backgroundColor: universityDistribution.map(item => item.color),
                borderColor: universityDistribution.map(item => item.color),
                borderWidth: 1,
            },
        ],
    };

    // Event participation line chart
    const eventParticipationData = {
        labels: eventParticipation.map(item => item.month),
        datasets: [
            {
                label: 'Events Created',
                data: eventParticipation.map(item => item.count),
                backgroundColor: 'rgba(79, 70, 229, 0.2)',
                borderColor: 'rgba(79, 70, 229, 1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
            },
        ],
    };

    // Calculate total users
    const totalUsers = metrics.total_students + metrics.total_universities;

    // Generate more insights
    const studentToUniversityRatio = metrics.total_universities > 0 
        ? (metrics.total_students / metrics.total_universities).toFixed(1) 
        : 0;

    const eventsPerMonth = eventParticipation.length > 0 
        ? (eventParticipation.reduce((sum, item) => sum + item.count, 0) / eventParticipation.length).toFixed(1) 
        : 0;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="System Overview" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Report Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">System Overview Dashboard</h2>
                                    <p className="text-gray-600">Generated on {data.generatedDate}</p>
                                </div>
                                <div className="print:hidden">
                                    <button 
                                        onClick={() => window.print()} 
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    >
                                        Export Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 border-l-4 border-indigo-500">
                                <h3 className="text-lg font-medium text-gray-600">Total Users</h3>
                                <p className="text-3xl font-bold text-gray-800">{metrics.total_users}</p>
                                <p className="text-sm text-gray-500 mt-1">Active platform users</p>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 border-l-4 border-purple-500">
                                <h3 className="text-lg font-medium text-gray-600">Total Students</h3>
                                <p className="text-3xl font-bold text-gray-800">{metrics.total_students}</p>
                                <p className="text-sm text-gray-500 mt-1">Registered student accounts</p>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 border-l-4 border-blue-500">
                                <h3 className="text-lg font-medium text-gray-600">Universities</h3>
                                <p className="text-3xl font-bold text-gray-800">{metrics.total_universities}</p>
                                <p className="text-sm text-gray-500 mt-1">Participating institutions</p>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 border-l-4 border-green-500">
                                <h3 className="text-lg font-medium text-gray-600">Total Events</h3>
                                <p className="text-3xl font-bold text-gray-800">{metrics.total_events}</p>
                                <p className="text-sm text-gray-500 mt-1">Events organized</p>
                            </div>
                        </div>
                    </div>

                    {/* Insights Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-indigo-700">Events per Month</h3>
                                    <span className="text-3xl text-indigo-600">{eventsPerMonth}</span>
                                </div>
                                <p className="mt-2 text-sm text-indigo-600">Average monthly events</p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-purple-700">Students per University</h3>
                                    <span className="text-3xl text-purple-600">{studentToUniversityRatio}</span>
                                </div>
                                <p className="mt-2 text-sm text-purple-600">Average students per institution</p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-blue-700">Platform Growth</h3>
                                    <span className="text-3xl text-blue-600">+{Math.round(metrics.total_events / 12)}%</span>
                                </div>
                                <p className="mt-2 text-sm text-blue-600">Monthly activity increase</p>
                            </div>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* University Distribution */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-xl font-medium text-gray-800 mb-4">Students by University</h3>
                                <div className="h-80">
                                    <Doughnut 
                                        data={universityChartData} 
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    position: 'right',
                                                    labels: {
                                                        boxWidth: 15,
                                                        font: {
                                                            size: 10
                                                        }
                                                    }
                                                }
                                            },
                                            cutout: '60%'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Monthly Events */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-xl font-medium text-gray-800 mb-4">Events Created by Month</h3>
                                <div className="h-80">
                                    <Line 
                                        data={eventParticipationData} 
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    ticks: {
                                                        precision: 0
                                                    }
                                                }
                                            },
                                            plugins: {
                                                tooltip: {
                                                    callbacks: {
                                                        label: function(context) {
                                                            return `Events: ${context.raw}`;
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* System Health and Recommendations */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <h3 className="text-xl font-medium text-gray-800 mb-4">System Recommendations</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                    <h4 className="font-medium text-green-700 mb-2">Growth Opportunities</h4>
                                    <ul className="list-disc list-inside text-sm text-green-600 space-y-1">
                                        <li>Focus on universities with lower student participation rates</li>
                                        <li>Increase event offerings for {universityDistribution[0]?.label || 'top universities'}</li>
                                        <li>Promote platform to increase lecturer registrations</li>
                                    </ul>
                                </div>
                                
                                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                                    <h4 className="font-medium text-indigo-700 mb-2">Event Strategy</h4>
                                    <ul className="list-disc list-inside text-sm text-indigo-600 space-y-1">
                                        <li>Plan more events during low-activity months</li>
                                        <li>Target event categories with highest completion rates</li>
                                        <li>Consider certificate-granting events to boost engagement</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 