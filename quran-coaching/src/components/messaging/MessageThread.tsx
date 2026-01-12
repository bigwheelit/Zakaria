import { useEffect, useRef } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useMessages } from '../../hooks/useMessages'
import { MessageInput } from './MessageInput'
import { formatDateTime } from '../../lib/utils'

interface MessageThreadProps {
    studentId?: string
}

export function MessageThread({ studentId }: MessageThreadProps) {
    const { user } = useAuth()
    const { messages, sendMessage } = useMessages(studentId)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = async (body: string) => {
        await sendMessage(body, studentId)
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <p className="text-center text-gray-500">No messages yet. Start the conversation!</p>
                ) : (
                    messages.map((message) => {
                        const isOwn = message.sender_id === user?.id

                        return (
                            <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[70%] rounded-lg p-3 ${isOwn
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-gray-100 text-gray-900'
                                        }`}
                                >
                                    <p className="text-sm mb-1">{message.body}</p>
                                    <p className={`text-xs ${isOwn ? 'text-primary-100' : 'text-gray-500'}`}>
                                        {formatDateTime(message.created_at)}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-200 p-4">
                <MessageInput onSend={handleSend} />
            </div>
        </div>
    )
}
