import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { MessageThread } from '../components/messaging/MessageThread'
import { InboxList } from '../components/messaging/InboxList'

export function Messages() {
    const { profile } = useAuth()
    const [selectedStudentId, setSelectedStudentId] = useState<string | undefined>()

    if (profile?.role === 'tutor') {
        return (
            <div className="section-padding">
                <div className="container-custom max-w-6xl">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Inbox List */}
                        <div className="md:col-span-1">
                            <InboxList
                                onSelectConversation={setSelectedStudentId}
                                selectedStudentId={selectedStudentId}
                            />
                        </div>

                        {/* Message Thread */}
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
                </div>
            </div>
        )
    }

    // Student view
    return (
        <div className="section-padding">
            <div className="container-custom max-w-4xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>

                <div className="card h-[600px]">
                    <MessageThread />
                </div>
            </div>
        </div>
    )
}
