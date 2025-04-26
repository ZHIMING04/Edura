import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="text-xl font-semibold">Welcome back!</h2>
                            <p className="mt-2">You're logged in successfully.</p>
                            
                            <div className="mt-6">
                                <h3 className="text-lg font-medium">Available Tools</h3>
                                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    <Link
                                        href={route('ai-model.index')}
                                        className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-6 shadow hover:bg-gray-50"
                                    >
                                        <div className="mb-2 rounded-full bg-indigo-100 p-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                            </svg>
                                        </div>
                                        <h5 className="mb-1 text-lg font-semibold tracking-tight text-gray-900">
                                            Student Success Prediction
                                        </h5>
                                        <p className="text-center text-sm text-gray-600">
                                            Use our AI model to predict student outcomes
                                        </p>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
