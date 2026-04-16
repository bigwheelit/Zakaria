import { formatDateTime } from '../../lib/utils'
import { Database } from '../../types/database.types'

type Booking = Database['public']['Tables']['bookings']['Row']

interface BookingCardProps {
    booking: Booking & {
        student_profile?: { name: string; whatsapp?: string | null }
        tutor_profile?: { name: string }
    }
    onCancel?: (id: string) => void
    onReschedule?: (id: string) => void
    onMarkCompleted?: (id: string) => void
    onMarkNoShow?: (id: string) => void
    isTutor?: boolean
}

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000

export function BookingCard({
    booking,
    onCancel,
    onReschedule,
    onMarkCompleted,
    onMarkNoShow,
    isTutor,
}: BookingCardProps) {
    const sessionStart = new Date(booking.start_ts)
    const now = new Date()
    const isPast = sessionStart < now
    const isBooked = booking.status === 'booked'
    const hoursUntilSession = (sessionStart.getTime() - now.getTime()) / (1000 * 60 * 60)
    // Students can only modify if > 24 hours away and session is upcoming
    const withinNoticeWindow = sessionStart.getTime() - now.getTime() < TWENTY_FOUR_HOURS_MS
    const canModify = !isPast && isBooked && !withinNoticeWindow

    const statusColors: Record<Booking['status'], string> = {
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

            {/* 24-hour notice warning for upcoming bookings inside window */}
            {!isTutor && isBooked && !isPast && withinNoticeWindow && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-2 rounded-lg mb-3">
                    ⏰ This session is within 24 hours and can no longer be modified.
                </div>
            )}

            {/* Time remaining for upcoming bookings */}
            {!isPast && isBooked && !withinNoticeWindow && (
                <p className="text-xs text-gray-400 mb-3">
                    {hoursUntilSession > 48
                        ? `${Math.floor(hoursUntilSession / 24)} days away`
                        : `${Math.floor(hoursUntilSession)}h away`}
                </p>
            )}

            <div className="flex gap-2 flex-wrap">
                {/* Student actions */}
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

                {/* Tutor actions */}
                {isTutor && isBooked && onMarkCompleted && (
                    <button
                        onClick={() => onMarkCompleted(booking.id)}
                        className="btn-primary text-sm"
                    >
                        Mark Completed
                    </button>
                )}
                {isTutor && isBooked && onMarkNoShow && (
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
