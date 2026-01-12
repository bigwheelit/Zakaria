import { useState } from 'react'

interface FAQItem {
    question: string
    answer: string
}

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    const faqs: FAQItem[] = [
        {
            question: 'Is the program really completely free?',
            answer:
                'Yes! All 101 sessions are completely free with no hidden costs. This program is offered as a service to help dedicated students deepen their understanding of the Quran.',
        },
        {
            question: 'How long is each session?',
            answer:
                'Each 1:1 coaching session is 45 minutes long. This provides enough time for meaningful learning while respecting both your schedule and the tutor\'s availability.',
        },
        {
            question: 'What should I prepare for my sessions?',
            answer:
                'You\'ll need a Quran (physical or digital), a stable internet connection for video calls, and a quiet space for learning. Your tutor will guide you on any additional materials based on your learning goals.',
        },
        {
            question: 'What happens if I need to cancel or reschedule?',
            answer:
                'You can reschedule or cancel any booking as long as you provide at least 24 hours notice. This helps ensure the tutor can offer the slot to other students.',
        },
        {
            question: 'How do I track my progress?',
            answer:
                'Your dashboard shows your completed sessions out of 101. After each session, your tutor will mark it as completed, and you\'ll be able to see your progress towards the full program.',
        },
        {
            question: 'Can I message my tutor between sessions?',
            answer:
                'Absolutely! The platform includes a private messaging feature so you can ask questions, clarify doubts, or discuss your learning journey with your tutor anytime.',
        },
        {
            question: 'What happens after I complete all 101 sessions?',
            answer:
                'Once you complete all 101 sessions, you\'ll have built a strong foundation in Quranic studies. While you won\'t be able to book new sessions through this program, you can continue your learning journey independently or seek advanced studies.',
        },
        {
            question: 'How do I get started?',
            answer:
                'Simply create a free account, complete your profile with your timezone preferences, and you\'ll be able to view available time slots and book your first session right away!',
        },
    ]

    return (
        <section id="faq" className="section-padding bg-gray-50">
            <div className="container-custom">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                        <p className="text-xl text-gray-600">
                            Find answers to common questions about our program
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="card">
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full text-left flex justify-between items-start gap-4"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900 flex-1">{faq.question}</h3>
                                    <svg
                                        className={`w-6 h-6 text-primary-500 flex-shrink-0 transition-transform ${openIndex === index ? 'transform rotate-180' : ''
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>

                                {openIndex === index && (
                                    <div className="mt-4 text-gray-600 leading-relaxed">{faq.answer}</div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-gray-600 mb-4">Still have questions?</p>
                        <a href="/signup" className="btn-primary">
                            Create Account & Ask Your Tutor
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
