import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import StudentProfileForm from './Student/StudentProfileForm';
import LecturerProfileForm from './Lecturer/LecturerProfileForm';
import UniversityProfileForm from './University/UniversityProfileForm';

export default function Edit({ auth, mustVerifyEmail, status }) {
    const user = auth.user;
    // Get role from user's bouncer abilities
    const role = user.roles?.[0]?.name?.toLowerCase() || '';
    
    // Check if the role-specific model exists for the user
    const hasRoleModel = () => {
        switch (role) {
            case 'student':
                return !!user.student;
            case 'lecturer':
                return !!user.lecturer;
            case 'university':
                return !!user.university;
            default:
                return false;
        }
    };

    // Function to render the appropriate profile form based on user role
    const renderRoleProfileForm = () => {
        if (!role) {
            return (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-yellow-700">No role assigned. Please contact an administrator.</p>
                </div>
            );
        }
        
        if (!hasRoleModel()) {
            return (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-yellow-700">
                        Your {role} profile is not properly initialized. Please refresh the page or contact an administrator if this issue persists.
                    </p>
                </div>
            );
        }

        switch (role) {
            case 'student':
                return <StudentProfileForm className="mt-6" user={user} />;
            case 'lecturer':
                return <LecturerProfileForm className="mt-6" user={user} />;
            case 'university':
                return <UniversityProfileForm className="mt-6" user={user} />;
            default:
                return (
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-yellow-700">Role-specific profile not available.</p>
                    </div>
                );
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Profile" />

            <div className="py-12 min-h-screen bg-gradient-to-br from-rose-50 to-yellow-50">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white/80 backdrop-blur-sm shadow-lg sm:rounded-2xl border border-rose-100">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    {/* Role-specific profile form */}
                    <div className="p-4 sm:p-8 bg-white/80 backdrop-blur-sm shadow-lg sm:rounded-2xl border border-rose-100">
                        <div className="max-w-xl">
                            <h2 className="text-lg font-medium text-rose-400">
                                {role ? `${role.charAt(0).toUpperCase() + role.slice(1)} Profile Information` : 'Profile Information'}
                            </h2>
                            <p className="mt-1 text-sm text-yellow-600">
                                Update your role-specific profile information.
                            </p>
                        </div>
                        {renderRoleProfileForm()}
                    </div>

                    <div className="p-4 sm:p-8 bg-white/80 backdrop-blur-sm shadow-lg sm:rounded-2xl border border-rose-100">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 