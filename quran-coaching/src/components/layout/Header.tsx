import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function Header() {
    const { user, profile, signOut } = useAuth()

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <nav className="container-custom px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xl font-bold">Q</span>
                        </div>
                        <span className="text-xl font-semibold text-gray-900">Quran Coaching</span>
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center space-x-6">
                        {!user ? (
                            <>
                                <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors">
                                    Home
                                </Link>
                                <Link to="/program" className="text-gray-700 hover:text-primary-600 transition-colors">
                                    Program
                                </Link>
                                <Link to="/login" className="text-gray-700 hover:text-primary-600 transition-colors">
                                    Login
                                </Link>
                                <Link to="/signup" className="btn-primary">
                                    Get Started
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 transition-colors">
                                    Dashboard
                                </Link>
                                <Link to="/bookings" className="text-gray-700 hover:text-primary-600 transition-colors">
                                    {profile?.role === 'tutor' ? 'All Bookings' : 'My Bookings'}
                                </Link>
                                <Link to="/messages" className="text-gray-700 hover:text-primary-600 transition-colors">
                                    Messages
                                </Link>
                                {profile?.role === 'tutor' && (
                                    <Link to="/admin" className="text-gray-700 hover:text-primary-600 transition-colors">
                                        Admin
                                    </Link>
                                )}
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm text-gray-600">Hi, {profile?.name}</span>
                                    <button onClick={signOut} className="btn-ghost text-sm">
                                        Logout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    )
}
