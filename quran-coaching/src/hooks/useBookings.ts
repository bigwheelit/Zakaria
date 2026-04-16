import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Database } from '../types/database.types'
import { useAuth } from './useAuth'

type Booking = Database['public']['Tables']['bookings']['Row']
type AvailabilityRule = Database['public']['Tables']['availability_rules']['Row']

interface BookingWithProfiles extends Booking {
    student_profile?: { name: string; whatsapp: string | null }
    tutor_profile?: { name: string }
}

export function useBookings() {
    const { user, profile } = useAuth()
    const [bookings, setBookings] = useState<BookingWithProfiles[]>([])
    const [loading, setLoading] = useState(true)
    const [completedCount, setCompletedCount] = useState(0)

    useEffect(() => {
        if (user) {
            fetchBookings()
            // Only call when profile has resolved and role is known
            if (profile?.role === 'student') {
                fetchCompletedCount()
            }
        } else {
            setLoading(false)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id, profile?.role])

    const fetchBookings = async () => {
        if (!user) return

        try {
            const { data, error } = await supabase
                .from('bookings')
                .select(`
          *,
          student_profile:profiles!bookings_student_id_fkey(name, whatsapp),
          tutor_profile:profiles!bookings_tutor_id_fkey(name)
        `)
                .order('start_ts', { ascending: true })

            if (error) throw error
            setBookings(data as BookingWithProfiles[])
        } catch (error) {
            console.error('Error fetching bookings:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchCompletedCount = async () => {
        if (!user || profile?.role !== 'student') return

        try {
            const { data, error } = await supabase
                .rpc('get_completed_sessions_count', { student_uuid: user.id } as never)

            if (error) throw error
            setCompletedCount((data as number) || 0)
        } catch (error) {
            console.error('Error fetching completed count:', error)
        }
    }

    const createBooking = async (
        tutorId: string,
        startTs: Date,
        endTs: Date,
        meetingLink: string | null
    ) => {
        if (!user) throw new Error('Must be logged in to create booking')

        const { data, error } = await supabase
            .from('bookings')
            .insert({
                tutor_id: tutorId,
                student_id: user.id,
                start_ts: startTs.toISOString(),
                end_ts: endTs.toISOString(),
                meeting_link: meetingLink,
                status: 'booked',
            } as Database['public']['Tables']['bookings']['Insert'])
            .select()
            .single()

        if (error) throw error
        await fetchBookings()
        await fetchCompletedCount()
        return data
    }

    const updateBooking = async (bookingId: string, updates: Partial<Booking>) => {
        const { data, error } = await supabase
            .from('bookings')
            .update(updates as Database['public']['Tables']['bookings']['Update'])
            .eq('id', bookingId)
            .select()
            .single()

        if (error) throw error
        await fetchBookings()
        await fetchCompletedCount()
        return data
    }

    const cancelBooking = async (bookingId: string) => {
        return updateBooking(bookingId, { status: 'canceled' })
    }

    const rescheduleBooking = async (bookingId: string, startTs: Date, endTs: Date) => {
        return updateBooking(bookingId, {
            start_ts: startTs.toISOString(),
            end_ts: endTs.toISOString(),
        })
    }

    const markCompleted = async (bookingId: string) => {
        return updateBooking(bookingId, { status: 'completed' })
    }

    const markNoShow = async (bookingId: string) => {
        return updateBooking(bookingId, { status: 'no_show' })
    }

    return {
        bookings,
        loading,
        completedCount,
        maxSessions: 101,
        canBookMore: completedCount < 101,
        createBooking,
        updateBooking,
        cancelBooking,
        rescheduleBooking,
        markCompleted,
        markNoShow,
        refetch: fetchBookings,
    }
}

export function useAvailability() {
    const [availability, setAvailability] = useState<AvailabilityRule[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAvailability()
    }, [])

    const fetchAvailability = async () => {
        try {
            const { data, error } = await supabase
                .from('availability_rules')
                .select('*')
                .eq('active', true)
                .order('weekday', { ascending: true })

            if (error) throw error
            setAvailability(data)
        } catch (error) {
            console.error('Error fetching availability:', error)
        } finally {
            setLoading(false)
        }
    }

    const createAvailabilityRule = async (rule: Omit<AvailabilityRule, 'id' | 'created_at' | 'updated_at'>) => {
        const { data, error } = await supabase
            .from('availability_rules')
            .insert(rule as Database['public']['Tables']['availability_rules']['Insert'])
            .select()
            .single()

        if (error) throw error
        await fetchAvailability()
        return data
    }

    const updateAvailabilityRule = async (id: string, updates: Partial<AvailabilityRule>) => {
        const { data, error } = await supabase
            .from('availability_rules')
            .update(updates as Database['public']['Tables']['availability_rules']['Update'])
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        await fetchAvailability()
        return data
    }

    const deleteAvailabilityRule = async (id: string) => {
        const { error } = await supabase
            .from('availability_rules')
            .update({ active: false } as Database['public']['Tables']['availability_rules']['Update'])
            .eq('id', id)

        if (error) throw error
        await fetchAvailability()
    }

    return {
        availability,
        loading,
        createAvailabilityRule,
        updateAvailabilityRule,
        deleteAvailabilityRule,
        refetch: fetchAvailability,
    }
}
