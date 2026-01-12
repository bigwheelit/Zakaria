import { useEffect, useState } from 'react'
import { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { Database } from '../types/database.types'
import { useAuth } from './useAuth'

type Message = Database['public']['Tables']['messages']['Row']

interface MessageWithSender extends Message {
    sender_profile?: { name: string }
}

interface Conversation {
    student_id: string
    student_name: string
    last_message: string
    last_message_at: string
    unread_count: number
}

export function useMessages(studentId?: string) {
    const { user, profile } = useAuth()
    const [messages, setMessages] = useState<MessageWithSender[]>([])
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [loading, setLoading] = useState(true)
    const [channel, setChannel] = useState<RealtimeChannel | null>(null)

    // Fetch messages for a specific conversation
    useEffect(() => {
        if (!user) {
            setLoading(false)
            return
        }

        if (profile?.role === 'tutor' && !studentId) {
            // Tutor viewing inbox - fetch conversations
            fetchConversations()
        } else if (profile?.role === 'tutor' && studentId) {
            // Tutor viewing specific conversation
            fetchMessages(studentId)
            subscribeToMessages(studentId)
        } else if (profile?.role === 'student') {
            // Student viewing their conversation with tutor
            fetchMessages()
            subscribeToMessages()
        }

        return () => {
            if (channel) {
                supabase.removeChannel(channel)
            }
        }
    }, [user, profile, studentId])

    const fetchMessages = async (otherUserId?: string) => {
        if (!user) return

        try {
            let query = supabase
                .from('messages')
                .select(`
          *,
          sender_profile:profiles!messages_sender_id_fkey(name)
        `)

            if (profile?.role === 'student') {
                query = query.eq('student_id', user.id)
            } else if (profile?.role === 'tutor' && otherUserId) {
                query = query.eq('student_id', otherUserId)
            }

            const { data, error } = await query.order('created_at', { ascending: true })

            if (error) throw error
            setMessages(data as MessageWithSender[])
        } catch (error) {
            console.error('Error fetching messages:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchConversations = async () => {
        if (!user || profile?.role !== 'tutor') return

        try {
            // Get all unique student conversations
            const { data: allMessages, error } = await supabase
                .from('messages')
                .select('student_id, student_profile:profiles!messages_student_id_fkey(name), body, created_at, read_at, sender_id')
                .eq('tutor_id', user.id)
                .order('created_at', { ascending: false })

            if (error) throw error

            // Group by student_id to get conversations
            const conversationMap = new Map<string, Conversation>()

            allMessages?.forEach((msg: any) => {
                if (!conversationMap.has(msg.student_id)) {
                    conversationMap.set(msg.student_id, {
                        student_id: msg.student_id,
                        student_name: msg.student_profile?.name || 'Unknown',
                        last_message: msg.body,
                        last_message_at: msg.created_at,
                        unread_count: 0,
                    })
                }

                // Count unread messages (messages from student that tutor hasn't read)
                if (!msg.read_at && msg.sender_id === msg.student_id) {
                    const conv = conversationMap.get(msg.student_id)!
                    conv.unread_count++
                }
            })

            setConversations(Array.from(conversationMap.values()))
        } catch (error) {
            console.error('Error fetching conversations:', error)
        } finally {
            setLoading(false)
        }
    }

    const subscribeToMessages = (otherUserId?: string) => {
        if (!user) return

        const newChannel = supabase
            .channel('messages')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'messages',
                    filter: profile?.role === 'student'
                        ? `student_id=eq.${user.id}`
                        : otherUserId
                            ? `student_id=eq.${otherUserId}`
                            : undefined,
                },
                () => {
                    // Refetch messages on any change
                    if (profile?.role === 'tutor' && !otherUserId) {
                        fetchConversations()
                    } else {
                        fetchMessages(otherUserId)
                    }
                }
            )
            .subscribe()

        setChannel(newChannel)
    }

    const sendMessage = async (body: string, recipientId?: string) => {
        if (!user || !profile) throw new Error('Must be logged in')

        let tutorId: string
        let studentId: string

        if (profile.role === 'student') {
            // Find tutor ID - for now, get first tutor from profiles
            const { data: tutorData } = await supabase
                .from('profiles')
                .select('id')
                .eq('role', 'tutor')
                .limit(1)
                .single()

            if (!tutorData) throw new Error('No tutor found')

            tutorId = tutorData.id
            studentId = user.id
        } else {
            // Tutor sending to student
            if (!recipientId) throw new Error('Recipient ID required for tutor')
            tutorId = user.id
            studentId = recipientId
        }

        const { data, error } = await supabase
            .from('messages')
            .insert({
                tutor_id: tutorId,
                student_id: studentId,
                sender_id: user.id,
                body,
            })
            .select()
            .single()

        if (error) throw error
        return data
    }

    const markAsRead = async (messageId: string) => {
        const { data, error } = await supabase
            .from('messages')
            .update({ read_at: new Date().toISOString() })
            .eq('id', messageId)
            .select()
            .single()

        if (error) throw error
        return data
    }

    const markConversationAsRead = async (otherUserId: string) => {
        if (!user) return

        const { error } = await supabase
            .from('messages')
            .update({ read_at: new Date().toISOString() })
            .eq(profile?.role === 'tutor' ? 'tutor_id' : 'student_id', user.id)
            .eq(profile?.role === 'tutor' ? 'student_id' : 'tutor_id', otherUserId)
            .is('read_at', null)

        if (error) throw error
    }

    return {
        messages,
        conversations,
        loading,
        sendMessage,
        markAsRead,
        markConversationAsRead,
        refetch: studentId ? () => fetchMessages(studentId) : fetchConversations,
    }
}
