import { useMessages } from '../../hooks/useMessages'

interface InboxListProps {
    onSelectConversation: (studentId: string) => void
    selectedStudentId?: string
}

export function InboxList({ onSelectConversation, selectedStudentId }: InboxListProps) {
    const { conversations } = useMessages()

    return (
        <div className="space-y-2">
            <h2 className="text-xl font-semibold mb-4">Messages</h2>

            {conversations.length === 0 ? (
                <p className="text-gray-500">No conversations yet</p>
            ) : (
                conversations.map((conv) => (
                    <button
                        key={conv.student_id}
                        onClick={() => onSelectConversation(conv.student_id)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${selectedStudentId === conv.student_id
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-200 hover:border-primary-300'
                            }`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900">{conv.student_name}</h3>
                            {conv.unread_count > 0 && (
                                <span className="badge badge-error">{conv.unread_count}</span>
                            )}
                        </div>
                        <p className="text-sm text-gray-600 truncate">{conv.last_message}</p>
                    </button>
                ))
            )}
        </div>
    )
}
