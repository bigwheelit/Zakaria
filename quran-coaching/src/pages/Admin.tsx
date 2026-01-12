import { useState } from 'react'
import { AvailabilityManager } from '../components/admin/AvailabilityManager'
import { BookingsDashboard } from '../components/admin/BookingsDashboard'
import { InboxList } from '../components/messaging/InboxList'
import { MessageThread } from '../components/messaging/MessageThread'

export function Admin() {
    const [activeTab, setActiveTab] = useState<'bookings' | 'availability' | 'messages'>('bookings')
    const [selectedStudentId, setSelectedStudentId] = useState<string | undefined>()

    return (
        <div className="section-padding">
            <div className="container-custom max-w-7xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Tutor Admin Panel</h1>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'bookings'
                                ? 'border-b-2 border-primary-500 text-primary-600'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Bookings
                    </button>
                    <button
                        onClick={() => setActiveTab('availability')}
                        className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'availability'
                                ? 'border-b-2 border-primary-500 text-primary-600'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Availability
                    </button>
                    <button
                        onClick={() => setActiveTab('messages')}
                        className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'messages'
                                ? 'border-b-2 border-primary-500 text-primary-600'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Messages
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'bookings' && <BookingsDashboard />}

                {activeTab === 'availability' && <AvailabilityManager />}

                {activeTab === 'messages' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                            <InboxList
                                onSelectConversation={setSelectedStudentId}
                                selectedStudentId={selectedStudentId}
                            />
                        </div>
                        <div className="md:col-span-2">
                            {selectedStudentId ? (
                                <div className="card h-[600px]">
                                    <MessageThread studentId={selectedStudentId} />
                                </div>
                            ) : (
                                <div className="card h-[600px] flex items-center justify-center">
                                    <p className="text-gray-500">Select a conversation to view messages</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
