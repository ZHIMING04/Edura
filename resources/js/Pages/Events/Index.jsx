import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { format } from 'date-fns';

export default function Index({ auth, events }) {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Events" />

      <div className="py-12 min-h-screen bg-gradient-to-br from-rose-50 to-yellow-50">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold leading-tight text-rose-400">Events</h1>
            <div className="flex gap-4">
              <Link href={route('events.create')} className="px-4 py-2 bg-rose-400 text-white rounded-md hover:bg-rose-700">
                Create Event
              </Link>
              <Link href={route('events.my-events')} className="px-4 py-2 border border-rose-500 text-rose-500 rounded-md hover:bg-rose-50">
                My Events
              </Link>
            </div>
          </div>

          {/* Events List */}
          {events.data.length > 0 ? (
            <div className="space-y-4">
              {events.data.map((event) => (
                <div key={event.event_id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-bold text-rose-500">{event.title}</h2>
                      <p className="mt-1 text-sm text-yellow-500">
                        {formatDate(event.date)} • {event.location}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {event.enrolled_count} / {event.max_participants} enrolled
                      </p>
                    </div>
                    
                    {event.status === 'Upcoming' && !event.is_external && (
                      event.is_enrolled ? (
                        <Link
                          href={route('events.unenroll', event.event_id)}
                          method="delete"
                          as="button"
                          className="px-3 py-1 text-sm border border-red-500 text-red-500 rounded hover:bg-red-50"
                        >
                          Unenroll
                        </Link>
                      ) : (
                        <Link
                          href={route('events.enroll', event.event_id)}
                          method="post"
                          as="button"
                          className="px-3 py-1 text-sm bg-rose-400 text-white rounded hover:bg-rose-700"
                          disabled={event.enrolled_count >= event.max_participants}
                        >
                          {event.enrolled_count >= event.max_participants ? 'Full' : 'Enroll'}
                        </Link>
                      )
                    )}
                  </div>
                  
                  <p className="mt-2 text-rose-300">{event.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-gray-500">No events available.</p>
            </div>
          )}

          {/* Simple Pagination */}
          {events.links && events.links.length > 3 && (
            <div className="mt-6 flex justify-center gap-2">
              {events.links.map((link, i) => (
                <Link
                  key={i}
                  href={link.url}
                  className={`px-3 py-1 rounded ${
                    link.active
                      ? 'bg-rose-400 text-white'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
} 