import React from 'react';
import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function UniversityProfileForm({ className = '', user }) {
    const university = user.university || {};
    
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: university.name || '',
        location: university.location || '',
        contact_email: university.contact_email || '',
        website: university.website || '',
        contact_number: university.contact_number || '',
        bio: university.bio || '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.university.update'));
    };

    return (
        <section className={className}>
            <form onSubmit={submit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <InputLabel htmlFor="name" value="Institution Name" />
                        <select
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        >
                            <option value="">Select University</option>
                            <option value="Universiti Malaysia Pahang">Universiti Malaysia Pahang</option>
                            <option value="Universiti Malaysia Sabah">Universiti Malaysia Sabah</option>
                            <option value="Universiti Malaysia Terengganu">Universiti Malaysia Terengganu</option>
                            <option value="Universiti Kebangsaan Malaysia">Universiti Kebangsaan Malaysia</option>
                            <option value="Universiti Malaya">Universiti Malaya</option>
                            <option value="Universiti Sains Malaysia">Universiti Sains Malaysia</option>
                            <option value="Universiti Putra Malaysia">Universiti Putra Malaysia</option>
                            <option value="Universiti Teknologi Malaysia">Universiti Teknologi Malaysia</option>
                            <option value="Universiti Utara Malaysia">Universiti Utara Malaysia</option>
                            <option value="Universiti Islam Antarabangsa Malaysia">Universiti Islam Antarabangsa Malaysia</option>
                            <option value="Universiti Pendidikan Sultan Idris">Universiti Pendidikan Sultan Idris</option>
                            <option value="Universiti Sains Islam Malaysia">Universiti Sains Islam Malaysia</option>
                            <option value="Universiti Teknologi MARA">Universiti Teknologi MARA</option>
                            <option value="Universiti Malaysia Sarawak">Universiti Malaysia Sarawak</option>
                            <option value="Universiti Teknikal Malaysia Melaka">Universiti Teknikal Malaysia Melaka</option>
                            <option value="Universiti Malaysia Perlis">Universiti Malaysia Perlis</option>
                            <option value="Universiti Tun Hussein Onn Malaysia">Universiti Tun Hussein Onn Malaysia</option>
                            <option value="Universiti Sultan Zainal Abidin">Universiti Sultan Zainal Abidin</option>
                            <option value="Universiti Pertahanan Nasional Malaysia">Universiti Pertahanan Nasional Malaysia</option>
                            <option value="Universiti Malaysia Kelantan">Universiti Malaysia Kelantan</option>
                        </select>
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="location" value="Location" />
                        <TextInput
                            id="location"
                            value={data.location}
                            onChange={(e) => setData('location', e.target.value)}
                            type="text"
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.location} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="contact_email" value="Contact Email" />
                        <TextInput
                            id="contact_email"
                            value={data.contact_email}
                            onChange={(e) => setData('contact_email', e.target.value)}
                            type="email"
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.contact_email} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="website" value="Website" />
                        <TextInput
                            id="website"
                            value={data.website}
                            onChange={(e) => setData('website', e.target.value)}
                            type="url"
                            className="mt-1 block w-full"
                            placeholder="https://www.university.edu"
                        />
                        <InputError message={errors.website} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="contact_number" value="Contact Number" />
                        <TextInput
                            id="contact_number"
                            value={data.contact_number}
                            onChange={(e) => setData('contact_number', e.target.value)}
                            type="text"
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.contact_number} className="mt-2" />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="bio" value="About Institution" />
                    <textarea
                        id="bio"
                        value={data.bio}
                        onChange={(e) => setData('bio', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        rows="4"
                        placeholder="A brief description of the university, its programs, and facilities"
                    ></textarea>
                    <InputError message={errors.bio} className="mt-2" />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    {recentlySuccessful && (
                        <p className="text-sm text-gray-600">Saved.</p>
                    )}
                </div>
            </form>
        </section>
    );
} 