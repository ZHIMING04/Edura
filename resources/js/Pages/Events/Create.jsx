import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { format } from 'date-fns';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        location: '',
        max_participants: '',
        is_external: false,
        registration_url: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('events.store'));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Create Event" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-2xl font-semibold mb-6">Create New Event</h2>
                            
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
                                        Create Event
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