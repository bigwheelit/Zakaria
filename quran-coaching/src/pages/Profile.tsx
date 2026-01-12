import { useState, FormEvent } from 'react'
import { useAuth } from '../hooks/useAuth'

export function Profile() {
    const { profile, updateProfile } = useAuth()
    const [formData, setFormData] = useState({
        name: profile?.name || '',
        timezone: profile?.timezone || '',
        whatsapp: profile?.whatsapp || '',
    })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess(false)

        try {
            await updateProfile(formData)
            setSuccess(true)
        } catch (err: any) {
            setError(err.message || 'Failed to update profile')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="section-padding">
            <div className="container-custom max-w-2xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1>

                <div className="card">
                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4">
                            Profile updated successfully!
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="label">Full Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="input"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">Timezone</label>
                            <input
                                type="text"
                                value={formData.timezone}
                                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                                className="input"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">WhatsApp Number (Optional)</label>
                            <input
                                type="tel"
                                value={formData.whatsapp}
                                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                className="input"
                                placeholder="+1 234 567 8900"
                            />
                        </div>

                        <div className="pt-4">
                            <button type="submit" disabled={loading} className="btn-primary">
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
