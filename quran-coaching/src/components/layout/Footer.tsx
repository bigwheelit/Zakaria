export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-gray-900 text-gray-300 mt-auto">
            <div className="container-custom px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Quran Coaching</h3>
                        <p className="text-sm text-gray-400">
                            Free 1:1 Quran coaching for dedicated learners. 101 sessions to deepen your understanding
                            and strengthen your connection with the Quran.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="/#program" className="hover:text-primary-400 transition-colors">
                                    About the Program
                                </a>
                            </li>
                            <li>
                                <a href="/#how-it-works" className="hover:text-primary-400 transition-colors">
                                    How It Works
                                </a>
                            </li>
                            <li>
                                <a href="/#faq" className="hover:text-primary-400 transition-colors">
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Get Started</h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Ready to begin your Quran learning journey? Sign up today and book your first session.
                        </p>
                        <a href="/signup" className="btn-primary text-sm">
                            Join Now
                        </a>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
                    <p>&copy; {currentYear} Quran Coaching. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
