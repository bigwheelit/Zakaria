export function HowItWorks() {
    const steps = [
        {
            number: '01',
            title: 'Create Your Free Account',
            description:
                'Sign up in seconds with just your email. Set your timezone and preferences to get started on your learning journey.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                </svg>
            ),
        },
        {
            number: '02',
            title: 'Book Your Sessions',
            description:
                'Choose from available time slots that fit your schedule. Book your first session and start learning at your own pace.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
            ),
        },
        {
            number: '03',
            title: 'Learn and Grow',
            description:
                'Attend your 1:1 coaching sessions, track your progress, and work towards completing all 101 sessions. Stay connected via messaging.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                </svg>
            ),
        },
    ]

    return (
        <section id="how-it-works" className="section-padding bg-white">
            <div className="container-custom">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Getting started is simple. Follow these three steps to begin your Quran learning journey.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step) => (
                        <div key={step.number} className="relative">
                            <div className="card hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-6">
                                    {step.icon}
                                </div>
                                <div className="absolute top-6 right-6 text-6xl font-bold text-gray-100">
                                    {step.number}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                                <p className="text-gray-600">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
