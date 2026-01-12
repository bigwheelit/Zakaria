import { useBookings } from '../hooks/useBookings'
import { BookingCalendar } from '../components/booking/BookingCalendar'
import { BookingCard } from '../components/booking/BookingCard'
import { useState } from 'react'

export function Bookings() {
    const { bookings, cancelBooking, completedCount, maxSessions } = useBookings()
    const [activeTab, setActiveTab] = useState<'new' | 'upcoming' | 'past'>('new')

    const upcomingBookings = bookings.filter(
        (b) => b.status === 'booked' && new Date(b.start_ts) > new Date()
    )

    const pastBookings = bookings.filter(
        (b) => b.status !== 'booked' || new Date(b.start_ts) <= new Date()
    )

    return (
        <div className="section-padding">
            <div className="container-custom max-w-6xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
                    <p className="text-gray-600">
                        Progress: {completedCount} / {maxSessions} sessions completed
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('new')}
                        className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'new'
                                ? 'border-b-2 border-primary-500 text-primary-600'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Book New Session
                    </button>
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'upcoming'
                                ? 'border-b-2 border-primary-500 text-primary-600'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Upcoming ({upcomingBookings.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('past')}
                        className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'past'
                                ? 'border-b-2 border-primary-500 text-primary-600'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Past Sessions
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'new' && (
                    <div className="card">
                        <h2 className="text-xl font-semibold mb-6">Book a New Session</h2>
                        <BookingCalendar />
                    </div>
                )}

                {activeTab === 'upcoming' && (
                    <div className="space-y-4">
                        {upcomingBookings.length === 0 ? (
                            <div className="card text-center py-8">
                                <p className="text-gray-600">No upcoming bookings</p>
                            </div>
                        ) : (
                            upcomingBookings.map((booking) => (
                                <BookingCard
                                    key={booking.id}
                                    booking={booking}
                                    onCancel={cancelBooking}
                                />
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'past' && (
                    <div className="space-y-4">
                        {pastBookings.length === 0 ? (
                            <div className="card text-center py-8">
                                <p className="text-gray-600">No past bookings</p>
                            </div>
                        ) : (
                            pastBookings.map((booking) => (
                                <BookingCard key={booking.id} booking={booking} />
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
