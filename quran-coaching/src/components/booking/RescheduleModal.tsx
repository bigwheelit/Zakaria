// Placeholder for RescheduleModal - simplified version
import { useState } from 'react'

interface RescheduleModalProps {
    bookingId: string
    currentStart: string
    onClose: () => void
    onReschedule: (bookingId: string, newStart: Date, newEnd: Date) => Promise<void>
}

export function RescheduleModal({ bookingId, currentStart, onClose, onReschedule }: RescheduleModalProps) {
    const [loading, setLoading] = useState(false)

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="card max-w-md">
                <h2 className="text-xl font-bold mb-4">Reschedule Booking</h2>
                <p className="text-gray-600 mb-4">
                    To reschedule, please cancel this booking and create a new one with your preferred time.
                    This ensures you select from currently available slots.
                </p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="btn-primary">
                        Got it
                    </button>
                </div>
            </div>
        </div>
    )
}
