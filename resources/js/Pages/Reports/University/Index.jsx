import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Bar, Pie, Line } from 'react-chartjs-2';
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

export default function UniversityReport({ auth, report }) {
    const { data } = report;
    const metrics = data.metrics;
    const facultyDistribution = data.university_metrics.faculty_distribution;
    const monthlyEvents = data.university_metrics.monthly_events;

    // For faculty distribution pie chart
    const facultyChartData = {
        labels: facultyDistribution.map(item => item.label),
        datasets: [
            {
                label: 'Students per Faculty',
                data: facultyDistribution.map(item => item.value),
                backgroundColor: facultyDistribution.map(item => item.color),
                borderColor: facultyDistribution.map(item => item.color),
                borderWidth: 1,
            },
        ],
    };

    // For monthly events bar chart
    const monthlyEventsData = {
        labels: monthlyEvents.map(item => item.month),
        datasets: [
            {
                label: 'Events per Month',
                data: monthlyEvents.map(item => item.count),
                backgroundColor: 'rgba(75, 85, 99, 0.6)',
                borderColor: 'rgb(75, 85, 99)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`${data.name} Report`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Report Header */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">{data.name} Dashboard</h2>
                                    <p className="text-gray-600">Generated on {data.generatedDate}</p>
                                </div>
                                <div className="print:hidden">
                                    <button 
                                        onClick={() => window.print()} 
                                        className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-600">Total Students</h3>
                                <p className="text-3xl font-bold text-gray-800">{metrics.totalStudents}</p>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-600">Active Students</h3>
                                <p className="text-3xl font-bold text-gray-800">{metrics.activeStudents}</p>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-600">Total Events</h3>
                                <p className="text-3xl font-bold text-gray-800">{metrics.totalEvents}</p>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-600">Certificates</h3>
                                <p className="text-3xl font-bold text-gray-800">{metrics.certificatesAwarded}</p>
                            </div>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Faculty Distribution */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-xl font-medium text-gray-800 mb-4">Student Distribution by Faculty</h3>
                                <div className="h-80">
                                    <Pie 
                                        data={facultyChartData} 
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
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Monthly Events */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-xl font-medium text-gray-800 mb-4">Event Participation by Month</h3>
                                <div className="h-80">
                                    <Bar 
                                        data={monthlyEventsData} 
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
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Student Engagement Analysis */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <h3 className="text-xl font-medium text-gray-800 mb-4">Student Engagement Analysis</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead>
                                        <tr>
                                            <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Metric
                                            </th>
                                            <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Value
                                            </th>
                                            <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Analysis
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="py-4 px-4 border-b border-gray-200 text-sm">
                                                Participation Rate
                                            </td>
                                            <td className="py-4 px-4 border-b border-gray-200 text-sm">
                                                {metrics.totalStudents > 0 
                                                    ? Math.round((metrics.activeStudents / metrics.totalStudents) * 100)
                                                    : 0}%
                                            </td>
                                            <td className="py-4 px-4 border-b border-gray-200 text-sm">
                                                {metrics.activeStudents / metrics.totalStudents > 0.5 
                                                    ? "Excellent engagement level across the university"
                                                    : "Opportunity to increase student participation"}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-4 px-4 border-b border-gray-200 text-sm">
                                                Certificates per Student
                                            </td>
                                            <td className="py-4 px-4 border-b border-gray-200 text-sm">
                                                {metrics.activeStudents > 0 
                                                    ? (metrics.certificatesAwarded / metrics.activeStudents).toFixed(2)
                                                    : 0}
                                            </td>
                                            <td className="py-4 px-4 border-b border-gray-200 text-sm">
                                                {metrics.certificatesAwarded / metrics.activeStudents > 1 
                                                    ? "Students are earning multiple certificates"
                                                    : "Students have opportunity to earn more certificates"}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-4 px-4 border-b border-gray-200 text-sm">
                                                Events per Month
                                            </td>
                                            <td className="py-4 px-4 border-b border-gray-200 text-sm">
                                                {monthlyEvents.length > 0 
                                                    ? (monthlyEvents.reduce((sum, item) => sum + item.count, 0) / monthlyEvents.length).toFixed(1)
                                                    : 0}
                                            </td>
                                            <td className="py-4 px-4 border-b border-gray-200 text-sm">
                                                Monthly average of events attended by students
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 