import { useState, FormEvent } from 'react'

interface MessageInputProps {
    onSend: (body: string) => Promise<void>
    placeholder?: string
}

export function MessageInput({ onSend, placeholder = 'Type your message...' }: MessageInputProps) {
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!message.trim()) return

        setLoading(true)
        try {
            await onSend(message)
            setMessage('')
        } catch (error) {
            console.error('Failed to send message:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={placeholder}
                className="input flex-1"
                disabled={loading}
            />
            <button type="submit" disabled={loading || !message.trim()} className="btn-primary">
                {loading ? 'Sending...' : 'Send'}
            </button>
        </form>
    )
}
