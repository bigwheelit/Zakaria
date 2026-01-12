export function TutorBio() {
    return (
        <section className="section-padding bg-white">
            <div className="container-custom">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Your Tutor</h2>
                        <p className="text-xl text-gray-600">
                            Learn from an experienced Quran instructor dedicated to your success
                        </p>
                    </div>

                    <div className="card">
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            {/* Tutor Image */}
                            <div className="flex-shrink-0">
                                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-primary-100">
                                    <img
                                        src="/images/hand-quran.jpg"
                                        alt="Tutor with Quran"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* Bio Content */}
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Assalamu Alaikum</h3>
                                <p className="text-primary-600 font-medium mb-4">Certified Quran Instructor</p>

                                <div className="space-y-3 text-gray-600">
                                    <p>
                                        With years of experience in Quranic studies and teaching, I am dedicated to helping students
                                        of all levels deepen their understanding and connection with the Holy Quran.
                                    </p>
                                    <p>
                                        My teaching approach focuses on personalized guidance, patience, and creating a supportive
                                        learning environment where every student can thrive at their own pace.
                                    </p>
                                    <p>
                                        I am passionate about making Quranic education accessible and meaningful for every learner,
                                        which is why I'm offering this completely free program to dedicated students.
                                    </p>
                                </div>

                                <div className="mt-6 flex flex-wrap gap-2 justify-center md:justify-start">
                                    <span className="badge badge-info">Tajweed Expert</span>
                                    <span className="badge badge-info">Tafsir Studies</span>
                                    <span className="badge badge-info">Arabic Language</span>
                                    <span className="badge badge-info">Memorization Techniques</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
