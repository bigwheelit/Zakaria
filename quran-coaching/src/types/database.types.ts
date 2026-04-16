export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    name: string
                    timezone: string
                    whatsapp: string | null
                    role: 'student' | 'tutor'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    name: string
                    timezone?: string
                    whatsapp?: string | null
                    role?: 'student' | 'tutor'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    timezone?: string
                    whatsapp?: string | null
                    role?: 'student' | 'tutor'
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            availability_rules: {
                Row: {
                    id: string
                    tutor_id: string
                    weekday: number
                    start_time: string
                    end_time: string
                    slot_minutes: number
                    meeting_link: string | null
                    active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    tutor_id: string
                    weekday: number
                    start_time: string
                    end_time: string
                    slot_minutes?: number
                    meeting_link?: string | null
                    active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    tutor_id?: string
                    weekday?: number
                    start_time?: string
                    end_time?: string
                    slot_minutes?: number
                    meeting_link?: string | null
                    active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: 'availability_rules_tutor_id_fkey'
                        columns: ['tutor_id']
                        isOneToOne: false
                        referencedRelation: 'profiles'
                        referencedColumns: ['id']
                    }
                ]
            }
            bookings: {
                Row: {
                    id: string
                    tutor_id: string
                    student_id: string
                    start_ts: string
                    end_ts: string
                    status: 'booked' | 'canceled' | 'completed' | 'no_show'
                    meeting_link: string | null
                    notes: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    tutor_id: string
                    student_id: string
                    start_ts: string
                    end_ts: string
                    status?: 'booked' | 'canceled' | 'completed' | 'no_show'
                    meeting_link?: string | null
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    tutor_id?: string
                    student_id?: string
                    start_ts?: string
                    end_ts?: string
                    status?: 'booked' | 'canceled' | 'completed' | 'no_show'
                    meeting_link?: string | null
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: 'bookings_student_id_fkey'
                        columns: ['student_id']
                        isOneToOne: false
                        referencedRelation: 'profiles'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'bookings_tutor_id_fkey'
                        columns: ['tutor_id']
                        isOneToOne: false
                        referencedRelation: 'profiles'
                        referencedColumns: ['id']
                    }
                ]
            }
            messages: {
                Row: {
                    id: string
                    tutor_id: string
                    student_id: string
                    sender_id: string
                    body: string
                    read_at: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    tutor_id: string
                    student_id: string
                    sender_id: string
                    body: string
                    read_at?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    tutor_id?: string
                    student_id?: string
                    sender_id?: string
                    body?: string
                    read_at?: string | null
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: 'messages_sender_id_fkey'
                        columns: ['sender_id']
                        isOneToOne: false
                        referencedRelation: 'profiles'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'messages_student_id_fkey'
                        columns: ['student_id']
                        isOneToOne: false
                        referencedRelation: 'profiles'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'messages_tutor_id_fkey'
                        columns: ['tutor_id']
                        isOneToOne: false
                        referencedRelation: 'profiles'
                        referencedColumns: ['id']
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            get_completed_sessions_count: {
                Args: {
                    student_uuid: string
                }
                Returns: number
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
