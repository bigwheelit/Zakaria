import { useState } from 'react'
import { addDays, format, parse, startOfWeek } from 'date-fns'
import { useAvailability, useBookings } from '../../hooks/useBookings'

interface RescheduleModalProps {
    bookingId: string
    currentStart: string
    onClose: () => void
    onReschedule: (bookingId: string, newStart: Date, newEnd: Date) => Promise<unknown>
}

export function RescheduleModal({ bookingId, currentStart, onClose, onReschedule }: RescheduleModalProps) {
    const { availability } = useAvailability()
    const { bookings } = useBookings()
    const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }))
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const addMinutes = (date: Date, minutes: number) =>
        new Date(date.getTime() + minutes * 60000)

    const getTimeSlotsForDate = (date: Date) => {
        const weekday = date.getDay()
        const dayRules = availability.filter(r => r.weekday === weekday && r.active)
        const slots: { start: Date; end: Date }[] = []

        dayRules.forEach(rule => {
            const startTime = parse(rule.start_time, 'HH:mm:ss', date)
            const endTime = parse(rule.end_time, 'HH:mm:ss', date)
            let currentTime = startTime

            while (currentTime < endTime) {
                const slotEnd = addMinutes(currentTime, rule.slot_minutes)
                if (slotEnd <= endTime && currentTime > new Date()) {
                    // Exclude slots already booked by anyone, EXCEPT the booking we're rescheduling
                    const isBooked = bookings.some(
                        b =>
                            b.status === 'booked' &&
                            b.id !== bookingId &&
                            new Date(b.start_ts).getTime() === currentTime.getTime()
                    )
                    if (!isBooked) {
                        slots.push({ start: new Date(currentTime), end: new Date(slotEnd) })
                    }
                }
                currentTime = slotEnd
            }
        })

        return slots
    }

    const handleConfirm = async () => {
        if (!selectedSlot) return
        setLoading(true)
        setError('')
        try {
            await onReschedule(bookingId, selectedSlot.start, selectedSlot.end)
            onClose()
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to reschedule'
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    const availableSlots = selectedDate ? getTimeSlotsForDate(selectedDate) : []

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-xl font-bold text-gray-900">Reschedule Session</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-3xl leading-none transition-colors"
                            aria-label="Close"
                        >
                            ×
                        </button>
                    </div>

                    <p className="text-sm text-gray-500 mb-5">
                        Moving from:{' '}
                        <span className="font-semibold text-gray-700">
                            {format(new Date(currentStart), 'EEEE, MMMM d, yyyy · h:mm a')}
                        </span>
                    </p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Week navigation */}
                    <div className="flex items-center justify-between mb-3">
                        <button
                            onClick={() => { setWeekStart(addDays(weekStart, -7)); setSelectedDate(null); setSelectedSlot(null) }}
                            className="btn-ghost text-sm px-3 py-2"
                        >
                            ← Prev
                        </button>
                        <span className="text-sm font-medium text-gray-700">
                            {format(weekStart, 'MMM d')} – {format(addDays(weekStart, 6), 'MMM d, yyyy')}
                        </span>
                        <button
                            onClick={() => { setWeekStart(addDays(weekStart, 7)); setSelectedDate(null); setSelectedSlot(null) }}
                            className="btn-ghost text-sm px-3 py-2"
                        >
                            Next →
                        </button>
                    </div>

                    {/* Day grid */}
                    <div className="grid grid-cols-7 gap-1 mb-5">
                        {Array.from({ length: 7 }).map((_, i) => {
                            const date = addDays(weekStart, i)
                            const isPast = date < new Date(new Date().setHours(0, 0, 0, 0))
                            const hasAvail = !isPast && availability.some(r => r.weekday === date.getDay() && r.active)
                            const isSelected =
                                selectedDate !== null &&
                                format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')

                            return (
                                <button
                                    key={i}
                                    onClick={() => { setSelectedDate(date); setSelectedSlot(null) }}
                                    disabled={!hasAvail}
                                    className={`p-2 rounded-lg border-2 text-center transition-all ${
                                        isSelected
                                            ? 'border-primary-500 bg-primary-50'
                                            : hasAvail
                                                ? 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                                                : 'border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed'
                                    }`}
                                >
                                    <div className="text-xs text-gray-500">{format(date, 'EEE')}</div>
                                    <div className="text-base font-bold text-gray-900">{format(date, 'd')}</div>
                                </button>
                            )
                        })}
                    </div>

                    {/* Time slots */}
                    {selectedDate && (
                        <div className="mb-5">
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">
                                Available times for {format(selectedDate, 'EEEE, MMMM d')}
                            </h3>
                            {availableSlots.length === 0 ? (
                                <p className="text-sm text-gray-500 italic">No available slots this day.</p>
                            ) : (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                    {availableSlots.map((slot, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedSlot(slot)}
                                            className={`p-2 rounded-lg border-2 text-sm font-medium transition-all ${
                                                selectedSlot?.start.getTime() === slot.start.getTime()
                                                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                                                    : 'border-gray-200 hover:border-primary-300 text-gray-700'
                                            }`}
                                        >
                                            {format(slot.start, 'h:mm a')}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Selected slot confirmation */}
                    {selectedSlot && (
                        <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 mb-5 text-sm">
                            <span className="font-medium text-primary-800">New time: </span>
                            <span className="text-primary-700">
                                {format(selectedSlot.start, 'EEEE, MMMM d, yyyy · h:mm a')}
                            </span>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button onClick={onClose} className="btn-ghost flex-1">
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={!selectedSlot || loading}
                            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Rescheduling…' : 'Confirm New Time'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
