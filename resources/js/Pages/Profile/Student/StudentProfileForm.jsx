import React from 'react';
import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function StudentProfileForm({ className = '', user }) {
    const student = user.student || {};
    
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        matric_no: student.matric_no || '',
        year: student.year || '',
        level: student.level || '',
        gpa: student.gpa || '',
        contact_number: student.contact_number || '',
        bio: student.bio || '',
        faculty: student.faculty || '',
        university: student.university || '',
        major: student.major || '',
        expected_graduate: student.expected_graduate || '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.student.update'));
    };

    return (
        <section className={className}>
            <form onSubmit={submit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <InputLabel htmlFor="matric_no" value="Matriculation Number" />
                        <TextInput
                            id="matric_no"
                            value={data.matric_no}
                            onChange={(e) => setData('matric_no', e.target.value)}
                            type="text"
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.matric_no} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="university" value="University" />
                        <TextInput
                            id="university"
                            value={data.university}
                            onChange={(e) => setData('university', e.target.value)}
                            type="text"
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.university} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="faculty" value="Faculty" />
                        <TextInput
                            id="faculty"
                            value={data.faculty}
                            onChange={(e) => setData('faculty', e.target.value)}
                            type="text"
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.faculty} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="major" value="Major" />
                        <TextInput
                            id="major"
                            value={data.major}
                            onChange={(e) => setData('major', e.target.value)}
                            type="text"
                            className="mt-1 block w-full"
                        />
                        <InputError message={errors.major} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="year" value="Year" />
                        <TextInput
                            id="year"
                            value={data.year}
                            onChange={(e) => setData('year', e.target.value)}
                            type="number"
                            className="mt-1 block w-full"
                            min="1"
                        />
                        <InputError message={errors.year} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="level" value="Level of Study" />
                        <select
                            id="level"
                            value={data.level}
                            onChange={(e) => setData('level', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            <option value="">Select Level</option>
                            <option value="Undergraduate">Undergraduate</option>
                            <option value="Postgraduate">Postgraduate</option>
                            <option value="PhD">PhD</option>
                        </select>
                        <InputError message={errors.level} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="gpa" value="GPA" />
                        <TextInput
                            id="gpa"
                            value={data.gpa}
                            onChange={(e) => setData('gpa', e.target.value)}
                            type="number"
                            step="0.01"
                            className="mt-1 block w-full"
                            min="0"
                            max="4.0"
                        />
                        <InputError message={errors.gpa} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="expected_graduate" value="Expected Graduation Year" />
                        <TextInput
                            id="expected_graduate"
                            value={data.expected_graduate}
                            onChange={(e) => setData('expected_graduate', e.target.value)}
                            type="number"
                            className="mt-1 block w-full"
                            min={new Date().getFullYear()}
                        />
                        <InputError message={errors.expected_graduate} className="mt-2" />
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
                    <InputLabel htmlFor="bio" value="Bio" />
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