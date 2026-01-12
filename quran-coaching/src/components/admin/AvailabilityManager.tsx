import { useState, FormEvent } from 'react'
import { useAvailability } from '../../hooks/useBookings'
import { useAuth } from '../../hooks/useAuth'
import { getWeekdayName } from '../../lib/utils'

export function AvailabilityManager() {
    const { user } = useAuth()
    const { availability, createAvailabilityRule, deleteAvailabilityRule } = useAvailability()
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        weekday: 0,
        start_time: '09:00',
        end_time: '17:00',
        meeting_link: '',
    })

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!user) return

        try {
            await createAvailabilityRule({
                tutor_id: user.id,
                weekday: formData.weekday,
                start_time: formData.start_time + ':00',
                end_time: formData.end_time + ':00',
                slot_minutes: 45,
                meeting_link: formData.meeting_link || null,
                active: true,
            })
            setShowForm(false)
            setFormData({ weekday: 0, start_time: '09:00', end_time: '17:00', meeting_link: '' })
        } catch (error) {
            console.error('Failed to create availability rule:', error)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Manage Availability</h2>
                <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                    {showForm ? 'Cancel' : 'Add Availability'}
                </button>
            </div>

            {showForm && (
                <div className="card">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="label">Day of Week</label>
                            <select
                                value={formData.weekday}
                                onChange={(e) => setFormData({ ...formData, weekday: parseInt(e.target.value) })}
                                className="input"
                            >
                                {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                                    <option key={day} value={day}>
                                        {getWeekdayName(day)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="label">Start Time</label>
                                <input
                                    type="time"
                                    value={formData.start_time}
                                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                    className="input"
                                    required
                                />
                            </div>
                            <div>
                                <label className="label">End Time</label>
                                <input
                                    type="time"
                                    value={formData.end_time}
                                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                    className="input"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">Meeting Link (Optional)</label>
                            <input
                                type="url"
                                value={formData.meeting_link}
                                onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })}
                                className="input"
                                placeholder="https://zoom.us/j/..."
                            />
                        </div>

                        <button type="submit" className="btn-primary">
                            Save Availability
                        </button>
                    </form>
                </div>
            )}

            <div className="space-y-3">
                {availability.map((rule) => (
                    <div key={rule.id} className="card flex justify-between items-center">
                        <div>
                            <h3 className="font-semibold">{getWeekdayName(rule.weekday)}</h3>
                            <p className="text-sm text-gray-600">
                                {rule.start_time.slice(0, 5)} - {rule.end_time.slice(0, 5)} ({rule.slot_minutes} min sessions)
                            </p>
                            {rule.meeting_link && (
                                <a
                                    href={rule.meeting_link}
                                    className="text-sm text-primary-600"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Meeting Link
                                </a>
                            )}
                        </div>
                        <button
                            onClick={() => deleteAvailabilityRule(rule.id)}
                            className="btn-ghost text-red-600"
                        >
                            Remove
                        </button>
                    </div>
                ))}

                {availability.length === 0 && !showForm && (
                    <p className="text-gray-500 text-center">No availability rules set. Add one to get started.</p>
                )}
            </div>
        </div>
    )
}
