import { formatDateTime } from '../../lib/utils'
import { Database } from '../../types/database.types'

type Booking = Database['public']['Tables']['bookings']['Row']

interface BookingCardProps {
    booking: Booking & {
        student_profile?: { name: string }
        tutor_profile?: { name: string }
    }
    onCancel?: (id: string) => void
    onReschedule?: (id: string) => void
    onMarkCompleted?: (id: string) => void
    onMarkNoShow?: (id: string) => void
    isTutor?: boolean
}

export function BookingCard({
    booking,
    onCancel,
    onReschedule,
    onMarkCompleted,
    onMarkNoShow,
    isTutor,
}: BookingCardProps) {
    const isPast = new Date(booking.start_ts) < new Date()
    const canModify = !isPast && booking.status === 'booked'

    const statusColors = {
        booked: 'badge-info',
        completed: 'badge-success',
        canceled: 'badge-error',
        no_show: 'badge-warning',
    }

    return (
        <div className="card">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {formatDateTime(booking.start_ts)}
                    </h3>
                    <p className="text-sm text-gray-600">
                        {isTutor
                            ? `Student: ${booking.student_profile?.name || 'Unknown'}`
                            : `Tutor: ${booking.tutor_profile?.name || 'Unknown'}`}
                    </p>
                </div>
                <span className={`badge ${statusColors[booking.status]}`}>
                    {booking.status.replace('_', ' ').toUpperCase()}
                </span>
            </div>

            {booking.meeting_link && (
                <div className="mb-4">
                    <a
                        href={booking.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                        Join Meeting →
                    </a>
                </div>
            )}

            {booking.notes && (
                <p className="text-sm text-gray-600 mb-4">{booking.notes}</p>
            )}

            <div className="flex gap-2 flex-wrap">
                {!isTutor && canModify && onReschedule && (
                    <button
                        onClick={() => onReschedule(booking.id)}
                        className="btn-outline text-sm"
                    >
                        Reschedule
                    </button>
                )}
                {!isTutor && canModify && onCancel && (
                    <button
                        onClick={() => onCancel(booking.id)}
                        className="btn-ghost text-sm text-red-600 hover:bg-red-50"
                    >
                        Cancel
                    </button>
                )}
                {isTutor && booking.status === 'booked' && onMarkCompleted && (
                    <button
                        onClick={() => onMarkCompleted(booking.id)}
                        className="btn-primary text-sm"
                    >
                        Mark Completed
                    </button>
                )}
                {isTutor && booking.status === 'booked' && onMarkNoShow && (
                    <button
                        onClick={() => onMarkNoShow(booking.id)}
                        className="btn-ghost text-sm"
                    >
                        Mark No-Show
                    </button>
                )}
            </div>
        </div>
    )
}
