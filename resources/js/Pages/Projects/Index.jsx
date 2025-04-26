import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { format } from 'date-fns';

export default function Index({ auth, projects }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="My Projects" />

      <div className="py-12 min-h-screen bg-gradient-to-br from-rose-50 to-yellow-50">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold leading-tight text-rose-400">My Projects</h1>
            <Link href={route('projects.create')} className="px-4 py-2 bg-rose-400 text-white rounded-md hover:bg-rose-700">
              Create New Project
            </Link>
          </div>

          {/* Projects List */}
          {projects.length > 0 ? (
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-bold text-rose-400">{project.title}</h2>
                      <p className="mt-1 text-sm text-yellow-400">Status: {project.status}</p>
                    </div>
                    <Link 
                      href={route('projects.show', project.id)} 
                      className="px-3 py-1 text-sm bg-rose-400 text-white rounded hover:bg-rose-400"
                    >
                      View
                    </Link>
                  </div>
                  
                  <p className="mt-2 text-rose-400">{project.description}</p>
                  
                  <div className="mt-3 text-sm text-yellow-400">
                    <p>Start: {formatDate(project.start_date)}</p>
                    <p>End: {formatDate(project.expected_end_date)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-500">No projects found.</p>
              <Link
                href={route('projects.create')}
                className="mt-4 inline-block px-4 py-2 bg-rose-400 text-white rounded-md hover:bg-rose-400"
              >
                Create Your First Project
              </Link>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
} 