import { useState, useEffect } from 'react'
import { useAvailability, useBookings } from '../../hooks/useBookings'
import { useAuth } from '../../hooks/useAuth'
import { formatTime, getWeekdayName } from '../../lib/utils'
import { addDays, startOfWeek, format, setHours, setMinutes, parse } from 'date-fns'

export function BookingCalendar() {
    const { user } = useAuth()
    const { availability } = useAvailability()
    const { createBooking, bookings, canBookMore } = useBookings()
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selected Slot, setSelectedSlot] = useState<{
        start: Date
        end: Date
        meetingLink: string | null
        tutorId: string
    } | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // Get current week
    const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }))

    // Generate time slots for selected date
    const getTimeSlotsForDate = (date: Date) => {
        const weekday = date.getDay()
        const dayRules = availability.filter((rule) => rule.weekday === weekday && rule.active)

        const slots: Array<{
            start: Date
            end: Date
            meetingLink: string | null
            tutorId: string
        }> = []

        dayRules.forEach((rule) => {
            const startTime = parse(rule.start_time, 'HH:mm:ss', date)
            const endTime = parse(rule.end_time, 'HH:mm:ss', date)

            let currentTime = startTime
            while (currentTime < endTime) {
                const slotEnd = addMinutes(currentTime, rule.slot_minutes)
                if (slotEnd <= endTime) {
                    // Check if slot is in the future
                    if (currentTime > new Date()) {
                        // Check if slot is already booked
                        const isBooked = bookings.some(
                            (booking) =>
                                booking.status === 'booked' &&
                                new Date(booking.start_ts).getTime() === currentTime.getTime()
                        )

                        if (!isBooked) {
                            slots.push({
                                start: currentTime,
                                end: slotEnd,
                                meetingLink: rule.meeting_link,
                                tutorId: rule.tutor_id,
                            })
                        }
                    }
                }
                currentTime = slotEnd
            }
        })

        return slots
    }

    const handleBooking = async () => {
        if (!selectedSlot || !user) return

        setLoading(true)
        setError('')
        setSuccess('')

        try {
            await createBooking(
                selectedSlot.tutorId,
                selectedSlot.start,
                selectedSlot.end,
                selectedSlot.meetingLink
            )
            setSuccess('Session booked successfully!')
            setSelectedSlot(null)
            setSelectedDate(null)
        } catch (err: any) {
            setError(err.message || 'Failed to book session')
        } finally {
            setLoading(false)
        }
    }

    const addMinutes = (date: Date, minutes: number) => {
        return new Date(date.getTime() + minutes * 60000)
    }

    const availableSlots = selectedDate ? getTimeSlotsForDate(selectedDate) : []

    return (
        <div className="space-y-6">
            {!canBookMore && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                    You have completed all 101 sessions. No more bookings can be made.
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                    {success}
                </div>
            )}

            {/* Week Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setWeekStart(addDays(weekStart, -7))}
                    className="btn-ghost"
                >
                    ← Previous Week
                </button>
                <span className="font-medium">
                    {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
                </span>
                <button
                    onClick={() => setWeekStart(addDays(weekStart, 7))}
                    className="btn-ghost"
                >
                    Next Week →
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 7 }).map((_, index) => {
                    const date = addDays(weekStart, index)
                    const isSelected = selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                    const hasAvailability = availability.some((rule) => rule.weekday === date.getDay())

                    return (
                        <button
                            key={index}
                            onClick={() => setSelectedDate(date)}
                            disabled={!hasAvailability || !canBookMore}
                            className={`p-4 rounded-lg border-2 transition-all ${isSelected
                                    ? 'border-primary-500 bg-primary-50'
                                    : hasAvailability && canBookMore
                                        ? 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                                        : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                                }`}
                        >
                            <div className="text-sm text-gray-600">{format(date, 'EEE')}</div>
                            <div className="text-2xl font-bold text-gray-900">{format(date, 'd')}</div>
                        </button>
                    )
                })}
            </div>

            {/* Time Slots */}
            {selectedDate && (
                <div className="card">
                    <h3 className="text-lg font-semibold mb-4">
                        Available Times for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </h3>

                    {availableSlots.length === 0 ? (
                        <p className="text-gray-600">No available time slots for this day.</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {availableSlots.map((slot, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`p-3 rounded-lg border-2 transition-all ${selectedSlot === slot
                                            ? 'border-primary-500 bg-primary-50'
                                            : 'border-gray-200 hover:border-primary-300'
                                        }`}
                                >
                                    <div className="font-medium">{format(slot.start, 'h:mm a')}</div>
                                    <div className="text-sm text-gray-600">45 min</div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Booking Confirmation */}
            {selectedSlot && (
                <div className="card bg-primary-50 border-primary-200">
                    <h3 className="text-lg font-semibold mb-4">Confirm Your Booking</h3>
                    <div className="space-y-2 mb-4">
                        <p>
                            <strong>Date:</strong> {format(selectedSlot.start, 'EEEE, MMMM d, yyyy')}
                        </p>
                        <p>
                            <strong>Time:</strong> {format(selectedSlot.start, 'h:mm a')} - {format(selectedSlot.end, 'h:mm a')}
                        </p>
                        <p>
                            <strong>Duration:</strong> 45 minutes
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleBooking} disabled={loading} className="btn-primary">
                            {loading ? 'Booking...' : 'Confirm Booking'}
                        </button>
                        <button onClick={() => setSelectedSlot(null)} className="btn-ghost">
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
