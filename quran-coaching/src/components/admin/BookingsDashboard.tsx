import { useBookings } from '../../hooks/useBookings'
import { BookingCard } from '../booking/BookingCard'

export function BookingsDashboard() {
    const { bookings, markCompleted, markNoShow } = useBookings()

    const upcomingBookings = bookings.filter(
        (b) => b.status === 'booked' && new Date(b.start_ts) > new Date()
    )
    const pastBookings = bookings.filter(
        (b) => b.status !== 'booked' || new Date(b.start_ts) <= new Date()
    )

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold mb-4">Upcoming Bookings</h2>
                {upcomingBookings.length === 0 ? (
                    <p className="text-gray-500">No upcoming bookings</p>
                ) : (
                    <div className="grid gap-4">
                        {upcomingBookings.map((booking) => (
                            <BookingCard
                                key={booking.id}
                                booking={booking}
                                isTutor
                                onMarkCompleted={markCompleted}
                                onMarkNoShow={markNoShow}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">Past Bookings</h2>
                {pastBookings.length === 0 ? (
                    <p className="text-gray-500">No past bookings</p>
                ) : (
                    <div className="grid gap-4">
                        {pastBookings.slice(0, 10).map((booking) => (
                            <BookingCard key={booking.id} booking={booking} isTutor />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
