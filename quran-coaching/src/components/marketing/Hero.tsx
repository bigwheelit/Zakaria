import { Link } from 'react-router-dom'

export function Hero() {
    return (
        <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 section-padding">
            <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <div>
                        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                            Master the Quran with Free 1:1 Coaching
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Join our transformative 101-session program. Deepen your understanding, perfect your recitation,
                            and strengthen your connection with the Holy Quran — completely free.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/signup" className="btn-primary text-lg">
                                Start Your Journey
                            </Link>
                            <a href="#how-it-works" className="btn-outline text-lg">
                                Learn More
                            </a>
                        </div>
                        <div className="mt-8 flex items-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule "evenodd" />
                                </svg>
                                <span>100% Free</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>1:1 Sessions</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Flexible Schedule</span>
                            </div>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="relative">
                        <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src="/images/hero-reading.jpg"
                                alt="Person reading and studying the Quran"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Stats overlay */}
                        <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <div className="text-3xl font-bold text-primary-600">101</div>
                            <div className="text-sm text-gray-600">Free Sessions</div>
                        </div>
                        <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <div className="text-3xl font-bold text-secondary-600">45</div>
                            <div className="text-sm text-gray-600">Minute Sessions</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
