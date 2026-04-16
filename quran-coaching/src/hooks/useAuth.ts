import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { Database } from '../types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                fetchProfile(session.user)
            } else {
                setLoading(false)
            }
        })

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                fetchProfile(session.user)
            } else {
                setProfile(null)
                setLoading(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    /**
     * Fetch profile for a user. If it doesn't exist yet (e.g. email confirmation
     * was required and the profile wasn't created during signUp), attempt to create
     * it from the user's metadata so the first post-confirmation login works.
     */
    const fetchProfile = async (authUser: User) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authUser.id)
                .single()

            if (error && error.code === 'PGRST116') {
                // Profile not found — create it from auth metadata (handles email-confirm flow)
                const meta = authUser.user_metadata
                const { data: created, error: createError } = await supabase
                    .from('profiles')
                    .insert({
                        id: authUser.id,
                        name: (meta?.name as string) || authUser.email?.split('@')[0] || 'Student',
                        timezone: (meta?.timezone as string) || 'UTC',
                        whatsapp: (meta?.whatsapp as string) || null,
                        role: 'student',
                    } as Database['public']['Tables']['profiles']['Insert'])
                    .select()
                    .single()

                if (!createError && created) {
                    setProfile(created)
                }
                return
            }

            if (error) throw error
            setProfile(data)
        } catch (err) {
            console.error('Error fetching profile:', err)
        } finally {
            setLoading(false)
        }
    }

    const signUp = async (
        email: string,
        password: string,
        name: string,
        timezone: string,
        whatsapp?: string
    ) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name, timezone, whatsapp },
            },
        })

        if (error) throw error

        // If a session was returned (email confirmation disabled), create profile now.
        // If no session (email confirmation enabled), profile will be created on first
        // successful sign-in via fetchProfile's fallback logic above.
        if (data.user && data.session) {
            const { error: profileError } = await supabase.from('profiles').insert({
                id: data.user.id,
                name,
                timezone,
                whatsapp: whatsapp || null,
                role: 'student',
            } as Database['public']['Tables']['profiles']['Insert'])

            // Profile creation error is non-fatal here — fetchProfile will retry
            if (profileError) {
                console.warn('Profile insert deferred:', profileError.message)
            }
        }

        return data
    }

    const signIn = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) throw error
        return data
    }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    }

    const updateProfile = async (updates: Partial<Profile>) => {
        if (!user) throw new Error('No user logged in')

        const { data, error } = await supabase
            .from('profiles')
            .update(updates as Database['public']['Tables']['profiles']['Update'])
            .eq('id', user.id)
            .select()
            .single()

        if (error) throw error
        setProfile(data)
        return data
    }

    return {
        user,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
        isTutor: profile?.role === 'tutor',
        isStudent: profile?.role === 'student',
    }
}
