-- Quran Coaching Platform - Initial Schema Migration
-- Creates tables, indexes, RLS policies, and helper functions

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLES
-- ============================================================================

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  whatsapp TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'tutor')) DEFAULT 'student',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tutor availability rules
CREATE TABLE availability_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  weekday INTEGER NOT NULL CHECK (weekday BETWEEN 0 AND 6), -- 0 = Sunday, 6 = Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_minutes INTEGER NOT NULL DEFAULT 45,
  meeting_link TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_time_range CHECK (start_time < end_time)
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  start_ts TIMESTAMPTZ NOT NULL,
  end_ts TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('booked', 'canceled', 'completed', 'no_show')) DEFAULT 'booked',
  meeting_link TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_booking_time CHECK (start_ts < end_ts),
  CONSTRAINT no_self_booking CHECK (tutor_id != student_id)
);

-- Messages table for 1:1 communication
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_sender CHECK (sender_id IN (tutor_id, student_id))
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Profiles indexes
CREATE INDEX idx_profiles_role ON profiles(role);

-- Availability rules indexes
CREATE INDEX idx_availability_tutor ON availability_rules(tutor_id);
CREATE INDEX idx_availability_weekday ON availability_rules(weekday);
CREATE INDEX idx_availability_active ON availability_rules(active);

-- Bookings indexes
CREATE INDEX idx_bookings_tutor ON bookings(tutor_id);
CREATE INDEX idx_bookings_student ON bookings(student_id);
CREATE INDEX idx_bookings_start_ts ON bookings(start_ts);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_tutor_start ON bookings(tutor_id, start_ts);

-- Messages indexes
CREATE INDEX idx_messages_tutor ON messages(tutor_id);
CREATE INDEX idx_messages_student ON messages(student_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
CREATE INDEX idx_messages_conversation ON messages(tutor_id, student_id, created_at DESC);
CREATE INDEX idx_messages_unread ON messages(read_at) WHERE read_at IS NULL;

-- ============================================================================
-- PREVENT DOUBLE BOOKING (Exclusion Constraint)
-- ============================================================================

-- This prevents overlapping bookings for the same tutor
-- We use a simple approach: check constraint via trigger
-- (PostgreSQL exclusion constraint would need btree_gist extension)

CREATE OR REPLACE FUNCTION check_booking_overlap()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if there's any overlapping booking for the same tutor
  -- Only check for 'booked' status (not canceled or completed)
  IF EXISTS (
    SELECT 1 FROM bookings
    WHERE tutor_id = NEW.tutor_id
      AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
      AND status = 'booked'
      AND (
        (NEW.start_ts >= start_ts AND NEW.start_ts < end_ts)
        OR (NEW.end_ts > start_ts AND NEW.end_ts <= end_ts)
        OR (NEW.start_ts <= start_ts AND NEW.end_ts >= end_ts)
      )
  ) THEN
    RAISE EXCEPTION 'Booking time slot overlaps with an existing booking';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_booking_overlap
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION check_booking_overlap();

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to count completed sessions for a student
CREATE OR REPLACE FUNCTION get_completed_sessions_count(student_uuid UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER
  FROM bookings
  WHERE student_id = student_uuid AND status = 'completed';
$$ LANGUAGE SQL STABLE;

-- Function to check if student has reached the 101 session limit
CREATE OR REPLACE FUNCTION check_session_limit()
RETURNS TRIGGER AS $$
DECLARE
  completed_count INTEGER;
BEGIN
  -- Only check when creating a new booking
  IF TG_OP = 'INSERT' AND NEW.status = 'booked' THEN
    completed_count := get_completed_sessions_count(NEW.student_id);
    
    IF completed_count >= 101 THEN
      RAISE EXCEPTION 'Student has reached the maximum of 101 completed sessions';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_session_limit
  BEFORE INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION check_session_limit();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update_updated_at trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_availability_updated_at
  BEFORE UPDATE ON availability_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES - PROFILES
-- ============================================================================

-- Anyone can view all profiles (needed for displaying names, etc.)
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- RLS POLICIES - AVAILABILITY RULES
-- ============================================================================

-- Everyone can view active availability rules
CREATE POLICY "Availability rules are viewable by everyone"
  ON availability_rules FOR SELECT
  USING (active = true);

-- Only tutors can insert/update/delete their own availability rules
CREATE POLICY "Tutors can manage their availability"
  ON availability_rules FOR ALL
  USING (
    auth.uid() = tutor_id 
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'tutor'
    )
  )
  WITH CHECK (
    auth.uid() = tutor_id 
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'tutor'
    )
  );

-- ============================================================================
-- RLS POLICIES - BOOKINGS
-- ============================================================================

-- Students can view their own bookings
CREATE POLICY "Students can view their own bookings"
  ON bookings FOR SELECT
  USING (
    auth.uid() = student_id
    OR (
      auth.uid() = tutor_id
      AND EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'tutor'
      )
    )
  );

-- Students can create bookings for themselves
CREATE POLICY "Students can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- Students can update their own bookings (for rescheduling/canceling)
-- But only if the booking is more than 24 hours away
CREATE POLICY "Students can update their own bookings"
  ON bookings FOR UPDATE
  USING (
    auth.uid() = student_id
    AND start_ts > NOW() + INTERVAL '24 hours'
  )
  WITH CHECK (
    auth.uid() = student_id
    AND start_ts > NOW() + INTERVAL '24 hours'
  );

-- Tutors can update any booking (for marking completed/no-show)
CREATE POLICY "Tutors can update bookings"
  ON bookings FOR UPDATE
  USING (
    auth.uid() = tutor_id
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'tutor'
    )
  )
  WITH CHECK (
    auth.uid() = tutor_id
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'tutor'
    )
  );

-- ============================================================================
-- RLS POLICIES - MESSAGES
-- ============================================================================

-- Students can view messages in their conversation
CREATE POLICY "Students can view their messages"
  ON messages FOR SELECT
  USING (
    auth.uid() = student_id
    OR (
      auth.uid() = tutor_id
      AND EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'tutor'
      )
    )
  );

-- Students can send messages to tutor
CREATE POLICY "Students can send messages"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = student_id
    AND auth.uid() = sender_id
  );

-- Tutors can send messages to students
CREATE POLICY "Tutors can send messages"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = tutor_id
    AND auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'tutor'
    )
  );

-- Tutors can update messages (mark as read)
CREATE POLICY "Tutors can update messages"
  ON messages FOR UPDATE
  USING (
    auth.uid() = tutor_id
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'tutor'
    )
  );

-- Students can update messages they received (mark as read)
CREATE POLICY "Students can update received messages"
  ON messages FOR UPDATE
  USING (
    auth.uid() = student_id
    AND sender_id = tutor_id
  );

-- ============================================================================
-- SEED DATA / SETUP INSTRUCTIONS
-- ============================================================================

-- NOTE: To set up the tutor account:
-- 1. Create a Supabase account for the tutor via the application signup
-- 2. Go to Supabase Dashboard > Authentication > Users
-- 3. Find the tutor's user ID
-- 4. Run this SQL in the SQL Editor (replace <TUTOR_USER_ID> with actual UUID):
--
-- UPDATE profiles SET role = 'tutor' WHERE id = '<TUTOR_USER_ID>';
--
-- Alternatively, you can create a tutor account directly:
--
-- INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
-- VALUES (
--   '<UUID>',
--   'tutor@example.com',
--   crypt('your-password', gen_salt('bf')),
--   NOW()
-- );
--
-- INSERT INTO profiles (id, name, timezone, role)
-- VALUES (
--   '<SAME_UUID>',
--   'Your Tutor Name',
--   'America/New_York',
--   'tutor'
-- );
