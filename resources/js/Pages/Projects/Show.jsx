import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { format } from 'date-fns';
import UpdateForm from './UpdateForm';

export default function Show({ auth, project }) {
    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch (e) {
            return dateString;
        }
    };
    
    const formatStatus = (status) => {
        return status.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={project.title} />

            <div className="py-12 min-h-screen bg-gradient-to-br from-rose-50 to-yellow-50">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white/80 backdrop-blur-sm shadow-lg sm:rounded-2xl border border-rose-100">
                        <div className="px-4 py-5 sm:px-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-2xl font-semibold text-rose-400">{project.title}</h1>
                                    <p className="text-sm text-rose-300">Project Status: {formatStatus(project.status)}</p>
                                </div>
                                <div className="flex gap-3">
                                    <Link 
                                        href={route('projects.index')} 
                                        className="px-4 py-2 border border-rose-300 rounded-md text-rose-700 hover:bg-gray-50"
                                    >
                                        Back to Projects
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="px-4 py-5 sm:p-6">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-rose-400">Description</h3>
                                <p className="mt-1 text-yellow-600">{project.description}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-medium text-rose-400">Details</h3>
                                    <dl className="mt-2 space-y-3">
                                        <div>
                                            <dt className="text-sm font-medium text-yellow-500">Start Date</dt>
                                            <dd className="mt-1 text-sm text-yellow-900">{formatDate(project.start_date)}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-yellow-500">Expected End Date</dt>
                                            <dd className="mt-1 text-sm text-yellow-900">{formatDate(project.expected_end_date)}</dd>
                                        </div>
                                        {project.actual_end_date && (
                                            <div>
                                                <dt className="text-sm font-medium text-yellow-500">Actual End Date</dt>
                                                <dd className="mt-1 text-sm text-yellow-900">{formatDate(project.actual_end_date)}</dd>
                                            </div>
                                        )}
                                        <div>
                                            <dt className="text-sm font-medium text-yellow-500">Priority</dt>
                                            <dd className="mt-1 text-sm text-yellow-900 capitalize">{project.priority}</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                            
                            {project.status !== 'completed' && (
                                <UpdateForm project={project} />
                            )}
                            
                            {project.updates && project.updates.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-lg font-medium text-rose-400 mb-4">Project Updates</h3>
                                    <div className="space-y-4">
                                        {project.updates.map((update) => (
                                            <div key={update.id} className="bg-gray-50 p-4 rounded-md border border-gray-200">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {update.user_name || (update.updatedBy ? update.updatedBy.name : 'Unknown')}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {formatDate(update.created_at)}
                                                        </p>
                                                    </div>
                                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                                        {update.progress_percentage}%
                                                    </span>
                                                </div>
                                                <p className="mt-2 text-sm text-gray-600">{update.progress_description}</p>
                                                
                                                {update.milestones_completed && (
                                                    <div className="mt-3">
                                                        <p className="text-xs font-medium text-gray-500">Milestones Completed</p>
                                                        <p className="text-sm text-gray-600">{update.milestones_completed}</p>
                                                    </div>
                                                )}
                                                
                                                {update.challenges_faced && (
                                                    <div className="mt-3">
                                                        <p className="text-xs font-medium text-gray-500">Challenges Faced</p>
                                                        <p className="text-sm text-gray-600">{update.challenges_faced}</p>
                                                    </div>
                                                )}
                                                
                                                {update.resources_needed && (
                                                    <div className="mt-3">
                                                        <p className="text-xs font-medium text-gray-500">Resources Needed</p>
                                                        <p className="text-sm text-gray-600">{update.resources_needed}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
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