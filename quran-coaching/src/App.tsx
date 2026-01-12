import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { Home } from './pages/Home'
import { Program } from './pages/Program'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { Dashboard } from './pages/Dashboard'
import { Bookings } from './pages/Bookings'
import { Messages } from './pages/Messages'
import { Profile } from './pages/Profile'
import { Admin } from './pages/Admin'

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/program" element={<Program />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Protected routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/bookings"
                        element={
                            <ProtectedRoute>
                                <Bookings />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/messages"
                        element={
                            <ProtectedRoute>
                                <Messages />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />

                    {/* Tutor-only routes */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute requireTutor>
                                <Admin />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Layout>
        </Router>
    )
}

export default App
