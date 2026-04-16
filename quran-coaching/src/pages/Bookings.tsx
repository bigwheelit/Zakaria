import { useState } from 'react'
import { useBookings } from '../hooks/useBookings'
import { BookingCalendar } from '../components/booking/BookingCalendar'
import { BookingCard } from '../components/booking/BookingCard'
import { RescheduleModal } from '../components/booking/RescheduleModal'

export function Bookings() {
    const { bookings, cancelBooking, rescheduleBooking, completedCount, maxSessions } = useBookings()
    const [activeTab, setActiveTab] = useState<'new' | 'upcoming' | 'past'>('new')
    const [reschedulingId, setReschedulingId] = useState<string | null>(null)

    const upcomingBookings = bookings.filter(
        (b) => b.status === 'booked' && new Date(b.start_ts) > new Date()
    )

    const pastBookings = bookings.filter(
        (b) => b.status !== 'booked' || new Date(b.start_ts) <= new Date()
    )

    const reschedulingBooking = reschedulingId
        ? bookings.find(b => b.id === reschedulingId) ?? null
        : null

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
                    {(['new', 'upcoming', 'past'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 px-4 font-medium transition-colors capitalize ${
                                activeTab === tab
                                    ? 'border-b-2 border-primary-500 text-primary-600'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            {tab === 'new'
                                ? 'Book New Session'
                                : tab === 'upcoming'
                                    ? `Upcoming (${upcomingBookings.length})`
                                    : 'Past Sessions'}
                        </button>
                    ))}
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
                                    onReschedule={(id) => setReschedulingId(id)}
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

            {/* Reschedule Modal */}
            {reschedulingBooking && (
                <RescheduleModal
                    bookingId={reschedulingBooking.id}
                    currentStart={reschedulingBooking.start_ts}
                    onClose={() => setReschedulingId(null)}
                    onReschedule={rescheduleBooking}
                />
            )}
        </div>
    )
}
