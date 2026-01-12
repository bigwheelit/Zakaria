# Deployment Guide

This guide covers deploying the Quran Coaching Platform to GitHub Pages (frontend) and Supabase (backend).

## Prerequisites

- GitHub account
- Supabase account (free tier)
- Node.js and npm installed locally

---

## Part 1: Supabase Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in:
   - Name: `quran-coaching`
   - Database Password: (save this securely)
   - Region: Choose closest to your location
4. Click "Create new project" and wait for setup to complete

### 2. Run Database Migration

1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL editor
5. Click "Run" to execute the migration
6. Verify tables were created:
   - Go to **Table Editor**
   - You should see: `profiles`, `availability_rules`, `bookings`, `messages`

### 3. Get API Credentials

1. Go to **Project Settings** > **API**
2. Copy the following values:
   - Project URL (something like `https://abcdefgh.supabase.co`)
   - `anon` `public` key (long string starting with `eyJ...`)
3. Save these for later

### 4. Create Tutor Account

1. Open the application locally or after deployment
2. Sign up with your tutor email
3. Go back to Supabase Dashboard > **Authentication** > **Users**
4. Find your new user and copy the `id` (UUID)
5. Go to **SQL Editor** and run:

```sql
UPDATE profiles SET role = 'tutor' WHERE id = 'YOUR_USER_ID_HERE';
```

6. Refresh your app - you should now see "Admin" in the navigation

---

## Part 2: GitHub Pages Deployment

### 1. Prepare Repository

1. Create a new GitHub repository named `quran-coaching`
2. Initialize git in your local project:

```bash
cd quran-coaching
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/quran-coaching.git
git push -u origin main
```

### 2. Configure Environment Variables

**Important**: For GitHub Pages, you need to build with your Supabase credentials.

1. Create `.env.production` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

2. **Add `.env.production` to `.gitignore`** - Never commit credentials!

3. Alternatively, use GitHub Secrets (recommended):
   - Go to your GitHub repo > Settings > Secrets and variables > Actions
   - Add secrets:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

### 3. Update Vite Config

Ensure `vite.config.ts` has the correct base path. If your repo is named `quran-coaching`:

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/quran-coaching/', // matches repo name
  // ...
})
```

### 4. Build the Project

```bash
npm run build
```

This creates a `dist/` folder with your production build.

### 5. Deploy to GitHub Pages

**Option A: Using gh-pages package**

1. Install gh-pages:

```bash
npm install --save-dev gh-pages
```

2. Add deploy script to `package.json`:

```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

3. Deploy:

```bash
npm run deploy
```

**Option B: Manual deployment**

1. Push the `dist` folder to a `gh-pages` branch:

```bash
git subtree push --prefix dist origin gh-pages
```

**Option C: GitHub Actions (automated)**

1. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
        run: npm run build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

2. Push to main branch to trigger deployment

### 6. Enable GitHub Pages

1. Go to your GitHub repo > Settings > Pages
2. Source: Deploy from a branch
3. Branch: `gh-pages` / `root`
4. Click Save

Your site will be available at: `https://YOUR_USERNAME.github.io/quran-coaching/`

---

## Part 3: Post-Deployment

### 1. Test the Application

1. Visit your deployed URL
2. Test signup/login
3. Create a student account and test booking flow
4. Login as tutor and test admin panel

### 2. Download and Add Images

1. Follow instructions in `public/ATTRIBUTION.md`
2. Download all 9 images from Pexels and Unsplash
3. Place them in `public/images/` directory
4. Rebuild and redeploy

### 3. Configure Tutor Availability

1. Login as tutor
2. Go to Admin > Availability
3. Add your weekly availability schedule
4. Set meeting links (Zoom, Google Meet, etc.)

---

## Troubleshooting

### Routing Issues

If you get 404 errors on refresh:
- ✅ You're using HashRouter (`#/`) which works on GitHub Pages
- Ensure `vite.config.ts` has correct `base` path
- Routes should look like: `https://username.github.io/quran-coaching/#/dashboard`

### Database Connection Issues

- Verify environment variables are set correctly
- Check Supabase project is active (not paused)
- Verify RLS policies are enabled
- Check browser console for CORS errors

### Images Not Loading

- Ensure images are in `public/images/` directory
- Check file names match exactly (case-sensitive)
- Verify images were copied to `dist` folder after build

### Authentication Issues

- Clear browser cache and cookies
- Check Supabase Auth settings
- Verify `site_url` in Supabase Auth settings includes your GitHub Pages URL
-

 Add your GitHub Pages URL to "Redirect URLs" in Supabase Auth settings

---

## Production Readiness Checklist

- [ ] Database migration executed successfully
- [ ] RLS policies tested (students only see their data)
- [ ] Tutor account created and role set
- [ ] All 9 images downloaded and placed correctly
- [ ] Environment variables configured (no hardcoded secrets)
- [ ] Application built successfully (`npm run build`)
- [ ] Deployed to GitHub Pages
- [ ] Tested signup/login flow
- [ ] Tested booking creation and cancellation
- [ ] Tested messaging (send and receive)
- [ ] Tutor can mark sessions complete/no-show
- [ ] Session counter increments correctly
- [ ] 101 session limit enforced
- [ ] 24-hour cancellation policy enforced
- [ ] Responsive design works on mobile
- [ ] No console errors in production

---

## Updating the Application

1. Make changes locally
2. Test thoroughly
3. Commit and push to `main` branch
4. If using GitHub Actions, deployment is automatic
5. If using manual deploy, run `npm run deploy`

---

## Custom Domain (Optional)

To use a custom domain:

1. Buy a domain from a registrar
2. In GitHub repo Settings > Pages, add custom domain
3. Configure DNS records (CNAME pointing to `username.github.io`)
4. Wait for DNS propagation (up to 24 hours)
5. Enable HTTPS in GitHub Pages settings

---

## Support & Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Vite Documentation](https://vitejs.dev)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [React Router Documentation](https://reactrouter.com)

For project-specific issues, check the GitHub Issues page.
