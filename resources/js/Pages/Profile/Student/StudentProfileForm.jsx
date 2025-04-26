import React from 'react';
import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

const FACULTIES = [
    'Faculty of Computing',
    'Faculty of Civil Engineering',
    'Faculty of Electrical Engineering',
    'Faculty of Chemical Engineering',
    'Faculty of Mechanical Engineering',
    'Faculty of Industrial Sciences & Technology',
    'Faculty of Manufacturing Engineering',
    'Faculty of Technology Engineering',
    'Faculty of Business & Communication',
    'Faculty of Industrial Management',
    'Faculty of Applied Sciences',
    'Faculty of Science & Technology',
    'Faculty of Medicine',
    'Faculty of Pharmacy',
    'Faculty of Dentistry',
    'Faculty of Arts & Social Sciences',
    'Faculty of Education',
    'Faculty of Economics & Administration',
    'Faculty of Law',
    'Faculty of Built Environment',
    'Faculty of Agriculture',
    'Faculty of Forestry',
    'Faculty of Veterinary Medicine',
    'Faculty of Islamic Studies',
    'Faculty of Sports Science',
    'Faculty of Creative Technology',
    'Faculty of Music',
    'Faculty of Architecture & Design',
    'Faculty of Hotel & Tourism Management',
    'Faculty of Health Sciences',
    'Faculty of Defence Studies & Management'
];

const UNIVERSITIES = [
    'Universiti Malaysia Pahang',
    'Universiti Malaysia Sabah',
    'Universiti Malaysia Terengganu',
    'Universiti Kebangsaan Malaysia',
    'Universiti Malaya',
    'Universiti Sains Malaysia',
    'Universiti Putra Malaysia',
    'Universiti Teknologi Malaysia',
    'Universiti Utara Malaysia',
    'Universiti Islam Antarabangsa Malaysia',
    'Universiti Pendidikan Sultan Idris',
    'Universiti Sains Islam Malaysia',
    'Universiti Teknologi MARA',
    'Universiti Malaysia Sarawak',
    'Universiti Teknikal Malaysia Melaka',
    'Universiti Malaysia Perlis',
    'Universiti Tun Hussein Onn Malaysia',
    'Universiti Sultan Zainal Abidin',
    'Universiti Pertahanan Nasional Malaysia',
    'Universiti Malaysia Kelantan'
];

const MAJORS = [
    'Computer Science',
    'Engineering',
    'Buisiness',
    'Biology',
    'Arts',
];

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
                        <InputLabel htmlFor="matric_no" value="Matriculation Number" className="text-rose-400 text-2xl" />
                        <TextInput
                            id="matric_no"
                            value={data.matric_no}
                            onChange={(e) => setData('matric_no', e.target.value)}
                            type="text"
                            className="mt-1 block w-full border-yellow-300 rounded-md shadow-sm focus:border-yellow-400 focus:ring focus:ring-yellow-500 focus:ring-opacity-50"
                        />
                        <InputError message={errors.matric_no} className="mt-2" />
                    </div>

                    <div>
                    <InputLabel htmlFor="university" value="University" className="text-rose-400 text-2xl"/>
                        <select
                            id="university"
                            value={data.university}
                            onChange={(e) => setData('university', e.target.value)}
                            className="mt-1 block w-full border-yellow-300 rounded-md shadow-sm focus:border-yellow-400 focus:ring focus:ring-yellow-500 focus:ring-opacity-50"
                        >
                            <option value="">Select University</option>
                            {UNIVERSITIES.map((university) => (
                                <option key={university} value={university}>
                                    {university}
                                </option>
                            ))}
                        </select>

                        <InputError message={errors.university} className="mt-2" />
                    </div>

                    <div>
                    <InputLabel htmlFor="faculty" value="Faculty" className="text-rose-400 text-2xl"/>
                        <select
                            id="faculty"
                            value={data.faculty}
                            onChange={(e) => setData('faculty', e.target.value)}
                             className="mt-1 block w-full border-yellow-300 rounded-md shadow-sm focus:border-yellow-400 focus:ring focus:ring-yellow-500 focus:ring-opacity-50"
                        >
                            <option value="">Select Faculty</option>
                            {FACULTIES.map((faculty) => (
                                <option key={faculty} value={faculty}>
                                    {faculty}
                                </option>
                            ))}
                        </select>

                        <InputError message={errors.faculty} className="mt-2" />
                    </div>

                    <div>
                    <InputLabel htmlFor="major" value="Major" className="text-rose-400 text-2xl"/>
                        <select
                            id="major"
                            value={data.major}
                            onChange={(e) => setData('major', e.target.value)}
                            className="mt-1 block w-full border-yellow-300 rounded-md shadow-sm focus:border-yellow-400 focus:ring focus:ring-yellow-500 focus:ring-opacity-50"
                        >
                            <option value="">Select Major</option>
                                {MAJORS.map((major) => (
                                    <option key={major} value={major}>
                                        {major}
                                    </option>
                                ))
                            }
                        </select>

                        <InputError message={errors.major} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="year" value="Year" className="text-rose-400 text-2xl"/>
                        <TextInput
                            id="year"
                            value={data.year}
                            onChange={(e) => setData('year', e.target.value)}
                            type="number"
                            className="mt-1 block w-full border-yellow-300 rounded-md shadow-sm focus:border-yellow-400 focus:ring focus:ring-yellow-500 focus:ring-opacity-50"
                            min="1"
                        />
                        <InputError message={errors.year} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="level" value="Level of Study" className="text-rose-400 text-2xl"/>
                        <select
                            id="level"
                            value={data.level}
                            onChange={(e) => setData('level', e.target.value)}
                            className="mt-1 block w-full border-yellow-300 rounded-md shadow-sm focus:border-yellow-400 focus:ring focus:ring-yellow-500 focus:ring-opacity-50"
                        >
                            <option value="">Select Level</option>
                            <option value="Undergraduate">Undergraduate</option>
                            <option value="Postgraduate">Postgraduate</option>
                        </select>
                        <InputError message={errors.level} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="gpa" value="GPA" className="text-rose-400 text-2xl"/>
                        <TextInput
                            id="gpa"
                            value={data.gpa}
                            onChange={(e) => setData('gpa', e.target.value)}
                            type="number"
                            step="0.01"
                            className="mt-1 block w-full border-yellow-300 rounded-md shadow-sm focus:border-yellow-400 focus:ring focus:ring-yellow-500 focus:ring-opacity-50"
                            min="0"
                            max="4.0"
                        />
                        <InputError message={errors.gpa} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="expected_graduate" value="Expected Graduation Year" className="text-rose-400 text-2xl"/>
                        <TextInput
                            id="expected_graduate"
                            value={data.expected_graduate}
                            onChange={(e) => setData('expected_graduate', e.target.value)}
                            type="number"
                            className="mt-1 block w-full border-yellow-300 rounded-md shadow-sm focus:border-yellow-400 focus:ring focus:ring-yellow-500 focus:ring-opacity-50"
                            min={new Date().getFullYear()}
                        />
                        <InputError message={errors.expected_graduate} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="contact_number" value="Contact Number" className="text-rose-400 text-2xl"/>
                        <TextInput
                            id="contact_number"
                            value={data.contact_number}
                            onChange={(e) => setData('contact_number', e.target.value)}
                            type="text"
                            className="mt-1 block w-full border-yellow-300 rounded-md shadow-sm focus:border-yellow-400 focus:ring focus:ring-yellow-500 focus:ring-opacity-50"
                        />
                        <InputError message={errors.contact_number} className="mt-2" />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="bio" value="Bio" className="text-rose-400 text-2xl"/>
                    <textarea
                        id="bio"
                        value={data.bio}
                        onChange={(e) => setData('bio', e.target.value)}
                        className="mt-1 block w-full border-yellow-300 rounded-md shadow-sm focus:border-yellow-400 focus:ring focus:ring-yellow-500 focus:ring-opacity-50"
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