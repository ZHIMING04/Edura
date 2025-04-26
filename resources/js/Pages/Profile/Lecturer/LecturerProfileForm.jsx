import React from 'react';
import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function LecturerProfileForm({ className = '', user }) {
    const lecturer = user.lecturer || {};
    
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        department: lecturer.department || '',
        specialization: lecturer.specialization || '',
        faculty: lecturer.faculty || '',
        university: lecturer.university || '',
        contact_number: lecturer.contact_number || '',
        bio: lecturer.bio || '',
        linkedin: lecturer.linkedin || '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.lecturer.update'));
    };

    return (
        <section className={className}>
            <form onSubmit={submit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <InputLabel htmlFor="university" value="University" />
                        <select
                            id="university"
                            value={data.university}
                            onChange={(e) => setData('university', e.target.value)}
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
                        <InputError message={errors.university} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="faculty" value="Faculty" />
                        <select
                            id="faculty"
                            value={data.faculty}
                            onChange={(e) => setData('faculty', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        >
                            <option value="">Select Faculty</option>
                            <option value="Faculty of Computing">Faculty of Computing</option>
                            <option value="Faculty of Civil Engineering">Faculty of Civil Engineering</option>
                            <option value="Faculty of Electrical Engineering">Faculty of Electrical Engineering</option>
                            <option value="Faculty of Chemical Engineering">Faculty of Chemical Engineering</option>
                            <option value="Faculty of Mechanical Engineering">Faculty of Mechanical Engineering</option>
                            <option value="Faculty of Industrial Sciences & Technology">Faculty of Industrial Sciences & Technology</option>
                            <option value="Faculty of Manufacturing Engineering">Faculty of Manufacturing Engineering</option>
                            <option value="Faculty of Technology Engineering">Faculty of Technology Engineering</option>
                            <option value="Faculty of Business & Communication">Faculty of Business & Communication</option>
                            <option value="Faculty of Industrial Management">Faculty of Industrial Management</option>
                            <option value="Faculty of Applied Sciences">Faculty of Applied Sciences</option>
                            <option value="Faculty of Science & Technology">Faculty of Science & Technology</option>
                            <option value="Faculty of Medicine">Faculty of Medicine</option>
                            <option value="Faculty of Pharmacy">Faculty of Pharmacy</option>
                            <option value="Faculty of Dentistry">Faculty of Dentistry</option>
                            <option value="Faculty of Arts & Social Sciences">Faculty of Arts & Social Sciences</option>
                            <option value="Faculty of Education">Faculty of Education</option>
                            <option value="Faculty of Economics & Administration">Faculty of Economics & Administration</option>
                            <option value="Faculty of Law">Faculty of Law</option>
                            <option value="Faculty of Built Environment">Faculty of Built Environment</option>
                            <option value="Faculty of Agriculture">Faculty of Agriculture</option>
                            <option value="Faculty of Forestry">Faculty of Forestry</option>
                            <option value="Faculty of Veterinary Medicine">Faculty of Veterinary Medicine</option>
                            <option value="Faculty of Islamic Studies">Faculty of Islamic Studies</option>
                            <option value="Faculty of Sports Science">Faculty of Sports Science</option>
                            <option value="Faculty of Creative Technology">Faculty of Creative Technology</option>
                            <option value="Faculty of Music">Faculty of Music</option>
                            <option value="Faculty of Architecture & Design">Faculty of Architecture & Design</option>
                            <option value="Faculty of Hotel & Tourism Management">Faculty of Hotel & Tourism Management</option>
                            <option value="Faculty of Health Sciences">Faculty of Health Sciences</option>
                            <option value="Faculty of Defence Studies & Management">Faculty of Defence Studies & Management</option>
                        </select>
                        <InputError message={errors.faculty} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="department" value="Department" />
                        <TextInput
                            id="department"
                            value={data.department}
                            onChange={(e) => setData('department', e.target.value)}
                            type="text"
                            className="mt-1 block w-full"
                            required
                        />
                        <InputError message={errors.department} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="specialization" value="Specialization" />
                        <TextInput
                            id="specialization"
                            value={data.specialization}
                            onChange={(e) => setData('specialization', e.target.value)}
                            type="text"
                            className="mt-1 block w-full"
                            required
                        />
                        <InputError message={errors.specialization} className="mt-2" />
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

                    <div>
                        <InputLabel htmlFor="linkedin" value="LinkedIn Profile" />
                        <TextInput
                            id="linkedin"
                            value={data.linkedin}
                            onChange={(e) => setData('linkedin', e.target.value)}
                            type="url"
                            className="mt-1 block w-full"
                            placeholder="https://linkedin.com/in/yourprofile"
                        />
                        <InputError message={errors.linkedin} className="mt-2" />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="bio" value="Bio / Professional Summary" />
                    <textarea
                        id="bio"
                        value={data.bio}
                        onChange={(e) => setData('bio', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        rows="4"
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