import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { format } from 'date-fns';

export default function Edit({ auth, event }) {
    const { data, setData, put, processing, errors } = useForm({
        title: event.title,
        description: event.description,
        date: format(new Date(event.date), 'yyyy-MM-dd'),
        location: event.location,
        max_participants: event.max_participants || '',
        is_external: event.is_external,
        registration_url: event.registration_url || '',
        status: event.status,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('events.update', event.event_id));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Edit Event: ${event.title}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">Edit Event</h1>
                        <Link 
                            href={route('events.my-events')} 
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Back to My Events
                        </Link>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">                            
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="title" value="Event Title" />
                                    <TextInput
                                        id="title"
                                        type="text"
                                        name="title"
                                        value={data.title}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('title', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.title} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="description" value="Description" />
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        rows="4"
                                        onChange={(e) => setData('description', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="date" value="Event Date" />
                                    <TextInput
                                        id="date"
                                        type="date"
                                        name="date"
                                        value={data.date}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('date', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.date} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="location" value="Location" />
                                    <TextInput
                                        id="location"
                                        type="text"
                                        name="location"
                                        value={data.location}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('location', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.location} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="status" value="Status" />
                                    <select
                                        id="status"
                                        name="status"
                                        value={data.status}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        onChange={(e) => setData('status', e.target.value)}
                                        required
                                    >
                                        <option value="Upcoming">Upcoming</option>
                                        <option value="Ongoing">Ongoing</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>

                                <div className="flex items-center gap-4">
                                    <input
                                        type="checkbox"
                                        id="is_external"
                                        name="is_external"
                                        checked={data.is_external}
                                        onChange={(e) => setData('is_external', e.target.checked)}
                                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                    />
                                    <InputLabel htmlFor="is_external" value="External Event" />
                                </div>

                                {!data.is_external && (
                                    <div>
                                        <InputLabel htmlFor="max_participants" value="Maximum Participants" />
                                        <TextInput
                                            id="max_participants"
                                            type="number"
                                            name="max_participants"
                                            value={data.max_participants}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('max_participants', e.target.value)}
                                            required
                                            min="1"
                                        />
                                        <InputError message={errors.max_participants} className="mt-2" />
                                    </div>
                                )}

                                {data.is_external && (
                                    <div>
                                        <InputLabel htmlFor="registration_url" value="Registration URL" />
                                        <TextInput
                                            id="registration_url"
                                            type="url"
                                            name="registration_url"
                                            value={data.registration_url}
                                            className="mt-1 block w-full"
                                            onChange={(e) => setData('registration_url', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.registration_url} className="mt-2" />
                                    </div>
                                )}

                                <div className="flex items-center justify-end mt-6">
                                    <PrimaryButton disabled={processing}>
                                        Update Event
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 