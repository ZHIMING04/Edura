import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { format } from 'date-fns';
import axios from 'axios';

export default function MyEvents({ auth, organizedEvents, enrolledEvents }) {
  const [activeTab, setActiveTab] = useState('organized');
  const [showAttendeesModal, setShowAttendeesModal] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const fetchAttendees = async (eventId) => {
    try {
      const response = await axios.get(route('events.enrolled-users', eventId));
      setAttendees(response.data.users);
      setShowAttendeesModal(true);
    } catch (error) {
      console.error('Error fetching attendees:', error);
    }
  };

  const handleViewAttendees = (event) => {
    setCurrentEvent(event);
    fetchAttendees(event.event_id);
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="My Events" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">My Events</h1>
            <Link href={route('events.create')} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
              Create New Event
            </Link>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('organized')}
                className={`${
                  activeTab === 'organized'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Events I Organize ({organizedEvents?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('enrolled')}
                className={`${
                  activeTab === 'enrolled'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Events I'm Enrolled In ({enrolledEvents?.length || 0})
              </button>
            </nav>
          </div>

          {/* Event Lists */}
          {activeTab === 'organized' && (
            <div>
              {organizedEvents && organizedEvents.length > 0 ? (
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                  <div className="divide-y divide-gray-200">
                    {organizedEvents.map((event) => (
                      <div key={event.event_id} className="p-6">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                          <div className="flex-1 min-w-0">
                            <h2 className="text-xl font-semibold text-gray-900 truncate">{event.title}</h2>
                            <p className="mt-1 text-sm text-gray-500">
                              {formatDate(event.date)} • {event.location}
                            </p>
                            <div className="mt-2 flex items-center">
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(event.status)}`}>
                                {event.status}
                              </span>
                              <span className="ml-4 text-sm text-gray-500">
                                {event.enrolled_count} / {event.max_participants} enrolled
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <Link 
                              href={route('events.edit', event.event_id)} 
                              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Edit
                            </Link>

                            <button 
                              onClick={() => handleViewAttendees(event)}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              View Attendees
                            </button>
                            
                            {event.status === 'Completed' && (
                              <Link 
                                href={route('certificates.create', event.event_id)} 
                                className="inline-flex items-center px-3 py-2 border border-green-500 text-green-500 rounded-md shadow-sm text-sm font-medium hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                Create Certificates
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <p className="text-gray-500">You haven't organized any events yet.</p>
                  <Link 
                    href={route('events.create')} 
                    className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Create Your First Event
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'enrolled' && (
            <div>
              {enrolledEvents && enrolledEvents.length > 0 ? (
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                  <div className="divide-y divide-gray-200">
                    {enrolledEvents.map((event) => (
                      <div key={event.event_id} className="p-6">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                          <div className="flex-1 min-w-0">
                            <h2 className="text-xl font-semibold text-gray-900 truncate">{event.title}</h2>
                            <p className="mt-1 text-sm text-gray-500">
                              {formatDate(event.date)} • {event.location}
                            </p>
                            <div className="mt-2 flex items-center">
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(event.status)}`}>
                                {event.status}
                              </span>
                              <span className="ml-4 text-sm text-gray-500">
                                Organized by: {event.creator?.name || 'Unknown'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            {event.status === 'Upcoming' && (
                              <Link 
                                href={route('events.unenroll', event.event_id)} 
                                method="delete"
                                as="button"
                                className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                Unenroll
                              </Link>
                            )}
                            
                            {event.status === 'Completed' && (
                              <Link 
                                href={route('student.certificates')} 
                                className="inline-flex items-center px-3 py-2 border border-indigo-500 text-indigo-500 rounded-md shadow-sm text-sm font-medium hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                View Certificates
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <p className="text-gray-500">You're not enrolled in any events yet.</p>
                  <Link 
                    href={route('events.index')} 
                    className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Browse Events
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Attendees Modal */}
      {showAttendeesModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {currentEvent?.title} - Attendees
              </h3>
              <button
                onClick={() => setShowAttendeesModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {attendees.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {attendees.map((name, index) => (
                  <li key={index} className="py-3">
                    {name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">No attendees found.</p>
            )}
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}

// Helper function to get status colors
function getStatusClass(status) {
  switch (status) {
    case 'Upcoming':
      return 'bg-blue-100 text-blue-800';
    case 'Ongoing':
      return 'bg-green-100 text-green-800';
    case 'Completed':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
} 