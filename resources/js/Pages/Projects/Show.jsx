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

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">{project.title}</h1>
                        <div className="flex gap-3">
                            <Link 
                                href={route('projects.index')} 
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Back to Projects
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-500">Project Status</p>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                        project.status === 'planning' ? 'bg-yellow-100 text-yellow-800' : 
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {formatStatus(project.status)}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Progress</p>
                                    <div className="mt-1 w-48 bg-gray-200 rounded-full h-2.5">
                                        <div 
                                            className="bg-blue-600 h-2.5 rounded-full" 
                                            style={{ width: `${project.progress_percentage}%` }}
                                        ></div>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">{project.progress_percentage}% Complete</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="px-4 py-5 sm:p-6">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900">Description</h3>
                                <p className="mt-1 text-gray-600">{project.description}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Details</h3>
                                    <dl className="mt-2 space-y-3">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{formatDate(project.start_date)}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Expected End Date</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{formatDate(project.expected_end_date)}</dd>
                                        </div>
                                        {project.actual_end_date && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Actual End Date</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{formatDate(project.actual_end_date)}</dd>
                                            </div>
                                        )}
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Priority</dt>
                                            <dd className="mt-1 text-sm text-gray-900 capitalize">{project.priority}</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                            
                            {project.status !== 'completed' && (
                                <UpdateForm project={project} />
                            )}
                            
                            {project.updates && project.updates.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Project Updates</h3>
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