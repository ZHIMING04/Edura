import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';

export default function StudentProfile({ auth }) {
  const student = auth.user.student || {};
  const [editing, setEditing] = useState(false);
  
  const { data, setData, post, processing, errors, reset } = useForm({
    name: auth.user.name || '',
    email: auth.user.email || '',
    matric_no: student.matric_no || '',
    year: student.year || '',
    level: student.level || '',
    gpa: student.gpa || '',
    contact_number: student.contact_number || '',
    bio: student.bio || '',
    faculty: student.faculty || '',
    university: student.university || '',
    major: student.major || '',
    expected_graduate: student.expected_graduate || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('profile.update'), {
      onSuccess: () => {
        setEditing(false);
      }
    });
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Student Profile" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Student Profile
                </h2>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditing(false);
                      reset();
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {!editing ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProfileItem label="Name" value={auth.user.name} />
                    <ProfileItem label="Email" value={auth.user.email} />
                    <ProfileItem label="Matric Number" value={student.matric_no} />
                    <ProfileItem label="Year" value={student.year} />
                    <ProfileItem label="Level" value={student.level} />
                    <ProfileItem label="GPA" value={student.gpa} />
                    <ProfileItem label="Contact Number" value={student.contact_number} />
                    <ProfileItem label="Faculty" value={student.faculty} />
                    <ProfileItem label="University" value={student.university} />
                    <ProfileItem label="Major" value={student.major} />
                    <ProfileItem label="Expected Graduation" value={student.expected_graduate} />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Bio</h3>
                    <p className="text-gray-700">{student.bio || 'No bio provided'}</p>
                  </div>
                  
                  <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Links</h3>
                    <div className="flex space-x-4">
                      <Link 
                        href={route('events.my-events')} 
                        className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition"
                      >
                        My Events
                      </Link>
                      <Link 
                        href={route('projects.index')} 
                        className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition"
                      >
                        My Projects
                      </Link>
                      <Link 
                        href={route('student.certificates')} 
                        className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition"
                      >
                        My Certificates
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <InputLabel htmlFor="name" value="Name" />
                      <TextInput
                        id="name"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                      />
                      <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                      <InputLabel htmlFor="email" value="Email" />
                      <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                      />
                      <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                      <InputLabel htmlFor="matric_no" value="Matric Number" />
                      <TextInput
                        id="matric_no"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.matric_no}
                        onChange={(e) => setData('matric_no', e.target.value)}
                      />
                      <InputError message={errors.matric_no} className="mt-2" />
                    </div>

                    <div>
                      <InputLabel htmlFor="year" value="Year" />
                      <TextInput
                        id="year"
                        type="number"
                        className="mt-1 block w-full"
                        value={data.year}
                        onChange={(e) => setData('year', e.target.value)}
                      />
                      <InputError message={errors.year} className="mt-2" />
                    </div>

                    <div>
                      <InputLabel htmlFor="level" value="Level" />
                      <TextInput
                        id="level"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.level}
                        onChange={(e) => setData('level', e.target.value)}
                      />
                      <InputError message={errors.level} className="mt-2" />
                    </div>

                    <div>
                      <InputLabel htmlFor="gpa" value="GPA" />
                      <TextInput
                        id="gpa"
                        type="number"
                        step="0.01"
                        className="mt-1 block w-full"
                        value={data.gpa}
                        onChange={(e) => setData('gpa', e.target.value)}
                      />
                      <InputError message={errors.gpa} className="mt-2" />
                    </div>

                    <div>
                      <InputLabel htmlFor="contact_number" value="Contact Number" />
                      <TextInput
                        id="contact_number"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.contact_number}
                        onChange={(e) => setData('contact_number', e.target.value)}
                      />
                      <InputError message={errors.contact_number} className="mt-2" />
                    </div>

                    <div>
                      <InputLabel htmlFor="faculty" value="Faculty" />
                      <TextInput
                        id="faculty"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.faculty}
                        onChange={(e) => setData('faculty', e.target.value)}
                      />
                      <InputError message={errors.faculty} className="mt-2" />
                    </div>

                    <div>
                      <InputLabel htmlFor="university" value="University" />
                      <TextInput
                        id="university"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.university}
                        onChange={(e) => setData('university', e.target.value)}
                      />
                      <InputError message={errors.university} className="mt-2" />
                    </div>

                    <div>
                      <InputLabel htmlFor="major" value="Major" />
                      <TextInput
                        id="major"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.major}
                        onChange={(e) => setData('major', e.target.value)}
                      />
                      <InputError message={errors.major} className="mt-2" />
                    </div>

                    <div>
                      <InputLabel htmlFor="expected_graduate" value="Expected Graduation Year" />
                      <TextInput
                        id="expected_graduate"
                        type="number"
                        className="mt-1 block w-full"
                        value={data.expected_graduate}
                        onChange={(e) => setData('expected_graduate', e.target.value)}
                      />
                      <InputError message={errors.expected_graduate} className="mt-2" />
                    </div>
                  </div>

                  <div>
                    <InputLabel htmlFor="bio" value="Bio" />
                    <textarea
                      id="bio"
                      className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                      value={data.bio}
                      onChange={(e) => setData('bio', e.target.value)}
                      rows={4}
                    />
                    <InputError message={errors.bio} className="mt-2" />
                  </div>

                  <div className="flex items-center">
                    <PrimaryButton disabled={processing}>
                      Save Changes
                    </PrimaryButton>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

// Helper component for displaying profile information
function ProfileItem({ label, value }) {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500">{label}</h3>
      <p className="mt-1 text-sm text-gray-900">{value || 'Not provided'}</p>
    </div>
  );
} 