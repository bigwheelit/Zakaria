You are a senior full-stack engineer and product designer. Build a very small “micro-SaaS” web app for a single tutor to provide FREE 1:1 Quran coaching in a fixed program of 101 sessions.

###NON-NEGOTIABLES
- Keep it SIMPLE and production-oriented.
- Must be hostable on GitHub (GitHub Pages for the frontend). Use a free-tier backend (Supabase recommended) so the app can still support auth + bookings + messaging.
- Deliver EVERYTHING in one response: architecture, repo structure, DB schema, RLS policies, environment variables, setup steps, deployment steps, and complete code (or clearly separated files).
- Do NOT ask me questions until after you deliver the complete solution. Make best-practice assumptions and proceed.

CORE FEATURES (MVP)
1) Public marketing site
   - Landing page (hero + “How it works” + program overview + tutor bio + FAQ + CTA “Book your free session”)
   - Program page describing “101 free sessions” (progress model, expectations, rules)
2) Auth (students only)
   - Email/password login (Supabase Auth)
   - Minimal profile: name, timezone, optional WhatsApp/phone (optional field)
3) Booking calendar (single tutor)
   - Tutor defines weekly availability (e.g., Mon–Fri 6pm–9pm, Sat 10am–2pm) in an admin-only config panel (tutor login)
   - Students can book an available time slot (30 or 45 minutes; pick one default and state it)
   - Prevent double booking
   - Student can reschedule/cancel with a minimum notice rule (e.g., 24 hours) (implement)
   - Booking shows meeting method (Zoom/Google Meet link can be manual field by tutor for MVP)
4) “101 sessions” rule
   - Each student has a max of 101 completed sessions in total (free)
   - Show progress: “Completed X / 101”
   - Once 101 completed, block new bookings (but allow viewing history)
5) Private messaging
   - 1:1 thread between each student and tutor
   - Tutor can reply to students
   - Simple UI: inbox list (tutor) + thread view + send message
   - Real-time updates (Supabase realtime) OR polling if simpler (choose one and justify)
6) Tutor admin area (single tutor user)
   - View upcoming bookings
   - Mark session as completed/no-show
   - Manage availability
   - View messages/inbox

TECHNICAL CONSTRAINTS
- Frontend: React + Vite + TypeScript + Tailwind (preferred) OR Next.js static export (pick ONE and justify based on GitHub Pages).
- Backend: Supabase (Auth + Postgres + Storage + Realtime).
- Security: enforce Row Level Security (RLS) for bookings and messages. Provide SQL for policies.
- No paid APIs. Keep dependencies minimal.
- Responsive UI, accessible forms, clean layout.
- Data model must be multi-tenant-ready in the future (even though it’s one tutor now) but do not overbuild.

DATA MODEL REQUIREMENTS (Supabase/Postgres)
Minimum tables:
- profiles (id = auth.user.id, name, timezone, role: 'student'|'tutor')
- availability_rules (tutor_id, weekday, start_time, end_time, slot_minutes, active)
- bookings (id, tutor_id, student_id, start_ts, end_ts, status: booked|canceled|completed|no_show, notes)
- messages (id, tutor_id, student_id, sender_id, body, created_at, read_at)
- session_counters or derived view (completed_count per student)

Include:
- indexes
- constraints to prevent overlap (or logic in transaction)
- RLS policies: students only see their own bookings/messages; tutor sees everything.
- Seed script to create the tutor profile (or guide how to set tutor role for one account).

DEPLOYMENT
- GitHub repo layout and commands
- GitHub Pages deployment steps (build output folder, routing fixes, base path)
- Supabase setup: project creation, SQL migration, env vars
- Local dev: .env.example + instructions

CONTENT + UI
- Provide complete copy for the landing page (simple and respectful, adult-focused).
- Include an FAQ (5–8 questions).
- Provide a minimal design system (colors, typography suggestions).

FREE IMAGE ASSETS (download and store locally in /public/images with an /ATTRIBUTION.md file)
Use ONLY images that are free to use under their site’s license (avoid Unsplash+).
Use these page URLs (download the images from them and store local copies):

Pexels (free to use):
1) https://www.pexels.com/photo/a-man-reading-quran-7957076/
2) https://www.pexels.com/photo/a-woman-sitting-and-reading-quran-20784504/
3) https://www.pexels.com/photo/high-angle-shot-of-woman-in-brown-hijab-reading-quran-on-a-tablet-7956907/
4) https://www.pexels.com/photo/hand-holding-a-quran-7249184/

Unsplash (Free to use under the Unsplash License — confirm it is NOT Unsplash+):
5) https://unsplash.com/photos/quran-book-7blIFp0kFP4
6) https://unsplash.com/photos/an-open-quran-with-prayer-beads-_ToMMa1MQ8U
7) https://unsplash.com/photos/a-close-up-of-an-open-book-on-a-table-nn16s5Pya6c
8) https://unsplash.com/photos/a-close-up-of-an-open-book-with-arabic-writing-JSTOqD9_llo
9) https://unsplash.com/photos/two-women-in-hijabs-are-reading-a-book-HQkHmZ7d_Vk

###DELIVERABLE FORMAT
1) Assumptions (explicit)
2) Architecture diagram (ASCII ok)
3) Repo structure
4) Supabase SQL migrations (tables, indexes, RLS, policies)
5) Frontend code (all files)
6) Deployment instructions (GitHub Pages + Supabase)
7) Final checklist for production readiness

Start now. Produce the complete solution without asking me questions.
