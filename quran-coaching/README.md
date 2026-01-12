# Quran Coaching Platform

A free 1:1 Quran coaching platform offering 101 personalized learning sessions. Built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Public Marketing Site**: Landing page with program information, tutor bio, and FAQ
- **Student Authentication**: Email/password signup and login
- **Booking System**: Interactive calendar for scheduling 45-minute sessions
- **Session Tracking**: Progress monitoring (X/101 completed sessions)
- **Real-time Messaging**: 1:1 communication between students and tutor
- **Tutor Admin Panel**: Manage availability, bookings, and messages
- **Session Limits**: Automatic enforcement of 101-session maximum
- **Cancellation Policy**: 24-hour notice requirement for changes

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Routing**: React Router (Hash-based for GitHub Pages)
- **Deployment**: GitHub Pages (frontend) + Supabase (backend)

## Project Structure

```
quran-coaching/
├── public/
│   ├── images/              # Downloaded image assets
│   └── ATTRIBUTION.md       # Image credits
├── src/
│   ├── components/
│   │   ├── admin/           # Tutor admin components
│   │   ├── auth/            # Authentication components
│   │   ├── booking/         # Booking calendar & cards
│   │   ├── layout/          # Header, Footer, Layout
│   │   ├── marketing/       # Landing page components
│   │   └── messaging/       # Real-time messaging
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Supabase client & utilities
│   ├── pages/               # Page components
│   ├── types/               # TypeScript types
│   ├── App.tsx              # Main app with routing
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## Local Development

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier)

### Setup

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd quran-coaching
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up Supabase**

   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Project Settings > API
   - Copy your project URL and anon key

4. **Configure environment variables**

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

5. **Run database migrations**

   - Go to Supabase Dashboard > SQL Editor
   - Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
   - Click "Run" to execute the migration

6. **Download image assets**

   - Follow instructions in `public/ATTRIBUTION.md`
   - Download all images from Pexels and Unsplash
   - Place them in `public/images/` directory

7. **Start development server**

```bash
npm run dev
```

Visit `http://localhost:5173` to see the app.

## Creating the Tutor Account

After running the migration:

1. Sign up for an account through the application
2. Go to Supabase Dashboard > Authentication > Users
3. Find your user ID
4. Go to SQL Editor and run:

```sql
UPDATE profiles SET role = 'tutor' WHERE id = 'YOUR_USER_ID';
```

Now you can access the admin panel at `/admin`.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Database Schema

- **profiles**: User information and roles
- **availability_rules**: Tutor's weekly availability
- **bookings**: All session bookings with status tracking
- **messages**: 1:1 messaging between tutor and students

All tables use Row Level Security (RLS) for data protection.

## Key Features Explained

### Session Limit Enforcement

- Database trigger prevents bookings after 101 completed sessions
- Dashboard shows progress: "X / 101 sessions"
- Booking button disabled when limit reached

### 24-Hour Cancellation Policy

- RLS policy prevents updates to bookings within 24 hours of start time
- Students can only cancel/reschedule with sufficient notice
- Tutors can mark sessions as completed or no-show anytime

### Real-time Messaging

- Uses Supabase Realtime for live message updates
- No polling required - instant delivery
- Unread message indicators for tutors

## License

This project is open source. Images are used under Pexels and Unsplash free licenses (see ATTRIBUTION.md).

## Support

For issues or questions, create an issue in the GitHub repository.
