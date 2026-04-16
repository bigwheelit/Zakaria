import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function SignupForm() {
    const navigate = useNavigate()
    const { signUp } = useAuth()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone)
    const [whatsapp, setWhatsapp] = useState('')
    const [error, setError] = useState('')
    const [pendingConfirmation, setPendingConfirmation] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const data = await signUp(email, password, name, timezone, whatsapp || undefined)

            if (data.session) {
                // Email confirmation is disabled — user is immediately signed in
                navigate('/dashboard')
            } else {
                // Email confirmation is enabled — ask user to check their inbox
                setPendingConfirmation(true)
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to create account'
            setError(msg)
        } finally {
            setLoading(false)
        }
    }

    // Email confirmation pending state
    if (pendingConfirmation) {
        return (
            <div className="w-full max-w-md mx-auto">
                <div className="card text-center">
                    <div className="text-5xl mb-4">📬</div>
                    <h2 className="text-2xl font-bold mb-2">Check your inbox</h2>
                    <p className="text-gray-600 mb-4">
                        We sent a confirmation email to{' '}
                        <span className="font-medium text-gray-900">{email}</span>.
                        Click the link in the email to activate your account.
                    </p>
                    <p className="text-sm text-gray-500">
                        Once confirmed, you can{' '}
                        <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                            sign in here
                        </Link>
                        .
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="card">
                <h2 className="text-2xl font-bold text-center mb-2">Begin Your Journey</h2>
                <p className="text-center text-gray-600 mb-6">Create your free account to get started</p>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="label">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input"
                            placeholder="Your full name"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="label">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="label">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input"
                            placeholder="••••••••"
                            minLength={6}
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                    </div>

                    <div>
                        <label htmlFor="timezone" className="label">Timezone</label>
                        <input
                            id="timezone"
                            type="text"
                            value={timezone}
                            onChange={(e) => setTimezone(e.target.value)}
                            className="input"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">Auto-detected from your browser</p>
                    </div>

                    <div>
                        <label htmlFor="whatsapp" className="label">WhatsApp Number (Optional)</label>
                        <input
                            id="whatsapp"
                            type="tel"
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value)}
                            className="input"
                            placeholder="+1 234 567 8900"
                        />
                        <p className="text-xs text-gray-500 mt-1">Include country code</p>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full">
                        {loading ? 'Creating account…' : 'Create Account'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}
