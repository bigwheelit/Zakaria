import { Link } from 'react-router-dom'

export function Program() {
    return (
        <div className="section-padding">
            <div className="container-custom max-w-4xl">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">The 101 Sessions Program</h1>

                <div className="prose prose-lg max-w-none">
                    <h2>Program Overview</h2>
                    <p>
                        Our 101 Sessions Program is a comprehensive, structured approach to Quranic learning designed for
                        dedicated students who want to deepen their understanding and connection with the Holy Quran.
                    </p>

                    <h2>What to Expect</h2>
                    <ul>
                        <li>
                            <strong>Personalized Learning:</strong> Each session is tailored to your current level and learning goals
                        </li>
                        <li>
                            <strong>Tajweed Mastery:</strong> Learn proper recitation techniques and pronunciation
                        </li>
                        <li>
                            <strong>Tafsir Studies:</strong> Understand the meanings and context of Quranic verses
                        </li>
                        <li>
                            <strong>Memorization Support:</strong> Techniques and guidance for Quran memorization
                        </li>
                        <li>
                            <strong>Arabic Language:</strong> Build your Arabic language skills for better comprehension
                        </li>
                    </ul>

                    <h2>Program Structure</h2>
                    <p>
                        The program consists of 101 individual 1:1 coaching sessions, each 45 minutes long. You can schedule
                        sessions at your own pace, based on your availability and the tutor's schedule.
                    </p>

                    <h2>Rules & Expectations</h2>
                    <ul>
                        <li>Each student receives a total of 101 free sessions</li>
                        <li>Sessions must be scheduled at least 24 hours in advance</li>
                        <li>Cancellations or rescheduling require 24 hours notice</li>
                        <li>Students are expected to come prepared and ready to learn</li>
                        <li>Consistent attendance and dedication are encouraged for best results</li>
                    </ul>

                    <h2>Progress Tracking</h2>
                    <p>
                        Your dashboard will display your progress from Session 1 to Session 101. Each completed session brings
                        you closer to mastering your Quranic learning goals.
                    </p>

                    <div className="mt-8">
                        <Link to="/signup" className="btn-primary">
                            Start Your Journey Today
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
