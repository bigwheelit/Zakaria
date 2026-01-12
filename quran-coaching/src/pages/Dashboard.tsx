import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useBookings } from '../hooks/useBookings'

export function Dashboard() {
    const { profile } = useAuth()
    const { bookings, completedCount, maxSessions } = useBookings()

    const upcomingBookings = bookings
        .filter((b) => b.status === 'booked' && new Date(b.start_ts) > new Date())
        .slice(0, 3)

    const progressPercentage = (completedCount / maxSessions) * 100

    return (
        <div className="section-padding">
            <div className="container-custom max-w-6xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Welcome back, {profile?.name}!
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Progress Card */}
                    <div className="card md:col-span-2">
                        <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
                        <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Completed Sessions</span>
                                <span>{completedCount} / {maxSessions}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4">
                                <div
                                    className="bg-primary-500 h-4 rounded-full transition-all duration-500"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                        </div>
                        <p className="text-gray-600">
                            {maxSessions - completedCount} sessions remaining in your journey
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="card">
                        <h3 className="text-lg font-semibold mb-3">Quick Stats</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Upcoming</span>
                                <span className="font-semibold">{upcomingBookings.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Completed</span>
                                <span className="font-semibold">{completedCount}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upcoming Sessions */}
                <div className="card mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Upcoming Sessions</h2>
                        <Link to="/bookings" className="text-primary-600 hover:text-primary-700 font-medium">
                            View All →
                        </Link>
                    </div>

                    {upcomingBookings.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600 mb-4">No upcoming sessions scheduled</p>
                            <Link to="/bookings" className="btn-primary">
                                Book a Session
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {upcomingBookings.map((booking) => (
                                <div key={booking.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium">{new Date(booking.start_ts).toLocaleDateString()}</p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(booking.start_ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    {booking.meeting_link && (
                                        <a
                                            href={booking.meeting_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-outline text-sm"
                                        >
                                            Join Meeting
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link to="/bookings" className="card hover:shadow-md transition-shadow text-center">
                        <div className="text-primary-500 mb-2">
                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">Book a Session</h3>
                        <p className="text-sm text-gray-600 mt-1">Schedule your next learning session</p>
                    </Link>

                    <Link to="/messages" className="card hover:shadow-md transition-shadow text-center">
                        <div className="text-primary-500 mb-2">
                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">Messages</h3>
                        <p className="text-sm text-gray-600 mt-1">Chat with your tutor</p>
                    </Link>

                    <Link to="/profile" className="card hover:shadow-md transition-shadow text-center">
                        <div className="text-primary-500 mb-2">
                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">Profile</h3>
                        <p className="text-sm text-gray-600 mt-1">Update your information</p>
                    </Link>
                </div>
            </div>
        </div>
    )
}
